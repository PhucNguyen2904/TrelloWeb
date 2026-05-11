from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class BoardBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Board name")
    color: Optional[str] = Field("navyBlue", description="Board background color key")
    gradient: Optional[str] = Field(None, description="CSS gradient string")


class BoardCreate(BoardBase):
    pass


class BoardUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255, description="Board name")
    color: Optional[str] = Field(None, description="Board background color key")
    gradient: Optional[str] = Field(None, description="CSS gradient string")


class BoardResponse(BoardBase):
    id: int
    color: str
    gradient: Optional[str]
    owner_id: int
    last_viewed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BoardInvite(BaseModel):
    email: str


class BoardMemberResponse(BaseModel):
    id: int
    user_id: int
    role: str
    email: str

    class Config:
        from_attributes = True
