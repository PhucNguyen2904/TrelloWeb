from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.model.user import User
from app.model.role import Role
from app.schemas.User import UserResponseWithoutPassword, UserCreateByAdmin, UserRoleUpdate
from app.crud.user import get_all_users, delete_user, create_user, get_user_by_id, update_user_role
from app.deps.auth import RoleChecker

router = APIRouter(prefix="/api/super-admin", tags=["super-admin"])

# Dependency that ensures the user is a superadmin
allow_super_admin = RoleChecker(["superadmin"])

@router.get("/users", response_model=list[UserResponseWithoutPassword])
async def read_all_users(
    skip: int = 0,
    limit: int = 100,
    current_super_admin: User = Depends(allow_super_admin),
    db: Session = Depends(get_db)
):
    """Retrieve list of all users (Super Admin only)"""
    users = get_all_users(db, skip=skip, limit=limit)
    return users

@router.post("/users", response_model=UserResponseWithoutPassword, status_code=status.HTTP_201_CREATED)
async def create_new_user(
    user_data: UserCreateByAdmin,
    current_super_admin: User = Depends(allow_super_admin),
    db: Session = Depends(get_db)
):
    """Create a new user (Super Admin only)"""
    from app.crud.user import get_user_by_email
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # If role_id is provided, verify it exists
    if user_data.role_id:
        role = db.query(Role).filter(Role.id == user_data.role_id).first()
        if not role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role not found"
            )
    
    user = create_user(db, user_data)
    if user_data.role_id:
        user = update_user_role(db, user.id, user_data.role_id)
    
    return user

@router.post("/users/{user_id}/make-admin", response_model=UserResponseWithoutPassword)
async def make_user_admin(
    user_id: int,
    current_super_admin: User = Depends(allow_super_admin),
    db: Session = Depends(get_db)
):
    """Promote a user to admin role (Super Admin only)"""
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent super admin from changing their own role
    if user_id == current_super_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change your own role"
        )
    
    # Get admin role
    admin_role = db.query(Role).filter(Role.name == "admin").first()
    if not admin_role:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Admin role not found in system"
        )
    
    updated_user = update_user_role(db, user_id, admin_role.id)
    return updated_user

@router.put("/users/{user_id}/role", response_model=UserResponseWithoutPassword)
async def update_user_role_endpoint(
    user_id: int,
    role_data: UserRoleUpdate,
    current_super_admin: User = Depends(allow_super_admin),
    db: Session = Depends(get_db)
):
    """Update user role (Super Admin only)"""
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent super admin from changing their own role
    if user_id == current_super_admin.id:
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
    current_super_admin: User = Depends(allow_super_admin),
    db: Session = Depends(get_db)
):
    """Delete a user (Super Admin only)"""
    # Prevent super admin from deleting themselves
    if user_id == current_super_admin.id:
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

@router.get("/roles", response_model=list)
async def get_all_roles(
    current_super_admin: User = Depends(allow_super_admin),
    db: Session = Depends(get_db)
):
    """Get all available roles (Super Admin only)"""
    roles = db.query(Role).all()
    return [{"id": r.id, "name": r.name, "description": r.description} for r in roles]
