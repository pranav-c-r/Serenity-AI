import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const Home = () => {
    const [username, setUsername]=useState('');
    const [email, setEmail]=useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;

            if (currentUser) {
            const userRef = doc(database, "Users", currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                setUsername(userData.username || 'No Username');
                setEmail(userData.email || 'No email found');
            } else {
                navigate("/signin");
            }
            } else {
            navigate("/");
            }
        };

        fetchUserData();
    }, [navigate]);
     const logout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
  return (
    <div>
      Home Page
      <h1>Welcome {username}</h1>
      <h2>Your gmail: {email}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Home
