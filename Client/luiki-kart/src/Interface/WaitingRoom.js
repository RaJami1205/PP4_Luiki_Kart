import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../socket';
import '../Styles/WaitingRoom.css';

const WaitingRoom = () => {
  const { partidaId } = useParams();
  const nickname = sessionStorage.getItem('nickname') || 'Jugador';
  const navigate = useNavigate();

  const [jugadores, setJugadores] = useState([]);
  const [admin, setAdmin] = useState('');
  const [maxJugadores, setMaxJugadores] = useState(8);


  useEffect(() => {
    socket.on('jugadorUnido', (partida) => {
      setJugadores(partida.jugadores);
      setAdmin(partida.jugadores[0]?.nickname);
    });

    socket.emit('solicitarEstadoPartida', { partidaId });

    socket.on('estadoActualizado', (partida) => {
      setJugadores(partida.jugadores);
      setAdmin(partida.jugadores[0]?.nickname);
      setMaxJugadores(partida.maxJugadores);
    });

    socket.on('partidaIniciada', () => {
      navigate(`/juego/${partidaId}`);
    });

    socket.on('salaCerrada', () => {
      alert('⛔ La sala fue cerrada por inactividad.');
      navigate('/');
    });


    return () => {
      socket.off('salaCerrada');
      socket.off('jugadorUnido');
      socket.off('estadoActualizado');
      socket.off('partidaIniciada');
    };
  }, [partidaId]);

  
  const handleSalir = () => {
    socket.emit('salirPartida', { partidaId, nickname });
    navigate('/');
  };

  const handleIniciar = () => {
    socket.emit('iniciarPartida', { partidaId });
    navigate(`/juego/${partidaId}`);
  };



  return (
    <div className="waiting-room-container">
      <div className="loading-animation">
        <h2 className="loading-text">Jugadores en sala:</h2>
        <ul style={{ textAlign: 'left', color: 'white' }}>
          {[...Array(maxJugadores)].map((_, index) => {
            const jugador = jugadores[index];
            if (jugador) {
              return (
                <li key={index}>
                  {index + 1}. {jugador.nickname} {jugador.nickname === nickname ? '(tú)' : ''}
                </li>
              );
            } else {
              return <li key={index}>{index + 1}. esperando jugador...</li>;
            }
          })}
        </ul>

        <div className="progress-bar">
          <div className="progress"></div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          {nickname === admin && jugadores.length >= 2 && (
            <button className="cancel-button" onClick={handleIniciar}>
              🚦 Iniciar Partida
            </button>
          )}
          <button className="cancel-button" onClick={handleSalir}>
            ❌ Salir
          </button>
        </div>
      </div>
    </div>
  );
};


export default WaitingRoom;