import React from 'react';
import './Dashboard.scss';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Welcome to Serenity AI</h1>
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
