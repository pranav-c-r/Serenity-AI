import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendMessageToGemini } from '../services/geminiService';
import './ComfortZone.scss';
import { auth, database } from '../config/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
const ComfortZone = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const [username, setUsername]=useState('');
  const navigate = useNavigate();
  const [voices, setVoices] = useState([]);
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const docRef = doc(database, "Users", user.uid);
            const docSnap = await getDoc(docRef);
            const reference = docSnap.data();
            setUsername(reference.username);
            console.log(reference.username + ": username");
          } catch (error) {
            console.error('Error fetching profile:', error);
            navigate('/');
          }
        } else {
          console.log("No user is signed in.");
          navigate('/');
        }
      });

      return () => unsubscribe(); 
    }, []);

const [mood, setMoods] = useState([]);
const [moodText, setMoodText] = useState('');

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const ref = doc(database, 'Users', user.uid);
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
        } catch (error) {
          console.error('Error fetching moods:', error);
        }
      } else {
        console.log('No user is signed in.');
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const formatMoodsAsPrompt = (moods) => {
      if (moods.length === 0) {
        return `The user did not upload any recent moods. Ask them kindly how they feel today, and remind them to update their mood in the app so you can support them better.`;
      }
      return `Here are the user's recent moods: ${moods
        .map((m) => `${m.date}: ${m.mood.label}`)
        .join(', ')}.`;
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

  // Initial welcome message
  useEffect(() => {
    if(username){
      const welcomeMessage = {
        text: `Hi ${username}! I'm Serena, your voice companion. How are you feeling today?`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
      speakText(welcomeMessage.text);
    }
  }, [username]);

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

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

  const speakText = (text) => {
    if (!text || !text.trim()) {
      setError('Cannot speak an empty response.');
      return;
    }
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
          voice.name.toLowerCase().includes('microsoft hazel desktop')
        );

        if (femaleVoice) {
          console.log('Selected female voice:', femaleVoice.name);
          utterance.voice = femaleVoice;
          utterance.pitch = 1.2;  // Higher pitch for more feminine sound
          utterance.rate = 0.9;   // Slightly slower rate
        } else {
          console.log('No female voice found, using default voice');
          // If no female voice is found, try to set a higher pitch to make it sound more feminine
          utterance.pitch = 1.2;
          utterance.rate = 0.9;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event) => {
          if (event.error !== 'interrupted') {
            let message = 'An error occurred while speaking the response.';
            if (event.error === 'not-allowed') {
              message = 'Speech synthesis not allowed. Please check your browser settings.';
            } else if (event.error === 'audio-busy') {
              message = 'Audio device is busy. Please try again.';
            } else if (event.error === 'network') {
              message = 'Network error during speech synthesis.';
            }
            setError(message);
          }
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

      // Pass messages excluding the current one, to keep history, plus system prompt
      const response = await sendMessageToGemini(
        text,
        messages, // conversation history
        SYSTEM_PROMPT
      );

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
          {isRecording ? (
            <div className="recording-indicator">
              <div className="pulse-ring"></div>
              <span>Listening...</span>
            </div>
          ) : isSpeaking ? (
            <div className="speaking-indicator">
              <div className="wave-animation"></div>
              <span className="accent-text">Speaking...</span>
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