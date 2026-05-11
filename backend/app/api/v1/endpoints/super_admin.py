import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.model.board import Board
from app.model.task import Task
from app.model.user import User
from app.model.role import Role, Permission
from app.schemas.User import UserResponseWithoutPassword, UserCreateByAdmin, UserRoleUpdate
from app.crud.user import get_all_users, delete_user, create_user, get_user_by_id, update_user_role
from app.deps.auth import RoleChecker

router = APIRouter(prefix="/api/super-admin", tags=["super-admin"])
logger = logging.getLogger(__name__)

# Dependency that ensures the user is a superadmin
allow_super_admin = RoleChecker(["superadmin"])


# ─── Extra Schemas ───────────────────────────────────────────────────────────

class RoleCreate(BaseModel):
    name: str
    description: str | None = None


class RoleUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class PermissionResponse(BaseModel):
    id: int
    name: str = ""
    description: str | None = None

    class Config:
        from_attributes = True


class RoleResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    user_count: int = 0
    permissions: list[PermissionResponse] = []

    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    total_users: int
    total_boards: int
    total_tasks: int
    total_roles: int
    active_users: int

@router.get("/users", response_model=list[UserResponseWithoutPassword])
async def read_all_users(
    skip: int = 0,
    limit: int | None = Query(default=None, ge=1, le=1000),
    current_super_admin: User = Depends(allow_super_admin),
    db: Session = Depends(get_db)
):
    """Retrieve list of all users (Super Admin only)"""
    users = get_all_users(db, skip=skip, limit=limit)
    logger.info(
        "super_admin_users_list actor_id=%s skip=%s limit=%s returned=%s",
        current_super_admin.id,
        skip,
        limit,
        len(users),
    )
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

@router.get("/stats", response_model=StatsResponse)
async def get_platform_stats(
    current_super_admin: User = Depends(allow_super_admin),
    db: Session = Depends(get_db),
):
    """Get platform-wide statistics (Super Admin only)"""
    total_users = db.query(User).count()
    total_boards = db.query(Board).count()
    total_tasks = db.query(Task).count()
    total_roles = db.query(Role).count()
    # No is_active column yet — treat all users as active
    return StatsResponse(
        total_users=total_users,
        active_users=total_users,
        total_boards=total_boards,
        total_tasks=total_tasks,
        total_roles=total_roles,
    )


# ─── Roles CRUD ──────────────────────────────────────────────────────────────

@router.get("/roles", response_model=list[RoleResponse])
async def get_all_roles(
    current_super_admin: User = Depends(allow_super_admin),
    db: Session = Depends(get_db),
):
    """Get all available roles with user count (Super Admin only)"""
    roles = db.query(Role).all()
    return [
        RoleResponse(
            id=r.id,
            name=r.name,
            description=r.description,
            user_count=len(r.users) if r.users else 0,
            permissions=[
                PermissionResponse(id=p.id, name=p.name, description=p.description)
                for p in r.permissions
            ] if r.permissions else []
        )
        for r in roles
    ]


@router.post("/roles", response_model=RoleResponse, status_code=status.HTTP_201_CREATED)
async def create_role(
    role_data: RoleCreate,
    current_super_admin: User = Depends(allow_super_admin),
    db: Session = Depends(get_db),
):
    """Create a new role (Super Admin only)"""
    existing = db.query(Role).filter(Role.name == role_data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role name already exists",
        )
    role = Role(name=role_data.name, description=role_data.description)
    db.add(role)
    db.commit()
    db.refresh(role)
    return RoleResponse(id=role.id, name=role.name, description=role.description, user_count=0)


@router.put("/roles/{role_id}", response_model=RoleResponse)
async def update_role(
    role_id: int,
    role_data: RoleUpdate,
    current_super_admin: User = Depends(allow_super_admin),
    db: Session = Depends(get_db),
):
    """Update a role (Super Admin only)"""
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    if role_data.name is not None:
        # Check name uniqueness
        conflict = db.query(Role).filter(Role.name == role_data.name, Role.id != role_id).first()
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role name already in use",
            )
        role.name = role_data.name
    if role_data.description is not None:
        role.description = role_data.description
    db.commit()
    db.refresh(role)
    return RoleResponse(
        id=role.id,
        name=role.name,
        description=role.description,
        user_count=len(role.users) if role.users else 0,
        permissions=[
            PermissionResponse(id=p.id, name=p.name, description=p.description)
            for p in role.permissions
        ] if role.permissions else []
    )


@router.delete("/roles/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_role(
    role_id: int,
    current_super_admin: User = Depends(allow_super_admin),
    db: Session = Depends(get_db),
):
    """Delete a role (Super Admin only). Cannot delete a role that still has users."""
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    if role.users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete role '{role.name}': {len(role.users)} user(s) still assigned.",
        )
    db.delete(role)
    db.commit()
    return None

# ─── Permissions Management ──────────────────────────────────────────────────

@router.get("/permissions", response_model=list[PermissionResponse])
async def get_all_permissions(
    current_super_admin: User = Depends(allow_super_admin),
    db: Session = Depends(get_db),
):
    """List all available permissions (Super Admin only)"""
    return db.query(Permission).all()


class RolePermissionsUpdate(BaseModel):
    permission_ids: list[int]


@router.put("/roles/{role_id}/permissions", response_model=RoleResponse)
async def update_role_permissions(
    role_id: int,
    data: RolePermissionsUpdate,
    current_super_admin: User = Depends(allow_super_admin),
    db: Session = Depends(get_db),
):
    """Update the set of permissions assigned to a role (Super Admin only)"""
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    
    # Verify all permission IDs exist
    permissions = db.query(Permission).filter(Permission.id.in_(data.permission_ids)).all()
    if len(permissions) != len(data.permission_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more permission IDs are invalid"
        )
    
    # Update relationship
    role.permissions = permissions
    db.commit()
    db.refresh(role)
    
    return RoleResponse(
        id=role.id,
        name=role.name,
        description=role.description,
        user_count=len(role.users) if role.users else 0,
        permissions=[
            PermissionResponse(id=p.id, name=p.name, description=p.description)
            for p in role.permissions
        ]
    )
