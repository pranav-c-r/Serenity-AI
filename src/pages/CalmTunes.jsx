import React, { useState, useRef, useEffect } from 'react';
import './CalmTunes.scss';
const CalmTunes = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const playlists = [
    {
      title: "Nature Sounds",
      tracks: [
        { name: "Gentle Rain", duration: "8:50", icon: "🌧️", src: 'src/assets/music/gentlerain.mp3' },
        { name: "Forest Stream", duration: "7:46", icon: "🌲", src: "src/assets/music/foreststream.mp3" },
        { name: "Ocean Waves", duration: "5:33", icon: "🌊", src: "src/assets/music/oceanwaves.mp3" },
        { name: "Mountain Wind", duration: "12:00", icon: "🏔️", src: "src/assets/music/mountainwind.mp3" },
        { name: "Storm Clouds", duration: "6:40", icon: "⛈️", src: "src/assets/music/stormclouds.mp3" }
      ]
    },
    {
      title: "Meditation Music",
      tracks: [
        { name: "Transcendence", duration: "31:00", icon: "✨", src: "src/assets/music/transcendence.mp3" },
        { name: "Magical Moments", duration: "5:48", icon: "🎵", src: "src/assets/music/magicalmoments.mp3" },
        { name: "Echoes in Blue", duration: "2:30", icon: "🎵", src: "src/assets/music/echoesinblue.mp3" },
        { name: "Space Journey", duration: "0:16", icon: "🚀", src: "src/assets/music/space.mp3" }
      ]
    },
    {
      title: "Sleep Sounds",
      tracks: [
        { name: "Lullaby", duration: "01:03", icon: "🌙", src: "src/assets/music/lullaby.mp3" },
        { name: "Dreamscape", duration: "00:42", icon: "✨", src: "src/assets/music/dream.mp3" },
        { name: "Moonlight", duration: "9:42", icon: "🌕", src: "src/assets/music/moonlight.mp3" },
        { name: "Purple Dream", duration: "5:06", icon: "💜", src: "src/assets/music/purpledream.mp3" }
      ]
    },
    {
      title: "Relaxing Melodies",
      tracks: [
        { name: "Daydreams", duration: "2:18", icon: "☁️", src: "src/assets/music/daydreams.mp3" },
        { name: "Morning Routine", duration: "1:48", icon: "🌅", src: "src/assets/music/morningroutine.mp3" },
        { name: "Spring Flowers", duration: "3:18", icon: "🌸", src: "src/assets/music/springflowers.mp3" },
        { name: "Sunset Drive", duration: "9:06", icon: "🌇", src: "src/assets/music/sunsetdrive.mp3" },
        { name: "Colorful Flowers", duration: "9:18", icon: "🌺", src: "src/assets/music/colorfulflowers.mp3" }
      ]
    }
  ];

  const handlePlay = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Play new track when selected
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.play();
    }
  }, [currentTrack]);

  // Pause/play based on state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

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
              <button className="control-button" onClick={handleStop}>
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

      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)} 
        preload="auto"
      />
    </div>
  );
};

export default CalmTunes;
