import React from 'react';
import './GamesAndChallenges.scss';
import { useNavigate } from 'react-router-dom';

const GamesAndChallenges = () => {
  const navigate = useNavigate();
  return (
    <div className="games-challenges">
      <div className="page-header">
        <h1>Games & Challenges</h1>
        <p>Engage in fun activities to boost your mental well-being</p>
      </div>
      
      <div className="games-grid">
        <div className="game-card">
          <div className="game-icon">🎮</div>
          <h3>Memory Match</h3>
          <p>Test and improve your memory with this classic matching game</p>
          <button onClick={()=>navigate('/cardApp')} className="play-button">Play Now</button>
        </div>

        <div className="game-card">
          <div className="game-icon">🧩</div>
          <h3>Word Puzzles</h3>
          <p>Challenge your mind with word-based puzzles and riddles</p>
          <button onClick={() => navigate('/wordPuzzle')} className="play-button">Play Now</button>
        </div>

        <div className="game-card">
          <div className="game-icon">🎯</div>
          <h3>Focus Challenge</h3>
          <p>Improve your concentration with timed focus exercises</p>
          <button onClick={()=>navigate('/focusChallenge')} className="play-button">Play Now</button>
        </div>

        <div className="game-card">
          <div className="game-icon">🎨</div>
          <h3>Creative Expression</h3>
          <p>Express yourself through interactive art challenges</p>
          <button onClick={()=>navigate('/creativeExpression')} className="play-button">Play Now</button>
        </div>

        <div className="game-card">
          <div className="game-icon">🎧</div>
          <h3>Mindful Listening</h3>
          <p>Train your ears to recognize different nature sounds</p>
          <button onClick={()=>navigate('/mindfulListening')} className="play-button">Play Now</button>
        </div>

        <div className="game-card">
          <div className="game-icon">🧘</div>
          <h3>Meditation Timer</h3>
          <p>Customize your meditation session with ambient sounds</p>
          <button onClick={()=>navigate('/meditationTimer')} className="play-button">Play Now</button>
        </div>

        <div className="game-card">
          <div className="game-icon">😊</div>
          <h3>Emotion Recognition</h3>
          <p>Learn to identify and understand different emotions</p>
          <button onClick={()=>navigate('/emotionRecognition')} className="play-button">Play Now</button>
        </div>

        <div className="game-card">
          <div className="game-icon">✨</div>
          <h3>Affirmation Builder</h3>
          <p>Create and practice positive affirmations for daily motivation</p>
          <button onClick={()=>navigate('/affirmationBuilder')} className="play-button">Play Now</button>
        </div>
      </div>
    </div>
  );
};

export default GamesAndChallenges; 