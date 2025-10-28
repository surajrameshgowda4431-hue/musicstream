import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./CurrentPlaying.css";

const CurrentPlaying = () => {
  const audioRef = useRef(new Audio());
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/songs');
        setSongs(response.data.map(song => ({
          ...song,
          cover: `http://localhost:5000${song.cover}`,
          url: `http://localhost:5000${song.url}`
        })));
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    const playHandler = (e) => {
      const song = e.detail;
      setCurrentSong(song);
      const index = songs.findIndex((s) => s.url === song.url);
      setCurrentIndex(index);
      audioRef.current.src = song.url;
      audioRef.current.play();
      setIsPlaying(true);
    };
    window.addEventListener("playSong", playHandler);
    return () => window.removeEventListener("playSong", playHandler);
  }, [songs]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && currentSong) {
        const current = audioRef.current.currentTime;
        const dur = audioRef.current.duration || 0;
        setProgress((current / dur) * 100 || 0);

        const formatTime = (time) => {
          const minutes = Math.floor(time / 60);
          const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
          return `${minutes}:${seconds}`;
        };

        setCurrentTime(formatTime(current));
        setDuration(formatTime(dur));
      }
    }, 500);
    return () => clearInterval(interval);
  }, [currentSong]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!currentSong || !audioRef.current) return;
      
      if (e.key === 'ArrowRight') {
        audioRef.current.currentTime = Math.min(
          audioRef.current.currentTime + 10,
          audioRef.current.duration
        );
      } else if (e.key === 'ArrowLeft') {
        audioRef.current.currentTime = Math.max(
          audioRef.current.currentTime - 10,
          0
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSong]);

  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const skipForward = () => {
    if (currentIndex < 0 || songs.length === 0) return;
    const nextIndex = (currentIndex + 1) % songs.length;
    const nextSong = songs[nextIndex];
    setCurrentSong(nextSong);
    setCurrentIndex(nextIndex);
    audioRef.current.src = nextSong.url;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const skipBackward = () => {
    if (currentIndex < 0 || songs.length === 0) return;
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    const prevSong = songs[prevIndex];
    setCurrentSong(prevSong);
    setCurrentIndex(prevIndex);
    audioRef.current.src = prevSong.url;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleProgressClick = (e) => {
    if (!currentSong) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  return (
    <div className="current-playing">
      {currentSong ? (
        <>
          <img src={currentSong.cover} alt={currentSong.title} className="current-cover" />
          <div className="current-info">
            <p className="current-title">{currentSong.title}</p>
            <p className="current-artist">{currentSong.artist}</p>
            <div className="progress-container">
              <span className="time">{currentTime}</span>
              <div className="progress-bar" onClick={handleProgressClick}>
                <div className="progress" style={{ width: `${progress}%` }}></div>
              </div>
              <span className="time">{duration}</span>
            </div>
          </div>
          <div className="controls">
            <button className="skip-btn" onClick={skipBackward}>⏮</button>
            <div className="play-btn" onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</div>
            <button className="skip-btn" onClick={skipForward}>⏭</button>
          </div>
        </>
      ) : (
        <p className="no-song">No song playing</p>
      )}
    </div>
  );
};

export default CurrentPlaying;