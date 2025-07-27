from pydantic import BaseModel, validator
from typing import Optional, List, Dict
from datetime import datetime

class MoodBase(BaseModel):
    mood_score: int
    emotions: List[str] = []
    notes: Optional[str] = None
    energy_level: Optional[int] = None
    stress_level: Optional[int] = None
    sleep_quality: Optional[int] = None

class MoodCreate(MoodBase):
    triggers: Optional[List[str]] = []
    activities: Optional[List[str]] = []
    location: Optional[str] = None
    
    @validator('mood_score')
    def validate_mood_score(cls, v):
        if not 1 <= v <= 10:
            raise ValueError('Mood score must be between 1 and 10')
        return v
    
    @validator('energy_level', 'stress_level', 'sleep_quality')
    def validate_levels(cls, v):
        if v is not None and not 1 <= v <= 10:
            raise ValueError('Level scores must be between 1 and 10')
        return v

class MoodEntry(BaseModel):
    id: int
    user_id: int
    mood_score: int
    emotions: List[str]
    notes: Optional[str] = None
    energy_level: Optional[int] = None
    stress_level: Optional[int] = None
    sleep_quality: Optional[int] = None
    triggers: List[str] = []
    activities: List[str] = []
    location: Optional[str] = None
    timestamp: datetime
    
    class Config:
        from_attributes = True

class MoodTrend(BaseModel):
    period: str  # daily, weekly, monthly
    average_mood: float
    mood_change: float  # compared to previous period
    dominant_emotions: List[str]
    improvement_areas: List[str]

class MoodAnalytics(BaseModel):
    current_average: float
    trend: str  # improving, stable, declining
    mood_distribution: Dict[str, int]  # mood ranges and counts
    emotion_frequency: Dict[str, int]
    correlations: Dict[str, float]  # correlations with other factors
    insights: List[str]
    recommendations: List[str]

class MoodInsight(BaseModel):
    type: str  # pattern, correlation, recommendation
    title: str
    description: str
    confidence: float
    actionable: bool
    suggested_actions: List[str] = []