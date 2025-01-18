import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: '/api/socketio',
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  const roomUsers = new Map();
  const roomTimers = new Map();

  io.on('connection', (socket) => {
    socket.on('create-room', ({ roomId, timer }) => {
      roomTimers.set(roomId, timer);
    });

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, 0);
      }
      roomUsers.set(roomId, roomUsers.get(roomId) + 1);
      const roomTimer = roomTimers.get(roomId);
      socket.emit('room-info', {
        userCount: roomUsers.get(roomId),
        timer: roomTimer
      });
      socket.to(roomId).emit('user-count', roomUsers.get(roomId));
    });

    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
      if (roomUsers.has(roomId)) {
        roomUsers.set(roomId, Math.max(0, roomUsers.get(roomId) - 1));
        if (roomUsers.get(roomId) === 0) {
          roomUsers.delete(roomId);
          roomTimers.delete(roomId);
        }
        io.to(roomId).emit('user-count', roomUsers.get(roomId));
      }
    });

    socket.on('chat-message', (data) => {
      io.to(data.room).emit('chat-message', {
        user: data.user,
        text: data.text,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  res.end();
};

export default SocketHandler;

export const config = {
  api: {
    bodyParser: false,
  },
};