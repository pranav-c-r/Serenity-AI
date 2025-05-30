import React, { useState, useEffect } from 'react';
import './MindfulListening.scss';

const sounds = [
  { id: 1, name: 'Rain', audio: 'src/assets/music/gentlerain.mp3', icon: '🌧️' },
  { id: 2, name: 'Ocean Waves', audio: 'src/assets/music/oceanwaves.mp3', icon: '🌊' },
  { id: 3, name: 'Forest Stream', audio: 'src/assets/music/foreststream.mp3', icon: '🌲' },
  { id: 4, name: 'Mountain Wind', audio: 'src/assets/music/mountainwind.mp3', icon: '🌪️' },
  { id: 5, name: 'Storm Clouds', audio: 'src/assets/music/stormclouds.mp3', icon: '⛈️' },
  { id: 6, name: 'Space', audio: 'src/assets/music/space.mp3', icon: '🚀' }
];

const MindfulListening = () => {
  const [currentSound, setCurrentSound] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());

  const generateOptions = (correctSound) => {
    const shuffled = [...sounds].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    if (!selected.find(s => s.id === correctSound.id)) {
      selected[0] = correctSound;
    }
    return selected.sort(() => 0.5 - Math.random());
  };

  const startNewRound = () => {
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    setCurrentSound(randomSound);
    setOptions(generateOptions(randomSound));
    setMessage('');
    setIsPlaying(false);
  };

  useEffect(() => {
    startNewRound();
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const playSound = () => {
    if (currentSound) {
      audio.src = currentSound.audio;
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    }
  };

  const handleGuess = (selectedSound) => {
    if (selectedSound.id === currentSound.id) {
      setScore(prev => prev + 1);
      setMessage('🎉 Correct! Well done!');
    } else {
      setMessage('❌ Try again!');
    }
    setTimeout(startNewRound, 1500);
  };

  return (
    <div className="mindful-listening">
      <h1>🎧 Mindful Listening Challenge</h1>
      <p>Listen carefully and identify the nature sound</p>

      <div className="challenge-box">
        <div className="sound-player">
          <button 
            className={`play-button ${isPlaying ? 'playing' : ''}`}
            onClick={playSound}
            disabled={isPlaying}
          >
            {isPlaying ? '🔊 Playing...' : '▶️ Play Sound'}
          </button>
        </div>

        <div className="options-grid">
          {options.map((sound) => (
            <button
              key={sound.id}
              className="option-button"
              onClick={() => handleGuess(sound)}
              disabled={isPlaying}
            >
              <span className="sound-icon">{sound.icon}</span>
              <span className="sound-name">{sound.name}</span>
            </button>
          ))}
        </div>

        {message && <p className="feedback">{message}</p>}
        <p className="score">Score: {score}</p>
      </div>
    </div>
  );
};

export default MindfulListening; 