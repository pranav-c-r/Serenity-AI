import React, { useState, useEffect } from "react";
import './WordPuzzleApp.scss';

const wordBank = [
  "serena", "mindful", "calmness", "harmony", "balance", "support", "peaceful", "gratitude",
  "tranquility", "clarity", "resilience", "healing", "presence", "breathe", "soothe", "reflect",
  "acceptance", "stillness", "growth", "contentment", "kindness", "compassion", "awareness", "zen",
  "restful", "grounded", "hopeful", "forgiveness", "release", "focus", "nourish", "centered",
  "light", "ease", "joy", "flow", "connect", "simplicity", "serenity", "calm", "equanimity", "relief",
  "strength", "patience", "insight", "alignment", "purity", "relax", "care", "presence", "wellbeing",
  "renew", "confidence", "energy", "quietude", "introspection", "pause", "empathy", "stability",
  "uplift", "tenderness", "mindset", "compassionate", "innerpeace", "gentle", "meditate", "restore",
  "safe", "trust", "balance", "breathe", "recharge", "unwind", "vitality", "release", "letgo",
  "listen", "space", "peace", "seraphic", "guided", "insightful", "soothing", "calming", "embrace",
  "hope", "purpose", "presence", "courage", "hearten", "repose", "sanctuary", "equilibrium",
  "tranquil", "lucidity", "honesty", "detachment", "serendipity", "intention", "supportive", "awaken"
];


const shuffleWord = (word) => {
  return word.split('').sort(() => Math.random() - 0.5).join('');
};

const WordPuzzleApp = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    generateNewWord();
  }, []);

  const generateNewWord = () => {
    const word = wordBank[Math.floor(Math.random() * wordBank.length)];
    setCurrentWord(word);
    setScrambled(shuffleWord(word));
    setGuess('');
    setMessage('');
    setShowAnswer(false);
  };

  const handleCheck = () => {
    if (guess.toLowerCase() === currentWord) {
      setMessage("🎉 Correct! Great job!");
      setScore(score + 1);
    } else {
      setMessage("❌ Try again!");
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
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
        <button 
          className="show-answer-btn" 
          onClick={toggleAnswer}
        >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
        {showAnswer && (
          <p className="answer">The answer is: <span>{currentWord}</span></p>
        )}
      </div>
    </div>
  );
};

export default WordPuzzleApp;
