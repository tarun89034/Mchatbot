from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import json
import statistics

from models.database import get_db, MoodEntryModel
from models.mood import MoodCreate, MoodEntry, MoodAnalytics, MoodTrend, MoodInsight
from utils.exceptions import CustomHTTPException
from fastapi import status

class MoodService:
    def __init__(self):
        self.emotion_categories = {
            "positive": ["happy", "joyful", "excited", "content", "grateful", "peaceful", "energetic"],
            "negative": ["sad", "angry", "frustrated", "anxious", "worried", "depressed", "irritated"],
            "neutral": ["calm", "neutral", "indifferent", "tired", "focused"]
        }

    async def create_mood_entry(self, user_id: int, mood_data: MoodCreate) -> MoodEntry:
        """Create a new mood entry"""
        db = next(get_db())
        try:
            entry = MoodEntryModel(
                user_id=user_id,
                mood_score=mood_data.mood_score,
                emotions=json.dumps(mood_data.emotions),
                notes=mood_data.notes,
                energy_level=mood_data.energy_level,
                stress_level=mood_data.stress_level,
                sleep_quality=mood_data.sleep_quality,
                triggers=json.dumps(mood_data.triggers or []),
                activities=json.dumps(mood_data.activities or []),
                location=mood_data.location
            )
            
            db.add(entry)
            db.commit()
            db.refresh(entry)
            
            return MoodEntry(
                id=entry.id,
                user_id=entry.user_id,
                mood_score=entry.mood_score,
                emotions=json.loads(entry.emotions) if entry.emotions else [],
                notes=entry.notes,
                energy_level=entry.energy_level,
                stress_level=entry.stress_level,
                sleep_quality=entry.sleep_quality,
                triggers=json.loads(entry.triggers) if entry.triggers else [],
                activities=json.loads(entry.activities) if entry.activities else [],
                location=entry.location,
                timestamp=entry.timestamp
            )
            
        except Exception as e:
            db.rollback()
            raise CustomHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create mood entry",
                error_code="MOOD_ENTRY_FAILED"
            )
        finally:
            db.close()

    async def get_mood_history(self, user_id: int, days: int = 30) -> List[MoodEntry]:
        """Get mood history for specified number of days"""
        db = next(get_db())
        try:
            start_date = datetime.utcnow() - timedelta(days=days)
            
            entries = db.query(MoodEntryModel)\
                       .filter(MoodEntryModel.user_id == user_id)\
                       .filter(MoodEntryModel.timestamp >= start_date)\
                       .order_by(desc(MoodEntryModel.timestamp))\
                       .all()
            
            return [
                MoodEntry(
                    id=entry.id,
                    user_id=entry.user_id,
                    mood_score=entry.mood_score,
                    emotions=json.loads(entry.emotions) if entry.emotions else [],
                    notes=entry.notes,
                    energy_level=entry.energy_level,
                    stress_level=entry.stress_level,
                    sleep_quality=entry.sleep_quality,
                    triggers=json.loads(entry.triggers) if entry.triggers else [],
                    activities=json.loads(entry.activities) if entry.activities else [],
                    location=entry.location,
                    timestamp=entry.timestamp
                )
                for entry in entries
            ]
            
        finally:
            db.close()

    async def get_mood_analytics(self, user_id: int, days: int = 30) -> MoodAnalytics:
        """Generate comprehensive mood analytics"""
        db = next(get_db())
        try:
            start_date = datetime.utcnow() - timedelta(days=days)
            
            entries = db.query(MoodEntryModel)\
                       .filter(MoodEntryModel.user_id == user_id)\
                       .filter(MoodEntryModel.timestamp >= start_date)\
                       .all()
            
            if not entries:
                return MoodAnalytics(
                    current_average=0.0,
                    trend="insufficient_data",
                    mood_distribution={},
                    emotion_frequency={},
                    correlations={},
                    insights=[],
                    recommendations=[]
                )
            
            # Calculate basic statistics
            mood_scores = [entry.mood_score for entry in entries]
            current_average = statistics.mean(mood_scores)
            
            # Calculate trend
            trend = self._calculate_trend(entries)
            
            # Mood distribution
            mood_distribution = self._calculate_mood_distribution(mood_scores)
            
            # Emotion frequency
            emotion_frequency = self._calculate_emotion_frequency(entries)
            
            # Correlations with other factors
            correlations = self._calculate_correlations(entries)
            
            # Generate insights
            insights = self._generate_insights(entries, current_average, trend)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(insights, correlations, emotion_frequency)
            
            return MoodAnalytics(
                current_average=round(current_average, 2),
                trend=trend,
                mood_distribution=mood_distribution,
                emotion_frequency=emotion_frequency,
                correlations=correlations,
                insights=insights,
                recommendations=recommendations
            )
            
        finally:
            db.close()

    def _calculate_trend(self, entries: List[MoodEntryModel]) -> str:
        """Calculate mood trend over time"""
        if len(entries) < 7:
            return "insufficient_data"
        
        # Sort by timestamp
        sorted_entries = sorted(entries, key=lambda x: x.timestamp)
        
        # Split into two halves and compare averages
        mid_point = len(sorted_entries) // 2
        first_half = sorted_entries[:mid_point]
        second_half = sorted_entries[mid_point:]
        
        first_avg = statistics.mean([e.mood_score for e in first_half])
        second_avg = statistics.mean([e.mood_score for e in second_half])
        
        difference = second_avg - first_avg
        
        if difference > 0.5:
            return "improving"
        elif difference < -0.5:
            return "declining"
        else:
            return "stable"

    def _calculate_mood_distribution(self, mood_scores: List[int]) -> Dict[str, int]:
        """Calculate distribution of mood scores by ranges"""
        distribution = {
            "very_low": 0,    # 1-2
            "low": 0,         # 3-4
            "moderate": 0,    # 5-6
            "good": 0,        # 7-8
            "excellent": 0    # 9-10
        }
        
        for score in mood_scores:
            if score <= 2:
                distribution["very_low"] += 1
            elif score <= 4:
                distribution["low"] += 1
            elif score <= 6:
                distribution["moderate"] += 1
            elif score <= 8:
                distribution["good"] += 1
            else:
                distribution["excellent"] += 1
        
        return distribution

    def _calculate_emotion_frequency(self, entries: List[MoodEntryModel]) -> Dict[str, int]:
        """Calculate frequency of different emotions"""
        emotion_count = {}
        
        for entry in entries:
            if entry.emotions:
                emotions = json.loads(entry.emotions)
                for emotion in emotions:
                    emotion_count[emotion] = emotion_count.get(emotion, 0) + 1
        
        return emotion_count

    def _calculate_correlations(self, entries: List[MoodEntryModel]) -> Dict[str, float]:
        """Calculate correlations between mood and other factors"""
        correlations = {}
        
        if len(entries) < 5:
            return correlations
        
        mood_scores = [entry.mood_score for entry in entries]
        
        # Energy correlation
        energy_levels = [entry.energy_level for entry in entries if entry.energy_level is not None]
        if len(energy_levels) == len(mood_scores) and len(energy_levels) > 3:
            correlations["energy"] = self._pearson_correlation(mood_scores, energy_levels)
        
        # Sleep quality correlation
        sleep_scores = [entry.sleep_quality for entry in entries if entry.sleep_quality is not None]
        if len(sleep_scores) == len(mood_scores) and len(sleep_scores) > 3:
            correlations["sleep"] = self._pearson_correlation(mood_scores, sleep_scores)
        
        # Stress level correlation (negative expected)
        stress_levels = [entry.stress_level for entry in entries if entry.stress_level is not None]
        if len(stress_levels) == len(mood_scores) and len(stress_levels) > 3:
            correlations["stress"] = self._pearson_correlation(mood_scores, stress_levels)
        
        return correlations

    def _pearson_correlation(self, x: List[float], y: List[float]) -> float:
        """Calculate Pearson correlation coefficient"""
        if len(x) != len(y) or len(x) < 2:
            return 0.0
        
        n = len(x)
        sum_x = sum(x)
        sum_y = sum(y)
        sum_x2 = sum(xi ** 2 for xi in x)
        sum_y2 = sum(yi ** 2 for yi in y)
        sum_xy = sum(xi * yi for xi, yi in zip(x, y))
        
        numerator = n * sum_xy - sum_x * sum_y
        denominator = ((n * sum_x2 - sum_x ** 2) * (n * sum_y2 - sum_y ** 2)) ** 0.5
        
        if denominator == 0:
            return 0.0
        
        return round(numerator / denominator, 3)

    def _generate_insights(self, entries: List[MoodEntryModel], average: float, trend: str) -> List[str]:
        """Generate actionable insights from mood data"""
        insights = []
        
        # Trend insights
        if trend == "improving":
            insights.append("Your mood has been trending upward - great progress!")
        elif trend == "declining":
            insights.append("Your mood has been declining recently. Consider reaching out for additional support.")
        
        # Average insights
        if average >= 7:
            insights.append("You're maintaining good overall mood levels.")
        elif average <= 4:
            insights.append("Your recent mood levels suggest you might benefit from additional coping strategies.")
        
        # Pattern insights
        recent_entries = sorted(entries, key=lambda x: x.timestamp)[-7:]  # Last week
        if len(recent_entries) >= 5:
            recent_scores = [e.mood_score for e in recent_entries]
            if max(recent_scores) - min(recent_scores) > 5:
                insights.append("You've experienced significant mood fluctuations recently.")
        
        # Emotion insights
        all_emotions = []
        for entry in entries:
            if entry.emotions:
                all_emotions.extend(json.loads(entry.emotions))
        
        if all_emotions:
            emotion_count = {}
            for emotion in all_emotions:
                emotion_count[emotion] = emotion_count.get(emotion, 0) + 1
            
            most_common = max(emotion_count, key=emotion_count.get)
            if emotion_count[most_common] > len(entries) * 0.3:
                if most_common in self.emotion_categories["negative"]:
                    insights.append(f"You've been experiencing {most_common} frequently. Consider exploring coping strategies for this emotion.")
                elif most_common in self.emotion_categories["positive"]:
                    insights.append(f"You've been feeling {most_common} often - that's wonderful!")
        
        return insights

    def _generate_recommendations(self, insights: List[str], correlations: Dict[str, float], emotions: Dict[str, int]) -> List[str]:
        """Generate personalized recommendations"""
        recommendations = []
        
        # Sleep recommendations
        if "sleep" in correlations and correlations["sleep"] > 0.5:
            recommendations.append("Your mood appears to be strongly linked to sleep quality. Prioritizing good sleep hygiene could help improve your overall wellbeing.")
        
        # Energy recommendations
        if "energy" in correlations and correlations["energy"] > 0.5:
            recommendations.append("Your energy levels seem to correlate with your mood. Regular exercise and proper nutrition might help boost both.")
        
        # Stress recommendations
        if "stress" in correlations and correlations["stress"] < -0.3:
            recommendations.append("High stress levels appear to negatively impact your mood. Consider stress-reduction techniques like meditation or deep breathing.")
        
        # Emotion-based recommendations
        if emotions:
            top_negative_emotions = [(k, v) for k, v in emotions.items() if k in self.emotion_categories["negative"]]
            if top_negative_emotions:
                top_negative = max(top_negative_emotions, key=lambda x: x[1])
                emotion_name = top_negative[0]
                
                emotion_recommendations = {
                    "anxious": "Try grounding techniques like the 5-4-3-2-1 method when feeling anxious.",
                    "sad": "Engaging in activities you enjoy and connecting with supportive people can help with sadness.",
                    "angry": "Physical activity or journaling might help process angry feelings constructively.",
                    "stressed": "Break large tasks into smaller steps and practice saying no to non-essential commitments."
                }
                
                if emotion_name in emotion_recommendations:
                    recommendations.append(emotion_recommendations[emotion_name])
        
        # General recommendations
        if not recommendations:
            recommendations.extend([
                "Keep tracking your mood to identify patterns and triggers.",
                "Consider establishing a daily routine that includes activities you enjoy.",
                "Regular check-ins with supportive friends or family can boost your mood."
            ])
        
        return recommendations[:5]  # Limit to 5 recommendations