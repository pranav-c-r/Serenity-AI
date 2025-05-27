import React, { useState, useEffect } from 'react';
import './MoodTracker.scss';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import { Timestamp } from 'firebase/firestore';
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

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    const entry = {
      id: auth.currentUser?.uid,
      mood: mood,
      date: new Date().toLocaleDateString(),
      timestamp: Timestamp.now(),
    };
    const groupRef = doc(database, 'Users', auth.currentUser?.uid);
    const messagesRef = collection(groupRef, 'moods');
    const newMessageRef = doc(messagesRef, `${Math.random()}`);
    await setDoc(newMessageRef, entry);

    setMoodHistory([entry, ...moodHistory]);
    setSelectedMood(null);
    fetchMoods();
  };
  const fetchMoods = async () => {
    const ref = doc(database, 'Users', auth.currentUser?.uid);
    const journalref = collection(ref, 'moods');
    const querySnapshot = await getDocs(journalref);

    const journals = [];
    querySnapshot.forEach((doc) => {
        journals.push(doc.data());
    });
    const sortedJournals = journals.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
    setMoodHistory(sortedJournals);
  };
  useEffect(()=>{
    fetchMoods();
  }, [auth.currentUser])
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
                <span className="timestamp">{entry.date} {entry.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
