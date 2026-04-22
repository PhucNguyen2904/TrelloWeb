from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.model.user import User
from app.schemas.Board import BoardCreate, BoardUpdate, BoardResponse
from app.crud.board import (
    create_board, get_board, get_user_boards, update_board, delete_board
)
from app.deps.auth import get_current_user, RoleChecker

router = APIRouter(prefix="/api/boards", tags=["boards"])


@router.post("", response_model=BoardResponse, status_code=status.HTTP_201_CREATED)
async def create_new_board(
    board_data: BoardCreate,
    current_user: User = Depends(RoleChecker(["user"])),
    db: Session = Depends(get_db)
):
    """Create a new board"""
    board = create_board(db, board_data, current_user.id)
    return board


@router.get("", response_model=list[BoardResponse])
async def get_my_boards(
    current_user: User = Depends(RoleChecker(["admin", "user"])),
    db: Session = Depends(get_db)
):
    """Get all boards of current user"""
    boards = get_user_boards(db, current_user.id)
    return boards


@router.get("/{board_id}", response_model=BoardResponse)
async def get_board_details(
    board_id: int,
    current_user: User = Depends(RoleChecker(["admin", "user"])),
    db: Session = Depends(get_db)
):
    """Get board details"""
    board = get_board(db, board_id)
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )
    
    # Check if user owns this board
    if board.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this board"
        )
    
    return board


@router.put("/{board_id}", response_model=BoardResponse)
async def update_board_info(
    board_id: int,
    board_data: BoardUpdate,
    current_user: User = Depends(RoleChecker(["admin", "user"])),
    db: Session = Depends(get_db)
):
    """Update board information"""
    board = get_board(db, board_id)
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )
    
    # Check if user owns this board
    if board.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this board"
        )
    
    updated_board = update_board(db, board_id, board_data)
    return updated_board


@router.delete("/{board_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_board_info(
    board_id: int,
    current_user: User = Depends(RoleChecker(["admin"])),
    db: Session = Depends(get_db)
):
    """Delete a board"""
    board = get_board(db, board_id)
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )
    
    # Check if user owns this board
    if board.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this board"
        )
    
    delete_board(db, board_id)