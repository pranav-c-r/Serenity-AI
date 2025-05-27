import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendMessageToGemini } from '../../services/geminiService';
import './Chat.scss';

const Chat = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([{
      text: "Hi there! I'm Serena, your AI assistant. How can I help you today?",
      sender: 'serena',
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    const initSpeechRecognition = () => {
      if ('webkitSpeechRecognition' in window) {
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true; // Keep listening
        recognitionRef.current.interimResults = true; // Get results as you speak
        recognitionRef.current.lang = 'en-US';

        let finalTranscript = '';

        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setIsRecording(true);
          setInputText('Listening...');
          finalTranscript = '';
        };

        recognitionRef.current.onresult = (event) => {
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          // Update input with both final and interim results
          setInputText(finalTranscript || interimTranscript || 'Listening...');
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          setInputText('');
          
          switch (event.error) {
            case 'not-allowed':
              alert('Please allow microphone access to use voice input.');
              break;
            case 'no-speech':
              alert('No speech was detected. Please try again.');
              break;
            case 'audio-capture':
              alert('No microphone was found. Please ensure your microphone is connected.');
              break;
            default:
              alert('An error occurred with speech recognition. Please try again.');
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsRecording(false);
          
          // If we have a final transcript, send it
          if (finalTranscript) {
            handleSubmit(finalTranscript);
          }
        };
      } else {
        console.warn('Speech recognition not supported');
      }
    };

    initSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Handle text input submission
  const handleSubmit = async (text = inputText) => {
    if (!text.trim() || text === 'Listening...') return;

    const userMessage = {
      text,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(text, messages);
      const botMessage = {
        text: response,
        sender: 'serena',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'serena',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key down for shift+enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome.');
      return;
    }

    try {
      if (isRecording) {
        console.log('Stopping speech recognition');
        recognitionRef.current.stop();
      } else {
        console.log('Starting speech recognition');
        setInputText('Listening...');
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error with speech recognition:', error);
      setIsRecording(false);
      setInputText('');
      alert('Error starting speech recognition. Please try again.');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="chat-avatar">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="#6C63FF"/>
              <path d="M30,40 Q50,20 70,40 Q80,50 70,60 Q50,80 30,60 Q20,50 30,40" fill="white"/>
              <circle cx="40" cy="45" r="5" fill="#333"/>
              <circle cx="60" cy="45" r="5" fill="#333"/>
              <path d="M40,65 Q50,75 60,65" stroke="#333" strokeWidth="3" fill="none"/>
            </svg>
          </div>
          <div className="chat-info">
            <h2>Serena</h2>
            <p className={isRecording ? 'recording-status' : ''}>
              {isRecording ? '🎤 Listening...' : 'AI Assistant'}
            </p>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.sender === 'serena' && !message.isLoading && (
              <div className="message-avatar">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" fill="#6C63FF"/>
                  <path d="M30,40 Q50,20 70,40 Q80,50 70,60 Q50,80 30,60 Q20,50 30,40" fill="white"/>
                </svg>
              </div>
            )}
            <div className="message-content">
              {message.isLoading ? (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                <>
                  <p>{message.text}</p>
                  <span className="message-timestamp">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </>
              )}
            </div>
            {message.sender === 'user' && (
              <div className="message-avatar user">
                {currentUser?.displayName?.charAt(0) || 'U'}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isRecording ? "Speak now..." : "Type your message..."}
            rows={1}
            disabled={isRecording}
          />
          <div className="input-actions">
            <button
              onClick={toggleVoiceInput}
              className={`voice-button ${isRecording ? 'recording' : ''}`}
              title={isRecording ? 'Stop recording' : 'Start voice input'}
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
            <button
              onClick={() => handleSubmit()}
              className="send-button"
              disabled={!inputText.trim() || isLoading || inputText === 'Listening...'}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                v  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>                                                                                                                                
    </div>
  );
};

export default Chat