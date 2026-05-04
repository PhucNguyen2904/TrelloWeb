"""
db_debug.py — Run locally to inspect and fix users in the active DB.
Usage:
  python db_debug.py                        # list all users
  python db_debug.py reset <email> <newpw>  # force-reset a user's password
  python db_debug.py env prod               # use .env.prod instead of .env.staging
"""
import sys
import os
from pathlib import Path

# --- Load env file ---
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

# --- Connect ---
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

engine = create_engine(DATABASE_URL)

with Session(engine) as db:
    # List all users
    rows = db.execute(text("SELECT id, email, hashed_password, role_id FROM users ORDER BY id")).fetchall()
    print(f"\n{'ID':<5} {'EMAIL':<35} {'HASH TYPE':<10} {'ROLE'}")
    print("-" * 65)
    for row in rows:
        uid, email, hp, role_id = row
        if hp and hp.startswith(("$2a$", "$2b$", "$2y$")):
            hash_type = "bcrypt"
        elif hp and hp.startswith("$argon2"):
            hash_type = "argon2"
        else:
            hash_type = "unknown"
        print(f"{uid:<5} {email:<35} {hash_type:<10} role={role_id}")

    print(f"\nTotal: {len(rows)} users")

    # --- Optional: reset a password ---
    if "reset" in sys.argv:
        idx = sys.argv.index("reset")
        if idx + 2 >= len(sys.argv):
            print("Usage: python db_debug.py reset <email> <new_password>")
            sys.exit(1)
        target_email = sys.argv[idx + 1]
        new_password = sys.argv[idx + 2]

        import sys as _sys
        _sys.path.insert(0, str(Path(__file__).parent))
        from app.core.security import hash_password

        new_hash = hash_password(new_password)
        result = db.execute(
            text("UPDATE users SET hashed_password = :h WHERE email = :e"),
            {"h": new_hash, "e": target_email}
        )
        db.commit()
        if result.rowcount:
            print(f"\n✅ Password reset for {target_email} → '{new_password}' (argon2)")
        else:
            print(f"\n❌ User '{target_email}' not found in this database.")
