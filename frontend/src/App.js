import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Playlist from './pages/Playlist';
import Premium from './pages/Premium';
import CurrentPlaying from './components/CurrentPlaying';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <CurrentPlaying />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/premium" element={<Premium />} />
      </Routes>
    </Router>
  );
}

export default App;
