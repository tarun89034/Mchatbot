from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func
import os
from pathlib import Path

# Database configuration
DATABASE_URL = "sqlite:///./mental_health_chatbot.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database models
class UserModel(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # User preferences
    preferred_name = Column(String)
    age_range = Column(String)
    timezone = Column(String, default="UTC")
    notification_preferences = Column(Text)  # JSON string
    
    # Relationships
    chat_messages = relationship("ChatMessageModel", back_populates="user")
    mood_entries = relationship("MoodEntryModel", back_populates="user")

class ChatMessageModel(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    is_user = Column(Boolean, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # AI analysis fields
    sentiment = Column(String)  # positive, negative, neutral
    emotion_score = Column(Float)  # 0-1 distress level
    detected_emotions = Column(Text)  # JSON string of emotions
    intent = Column(String)  # detected intent category
    
    # Response metadata
    response_type = Column(String)  # empathetic, crisis, coping, etc.
    coping_strategies_suggested = Column(Text)  # JSON string
    escalation_triggered = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("UserModel", back_populates="chat_messages")

class MoodEntryModel(Base):
    __tablename__ = "mood_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mood_score = Column(Integer, nullable=False)  # 1-10 scale
    emotions = Column(Text)  # JSON array of emotions
    notes = Column(Text)
    energy_level = Column(Integer)  # 1-10 scale
    stress_level = Column(Integer)  # 1-10 scale
    sleep_quality = Column(Integer)  # 1-10 scale
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Context
    triggers = Column(Text)  # JSON array of trigger categories
    activities = Column(Text)  # JSON array of activities
    location = Column(String)
    weather = Column(String)
    
    # Relationships
    user = relationship("UserModel", back_populates="mood_entries")

class CopingStrategyModel(Base):
    __tablename__ = "coping_strategies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # breathing, grounding, cognitive, etc.
    description = Column(Text, nullable=False)
    instructions = Column(Text, nullable=False)
    duration_minutes = Column(Integer)
    difficulty_level = Column(String)  # easy, medium, hard
    effectiveness_emotions = Column(Text)  # JSON array of emotions this helps with
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UserProgressModel(Base):
    __tablename__ = "user_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    metric_name = Column(String, nullable=False)  # mood_average, chat_frequency, etc.
    metric_value = Column(Float, nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    period = Column(String, default="daily")  # daily, weekly, monthly

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database and create tables"""
    # Create database directory if it doesn't exist
    db_dir = Path(DATABASE_URL.split("///")[-1]).parent
    db_dir.mkdir(exist_ok=True)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Seed initial data
    _seed_coping_strategies()

def _seed_coping_strategies():
    """Seed initial coping strategies"""
    db = SessionLocal()
    try:
        # Check if strategies already exist
        existing = db.query(CopingStrategyModel).first()
        if existing:
            return
        
        strategies = [
            {
                "name": "4-7-8 Breathing",
                "category": "breathing",
                "description": "A calming breathing technique to reduce anxiety and stress",
                "instructions": "1. Exhale completely through your mouth\n2. Inhale through nose for 4 counts\n3. Hold breath for 7 counts\n4. Exhale through mouth for 8 counts\n5. Repeat 3-4 times",
                "duration_minutes": 5,
                "difficulty_level": "easy",
                "effectiveness_emotions": '["anxiety", "stress", "panic"]'
            },
            {
                "name": "5-4-3-2-1 Grounding",
                "category": "grounding",
                "description": "A sensory grounding technique to manage anxiety and panic",
                "instructions": "Notice and name:\n• 5 things you can see\n• 4 things you can touch\n• 3 things you can hear\n• 2 things you can smell\n• 1 thing you can taste",
                "duration_minutes": 3,
                "difficulty_level": "easy",
                "effectiveness_emotions": '["anxiety", "panic", "overwhelm"]'
            },
            {
                "name": "Progressive Muscle Relaxation",
                "category": "relaxation",
                "description": "Systematic tensing and relaxing of muscle groups",
                "instructions": "Starting with your toes:\n1. Tense the muscle group for 5 seconds\n2. Release and relax for 10 seconds\n3. Notice the difference\n4. Move up through your body",
                "duration_minutes": 15,
                "difficulty_level": "medium",
                "effectiveness_emotions": '["stress", "tension", "anxiety"]'
            },
            {
                "name": "Cognitive Reframing",
                "category": "cognitive",
                "description": "Challenge and reframe negative thought patterns",
                "instructions": "1. Identify the negative thought\n2. Ask: Is this thought realistic?\n3. What evidence supports/contradicts it?\n4. What would you tell a friend?\n5. Create a balanced perspective",
                "duration_minutes": 10,
                "difficulty_level": "medium",
                "effectiveness_emotions": '["depression", "negative_thinking", "self_criticism"]'
            },
            {
                "name": "Mindful Walking",
                "category": "mindfulness",
                "description": "Walking meditation to center yourself and reduce stress",
                "instructions": "1. Walk slowly and deliberately\n2. Focus on each step\n3. Notice your breathing\n4. Observe your surroundings without judgment\n5. Return attention to walking when mind wanders",
                "duration_minutes": 10,
                "difficulty_level": "easy",
                "effectiveness_emotions": '["stress", "rumination", "restlessness"]'
            }
        ]
        
        for strategy_data in strategies:
            strategy = CopingStrategyModel(**strategy_data)
            db.add(strategy)
        
        db.commit()
        
    except Exception as e:
        print(f"Error seeding coping strategies: {e}")
        db.rollback()
    finally:
        db.close()