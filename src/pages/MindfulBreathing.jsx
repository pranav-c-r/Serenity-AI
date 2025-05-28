import React, { useState, useEffect } from 'react';
import './MindfulBreathing.scss';

const MindfulBreathing = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [breathPhase, setBreathPhase] = useState('inhale'); // inhale, hold, exhale, rest
  const [timer, setTimer] = useState(null);
  const [customDuration, setCustomDuration] = useState({
    inhale: 4,
    hold: 4,
    exhale: 6,
    rest: 2
  });

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathCount(0);
    setBreathPhase('inhale');
    runBreathingCycle();
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  };

  const runBreathingCycle = () => {
    if (!isBreathing) return;

    const phases = ['inhale', 'hold', 'exhale', 'rest'];
    const currentIndex = phases.indexOf(breathPhase);
    const nextPhase = phases[(currentIndex + 1) % phases.length];
    const duration = customDuration[breathPhase] * 1000;

    setBreathPhase(nextPhase);
    if (breathPhase === 'rest') {
      setBreathCount(prev => prev + 1);
    }

    const newTimer = setTimeout(runBreathingCycle, duration);
    setTimer(newTimer);
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  const getBreathingInstructions = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe in slowly through your nose...';
      case 'hold':
        return 'Hold your breath...';
      case 'exhale':
        return 'Breathe out slowly through your mouth...';
      case 'rest':
        return 'Rest and prepare for the next breath...';
      default:
        return '';
    }
  };

  const handleDurationChange = (phase, value) => {
    setCustomDuration(prev => ({
      ...prev,
      [phase]: Math.max(1, Math.min(10, parseInt(value) || 1))
    }));
  };

  return (
    <div className="mindful-breathing-page">
      <div className="breathing-container">
        <h1>Mindful Breathing Coach</h1>
        <p className="subtitle">Take a moment to breathe and find your calm</p>

        <div className="breathing-circle" data-phase={breathPhase}>
          <div className="circle-content">
            <h2>{getBreathingInstructions()}</h2>
            {isBreathing && <p className="breath-count">Breath {breathCount + 1}</p>}
          </div>
        </div>

        <div className="controls">
          {!isBreathing ? (
            <button className="start-button" onClick={startBreathing}>
              Start Breathing Exercise
            </button>
          ) : (
            <button className="stop-button" onClick={stopBreathing}>
              Stop Exercise
            </button>
          )}
        </div>

        <div className="customization">
          <h3>Customize Your Breathing Pattern</h3>
          <div className="duration-controls">
            <div className="duration-input">
              <label>Inhale (seconds)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={customDuration.inhale}
                onChange={(e) => handleDurationChange('inhale', e.target.value)}
                disabled={isBreathing}
              />
            </div>
            <div className="duration-input">
              <label>Hold (seconds)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={customDuration.hold}
                onChange={(e) => handleDurationChange('hold', e.target.value)}
                disabled={isBreathing}
              />
            </div>
            <div className="duration-input">
              <label>Exhale (seconds)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={customDuration.exhale}
                onChange={(e) => handleDurationChange('exhale', e.target.value)}
                disabled={isBreathing}
              />
            </div>
            <div className="duration-input">
              <label>Rest (seconds)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={customDuration.rest}
                onChange={(e) => handleDurationChange('rest', e.target.value)}
                disabled={isBreathing}
              />
            </div>
          </div>
        </div>

        <div className="benefits">
          <h3>Benefits of Mindful Breathing</h3>
          <ul>
            <li>Reduces stress and anxiety</li>
            <li>Improves focus and concentration</li>
            <li>Lowers blood pressure</li>
            <li>Promotes better sleep</li>
            <li>Enhances emotional well-being</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MindfulBreathing; 