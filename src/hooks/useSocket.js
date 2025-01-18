import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const initSocket = async () => {
      if (!socketRef.current) {
        const socketUrl = process.env.NODE_ENV === 'production' 
          ? window.location.origin 
          : 'http://localhost:3000';

        socketRef.current = io(socketUrl, {
          path: '/api/socketio',
          addTrailingSlash: false,
          transports: ['websocket'],
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketRef.current.on('connect', () => {
          console.log('Socket connected');
          setIsConnected(true);
        });

        socketRef.current.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setIsConnected(false);
        });

        socketRef.current.on('disconnect', () => {
          console.log('Socket disconnected');
          setIsConnected(false);
        });
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected
  };
}