import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MemoryGame.css';

const cardImages = [
  { src: '🎮', matched: false },
  { src: '🎲', matched: false },
  { src: '🎯', matched: false },
  { src: '🎨', matched: false },
  { src: '🎭', matched: false },
  { src: '🎪', matched: false },
  { src: '🎢', matched: false },
  { src: '🎡', matched: false },
];

function MemoryGame() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [matches, setMatches] = useState(0);
  const [flippedCards, setFlippedCards] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);

  // Add timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isGameOver && matches < 8) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isGameOver && matches < 8) {
      setIsGameOver(true);
      setDisabled(true);
    }
  }, [timeLeft, matches, isGameOver]);

  // Shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));
    
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setMatches(0);
    setFlippedCards([]);
    setTimeLeft(30);
    setIsGameOver(false);
    setDisabled(false);
  };

  // Handle a choice
  const handleChoice = (card) => {
    if (disabled) return;
    
    setFlippedCards(prev => [...prev, card.id]);
    
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // Compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            }
            return card;
          });
        });
        setMatches(prev => prev + 1);
        resetTurn();
      } else {
        setTimeout(() => {
          setFlippedCards(prev => 
            prev.filter(id => id !== choiceOne.id && id !== choiceTwo.id)
          );
          resetTurn();
        }, 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // Reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  };

  // Start game automatically
  useEffect(() => {
    shuffleCards();
  }, []);

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="memory-game">
      <div className="game-info">
        <div className="game-header">
          <button className="back-button" onClick={handleBack}>
            ← Back to Menu
          </button>
          <h2>Memory Game</h2>
        </div>
        <div className="stats">
          <span>Turns: {turns}</span>
          <span>Matches: {matches}/8</span>
          <span className={timeLeft <= 10 ? 'timer-warning' : ''}>
            Time: {timeLeft}s
          </span>
        </div>
        <button onClick={shuffleCards}>New Game</button>
      </div>

      <div className="card-grid">
        {cards.map(card => (
          <div 
            className={`card ${card.matched ? 'matched' : ''} ${
              flippedCards.includes(card.id) ? 'flipped' : ''
            }`}
            key={card.id}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.src}</div>
            </div>
            <button 
              className="card-button"
              onClick={() => handleChoice(card)}
              disabled={
                card.matched || 
                flippedCards.includes(card.id) || 
                disabled
              }
            ></button>
          </div>
        ))}
      </div>

      {isGameOver && (
        <div className="game-over-message">
          <h2>Game Over!</h2>
          <p>Time's up! Try again?</p>
          <button onClick={shuffleCards}>Play Again</button>
        </div>
      )}

      {matches === 8 && (
        <div className="win-message">
          <h2>Congratulations! 🎉</h2>
          <p>You won in {turns} turns with {timeLeft} seconds left!</p>
          <button onClick={shuffleCards}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default MemoryGame; 