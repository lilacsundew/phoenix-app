import React, { useState, useEffect } from 'react';
import './MatchingGame.css';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';

const shapes = ['circle', 'square', 'triangle', 'star'];

function MatchingGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [currentShape, setCurrentShape] = useState(null);
  const [previousShape, setPreviousShape] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [pressedKey, setPressedKey] = useState(null);
  const [username, setUsername] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);

  // Generate a random shape
  const getRandomShape = () => {
    return shapes[Math.floor(Math.random() * shapes.length)];
  };

  // Start the game
  useEffect(() => {
    setCurrentShape(getRandomShape());
    
    // Start timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        setPressedKey(e.key);
        
        const isMatch = previousShape === currentShape;
        const correctAnswer = 
          (e.key === 'ArrowRight' && isMatch) || 
          (e.key === 'ArrowLeft' && !isMatch);

        if (correctAnswer) {
          // Update streak and multiplier
          const newStreak = streak + 1;
          setStreak(newStreak);
          
          // Update multiplier every 5 correct answers
          if (newStreak % 5 === 0) {
            setMultiplier(Math.min(4, Math.floor(newStreak / 5) + 1));
          }
          
          // Add score with multiplier
          setScore(prev => prev + (1 * multiplier));
        } else {
          // Wrong answer feedback
          setShowWrongAnswer(true);
          setStreak(0);
          setMultiplier(1);
          setScore(0);
          
          setTimeout(() => {
            setShowWrongAnswer(false);
          }, 300);
        }

        setPreviousShape(currentShape);
        setCurrentShape(getRandomShape());

        setTimeout(() => {
          setPressedKey(null);
        }, 150);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentShape, previousShape, gameOver, streak, multiplier]);

  // Add this new useEffect to fetch leaderboard data when component mounts
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Add this new function to fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      const leaderboardRef = collection(db, 'leaderboard');
      const q = query(leaderboardRef, orderBy('score', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      
      const leaderboardData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  // Update the handleUsernameSubmit function
  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (username.length === 3) {
      try {
        const leaderboardRef = collection(db, 'leaderboard');
        await addDoc(leaderboardRef, {
          username: username.toUpperCase(),
          score,
          date: new Date().toISOString()
        });

        // Fetch updated leaderboard
        await fetchLeaderboard();
        setShowLeaderboard(true);
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
  };

  return (
    <div className={`matching-game ${showWrongAnswer ? 'wrong-answer' : ''}`}>
      <div className="game-header">
        <div className="score">Score: {score}</div>
        <div className="multiplier">×{multiplier}</div>
        <div className="timer">Time: {timeLeft}s</div>
      </div>

      <div className="game-container">
        {gameOver ? (
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>Final Score: {score}</p>
            
            {!showLeaderboard ? (
              <form onSubmit={handleUsernameSubmit} className="username-form">
                <label>
                  Enter 3-letter username:
                  <input
                    type="text"
                    maxLength="3"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toUpperCase())}
                    pattern="[A-Za-z]{3}"
                    required
                  />
                </label>
                <button type="submit">Submit Score</button>
              </form>
            ) : (
              <div className="leaderboard">
                <h3>Leaderboard</h3>
                <div className="leaderboard-grid">
                  <div className="leaderboard-header">
                    <span>Rank</span>
                    <span>User</span>
                    <span>Score</span>
                  </div>
                  {leaderboard.map((entry, index) => (
                    <div 
                      key={entry.id} 
                      className={`leaderboard-entry ${entry.username === username ? 'current-user' : ''}`}
                    >
                      <span>{index + 1}</span>
                      <span>{entry.username}</span>
                      <span>{entry.score}</span>
                    </div>
                  ))}
                </div>
                <button 
                  className="play-again-button"
                  onClick={() => window.location.reload()}
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="cards-container">
              {previousShape && (
                <div className="card previous">
                  <div className={`shape ${previousShape}`}></div>
                  <div className="card-label">Previous Shape</div>
                </div>
              )}
              <div className="card current">
                <div className={`shape ${currentShape}`}></div>
                <div className="card-label">Current Shape</div>
              </div>
            </div>

            <div className="key-instructions">
              <div className={`key-container ${pressedKey === 'ArrowLeft' ? 'pressed' : ''}`}>
                <div className="key left-key">
                  <span className="arrow">←</span>
                </div>
                <div className="key-label">Different Shape</div>
              </div>

              <div className={`key-container ${pressedKey === 'ArrowRight' ? 'pressed' : ''}`}>
                <div className="key right-key">
                  <span className="arrow">→</span>
                </div>
                <div className="key-label">Same Shape</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MatchingGame; 