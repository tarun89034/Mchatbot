import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, BarChart3, Brain, Shield, Clock, Users, ArrowRight, Star, CheckCircle } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "AI-Powered Chat Support",
      description: "24/7 conversational support with empathetic AI that understands your emotions and provides personalized responses."
    },
    {
      icon: BarChart3,
      title: "Mood Tracking & Analytics",
      description: "Track your daily moods, energy levels, and emotional patterns with beautiful visualizations and insights."
    },
    {
      icon: Brain,
      title: "Coping Strategies",
      description: "Access evidence-based therapeutic techniques including CBT exercises, mindfulness, and stress management tools."
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your mental health data is protected with enterprise-grade security and complete privacy controls."
    },
    {
      icon: Clock,
      title: "Progress Monitoring",
      description: "Visualize your mental health journey with comprehensive progress tracking and achievement milestones."
    },
    {
      icon: Users,
      title: "Crisis Support",
      description: "Automatic crisis detection with immediate access to professional resources and emergency contacts."
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      text: "SerenAI has been a game-changer for my anxiety management. The AI really understands how I'm feeling.",
      rating: 5
    },
    {
      name: "David L.",
      text: "The mood tracking feature helped me identify patterns I never noticed before. Highly recommended!",
      rating: 5
    },
    {
      name: "Emma R.",
      text: "Having 24/7 support available has made such a difference during difficult times. Thank you!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-8 animate-bounce">
              <Heart className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Your AI Health
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Companion</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              Get 24/7 emotional support, track your mood, and learn evidence-based coping strategies 
              with our compassionate AI chatbot designed to support your mental wellness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Link
                to="/auth"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all transform hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Health Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines AI technology with evidence-based therapeutic approaches 
              to provide personalized health support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-6 animate-pulse">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600">
              See how SerenAI is helping people improve their mental wellness
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-16 bg-yellow-50 border-t border-yellow-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-yellow-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Disclaimer</h3>
                <p className="text-gray-700 mb-4">
                  SerenAI is designed to provide emotional support and mental wellness tools, but it is not a replacement 
                  for professional medical or psychological treatment. This platform does not provide medical advice, diagnosis, 
                  or treatment. If you are experiencing serious mental health issues, thoughts of self-harm, or are in crisis, 
                  please seek immediate help from a certified medical professional or contact emergency services.
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
            Start Your Wellness Journey Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are taking control of their health with Mchatbot
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

export default LandingPage;