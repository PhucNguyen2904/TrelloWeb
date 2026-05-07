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
from app.infrastructure.cache import cache_response, cache_service
from app.crud.board import get_user_boards
from app.schemas.User import UserResponse
from app.schemas.Board import BoardResponse

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
    
    # --- REDIS CACHE LOGIC (AS REQUESTED) ---
    try:
        # 1. Cache Profile Data
        profile_key = f"user:profile:{user.id}"
        # Convert to dict for JSON serialization
        profile_data = {
            "id": user.id,
            "email": user.email,
            "username": getattr(user, 'username', ''),
            "role": getattr(user.role, 'name', 'user') if hasattr(user, 'role') else 'user'
        }
        await cache_service.set(profile_key, profile_data, ttl=3600)
        
        # 2. Cache Boards Data
        boards_key = f"user:boards:{user.id}"
        boards = get_user_boards(db, user.id)
        # Convert SQLAlchemy objects to list of dicts
        boards_data = [
            {
                "id": b.id, 
                "title": b.title, 
                "background_color": b.background_color,
                "owner_id": b.owner_id
            } for b in boards
        ]
        await cache_service.set(boards_key, boards_data, ttl=3600)
        
    except Exception as e:
        # Don't fail login if cache fails, but log it
        print(f"⚠️ Redis Caching failed during login: {str(e)}")

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