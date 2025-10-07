import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';

interface WebSocketMessage {
  type: 'message' | 'typing_indicator' | 'system_message' | 'error';
  id?: number;
  content: string;
  is_user?: boolean;
  timestamp?: string;
  emotion_analysis?: any;
  is_typing?: boolean;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (content: string) => void;
  sendTypingStatus: (isTyping: boolean) => void;
  messages: WebSocketMessage[];
  isTyping: boolean;
  error: string | null;
  reconnect: () => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!token) return;

    try {
      const ws = new WebSocket(`ws://localhost:8000/ws/chat?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          
          switch (data.type) {
            case 'message':
              setMessages((prev: WebSocketMessage[]) => [...prev, data]);
              break;
            case 'typing_indicator':
              setIsTyping(data.is_typing || false);
              break;
            case 'system_message':
              setMessages((prev: WebSocketMessage[]) => [...prev, {
                ...data,
                id: Date.now(),
                is_user: false,
                timestamp: new Date().toISOString()
              }]);
              break;
            case 'error':
              setError(data.content);
              break;
            default:
              console.warn('Unknown message type:', data.type);
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        console.log('WebSocket disconnected:', event.code, event.reason);
        
        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Connection error occurred');
      };

    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError('Failed to connect to chat server');
    }
  }, [token]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User initiated disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current && isConnected) {
      const message = {
        type: 'message',
        content: content.trim()
      };
      wsRef.current.send(JSON.stringify(message));
    } else {
      setError('Not connected to chat server');
    }
  }, [isConnected]);

  const sendTypingStatus = useCallback((isTyping: boolean) => {
    if (wsRef.current && isConnected) {
      const message = {
        type: 'typing_status',
        is_typing: isTyping
      };
      wsRef.current.send(JSON.stringify(message));
    }
  }, [isConnected]);

  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttempts.current = 0;
    setTimeout(connect, 1000);
  }, [connect, disconnect]);

  // Connect on mount and when token changes
  useEffect(() => {
    if (token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [token, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    sendMessage,
    sendTypingStatus,
    messages,
    isTyping,
    error,
    reconnect
  };
}; 