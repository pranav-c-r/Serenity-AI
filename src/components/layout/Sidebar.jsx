import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
              <i className="fas fa-home"></i>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/mood-tracker" className={isActive('/mood-tracker') ? 'active' : ''}>
              <i className="fas fa-chart-line"></i>
              Mood Tracker
            </Link>
          </li>
          <li>
            <Link to="/guidebook" className={isActive('/guidebook') ? 'active' : ''}>
              <i className="fas fa-book"></i>
              Guidebook
            </Link>
          </li>
          <li>
            <Link to="/mindful-breathing" className={isActive('/mindful-breathing') ? 'active' : ''}>
              <i className="fas fa-wind"></i>
              Mindful Breathing
            </Link>
          </li>
          <li>
            <Link to="/resources" className={isActive('/resources') ? 'active' : ''}>
              <i className="fas fa-hands-helping"></i>
              Resources
            </Link>
          </li>
          <li>
            <Link to="/comfort-zone" className={isActive('/comfort-zone') ? 'active' : ''}>
              <i className="fas fa-comments"></i>
              Talk to Serena
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
