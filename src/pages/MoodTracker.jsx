import React, { useState } from 'react';
import './MoodTracker.scss';

const MoodTracker = () => {
  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😡', label: 'Angry' },
    { emoji: '😰', label: 'Anxious' }
  ];

  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    const entry = {
      id: Date.now(),
      mood,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };
    setMoodHistory([entry, ...moodHistory]);
  };

  return (
    <div className="mood-tracker">
      <h1>Mood Tracker</h1>
      
      <div className="mood-selector">
        <h2>How are you feeling?</h2>
        <div className="mood-grid">
          {moods.map((mood) => (
            <button
              key={mood.label}
              className={`mood-button ${selectedMood?.label === mood.label ? 'selected' : ''}`}
              onClick={() => handleMoodSelect(mood)}
            >
              <span className="emoji">{mood.emoji}</span>
              <span className="label">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mood-history">
        <h2>Mood History</h2>
        <div className="history-list">
          {moodHistory.map((entry) => (
            <div key={entry.id} className="history-item">
              <span className="emoji">{entry.mood.emoji}</span>
              <div className="entry-details">
                <span className="mood-label">{entry.mood.label}</span>
                <span className="timestamp">{entry.date} {entry.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
