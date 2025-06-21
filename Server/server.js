
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');


const {
  crearPartida,
  unirseAPartida,
  obtenerPartidasPendientes,
  limpiarPartidasExpiradas,
  partidas
} = require('./partidasManager');

const { intervaloLimpieza } = require('./config');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

// API REST básico
app.get('/partidas', (req, res) => {
  res.json(obtenerPartidasPendientes());
});

// WebSocket events
io.on('connection', (socket) => {
  console.log(`Connected user: ${socket.id}`);

  socket.on('crearPartida', (datos, callback) => {
    const partida = crearPartida(datos);
    socket.join(partida.id);
    io.emit('nuevaPartida', partida); // Notificar a todos
    callback(partida);
  });

  socket.on('unirse', ({ partidaId, nickname }, callback) => {
    const partida = unirseAPartida(partidaId, nickname);
    if (partida) {
      socket.join(partidaId);
      io.to(partidaId).emit('jugadorUnido', partida);
      callback({ exito: true, partida });
    } else {
      callback({ exito: false });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected user: ${socket.id}`);
  });
});

// Limpieza periódica de partidas vencidas
setInterval(() => {
  limpiarPartidasExpiradas();
}, intervaloLimpieza);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running - http://localhost:${PORT}`);
});