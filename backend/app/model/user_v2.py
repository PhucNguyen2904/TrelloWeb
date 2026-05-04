"""
Extended User Model for v2 (with profile fields)
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    avatar_color = Column(String(7), default="#0079bf", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=True)

    # Relationships
    role = relationship("Role", back_populates="users")
    boards = relationship("Board", back_populates="owner", cascade="all, delete-orphan")
    board_memberships = relationship("BoardMember", back_populates="user", cascade="all, delete-orphan")
    task_assignments = relationship("TaskAssignment", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    attachments = relationship("Attachment", back_populates="uploaded_by")

    def get_full_name(self):
        """Return user's full name"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        elif self.last_name:
            return self.last_name
        else:
            return self.email.split('@')[0]

    def get_initials(self):
        """Return user's initials for avatar"""
        first = self.first_name[0].upper() if self.first_name else ""
        last = self.last_name[0].upper() if self.last_name else ""
        return (first + last)[:2] if first or last else self.email[0].upper()
