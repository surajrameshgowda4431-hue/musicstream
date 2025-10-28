import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('https://musicstream-92cd.onrender.com/api/songs');
        setSongs(response.data.map(song => ({
          ...song,
          cover: `https://musicstream-92cd.onrender.com${song.cover}`,
url: `https://musicstream-92cd.onrender.com${song.url}`

        })));
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };
    fetchSongs();
  }, []);

  const handlePlay = (song) => {
    const event = new CustomEvent("playSong", { detail: song });
    window.dispatchEvent(event);
  };

  return (
    <div className="home">
      <h2>Recommended Songs</h2>
      <div className="song-grid">
        {songs.map((song, idx) => (
          <div key={idx} className="song-card" onClick={() => handlePlay(song)}>
            <img src={song.cover} alt={song.title} className="song-cover" />
            <p className="song-title">{song.title}</p>
            <p className="song-artist">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;