import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Shield, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
    support: [
      { name: 'Help Center', href: '/contact' },
      { name: 'Crisis Resources', href: '/contact' },
      { name: 'Professional Help', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Medical Disclaimer', href: '/disclaimer' },
    ],
    emergency: [
      { name: 'National Suicide Prevention Lifeline', href: 'tel:988', external: true },
      { name: 'Crisis Text Line', href: 'sms:741741', external: true },
      { name: 'Emergency Services', href: 'tel:911', external: true },
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SerenAI</h1>
                <p className="text-sm text-gray-400">AI Mental Health Companion</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Providing 24/7 emotional support and mental wellness tools through compassionate AI technology. 
              Your mental health matters, and help is always available.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Your privacy and security are our priority</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Resources */}
          <div>
            <h3 className="text-sm font-semibold text-red-300 uppercase tracking-wider mb-4">Emergency</h3>
            <ul className="space-y-3">
              {footerLinks.emergency.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
                    {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <span>{link.name}</span>
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded-lg p-4 mb-6">
            <p className="text-yellow-200 text-sm">
              <strong>Important:</strong> SerenAI is not a replacement for professional medical or psychological treatment. 
              If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline immediately.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 SerenAI. All rights reserved.
              </p>
              <div className="flex space-x-4">
                {footerLinks.legal.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-400 text-sm">support@serenai.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;