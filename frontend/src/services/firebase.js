import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check whether valid Firebase credentials are provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.trim() !== '' &&
  !firebaseConfig.apiKey.includes('your_api_key') &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId.trim() !== ''
);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Ensure session persistence across reloads
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn('Failed to set browserLocalPersistence on Firebase auth:', err);
    });

    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.info(
    '[Firebase] Firebase credentials are not yet configured in frontend/.env. ' +
    'Authentication and Firestore will operate in standby mode until valid keys are provided.'
  );
}

export { app, auth, db, googleProvider };
