import React, { useState } from 'react';
import './CalmTunes.scss';

const CalmTunes = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playlists = [
    {
      title: "Nature Sounds",
      tracks: [
        { name: "Gentle Rain", duration: "10:00", icon: "🌧️" },
        { name: "Forest Stream", duration: "15:00", icon: "🌲" },
        { name: "Ocean Waves", duration: "20:00", icon: "🌊" },
        { name: "Mountain Wind", duration: "12:00", icon: "🏔️" }
      ]
    },
    {
      title: "Meditation Music",
      tracks: [
        { name: "Zen Garden", duration: "30:00", icon: "🎵" },
        { name: "Mindful Journey", duration: "45:00", icon: "🎵" },
        { name: "Inner Peace", duration: "20:00", icon: "🎵" },
        { name: "Tranquil Space", duration: "25:00", icon: "🎵" }
      ]
    },
    {
      title: "Sleep Sounds",
      tracks: [
        { name: "Lullaby", duration: "40:00", icon: "🌙" },
        { name: "Night Forest", duration: "60:00", icon: "🌲" },
        { name: "White Noise", duration: "30:00", icon: "⚪" },
        { name: "Dreamscape", duration: "45:00", icon: "✨" }
      ]
    }
  ];

  const handlePlay = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <div className="calm-tunes">
      <div className="page-header">
        <h1>Calm Tunes</h1>
        <p>Relax and unwind with soothing sounds and music</p>
      </div>

      {currentTrack && (
        <div className="now-playing">
          <div className="player-card">
            <div className="track-info">
              <span className="track-icon">{currentTrack.icon}</span>
              <div className="track-details">
                <h3>{currentTrack.name}</h3>
                <p>{currentTrack.duration}</p>
              </div>
            </div>
            <div className="player-controls">
              <button className="control-button" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button className="control-button" onClick={() => setCurrentTrack(null)}>
                ⏹️
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="playlists-container">
        {playlists.map((playlist, index) => (
          <div key={index} className="playlist-section">
            <h2>{playlist.title}</h2>
            <div className="tracks-list">
              {playlist.tracks.map((track, trackIndex) => (
                <div 
                  key={trackIndex} 
                  className="track-item"
                  onClick={() => handlePlay(track)}
                >
                  <span className="track-icon">{track.icon}</span>
                  <div className="track-info">
                    <h4>{track.name}</h4>
                    <p>{track.duration}</p>
                  </div>
                  <button className="play-button">▶️</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalmTunes; 