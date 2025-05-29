import React, { useState, useEffect } from "react";
import './WordPuzzleApp.scss';

const wordBank = ["serena", "mindful", "calmness", "harmony", "balance", "support", "peaceful", "gratitude"];

const shuffleWord = (word) => {
  return word.split('').sort(() => Math.random() - 0.5).join('');
};

const WordPuzzleApp = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateNewWord();
  }, []);

  const generateNewWord = () => {
    const word = wordBank[Math.floor(Math.random() * wordBank.length)];
    setCurrentWord(word);
    setScrambled(shuffleWord(word));
    setGuess('');
    setMessage('');
  };

  const handleCheck = () => {
    if (guess.toLowerCase() === currentWord) {
      setMessage("🎉 Correct! Great job!");
      setScore(score + 1);
    } else {
      setMessage("❌ Try again!");
    }
  };

  return (
    <div className="word-puzzle-app">
      <h1>🧠 Word Puzzle Challenge</h1>
      <p>Unscramble the word to boost your brain power!</p>

      <div className="puzzle-box">
        <div className="scrambled-word">{scrambled}</div>
        <input
          type="text"
          placeholder="Your guess..."
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
        <div className="buttons">
          <button onClick={handleCheck}>Check</button>
          <button onClick={generateNewWord}>New Word</button>
        </div>
        {message && <p className="feedback">{message}</p>}
        <p className="score">Score: {score}</p>
      </div>
    </div>
  );
};

export default WordPuzzleApp;
