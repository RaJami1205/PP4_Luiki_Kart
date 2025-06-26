
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const matrix = require('./Assets/matrix_track.json').matrix;

const POSICION_INICIAL = { x: 44, y: 23 };

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

  socket.on('solicitarEstadoPartida', ({ partidaId }) => {
    const partida = partidas[partidaId];
    if (partida) {
      io.to(partidaId).emit('estadoActualizado', partida);
    }
  });

  socket.on('iniciarPartida', ({ partidaId }) => {
    const partida = partidas[partidaId];
    if (!partida) return;

    partida.estado = 'en curso';

    io.to(partidaId).emit('partidaIniciada');
  });

  socket.on('salirPartida', ({ partidaId, nickname }) => {
    const partida = partidas[partidaId];
    if (partida) {
      partida.jugadores = partida.jugadores.filter(j => j.nickname !== nickname);

      if (partida.estado === 'en curso' && partida.jugadores.length < partida.maxJugadores) {
        partida.estado = 'pendiente';
        io.emit('nuevaPartida', partida);
      }

      io.to(partidaId).emit('estadoActualizado', partida);
    }
  });


  socket.on('disconnect', () => {
    console.log(`Disconnected user: ${socket.id}`);
  });

  socket.on('mover', ({ partidaId, nickname, direccion }, callback) => {
    const partida = partidas[partidaId];
    if (!partida) return;

    const jugador = partida.jugadores.find(j => j.nickname === nickname);
    if (!jugador) return;

    let nuevaX = jugador.posicion.x;
    let nuevaY = jugador.posicion.y;

    switch (direccion) {
      case 'up': nuevaY--; break;
      case 'down': nuevaY++; break;
      case 'left': nuevaX--; break;
      case 'right': nuevaX++; break;
      default: return;
    }

    // Esta parte es para verificar que no se salga del mapa
    if (nuevaX < 0 || nuevaX >= matrix[0].length || nuevaY < 0 || nuevaY >= matrix.length) return;

    // Verificar si es calle donde el jugador puede pasar
    const esPista = matrix[nuevaY]?.[nuevaX] === 0 || matrix[nuevaY]?.[nuevaX] === 2;
    if (!esPista) return;

    // Verifica que no haya otro jugador en esa posicion
    const ocupado = partida.jugadores.some(j =>
      j.nickname !== nickname &&
      j.posicion?.x === nuevaX &&
      j.posicion?.y === nuevaY
    );
    if (ocupado) return;

    jugador.posicion.x = nuevaX;
    jugador.posicion.y = nuevaY;

    // Verifica si hizo una vuelta
    if ((nuevaX >= POSICION_INICIAL.x && nuevaX <= POSICION_INICIAL.x + 5) && nuevaY === POSICION_INICIAL.y) {
      jugador.vueltas = (jugador.vueltas || 0) + 1;
    }

    io.to(partidaId).emit('estadoActualizado', {
      jugadores: partida.jugadores.map(j => ({
        nickname: j.nickname,
        posicion: { x: j.posicion.x, y: j.posicion.y },
        tiempo: j.tiempo,
        vueltas: j.vueltas || 0
      }))
    });

    // Callback opcional al jugador que se movió
    if (callback) callback({ exito: true });
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