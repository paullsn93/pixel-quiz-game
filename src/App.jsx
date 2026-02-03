import React, { useState } from 'react';
import Login from './components/Login';
import Game from './components/Game';
import Result from './components/Result';

function App() {
  const [view, setView] = useState('login'); // login, game, result
  const [user, setUser] = useState(null);
  const [scoreData, setScoreData] = useState(null);

  const handleLogin = (id) => {
    setUser(id);
    setView('game');
  };

  const handleGameEnd = (data) => {
    setScoreData(data);
    setView('result');
  };

  const handleRestart = () => {
    setScoreData(null);
    setView('game');
  };

  const handleLogout = () => {
    setUser(null);
    setScoreData(null);
    setView('login');
  };

  return (
    <>
      {view === 'login' && <Login onLogin={handleLogin} />}

      {view === 'game' && (
        <Game user={user} onEnd={handleGameEnd} />
      )}

      {view === 'result' && (
        <Result data={scoreData} onRestart={handleRestart} />
      )}
    </>
  );
}

export default App;
