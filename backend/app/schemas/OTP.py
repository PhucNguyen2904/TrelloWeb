from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class OTPRequestSchema(BaseModel):
    """Request OTP code via email"""
    email: EmailStr = Field(..., description="Email address to send OTP to")


class OTPVerifySchema(BaseModel):
    """Verify OTP code"""
    email: EmailStr = Field(..., description="Email address")
    otp_code: str = Field(..., min_length=6, max_length=6, description="6-digit OTP code")


class OTPResponseSchema(BaseModel):
    """OTP request response"""
    message: str = Field(..., description="Response message")
    expires_in: int = Field(..., description="OTP expiration time in seconds")


class TokenResponseSchema(BaseModel):
    """Login response with token"""
    access_token: str
    token_type: str
    user_id: int
    email: str
    expires_in: int = Field(default=900, description="Token expiration in seconds")
