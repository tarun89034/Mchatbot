from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, Dict

from models.database import get_db, UserModel
from models.user import UserCreate, UserLogin, User
from utils.exceptions import CustomHTTPException
from fastapi import status

class AuthService:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.SECRET_KEY = "your-secret-key-change-in-production"
        self.ALGORITHM = "HS256"
        self.ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """Hash a password"""
        return self.pwd_context.hash(password)

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.SECRET_KEY, algorithm=self.ALGORITHM)
        return encoded_jwt

    async def create_user(self, user_data: UserCreate) -> UserModel:
        """Create a new user"""
        db = next(get_db())
        try:
            # Check if user already exists
            existing_user = db.query(UserModel).filter(UserModel.email == user_data.email).first()
            if existing_user:
                raise CustomHTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered",
                    error_code="EMAIL_EXISTS"
                )

            # Create new user
            hashed_password = self.get_password_hash(user_data.password)
            db_user = UserModel(
                email=user_data.email,
                name=user_data.name,
                hashed_password=hashed_password,
                preferred_name=user_data.preferred_name,
                age_range=user_data.age_range
            )
            
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            return db_user
            
        except Exception as e:
            db.rollback()
            if isinstance(e, CustomHTTPException):
                raise e
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user",
                error_code="USER_CREATION_FAILED"
            )
        finally:
            db.close()

    async def authenticate_user(self, credentials: UserLogin) -> Dict:
        """Authenticate user and return token"""
        db = next(get_db())
        try:
            user = db.query(UserModel).filter(UserModel.email == credentials.email).first()
            
            if not user or not self.verify_password(credentials.password, user.hashed_password):
                raise CustomHTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password",
                    error_code="INVALID_CREDENTIALS"
                )
            
            if not user.is_active:
                raise CustomHTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Account is deactivated",
                    error_code="ACCOUNT_DEACTIVATED"
                )

            # Create access token
            access_token_expires = timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = self.create_access_token(
                data={"sub": str(user.id), "email": user.email},
                expires_delta=access_token_expires
            )
            
            return {
                "access_token": access_token,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "preferred_name": user.preferred_name
                }
            }
            
        except Exception as e:
            if isinstance(e, CustomHTTPException):
                raise e
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication failed",
                error_code="AUTH_FAILED"
            )
        finally:
            db.close()

    async def get_user_by_id(self, user_id: int) -> Optional[UserModel]:
        """Get user by ID"""
        db = next(get_db())
        try:
            return db.query(UserModel).filter(UserModel.id == user_id).first()
        finally:
            db.close()

    def decode_token(self, token: str) -> Dict:
        """Decode JWT token"""
        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM])
            return payload
        except JWTError:
            raise CustomHTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                error_code="INVALID_TOKEN"
            )