import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/layout/Layout';

// Auth Pages
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';

// Feature Pages
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import MoodTracker from './pages/MoodTracker';
import Resources from './pages/Resources';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Landing from './pages/Landing';
import Chat from './components/chat/Chat';
import ComfortZone from './pages/ComfortZone';

// Global Styles
import './main.scss';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes with Layout */}
            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/mood-tracker" element={<MoodTracker />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/comfort-zone" element={<ComfortZone />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
