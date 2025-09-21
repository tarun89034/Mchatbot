import time
import logging
from typing import Dict, Optional, Tuple
from collections import defaultdict
import asyncio
from fastapi import HTTPException, status

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self, use_redis: bool = False, redis_url: str = "redis://localhost:6379"):
        self.use_redis = use_redis
        self.redis_client = None
        self.rate_limits = defaultdict(list)
        
        if use_redis:
            try:
                import redis
                self.redis_client = redis.from_url(redis_url)
                logger.info("Redis rate limiter initialized")
            except Exception as e:
                logger.warning(f"Failed to initialize Redis: {e}. Falling back to in-memory rate limiting.")
                self.use_redis = False
        
        # Rate limit configurations (requests per minute)
        self.limits = {
            "auth": {"login": 5, "register": 3},  # 5 login attempts, 3 registrations per minute
            "chat": {"message": 30},  # 30 messages per minute
            "mood": {"entry": 10, "analytics": 20},  # 10 mood entries, 20 analytics requests per minute
            "default": 60  # 60 requests per minute for other endpoints
        }
    
    async def check_rate_limit(self, user_id: Optional[int], endpoint: str, action: str = "default") -> bool:
        """Check if request is within rate limits"""
        try:
            if self.use_redis and self.redis_client:
                return await self._check_redis_rate_limit(user_id, endpoint, action)
            else:
                return self._check_memory_rate_limit(user_id, endpoint, action)
        except Exception as e:
            logger.error(f"Rate limit check failed: {e}")
            # Allow request if rate limiting fails
            return True
    
    def _check_memory_rate_limit(self, user_id: Optional[int], endpoint: str, action: str) -> bool:
        """Check rate limit using in-memory storage"""
        current_time = time.time()
        key = f"{user_id}:{endpoint}:{action}" if user_id else f"anonymous:{endpoint}:{action}"
        
        # Get limit for this endpoint/action
        limit = self.limits.get(endpoint, {}).get(action, self.limits["default"])
        
        # Clean old entries (older than 1 minute)
        self.rate_limits[key] = [t for t in self.rate_limits[key] if current_time - t < 60]
        
        # Check if limit exceeded
        if len(self.rate_limits[key]) >= limit:
            return False
        
        # Add current request
        self.rate_limits[key].append(current_time)
        return True
    
    async def _check_redis_rate_limit(self, user_id: Optional[int], endpoint: str, action: str) -> bool:
        """Check rate limit using Redis"""
        current_time = int(time.time())
        key = f"rate_limit:{user_id}:{endpoint}:{action}" if user_id else f"rate_limit:anonymous:{endpoint}:{action}"
        
        # Get limit for this endpoint/action
        limit = self.limits.get(endpoint, {}).get(action, self.limits["default"])
        
        try:
            # Use Redis pipeline for atomic operations
            pipe = self.redis_client.pipeline()
            
            # Remove old entries (older than 1 minute)
            pipe.zremrangebyscore(key, 0, current_time - 60)
            
            # Count current entries
            pipe.zcard(key)
            
            # Add current request
            pipe.zadd(key, {str(current_time): current_time})
            
            # Set expiry on key
            pipe.expire(key, 60)
            
            results = pipe.execute()
            current_count = results[1]
            
            return current_count < limit
            
        except Exception as e:
            logger.error(f"Redis rate limit check failed: {e}")
            return True
    
    def get_remaining_requests(self, user_id: Optional[int], endpoint: str, action: str = "default") -> int:
        """Get remaining requests for user/endpoint/action"""
        try:
            if self.use_redis and self.redis_client:
                return self._get_redis_remaining_requests(user_id, endpoint, action)
            else:
                return self._get_memory_remaining_requests(user_id, endpoint, action)
        except Exception as e:
            logger.error(f"Failed to get remaining requests: {e}")
            return 0
    
    def _get_memory_remaining_requests(self, user_id: Optional[int], endpoint: str, action: str) -> int:
        """Get remaining requests using in-memory storage"""
        current_time = time.time()
        key = f"{user_id}:{endpoint}:{action}" if user_id else f"anonymous:{endpoint}:{action}"
        
        limit = self.limits.get(endpoint, {}).get(action, self.limits["default"])
        
        # Clean old entries
        self.rate_limits[key] = [t for t in self.rate_limits[key] if current_time - t < 60]
        
        return max(0, limit - len(self.rate_limits[key]))
    
    def _get_redis_remaining_requests(self, user_id: Optional[int], endpoint: str, action: str) -> int:
        """Get remaining requests using Redis"""
        current_time = int(time.time())
        key = f"rate_limit:{user_id}:{endpoint}:{action}" if user_id else f"rate_limit:anonymous:{endpoint}:{action}"
        
        limit = self.limits.get(endpoint, {}).get(action, self.limits["default"])
        
        try:
            # Remove old entries and count current ones
            self.redis_client.zremrangebyscore(key, 0, current_time - 60)
            current_count = self.redis_client.zcard(key)
            
            return max(0, limit - current_count)
        except Exception as e:
            logger.error(f"Redis remaining requests check failed: {e}")
            return 0

# Global rate limiter instance
rate_limiter = RateLimiter()

def rate_limit(endpoint: str, action: str = "default"):
    """Decorator for rate limiting endpoints"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Extract user_id from request if available
            user_id = None
            for arg in args:
                if hasattr(arg, 'user_id'):
                    user_id = arg.user_id
                    break
            
            # Check rate limit
            if not await rate_limiter.check_rate_limit(user_id, endpoint, action):
                remaining = rate_limiter.get_remaining_requests(user_id, endpoint, action)
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail={
                        "error": "Rate limit exceeded",
                        "endpoint": endpoint,
                        "action": action,
                        "retry_after": 60,
                        "remaining_requests": remaining
                    }
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator 