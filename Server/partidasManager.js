const { v4: uuidv4 } = require('uuid');
const { partidasTimeout } = require('./config');

let partidas = [];

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
        posicion: { x: 0, y: 0 },
        tiempo: 0
      }
    ],
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

  partida.jugadores.push({
    nickname,
    posicion: { x: 0, y: 0 },
    tiempo: 0
  });
  
  if (partida.jugadores.length === partida.maxJugadores) {
    partida.estado = 'en curso';
  }
  
  return partida;
}

function obtenerPartidasPendientes() {
  return Object.values(partidas).filter(partida => partida.estado === 'pendiente');
}

function limpiarPartidasExpiradas() {
  const ahora = Date.now();
  for (const id in partidas) {
    const p = partidas[id];
    if (p.estado === 'pendiente' && ahora - p.creadaEn > partidasTimeout) {
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