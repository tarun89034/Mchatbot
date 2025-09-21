import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from textblob import TextBlob
import nltk
from typing import Dict, List, Optional
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor
import hashlib
import time
from functools import lru_cache

# Download required NLTK data
try:
    nltk.download('punkt', quiet=True)
    nltk.download('vader_lexicon', quiet=True)
except:
    pass

from nltk.sentiment import SentimentIntensityAnalyzer

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        self.emotion_model = None
        self.emotion_tokenizer = None
        self.sentiment_analyzer = None
        self.emotion_pipeline = None
        self.executor = ThreadPoolExecutor(max_workers=2)
        
        # Cache for ML responses
        self.emotion_cache = {}
        self.sentiment_cache = {}
        self.cache_ttl = 3600  # 1 hour cache TTL
        self.max_cache_size = 1000  # Maximum cache entries
        
        # Emotion categories for mental health
        self.emotion_mapping = {
            "joy": "positive",
            "happiness": "positive", 
            "love": "positive",
            "optimism": "positive",
            "sadness": "negative",
            "anger": "negative",
            "fear": "negative",
            "anxiety": "negative",
            "disgust": "negative",
            "pessimism": "negative",
            "surprise": "neutral"
        }
        
        # Crisis keywords for immediate detection
        self.crisis_indicators = [
            "suicide", "kill myself", "end it all", "don't want to live",
            "hurt myself", "self-harm", "ending my life", "die", "death"
        ]
        
        # Therapy-style response templates
        self.response_templates = {
            "high_distress": [
                "I hear that you're going through a really difficult time. Your feelings are valid, and it's important that you're reaching out.",
                "What you're experiencing sounds incredibly overwhelming. Let's take this one step at a time.",
                "I can sense the pain in your words. You don't have to carry this burden alone."
            ],
            "moderate_support": [
                "It sounds like you're dealing with some challenging emotions right now. Can you tell me more about what's been weighing on you?",
                "I appreciate you sharing what's on your mind. These feelings you're describing are more common than you might think.",
                "Thank you for being open about how you're feeling. What has been the most difficult part of your day?"
            ],
            "conversational": [
                "I'm here to listen. How has your day been treating you?",
                "What's been on your mind lately? I'm here to support you however I can.",
                "How are you feeling right now? Sometimes it helps just to put feelings into words."
            ]
        }

    async def initialize(self):
        """Initialize ML models asynchronously"""
        try:
            # Initialize sentiment analyzer
            self.sentiment_analyzer = SentimentIntensityAnalyzer()
            logger.info("Sentiment analyzer initialized successfully")
            
            # Initialize emotion detection pipeline with a smaller, faster model
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                self.executor,
                self._load_emotion_model
            )
            
            logger.info("ML Service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize ML models: {e}")
            # Continue without ML models - use rule-based fallbacks
            self.sentiment_analyzer = None
            self.emotion_pipeline = None

    def _load_emotion_model(self):
        """Load emotion detection model in thread executor"""
        try:
            # Use a smaller, faster model for better performance
            model_name = "j-hartmann/emotion-english-distilroberta-base"
            
            self.emotion_pipeline = pipeline(
                "text-classification",
                model=model_name,
                device=-1,  # Use CPU for compatibility
                return_all_scores=True
            )
            
            logger.info("Emotion detection model loaded successfully")
            
        except Exception as e:
            logger.warning(f"Failed to load emotion model: {e}. Using rule-based emotion detection.")
            self.emotion_pipeline = None
        except RuntimeError as e:
            if "CUDA" in str(e):
                logger.warning("CUDA not available, falling back to CPU for emotion model")
                try:
                    self.emotion_pipeline = pipeline(
                        "text-classification",
                        model=model_name,
                        device=-1,
                        return_all_scores=True
                    )
                    logger.info("Emotion detection model loaded successfully on CPU")
                except Exception as cpu_e:
                    logger.warning(f"Failed to load emotion model on CPU: {cpu_e}. Using rule-based detection.")
                    self.emotion_pipeline = None
            else:
                logger.warning(f"Failed to load emotion model: {e}. Using rule-based emotion detection.")
                self.emotion_pipeline = None

    async def analyze_emotion(self, text: str) -> Dict:
        """Analyze emotion and calculate distress level"""
        try:
            # Check cache first
            cache_key = self._get_cache_key(text, "emotion")
            cached_result = self._get_from_cache(self.emotion_cache, cache_key)
            if cached_result:
                logger.info(f"Emotion analysis cache hit for text: {text[:50]}...")
                return cached_result
            
            # Quick crisis check
            crisis_detected = self._detect_crisis_keywords(text)
            if crisis_detected:
                result = {
                    "dominant_emotion": "crisis",
                    "distress_level": 1.0,
                    "emotions": {"crisis": 1.0},
                    "crisis_detected": True,
                    "model_used": "crisis_detection",
                    "confidence": 0.95
                }
                self._add_to_cache(self.emotion_cache, cache_key, result)
                return result
            
            if self.emotion_pipeline:
                # Use ML model for emotion detection
                try:
                    loop = asyncio.get_event_loop()
                    emotions = await loop.run_in_executor(
                        self.executor,
                        self._predict_emotions,
                        text
                    )
                    model_used = "ml_model"
                except Exception as ml_error:
                    logger.warning(f"ML emotion analysis failed: {ml_error}. Falling back to rule-based detection.")
                    emotions = self._rule_based_emotion_detection(text)
                    model_used = "rule_based_fallback"
            else:
                # Fallback to rule-based emotion detection
                emotions = self._rule_based_emotion_detection(text)
                model_used = "rule_based"
            
            # Calculate distress level
            distress_level = self._calculate_distress_level(emotions)
            
            # Get dominant emotion
            dominant_emotion = max(emotions.items(), key=lambda x: x[1])[0] if emotions else "neutral"
            
            result = {
                "dominant_emotion": dominant_emotion,
                "distress_level": distress_level,
                "emotions": emotions,
                "crisis_detected": crisis_detected,
                "model_used": model_used,
                "confidence": self._calculate_confidence(emotions, model_used)
            }
            
            # Cache the result
            self._add_to_cache(self.emotion_cache, cache_key, result)
            return result
            
        except Exception as e:
            logger.error(f"Error in emotion analysis: {e}")
            return {
                "dominant_emotion": "neutral",
                "distress_level": 0.3,
                "emotions": {"neutral": 1.0},
                "crisis_detected": False,
                "model_used": "error_fallback",
                "confidence": 0.1
            }

    def _predict_emotions(self, text: str) -> Dict[str, float]:
        """Predict emotions using ML model"""
        try:
            results = self.emotion_pipeline(text)
            emotions = {}
            
            for result in results[0]:  # results is a list with one element
                emotion = result['label'].lower()
                score = result['score']
                emotions[emotion] = score
            
            return emotions
            
        except Exception as e:
            logger.error(f"Error in ML emotion prediction: {e}")
            return self._rule_based_emotion_detection(text)

    def _rule_based_emotion_detection(self, text: str) -> Dict[str, float]:
        """Rule-based emotion detection as fallback"""
        text_lower = text.lower()
        emotions = {}
        
        # Emotion keywords
        emotion_keywords = {
            "sadness": ["sad", "depressed", "down", "blue", "miserable", "hopeless", "empty"],
            "anxiety": ["anxious", "worried", "nervous", "scared", "panic", "afraid", "fearful"],
            "anger": ["angry", "mad", "furious", "annoyed", "irritated", "frustrated"],
            "joy": ["happy", "joyful", "excited", "great", "amazing", "wonderful", "good"],
            "fear": ["terrified", "frightened", "scared", "afraid", "worried", "anxious"],
            "disgust": ["disgusted", "sick", "revolted", "repulsed"],
            "surprise": ["surprised", "shocked", "amazed", "astonished"]
        }
        
        for emotion, keywords in emotion_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                emotions[emotion] = min(score / len(keywords), 1.0)
        
        if not emotions:
            emotions["neutral"] = 1.0
        
        return emotions

    async def analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment of text with confidence scores"""
        try:
            # Check cache first
            cache_key = self._get_cache_key(text, "sentiment")
            cached_result = self._get_from_cache(self.sentiment_cache, cache_key)
            if cached_result:
                logger.info(f"Sentiment analysis cache hit for text: {text[:50]}...")
                return cached_result
            
            if self.sentiment_analyzer:
                scores = self.sentiment_analyzer.polarity_scores(text)
                
                if scores['compound'] >= 0.05:
                    sentiment = "positive"
                elif scores['compound'] <= -0.05:
                    sentiment = "negative"
                else:
                    sentiment = "neutral"
                
                result = {
                    "sentiment": sentiment,
                    "confidence": abs(scores['compound']),
                    "scores": scores,
                    "model_used": "vader"
                }
                self._add_to_cache(self.sentiment_cache, cache_key, result)
                return result
            else:
                # Fallback using TextBlob
                try:
                    blob = TextBlob(text)
                    polarity = blob.sentiment.polarity
                    
                    if polarity > 0.1:
                        sentiment = "positive"
                    elif polarity < -0.1:
                        sentiment = "negative"
                    else:
                        sentiment = "neutral"
                    
                    result = {
                        "sentiment": sentiment,
                        "confidence": abs(polarity),
                        "scores": {"compound": polarity},
                        "model_used": "textblob"
                    }
                    self._add_to_cache(self.sentiment_cache, cache_key, result)
                    return result
                except Exception as textblob_error:
                    logger.warning(f"TextBlob sentiment analysis failed: {textblob_error}")
                    result = {
                        "sentiment": "neutral",
                        "confidence": 0.1,
                        "scores": {"compound": 0},
                        "model_used": "fallback"
                    }
                    self._add_to_cache(self.sentiment_cache, cache_key, result)
                    return result
                    
        except Exception as e:
            logger.error(f"Error in sentiment analysis: {e}")
            result = {
                "sentiment": "neutral",
                "confidence": 0.1,
                "scores": {"compound": 0},
                "model_used": "error_fallback"
            }
            self._add_to_cache(self.sentiment_cache, cache_key, result)
            return result

    def _detect_crisis_keywords(self, text: str) -> bool:
        """Detect crisis keywords in text"""
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in self.crisis_indicators)

    def _calculate_distress_level(self, emotions: Dict[str, float]) -> float:
        """Calculate overall distress level from emotions"""
        negative_emotions = ["sadness", "anger", "fear", "anxiety", "disgust"]
        positive_emotions = ["joy", "happiness", "love", "optimism"]
        
        negative_score = sum(emotions.get(emotion, 0) for emotion in negative_emotions)
        positive_score = sum(emotions.get(emotion, 0) for emotion in positive_emotions)
        
        # Calculate distress as ratio of negative to total emotional intensity
        total_intensity = negative_score + positive_score
        if total_intensity == 0:
            return 0.3  # Neutral baseline
        
        distress = negative_score / total_intensity
        return min(max(distress, 0.0), 1.0)  # Clamp between 0 and 1

    def _calculate_confidence(self, emotions: Dict[str, float], model_used: str) -> float:
        """Calculate confidence score for emotion analysis"""
        if model_used == "ml_model":
            # Higher confidence for ML model predictions
            max_emotion_score = max(emotions.values()) if emotions else 0
            return min(max_emotion_score * 1.2, 1.0)  # Boost ML confidence slightly
        elif model_used == "rule_based":
            # Lower confidence for rule-based detection
            max_emotion_score = max(emotions.values()) if emotions else 0
            return max_emotion_score * 0.7
        elif model_used == "crisis_detection":
            # High confidence for crisis detection
            return 0.95
        else:
            # Low confidence for fallback methods
            return 0.3

    def _get_cache_key(self, text: str, analysis_type: str) -> str:
        """Generate cache key for text analysis"""
        # Normalize text for consistent caching
        normalized_text = text.lower().strip()
        return hashlib.md5(f"{analysis_type}:{normalized_text}".encode()).hexdigest()

    def _get_from_cache(self, cache: dict, key: str) -> Optional[Dict]:
        """Get result from cache if not expired"""
        if key in cache:
            entry = cache[key]
            if time.time() - entry['timestamp'] < self.cache_ttl:
                return entry['result']
            else:
                # Remove expired entry
                del cache[key]
        return None

    def _add_to_cache(self, cache: dict, key: str, result: Dict):
        """Add result to cache with TTL"""
        # Clean up cache if it's too large
        if len(cache) >= self.max_cache_size:
            # Remove oldest entries
            oldest_keys = sorted(cache.keys(), key=lambda k: cache[k]['timestamp'])[:100]
            for old_key in oldest_keys:
                del cache[old_key]
        
        cache[key] = {
            'result': result,
            'timestamp': time.time()
        }

    async def generate_response(self, user_message: str, context) -> Optional[str]:
        """Generate contextual response using templates and user context"""
        try:
            # Analyze the user's current emotional state
            emotion_analysis = await self.analyze_emotion(user_message)
            distress_level = emotion_analysis["distress_level"]
            
            # Get user name for personalization
            user_name = context.user_profile.get("name", "")
            name_part = f"{user_name}, " if user_name else ""
            
            # Select response category based on distress level
            if distress_level > 0.7:
                template_category = "high_distress"
            elif distress_level > 0.4:
                template_category = "moderate_support"
            else:
                template_category = "conversational"
            
            # Select template based on message content and history
            templates = self.response_templates[template_category]
            selected_template = templates[len(user_message) % len(templates)]
            
            # Add personalization
            response = f"{name_part}{selected_template}"
            
            # Add follow-up based on detected emotions
            dominant_emotion = emotion_analysis["dominant_emotion"]
            if dominant_emotion in ["anxiety", "fear"]:
                response += "\n\nWould you like to try a quick grounding exercise together?"
            elif dominant_emotion == "sadness":
                response += "\n\nRemember that these feelings, while difficult, are temporary."
            elif dominant_emotion == "anger":
                response += "\n\nIt's completely valid to feel angry. Let's explore what might be behind these feelings."
            
            return response
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "I'm here to listen and support you. How are you feeling right now?"

    async def get_coping_strategies(self, emotions: List[str]) -> List[Dict]:
        """Get appropriate coping strategies for given emotions"""
        strategies = {
            "anxiety": {
                "name": "Box Breathing",
                "description": "A simple breathing technique to reduce anxiety",
                "instructions": "Breathe in for 4, hold for 4, breathe out for 4, hold for 4. Repeat 4 times."
            },
            "sadness": {
                "name": "Gentle Self-Care",
                "description": "Simple activities to nurture yourself",
                "instructions": "Try a warm bath, listen to comforting music, or reach out to someone who cares about you."
            },
            "anger": {
                "name": "Progressive Muscle Relaxation",
                "description": "Release physical tension associated with anger",
                "instructions": "Tense and release each muscle group, starting from your toes and working up to your head."
            },
            "stress": {
                "name": "5-4-3-2-1 Grounding",
                "description": "A grounding technique to center yourself",
                "instructions": "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste."
            }
        }
        
        return [strategies.get(emotion, strategies["stress"]) for emotion in emotions if emotion in strategies]

    def __del__(self):
        """Cleanup executor on deletion"""
        if hasattr(self, 'executor'):
            self.executor.shutdown(wait=False)