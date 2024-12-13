import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MatchingGame from './components/MatchingGame';

function HomeComponent() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome</h1>
      <div className="button-container">
        <button 
          className="home-button" 
          onClick={() => navigate('/dashboard')}
        >
          Welcome Back
        </button>
        <button className="home-button">Sign Up</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/game" element={<MatchingGame />} />
      </Routes>
    </div>
  );
}

export default App;
