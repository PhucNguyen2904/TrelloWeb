"""
reset_passwords_by_role.py
Resets passwords based on user role.
  superadmin → superadmin123
  admin      → admin123
  user/other → password123

Usage:
  python reset_passwords_by_role.py           # staging DB
  python reset_passwords_by_role.py env prod  # prod DB
"""
import sys
import os
from pathlib import Path

env_name = "staging"
for i, arg in enumerate(sys.argv):
    if arg == "env" and i + 1 < len(sys.argv):
        env_name = sys.argv[i + 1]

APP_DIR = Path(__file__).parent / "app"
env_path = APP_DIR / f".env.{env_name}"
print(f"Loading: {env_path}")

from dotenv import load_dotenv
load_dotenv(env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set"); sys.exit(1)

print(f"DB: {DATABASE_URL[:60]}...")

sys.path.insert(0, str(Path(__file__).parent))
from app.core.security import hash_password

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

ROLE_PASSWORDS = {
    "super_admin":  "superadmin123",
    "superadmin":   "superadmin123",
    "admin":        "admin123",
}
DEFAULT_PASSWORD = "password123"

engine = create_engine(DATABASE_URL)

with Session(engine) as db:
    rows = db.execute(text("""
        SELECT u.id, u.email, r.name as role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        ORDER BY u.id
    """)).fetchall()

    print(f"\nResetting {len(rows)} users...\n")
    print(f"{'EMAIL':<35} {'ROLE':<15} {'PASSWORD'}")
    print("-" * 70)

    for uid, email, role_name in rows:
        pw = ROLE_PASSWORDS.get(role_name, DEFAULT_PASSWORD)
        db.execute(
            text("UPDATE users SET hashed_password = :h WHERE id = :id"),
            {"h": hash_password(pw), "id": uid}
        )
        print(f"{email:<35} {(role_name or 'unknown'):<15} {pw}")

    db.commit()
    print("\nAll passwords reset successfully.")
