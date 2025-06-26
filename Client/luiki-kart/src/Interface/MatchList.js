import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

const MatchList = () => {
  const [partidas, setPartidas] = useState([]);
  const navigate = useNavigate();
  const nickname = sessionStorage.getItem('nickname') || 'Anon';

  useEffect(() => {
    fetch('http://localhost:3001/partidas')
      .then(res => res.json())
      .then(data => setPartidas(data))
      .catch(err => console.error('Error cargando partidas:', err));
  }, []);

  useEffect(() => {
    const nueva = (partida) => {
      setPartidas(prev => [...prev, partida]);
    };
    socket.on('nuevaPartida', nueva);

    return () => socket.off('nuevaPartida', nueva);
  }, []);

  useEffect(() => {
    const eliminar = ({ id }) => {
      setPartidas(prev => prev.filter(p => p.id !== id));
    };
    socket.on('partidaCerrada', eliminar);
    return () => socket.off('partidaCerrada', eliminar);
  }, []);


  const handleUnirse = (partidaId) => {
    socket.emit('unirse', { partidaId, nickname }, (response) => {
      if (response.exito) {
        navigate(`/sala-espera/${partidaId}`);
      } else {
        alert('No se pudo unir a la partida.');
      }
    });
  };

  return (
    <div>
      <h1>Partidas Disponibles</h1>
      {partidas.length === 0 ? (
        <p>No hay partidas por ahora.</p>
      ) : (
        <ul>
          {partidas.map((p) => (
            <li key={p.id}>
              <strong>{p.pista}</strong> - Jugadores: {p.jugadores.length}/{p.maxJugadores}
              <button onClick={() => handleUnirse(p.id)}>Unirse</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MatchList;
