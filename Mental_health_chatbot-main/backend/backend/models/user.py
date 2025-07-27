from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str
    preferred_name: Optional[str] = None
    age_range: Optional[str] = None
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
    
    @validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        return v.strip()

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    preferred_name: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    preferred_name: Optional[str] = None
    age_range: Optional[str] = None
    timezone: Optional[str] = None
    notification_preferences: Optional[dict] = None

class User(BaseModel):
    id: int
    email: str
    name: str
    preferred_name: Optional[str] = None
    age_range: Optional[str] = None
    timezone: str = "UTC"
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True