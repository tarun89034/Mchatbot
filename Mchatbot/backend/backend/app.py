from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
from typing import List, Optional
from datetime import datetime

from models.database import init_db
from models.user import User, UserCreate, UserLogin, UserResponse
from models.chat import ChatMessage, ChatResponse, ChatCreate
from models.mood import MoodEntry, MoodCreate, MoodAnalytics
from services.auth_service import AuthService
from services.chat_service import ChatService
from services.mood_service import MoodService
from services.ml_service import MLService
from utils.security import verify_token
from utils.exceptions import CustomHTTPException
from utils.rate_limiter import rate_limit

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Mchatbot API",
    description="AI-driven chatbot for health support with mood tracking and emotion analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize services
auth_service = AuthService()
chat_service = ChatService()
mood_service = MoodService()
ml_service = MLService()

# WebSocket manager for real-time chat
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.user_connections: dict = {}
        self.user_typing_status: dict = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.user_connections[user_id] = websocket
        logger.info(f"User {user_id} connected to WebSocket")

    def disconnect(self, websocket: WebSocket, user_id: int):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if user_id in self.user_connections:
            del self.user_connections[user_id]
        if user_id in self.user_typing_status:
            del self.user_typing_status[user_id]
        logger.info(f"User {user_id} disconnected from WebSocket")

    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.user_connections:
            try:
                await self.user_connections[user_id].send_json(message)
            except Exception as e:
                logger.error(f"Failed to send message to user {user_id}: {e}")
                await self.disconnect(self.user_connections[user_id], user_id)

    async def broadcast_typing_status(self, user_id: int, is_typing: bool):
        """Broadcast typing status to all connected users"""
        message = {
            "type": "typing_status",
            "user_id": user_id,
            "is_typing": is_typing
        }
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Failed to broadcast typing status: {e}")

    async def send_system_message(self, message: str, user_id: int):
        """Send system message to specific user"""
        await self.send_personal_message({
            "type": "system_message",
            "content": message,
            "timestamp": datetime.utcnow().isoformat()
        }, user_id)

manager = ConnectionManager()

@app.on_event("startup")
async def startup_event():
    """Initialize database and ML models on startup"""
    init_db()
    await ml_service.initialize()
    logger.info("Mchatbot API started successfully")

# Authentication endpoints
@app.post("/api/auth/register", response_model=UserResponse)
@rate_limit("auth", "register")
async def register(user_data: UserCreate):
    """Register a new user"""
    try:
        user = await auth_service.create_user(user_data)
        return UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at
        )
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise CustomHTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration failed",
            error_code="REGISTRATION_FAILED"
        )

@app.post("/api/auth/login")
@rate_limit("auth", "login")
async def login(credentials: UserLogin):
    """Authenticate user and return JWT token"""
    try:
        result = await auth_service.authenticate_user(credentials)
        return {
            "access_token": result["access_token"],
            "token_type": "bearer",
            "user": result["user"]
        }
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise CustomHTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            error_code="INVALID_CREDENTIALS"
        )

# Chat endpoints
@app.post("/api/chat/message", response_model=ChatResponse)
@rate_limit("chat", "message")
async def send_message(
    message_data: ChatCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Send a message to the chatbot"""
    try:
        user_id = verify_token(credentials.credentials)
        
        # Analyze emotion and sentiment
        emotion_analysis = await ml_service.analyze_emotion(message_data.content)
        sentiment_analysis = await ml_service.analyze_sentiment(message_data.content)
        sentiment = sentiment_analysis.get("sentiment", "neutral")
        
        # Save user message
        user_message = await chat_service.save_message(
            user_id=user_id,
            content=message_data.content,
            is_user=True,
            emotion_score=emotion_analysis.get("distress_level", 0),
            sentiment=sentiment
        )
        
        # Generate AI response
        ai_response = await chat_service.generate_response(
            user_id=user_id,
            user_message=message_data.content,
            emotion_analysis=emotion_analysis,
            sentiment=sentiment
        )
        
        # Save AI response
        ai_message = await chat_service.save_message(
            user_id=user_id,
            content=ai_response,
            is_user=False
        )
        
        return ChatResponse(
            id=ai_message.id,
            content=ai_response,
            is_user=False,
            timestamp=ai_message.timestamp,
            emotion_analysis=emotion_analysis
        )
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process message",
            error_code="CHAT_ERROR"
        )

@app.get("/api/chat/history", response_model=List[ChatResponse])
async def get_chat_history(
    limit: int = 50,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get user's chat history"""
    try:
        user_id = verify_token(credentials.credentials)
        messages = await chat_service.get_chat_history(user_id, limit)
        return messages
    except Exception as e:
        logger.error(f"Chat history error: {str(e)}")
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chat history",
            error_code="HISTORY_ERROR"
        )

