import json
import functools
from typing import Any, Callable, Optional
from fastapi import Request, Response
from upstash_redis.asyncio import Redis
from app.core.config import settings

class CacheService:
    """
    Service for interacting with Upstash Redis via REST API.
    """
    def __init__(self):
        self.redis: Optional[Redis] = None

    async def connect(self) -> None:
        """Initialize the Redis client."""
        if settings.UPSTASH_REDIS_REST_URL and settings.UPSTASH_REDIS_REST_TOKEN:
            self.redis = Redis(
                url=settings.UPSTASH_REDIS_REST_URL,
                token=settings.UPSTASH_REDIS_REST_TOKEN
            )
            print("Successfully connected to Upstash Redis")
        else:
            print("Upstash Redis credentials not found. Cache is disabled.")

    async def disconnect(self) -> None:
        """Close the Redis client."""
        if self.redis:
            # upstash-redis asyncio client handles session closing
            self.redis = None
            print("Disconnected from Upstash Redis")

    async def get(self, key: str) -> Any:
        if not self.redis:
            return None
        data = await self.redis.get(key)
        return json.loads(data) if data else None

    async def set(self, key: str, value: Any, ttl: int = 60) -> None:
        if not self.redis:
            return
        await self.redis.set(key, json.dumps(value), ex=ttl)

    async def delete(self, key: str) -> None:
        if not self.redis:
            return
        await self.redis.delete(key)

# Global instance
cache_service = CacheService()

def cache_response(ttl: int = 60):
    """
    Decorator to cache endpoint responses.
    Usage: @cache_response(ttl=60)
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            if not cache_service.redis:
                return await func(*args, **kwargs)

            # Generate a unique cache key based on function name and arguments
            # If a 'request' object is present, use its URL path and query params
            request: Optional[Request] = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            if not request:
                request = kwargs.get("request")

            if request:
                cache_key = f"cache:{request.url.path}:{str(request.query_params)}"
                # If we have a user in kwargs (from Depends(get_current_user)), add it to the key
                user = kwargs.get("current_user")
                if user and hasattr(user, "id"):
                    cache_key += f":user:{user.id}"
            else:
                cache_key = f"cache:{func.__name__}:{hash(str(args) + str(kwargs))}"

            # Try to get from cache
            cached_data = await cache_service.get(cache_key)
            if cached_data is not None:
                return cached_data

            # Execute the function and cache the result
            result = await func(*args, **kwargs)
            await cache_service.set(cache_key, result, ttl=ttl)
            return result
        return wrapper
    return decorator
