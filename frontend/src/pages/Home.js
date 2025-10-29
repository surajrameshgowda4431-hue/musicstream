import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

const staticSongs = [
  { title: "Danza Kuduro", artist: "Don Omar", cover: "/assets/cover1.jpg", url: "/assets/song1.mp3" },
  { title: "Despacito", artist: "Luis Fonsi", cover: "/assets/cover2.jpg", url: "/assets/song2.mp3" },
  { title: "Fly Away", artist: "Lenny Kravitz", cover: "/assets/cover3.jpg", url: "/assets/song3.mp3" },
  { title: "Gasolina", artist: "Daddy Yankee", cover: "/assets/cover4.jpg", url: "/assets/song4.mp3" },
  { title: "Grateful", artist: "DJ Khaled", cover: "/assets/cover5.jpg", url: "/assets/song5.mp3" },
  { title: "I Can Feel It", artist: "DJ Snake", cover: "/assets/cover6.jpg", url: "/assets/song6.mp3" },
  { title: "Perfect", artist: "Ed Sheeran", cover: "/assets/cover7.jpg", url: "/assets/song7.mp3" },
  { title: "Shape Of You", artist: "Ed Sheeran", cover: "/assets/cover8.jpg", url: "/assets/song8.mp3" }
];

const Home = () => {
  const [songs, setSongs] = useState(staticSongs);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('https://musicstream-92cd.onrender.com/api/songs');
        setSongs(response.data.map(song => ({
          ...song,
          cover: `http://localhost:5000${song.cover}`,
          url: `http://localhost:5000${song.url}`
        })));
      } catch (error) {
        console.error('Backend not available, using static songs:', error);
        setSongs(staticSongs);
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