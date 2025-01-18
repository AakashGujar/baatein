import { Server } from 'socket.io';

if (!global.io) {
  global.io = new Server({
    path: '/api/socketio',
  });
}

export const config = {
  runtime: 'edge',
  regions: ['iad1'], // specify your preferred region
};

export default function handler(req) {
  if (!global.io) {
    return new Response('Socket not initialized', { status: 500 });
  }

  try {
    const io = global.io;
    
    if (!io.hasListeners) {
      io.hasListeners = true;
      
      io.on('connection', (socket) => {
        socket.on('create-room', ({ roomId, timer }) => {
          if (!global.roomTimers) global.roomTimers = new Map();
          if (!global.roomUsers) global.roomUsers = new Map();
          
          global.roomTimers.set(roomId, timer);
        });

        socket.on('join-room', (roomId) => {
          socket.join(roomId);
          if (!global.roomUsers.has(roomId)) {
            global.roomUsers.set(roomId, 0);
          }
          global.roomUsers.set(roomId, global.roomUsers.get(roomId) + 1);
          const roomTimer = global.roomTimers.get(roomId);
          
          socket.emit('room-info', {
            userCount: global.roomUsers.get(roomId),
            timer: roomTimer
          });
          socket.to(roomId).emit('user-count', global.roomUsers.get(roomId));
        });

        socket.on('leave-room', (roomId) => {
          socket.leave(roomId);
          if (global.roomUsers.has(roomId)) {
            global.roomUsers.set(roomId, Math.max(0, global.roomUsers.get(roomId) - 1));
            if (global.roomUsers.get(roomId) === 0) {
              global.roomUsers.delete(roomId);
              global.roomTimers.delete(roomId);
            }
            io.to(roomId).emit('user-count', global.roomUsers.get(roomId));
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
    }

    return new Response('Socket is running.', { status: 200 });
  } catch (error) {
    return new Response('Error initializing socket: ' + error.message, { 
      status: 500 
    });
  }
}