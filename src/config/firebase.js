import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "serenity-ai-d92bc.firebaseapp.com",
  projectId: "serenity-ai-d92bc",
  storageBucket: "serenity-ai-d92bc.firebasestorage.app",
  messagingSenderId: "966623220313",
  appId: "1:966623220313:web:12d7022677e64f7c269748",
  measurementId: "G-5R3SJP8G4L"
};
  
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleprovider = new GoogleAuthProvider(app);
export const database = getFirestore(app);
