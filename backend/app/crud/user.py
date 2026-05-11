import logging
from sqlalchemy.orm import Session, joinedload
from app.model.user import User
from app.model.role import Role
from app.schemas.User import UserCreate
from app.core.security import hash_password, verify_password, needs_rehash

logger = logging.getLogger(__name__)


def create_user(db: Session, user_data) -> User:
    """Create a new user. If password is not provided, a random secure one is generated."""
    import secrets
    default_role_name = "user"
    role = db.query(Role).filter(Role.name == default_role_name).first()
    if not role:
        role = Role(name=default_role_name, description="Default user role")
        db.add(role)
        db.commit()
        db.refresh(role)

    raw_password = getattr(user_data, "password", None) or secrets.token_urlsafe(16)
    db_user = User(
        email=user_data.email,
        hashed_password=hash_password(raw_password),
        role_id=role.id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_email(db: Session, email: str) -> User | None:
    """Get user by email"""
    return db.query(User).options(joinedload(User.role)).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    """Get user by id"""
    return db.query(User).options(joinedload(User.role)).filter(User.id == user_id).first()


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """Authenticate user with email and password.
    Transparently upgrades legacy bcrypt hashes to argon2 on successful login.
    """
    user = get_user_by_email(db, email)
    if not user:
        logger.warning("[auth] Login failed: user not found for email=%s", email)
        return None
    if not verify_password(password, user.hashed_password):
        logger.warning(
            "[auth] Login failed: password mismatch for email=%s hash_prefix=%s",
            email,
            user.hashed_password[:7] if user.hashed_password else "(empty)",
        )
        return None
    # Silently upgrade legacy bcrypt hash to argon2 on successful login
    if needs_rehash(user.hashed_password):
        try:
            user.hashed_password = hash_password(password)
            db.add(user)
            db.commit()
            logger.info("[auth] Upgraded password hash to argon2 for email=%s", email)
        except Exception as e:
            logger.error("[auth] Failed to upgrade password hash for email=%s: %s", email, e)
            db.rollback()
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
