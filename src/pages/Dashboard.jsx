import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import './Dashboard.scss';

const Dashboard = () => {
  const [username, setUsername]=useState('');
  const [email, setEmail]=useState('');
  const navigate = useNavigate();
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
  return (
    <div className="dashboard">
      <h1>Welcome back {username}</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Mood Overview</h3>
          <p>Track your daily mood and emotional patterns</p>
        </div>
        <div className="dashboard-card">
          <h3>Journal Entries</h3>
          <p>Your recent thoughts and reflections</p>
        </div>
        <div className="dashboard-card">
          <h3>Resources</h3>
          <p>Helpful tools and articles for mental wellbeing</p>
        </div>
        <div className="dashboard-card">
          <h3>AI Insights</h3>
          <p>Personalized recommendations based on your data</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
