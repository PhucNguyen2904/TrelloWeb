import json
import functools
import logging
from typing import Any, Callable, Optional
from fastapi import Request
from upstash_redis.asyncio import Redis
from app.core.config import settings

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CacheService:
    def __init__(self):
        self.redis: Optional[Redis] = None

    async def connect(self) -> bool:
        """Kết nối tới Upstash Redis và kiểm tra ping."""
        if not settings.UPSTASH_REDIS_REST_URL or not settings.UPSTASH_REDIS_REST_TOKEN:
            logger.error("❌ Upstash Redis credentials not found in environment variables!")
            return False
        
        try:
            self.redis = Redis(
                url=settings.UPSTASH_REDIS_REST_URL,
                token=settings.UPSTASH_REDIS_REST_TOKEN
            )
            # Ping test
            pong = await self.redis.ping()
            if pong:
                logger.info("✅ Successfully connected to Upstash Redis (Ping OK)")
                return True
            return False
        except Exception as e:
            logger.error(f"❌ Failed to connect to Upstash Redis: {str(e)}")
            return False

    async def disconnect(self) -> None:
        if self.redis:
            self.redis = None
            logger.info("🔌 Disconnected from Upstash Redis")

    async def get(self, key: str) -> Any:
        if not self.redis:
            return None
        try:
            data = await self.redis.get(key)
            if data:
                return json.loads(data) if isinstance(data, str) else data
            return None
        except Exception as e:
            logger.error(f"❌ Error getting key {key}: {str(e)}")
            return None

    async def set(self, key: str, value: Any, ttl: int = 3600, verify: bool = True) -> bool:
        """Lưu data vào Redis với tùy chọn verify lại."""
        if not self.redis:
            return False
        try:
            # Chuyển đổi sang JSON string
            json_data = json.dumps(value)
            
            # QUAN TRỌNG: Phải await lệnh set
            success = await self.redis.set(key, json_data, ex=ttl)
            
            if success:
                logger.info(f"🚀 Successfully set key: {key} (TTL: {ttl}s)")
                
                # Bước kiểm tra lại (Verify) theo yêu cầu của bạn
                if verify:
                    check_data = await self.redis.get(key)
                    if check_data:
                        logger.info(f"🧪 Verification OK for key: {key}")
                    else:
                        logger.warning(f"⚠️ Verification FAILED for key: {key}")
                return True
            return False
        except Exception as e:
            logger.error(f"❌ Error setting key {key}: {str(e)}")
            return False

    async def delete(self, key: str) -> None:
        if not self.redis:
            return
        await self.redis.delete(key)

# Global instance
cache_service = CacheService()

def cache_response(ttl: int = 60):
    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            if not cache_service.redis:
                return await func(*args, **kwargs)

            request: Optional[Request] = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            if not request:
                request = kwargs.get("request")

            if request:
                cache_key = f"cache:{request.url.path}:{str(request.query_params)}"
                user = kwargs.get("current_user")
                if user and hasattr(user, "id"):
                    cache_key += f":user:{user.id}"
            else:
                cache_key = f"cache:{func.__name__}:{hash(str(args) + str(kwargs))}"

            cached_data = await cache_service.get(cache_key)
            if cached_data is not None:
                logger.info(f"🎯 Cache HIT for {cache_key}")
                return cached_data

            result = await func(*args, **kwargs)
            # Đối với endpoint response, chúng ta không cần verify quá kỹ để tránh làm chậm response
            await cache_service.set(cache_key, result, ttl=ttl, verify=False)
            return result
        return wrapper
    return decorator
