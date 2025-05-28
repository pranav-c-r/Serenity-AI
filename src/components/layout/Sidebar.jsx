import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.scss';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      path: '/dashboard',
      icon: 'fas fa-home',
      label: 'Dashboard'
    },
    {
      path: '/mood-tracker',
      icon: 'fas fa-chart-line',
      label: 'Mood Tracker'
    },
    {
      path: '/guidebook',
      icon: 'fas fa-book',
      label: 'Guidebook'
    },
    {
      path: '/mindful-breathing',
      icon: 'fas fa-wind',
      label: 'Mindful Breathing'
    },
    {
      path: '/resources',
      icon: 'fas fa-hands-helping',
      label: 'Resources'
    },
    {
      path: '/comfort-zone',
      icon: 'fas fa-comments',
      label: 'Talk to Serena'
    }
  ];

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link 
                to={item.path} 
                className={isActive(item.path) ? 'active' : ''}
              >
                <i className={item.icon}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
