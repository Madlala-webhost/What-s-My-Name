// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjl2YEl595ChjJ6jgFhBt0_W7uhD-sXUE",
  authDomain: "what-s-my-name-1577b.firebaseapp.com",
  projectId: "what-s-my-name-1577b",
  storageBucket: "what-s-my-name-1577b.firebasestorage.app",
  messagingSenderId: "62469251354",
  appId: "1:62469251354:web:8df6debe2682e0eaedcca3",
  measurementId: "G-RX5CTSFNX0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
