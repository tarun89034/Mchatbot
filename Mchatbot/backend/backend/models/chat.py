from pydantic import BaseModel, validator
from typing import Optional, Dict, List
from datetime import datetime

class ChatBase(BaseModel):
    content: str

class ChatCreate(ChatBase):
    @validator('content')
    def validate_content(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Message content cannot be empty')
        if len(v) > 1000:
            raise ValueError('Message content too long (max 1000 characters)')
        return v.strip()

class ChatMessage(BaseModel):
    id: int
    user_id: int
    content: str
    is_user: bool
    timestamp: datetime
    sentiment: Optional[str] = None
    emotion_score: Optional[float] = None
    detected_emotions: Optional[Dict] = None
    intent: Optional[str] = None
    response_type: Optional[str] = None
    escalation_triggered: bool = False
    
    class Config:
        from_attributes = True

class ChatResponse(BaseModel):
    id: int
    content: str
    is_user: bool
    timestamp: datetime
    emotion_analysis: Optional[Dict] = None
    coping_strategies: Optional[List[Dict]] = None
    escalation_info: Optional[Dict] = None

class ConversationContext(BaseModel):
    user_id: int
    recent_messages: List[str]
    user_profile: Dict
    mood_trend: Optional[str] = None
    current_emotion_state: Optional[Dict] = None
    conversation_topic: Optional[str] = None
    session_length: int = 0