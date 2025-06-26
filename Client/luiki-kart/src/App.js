import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MenuInicial from './Interface/MainMenu';
import CreateMatch from './Interface/CreateMatch';
import MatchList from './Interface/MatchList';
import WaitingRoom from './Interface/WaitingRoom';
import GameView from './Interface/GameView';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/unirse-partida" element={<CreateMatch />} />
          <Route path="/partidas" element={<MatchList />} />
          <Route path="/sala-espera/:partidaId" element={<WaitingRoom />} />
          <Route path="/juego/:partidaId" element={<GameView />} />
        </Routes>
      </div>
    </Router>
  );
}


function Home() {
  const navigate = useNavigate();

  const handleCrearPartida = () => {
    navigate('/unirse-partida');
  };

  const handleUnirsePartida = () => {
    navigate('/partidas');
  };

  const handleVerRanking = () => {
    console.log("Ver ranking clickeado");
  };

  return (
    <MenuInicial
      onCrearPartida={handleCrearPartida}
      onUnirsePartida={handleUnirsePartida}
      onVerRanking={handleVerRanking}
    />
  );
}

export default App;