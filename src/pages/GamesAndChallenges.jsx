import React from 'react';
import './GamesAndChallenges.scss';

const GamesAndChallenges = () => {
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
          <button className="play-button">Play Now</button>
        </div>

        <div className="game-card">
          <div className="game-icon">🧩</div>
          <h3>Word Puzzles</h3>
          <p>Challenge your mind with word-based puzzles and riddles</p>
          <button className="play-button">Play Now</button>
        </div>

        <div className="game-card">
          <div className="game-icon">🎯</div>
          <h3>Focus Challenge</h3>
          <p>Improve your concentration with timed focus exercises</p>
          <button className="play-button">Play Now</button>
        </div>

        <div className="game-card">
          <div className="game-icon">🎨</div>
          <h3>Creative Expression</h3>
          <p>Express yourself through interactive art challenges</p>
          <button className="play-button">Play Now</button>
        </div>
      </div>
    </div>
  );
};

export default GamesAndChallenges; 