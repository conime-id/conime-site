import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_8X5llOpk-oi6HvaW8S77N4a9jOLnsMg",
  authDomain: "conime-firev3.firebaseapp.com",
  projectId: "conime-firev3",
  storageBucket: "conime-firev3.firebasestorage.app",
  messagingSenderId: "285137932762",
  appId: "1:285137932762:web:38173d178c57747a58f0e3",
  measurementId: "G-2FWP0ENSZD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
