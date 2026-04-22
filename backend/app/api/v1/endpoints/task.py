from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.model.user import User
from app.model.task import Task
from app.model.board import Board
from app.schemas.Task import TaskCreate, TaskUpdate, TaskResponse
from app.crud.task import (
    create_task, get_task, get_board_tasks, update_task, delete_task
)
from app.crud.board import get_board
from app.deps.auth import get_current_user, RoleChecker

router = APIRouter(prefix="/api/boards/{board_id}/tasks", tags=["tasks"])


def check_board_ownership(board_id: int, current_user: User, db: Session):
    """Check if current user owns the board"""
    board = get_board(db, board_id)
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )
    if board.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this board"
        )
    return board


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_new_task(
    board_id: int,
    task_data: TaskCreate,
    current_user: User = Depends(RoleChecker(["admin", "user"])),
    db: Session = Depends(get_db)
):
    """Create a new task in a board"""
    check_board_ownership(board_id, current_user, db)
    task = create_task(db, task_data, board_id)
    return task


@router.get("", response_model=list[TaskResponse])
async def get_tasks(
    board_id: int,
    current_user: User = Depends(RoleChecker(["admin", "user"])),
    db: Session = Depends(get_db)
):
    """Get all tasks in a board"""
    check_board_ownership(board_id, current_user, db)
    tasks = get_board_tasks(db, board_id)
    return tasks


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task_details(
    board_id: int,
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific task"""
    check_board_ownership(board_id, current_user, db)
    
    task = get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    if task.board_id != board_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found in this board"
        )
    
    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task_info(
    board_id: int,
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(RoleChecker(["admin", "user"])),
    db: Session = Depends(get_db)
):
    """Update a task"""
    check_board_ownership(board_id, current_user, db)
    
    task = get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    if task.board_id != board_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found in this board"
        )
    
    updated_task = update_task(db, task_id, task_data)
    return updated_task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task_info(
    board_id: int,
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a task"""
    check_board_ownership(board_id, current_user, db)
    
    task = get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    if task.board_id != board_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found in this board"
        )
    
    delete_task(db, task_id)