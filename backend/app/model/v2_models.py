"""
New Models for v2 - Supporting Features
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text, Date, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base


class Column(Base):
    """Kanban Column - replaces simple status field"""
    __tablename__ = "columns"

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    position = Column(Integer, nullable=False)
    color = Column(String(7), default="#e2e8f0", nullable=False)
    is_archived = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    board = relationship("Board", back_populates="columns")
    tasks = relationship("Task", back_populates="column")


class Label(Base):
    """Task Label/Tag for categorization"""
    __tablename__ = "labels"

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    color = Column(String(7), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    board = relationship("Board", back_populates="labels")
    card_labels = relationship("CardLabel", back_populates="label", cascade="all, delete-orphan")


class CardLabel(Base):
    """Junction table for Task-Label relationship"""
    __tablename__ = "card_labels"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    label_id = Column(Integer, ForeignKey("labels.id", ondelete="CASCADE"), nullable=False, index=True)

    # Relationships
    task = relationship("Task", back_populates="card_labels")
    label = relationship("Label", back_populates="card_labels")


class BoardMember(Base):
    """Board team member with role"""
    __tablename__ = "board_members"

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(50), default="member", nullable=False)  # owner, admin, member, observer
    joined_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    board = relationship("Board", back_populates="board_members")
    user = relationship("User", back_populates="board_memberships")


class TaskAssignment(Base):
    """Task assignment to team member"""
    __tablename__ = "task_assignments"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    assigned_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    task = relationship("Task", back_populates="task_assignments")
    user = relationship("User", back_populates="task_assignments")


class Checklist(Base):
    """Checklist group within a task"""
    __tablename__ = "checklists"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    task = relationship("Task", back_populates="checklists")
    items = relationship("ChecklistItem", back_populates="checklist", cascade="all, delete-orphan")


class ChecklistItem(Base):
    """Individual item in a checklist"""
    __tablename__ = "checklist_items"

    id = Column(Integer, primary_key=True, index=True)
    checklist_id = Column(Integer, ForeignKey("checklists.id", ondelete="CASCADE"), nullable=False, index=True)
    text = Column(String(500), nullable=False)
    completed = Column(Boolean, default=False, nullable=False, index=True)
    position = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    checklist = relationship("Checklist", back_populates="items")


class Comment(Base):
    """Comment on a task"""
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    task = relationship("Task", back_populates="comments")
    user = relationship("User", back_populates="comments")


class Attachment(Base):
    """File attachment to a task"""
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=True)
    file_type = Column(String(100), nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    task = relationship("Task", back_populates="attachments")
    uploaded_by_user = relationship("User", back_populates="attachments", foreign_keys=[uploaded_by])


class ActivityLog(Base):
    """Activity log for audit trail"""
    __tablename__ = "activity_log"

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id", ondelete="CASCADE"), nullable=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(String(100), nullable=False)  # created, updated, moved, deleted, etc.
    entity_type = Column(String(50), nullable=False)  # board, task, comment, etc.
    changes = Column(JSONB, nullable=True)  # JSON object with before/after values
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    board = relationship("Board", back_populates="activity_logs")
    task = relationship("Task", back_populates="activity_logs")
