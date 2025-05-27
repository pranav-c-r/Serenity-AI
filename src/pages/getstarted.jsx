import { auth, database, googleprovider } from '../config/firebase';
import { useState, useEffect } from "react";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import googlepic from '../assets/Googlepic.png';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { useUser } from '../components/usercontext';

const GetStarted = () => {
    const navigate = useNavigate();
    const { setUserDetails } = useUser();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/home");
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
            setUserDetails({ username, selectedOption });
            navigate("/home");
        } catch (error) {
            console.error("Error signing in with Google:", error.message);
            alert("Error signing in with Google. Please try again.");
        }
    };

    const [selectedOption, setselectedOption] = useState('');
    const handleoption = (event) => {
        setselectedOption(event.target.value)
    }
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', fontFamily: 'sans-serif' }}>
            <h1>Welcome to Serenity-AI</h1>
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
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '300px',
                marginTop: '40px'
            }}>
                <button
                    onClick={signInWithGoogle}
                    style={{
                        backgroundColor: 'black',
                        color: 'white',
                        padding: '10px 20px',
                        width: '100%',
                        borderRadius: '999px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <img src={googlepic} alt="Google" style={{ width: '24px', height: '24px' }} />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default GetStarted;
