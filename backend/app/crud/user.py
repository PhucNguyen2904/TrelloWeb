from sqlalchemy.orm import Session, joinedload
from app.model.user import User
from app.model.role import Role
from app.schemas.User import UserCreate
from app.core.security import hash_password, verify_password


def create_user(db: Session, user_data: UserCreate) -> User:
    """Create a new user"""
    default_role_name = "user"
    role = db.query(Role).filter(Role.name == default_role_name).first()
    if not role:
        role = Role(name=default_role_name, description="Default user role")
        db.add(role)
        db.commit()
        db.refresh(role)

    db_user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        role_id=role.id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_email(db: Session, email: str) -> User | None:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    """Get user by id"""
    return db.query(User).filter(User.id == user_id).first()


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """Authenticate user with email and password"""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def get_all_users(db: Session, skip: int = 0, limit: int | None = 100) -> list[User]:
    """Get all users with optional pagination."""
    query = db.query(User).options(joinedload(User.role)).order_by(User.id.asc()).offset(skip)
    if limit is not None:
        query = query.limit(limit)
    return query.all()


def delete_user(db: Session, user_id: int) -> bool:
    """Delete a user"""
    user = get_user_by_id(db, user_id)
    if not user:
        return False
    db.delete(user)
    db.commit()
    return True


def update_user_role(db: Session, user_id: int, role_id: int) -> User | None:
    """Update user role"""
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    user.role_id = role_id
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
