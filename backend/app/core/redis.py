from app.infrastructure.cache import cache_service

async def revoke_token(token_jti: str, expires_in: int):
    """Blacklist a refresh token using Upstash"""
    await cache_service.set(f"revoked:{token_jti}", "true", ttl=expires_in)

async def is_token_revoked(token_jti: str) -> bool:
    """Check if a token is blacklisted"""
    return await cache_service.get(f"revoked:{token_jti}") is not None
