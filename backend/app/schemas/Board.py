from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class BoardBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Board name")


class BoardCreate(BoardBase):
    pass


class BoardUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255, description="Board name")


class BoardResponse(BoardBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