# Mood tracking endpoints
@app.post("/api/mood/entry", response_model=dict)
@rate_limit("mood", "entry")
async def create_mood_entry(
    mood_data: MoodCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Create a new mood entry"""
    try:
        user_id = verify_token(credentials.credentials)
        entry = await mood_service.create_mood_entry(user_id, mood_data)
        return {"id": entry.id, "message": "Mood entry created successfully"}
    except Exception as e:
        logger.error(f"Mood entry error: {str(e)}")
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create mood entry",
            error_code="MOOD_ENTRY_ERROR"
        )

@app.get("/api/mood/analytics", response_model=MoodAnalytics)
@rate_limit("mood", "analytics")
async def get_mood_analytics(
    days: int = 30,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get mood analytics and trends"""
    try:
        user_id = verify_token(credentials.credentials)
        analytics = await mood_service.get_mood_analytics(user_id, days)
        return analytics
    except Exception as e:
        logger.error(f"Mood analytics error: {str(e)}")
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mood analytics",
            error_code="ANALYTICS_ERROR"
        )

@app.get("/api/mood/history")
async def get_mood_history(
    days: int = 30,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get mood entry history"""
    try:
        user_id = verify_token(credentials.credentials)
        history = await mood_service.get_mood_history(user_id, days)
        return history
    except Exception as e:
        logger.error(f"Mood history error: {str(e)}")
        raise CustomHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve mood history",
            error_code="MOOD_HISTORY_ERROR"
        )

# WebSocket endpoint for real-time chat
@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket, token: str):
    """WebSocket endpoint for real-time chat"""
    try:
        user_id = verify_token(token)
        await manager.connect(websocket, user_id)
        
        # Send welcome message
        await manager.send_system_message("Connected to real-time chat!", user_id)
        
        while True:
            try:
                data = await websocket.receive_json()
                message_type = data.get("type", "message")
                
                if message_type == "message":
                    content = data.get("content", "")
                    
                    # Send typing indicator
                    await manager.send_personal_message({
                        "type": "typing_indicator",
                        "is_typing": True
                    }, user_id)
                    
                    # Analyze emotion and sentiment
                    emotion_analysis = await ml_service.analyze_emotion(content)
                    sentiment_analysis = await ml_service.analyze_sentiment(content)
                    sentiment = sentiment_analysis.get("sentiment", "neutral")
                    
                    # Save user message
                    user_message = await chat_service.save_message(
                        user_id=user_id,
                        content=content,
                        is_user=True,
                        emotion_score=emotion_analysis.get("distress_level", 0),
                        sentiment=sentiment
                    )
                    
                    # Generate AI response
                    ai_response = await chat_service.generate_response(
                        user_id=user_id,
                        user_message=content,
                        emotion_analysis=emotion_analysis,
                        sentiment=sentiment
                    )
                    
                    # Save AI response
                    ai_message = await chat_service.save_message(
                        user_id=user_id,
                        content=ai_response,
                        is_user=False
                    )
                    
                    # Stop typing indicator
                    await manager.send_personal_message({
                        "type": "typing_indicator",
                        "is_typing": False
                    }, user_id)
                    
                    # Send AI response
                    await manager.send_personal_message({
                        "type": "message",
                        "id": ai_message.id,
                        "content": ai_response,
                        "is_user": False,
                        "timestamp": ai_message.timestamp.isoformat(),
                        "emotion_analysis": emotion_analysis
                    }, user_id)
                    
                elif message_type == "typing_status":
                    is_typing = data.get("is_typing", False)
                    await manager.broadcast_typing_status(user_id, is_typing)
                    
            except Exception as e:
                logger.error(f"Error processing WebSocket message: {e}")
                await manager.send_personal_message({
                    "type": "error",
                    "content": "Sorry, I encountered an error processing your message. Please try again."
                }, user_id)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        try:
            await websocket.close()
        except:
            pass

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

# Exception handlers
@app.exception_handler(CustomHTTPException)
async def custom_exception_handler(request, exc: CustomHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": exc.error_code,
            "timestamp": datetime.utcnow().isoformat()
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )