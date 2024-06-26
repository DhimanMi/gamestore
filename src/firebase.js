// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged for auth state handling
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7wFCrHQ-tzPASwApuHWX8iyzcprhnwKI",
  authDomain: "greensteam-376a2.firebaseapp.com",
  projectId: "greensteam-376a2",
  storageBucket: "greensteam-376a2.appspot.com",
  messagingSenderId: "768453020346",
  appId: "1:768453020346:web:f943f5a00c581a17f35083",
  measurementId: "G-E3R7JDVWD9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase modules for use in other parts of the application
export { app, auth, db, onAuthStateChanged };
