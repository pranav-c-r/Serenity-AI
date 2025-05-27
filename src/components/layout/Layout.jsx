import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Layout.scss';

const Layout = () => {
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`layout ${isDarkMode ? 'dark' : 'light'}`}>
      <nav className="sidebar">
        <div className="logo">Serenity AI</div>
        <ul className="nav-links">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/journal">Journal</Link></li>
          <li><Link to="/mood-tracker">Mood Tracker</Link></li>
          <li><Link to="/resources">Resources</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
        <div className="nav-footer">
          <button onClick={toggleTheme} className="theme-toggle">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
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