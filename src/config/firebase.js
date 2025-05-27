// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCb8pS_m1Ahj0LfQz1iP64hKzfqjnwAZag",
  authDomain: "serenity-ai-d92bc.firebaseapp.com",
  projectId: "serenity-ai-d92bc",
  storageBucket: "serenity-ai-d92bc.firebasestorage.app",
  messagingSenderId: "966623220313",
  appId: "1:966623220313:web:12d7022677e64f7c269748",
  measurementId: "G-5R3SJP8G4L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleprovider = new GoogleAuthProvider(app);
export const database = getFirestore(app);
