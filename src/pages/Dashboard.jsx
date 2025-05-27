import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import './Dashboard.scss';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Journal',
      description: 'Express your thoughts and feelings in a private space',
      icon: '📝',
      path: '/journal'
    },
    {
      title: 'Mood Tracker',
      description: 'Track your emotional well-being over time',
      icon: '📊',
      path: '/mood-tracker'
    },
    {
      title: 'Chat',
      description: 'Have a text conversation with your AI companion',
      icon: '💬',
      path: '/chat'
    },
    {
      title: 'Comfort Zone',
      description: 'Voice-based conversation with your AI companion',
      icon: '🎤',
      path: '/comfort-zone'
    },
    {
      title: 'Resources',
      description: 'Access helpful mental health resources and tools',
      icon: '📚',
      path: '/resources'
    },
    {
      title: 'Settings',
      description: 'Customize your experience and manage your account',
      icon: '⚙️',
      path: '/settings'
    }
  ];

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

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard">
      <h1>Welcome back, {username}</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => handleCardClick('/mood-tracker')}>
          <div className="card-icon">📊</div>
          <h3>Mood Overview</h3>
          <p>Track your daily mood and emotional patterns</p>
        </div>
        <div className="dashboard-card" onClick={() => handleCardClick('/journal')}>
          <div className="card-icon">📝</div>
          <h3>Journal Entries</h3>
          <p>Your recent thoughts and reflections</p>
        </div>
        <div className="dashboard-card" onClick={() => handleCardClick('/chat')}>
          <div className="card-icon">💬</div>
          <h3>Chat with AI</h3>
          <p>Have a text conversation with your AI companion</p>
        </div>
        <div className="dashboard-card" onClick={() => handleCardClick('/comfort-zone')}>
          <div className="card-icon">🎤</div>
          <h3>Comfort Zone</h3>
          <p>Voice-based conversation with your AI companion</p>
        </div>
        <div className="dashboard-card" onClick={() => handleCardClick('/resources')}>
          <div className="card-icon">📚</div>
          <h3>Resources</h3>
          <p>Helpful tools and articles for mental wellbeing</p>
        </div>
        <div className="dashboard-card" onClick={() => handleCardClick('/settings')}>
          <div className="card-icon">⚙️</div>
          <h3>Settings</h3>
          <p>Customize your experience and manage your account</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
