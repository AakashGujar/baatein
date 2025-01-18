import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

export function useSocket() {
    const [isConnected, setIsConnected] = useState(false)
    const socketRef = useRef(null)

    useEffect(() => {
        const initSocket = async () => {
            await fetch('/api/socketio') // Trigger the server to initialize the socket

            socketRef.current = io({
                path: '/api/socketio',
                transports: ['websocket', 'polling'], // Ensure WebSocket and long-polling are used
                withCredentials: true, // Allow sending cookies if needed
                autoConnect: true, // Automatically connect when the socket is initialized
            })

            socketRef.current.on('connect', () => {
                console.log('Socket connected')
                setIsConnected(true)
            })

            socketRef.current.on('disconnect', () => {
                console.log('Socket disconnected')
                setIsConnected(false)
            })
        }

        initSocket()

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
            }
        }
    }, [])

    return {
        socket: socketRef.current,
        isConnected
    }
}
