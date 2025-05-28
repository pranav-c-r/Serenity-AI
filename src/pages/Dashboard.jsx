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
      title: 'Guidebook',
      description: 'Explore mental health resources and guides',
      icon: '📚',
      path: '/guidebook'
    },
    {
      title: 'Mindful Breathing',
      description: 'Practice guided breathing exercises',
      icon: '🫁',
      path: '/mindful-breathing'
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
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="dashboard-card" 
            onClick={() => handleCardClick(feature.path)}
          >
            <div className="card-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
