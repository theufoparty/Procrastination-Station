import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the placeholders below with your actual config
// from "Project settings" in the Firebase console.
const firebaseConfig = {
  apiKey: 'AIzaSyAo1tzqY80gTVgo_vlhzK4SW1PslwLY3Cs',
  authDomain: 'procrastination-station-1de49.firebaseapp.com',
  projectId: 'procrastination-station-1de49',
  storageBucket: 'procrastination-station-1de49.firebasestorage.app',
  messagingSenderId: '758813018620',
  appId: '1:758813018620:web:b2b95b48c84f2850890a79',
  measurementId: 'G-0GF64Y2GLF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services for use in the rest of your app
export const auth = getAuth(app);
export const db = getFirestore(app);
