import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuInicial from './Interface/MainMenu';
import CreateMatch from './Interface/CreateMatch';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/unirse-partida" element={<CreateMatch />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  const handleCrearPartida = () => {
    window.location.href = "/unirse-partida";
  };

  const handleUnirsePartida = () => {
    console.log("Unirse a partida clickeado");
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