import React, { useEffect, useState } from 'react';
import '../Styles/MainMenu.css';

const MenuInicial = ({ onCrearPartida, onUnirsePartida, onVerRanking }) => {
  const [nickname, setNickname] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');

  useEffect(() => {
    const guardado = sessionStorage.getItem('nickname');
    if (!guardado) {
      setModalAbierto(true);
    } else {
      setNickname(guardado);
    }
  }, []);

  const guardarNickname = () => {
    const limpio = nicknameInput.trim();
    if (limpio.length === 0) return;
    sessionStorage.setItem('nickname', limpio);
    setNickname(limpio);
    setModalAbierto(false);
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1 className="menu-titulo">LuiKi Kart</h1>
        <div className="menu-decoracion-coche"></div>
      </div>

      {nickname && (
        <p className="nickname-display">👤 Nickname: <strong>{nickname}</strong></p>
      )}

      <div className="menu-botones">
        <button className="menu-boton btn-crear" onClick={onCrearPartida}>
          🏁 Crear Partida
        </button>
        <button className="menu-boton btn-unirse" onClick={onUnirsePartida}>
          🚦 Unirse a Partida
        </button>
        <button className="menu-boton btn-ranking" onClick={onVerRanking}>
          🏆 Ver Ranking
        </button>
      </div>

      <div className="menu-footer">
        <div className="neumatico-decorativo"></div>
        <p>© 2024 Carreras React</p>
      </div>

      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Elige tu nickname</h2>
            <input
              type="text"
              placeholder="Ej: LuikiCR"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              className="nickname-input"
            />
            <button onClick={guardarNickname} className="modal-button">
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuInicial;
