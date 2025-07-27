import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  BarChart3, 
  Brain, 
  Shield, 
  Clock, 
  Users, 
  Heart,
  Zap,
  Target,
  TrendingUp,
  BookOpen,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const mainFeatures = [
    {
      icon: MessageCircle,
      title: "AI-Powered Conversational Support",
      description: "Our advanced AI chatbot provides 24/7 emotional support using natural language processing to understand your feelings and respond with empathy.",
      features: [
        "Real-time emotion detection and sentiment analysis",
        "Context-aware conversations that remember your history",
        "Personalized responses based on your emotional state",
        "Crisis detection with automatic escalation protocols"
      ]
    },
    {
      icon: BarChart3,
      title: "Comprehensive Mood Tracking",
      description: "Track your emotional well-being with our intuitive mood logging system that helps you identify patterns and triggers.",
      features: [
        "Daily mood entries with emoji-based selection",
        "Energy and anxiety level tracking",
        "Personal journaling with sentiment analysis",
        "Weekly and monthly mood trend visualization"
      ]
    },
    {
      icon: Brain,
      title: "Evidence-Based Coping Strategies",
      description: "Access a library of therapeutic techniques and exercises based on proven psychological approaches like CBT and mindfulness.",
      features: [
        "Guided breathing exercises and meditation",
        "Cognitive behavioral therapy (CBT) techniques",
        "Progressive muscle relaxation guides",
        "Personalized coping strategy recommendations"
      ]
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics & Insights",
      description: "Visualize your mental health journey with comprehensive analytics that help you understand your progress over time.",
      features: [
        "Interactive charts and mood trend analysis",
        "Goal setting and achievement tracking",
        "Weekly progress reports and insights",
        "Pattern recognition for triggers and improvements"
      ]
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your mental health data is protected with enterprise-grade security measures and complete privacy controls.",
      features: [
        "End-to-end encryption for all conversations",
        "HIPAA-compliant data handling practices",
        "Complete control over your data sharing",
        "Secure authentication and session management"
      ]
    },
    {
      icon: Users,
      title: "Crisis Intervention & Support",
      description: "Automatic detection of mental health crises with immediate access to professional resources and emergency contacts.",
      features: [
        "Real-time crisis detection algorithms",
        "Immediate access to emergency resources",
        "Professional referral network",
        "24/7 crisis hotline integration"
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: Clock,
      title: "Smart Reminders",
      description: "Personalized check-ins and mood tracking reminders"
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set and track mental wellness goals with progress monitoring"
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description: "Access to mental health articles, videos, and educational content"
    },
    {
      icon: Zap,
      title: "Quick Relief Tools",
      description: "Instant access to breathing exercises and grounding techniques"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-8">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Mental Health
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Features</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover all the powerful tools and features designed to support your mental wellness journey 
              with evidence-based approaches and cutting-edge AI technology.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {mainFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">{feature.title}</h2>
                    </div>
                    <p className="text-lg text-gray-600 mb-6">{feature.description}</p>
                    <ul className="space-y-3">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 h-80 flex items-center justify-center">
                      <IconComponent className="w-32 h-32 text-blue-300" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Additional Features</h2>
            <p className="text-xl text-gray-600">More tools to support your mental wellness journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-16 bg-yellow-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-yellow-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Medical Disclaimer</h3>
                <p className="text-gray-700 mb-4">
                  MindfulChat and its features are designed to provide emotional support and mental wellness tools, 
                  but they are not a replacement for professional medical or psychological treatment. This platform 
                  does not provide medical advice, diagnosis, or treatment. If you are experiencing serious mental 
                  health issues, thoughts of self-harm, or are in crisis, please seek immediate help from a certified 
                  medical professional or contact emergency services.
                </p>
                <p className="text-gray-700 mb-4">
                  Our AI technology is designed to be supportive and helpful, but it cannot replace the expertise 
                  and personalized care provided by licensed mental health professionals. Always consult with 
                  qualified healthcare providers for proper diagnosis and treatment of mental health conditions.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Find Professional Help
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your mental wellness journey today with our comprehensive support platform
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-lg"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;