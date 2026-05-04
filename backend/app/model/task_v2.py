"""
Extended Task Model for v2 (with column_id, due_date, assignments)
"""
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Date, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id", ondelete="CASCADE"), nullable=False, index=True)
    column_id = Column(Integer, ForeignKey("columns.id", ondelete="RESTRICT"), nullable=False, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="todo", nullable=False, index=True)
    position = Column(Integer, default=0, nullable=False)
    due_date = Column(Date, nullable=True, index=True)
    is_archived = Column(Boolean, default=False, nullable=False)
    cover_image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    board = relationship("Board", back_populates="tasks")
    column = relationship("Column", back_populates="tasks")
    task_assignments = relationship("TaskAssignment", back_populates="task", cascade="all, delete-orphan")
    card_labels = relationship("CardLabel", back_populates="task", cascade="all, delete-orphan")
    checklists = relationship("Checklist", back_populates="task", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="task", cascade="all, delete-orphan")
    attachments = relationship("Attachment", back_populates="task", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="task", cascade="all, delete-orphan")

    def get_assignees(self):
        """Get list of assigned users"""
        return [ta.user for ta in self.task_assignments]

    def get_labels(self):
        """Get list of assigned labels"""
        return [cl.label for cl in self.card_labels]

    def get_comment_count(self):
        """Get count of comments"""
        return len(self.comments)
