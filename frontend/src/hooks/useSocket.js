import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export function useSocket() {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        const initSocket = () => {
            socketRef.current = io(SOCKET_URL, {
                withCredentials: true,
                transports: ['websocket', 'polling'],
            });

            socketRef.current.on('connect', () => {
                console.log('Socket connected');
                setIsConnected(true);
            });

            socketRef.current.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
            });
        };

        initSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    return {
        socket: socketRef.current,
        isConnected
    };
}
