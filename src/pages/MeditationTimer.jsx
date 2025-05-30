import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import './MeditationTimer.scss';

const MeditationTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [selectedSound, setSelectedSound] = useState('rain');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const ambientSounds = {
    rain: 'src/assets/music/gentlerain.mp3',
    ocean: 'src/assets/music/oceanwaves.mp3',
    forest: 'src/assets/music/foreststream.mp3',
    whiteNoise: 'src/assets/music/space.mp3'
  };

  const durations = [5, 10, 15, 20, 30];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isRunning && !isMuted) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isRunning, isMuted, volume, selectedSound]);

  const startTimer = () => {
    if (!isRunning) {
      setTimeLeft(selectedDuration * 60);
      setIsRunning(true);
      if (audioRef.current && !isMuted) {
        audioRef.current.play();
      }
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="meditation-timer">
      <h1>Meditation Timer</h1>
      <p>Find your peace with guided meditation</p>

      <div className="timer-box">
        <div className="timer-display">
          <span className="time">{formatTime(timeLeft)}</span>
        </div>

        <div className="controls">
          <div className="duration-selector">
            <label>Duration (minutes):</label>
            <div className="duration-buttons">
              {durations.map(duration => (
                <button
                  key={duration}
                  className={selectedDuration === duration ? 'active' : ''}
                  onClick={() => setSelectedDuration(duration)}
                  disabled={isRunning}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>

          <div className="sound-selector">
            <label>Ambient Sound:</label>
            <select
              value={selectedSound}
              onChange={(e) => setSelectedSound(e.target.value)}
              disabled={isRunning}
            >
              <option value="rain">Rain</option>
              <option value="ocean">Ocean Waves</option>
              <option value="forest">Forest</option>
              <option value="whiteNoise">White Noise</option>
            </select>
          </div>

          <div className="volume-control">
            <button
              className="mute-button"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </div>

          <div className="timer-buttons">
            {!isRunning ? (
              <button className="start-button" onClick={startTimer}>
                <FaPlay /> Start
              </button>
            ) : (
              <button className="pause-button" onClick={pauseTimer}>
                <FaPause /> Pause
              </button>
            )}
            <button className="reset-button" onClick={resetTimer}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={ambientSounds[selectedSound]}
        loop
      />
    </div>
  );
};

export default MeditationTimer; 