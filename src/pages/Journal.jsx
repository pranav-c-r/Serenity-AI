import React, { useEffect, useState } from 'react';
import './Journal.scss';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import { Timestamp } from 'firebase/firestore';
import { sendMessageToGemini } from '../services/geminiService';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const entry = {
      id,
      content: newEntry,
      date: new Date().toLocaleDateString(),
      timestamp: Timestamp.now(),
      analysis: '',
    };

    const groupRef = doc(database, 'Users', auth.currentUser?.uid);
    const messagesRef = collection(groupRef, 'journals');
    const newMessageRef = doc(messagesRef, id);
    await setDoc(newMessageRef, entry);

    setEntries([entry, ...entries]);
    setNewEntry('');
    fetchJournal();
  };

  const fetchJournal = async () => {
    const ref = doc(database, 'Users', auth.currentUser?.uid);
    const journalRef = collection(ref, 'journals');
    const querySnapshot = await getDocs(journalRef);

    const journals = [];
    querySnapshot.forEach((doc) => {
      journals.push(doc.data());
    });
    const sortedJournals = journals.sort(
      (a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()
    );
    setEntries(sortedJournals);
  };

  const handleGeminiAnalysis = async (entry) => {
    setLoading(true);
    try {
      const systemPrompt = `You are Serenity, an AI assistant. Analyze the user's journal entry below. Your response should:
- Praise the positive events and attitudes.
- Criticize negative events and suggest ways to improve.
- Provide advice for better social and career growth.
Be empathetic and constructive.`;

      const analysis = await sendMessageToGemini(entry.content, [], systemPrompt);

      setSelectedAnalysis(analysis);
      setShowPopup(true);

      // Save the analysis back to Firebase
      const journalDocRef = doc(database, 'Users', auth.currentUser?.uid, 'journals', entry.id);
      await updateDoc(journalDocRef, { analysis });

      // Update local state
      const updatedEntries = entries.map((e) =>
        e.id === entry.id ? { ...e, analysis } : e
      );
      setEntries(updatedEntries);
    } catch (err) {
      console.error('Gemini error:', err);
      setSelectedAnalysis('Failed to analyze journal entry.');
      setShowPopup(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJournal();
  }, [auth.currentUser]);

  return (
    <div className="journal">
      <h1>Journal</h1>
      <form onSubmit={handleSubmit} className="journal-form">
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="How are you feeling today?"
          rows="4"
        />
        <button type="submit">Save Entry</button>
      </form>

      <div className="journal-entries">
        {entries.map((entry) => (
          <div key={entry.id} className="journal-entry">
            <div className="entry-date">
              <h3>
                {entry.date} at{' '}
                {entry.timestamp.toDate().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </h3>
            </div>
            <div className="entry-content">{entry.content}</div>
            <button onClick={() => handleGeminiAnalysis(entry)}>
              What Serenity felt
            </button>
          </div>
        ))}
      </div>

      {loading && <div className="loading-overlay">Analyzing with Serenity...</div>}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Serenity's Perception</h3>
            <p>{selectedAnalysis}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
