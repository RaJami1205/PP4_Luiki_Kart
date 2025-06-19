import React from 'react';
import '../Styles/MainMenu.css';

const MenuInicial = ({ onCrearPartida, onUnirsePartida, onVerRanking }) => {
  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1 className="menu-titulo">LuiKi Kart</h1>
        <div className="menu-decoracion-coche"></div>
      </div>
      
      <div className="menu-botones">
        <button 
          className="menu-boton btn-crear" 
          onClick={onCrearPartida}
        >
          🏁 Crear Partida
        </button>
        
        <button 
          className="menu-boton btn-unirse" 
          onClick={onUnirsePartida}
        >
          🚦 Unirse a Partida
        </button>
        
        <button 
          className="menu-boton btn-ranking" 
          onClick={onVerRanking}
        >
          🏆 Ver Ranking
        </button>
      </div>
      
      <div className="menu-footer">
        <div className="neumatico-decorativo"></div>
        <p>© 2024 Carreras React</p>
      </div>
    </div>
  );
};

export default MenuInicial;