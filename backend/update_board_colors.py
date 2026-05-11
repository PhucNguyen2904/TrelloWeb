from app.db.session import SessionLocal
from app.model.board import Board
import random

def update_existing_boards():
    db = SessionLocal()
    try:
        boards = db.query(Board).filter(Board.color == None).all()
        print(f"Found {len(boards)} boards without color.")
        
        colors = [
            '#0079BF', '#D29034', '#519839', '#B04632', '#89609E',
            '#CD5A91', '#4BBF6B', '#00AECC', '#838C91'
        ]
        
        for board in boards:
            board.color = random.choice(colors)
            
        db.commit()
        print("Successfully updated colors for existing boards.")
    except Exception as e:
        db.rollback()
        print(f"Error updating boards: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    update_existing_boards()
