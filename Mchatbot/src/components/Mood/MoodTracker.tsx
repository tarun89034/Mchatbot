import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { MoodEntry } from '../../types';
import { Calendar, Smile, Frown, Meh, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

const moodEmojis = [
  { value: 1, emoji: '😢', label: 'Very Sad', color: 'text-red-500' },
  { value: 2, emoji: '😔', label: 'Sad', color: 'text-orange-500' },
  { value: 3, emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
  { value: 4, emoji: '🙂', label: 'Good', color: 'text-green-500' },
  { value: 5, emoji: '😊', label: 'Great', color: 'text-green-600' },
];

const MoodTracker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [currentMood, setCurrentMood] = useState({
    mood_score: 3,
    energy_level: 3,
    anxiety_level: 3,
    notes: '',
  });

  const { request, loading } = useApi();

  useEffect(() => {
    loadMoodHistory();
  }, []);

  const loadMoodHistory = async () => {
    try {
      const history = await request('/api/mood/history?days=30');
      setMoodEntries(history);
    } catch (error) {
      console.error('Failed to load mood history:', error);
    }
  };

  const submitMoodEntry = async () => {
    try {
      await request('/api/mood/entry', {
        method: 'POST',
        body: {
          ...currentMood,
          date: format(selectedDate, 'yyyy-MM-dd'),
        },
      });

      await loadMoodHistory();
      setShowMoodForm(false);
      setCurrentMood({
        mood_score: 3,
        energy_level: 3,
        anxiety_level: 3,
        notes: '',
      });
    } catch (error) {
      console.error('Failed to submit mood entry:', error);
    }
  };

  const getMoodForDate = (date: Date) => {
    return moodEntries.find(entry => 
      isSameDay(new Date(entry.date), date)
    );
  };

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getMoodEmoji = (score: number) => {
    const mood = moodEmojis.find(m => m.value === Math.round(score));
    return mood ? mood.emoji : '😐';
  };

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood_score, 0);
    return sum / moodEntries.length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mood Tracker</h2>
            <p className="text-gray-600 mt-1">Track your daily emotional well-being</p>
          </div>
          <button
            onClick={() => setShowMoodForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Smile className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average Mood</p>
              <p className="text-2xl font-bold text-gray-900">
                {getAverageMood().toFixed(1)} {getMoodEmoji(getAverageMood())}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{moodEntries.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {getWeekDays().filter(date => getMoodForDate(date)).length}/7
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
        <div className="grid grid-cols-7 gap-4">
          {getWeekDays().map((date, index) => {
            const moodEntry = getMoodForDate(date);
            const isToday = isSameDay(date, new Date());
            
            return (
              <div
                key={index}
                className={`text-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isToday 
                    ? 'border-blue-500 bg-blue-50' 
                    : moodEntry 
                      ? 'border-green-200 bg-green-50 hover:border-green-300' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedDate(date)}
              >
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {format(date, 'EEE')}
                </p>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {format(date, 'd')}
                </p>
                {moodEntry ? (
                  <div className="text-2xl">
                    {getMoodEmoji(moodEntry.mood_score)}
                  </div>
                ) : (
                  <div className="w-8 h-8 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Entries</h3>
        <div className="space-y-4">
          {moodEntries.slice(0, 5).map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{getMoodEmoji(entry.mood_score)}</div>
                <div>
                  <p className="font-medium text-gray-900">
                    {format(new Date(entry.date), 'MMMM d, yyyy')}
                  </p>
                  {entry.notes && (
                    <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Mood: {entry.mood_score}/5</p>
                <p className="text-sm text-gray-600">Energy: {entry.energy_level}/5</p>
                <p className="text-sm text-gray-600">Anxiety: {entry.anxiety_level}/5</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Entry Modal */}
      {showMoodForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Mood Entry for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>

            <div className="space-y-6">
              {/* Mood Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How are you feeling?
                </label>
                <div className="flex justify-between">
                  {moodEmojis.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setCurrentMood(prev => ({ ...prev, mood_score: mood.value }))}
                      className={`p-3 rounded-lg transition-all ${
                        currentMood.mood_score === mood.value
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-2xl mb-1">{mood.emoji}</div>
                      <div className="text-xs text-gray-600">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Level: {currentMood.energy_level}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={currentMood.energy_level}
                  onChange={(e) => setCurrentMood(prev => ({ ...prev, energy_level: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Anxiety Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anxiety Level: {currentMood.anxiety_level}/5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={currentMood.anxiety_level}
                  onChange={(e) => setCurrentMood(prev => ({ ...prev, anxiety_level: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={currentMood.notes}
                  onChange={(e) => setCurrentMood(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="How was your day? What affected your mood?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowMoodForm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitMoodEntry}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
              >
                {loading ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;