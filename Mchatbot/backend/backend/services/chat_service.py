from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import json

from models.database import get_db, ChatMessageModel, UserModel, CopingStrategyModel
from models.chat import ChatMessage, ChatResponse, ConversationContext
from services.ml_service import MLService
from utils.exceptions import CustomHTTPException
from fastapi import status

class ChatService:
    def __init__(self):
        self.ml_service = MLService()
        self.crisis_keywords = [
            "suicide", "kill myself", "end it all", "don't want to live",
            "hurt myself", "self-harm", "ending my life", "suicide plan"
        ]
        
    async def save_message(
        self,
        user_id: int,
        content: str,
        is_user: bool,
        emotion_score: Optional[float] = None,
        sentiment: Optional[str] = None,
        detected_emotions: Optional[Dict] = None,
        intent: Optional[str] = None,
        response_type: Optional[str] = None
    ) -> ChatMessage:
        """Save a chat message to database"""
        db = next(get_db())
        try:
            # Check for crisis indicators
            escalation_triggered = self._detect_crisis_indicators(content) if is_user else False
            
            message = ChatMessageModel(
                user_id=user_id,
                content=content,
                is_user=is_user,
                sentiment=sentiment,
                emotion_score=emotion_score,
                detected_emotions=json.dumps(detected_emotions) if detected_emotions else None,
                intent=intent,
                response_type=response_type,
                escalation_triggered=escalation_triggered
            )
            
            db.add(message)
            db.commit()
            db.refresh(message)
            
            return ChatMessage(
                id=message.id,
                user_id=message.user_id,
                content=message.content,
                is_user=message.is_user,
                timestamp=message.timestamp,
                sentiment=message.sentiment,
                emotion_score=message.emotion_score,
                escalation_triggered=message.escalation_triggered
            )
            
        except Exception as e:
            db.rollback()
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save message",
                error_code="MESSAGE_SAVE_FAILED"
            )
        finally:
            db.close()

    async def get_chat_history(self, user_id: int, limit: int = 50) -> List[ChatResponse]:
        """Get user's recent chat history"""
        db = next(get_db())
        try:
            messages = db.query(ChatMessageModel)\
                        .filter(ChatMessageModel.user_id == user_id)\
                        .order_by(ChatMessageModel.timestamp.desc())\
                        .limit(limit)\
                        .all()
            
            return [
                ChatResponse(
                    id=msg.id,
                    content=msg.content,
                    is_user=msg.is_user,
                    timestamp=msg.timestamp,
                    emotion_analysis={
                        "sentiment": msg.sentiment,
                        "emotion_score": msg.emotion_score,
                        "detected_emotions": json.loads(msg.detected_emotions) if msg.detected_emotions else None
                    } if msg.is_user else None
                )
                for msg in reversed(messages)
            ]
        finally:
            db.close()

    async def generate_response(
        self,
        user_id: int,
        user_message: str,
        emotion_analysis: Dict,
        sentiment: str
    ) -> str:
        """Generate AI response based on user message and emotional state"""
        try:
            # Get conversation context
            context = await self._get_conversation_context(user_id)
            
            # Check for crisis situation
            if self._detect_crisis_indicators(user_message):
                return await self._generate_crisis_response(user_message, context)
            
            # Determine response type based on emotion analysis
            distress_level = emotion_analysis.get("distress_level", 0)
            dominant_emotion = emotion_analysis.get("dominant_emotion", "neutral")
            
            if distress_level > 0.7:
                return await self._generate_high_distress_response(user_message, context, dominant_emotion)
            elif distress_level > 0.4:
                return await self._generate_moderate_support_response(user_message, context, dominant_emotion)
            else:
                return await self._generate_conversational_response(user_message, context)
                
        except Exception as e:
            # Fallback response if AI generation fails
            return "I hear you, and I want you to know that your feelings are valid. Sometimes it helps to take a moment to breathe. Would you like to try a quick breathing exercise together?"

    async def _get_conversation_context(self, user_id: int) -> ConversationContext:
        """Get conversation context for the user"""
        db = next(get_db())
        try:
            # Get recent messages
            recent_messages = db.query(ChatMessageModel)\
                               .filter(ChatMessageModel.user_id == user_id)\
                               .order_by(ChatMessageModel.timestamp.desc())\
                               .limit(10)\
                               .all()
            
            # Get user profile
            user = db.query(UserModel).filter(UserModel.id == user_id).first()
            
            return ConversationContext(
                user_id=user_id,
                recent_messages=[msg.content for msg in reversed(recent_messages)],
                user_profile={
                    "name": user.preferred_name or user.name,
                    "age_range": user.age_range
                },
                session_length=len(recent_messages)
            )
        finally:
            db.close()

    def _detect_crisis_indicators(self, message: str) -> bool:
        """Detect crisis indicators in user message"""
        message_lower = message.lower()
        return any(keyword in message_lower for keyword in self.crisis_keywords)

    async def _generate_crisis_response(self, user_message: str, context: ConversationContext) -> str:
        """Generate crisis intervention response"""
        user_name = context.user_profile.get("name", "")
        name_part = f"{user_name}, " if user_name else ""
        
        return f"""{name_part}I'm really concerned about what you're sharing with me. Your life has value, and there are people who want to help you through this difficult time.

Please reach out to a crisis helpline right away:
• National Suicide Prevention Lifeline: 988 or 1-800-273-8255
• Crisis Text Line: Text HOME to 741741
• International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

You don't have to go through this alone. Professional counselors are available 24/7 and they understand what you're experiencing. Would you be willing to reach out to one of these resources?

If you're in immediate danger, please call emergency services (911) or go to your nearest emergency room."""

    async def _generate_high_distress_response(self, user_message: str, context: ConversationContext, emotion: str) -> str:
        """Generate response for high emotional distress"""
        user_name = context.user_profile.get("name", "")
        name_part = f"{user_name}, " if user_name else ""
        
        # Get appropriate coping strategy
        coping_strategy = await self._get_coping_strategy(emotion)
        
        base_response = f"{name_part}I can sense that you're going through a really difficult time right now, and I want you to know that your feelings are completely valid. What you're experiencing sounds overwhelming."
        
        if coping_strategy:
            return f"""{base_response}

Let's try something together that might help you feel a bit more grounded. Would you be open to trying this coping technique?

**{coping_strategy['name']}**
{coping_strategy['instructions']}

This technique is particularly helpful for {emotion}. Take your time with it, and remember that it's okay if it doesn't feel perfect the first time.

How are you feeling right now? I'm here to listen."""
        else:
            return f"""{base_response}

Right now, let's focus on getting through this moment. Can you try taking three slow, deep breaths with me?

1. Breathe in slowly for 4 counts
2. Hold for 4 counts  
3. Breathe out slowly for 6 counts

You're not alone in this. What's one small thing that usually brings you even a tiny bit of comfort?"""

    async def _generate_moderate_support_response(self, user_message: str, context: ConversationContext, emotion: str) -> str:
        """Generate supportive response for moderate distress"""
        user_name = context.user_profile.get("name", "")
        name_part = f"{user_name}, " if user_name else ""
        
        empathy_responses = {
            "anxiety": f"{name_part}I hear that you're feeling anxious, and that can be really uncomfortable. Anxiety often tries to convince us that things are worse than they are.",
            "sadness": f"{name_part}It sounds like you're carrying some heavy feelings right now. Sadness can feel overwhelming, but it's also a natural response to difficult situations.",
            "stress": f"{name_part}It sounds like you're under a lot of pressure right now. Stress can make everything feel more difficult than usual.",
            "anger": f"{name_part}I can sense your frustration, and it's understandable to feel angry when things aren't going the way you hoped.",
            "fear": f"{name_part}Fear can be paralyzing, and it sounds like you're dealing with some scary thoughts or situations right now."
        }
        
        base_response = empathy_responses.get(emotion, f"{name_part}I hear you, and I want you to know that what you're feeling makes sense given what you're going through.")
        
        return f"""{base_response}

Can you tell me a bit more about what's contributing to these feelings? Sometimes talking through what's happening can help us understand it better.

In the meantime, remember that difficult emotions are temporary, even when they feel overwhelming. You've gotten through tough times before, and you have the strength to get through this too."""

    async def _generate_conversational_response(self, user_message: str, context: ConversationContext) -> str:
        """Generate conversational response for stable emotional state"""
        user_name = context.user_profile.get("name", "")
        
        # Use ML service to generate contextual response
        if hasattr(self.ml_service, 'generate_response'):
            response = await self.ml_service.generate_response(user_message, context)
            if response:
                return response
        
        # Fallback conversational responses
        supportive_responses = [
            f"Thank you for sharing that with me. How has your day been overall?",
            f"I appreciate you opening up. What's been on your mind lately?",
            f"It sounds like you're reflecting on some important things. How are you feeling about everything?",
            f"I'm glad we can talk about this. What would be most helpful for you right now?"
        ]
        
        # Simple response selection based on message content
        if "good" in user_message.lower() or "better" in user_message.lower():
            return f"I'm so glad to hear that! It's wonderful when things feel a bit brighter. What's been contributing to these positive feelings?"
        elif "work" in user_message.lower() or "job" in user_message.lower():
            return f"Work can definitely impact how we feel. How has your work-life balance been lately?"
        elif "family" in user_message.lower() or "friend" in user_message.lower():
            return f"Relationships can be such an important part of our wellbeing. How are things going with the people close to you?"
        else:
            return supportive_responses[len(user_message) % len(supportive_responses)]

    async def _get_coping_strategy(self, emotion: str) -> Optional[Dict]:
        """Get appropriate coping strategy for emotion"""
        db = next(get_db())
        try:
            strategy = db.query(CopingStrategyModel)\
                        .filter(CopingStrategyModel.effectiveness_emotions.contains(emotion))\
                        .first()
            
            if strategy:
                return {
                    "name": strategy.name,
                    "instructions": strategy.instructions,
                    "duration": strategy.duration_minutes
                }
            return None
        finally:
            db.close()