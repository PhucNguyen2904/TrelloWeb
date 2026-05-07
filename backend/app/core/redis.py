import redis
from app.core.config import settings

redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    password=settings.REDIS_PASSWORD,
    decode_responses=True
)

def revoke_token(token_jti: str, expires_in: int):
    """Blacklist a refresh token"""
    redis_client.setex(f"revoked:{token_jti}", expires_in, "true")

def is_token_revoked(token_jti: str) -> bool:
    """Check if a token is blacklisted"""
    return redis_client.exists(f"revoked:{token_jti}") > 0
