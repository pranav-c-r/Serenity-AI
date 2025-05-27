import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendMessageToGemini } from '../../services/geminiService';
import './Chat.scss';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();

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

  // Handle text input submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Add a loading message
      const loadingMessage = {
        text: '',
        sender: 'serena',
        timestamp: new Date().toISOString(),
        isLoading: true
      };
      setMessages(prev => [...prev, loadingMessage]);

      // Send to Gemini
      const response = await sendMessageToGemini(inputText, messages);
      
      // Remove loading message and add actual response
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      const botMessage = {
        text: response,
        sender: 'serena',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      // Remove loading message and add error
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      const errorMessage = {
        text: "I'm sorry, I encountered an error. Please try again.",
        sender: 'serena',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice input
  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => prev + ' ' + transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access to use voice input.');
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // Handle key down for shift+enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
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
            <p>{isRecording ? 'Listening...' : 'AI Assistant'}</p>
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

      <form onSubmit={handleSubmit} className="chat-input">
        <div className="input-container">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            rows="1"
          />
          <div className="input-actions">
            <button
              type="button"
              className={`voice-button ${isRecording ? 'recording' : ''}`}
              onClick={handleVoiceInput}
              disabled={isLoading}
              aria-label="Voice input"
            >
              {isRecording ? (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                </svg>
              )}
            </button>
            <button 
              type="submit" 
              className="send-button"
              disabled={isLoading || !inputText.trim()}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Chat;