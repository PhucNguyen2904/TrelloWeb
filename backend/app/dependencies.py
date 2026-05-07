from typing import AsyncGenerator
from upstash_redis.asyncio import Redis
from app.infrastructure.cache import cache_service

async def get_redis() -> AsyncGenerator[Redis, None]:
    """
    Dependency injection for Redis client.
    """
    if cache_service.redis is None:
        await cache_service.connect()
    
    yield cache_service.redis
