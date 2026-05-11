import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.model.user import User
from app.model.role import Role
from app.schemas.User import UserResponseWithoutPassword, UserCreateByAdmin, UserRoleUpdate
from app.crud.user import get_all_users, delete_user, create_user, get_user_by_id, update_user_role
from app.deps.auth import RoleChecker

router = APIRouter(prefix="/api/admin", tags=["admin"])
logger = logging.getLogger(__name__)

# Role dependencies
allow_admin_or_user = RoleChecker(["admin", "user"])
allow_admin_only = RoleChecker(["admin"])

@router.get("/users", response_model=list[UserResponseWithoutPassword])
async def read_users(
    skip: int = 0,
    limit: int | None = Query(default=100, ge=1, le=1000),
    current_user: User = Depends(allow_admin_or_user),
    db: Session = Depends(get_db)
):
    """Retrieve list of users (Admin and Users)"""
    users = get_all_users(db, skip=skip, limit=limit)
    logger.info(
        "admin_users_list actor_id=%s skip=%s limit=%s returned=%s",
        current_user.id,
        skip,
        limit,
        len(users),
    )
    return users

@router.post("/users", response_model=UserResponseWithoutPassword, status_code=status.HTTP_201_CREATED)
async def create_new_user(
    user_data: UserCreateByAdmin,
    current_user: User = Depends(allow_admin_or_user),
    db: Session = Depends(get_db)
):
    """Create a new user (Admin and Users)"""
    # Check if user already exists
    from app.crud.user import get_user_by_email
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # If not admin/superadmin, force role_id to 'user' (ID: 3)
    is_management = current_user.role.name in ["admin", "superadmin"]
    if not is_management:
        user_data.role_id = 3
    
    # If role_id is provided, verify it exists
    if user_data.role_id:
        role = db.query(Role).filter(Role.id == user_data.role_id).first()
        if not role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role not found"
            )
    
    # Create user with specified role_id if provided
    user = create_user(db, user_data)
    if user_data.role_id:
        user = update_user_role(db, user.id, user_data.role_id)
    
    return user

@router.put("/users/{user_id}/role", response_model=UserResponseWithoutPassword)
async def update_user_role_endpoint(
    user_id: int,
    role_data: UserRoleUpdate,
    current_admin: User = Depends(allow_admin_only),
    db: Session = Depends(get_db)
):
    """Update user role (Admin only)"""
    # Check if user exists
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent admin from changing their own role
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change your own role"
        )
    
    # Verify role exists
    role = db.query(Role).filter(Role.id == role_data.role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role not found"
        )
    
    updated_user = update_user_role(db, user_id, role_data.role_id)
    return updated_user

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_user(
    user_id: int,
    current_admin: User = Depends(allow_admin_only),
    db: Session = Depends(get_db)
):
    """Delete a user (Admin only)"""
    # Prevent admin from deleting themselves
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete yourself"
        )
    
    success = delete_user(db, user_id=user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return None
