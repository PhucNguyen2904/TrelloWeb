"""
reset_all_passwords.py
Resets ALL users in the active DB to a known password.
Usage:
  python reset_all_passwords.py                      # staging DB, new pw = "TrelloReset2024!"
  python reset_all_passwords.py env prod             # prod DB
  python reset_all_passwords.py pw MyNewPassword123  # custom password
"""
import sys
import os
from pathlib import Path

env_name = "staging"
new_password = "TrelloReset2024!"

for i, arg in enumerate(sys.argv):
    if arg == "env" and i + 1 < len(sys.argv):
        env_name = sys.argv[i + 1]
    if arg == "pw" and i + 1 < len(sys.argv):
        new_password = sys.argv[i + 1]

APP_DIR = Path(__file__).parent / "app"
env_path = APP_DIR / f".env.{env_name}"
print(f"Loading: {env_path}")

from dotenv import load_dotenv
load_dotenv(env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set"); sys.exit(1)

print(f"DB: {DATABASE_URL[:60]}...")
print(f"New password: {new_password}")

sys.path.insert(0, str(Path(__file__).parent))
from app.core.security import hash_password

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

engine = create_engine(DATABASE_URL)
new_hash = hash_password(new_password)

with Session(engine) as db:
    rows = db.execute(text("SELECT id, email FROM users ORDER BY id")).fetchall()
    print(f"\nResetting {len(rows)} users...")
    for uid, email in rows:
        db.execute(
            text("UPDATE users SET hashed_password = :h WHERE id = :id"),
            {"h": new_hash, "id": uid}
        )
        print(f"  [OK] {email}")
    db.commit()
    print(f"\nDone. All users can now login with password: '{new_password}'")
    print("Tell users to change their password after logging in.")
