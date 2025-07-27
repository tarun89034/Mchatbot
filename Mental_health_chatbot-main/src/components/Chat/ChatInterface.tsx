import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../../hooks/useApi';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Send, Bot, User, AlertTriangle, Heart, Wifi, WifiOff } from 'lucide-react';
import { format } from 'date-fns';

const ChatInterface: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { request, loading } = useApi();
  
  // WebSocket for real-time chat
  const {
    isConnected,
    sendMessage: sendWebSocketMessage,
    sendTypingStatus,
    messages: wsMessages,
    isTyping,
    error: wsError,
    reconnect
  } = useWebSocket();

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [wsMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    // Chat history is now handled by WebSocket
    // No need to load separately as messages come through WebSocket
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    setInputMessage('');
    
    // Use WebSocket for real-time chat
    if (isConnected) {
      sendWebSocketMessage(inputMessage);
    } else {
      // Fallback to HTTP API if WebSocket is not connected
      try {
        await request('/api/chat/message', {
          method: 'POST',
          body: { content: inputMessage },
        });

        // AI response will come through WebSocket
        console.log('Message sent via HTTP API fallback');
      } catch (error) {
        console.error('Failed to send message:', error);
        // Error handling is now done through WebSocket
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getEmotionColor = (emotion?: string) => {
    switch (emotion?.toLowerCase()) {
      case 'joy':
      case 'happiness':
        return 'text-green-600';
      case 'sadness':
        return 'text-blue-600';
      case 'anger':
        return 'text-red-600';
      case 'fear':
      case 'anxiety':
        return 'text-yellow-600';
      case 'surprise':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">SerenAI</h2>
              <p className="text-sm text-gray-500">Your compassionate AI companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center space-x-1 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-xs">Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-600">
                <WifiOff className="w-4 h-4" />
                <span className="text-xs">Disconnected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {wsError && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 mx-6 mt-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-800">{wsError}</span>
            <button
              onClick={reconnect}
              className="ml-auto text-xs text-red-600 hover:text-red-800 underline"
            >
              Reconnect
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {wsMessages.length === 0 && (
          <div className="text-center py-12">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-4">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to SerenAI</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              I'm here to listen and support you. Feel free to share what's on your mind, 
              and I'll do my best to help you through whatever you're experiencing.
            </p>
          </div>
        )}

        {wsMessages.map((message: any) => (
          <div
            key={message.id}
            className={`flex ${message.is_user ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-xs lg:max-w-md ${message.is_user ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.is_user 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
              }`}>
                {message.is_user ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={`px-4 py-3 rounded-2xl ${
                message.is_user
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-200'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {message.emotion_analysis && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className={`font-medium ${getEmotionColor(message.emotion_analysis.emotion)}`}>
                        {message.emotion_analysis.emotion}
                      </span>
                      {message.emotion_analysis.distress_level > 0.7 && (
                        <AlertTriangle className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                  </div>
                )}
                
                <p className="text-xs mt-2 opacity-70">
                  {format(new Date(message.timestamp), 'HH:mm')}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                // Send typing status when user starts typing
                if (e.target.value.length > 0) {
                  sendTypingStatus(true);
                } else {
                  sendTypingStatus(false);
                }
              }}
              onKeyPress={handleKeyPress}
              onBlur={() => sendTypingStatus(false)}
              placeholder="Share what's on your mind..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || loading}
            className="flex items-center justify-center w-11 h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;