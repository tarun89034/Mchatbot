import React from 'react';
import { Phone, Mail, MapPin, Clock, AlertTriangle, Heart, ExternalLink } from 'lucide-react';

const ContactPage: React.FC = () => {
  const emergencyContacts = [
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "24/7 crisis support for suicidal thoughts",
      availability: "24/7"
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Free, 24/7 crisis support via text",
      availability: "24/7"
    },
    {
      name: "National Alliance on Mental Illness (NAMI)",
      phone: "1-800-950-NAMI (6264)",
      description: "Information and support for health",
      availability: "Mon-Fri 10am-10pm ET"
    },
    {
      name: "SAMHSA National Helpline",
      phone: "1-800-662-4357",
      description: "Treatment referral and information service",
      availability: "24/7"
    }
  ];

  const professionalResources = [
    {
      name: "Psychology Today",
      website: "psychologytoday.com",
      description: "Find licensed therapists and psychiatrists in your area",
      type: "Therapist Directory"
    },
    {
      name: "BetterHelp",
      website: "betterhelp.com",
      description: "Online therapy with licensed professionals",
      type: "Online Therapy"
    },
    {
      name: "Talkspace",
      website: "talkspace.com",
      description: "Text-based therapy with licensed therapists",
      type: "Online Therapy"
    },
    {
      name: "Open Path Collective",
      website: "openpathcollective.org",
      description: "Affordable therapy sessions ($30-$60)",
      type: "Affordable Therapy"
    },
    {
      name: "NAMI Local Chapters",
      website: "nami.org/find-support",
      description: "Local support groups and resources",
      type: "Support Groups"
    },
    {
      name: "Mental Health America",
      website: "mhanational.org",
      description: "Health screening and local resources",
      type: "Screening & Resources"
    }
  ];

  const internationalContacts = [
    {
      country: "United Kingdom",
      name: "Samaritans",
      phone: "116 123",
      availability: "24/7"
    },
    {
      country: "Canada",
      name: "Talk Suicide Canada",
      phone: "1-833-456-4566",
      availability: "24/7"
    },
    {
      country: "Australia",
      name: "Lifeline",
      phone: "13 11 14",
      availability: "24/7"
    },
    {
      country: "International",
      name: "International Association for Suicide Prevention",
      phone: "Visit iasp.info/resources/Crisis_Centres",
      availability: "Varies by location"
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
              Professional Help &
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Emergency Resources</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              If you're experiencing a mental health crisis or need professional support, 
              these resources can provide immediate help and ongoing care.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-16">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h2 className="text-3xl font-bold text-red-900">Emergency Crisis Support</h2>
            </div>
            <p className="text-lg text-red-800 mb-8">
              If you're having thoughts of suicide, self-harm, or are in immediate danger, 
              please contact emergency services (911) or one of these crisis hotlines immediately.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-red-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{contact.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="w-5 h-5 text-red-600" />
                    <span className="text-lg font-medium text-red-700">{contact.phone}</span>
                  </div>
                  <p className="text-gray-600 mb-3">{contact.description}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{contact.availability}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* International Contacts */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">International Crisis Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {internationalContacts.map((contact, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{contact.country}</h3>
                  <p className="font-medium text-gray-800 mb-1">{contact.name}</p>
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700">{contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{contact.availability}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professional Resources */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Professional Health Resources</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find licensed health professionals and ongoing support services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {professionalResources.map((resource, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{resource.name}</h3>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {resource.type}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <div className="flex items-center space-x-2 text-blue-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{resource.website}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When to Seek Help */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">When to Seek Professional Help</h2>
              <p className="text-lg text-gray-600 mb-6">
                While MindfulChat can provide valuable support, there are times when professional 
                intervention is necessary. Consider reaching out to a mental health professional if you experience:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Persistent thoughts of self-harm or suicide</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Severe depression that interferes with daily functioning</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Panic attacks or severe anxiety that limits your activities</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Substance abuse or addiction issues</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Symptoms that persist for more than two weeks</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Difficulty maintaining relationships or work performance</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Remember</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Seeking help is a sign of strength, not weakness</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Health treatment is effective and can significantly improve your quality of life</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">You deserve support and care for your health</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Recovery is possible with the right support and treatment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact MindfulChat */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact MindfulChat Support</h2>
            <p className="text-lg text-gray-600 mb-6">
              For technical support, feedback, or general inquiries about our platform
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">support@mindfulchat.com</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Response within 24 hours</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              Please note: Our support team cannot provide crisis intervention or clinical advice. 
              For mental health emergencies, please use the crisis resources listed above.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;