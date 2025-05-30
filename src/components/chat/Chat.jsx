import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendMessageToGemini } from '../../services/geminiService';
import './Chat.scss';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../../config/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import Logo from '../common/Logo';

const Chat = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(window.speechSynthesis);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      text: `Hi ${username}! I'm Serena, your AI assistant. How can I help you today?`,
      sender: 'serena',
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
    speakText(welcomeMessage.text);
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
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
        setIsSpeaking(false);
      }
    };
  }, []);

  const speakText = (text) => {
    if (!text || !text.trim()) return;
    
    if (speechSynthesisRef.current) {
      try {
        const utterance = new window.SpeechSynthesisUtterance(text);
        
        // Get all voices and log them for debugging
        const availableVoices = window.speechSynthesis.getVoices();
        console.log('Available voices:', availableVoices.map(v => v.name));
        
        // Try to find a female voice with more specific criteria
        const femaleVoice = availableVoices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('victoria') ||
          voice.name.toLowerCase().includes('zira') ||
          voice.name.toLowerCase().includes('hazel') ||
          voice.name.toLowerCase().includes('google uk english female') ||
          voice.name.toLowerCase().includes('microsoft zira desktop') ||
          voice.name.toLowerCase().includes('microsoft hazel desktop') ||
          voice.name.toLowerCase().includes('google us english female') ||
          voice.name.toLowerCase().includes('microsoft david desktop') ||
          voice.name.toLowerCase().includes('microsoft mark desktop') ||
          voice.name.toLowerCase().includes('microsoft james desktop') ||
          voice.name.toLowerCase().includes('microsoft linda desktop') ||
          voice.name.toLowerCase().includes('microsoft heidi desktop') ||
          voice.name.toLowerCase().includes('microsoft haruka desktop') ||
          voice.name.toLowerCase().includes('microsoft heera desktop') ||
          voice.name.toLowerCase().includes('microsoft kalpana desktop') ||
          voice.name.toLowerCase().includes('microsoft hemant desktop') ||
          voice.name.toLowerCase().includes('microsoft ravi desktop') ||
          voice.name.toLowerCase().includes('microsoft sabina desktop') ||
          voice.name.toLowerCase().includes('microsoft hortense desktop') ||
          voice.name.toLowerCase().includes('microsoft hulda desktop') ||
          voice.name.toLowerCase().includes('microsoft hedda desktop') ||
          voice.name.toLowerCase().includes('microsoft helena desktop')
        );

        if (femaleVoice) {
          console.log('Selected female voice:', femaleVoice.name);
          utterance.voice = femaleVoice;
          utterance.pitch = 1.2;  // Higher pitch for more feminine sound
          utterance.rate = 0.9;   // Slightly slower rate for clarity
        } else {
          console.log('No female voice found, using default voice with feminine settings');
          // If no female voice is found, try to set a higher pitch to make it sound more feminine
          utterance.pitch = 1.2;
          utterance.rate = 0.9;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesisRef.current.speak(utterance);
      } catch (err) {
        console.error('Error speaking the response:', err);
        setIsSpeaking(false);
      }
    }
  };

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log('Available voices:', availableVoices.map(v => v.name));
    };

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

  const [username, setUsername]=useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile2 = async () => {
      try {
        const docRef = doc(database, "Users", auth.currentUser?.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const reference = docSnap.data();
          setUsername(reference.username);
          console.log(username+": username")
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/');
      }
    };

    fetchProfile2();
  }, []);
  const [mood, setMoods] = useState([]);
  const [moodText, setMoodText] = useState('');
  
  useEffect(() => {
    const fetchRecentMoods = async () => {
      const ref = doc(database, 'Users', auth.currentUser?.uid);
      const moodsRef = collection(ref, 'moods');
      const querySnapshot = await getDocs(moodsRef);
  
      const moodData = [];
      querySnapshot.forEach((doc) => {
        moodData.push(doc.data());
      });
  
      const latestMoods = moodData
        .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())
        .slice(0, 5);
  
      setMoods(latestMoods);
    };
  
    if (auth.currentUser) {
      fetchRecentMoods();
    }
  }, [auth.currentUser]);
  
  useEffect(() => {
    const formatMoodsAsPrompt = (moods) => {
      if (moods.length === 0) {
        return `The user did not upload any recent moods. Ask them kindly how they feel today, and remind them to update their mood in the app so you can support them better.`;
      }
      return `Here are the user's recent moods: ${moods.map(
        (m) => `${m.date}: ${m.mood.label}`
      ).join(', ')}.`;
    };
  
    setMoodText(formatMoodsAsPrompt(mood));
  }, [mood]);
  
   
  const SYSTEM_PROMPT = useMemo(() => {
  return `
    You are Serena, a warm, compassionate voice-based AI assistant. You listen carefully and respond like a supportive friend. Your tone is calm, soothing, and emotionally intelligent.

    Your goal is to comfort and uplift the user, whose name is ${username}. You don't need to mention their name often — only when it feels natural and personal.

    Never offer medical, psychological, or diagnostic advice. Instead, offer empathy, kindness, light humor (if appropriate), and gentle encouragement.

    Keep each response under 50 words. Prioritize clarity, warmth, and emotional connection.

    Use voice tone and word choice to match the user's mood:
    - If they sound anxious or tense, help them slow down and feel safe.
    - If they sound sad, gently cheer them up with a soft joke or kind words.
    - If they're happy, reflect that joy with friendly energy.

    Always make them feel heard, understood, and never alone.

    ${moodText}
  `;
}, [moodText, username]);

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
      const response = await sendMessageToGemini(text, messages, SYSTEM_PROMPT);
      const botMessage = {
        text: response,
        sender: 'serena',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
      speakText(response);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'serena',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      speakText(errorMessage.text);
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
            <img src="/circlelogo.png" alt="Serenity AI Logo" width={48} height={48} />
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