import React from 'react';
import './Settings.scss';

const Settings = () => {
  return (
    <div className="container">
      <h1>Settings</h1>
      <div className="settings-section">
        <h2>Account Settings</h2>
        <div className="settings-item">
          <label>Email Notifications</label>
          <input type="checkbox" />
        </div>
        <div className="settings-item">
          <label>Dark Mode</label>
          <input type="checkbox" />
        </div>
      </div>

      <div className="settings-section">
        <h2>Privacy Settings</h2>
        <div className="settings-item">
          <label>Profile Visibility</label>
          <select>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="friends">Friends Only</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h2>App Preferences</h2>
        <div className="settings-item">
          <label>Language</label>
          <select>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Settings;
