import { Server } from 'socket.io'

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
    res.end()
    return
  }

  console.log('Socket is initializing')
  const io = new Server(res.socket.server, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true,
    },
  })
  res.socket.server.io = io

  const roomUsers = new Map()
  const roomTimers = new Map()

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`)

    socket.on('create-room', ({ roomId, timer }) => {
      console.log(`Room created: ${roomId}, Timer: ${timer}`)
      roomTimers.set(roomId, timer)
    })

    socket.on('join-room', (roomId) => {
      console.log(`User ${socket.id} joining room: ${roomId}`)
      socket.join(roomId)
      if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, new Set())
      }
      roomUsers.get(roomId).add(socket.id)
      const userCount = roomUsers.get(roomId).size
      const roomTimer = roomTimers.get(roomId)
      socket.emit('room-info', {
        userCount: userCount,
        timer: roomTimer
      })
      io.to(roomId).emit('user-count', userCount)
    })

    socket.on('leave-room', (roomId) => {
      console.log(`User ${socket.id} leaving room: ${roomId}`)
      socket.leave(roomId)
      if (roomUsers.has(roomId)) {
        roomUsers.get(roomId).delete(socket.id)
        const userCount = roomUsers.get(roomId).size
        if (userCount === 0) {
          roomUsers.delete(roomId)
          roomTimers.delete(roomId)
        } else {
          io.to(roomId).emit('user-count', userCount)
        }
      }
    })

    socket.on('chat-message', (data) => {
      console.log(`Chat message in room ${data.room}: ${data.text}`)
      io.to(data.room).emit('chat-message', {
        user: data.user,
        text: data.text,
        timestamp: new Date()
      })
    })

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
      for (const [roomId, users] of roomUsers.entries()) {
        if (users.has(socket.id)) {
          users.delete(socket.id)
          const userCount = users.size
          if (userCount === 0) {
            roomUsers.delete(roomId)
            roomTimers.delete(roomId)
          } else {
            io.to(roomId).emit('user-count', userCount)
          }
        }
      }
    })
  })

  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default SocketHandler