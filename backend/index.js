const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

app.get("/health", (req, res) => {
  console.log(`Health check pinged at ${new Date().toISOString()}`);
  res.status(200).send("OK");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});


const roomUsers = new Map();
const roomTimers = new Map();

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('create-room', ({ roomId, timer }) => {
    console.log(`Room created: ${roomId}, Timer: ${timer}`);
    roomTimers.set(roomId, timer);
  });

  socket.on('join-room', (roomId) => {
    console.log(`User ${socket.id} joining room: ${roomId}`);
    socket.join(roomId);
    
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Set());
    }
    roomUsers.get(roomId).add(socket.id);
    
    const userCount = roomUsers.get(roomId).size;
    const roomTimer = roomTimers.get(roomId);
    
    socket.emit('room-info', {
      userCount: userCount,
      timer: roomTimer
    });
    io.to(roomId).emit('user-count', userCount);
  });

  socket.on('leave-room', (roomId) => {
    handleLeaveRoom(socket, roomId);
  });

  socket.on('chat-message', (data) => {
    console.log(`Chat message in room ${data.room}: ${data.text}`);
    io.to(data.room).emit('chat-message', {
      user: data.user,
      text: data.text,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    handleDisconnect(socket);
  });
});

function handleLeaveRoom(socket, roomId) {
  console.log(`User ${socket.id} leaving room: ${roomId}`);
  socket.leave(roomId);
  
  if (roomUsers.has(roomId)) {
    roomUsers.get(roomId).delete(socket.id);
    const userCount = roomUsers.get(roomId).size;
    
    if (userCount === 0) {
      roomUsers.delete(roomId);
      roomTimers.delete(roomId);
    } else {
      io.to(roomId).emit('user-count', userCount);
    }
  }
}

function handleDisconnect(socket) {
  for (const [roomId, users] of roomUsers.entries()) {
    if (users.has(socket.id)) {
      users.delete(socket.id);
      const userCount = users.size;
      
      if (userCount === 0) {
        roomUsers.delete(roomId);
        roomTimers.delete(roomId);
      } else {
        io.to(roomId).emit('user-count', userCount);
      }
    }
  }
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});