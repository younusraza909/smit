// Initialize Cloud Firestore through Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAkJeAgVE15nOSrmNK0s75MCDICg2tDz1Q",
  authDomain: "smit-7c229.firebaseapp.com",
  projectId: "smit-7c229",
  storageBucket: "smit-7c229.appspot.com",
  messagingSenderId: "399741989524",
  appId: "1:399741989524:web:178789932cb4996942ba81",
  measurementId: "G-K900D2TXYC",
});

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();
export { db, auth, storage };
