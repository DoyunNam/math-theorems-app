// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9U2xoFDwiRnhhjJFJaNRXzzYFOBr089E",
  authDomain: "math-theorems-app.firebaseapp.com",
  projectId: "math-theorems-app",
  storageBucket: "math-theorems-app.firebasestorage.app",
  messagingSenderId: "630744923778",
  appId: "1:630744923778:web:bab880af49d4d711773e9b",
};

const app = initializeApp(firebaseConfig);

export default app;
export const auth = getAuth(app);
export const db = getFirestore(app);
