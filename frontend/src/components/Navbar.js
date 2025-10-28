import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
      <Link to="/playlist" className={location.pathname === '/playlist' ? 'active' : ''}>Playlist</Link>
      <Link to="/upload" className={location.pathname === '/upload' ? 'active' : ''}>Upload</Link>
      <Link to="/premium" className={location.pathname === '/premium' ? 'active' : ''}>Premium</Link>
    </nav>
  );
};

export default Navbar;
