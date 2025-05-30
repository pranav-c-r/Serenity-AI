import React, { useState, useEffect } from 'react';
import { FaSmile, FaSadTear, FaAngry, FaSurprise, FaMeh } from 'react-icons/fa';
import './EmotionRecognition.scss';

const EmotionRecognition = () => {
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [streak, setStreak] = useState(0);

  const emotions = [
    { name: 'Happy', icon: FaSmile, color: '#FFD700' },
    { name: 'Sad', icon: FaSadTear, color: '#4169E1' },
    { name: 'Angry', icon: FaAngry, color: '#FF4500' },
    { name: 'Surprised', icon: FaSurprise, color: '#FF69B4' },
    { name: 'Neutral', icon: FaMeh, color: '#808080' }
  ];

  useEffect(() => {
    generateNewRound();
  }, []);

  const generateNewRound = () => {
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setCurrentEmotion(randomEmotion);
    
    const shuffledEmotions = [...emotions].sort(() => Math.random() - 0.5);
    const selectedOptions = shuffledEmotions.slice(0, 3);
    
    if (!selectedOptions.find(option => option.name === randomEmotion.name)) {
      selectedOptions[0] = randomEmotion;
    }
    
    setOptions(selectedOptions.sort(() => Math.random() - 0.5));
    setMessage('');
    setIsCorrect(null);
  };

  const handleGuess = (selectedEmotion) => {
    const isCorrectGuess = selectedEmotion.name === currentEmotion.name;
    setIsCorrect(isCorrectGuess);
    
    if (isCorrectGuess) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setMessage(`Correct! That's a ${currentEmotion.name} expression.`);
    } else {
      setStreak(0);
      setMessage(`Incorrect. That was a ${currentEmotion.name} expression.`);
    }

    setTimeout(() => {
      generateNewRound();
    }, 1500);
  };

  const IconComponent = currentEmotion?.icon;

  return (
    <div className="emotion-recognition">
      <h1>Emotion Recognition</h1>
      <p>Test your ability to recognize facial expressions</p>

      <div className="game-box">
        <div className="score-display">
          <div className="score">Score: {score}</div>
          {streak > 1 && <div className="streak">🔥 {streak} in a row!</div>}
        </div>

        <div className="emotion-display">
          {IconComponent && (
            <IconComponent
              style={{ color: currentEmotion.color }}
              className="emotion-icon"
            />
          )}
        </div>

        <div className="options-grid">
          {options.map((emotion) => {
            const EmotionIcon = emotion.icon;
            return (
              <button
                key={emotion.name}
                className={`option-button ${isCorrect !== null ? 'disabled' : ''}`}
                onClick={() => handleGuess(emotion)}
                disabled={isCorrect !== null}
              >
                <EmotionIcon
                  style={{ color: emotion.color }}
                  className="option-icon"
                />
                <span className="option-name">{emotion.name}</span>
              </button>
            );
          })}
        </div>

        <div className={`feedback ${isCorrect !== null ? (isCorrect ? 'correct' : 'incorrect') : ''}`}>
          {message}
        </div>
      </div>
    </div>
  );
};

export default EmotionRecognition; 