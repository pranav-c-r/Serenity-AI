import React, { useState, useRef, useEffect } from 'react';
import './CalmTunes.scss';

// Import audio files
import gentleRain from '../assets/music/gentlerain.mp3';
import forestStream from '../assets/music/foreststream.mp3';
import oceanWaves from '../assets/music/oceanwaves.mp3';
import mountainWind from '../assets/music/mountainwind.mp3';
import stormClouds from '../assets/music/stormclouds.mp3';
import transcendence from '../assets/music/transcendence.mp3';
import magicalMoments from '../assets/music/magicalmoments.mp3';
import echoesInBlue from '../assets/music/echoesinblue.mp3';
import space from '../assets/music/space.mp3';
import lullaby from '../assets/music/lullaby.mp3';
import dream from '../assets/music/dream.mp3';
import moonlight from '../assets/music/moonlight.mp3';
import purpleDream from '../assets/music/purpledream.mp3';
import daydreams from '../assets/music/daydreams.mp3';
import morningRoutine from '../assets/music/morningroutine.mp3';
import springFlowers from '../assets/music/springflowers.mp3';
import sunsetDrive from '../assets/music/sunsetdrive.mp3';
import colorfulFlowers from '../assets/music/colorfulflowers.mp3';

const CalmTunes = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const playlists = [
    {
      title: "Nature Sounds",
      tracks: [
        { name: "Gentle Rain", duration: "8:50", icon: "🌧️", src: gentleRain },
        { name: "Forest Stream", duration: "7:46", icon: "🌲", src: forestStream },
        { name: "Ocean Waves", duration: "5:33", icon: "🌊", src: oceanWaves },
        { name: "Mountain Wind", duration: "12:00", icon: "🏔️", src: mountainWind },
        { name: "Storm Clouds", duration: "6:40", icon: "⛈️", src: stormClouds }
      ]
    },
    {
      title: "Meditation Music",
      tracks: [
        { name: "Transcendence", duration: "31:00", icon: "✨", src: transcendence },
        { name: "Magical Moments", duration: "5:48", icon: "🎵", src: magicalMoments },
        { name: "Echoes in Blue", duration: "2:30", icon: "🎵", src: echoesInBlue },
        { name: "Space Journey", duration: "0:16", icon: "🚀", src: space }
      ]
    },
    {
      title: "Sleep Sounds",
      tracks: [
        { name: "Lullaby", duration: "01:03", icon: "🌙", src: lullaby },
        { name: "Dreamscape", duration: "00:42", icon: "✨", src: dream },
        { name: "Moonlight", duration: "9:42", icon: "🌕", src: moonlight },
        { name: "Purple Dream", duration: "5:06", icon: "💜", src: purpleDream }
      ]
    },
    {
      title: "Relaxing Melodies",
      tracks: [
        { name: "Daydreams", duration: "2:18", icon: "☁️", src: daydreams },
        { name: "Morning Routine", duration: "1:48", icon: "🌅", src: morningRoutine },
        { name: "Spring Flowers", duration: "3:18", icon: "🌸", src: springFlowers },
        { name: "Sunset Drive", duration: "9:06", icon: "🌇", src: sunsetDrive },
        { name: "Colorful Flowers", duration: "9:18", icon: "🌺", src: colorfulFlowers }
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

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.play();
    }
  }, [currentTrack]);

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

    
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)} 
        preload="auto"
      />
    </div>
  );
};

export default CalmTunes;
