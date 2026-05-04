"""
seed_superadmin.py
==================
Seeds the database with:
  - A superadmin user (superadmin@projectflow.io / SuperAdmin2024!)
  - Ensures all standard roles exist (superadmin, admin, user, guest)
  - Optionally adds extra demo users for testing the user management panel

Usage:
    python seed_superadmin.py                        # local DB
    python seed_superadmin.py env staging            # staging DB
    python seed_superadmin.py env prod               # prod DB
    python seed_superadmin.py env local pw MyPass    # custom password
"""
import sys
import os
from pathlib import Path
from datetime import datetime

# ── CLI args ────────────────────────────────────────────────────────────────
env_name = "local"
sa_password = "SuperAdmin2024!"

for i, arg in enumerate(sys.argv):
    if arg == "env" and i + 1 < len(sys.argv):
        env_name = sys.argv[i + 1]
    if arg == "pw" and i + 1 < len(sys.argv):
        sa_password = sys.argv[i + 1]

APP_DIR = Path(__file__).parent / "app"
env_path = APP_DIR / f".env.{env_name}"
print(f"[seed] Loading env from: {env_path}")

from dotenv import load_dotenv
load_dotenv(env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set in env file"); sys.exit(1)

print(f"[seed] Connecting to DB: {DATABASE_URL[:60]}...")

import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

engine = create_engine(DATABASE_URL)

# ── Standard roles ───────────────────────────────────────────────────────────
STANDARD_ROLES = [
    {"name": "superadmin", "description": "Full platform control – system administrator"},
    {"name": "admin",      "description": "Board administrator with elevated permissions"},
    {"name": "user",       "description": "Regular user – can create and manage own boards"},
    {"name": "guest",      "description": "Read-only access to shared boards"},
]

# ── Demo users (extra accounts for testing user management) ──────────────────
DEMO_USERS = [
    {"email": "superadmin@projectflow.io", "role": "superadmin", "pw": sa_password},
    {"email": "admin@projectflow.io",      "role": "admin",      "pw": "Admin2024!"},
    {"email": "alice@example.com",         "role": "user",       "pw": "User2024!"},
    {"email": "bob@example.com",           "role": "user",       "pw": "User2024!"},
    {"email": "carol@example.com",         "role": "user",       "pw": "User2024!"},
    {"email": "dave@example.com",          "role": "user",       "pw": "User2024!"},
    {"email": "eve@example.com",           "role": "guest",      "pw": "User2024!"},
    {"email": "frank@example.com",         "role": "guest",      "pw": "User2024!"},
]

with Session(engine) as db:
    print("\n[seed] -- Ensuring roles exist --")
    role_ids: dict[str, int] = {}
    for role_def in STANDARD_ROLES:
        row = db.execute(
            text("SELECT id FROM roles WHERE name = :n"),
            {"n": role_def["name"]},
        ).fetchone()
        if row:
            role_ids[role_def["name"]] = row[0]
            print(f"  [skip] role '{role_def['name']}' already exists (id={row[0]})")
        else:
            result = db.execute(
                text(
                    "INSERT INTO roles (name, description) VALUES (:n, :d) RETURNING id"
                ),
                {"n": role_def["name"], "d": role_def["description"]},
            )
            rid = result.fetchone()[0]
            role_ids[role_def["name"]] = rid
            print(f"  [+] Created role '{role_def['name']}' (id={rid})")

    db.commit()

    print("\n[seed] -- Seeding demo users --")
    for user_def in DEMO_USERS:
        existing = db.execute(
            text("SELECT id, email FROM users WHERE email = :e"),
            {"e": user_def["email"]},
        ).fetchone()
        role_id = role_ids.get(user_def["role"])
        if existing:
            # Update role to make sure it's correct
            db.execute(
                text("UPDATE users SET role_id = :rid WHERE id = :id"),
                {"rid": role_id, "id": existing[0]},
            )
            print(f"  [upd] {user_def['email']} => role '{user_def['role']}' confirmed")
        else:
            hashed = hash_password(user_def["pw"])
            db.execute(
                text(
                    """
                    INSERT INTO users (email, hashed_password, role_id, created_at, updated_at)
                    VALUES (:e, :h, :rid, :now, :now)
                    """
                ),
                {
                    "e": user_def["email"],
                    "h": hashed,
                    "rid": role_id,
                    "now": datetime.utcnow(),
                },
            )
            print(f"  [+]   Created {user_def['email']} with role '{user_def['role']}'")

    db.commit()

print("\n[seed] ===================================================")
print("[seed] Seed complete! Login credentials:")
print("[seed]   Super Admin : superadmin@projectflow.io")
print(f"[seed]   Password    : {sa_password}")
print("[seed]   Admin       : admin@projectflow.io / Admin2024!")
print("[seed]   Users       : alice/bob/carol/dave@example.com / User2024!")
print("[seed] ===================================================")
