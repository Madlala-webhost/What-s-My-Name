// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import env from "dotenv";
env.config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let app = null;
let db = null;

function getFirebaseApp() {
  if (!hasFirebaseConfig) {
    return null;
  }

  if (app) {
    return app;
  }

  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return app;
}

export function getDb() {
  const firebaseApp = getFirebaseApp();

  if (!firebaseApp) {
    return null;
  }

  if (!db) {
    db = getFirestore(firebaseApp);
  }

  return db;
}

export { hasFirebaseConfig };

export default getFirebaseApp();
