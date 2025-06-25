import React from 'react';
import '../Styles/WaitingRoom.css';
import { useNavigate } from 'react-router-dom';

const WaitingRoom = () => {
  const navigate = useNavigate();

  const handleBack = () => navigate('/');

  return (
    <div className="waiting-room-container">
      <div className="loading-animation">
        <div className="car-loader">
          <div className="car-body">
            <div className="car-top"></div>
            <div className="car-wheel car-front-wheel"></div>
            <div className="car-wheel car-back-wheel"></div>
          </div>
        </div>
        <div className="loading-text">
          <span>B</span>
          <span>U</span>
          <span>S</span>
          <span>C</span>
          <span>A</span>
          <span>N</span>
          <span>D</span>
          <span>O</span>
          <span> </span>
          <span>J</span>
          <span>U</span>
          <span>G</span>
          <span>A</span>
          <span>D</span>
          <span>O</span>
          <span>R</span>
          <span>E</span>
          <span>S</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
        <button className="cancel-button" onClick={handleBack}>
          Cancelar búsqueda
        </button>
      </div>
    </div>
  );
};

export default WaitingRoom;