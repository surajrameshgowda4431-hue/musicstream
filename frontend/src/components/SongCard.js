import React, { useState } from "react";
import "./SongCard.css";

const API_BASE = "https://musicstream-92cd.onrender.com";

const SongCard = ({ song }) => {
  const [showModal, setShowModal] = useState(false);
  const [playlists, setPlaylists] = useState(() => {
    return JSON.parse(localStorage.getItem("playlists")) || [];
  });

  const playSong = () => {
    window.dispatchEvent(new CustomEvent("playSong", { detail: song }));
  };

  const addToPlaylist = (playlistIndex) => {
    const updated = [...playlists];
    if (!updated[playlistIndex].songs.find(s => s.title === song.title)) {
      updated[playlistIndex].songs.push(song);
      setPlaylists(updated);
      localStorage.setItem("playlists", JSON.stringify(updated));
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="song-card">
        <img
          src={`${API_BASE}${song.cover}`}
          alt={song.title}
          className="song-cover"
        />
        <div className="song-info">
          <h4>{song.title}</h4>
        </div>
        <div className="song-actions">
          <button className="play-btn" onClick={playSong}>▶</button>
          <button className="add-btn" onClick={() => setShowModal(true)}>+</button>
        </div>
      </div>
      
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add to Playlist</h3>
            {playlists.length === 0 ? (
              <p>No playlists available. Create one first!</p>
            ) : (
              playlists.map((playlist, idx) => (
                <button key={idx} onClick={() => addToPlaylist(idx)}>
                  {playlist.name}
                </button>
              ))
            )}
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default SongCard;
