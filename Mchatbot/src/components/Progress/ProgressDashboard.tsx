import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { MoodEntry, MoodAnalytics } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Target, Calendar, Award, Brain, Heart, Zap, AlertCircle } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

const ProgressDashboard: React.FC = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [analytics, setAnalytics] = useState<MoodAnalytics | null>(null);
  const [timeRange, setTimeRange] = useState(30);
  const { request, loading } = useApi();

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      const [entriesData, analyticsData] = await Promise.all([
        request(`/api/mood/history?days=${timeRange}`),
        request(`/api/mood/analytics?days=${timeRange}`)
      ]);
      setMoodEntries(entriesData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load progress data:', error);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const chartData = moodEntries.map(entry => ({
    date: format(new Date(entry.date), 'MMM dd'),
    mood: entry.mood_score,
    energy: entry.energy_level,
    anxiety: 6 - entry.anxiety_level, // Invert anxiety for better visualization
  }));

  const getProgressMessage = () => {
    if (analytics.mood_trend === 'improving') {
      return {
        icon: TrendingUp,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        title: 'Great Progress!',
        message: 'Your mood has been steadily improving. Keep up the excellent work!'
      };
    } else if (analytics.mood_trend === 'declining') {
      return {
        icon: AlertCircle,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        title: 'Needs Attention',
        message: 'Your mood has been declining. Consider reaching out for support or trying new coping strategies.'
      };
    } else {
      return {
        icon: Target,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        title: 'Stable Progress',
        message: 'Your mood has been relatively stable. Focus on maintaining your current routine.'
      };
    }
  };

  const progressInfo = getProgressMessage();
  const ProgressIcon = progressInfo.icon;

  const goals = [
    {
      title: 'Daily Check-ins',
      current: analytics.streak_days,
      target: 30,
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Average Mood',
      current: analytics.average_mood,
      target: 4,
      icon: Heart,
      color: 'pink'
    },
    {
      title: 'Total Entries',
      current: analytics.total_entries,
      target: 50,
      icon: Brain,
      color: 'purple'
    }
  ];

  const getGoalProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getGoalColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-600';
      case 'pink':
        return 'bg-pink-600';
      case 'purple':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Progress Dashboard</h2>
            <p className="text-gray-600 mt-1">Track your mental health journey and celebrate your achievements</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Progress Summary */}
      <div className={`bg-white rounded-xl shadow-sm border ${progressInfo.border} p-6`}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 ${progressInfo.bg} rounded-lg`}>
            <ProgressIcon className={`w-6 h-6 ${progressInfo.color}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${progressInfo.color}`}>{progressInfo.title}</h3>
            <p className="text-gray-700 mt-1">{progressInfo.message}</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{analytics.average_mood.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Average Mood</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{analytics.streak_days}</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{analytics.total_entries}</p>
                <p className="text-sm text-gray-600">Total Entries</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Goals</h3>
        <div className="space-y-6">
          {goals.map((goal, index) => {
            const progress = getGoalProgress(goal.current, goal.target);
            const GoalIcon = goal.icon;
            
            return (
              <div key={index} className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <GoalIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{goal.title}</span>
                    <span className="text-sm text-gray-600">
                      {goal.current.toFixed(goal.title === 'Average Mood' ? 1 : 0)} / {goal.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getGoalColor(goal.color)}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                {progress >= 100 && (
                  <Award className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[1, 5]} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="mood" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Energy vs Anxiety */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy vs Calm</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[1, 5]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="energy" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Energy"
              />
              <Line 
                type="monotone" 
                dataKey="anxiety" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                name="Calm"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.streak_days >= 7 && (
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Award className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Week Warrior</p>
                <p className="text-sm text-yellow-700">7+ day tracking streak</p>
              </div>
            </div>
          )}

          {analytics.total_entries >= 10 && (
            <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Brain className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Self-Aware</p>
                <p className="text-sm text-blue-700">10+ mood entries</p>
              </div>
            </div>
          )}

          {analytics.average_mood >= 4 && (
            <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Heart className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Positive Mindset</p>
                <p className="text-sm text-green-700">High average mood</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;