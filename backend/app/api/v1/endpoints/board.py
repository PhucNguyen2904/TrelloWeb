from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import List
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.model.user import User
from app.model.role import Role
from app.schemas.Board import BoardCreate, BoardUpdate, BoardResponse, BoardInvite, BoardMemberResponse
from app.crud.board import (
    create_board, get_board, get_user_boards, update_board, delete_board,
    invite_member, get_board_members, get_member_by_user_id
)
from app.crud.user import get_user_by_email
from app.deps.auth import get_current_user, RoleChecker
from app.infrastructure.cache import cache_response

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
    request: Request,
    current_user: User = Depends(RoleChecker(["admin", "user"])),
    db: Session = Depends(get_db)
):
    """Get all boards of current user"""
    boards = get_user_boards(db, current_user.id)
    return boards


@router.get("/{board_id}", response_model=BoardResponse)
async def get_board_details(
    board_id: int,
    request: Request,
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
    current_user: User = Depends(RoleChecker(["admin", "user"])),
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


@router.post("/{board_id}/members/invite", response_model=BoardMemberResponse)
async def invite_board_member(
    board_id: int,
    invite_data: BoardInvite,
    current_user: User = Depends(RoleChecker(["admin", "user"])),
    db: Session = Depends(get_db)
):
    """Invite a member to the board"""
    board = get_board(db, board_id)
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    # Check permission (only owner or board admin can invite)
    # For now, let's allow the owner
    if board.owner_id != current_user.id:
        # Check if current_user is a board admin (not implemented yet, so just owner for now)
        raise HTTPException(status_code=403, detail="Only board owner can invite members")
    
    # Find user by email
    user = get_user_by_email(db, invite_data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if already a member
    existing_member = get_member_by_user_id(db, board_id, user.id)
    if existing_member:
        raise HTTPException(status_code=400, detail="User is already a member of this board")
    
    member = invite_member(db, board_id, user.id, "member")
    
    return {
        "id": member.id,
        "user_id": member.user_id,
        "role": member.role,
        "email": user.email
    }


@router.get("/{board_id}/members", response_model=List[BoardMemberResponse])
async def get_board_members_list(
    board_id: int,
    current_user: User = Depends(RoleChecker(["admin", "user"])),
    db: Session = Depends(get_db)
):
    """Get board members, filtering out global admins/superadmins"""
    board = get_board(db, board_id)
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    members = get_board_members(db, board_id)
    
    result = []
    for m in members:
        # Only include if user role is "member" or similar (not admin/superadmin)
        # Assuming role names are 'admin', 'superadmin', 'user'
        if m.user.role.name not in ["admin", "superadmin"]:
            result.append({
                "id": m.id,
                "user_id": m.user_id,
                "role": m.role,
                "email": m.user.email
            })
            
    return result