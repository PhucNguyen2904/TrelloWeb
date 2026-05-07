from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.db.session import get_db
from app.model.user import User
from app.schemas.User import UserCreate, UserResponse
from app.crud.user import create_user, get_user_by_email, authenticate_user
from app.core.security import create_access_token, create_refresh_token
from app.core.config import settings
from app.deps.auth import get_current_user
from app.infrastructure.cache import cache_response

router = APIRouter(prefix="/api/auth", tags=["auth"])


class Token:
    """Token response"""
    def __init__(self, access_token: str, token_type: str):
        self.access_token = access_token
        self.token_type = token_type


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    # Check if user already exists
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user = create_user(db, user_data)
    return user


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login user and get JWT tokens"""
    # Authenticate user
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh")
async def refresh_token(refresh_token: str):
    """Refresh access token using refresh token"""
    from app.core.security import decode_token
    from app.core.redis import is_token_revoked, revoke_token
    from datetime import datetime

    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    jti = payload.get("jti")
    if await is_token_revoked(jti):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked"
        )
    
    user_id = payload.get("sub")
    
    # Rotate: Revoke old one and issue new pair
    exp = payload.get("exp")
    now = datetime.utcnow().timestamp()
    ttl = int(exp - now) if exp > now else 0
    if ttl > 0:
        await revoke_token(jti, ttl)
    
    new_access_token = create_access_token(data={"sub": user_id})
    new_refresh_token = create_refresh_token(data={"sub": user_id})
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UserResponse)
@cache_response(ttl=3600)
async def get_current_user_info(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """Get current authenticated user information"""
    return current_user