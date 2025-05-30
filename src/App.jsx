import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/layout/Layout';
import { Analytics } from "@vercel/analytics/react";


import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';


import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import MoodTracker from './pages/MoodTracker';
import Resources from './pages/Resources';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Landing from './pages/Landing';
import Chat from './components/chat/Chat';
import ComfortZone from './pages/ComfortZone';
import Guidebook from './pages/Guidebook';
import MindfulBreathing from './pages/MindfulBreathing';
import GamesAndChallenges from './pages/GamesAndChallenges';
import CalmTunes from './pages/CalmTunes';

import CardApp from './pages/cardApp';
import WordPuzzleApp from './pages/WordPuzzleApp';
import FocusChallenge from './pages/FocusChallenge';
import CreativeExpression from './pages/CreativeExpression';
import MindfulListening from './pages/MindfulListening';
import MeditationTimer from './pages/MeditationTimer';
import EmotionRecognition from './pages/EmotionRecognition';
import AffirmationBuilder from './pages/AffirmationBuilder';

import './main.scss';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/mood-tracker" element={<MoodTracker />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/guidebook" element={<Guidebook />} />
              <Route path="/mindful-breathing" element={<MindfulBreathing />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/comfort-zone" element={<ComfortZone />} />
              <Route path="/games" element={<GamesAndChallenges />} />
              <Route path="/calm-tunes" element={<CalmTunes />} />
              
              
              <Route path="/cardApp" element={<CardApp />} />
              <Route path="/wordPuzzle" element={<WordPuzzleApp />} />
              <Route path="/focusChallenge" element={<FocusChallenge />} />
              <Route path="/creativeExpression" element={<CreativeExpression />} />
              <Route path="/mindfulListening" element={<MindfulListening />} />
              <Route path="/meditationTimer" element={<MeditationTimer />} />
              <Route path="/emotionRecognition" element={<EmotionRecognition />} />
              <Route path="/affirmationBuilder" element={<AffirmationBuilder />} />
            </Route>

              
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Analytics />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
