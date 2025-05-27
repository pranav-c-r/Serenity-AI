import React, { useState } from 'react';
import './Journal.scss';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    const entry = {
      id: Date.now(),
      content: newEntry,
      date: new Date().toLocaleDateString(),
    };

    setEntries([entry, ...entries]);
    setNewEntry('');
  };

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
            <div className="entry-date">{entry.date}</div>
            <div className="entry-content">{entry.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal;
