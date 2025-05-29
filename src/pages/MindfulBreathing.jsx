import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import './MindfulBreathing.scss'; // Import your SCSS file

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('rest'); // 'inhale', 'hold', 'exhale', 'rest'
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  
  // Customizable breathing pattern (in seconds)
  const [breathingPattern, setBreathingPattern] = useState({
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 2
  });

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Move to next phase
      if (phase === 'inhale') {
        setPhase('hold');
        setTimeLeft(breathingPattern.hold);
      } else if (phase === 'hold') {
        setPhase('exhale');
        setTimeLeft(breathingPattern.exhale);
      } else if (phase === 'exhale') {
        setPhase('rest');
        setTimeLeft(breathingPattern.rest);
      } else if (phase === 'rest') {
        setCycle(cycle + 1);
        if (cycle + 1 >= totalCycles) {
          setIsActive(false);
          setPhase('rest');
          setTimeLeft(0);
        } else {
          setPhase('inhale');
          setTimeLeft(breathingPattern.inhale);
        }
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, cycle, totalCycles, breathingPattern]);

  const handleStart = () => {
    if (!isActive && phase === 'rest' && timeLeft === 0) {
      // Starting fresh
      setPhase('inhale');
      setTimeLeft(breathingPattern.inhale);
    }
    setIsActive(!isActive);
  };

  const handleStop = () => {
    setIsActive(false);
    setPhase('rest');
    setTimeLeft(0);
    setCycle(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'rest': return isActive ? 'Rest' : 'Ready';
      default: return 'Ready';
    }
  };

  const getInstructions = () => {
    switch (phase) {
      case 'inhale': return 'Breathe in slowly through your nose...';
      case 'hold': return 'Hold your breath gently...';
      case 'exhale': return 'Breathe out slowly through your mouth...';
      case 'rest': return isActive ? 'Take a moment to rest...' : 'Click start when you\'re ready to begin';
      default: return 'Ready to begin breathing exercise';
    }
  };

  const handlePatternChange = (phaseType, value) => {
    if (!isActive) {
      setBreathingPattern(prev => ({
        ...prev,
        [phaseType]: parseInt(value) || 1
      }));
    }
  };

  return (
    <div className="mindful-breathing-page">
      <div className="breathing-container">
        <h1>Mindful Breathing</h1>
        <p className="subtitle">
          Find your center with guided diaphragmatic breathing
        </p>

        {/* Breathing Circle */}
        <div className="breathing-circle" data-phase={phase}>
          <div className="circle-content">
            <h2>{getPhaseText()}</h2>
            <div className="breath-count">
              {timeLeft > 0 ? timeLeft : ''}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <p style={{ fontSize: '1.1rem', margin: '1rem 0', color: 'var(--secondary)' }}>
          {getInstructions()}
        </p>
        
        {/* Progress */}
        <p style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>
          {isActive || cycle > 0 ? `Cycle ${cycle + 1} of ${totalCycles}` : ''}
        </p>

        {/* Controls */}
        <div className="controls">
          <button
            onClick={handleStart}
            className={isActive ? 'stop-button' : 'start-button'}
            style={{ marginRight: '1rem' }}
          >
            {isActive ? (
              <>
                <Pause size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Pause
              </>
            ) : (
              <>
                <Play size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Start
              </>
            )}
          </button>
          
          <button
            onClick={handleStop}
            className="stop-button"
          >
            <RotateCcw size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Reset
          </button>
        </div>

        {/* Customization */}
        <div className="customization">
          <h3>Customize Your Breathing Pattern</h3>
          <div className="duration-controls">
            <div className="duration-input">
              <label>Inhale Duration (seconds)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={breathingPattern.inhale}
                onChange={(e) => handlePatternChange('inhale', e.target.value)}
                disabled={isActive}
              />
            </div>
            <div className="duration-input">
              <label>Hold Duration (seconds)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={breathingPattern.hold}
                onChange={(e) => handlePatternChange('hold', e.target.value)}
                disabled={isActive}
              />
            </div>
            <div className="duration-input">
              <label>Exhale Duration (seconds)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={breathingPattern.exhale}
                onChange={(e) => handlePatternChange('exhale', e.target.value)}
                disabled={isActive}
              />
            </div>
            <div className="duration-input">
              <label>Rest Duration (seconds)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={breathingPattern.rest}
                onChange={(e) => handlePatternChange('rest', e.target.value)}
                disabled={isActive}
              />
            </div>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--secondary)' }}>
              Total Cycles
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={totalCycles}
              onChange={(e) => setTotalCycles(parseInt(e.target.value) || 1)}
              disabled={isActive}
              style={{
                width: '100px',
                padding: '0.8rem',
                border: '2px solid',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="benefits">
          <h3>Benefits of Mindful Breathing</h3>
          <ul>
            <li>Reduces stress and anxiety</li>
            <li>Improves focus and concentration</li>
            <li>Lowers blood pressure</li>
            <li>Enhances emotional regulation</li>
            <li>Promotes better sleep</li>
            <li>Increases mindfulness and presence</li>
          </ul>
        </div>

        {/* Completion Message */}
        {cycle >= totalCycles && !isActive && cycle > 0 && (
          <div style={{
            marginTop: '2rem',
            padding: '2rem',
            background: 'var(--highlight)',
            color: 'var(--background)',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h3>🌟 Excellent Work!</h3>
            <p>You've completed {totalCycles} breathing cycles. Take a moment to notice how you feel and carry this sense of calm with you.</p>
          </div>
        )}
      </div>
    </div>
  );
}