// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkppkZjGZ1i9Qxm4VhSDe2dfZSHCXiF78",
  authDomain: "fifa-world-cup-2026-7d608.firebaseapp.com",
  projectId: "fifa-world-cup-2026-7d608",
  storageBucket: "fifa-world-cup-2026-7d608.firebasestorage.app",
  messagingSenderId: "436135896460",
  appId: "1:436135896460:web:7a6252bcc05f059e0622a9",
  measurementId: "G-NT54N12T5L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
