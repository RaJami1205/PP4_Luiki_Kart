import React from 'react';
import '../Styles/CreateMatch.css';
import VulcanoTrack from './VulcanoTrack';
import BeachTrack from './BeachTrack';
import MountainTrack from './MountainTrack';
import { useNavigate } from 'react-router-dom';

import socket from '../socket';

const CreateMatch = () => {
  const navigate = useNavigate();
  const MAX_PLAYERS = 8;

  const [selectedGameType, setSelectedGameType] = React.useState(null);
  const [selectedTrack, setSelectedTrack] = React.useState(null);
  const [playerCount, setPlayerCount] = React.useState(2);
  const [showTrackModal, setShowTrackModal] = React.useState(false); // Nuevo estado para controlar el modal

  // Opciones
  const gameTypes = [{ id: 1, name: "VS", icon: "⚔️" }];
  const tracks = [
  { id: 1, name: "Vulcano", icon: "🌋", color: "#4facfe", preview: <VulcanoTrack /> },
  { id: 2, name: "Playa", icon: "🏖️", color: "#f5af19", preview: <BeachTrack /> },
  { id: 3, name: "Montañosa", icon: "⛰️", color: "#38ef7d", preview: <MountainTrack /> }
  ];

  // Selección automática del tipo de juego
  React.useEffect(() => {
    if (gameTypes.length === 1) setSelectedGameType(gameTypes[0]);
  }, []);

  const handleBack = () => navigate('/');
  
  const handleJoin = () => {
    if (!selectedTrack || !selectedGameType) return;

    const nickname = sessionStorage.getItem('nickname') || 'Anon';

    const partidaData = {
      pista: selectedTrack.name,
      vueltas: 3,
      maxJugadores: playerCount,
      creador: nickname,
    };

    socket.emit('crearPartida', partidaData, (response) => {
      console.log('Partida creada:', response);
      navigate(`/sala-espera/${response.id}`);
    });
  };

  const handlePlayerCountChange = (e) => {
    const value = Math.max(2, Math.min(MAX_PLAYERS, parseInt(e.target.value) || 2));
    setPlayerCount(value);
    console.log(sessionStorage.getItem('nickname'))
  };

  // Función para manejar la selección de pista
  const handleTrackSelect = (track) => {
  setSelectedTrack(track);
  setShowTrackModal(true);
};

  return (
    <div className="join-match-container">
      <div className="join-match-header">
        <h1>Opciones de Jugabilidad</h1>
        <div className="car-illustration"></div>
      </div>

      {/* Sección Tipo de Juego */}
      <div className="selection-section">
        <h2>Tipo de Juego</h2>
        <div className="options-grid">
          {gameTypes.map((type) => (
            <div key={type.id} className="option-card selected">
              <span className="option-icon">{type.icon}</span>
              <span className="option-name">{type.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sección Pista */}
      <div className="selection-section">
        <h2>Pista</h2>
        <div className="options-grid">
          {tracks.map((track) => (
            <div 
              key={track.id}
              className={`option-card ${selectedTrack?.id === track.id ? 'selected' : ''}`}
              onClick={() => handleTrackSelect(track)}
            >
              <span className="option-name">{track.name}</span>
              <span className="option-name">{track.icon}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sección Jugadores */}
      <div className="selection-section">
        <h2>Numero de Jugadores</h2>
        <div className="player-count-selector">
          <button 
            className="count-button"
            onClick={() => setPlayerCount(prev => Math.max(2, prev - 1))}
            disabled={playerCount <= 2}
          >
            -
          </button>
          
          <div className="player-count-display">
            <span className="player-icon">👥</span>
            <input
              type="number"
              min="2"
              max={MAX_PLAYERS}
              value={playerCount}
              onChange={handlePlayerCountChange}
              className="player-count-input"
            />
          </div>
          
          <button 
            className="count-button"
            onClick={() => setPlayerCount(prev => Math.min(MAX_PLAYERS, prev + 1))}
            disabled={playerCount >= MAX_PLAYERS}
          >
            +
          </button>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="action-buttons">
        <button className="back-button" onClick={handleBack}>
          🔙 Volver
        </button>
        <button 
          className="join-button" 
          onClick={handleJoin}
          disabled={!selectedTrack}
        >
          🚦 Crear Partida
        </button>
      </div>

      {/* Modal para la vista completa de la pista urbana */}
      {showTrackModal && (
        <div className="track-modal-overlay" onClick={() => setShowTrackModal(false)}>
          <div className="track-modal-content" onClick={e => e.stopPropagation()}>
            <button 
              className="close-modal-button"
              onClick={() => setShowTrackModal(false)}
            >
              ✕
            </button>
            <h2>Pista {selectedTrack?.name}</h2>
            {selectedTrack?.preview && React.cloneElement(selectedTrack.preview, { showFullPreview: true })}
            <button 
              className="select-track-button"
              onClick={() => setShowTrackModal(false)}
            >
              Seleccionar esta pista
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMatch;