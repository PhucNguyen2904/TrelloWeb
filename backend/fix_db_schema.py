from app.db.session import SessionLocal
from sqlalchemy import text

def add_color_column():
    db = SessionLocal()
    try:
        print("Attempting to add 'color' column to 'boards' table...")
        db.execute(text("ALTER TABLE boards ADD COLUMN IF NOT EXISTS color VARCHAR(50) DEFAULT '#3B82F6'"))
        db.commit()
        print("Successfully added 'color' column.")
    except Exception as e:
        db.rollback()
        print(f"Error adding column: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    add_color_column()
