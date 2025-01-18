import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

export function useSocket() {
    const [isConnected, setIsConnected] = useState(false)
    const socketRef = useRef(null)

    useEffect(() => {
        const initSocket = async () => {
            const socketUrl = "https://trmnt-d-cht.vercel.app"

            await fetch('/api/socket')

            socketRef.current = io(socketUrl, {
                path: '/api/socketio',
            });

            socketRef.current.on('connect', () => {
                setIsConnected(true)
            })
            socketRef.current.on('disconnect', () => {
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