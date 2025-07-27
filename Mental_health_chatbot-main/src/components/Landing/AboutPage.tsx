import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Target, 
  Shield, 
  Brain,
  Lightbulb,
  Globe,
  ArrowRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "We believe everyone deserves access to mental health support with empathy and understanding."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your mental health journey is personal. We protect your data with the highest security standards."
    },
    {
      icon: Brain,
      title: "Evidence-Based",
      description: "All our therapeutic approaches are grounded in proven psychological research and best practices."
    },
    {
      icon: Globe,
      title: "Accessible Support",
      description: "Breaking down barriers to mental health care by providing 24/7 support to anyone, anywhere."
    }
  ];

  const impact = [
    {
      number: "10,000+",
      label: "Users Supported",
      description: "People who have found help through our platform"
    },
    {
      number: "500,000+",
      label: "Conversations",
      description: "Supportive interactions with our AI companion"
    },
    {
      number: "95%",
      label: "User Satisfaction",
      description: "Users report feeling better after using our platform"
    },
    {
      number: "24/7",
      label: "Availability",
      description: "Round-the-clock support when you need it most"
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
              About
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> MindfulChat</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We're on a mission to make mental health support accessible, compassionate, and available 
              to everyone who needs it, whenever they need it.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                Mental health challenges affect millions of people worldwide, yet access to support remains 
                limited by cost, availability, and stigma. We created MindfulChat to bridge this gap by 
                providing immediate, compassionate, and evidence-based mental health support through 
                advanced AI technology.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our platform combines the latest advances in natural language processing and machine learning 
                with proven therapeutic approaches to create a supportive companion that's available 24/7. 
                We're not trying to replace human therapists – instead, we're providing a complementary 
                tool that can offer support between sessions, during crises, or for those taking their 
                first steps toward mental wellness.
              </p>
              <div className="flex items-center space-x-2 text-blue-600">
                <Lightbulb className="w-5 h-5" />
                <span className="font-medium">Empowering mental wellness through technology</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Accessible</h3>
                  <p className="text-sm text-gray-600">Available to everyone, everywhere</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Compassionate</h3>
                  <p className="text-sm text-gray-600">Empathetic and understanding</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3">
                    <Brain className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Scientific</h3>
                  <p className="text-sm text-gray-600">Evidence-based approaches</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mx-auto mb-3">
                    <Shield className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Secure</h3>
                  <p className="text-sm text-gray-600">Privacy-first design</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How MindfulChat Helps</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides comprehensive support for various mental health challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-6">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Anxiety Management</h3>
              <p className="text-gray-600 mb-4">
                Learn breathing techniques, grounding exercises, and cognitive strategies to manage 
                anxiety symptoms and panic attacks.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Guided breathing exercises</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>5-4-3-2-1 grounding technique</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Anxiety tracking and patterns</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-6">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Depression Support</h3>
              <p className="text-gray-600 mb-4">
                Access mood tracking tools, positive psychology exercises, and behavioral activation 
                strategies to support depression recovery.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Daily mood tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Gratitude journaling</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Behavioral activation plans</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-6">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Stress Reduction</h3>
              <p className="text-gray-600 mb-4">
                Develop healthy coping mechanisms, time management skills, and relaxation techniques 
                to better handle life's stressors.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Progressive muscle relaxation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Mindfulness meditation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Stress pattern identification</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="flex items-start space-x-6 p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-xl text-blue-100">Making a difference in mental health support</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impact.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-blue-100 mb-1">{stat.label}</div>
                <div className="text-sm text-blue-200">{stat.description}</div>
              </div>
            ))}
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
                  MindfulChat is designed to provide emotional support and mental wellness tools, but it is not a 
                  replacement for professional medical or psychological treatment. This platform does not provide 
                  medical advice, diagnosis, or treatment. We are not licensed mental health professionals, and our 
                  AI technology, while advanced, cannot replace the expertise of certified medical professionals.
                </p>
                <p className="text-gray-700 mb-4">
                  If you are experiencing serious mental health issues, thoughts of self-harm, suicidal ideation, 
                  or are in a mental health crisis, please seek immediate help from a certified medical professional, 
                  contact emergency services (911), or reach out to a crisis hotline. Our platform is designed to 
                  complement professional care, not replace it.
                </p>
                <p className="text-gray-700 mb-4">
                  Always consult with qualified healthcare providers for proper diagnosis, treatment planning, and 
                  ongoing care of mental health conditions. If you're currently receiving professional mental health 
                  treatment, please discuss the use of digital mental health tools with your healthcare provider.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Find Professional Help & Emergency Resources
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Take the first step toward better mental wellness with compassionate AI support
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;