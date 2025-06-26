import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../socket';
import matrix from '../Assets/matrix_track.json';

const GameView = () => {
  const { partidaId } = useParams();
  const nickname = sessionStorage.getItem('nickname') || 'Anon';
  const [jugadores, setJugadores] = useState([]);
  const [cuentaRegresiva, setCuentaRegresiva] = useState(3);
  const [movimientoHabilitado, setMovimientoHabilitado] = useState(false);

  const mapa = matrix.matrix;

  useEffect(() => {
    socket.on('estadoActualizado', (partida) => {
      setJugadores(partida.jugadores);
    });

    socket.emit('solicitarEstadoPartida', { partidaId });

    // Cuenta regresiva inicial
    const countdown = setInterval(() => {
      setCuentaRegresiva(prev => {
        if (prev === 1) {
          clearInterval(countdown);
          setMovimientoHabilitado(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      socket.off('estadoActualizado');
      clearInterval(countdown);
    };
  }, [partidaId]);

  // Movimiento con teclado
  useEffect(() => {
    if (!movimientoHabilitado) return;

    const handleKeyDown = (e) => {
      const direccion = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
      }[e.key];

      if (!direccion) return;

      socket.emit('mover', { partidaId, nickname, direccion });

    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movimientoHabilitado, jugadores, nickname, mapa, partidaId]);

  const renderCelda = (y, x) => {
    const jugador = jugadores.find(j => j.posicion?.x === x && j.posicion?.y === y);
    if (jugador) return 'X';
    if (mapa[y]?.[x] === 2) return '🏁';
    if (mapa[y]?.[x] === 1) return '0';
    return ' ';
  };

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre', overflowX: 'auto' }}>
      <h2>Mapa de Juego</h2>
      {cuentaRegresiva !== null && (
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Inicia en... {cuentaRegresiva}
        </div>
      )}
      {mapa.map((fila, y) => (
        <div key={y}>
          {fila.map((_, x) => renderCelda(y, x)).join(' ')}
        </div>
      ))}
    </div>
  );
};

export default GameView;
