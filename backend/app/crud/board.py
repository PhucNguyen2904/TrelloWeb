from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.model.board import Board, BoardMember
from app.model.user import User
from app.schemas.Board import BoardCreate, BoardUpdate


def create_board(db: Session, board_data: BoardCreate, owner_id: int) -> Board:
    """Create a new board"""
    db_board = Board(
        name=board_data.name,
        color=board_data.color,
        gradient=board_data.gradient,
        owner_id=owner_id
    )
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    return db_board


def get_board(db: Session, board_id: int) -> Board | None:
    """Get board by id"""
    return db.query(Board).filter(Board.id == board_id).first()


def get_user_boards(db: Session, user_id: int) -> list[Board]:
    """Get all boards of a user (owned or as a member) sorted by ID"""
    return db.query(Board).outerjoin(BoardMember).filter(
        or_(Board.owner_id == user_id, BoardMember.user_id == user_id)
    ).distinct().order_by(Board.id.asc()).all()


def update_board_view_time(db: Session, board_id: int) -> Board | None:
    """Update last_viewed_at timestamp for a board"""
    db_board = get_board(db, board_id)
    if not db_board:
        return None
    from datetime import datetime
    db_board.last_viewed_at = datetime.utcnow()
    db.commit()
    db.refresh(db_board)
    return db_board


def update_board(db: Session, board_id: int, board_data: BoardUpdate) -> Board | None:
    """Update a board"""
    db_board = get_board(db, board_id)
    if not db_board:
        return None
    if board_data.name:
        db_board.name = board_data.name
    if board_data.color:
        db_board.color = board_data.color
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


def invite_member(db: Session, board_id: int, user_id: int, role: str = "member") -> BoardMember:
    """Add a member to a board"""
    db_member = BoardMember(
        board_id=board_id,
        user_id=user_id,
        role=role
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member


def get_board_members(db: Session, board_id: int) -> list[BoardMember]:
    """Get all members of a board"""
    return db.query(BoardMember).filter(BoardMember.board_id == board_id).all()


def get_member_by_user_id(db: Session, board_id: int, user_id: int) -> BoardMember | None:
    """Get member by user id and board id"""
    return db.query(BoardMember).filter(
        BoardMember.board_id == board_id,
        BoardMember.user_id == user_id
    ).first()