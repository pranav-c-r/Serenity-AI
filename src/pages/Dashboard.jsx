import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './Dashboard.scss';
// Removed: import { useAuth } from '../context/AuthContext'; 
// (currentUser from useAuth wasn't being used in fetchUserData, auth.currentUser was)
// If you intend to use currentUser from context, you can re-add it and adjust fetchUserData.

const Dashboard = () => {
  const [username, setUsername] = useState('');
  // const [email, setEmail] = useState(''); // email was fetched but not used
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState(null);
  const navigate = useNavigate();

  const features = [
    { title: 'Journal', description: 'Express your thoughts and feelings in a private space', icon: '📝', path: '/journal' },
    { title: 'Mood Tracker', description: 'Track your emotional well-being over time', icon: '📊', path: '/mood-tracker' },
    { title: 'Guidebook', description: 'Explore mental health resources and guides', icon: '📚', path: '/guidebook' },
    { title: 'Mindful Breathing', description: 'Practice guided breathing exercises', icon: '🫁', path: '/mindful-breathing' },
    { title: 'Chat', description: 'Have a text conversation with your AI companion', icon: '💬', path: '/chat' },
    { title: 'Comfort Zone', description: 'Voice-based conversation with your AI companion', icon: '🎤', path: '/comfort-zone' },
    { title: 'Resources', description: 'Access helpful mental health resources and tools', icon: '📚', path: '/resources' },
    { title: 'Games & Challenges', description: 'Engage in fun activities to boost your mental well-being', icon: '🎮', path: '/games' },
    { title: 'Calm Tunes', description: 'Relax and unwind with soothing sounds and music', icon: '🎵', path: '/calm-tunes' }
  ];

  useEffect(() => {
    const fetchMotivationalQuote = async () => {
      setQuoteLoading(true);
      setQuoteError(null);
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        console.error("Gemini API key (VITE_GEMINI_API_KEY) not found in .env file.");
        setQuoteError("Could not fetch a quote at this moment.");
        setMotivationalQuote("Embrace the journey, trust the process."); // Fallback quote
        setQuoteLoading(false);
        return;
      }

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // As per your request, using "gemini-2.0-flash". 
        // If this model ID is not found, you might need to use "gemini-1.5-flash-latest" or another valid model ID.
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); 
        const prompt = `
You are a highly creative and insightful quote generator. Your goal is to produce *original* motivational quotes that can uplift, inspire, and provoke thoughtful reflection across a wide range of themes. Each quote should be succinct, emotionally resonant, and meaningful.

You must randomly choose from a variety of motivational quote categories, but you should NOT mention the category in the response. Just return the quote.

Categories to Randomly Choose From (internal only, do NOT include in response):
1. Feel-Good – Evoke warmth, comfort, happiness, and positive emotions.
2. Inspirational – Ignite ambition, drive, courage, and hope.
3. Factual Motivation – Use scientific, historical, or realistic facts to motivate.
4. Truth-Based – Reflect liberating or harsh truths of life.
5. Life Lessons – Offer wisdom from experience, growth, or adversity.
6. Nature-Inspired – Use metaphors or lessons from nature.
7. Resilience & Grit – Emphasize strength in adversity and persistence.
8. Success & Growth – Focus on achievement, discipline, and progress.
9. Mindfulness & Presence – Promote peace, presence, and self-awareness.
10. Faith & Spiritual – Rooted in spiritual or philosophical reflection (non-denominational).
11. Creativity & Innovation – Spark curiosity and originality.
12. Change & Transformation – Encourage embracing change and growth.
13. Leadership & Influence – Inspire ethical and confident leadership.
14. Courage & Risk – Highlight the value of bold action.
15. Kindness & Compassion – Empower with empathy and kindness.

Quote Requirements:
- Each quote must be under 280 characters.
- Do NOT include the category in the response.
- Do NOT attribute the quote to any real or fictional individual.
- Avoid clichés and overused phrases.
- Keep tone motivational, encouraging, or thought-provoking.
- The quote must stand alone in meaning.
- Avoid political or religious preaching.
- Ensure variety in theme and structure across responses.

Example (only the quote is shown, no category):
"Even the tallest trees start as tiny seeds. Grow patiently—your roots matter more than your speed."

"Not every day will feel good, but every step forward still counts."

"When logic sleeps, creativity awakens. Doodle outside the lines."

"The lesson isn't in the fall—it's in how you get up, dust off, and climb again."

"Breathe. This moment is not a means to an end—it *is* the point."

Only return the quote text. No category, no metadata, no author.
`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Extract only the quote part (first non-empty line, ignoring any intro or category info)
        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
        let quoteLine = lines[0];
        // If the first line looks like a label (e.g., 'Category: ...'), use the next line
        if (/^category\s*:/i.test(quoteLine) && lines.length > 1) {
          quoteLine = lines[1];
        }
        // Clean up the quote (remove leading/trailing quotes and asterisks if any)
        quoteLine = quoteLine.replace(/^['"“"']+|['"""']+$/g, '').replace(/^\*+|\*+$/g, '').trim();
        setMotivationalQuote(quoteLine);
      } catch (err) {
        console.error("Error fetching motivational quote from Gemini:", err);
        // Check for specific API errors if needed (e.g., model not found)
        if (err.message && err.message.includes("not found") && err.message.includes("gemini-2.0-flash")) {
            setQuoteError("The specified AI model (gemini-2.0-flash) might not be available. Please check your model ID or try 'gemini-1.5-flash-latest'.");
        } else {
            setQuoteError("Couldn't fetch an inspiring quote right now.");
        }
        setMotivationalQuote("The best way to predict the future is to create it."); // Fallback quote
      } finally {
        setQuoteLoading(false);
      }
    };

    fetchMotivationalQuote();
  }, []); // Empty dependency array: runs once on mount

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUserAuth = auth.currentUser; // Using auth.currentUser directly as in original code

      if (currentUserAuth) {
        const userRef = doc(database, "Users", currentUserAuth.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUsername(userData.username || 'User');
          // setEmail(userData.email || 'No email found'); // email not used in UI
        } else {
          console.log("User document not found, redirecting to signin.");
          navigate("/signin");
        }
      } else {
        console.log("No current user, redirecting to home.");
        navigate("/");
      }
    };

    fetchUserData();
  }, [navigate]);

  const logout = async () => { // This function is defined but not used in the provided JSX
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        {quoteLoading && (
          <p className="motivational-quote-status">Loading a bit of inspiration...</p>
        )}
        {quoteError && !quoteLoading && (
          <p className="motivational-quote-status error">{quoteError}</p>
        )}
        {!quoteLoading && !quoteError && motivationalQuote && (
          <div className="prophecy-quote-card">
            <div className="prophecy-title">Today's Prophecy</div>
            <blockquote className="prophecy-quote">{motivationalQuote}</blockquote>
          </div>
        )}
        <h1>Welcome back, {username}</h1>
      </div>
      
      <div className="dashboard-grid">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="dashboard-card" 
            onClick={() => handleCardClick(feature.path)}
          >
            <div className="card-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
      {/* Example Button for Logout if you want to add it somewhere */}
      {/* <button onClick={logout} className="logout-button">Logout</button> */}
    </div>
  );
};

export default Dashboard;