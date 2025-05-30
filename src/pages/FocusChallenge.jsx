import React, { useEffect, useState } from 'react';
import './FocusChallenge.scss';

const getRandomKey = () => {
  const keys = 'ASDFJKL;';
  return keys[Math.floor(Math.random() * keys.length)];
};

const FocusChallenge = () => {
  const [targetKey, setTargetKey] = useState(getRandomKey());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(true);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameActive) return;
      if (e.key.toUpperCase() === targetKey) {
        setScore((prev) => prev + 1);
        setFeedback('✅ Great!');
      } else {
        setFeedback('❌ Try again!');
      }
      setTargetKey(getRandomKey());
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [targetKey, gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    if (timeLeft === 0) {
      setGameActive(false);
      setFeedback(`⏰ Time's up!`);
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive]);

  const restartGame = () => {
    setTargetKey(getRandomKey());
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setFeedback('');
  };

  return (
    <div className="focus-challenge">
      <h1>🎯 Focus Challenge</h1>
      <p>Improve your concentration by pressing the correct key</p>

      <div className="challenge-box">
        {gameActive ? (
          <>
            <div className="target-key">Press: <span>{targetKey}</span></div>
            <div className="timer">Time Left: {timeLeft}s</div>
            <div className="score">Score: {score}</div>
            <div className="feedback">{feedback}</div>
          </>
        ) : (
          <div className="results">
            <div className="final-score">Final Score: {score}</div>
            <button onClick={restartGame}>Restart</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusChallenge;
