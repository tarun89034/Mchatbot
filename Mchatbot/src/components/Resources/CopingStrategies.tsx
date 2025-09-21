import React, { useState } from 'react';
import { Brain, Heart, Zap, Clock, Star, ChevronRight, Play } from 'lucide-react';

const copingStrategies = [
  {
    id: 1,
    title: 'Deep Breathing Exercise',
    description: 'A simple 4-7-8 breathing technique to reduce anxiety and promote relaxation.',
    category: 'Anxiety',
    difficulty: 'easy',
    duration: '5 minutes',
    icon: Brain,
    steps: [
      'Sit comfortably with your back straight',
      'Exhale completely through your mouth',
      'Inhale through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through your mouth for 8 counts',
      'Repeat this cycle 3-4 times'
    ]
  },
  {
    id: 2,
    title: 'Progressive Muscle Relaxation',
    description: 'Systematically tense and relax different muscle groups to release physical tension.',
    category: 'Stress',
    difficulty: 'medium',
    duration: '15 minutes',
    icon: Zap,
    steps: [
      'Find a quiet, comfortable place to lie down',
      'Start with your toes - tense for 5 seconds, then relax',
      'Move up to your calves, thighs, abdomen',
      'Continue with arms, shoulders, neck, and face',
      'Notice the contrast between tension and relaxation',
      'End by taking several deep breaths'
    ]
  },
  {
    id: 3,
    title: 'Gratitude Journaling',
    description: 'Write down three things you\'re grateful for to shift focus to positive aspects of life.',
    category: 'Depression',
    difficulty: 'easy',
    duration: '10 minutes',
    icon: Heart,
    steps: [
      'Get a notebook or open a notes app',
      'Write down three things you\'re grateful for today',
      'Be specific about why you\'re grateful for each item',
      'Include both big and small things',
      'Reflect on how these things make you feel',
      'Make this a daily practice'
    ]
  },
  {
    id: 4,
    title: '5-4-3-2-1 Grounding Technique',
    description: 'Use your senses to ground yourself in the present moment during anxiety or panic.',
    category: 'Anxiety',
    difficulty: 'easy',
    duration: '5 minutes',
    icon: Star,
    steps: [
      'Name 5 things you can see around you',
      'Name 4 things you can touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste',
      'Take slow, deep breaths throughout'
    ]
  },
  {
    id: 5,
    title: 'Mindful Walking',
    description: 'Combine gentle exercise with mindfulness to improve mood and reduce stress.',
    category: 'General',
    difficulty: 'easy',
    duration: '20 minutes',
    icon: Clock,
    steps: [
      'Choose a quiet path or space to walk',
      'Start walking at a comfortable, slow pace',
      'Focus on the sensation of your feet touching the ground',
      'Notice your surroundings without judgment',
      'If your mind wanders, gently return focus to walking',
      'End with a moment of appreciation for the experience'
    ]
  },
  {
    id: 6,
    title: 'Cognitive Restructuring',
    description: 'Challenge negative thought patterns and replace them with more balanced thinking.',
    category: 'Depression',
    difficulty: 'hard',
    duration: '30 minutes',
    icon: Brain,
    steps: [
      'Identify the negative thought or belief',
      'Write down evidence that supports this thought',
      'Write down evidence that contradicts this thought',
      'Consider alternative, more balanced perspectives',
      'Create a more realistic, helpful thought',
      'Practice using this new thought when the situation arises'
    ]
  }
];

const CopingStrategies: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStrategy, setSelectedStrategy] = useState<typeof copingStrategies[0] | null>(null);

  const categories = ['All', 'Anxiety', 'Depression', 'Stress', 'General'];

  const filteredStrategies = selectedCategory === 'All' 
    ? copingStrategies 
    : copingStrategies.filter(strategy => strategy.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Anxiety':
        return 'bg-blue-100 text-blue-800';
      case 'Depression':
        return 'bg-purple-100 text-purple-800';
      case 'Stress':
        return 'bg-orange-100 text-orange-800';
      case 'General':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900">Coping Strategies</h2>
        <p className="text-gray-600 mt-1">Evidence-based techniques to help manage your mental health</p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStrategies.map((strategy) => {
          const IconComponent = strategy.icon;
          return (
            <div
              key={strategy.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedStrategy(strategy)}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{strategy.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(strategy.category)}`}>
                        {strategy.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(strategy.difficulty)}`}>
                        {strategy.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {strategy.duration}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-500">{strategy.steps.length} steps</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategy Detail Modal */}
      {selectedStrategy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                  <selectedStrategy.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedStrategy.title}</h2>
                  <p className="text-gray-600 mb-4">{selectedStrategy.description}</p>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedStrategy.category)}`}>
                      {selectedStrategy.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedStrategy.difficulty)}`}>
                      {selectedStrategy.difficulty}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedStrategy.duration}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-step guide:</h3>
                <div className="space-y-3">
                  {selectedStrategy.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <Play className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-blue-800 font-medium">Ready to try this technique?</p>
                    <p className="text-blue-700 text-sm mt-1">
                      Find a quiet space and follow the steps at your own pace. Remember, it's normal for techniques to feel awkward at first.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedStrategy(null)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                  Start Practice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopingStrategies;