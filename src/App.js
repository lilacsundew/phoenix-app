import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MatchingGame from './components/MatchingGame';
import Login from './components/Login';
import Signup from './components/Signup';
import SignOutButton from './components/SignOutButton';
import MemoryGame from './components/MemoryGame';

// Create an AuthRoute component to wrap authenticated routes
function AuthRoute({ children }) {
  return (
    <>
      <SignOutButton />
      {children}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <AuthRoute>
            <Dashboard />
          </AuthRoute>
        } />
        <Route path="/game" element={
          <AuthRoute>
            <MatchingGame />
          </AuthRoute>
        } />
        <Route path="/memory-game" element={
          <AuthRoute>
            <MemoryGame />
          </AuthRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
