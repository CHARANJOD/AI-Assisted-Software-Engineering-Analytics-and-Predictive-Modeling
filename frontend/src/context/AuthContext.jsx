import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  updateProfile 
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';
import { createOrUpdateUserProfile } from '../services/firestore';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function formatAuthError(error) {
  if (!error) return 'An unknown authentication error occurred.';
  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Incorrect email or password. Please check your credentials and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please provide a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'Google Sign-In was cancelled before completing.';
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked by your browser. Please allow popups and try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Access to this account has been temporarily disabled. Try again later.';
    case 'auth/network-request-failed':
      return 'Network error connecting to authentication service. Please check your connection.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          try {
            await createOrUpdateUserProfile(currentUser);
          } catch (e) {
            console.warn('Silent sync profile error:', e);
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error('onAuthStateChanged error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName) => {
    setAuthError(null);
    if (!isFirebaseConfigured || !auth) {
      const err = new Error('Firebase credentials are not configured in frontend/.env');
      setAuthError(err.message);
      throw err;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      const updatedUser = {
        ...userCredential.user,
        displayName: displayName || userCredential.user.displayName
      };
      setUser(updatedUser);
      await createOrUpdateUserProfile(updatedUser);
      return updatedUser;
    } catch (error) {
      const formatted = formatAuthError(error);
      setAuthError(formatted);
      throw new Error(formatted);
    }
  };

  const login = async (email, password) => {
    setAuthError(null);
    if (!isFirebaseConfigured || !auth) {
      const err = new Error('Firebase credentials are not configured in frontend/.env');
      setAuthError(err.message);
      throw err;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      await createOrUpdateUserProfile(userCredential.user);
      return userCredential.user;
    } catch (error) {
      const formatted = formatAuthError(error);
      setAuthError(formatted);
      throw new Error(formatted);
    }
  };

  const loginWithGoogle = async () => {
    setAuthError(null);
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      const err = new Error('Firebase credentials are not configured in frontend/.env');
      setAuthError(err.message);
      throw err;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      await createOrUpdateUserProfile(result.user);
      return result.user;
    } catch (error) {
      const formatted = formatAuthError(error);
      setAuthError(formatted);
      throw new Error(formatted);
    }
  };

  const logout = async () => {
    setAuthError(null);
    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      return;
    }

    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      const formatted = formatAuthError(error);
      setAuthError(formatted);
      throw new Error(formatted);
    }
  };

  const value = {
    user,
    loading,
    authError,
    setAuthError,
    isFirebaseConfigured,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
