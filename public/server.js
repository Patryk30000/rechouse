const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const players = {};

io.on('connection', (socket) => {
  players[socket.id] = {
    x: 100 + Math.random() * 500,
    y: 100 + Math.random() * 300,
    color: `hsl(${Math.random() * 360}, 80%, 60%)`,
    name: 'Player'
  };

  io.emit('state', { players });

  socket.on('join', (name) => {
    if (players[socket.id]) players[socket.id].name = name;
    io.emit('state', { players });
  });

  socket.on('move', (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      players[socket.id].name = data.name;
      players[socket.id].color = data.color;
      io.emit('state', { players });
    }
  });

  socket.on('chat', (data) => {
    io.emit('chat', data);
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('state', { players });
  });
});

server.listen(process.env.PORT || 3000);
