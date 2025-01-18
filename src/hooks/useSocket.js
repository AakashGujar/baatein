import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

export function useSocket() {
    const [isConnected, setIsConnected] = useState(false)
    const socketRef = useRef(null)

    useEffect(() => {
        const initSocket = async () => {
            await fetch('/api/socketio')

            socketRef.current = io({
                path: '/api/socketio',
                transports: ['websocket', 'polling'],
                withCredentials: true,
                autoConnect: true,
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
