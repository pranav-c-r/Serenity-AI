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
        <div className="logo">Serenity AI</div>
        <ul className="nav-links">
          <li><Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link></li>
          <li><Link to="/journal" className={isActive('/journal') ? 'active' : ''}>Journal</Link></li>
          <li><Link to="/mood-tracker" className={isActive('/mood-tracker') ? 'active' : ''}>Mood Tracker</Link></li>
          <li><Link to="/resources" className={isActive('/resources') ? 'active' : ''}>Resources</Link></li>
          <li><Link to="/comfort-zone" className={isActive('/comfort-zone') ? 'active' : ''}>Talk to Serena</Link></li>
          <li><Link to="/chat" className={isActive('/chat') ? 'active' : ''}>Chat with Serena</Link></li>
          <li><Link to="/settings" className={isActive('/settings') ? 'active' : ''}>Settings</Link></li>
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