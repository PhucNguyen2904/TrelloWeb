import secrets
import bcrypt
import smtplib
import os
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy.orm import Session
from sqlalchemy import and_
import uuid
import logging

from app.model.email_otp_token import EmailOTPToken

logger = logging.getLogger(__name__)


class OTPService:
    """Service for OTP generation, verification, and email sending"""
    
    OTP_LENGTH = 6
    OTP_EXPIRE_MINUTES = int(os.getenv("OTP_EXPIRE_MINUTES", "5"))
    OTP_MAX_ATTEMPTS = int(os.getenv("OTP_MAX_ATTEMPTS", "3"))
    OTP_RATE_LIMIT_PER_HOUR = int(os.getenv("OTP_RATE_LIMIT_PER_HOUR", "5"))

    @staticmethod
    def generate_otp() -> str:
        """Generate a 6-digit OTP using secrets module"""
        return ''.join([str(secrets.randbelow(10)) for _ in range(OTPService.OTP_LENGTH)])

    @staticmethod
    def hash_otp(otp_code: str) -> str:
        """Hash OTP code using bcrypt"""
        return bcrypt.hashpw(otp_code.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    @staticmethod
    def verify_otp(plain_otp: str, hashed_otp: str) -> bool:
        """Verify OTP against hashed version (constant-time comparison)"""
        try:
            return bcrypt.checkpw(plain_otp.encode('utf-8'), hashed_otp.encode('utf-8'))
        except Exception as e:
            logger.error(f"Error verifying OTP: {e}")
            return False

    @staticmethod
    def send_otp_email(email: str, otp_code: str) -> bool:
        """Send OTP via email using SMTP"""
        try:
            smtp_host = os.getenv("SMTP_HOST")
            smtp_port = int(os.getenv("SMTP_PORT", "587"))
            smtp_user = os.getenv("SMTP_USER")
            smtp_password = os.getenv("SMTP_PASSWORD")
            email_from = os.getenv("EMAIL_FROM", smtp_user)
            email_from_name = os.getenv("EMAIL_FROM_NAME", "TrelloWeb")

            if not all([smtp_host, smtp_user, smtp_password]):
                logger.warning("SMTP configuration incomplete, skipping email send")
                return True  # Return True to allow development without email

            subject = "Your OTP Code for TrelloWeb"
            
            html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 500px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }}
        .card {{ background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
        .header {{ text-align: center; margin-bottom: 30px; }}
        .header h1 {{ color: #0079bf; margin: 0; font-size: 24px; }}
        .otp-container {{ background-color: #f0f0f0; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }}
        .otp-code {{ 
            font-size: 36px; 
            font-weight: bold; 
            color: #0079bf; 
            letter-spacing: 8px; 
            font-family: 'Courier New', monospace;
            margin: 0;
        }}
        .expiry {{ color: #666; font-size: 14px; margin-top: 15px; }}
        .warning {{ 
            background-color: #fff3cd; 
            border-left: 4px solid #ffc107; 
            padding: 12px; 
            margin: 20px 0; 
            border-radius: 4px;
            font-size: 13px;
        }}
        .footer {{ text-align: center; color: #999; font-size: 12px; margin-top: 20px; }}
        .button {{ 
            display: inline-block; 
            background-color: #0079bf; 
            color: white; 
            padding: 12px 24px; 
            border-radius: 4px; 
            text-decoration: none; 
            margin-top: 10px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <h1>🔐 Your OTP Code</h1>
            </div>
            
            <p>Hello,</p>
            <p>You requested to log in to your TrelloWeb account. Use the code below to complete your login:</p>
            
            <div class="otp-container">
                <p class="otp-code">{otp_code}</p>
                <p class="expiry">⏱️ This code expires in 5 minutes</p>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you did not request this code, please ignore this email. Do not share this code with anyone.
            </div>
            
            <p style="color: #666; font-size: 13px;">
                <strong>Need help?</strong> If you're having trouble, contact our support team.
            </p>
            
            <div class="footer">
                <p>© 2026 TrelloWeb. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
            """

            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{email_from_name} <{email_from}>"
            msg['To'] = email
            msg.attach(MIMEText(html_content, 'html'))

            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.send_message(msg)

            logger.info(f"OTP email sent successfully to {email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send OTP email: {e}")
            raise

    @staticmethod
    def check_rate_limit(db: Session, email: str) -> tuple[bool, int]:
        """Check if email has exceeded rate limit (5 requests per hour)"""
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        
        count = db.query(EmailOTPToken).filter(
            and_(
                EmailOTPToken.email == email,
                EmailOTPToken.created_at >= one_hour_ago
            )
        ).count()
        
        is_limited = count >= OTPService.OTP_RATE_LIMIT_PER_HOUR
        remaining = max(0, OTPService.OTP_RATE_LIMIT_PER_HOUR - count)
        
        return is_limited, remaining

    @staticmethod
    def cleanup_old_otp(db: Session, email: str) -> None:
        """Delete old unused OTP tokens for the same email"""
        db.query(EmailOTPToken).filter(
            and_(
                EmailOTPToken.email == email,
                EmailOTPToken.is_used == False
            )
        ).delete(synchronize_session=False)
        db.commit()

    @staticmethod
    def create_otp_token(
        db: Session,
        email: str,
        user_id: int | None = None,
        ip_address: str | None = None
    ) -> tuple:
        """Create and save new OTP token. Returns (token_object, otp_code)"""
        OTPService.cleanup_old_otp(db, email)
        
        otp_code = OTPService.generate_otp()
        hashed_otp = OTPService.hash_otp(otp_code)
        
        token = EmailOTPToken(
            id=str(uuid.uuid4()),
            user_id=user_id,
            email=email,
            otp_code=hashed_otp,
            expires_at=datetime.utcnow() + timedelta(minutes=OTPService.OTP_EXPIRE_MINUTES),
            is_used=False,
            attempt_count=0,
            ip_address=ip_address
        )
        
        db.add(token)
        db.commit()
        db.refresh(token)
        
        logger.info(f"OTP token created for {email} (ID: {token.id})")
        
        return token, otp_code

    @staticmethod
    def get_valid_otp_token(
        db: Session,
        email: str
    ) -> EmailOTPToken | None:
        """Get valid (unused and non-expired) OTP token for email"""
        token = db.query(EmailOTPToken).filter(
            and_(
                EmailOTPToken.email == email,
                EmailOTPToken.is_used == False,
                EmailOTPToken.expires_at > datetime.utcnow()
            )
        ).order_by(EmailOTPToken.created_at.desc()).first()
        
        return token

    @staticmethod
    def verify_and_invalidate_otp(
        db: Session,
        email: str,
        otp_code: str
    ) -> tuple[bool, EmailOTPToken | None]:
        """Verify OTP code and mark as used if correct"""
        token = OTPService.get_valid_otp_token(db, email)
        
        if not token:
            return False, None
        
        # Check if max attempts exceeded
        if token.attempt_count >= OTPService.OTP_MAX_ATTEMPTS:
            logger.warning(f"OTP token {token.id} has exceeded max attempts")
            return False, None
        
        # Verify OTP
        if OTPService.verify_otp(otp_code, token.otp_code):
            token.is_used = True
            db.commit()
            db.refresh(token)
            logger.info(f"OTP token {token.id} verified and invalidated")
            return True, token
        else:
            # Increment attempt count
            token.attempt_count += 1
            if token.attempt_count >= OTPService.OTP_MAX_ATTEMPTS:
                token.is_used = True  # Invalidate after max attempts
                logger.warning(f"OTP token {token.id} invalidated after {token.attempt_count} failed attempts")
            db.commit()
            db.refresh(token)
            return False, token
