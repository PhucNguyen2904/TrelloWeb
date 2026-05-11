import os
import sys
from pathlib import Path
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from dotenv import load_dotenv

# Load env
env_name = "local"
APP_DIR = Path(__file__).parent / "app"
env_path = APP_DIR / f".env.{env_name}"
load_dotenv(env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set"); sys.exit(1)

engine = create_engine(DATABASE_URL)

PERMISSIONS = [
    {"name": "board:create", "description": "Can create new boards"},
    {"name": "board:edit", "description": "Can edit board settings"},
    {"name": "board:delete", "description": "Can delete boards"},
    {"name": "member:invite", "description": "Can invite members to workspace"},
    {"name": "task:create", "description": "Can create tasks in boards"},
    {"name": "task:edit", "description": "Can edit tasks"},
    {"name": "task:delete", "description": "Can delete tasks"},
    {"name": "comment:create", "description": "Can post comments on tasks"},
    {"name": "admin:access", "description": "Can access admin user management"},
    {"name": "system:full_control", "description": "Full access to platform settings"},
]

ROLE_PERMISSION_MAP = {
    "superadmin": ["system:full_control", "admin:access", "board:create", "board:edit", "board:delete", "member:invite", "task:create", "task:edit", "task:delete", "comment:create"],
    "admin": ["admin:access", "board:create", "board:edit", "member:invite", "task:create", "task:edit", "task:delete", "comment:create"],
    "user": ["board:create", "task:create", "task:edit", "comment:create"],
    "guest": ["comment:create"],
}

with Session(engine) as db:
    print("\n[seed] -- Seeding permissions --")
    perm_ids = {}
    for p_def in PERMISSIONS:
        row = db.execute(
            text("SELECT id FROM permissions WHERE name = :n"),
            {"n": p_def["name"]}
        ).fetchone()
        if row:
            perm_ids[p_def["name"]] = row[0]
            print(f"  [skip] Permission '{p_def['name']}' exists")
        else:
            result = db.execute(
                text("INSERT INTO permissions (name, description) VALUES (:n, :d) RETURNING id"),
                {"n": p_def["name"], "d": p_def["description"]}
            )
            pid = result.fetchone()[0]
            perm_ids[p_def["name"]] = pid
            print(f"  [+] Created permission '{p_def['name']}'")
    
    db.commit()

    print("\n[seed] -- Assigning permissions to roles --")
    for role_name, p_names in ROLE_PERMISSION_MAP.items():
        # Get role ID
        role_row = db.execute(
            text("SELECT id FROM roles WHERE name = :n"),
            {"n": role_name}
        ).fetchone()
        
        if not role_row:
            print(f"  [warn] Role '{role_name}' not found, skipping...")
            continue
            
        role_id = role_row[0]
        
        # Clear existing permissions for this role to avoid duplicates
        db.execute(
            text("DELETE FROM role_permissions WHERE role_id = :rid"),
            {"rid": role_id}
        )
        
        for p_name in p_names:
            p_id = perm_ids.get(p_name)
            if p_id:
                db.execute(
                    text("INSERT INTO role_permissions (role_id, permission_id) VALUES (:rid, :pid)"),
                    {"rid": role_id, "pid": p_id}
                )
        
        print(f"  [ok] Assigned {len(p_names)} permissions to role '{role_name}'")
    
    db.commit()

print("\n[seed] Permission seeding complete!")
