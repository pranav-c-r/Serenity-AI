import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.scss';
import { useUser } from '../usercontext';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, database, googleprovider } from '../../config/firebase';
import { getDoc, setDoc, collection, doc } from 'firebase/firestore';
import Logo from '../common/Logo';

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
              navigate("/dashboard");
          }
      });
      return () => unsubscribe();
  }, [navigate]);

  const signInWithGoogle = async () => {
      if (!username) {
          alert("Please enter username");
          return;
      }
      try {
          await signInWithPopup(auth, googleprovider);
          addUser();
          navigate("/dashboard");
      } catch (error) {
          console.error("Error signing in with Google:", error.message);
          alert("Error signing in with Google. Please try again.");
      }
  };
  const [username, setusername] = useState("");

  const addUser = async () => {
      const userRef = collection(database, "Users");
      const userDocRef = doc(userRef, auth.currentUser.uid);

      try {
          const docSnap = await getDoc(userDocRef);
          if (!docSnap.exists()) {
              await setDoc(userDocRef, {
                  username: username,
                  email: auth.currentUser.email,
              });
          }
      } catch (err) {
          console.error("Error adding user:", err);
      }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Logo size={64} className="logo-icon" />
          </div>
          <h1>Join Serenity</h1>
          <p>Start your journey to better mental wellness</p>
        </div>
        <input
            type="text"
            placeholder='Enter your Username here'
            style={{
                width: '300px',
                padding: '10px',
                marginBottom: '20px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '16px'
            }}
            onChange={(e) => setusername(e.target.value)}
        />
        <button 
          onClick={signInWithGoogle} 
          className="google-button"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="google-icon"
          />
          Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;