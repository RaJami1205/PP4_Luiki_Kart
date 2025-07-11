const { v4: uuidv4 } = require('uuid');
const { partidaTimeout } = require('./config');

let partidas = [];

const posicionesFijas = [
  { x: 25, y: 40 },
  { x: 26, y: 42 },
  { x: 27, y: 40 },
  { x: 28, y: 42 },
  { x: 29, y: 40 },
  { x: 30, y: 42 },
  { x: 31, y: 40 },
  { x: 32, y: 42 },
];

function crearPartida({pista, vueltas, maxJugadores, creador}) {
  const id = uuidv4();
  const nuevaPartida = {
    id,
    pista,
    vueltas,
    maxJugadores,
    jugadores: [
      {
        nickname: creador,
        posicion: { x: 25, y: 40 },
        tiempo: 0,
        vueltas: -1
      }
    ],
    inicio: null,
    creadoEn: Date.now(),
    estado: 'pendiente',
  };
  
  partidas[id] = nuevaPartida;
  return nuevaPartida;
}

function unirseAPartida(partidaId, nickname) {
  const partida = partidas[partidaId];
  if (!partida || partida.estado !== 'pendiente') {
    return null; // Partida no existe o ya comenzó
  }

  if (partida.jugadores.length >= partida.maxJugadores) {
    return null; // Partida llena
  }
  const nuevaPosicion = posicionesFijas[partida.jugadores.length];

  partida.jugadores.push({
    nickname,
    posicion: nuevaPosicion,
    tiempo: 0,
    vueltas: -1
  });

  if (partida.jugadores.length === partida.maxJugadores) {
    partida.estado = 'completo';
  }
  
  return partida;
}

function obtenerPartidasPendientes() {
  return Object.values(partidas).filter(partida => partida.estado === 'pendiente');
}

function limpiarPartidasExpiradas(io) {
  const ahora = Date.now();
  for (const id in partidas) {
    const p = partidas[id];
    if (p.estado !== 'en curso' && ahora - p.creadoEn > partidaTimeout) {
      io.emit('partidaCerrada', { id });
      io.to(id).emit('salaCerrada');
      delete partidas[id];
    }
  }
}

module.exports = {
  crearPartida,
  unirseAPartida,
  obtenerPartidasPendientes,
  limpiarPartidasExpiradas,
  partidas,
};