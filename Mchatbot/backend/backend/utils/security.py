from jose import JWTError, jwt
from fastapi import HTTPException, status
from typing import Optional
import logging

logger = logging.getLogger(__name__)

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"

def verify_token(token: str) -> int:
    """Verify JWT token and return user ID"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return int(user_id)
        
    except JWTError as e:
        logger.error(f"JWT verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except ValueError as e:
        logger.error(f"Invalid user ID in token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format",
            headers={"WWW-Authenticate": "Bearer"},
        )

def create_token_data(user_id: int, email: str) -> dict:
    """Create token data dictionary"""
    return {
        "sub": str(user_id),
        "email": email
    }