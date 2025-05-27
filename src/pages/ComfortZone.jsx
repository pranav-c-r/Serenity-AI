import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendMessageToGemini } from '../services/geminiService';
import './ComfortZone.scss';

const ComfortZone = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(window.speechSynthesis);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      text: "Hi there! I'm your voice companion. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
    speakText(welcomeMessage.text);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    const initSpeechRecognition = () => {
      if ('webkitSpeechRecognition' in window) {
        try {
          recognitionRef.current = new window.webkitSpeechRecognition();
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.lang = 'en-US';

          recognitionRef.current.onstart = () => {
            setIsRecording(true);
            setError(null);
          };

          recognitionRef.current.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
              handleUserMessage(transcript);
            }
          };

          recognitionRef.current.onerror = (event) => {
            setIsRecording(false);
            let message = 'An error occurred with speech recognition. Please try again.';
            switch (event.error) {
              case 'not-allowed':
                message = 'Microphone access denied. Please allow microphone access in your browser settings.';
                break;
              case 'no-speech':
                message = 'No speech was detected. Please speak clearly into your microphone.';
                break;
              case 'audio-capture':
                message = 'No microphone was found. Please ensure your microphone is connected.';
                break;
              case 'aborted':
                message = 'Speech recognition was aborted. Please try again.';
                break;
              case 'network':
                message = 'Network error: Please check your internet connection and try again.';
                break;
              case 'service-not-allowed':
                message = 'Speech recognition service is not allowed. This may be restricted by your browser or device.';
                break;
              default:
                message = `Speech recognition error: ${event.error}. Please try again.`;
            }
            setError(message);
          };

          recognitionRef.current.onend = () => {
            setIsRecording(false);
          };
        } catch (err) {
          setError('Failed to initialize speech recognition. Please refresh the page and try again.');
        }
      } else {
        setError('Speech recognition is not supported in your browser. Please use Google Chrome.');
      }
    };

    initSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  const speakText = (text) => {
    if (!text || !text.trim()) {
      setError('Cannot speak an empty response.');
      return;
    }
    if (speechSynthesisRef.current) {
      try {
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event) => {
          let message = 'An error occurred while speaking the response.';
          if (event.error === 'not-allowed') {
            message = 'Speech synthesis not allowed. Please check your browser settings.';
          } else if (event.error === 'interrupted') {
            message = 'Speech synthesis was interrupted.';
          } else if (event.error === 'audio-busy') {
            message = 'Audio device is busy. Please try again.';
          } else if (event.error === 'network') {
            message = 'Network error during speech synthesis.';
          }
          setError(message);
          setIsSpeaking(false);
        };
        speechSynthesisRef.current.speak(utterance);
      } catch (err) {
        setError('Error speaking the response. Please try again.');
        setIsSpeaking(false);
      }
    }
  };

  const handleUserMessage = async (text) => {
    try {
      const userMessage = {
        text,
        sender: 'user',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);
      setError(null);

      const response = await sendMessageToGemini(text, messages);
      const botMessage = {
        text: response,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
      speakText(response);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      speakText(errorMessage.text);
      setError('Failed to get response. Please try again.');
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not available. Please refresh the page.');
      return;
    }

    try {
      if (isRecording) {
        recognitionRef.current.stop();
      } else {
        setError(null);
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error with speech recognition:', error);
      setIsRecording(false);
      setError('Error starting speech recognition. Please try again.');
    }
  };

  return (
    <div className="comfort-zone">
      <div className="comfort-zone-header">
        <h1>Comfort Zone</h1>
        <p>Your safe space for voice conversation</p>
      </div>

      <div className="voice-interface">
        <div className="voice-status">
          {error ? (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          ) : isRecording ? (
            <div className="recording-indicator">
              <div className="pulse-ring"></div>
              <span>Listening...</span>
            </div>
          ) : isSpeaking ? (
            <div className="speaking-indicator">
              <div className="wave-animation"></div>
              <span>Speaking...</span>
            </div>
          ) : (
            <span>Click the microphone to start speaking</span>
          )}
        </div>

        <button
          onClick={toggleVoiceInput}
          className={`voice-button ${isRecording ? 'recording' : ''}`}
          title={isRecording ? 'Stop recording' : 'Start voice input'}
          disabled={isSpeaking}
        >
          {isRecording ? (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14C13.6569 14 15 12.6569 15 11V5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5V11C9 12.6569 10.3431 14 12 14Z" fill="currentColor"/>
              <path d="M19 11C19 14.866 15.866 18 12 18C8.13401 18 5 14.866 5 11M12 22V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>

      <div className="conversation-history">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ComfortZone; 