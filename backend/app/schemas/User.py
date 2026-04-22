from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.schemas.Role import RoleResponse


class UserBase(BaseModel):
    email: EmailStr = Field(..., description="User email")


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="User password (min 6 chars)")


class UserUpdate(BaseModel):
    password: Optional[str] = Field(None, min_length=6, description="New password")


class UserCreateByAdmin(UserBase):
    password: str = Field(..., min_length=6, description="User password (min 6 chars)")
    role_id: Optional[int] = Field(None, description="Role ID for the user")


class UserRoleUpdate(BaseModel):
    role_id: int = Field(..., description="Role ID to assign to user")


class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    role: Optional[RoleResponse] = None

    class Config:
        from_attributes = True


class UserResponseWithoutPassword(UserResponse):
    """User response without password field"""
    pass