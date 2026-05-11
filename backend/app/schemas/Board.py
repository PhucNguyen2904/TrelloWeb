from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class BoardBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Board name")
    color: Optional[str] = Field("#3B82F6", description="Board background color (hex)")


class BoardCreate(BoardBase):
    pass


class BoardUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255, description="Board name")
    color: Optional[str] = Field(None, description="Board background color (hex)")


class BoardResponse(BoardBase):
    id: int
    color: str
    owner_id: int
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
