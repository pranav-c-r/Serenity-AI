import React, { useState, useEffect } from 'react'
import { auth, database } from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Layout.scss';

const Layout = () => {
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userRef = doc(database, "Users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUsername(userData.username || 'No Username');
          setEmail(userData.email || 'No email found');
        } else {
          navigate("/signin");
        }
      } else {
        navigate("/");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`layout ${isDarkMode ? 'dark' : 'light'}`}>
      <nav className="sidebar">
        <div className="logo accent-text">Serenity AI</div>
        <ul className="nav-links">
          <li><Link to="/dashboard" className={isActive('/dashboard') ? 'active accent-text' : ''}>Dashboard</Link></li>
          <li><Link to="/journal" className={isActive('/journal') ? 'active accent-text' : ''}>Journal</Link></li>
          <li><Link to="/mood-tracker" className={isActive('/mood-tracker') ? 'active accent-text' : ''}>Mood Tracker</Link></li>
          <li><Link to="/mindful-breathing" className={isActive('/mindful-breathing') ? 'active accent-text' : ''}>Mindful Breathing</Link></li>
          <li><Link to="/resources" className={isActive('/resources') ? 'active accent-text' : ''}>Resources</Link></li>
          <li><Link to="/guidebook" className={isActive('/guidebook') ? 'active accent-text' : ''}>Guidebook</Link></li>
          <li><Link to="/comfort-zone" className={isActive('/comfort-zone') ? 'active accent-text' : ''}>Talk to Serena</Link></li>
          <li><Link to="/chat" className={isActive('/chat') ? 'active accent-text' : ''}>Chat with Serena</Link></li>
          <li><Link to="/games" className={isActive('/games') ? 'active accent-text' : ''}>Games & Challenges</Link></li>
          <li><Link to="/calm-tunes" className={isActive('/calm-tunes') ? 'active accent-text' : ''}>Calm Tunes</Link></li>
          <li><Link to="/mind-canvas" className={isActive('/mind-canvas') ? 'active accent-text' : ''}>Mind Canvas</Link></li>
        </ul>
        <div className="nav-footer">
          <button onClick={toggleTheme} className="theme-toggle">
            <span className={`toggle-label light ${!isDarkMode ? 'active' : ''}`}>Light</span>
            <span className={`toggle-label dark ${isDarkMode ? 'active' : ''}`}>Dark</span>
            <div className="toggle-slider"></div>
          </button>
          <div className="user-info">
            <span className="username">{username}</span>
            <span className="email">{email}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 