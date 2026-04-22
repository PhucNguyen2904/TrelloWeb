from sqlalchemy.orm import Session
from app.model.board import Board
from app.schemas.Board import BoardCreate, BoardUpdate


def create_board(db: Session, board_data: BoardCreate, owner_id: int) -> Board:
    """Create a new board"""
    db_board = Board(
        name=board_data.name,
        owner_id=owner_id
    )
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    return db_board


def get_board(db: Session, board_id: int) -> Board | None:
    """Get board by id"""
    return db.query(Board).filter(Board.id == board_id).first()


def get_user_boards(db: Session, owner_id: int) -> list[Board]:
    """Get all boards of a user"""
    return db.query(Board).filter(Board.owner_id == owner_id).all()


def update_board(db: Session, board_id: int, board_data: BoardUpdate) -> Board | None:
    """Update a board"""
    db_board = get_board(db, board_id)
    if not db_board:
        return None
    if board_data.name:
        db_board.name = board_data.name
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    return db_board


def delete_board(db: Session, board_id: int) -> bool:
    """Delete a board"""
    db_board = get_board(db, board_id)
    if not db_board:
        return False
    db.delete(db_board)
    db.commit()
    return True