/// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyClXrfnqtglgCkR5xHQMqoDiDeQtQP0RKQ",
  authDomain: "ecommerce-567.firebaseapp.com",
  databaseURL: "https://ecommerce-567-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ecommerce-567",
  storageBucket: "ecommerce-567.appspot.com",
  messagingSenderId: "828492089391",
  appId: "1:828492089391:web:fb0206388d06ce1fbcdeda",
  measurementId: "G-MQ2PZGC53K"
};





// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Export for use throughout the app
export { app, auth, provider, db };