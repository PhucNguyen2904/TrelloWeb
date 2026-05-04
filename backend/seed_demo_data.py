"""
Seed demo boards and tasks for existing users in the database.
Compatible with the current simple schema (boards: id, name, owner_id | tasks: id, title, description, status, board_id)

Usage:
    cd backend
    python seed_demo_data.py
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.model.board import Board
from app.model.task import Task
from app.model.user import User
from datetime import datetime, timezone, timedelta
import random

DEMO_BOARDS = [
    {
        "name": "Product Roadmap Q2 2026",
        "tasks": [
            {"title": "User authentication redesign", "status": "done", "description": "Revamp the login/signup flow with better UX"},
            {"title": "Dashboard analytics module", "status": "doing", "description": "Add charts and metrics to the main dashboard"},
            {"title": "Mobile responsive overhaul", "status": "doing", "description": "Ensure all pages work on mobile devices"},
            {"title": "API rate limiting", "status": "todo", "description": "Implement rate limiting to prevent abuse"},
            {"title": "Dark mode support", "status": "todo", "description": "Add dark/light theme toggle"},
            {"title": "Export to CSV feature", "status": "todo", "description": "Allow users to export board data"},
        ]
    },
    {
        "name": "Sprint 14 — Backend",
        "tasks": [
            {"title": "Fix database connection pooling", "status": "done", "description": "Resolve intermittent connection drops"},
            {"title": "Add pagination to user list endpoint", "status": "done", "description": "Implement cursor-based pagination"},
            {"title": "Write unit tests for auth module", "status": "doing", "description": "Achieve 80% coverage on authentication code"},
            {"title": "Optimize slow queries", "status": "todo", "description": "Profile and fix N+1 query issues"},
            {"title": "Setup Redis caching", "status": "todo", "description": "Cache frequent DB reads with Redis"},
        ]
    },
    {
        "name": "Marketing Campaigns",
        "tasks": [
            {"title": "Design landing page banner", "status": "done", "description": "New hero section for summer campaign"},
            {"title": "Write blog post about new features", "status": "doing", "description": "Highlight Q1 feature releases"},
            {"title": "Social media content calendar", "status": "todo", "description": "Plan posts for May and June"},
            {"title": "Email newsletter draft", "status": "todo", "description": "Monthly update for subscribers"},
        ]
    }
]


def seed_for_user(db, user: User):
    """Create demo boards and tasks for a user if they have none."""
    existing_boards = db.query(Board).filter(Board.owner_id == user.id).count()
    if existing_boards > 0:
        print(f"  ⏭️  User {user.email} already has {existing_boards} board(s), skipping.")
        return 0

    boards_created = 0
    tasks_created = 0
    now = datetime.now(timezone.utc)

    for board_data in DEMO_BOARDS:
        board = Board(
            name=board_data["name"],
            owner_id=user.id,
            created_at=now - timedelta(days=random.randint(5, 30)),
            updated_at=now - timedelta(days=random.randint(0, 4)),
        )
        db.add(board)
        db.flush()  # Get board.id

        for i, task_data in enumerate(board_data["tasks"]):
            offset_days = random.randint(0, 14)
            task = Task(
                title=task_data["title"],
                description=task_data.get("description", ""),
                status=task_data["status"],
                board_id=board.id,
                created_at=now - timedelta(days=offset_days + 1),
                updated_at=now - timedelta(hours=random.randint(1, offset_days * 24 + 1)),
            )
            db.add(task)
            tasks_created += 1

        boards_created += 1

    db.commit()
    print(f"  ✅ Created {boards_created} boards and {tasks_created} tasks for {user.email}")
    return boards_created


def main():
    print("🌱 Starting demo data seed...")
    db = SessionLocal()
    try:
        users = db.query(User).all()
        if not users:
            print("❌ No users found in database. Register at least one user first.")
            return

        print(f"📋 Found {len(users)} user(s)")
        total_boards = 0
        for user in users:
            print(f"\n👤 Processing: {user.email}")
            created = seed_for_user(db, user)
            total_boards += created

        print(f"\n✨ Done! Created {total_boards} new board(s) total.")

    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
