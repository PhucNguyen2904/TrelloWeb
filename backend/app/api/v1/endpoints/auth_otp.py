from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import timedelta

from app.db.session import get_db
from app.schemas.OTP import (
    OTPRequestSchema,
    OTPVerifySchema,
    OTPResponseSchema,
    TokenResponseSchema
)
from app.services.otp_service import OTPService
from app.crud.user import get_user_by_email
from app.core.security import create_access_token
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth/otp", tags=["auth-otp"])


@router.post("/request", response_model=OTPResponseSchema)
async def request_otp(
    request_data: OTPRequestSchema,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Request OTP code via email
    
    - Always returns 200 even if email doesn't exist (prevents email enumeration)
    - Rate limited to 5 requests per hour per email
    - Previous unused OTP for same email are cleaned up
    """
    email = request_data.email.lower().strip()
    ip_address = request.client.host if request.client else None

    # Check rate limit
    is_limited, remaining = OTPService.check_rate_limit(db, email)
    if is_limited:
        logger.warning(f"Rate limit exceeded for {email} from {ip_address}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many requests. Try again in 1 hour."
        )

    # Check if user exists (but don't reveal this info)
    user = get_user_by_email(db, email)
    
    # Create OTP token
    try:
        token, otp_code = OTPService.create_otp_token(
            db=db,
            email=email,
            user_id=user.id if user else None,
            ip_address=ip_address
        )
        
        # Log OTP to console for easy development/testing
        logger.info(f"🚀 [DEBUG] OTP for {email}: {otp_code}")
        
        # Send OTP email - wrapped in try/except to not block login if SMTP fails
        try:
            OTPService.send_otp_email(email, otp_code)
        except Exception as email_err:
            logger.warning(f"⚠️ Could not send email, but you can use the OTP from logs above: {email_err}")
        
        logger.info(f"OTP requested for {email}")
        
    except Exception as e:
        logger.error(f"Error creating OTP: {e}")
        # Still return 200 to not reveal email existence
        pass

    return OTPResponseSchema(
        message="If this email exists in our system, you will receive an OTP code shortly",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post("/verify", response_model=TokenResponseSchema)
async def verify_otp(
    request_data: OTPVerifySchema,
    db: Session = Depends(get_db)
):
    """
    Verify OTP code and return JWT token
    
    - Validates OTP format and value
    - Checks for expiration and previous use
    - Enforces max 3 failed attempts
    - Returns JWT token on success
    """
    email = request_data.email.lower().strip()
    otp_code = request_data.otp_code.strip()

    # Verify OTP and get token
    is_valid, token = OTPService.verify_and_invalidate_otp(db, email, otp_code)

    if not is_valid:
        remaining_attempts = OTPService.OTP_MAX_ATTEMPTS - (token.attempt_count if token else 0)
        
        if token and token.attempt_count >= OTPService.OTP_MAX_ATTEMPTS:
            logger.warning(f"Max OTP attempts exceeded for {email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Too many failed attempts. Please request a new OTP."
            )
        
        logger.warning(f"Invalid OTP for {email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid OTP code. {remaining_attempts} attempts remaining."
        )

    # Get user
    user = get_user_by_email(db, email)
    if not user:
        logger.error(f"User not found for verified OTP: {email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found"
        )

    # Create JWT token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )

    logger.info(f"User {user.id} ({email}) authenticated via OTP")

    return TokenResponseSchema(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
