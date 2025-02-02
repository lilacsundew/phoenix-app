import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Game Dashboard</h1>
          <div className="button-group">
            <button 
              className="start-game-button"
              onClick={() => navigate('/game')}
            >
              Start Game
            </button>
            <button 
              className="memory-game-button"
              onClick={() => navigate('/memory-game')}
            >
              Play Memory Game
            </button>
          </div>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome Back!</h2>
          <p>Ready to start your next adventure?</p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard; 