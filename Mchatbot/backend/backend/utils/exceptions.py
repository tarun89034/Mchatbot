from fastapi import HTTPException
from typing import Optional

class CustomHTTPException(HTTPException):
    """Custom HTTP exception with error codes"""
    
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: Optional[str] = None,
        headers: Optional[dict] = None
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)
        self.error_code = error_code