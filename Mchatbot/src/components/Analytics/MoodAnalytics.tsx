import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { MoodAnalytics as MoodAnalyticsType } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Target, Award, Brain } from 'lucide-react';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

const MoodAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<MoodAnalyticsType | null>(null);
  const [timeRange, setTimeRange] = useState(30);
  const { request, loading } = useApi();

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      const data = await request(`/api/mood/analytics?days=${timeRange}`);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const moodDistributionData = Object.entries(analytics.mood_distribution).map(([mood, count]) => ({
    name: mood,
    value: count,
  }));

  const getTrendIcon = () => {
    switch (analytics.mood_trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (analytics.mood_trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mood Analytics</h2>
            <p className="text-gray-600 mt-1">Insights into your emotional well-being</p>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average Mood</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.average_mood.toFixed(1)}/5
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              {getTrendIcon()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Trend</p>
              <p className={`text-2xl font-bold capitalize ${getTrendColor()}`}>
                {analytics.mood_trend}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.total_entries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Streak</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.streak_days} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Trend Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.weekly_averages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[1, 5]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={moodDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {moodDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Energy vs Anxiety */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy vs Anxiety Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.weekly_averages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[1, 5]} />
              <Tooltip />
              <Bar dataKey="energy" fill="#10B981" name="Energy" />
              <Bar dataKey="anxiety" fill="#EF4444" name="Anxiety" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Recommendations</h3>
          <div className="space-y-4">
            {analytics.mood_trend === 'improving' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">🎉 Great progress!</p>
                <p className="text-green-700 text-sm mt-1">
                  Your mood has been improving. Keep up the good work with your current routine.
                </p>
              </div>
            )}

            {analytics.mood_trend === 'declining' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium">💡 Consider self-care</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Your mood has been declining. Try incorporating more relaxation techniques or reach out for support.
                </p>
              </div>
            )}

            {analytics.streak_days >= 7 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">🔥 Consistency streak!</p>
                <p className="text-blue-700 text-sm mt-1">
                  You've been tracking your mood for {analytics.streak_days} days straight. Consistency is key to understanding patterns.
                </p>
              </div>
            )}

            {analytics.average_mood >= 4 && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-purple-800 font-medium">✨ Positive mindset</p>
                <p className="text-purple-700 text-sm mt-1">
                  Your average mood is quite positive. Consider sharing your strategies with others or documenting what's working well.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodAnalytics;