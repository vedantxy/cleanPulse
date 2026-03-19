import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBgoSa0jf8Q0ZLwEvRuaiHfazWuppFKLiI",
  authDomain: "cleanpulse-d9c42.firebaseapp.com",
  projectId: "cleanpulse-d9c42",
  storageBucket: "cleanpulse-d9c42.firebasestorage.app",
  messagingSenderId: "974437827579",
  appId: "1:974437827579:web:ad1417c16cf4bf9ebe415e",
  measurementId: "G-BMJMGR70ZZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
