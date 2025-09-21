export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ChatMessage {
  id: number;
  content: string;
  is_user: boolean;
  timestamp: string;
  emotion_analysis?: {
    emotion: string;
    confidence: number;
    distress_level: number;
  };
}

export interface MoodEntry {
  id: number;
  mood_score: number;
  energy_level: number;
  anxiety_level: number;
  notes?: string;
  date: string;
}

export interface MoodAnalytics {
  average_mood: number;
  mood_trend: 'improving' | 'declining' | 'stable';
  total_entries: number;
  streak_days: number;
  mood_distribution: Record<string, number>;
  weekly_averages: Array<{
    week: string;
    mood: number;
    energy: number;
    anxiety: number;
  }>;
}

export interface CopingStrategy {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
}