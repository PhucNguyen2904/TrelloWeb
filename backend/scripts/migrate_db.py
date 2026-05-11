
import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).parent.parent / "app" / ".env.local"
load_dotenv(env_path)

DATABASE_URL = os.getenv("DATABASE_URL")

def migrate():
    if not DATABASE_URL:
        print("❌ Error: DATABASE_URL not found in .env.local")
        return

    print(f"🚀 Starting migration on database...")
    engine = create_engine(DATABASE_URL)
    
    commands = [
        # 1. Thêm cột gradient cho bảng boards
        {
            "desc": "Adding 'gradient' column to boards",
            "sql": "ALTER TABLE boards ADD COLUMN IF NOT EXISTS gradient VARCHAR(255)"
        },
        # 2. Thêm cột last_viewed_at cho bảng boards
        {
            "desc": "Adding 'last_viewed_at' column to boards",
            "sql": "ALTER TABLE boards ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
        },
        # 3. Đảm bảo cột color đủ độ dài cho các key màu mới
        {
            "desc": "Increasing 'color' column length",
            "sql": "ALTER TABLE boards ALTER COLUMN color TYPE VARCHAR(100)"
        }
    ]

    with engine.connect() as conn:
        for cmd in commands:
            try:
                print(f"  - {cmd['desc']}...")
                conn.execute(text(cmd['sql']))
                conn.commit()
                print(f"    ✅ Done.")
            except Exception as e:
                # Bỏ qua lỗi nếu cột đã tồn tại (đối với các DB không hỗ trợ IF NOT EXISTS trực tiếp trên ALTER)
                if "already exists" in str(e).lower():
                    print(f"    ℹ️ Column already exists, skipping.")
                else:
                    print(f"    ❌ Error: {e}")
        
    print("\n✨ Migration completed successfully!")

if __name__ == "__main__":
    migrate()
