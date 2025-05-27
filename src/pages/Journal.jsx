import React, { useEffect, useState } from 'react';
import './Journal.scss';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import { Timestamp } from 'firebase/firestore';
const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEntry.trim()) return;
    const entry = {
      id: auth.currentUser?.uid,
      content: newEntry,
      date: new Date().toLocaleDateString(),
      timestamp: Timestamp.now(),
    };
    const groupRef = doc(database, 'Users', auth.currentUser?.uid);
    const messagesRef = collection(groupRef, 'journals');
    const newMessageRef = doc(messagesRef, `${Math.random()}`);
    await setDoc(newMessageRef, entry);

    setEntries([entry, ...entries]);
    setNewEntry('');
    fetchJournal();
  };
  const fetchJournal = async () => {
      const ref = doc(database, 'Users', auth.currentUser?.uid);
      const journalref = collection(ref, 'journals');
      const querySnapshot = await getDocs(journalref);

      const journals = [];
      querySnapshot.forEach((doc) => {
          journals.push(doc.data());
      });
      const sortedJournals = journals.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
      setEntries(sortedJournals);
  };
  useEffect(()=>{
    fetchJournal();
  }, [auth.currentUser])
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
            <div className="entry-date"><h3>{entry.date} at {entry.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h3></div>
            <div className="entry-content">{entry.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal;
