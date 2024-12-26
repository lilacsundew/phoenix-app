// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDz1F3rNC3uADkwixmWfjO1YqfFAHUPBNY",
  authDomain: "phoenix-app-1553e.firebaseapp.com",
  projectId: "phoenix-app-1553e",
  storageBucket: "phoenix-app-1553e.firebasestorage.app",
  messagingSenderId: "1038982346619",
  appId: "1:1038982346619:web:51ee35441df07b9b792fde",
  measurementId: "G-XP0ZNTKSPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);