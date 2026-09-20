import {
  doc,
  collection,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

/**
 * Creates or updates the authenticated user's profile in users/{uid}
 * 
 * users/{uid}
 *   email
 *   displayName
 *   photoURL
 *   provider
 *   createdAt
 *   updatedAt
 */
export async function createOrUpdateUserProfile(user) {
  if (!isFirebaseConfigured || !db || !user?.uid) {
    return null;
  }

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const existing = await getDoc(userDocRef);

    const profileData = {
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || null,
      provider: user.providerData?.[0]?.providerId || 'password',
      updatedAt: serverTimestamp()
    };

    if (!existing.exists()) {
      profileData.createdAt = serverTimestamp();
    }

    await setDoc(userDocRef, profileData, { merge: true });
    return profileData;
  } catch (error) {
    console.error('Error in createOrUpdateUserProfile:', error);
    return null;
  }
}

// Backward-compatible alias
export const syncUserProfile = createOrUpdateUserProfile;

/**
 * Fetch authenticated user's Firestore profile
 */
export async function getUserProfile(uid) {
  if (!isFirebaseConfigured || !db || !uid) {
    return null;
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error('Error fetching user profile from Firestore:', error);
    return null;
  }
}

/**
 * Save a successful prediction to users/{userId}/predictions/{predictionId}
 * 
 * users/{uid}/predictions/{predictionId}
 *   modelType ("agent" | "stars")
 *   input (exact fields sent to Render API)
 *   output (predicted_agent or predicted_stars)
 *   createdAt (serverTimestamp)
 * 
 * @param {string} userId
 * @param {Object} prediction - { modelType, input, output }
 */
export async function savePrediction(userId, prediction) {
  if (!isFirebaseConfigured || !db || !userId) {
    return null;
  }

  try {
    const predictionsColRef = collection(db, 'users', userId, 'predictions');
    const docData = {
      modelType: prediction.modelType || prediction.model,
      model: prediction.modelType || prediction.model, // backward-compat
      input: prediction.input,
      output: prediction.output,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(predictionsColRef, docData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving prediction to Firestore:', error);
    throw error;
  }
}

// Backward-compatible alias
export const savePredictionRecord = savePrediction;

/**
 * Fetch prediction history for the authenticated user only.
 * Ordered newest first (createdAt descending).
 * 
 * @param {string} userId
 * @returns {Promise<Array>} Array of prediction records with JS Date timestamps
 */
export async function getUserPredictions(userId) {
  if (!isFirebaseConfigured || !db || !userId) {
    return [];
  }

  try {
    const predictionsColRef = collection(db, 'users', userId, 'predictions');
    const q = query(predictionsColRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => {
      const data = d.data();
      let createdAtDate = new Date();
      if (data.createdAt?.toDate) {
        createdAtDate = data.createdAt.toDate();
      } else if (data.createdAt instanceof Date) {
        createdAtDate = data.createdAt;
      }

      return {
        id: d.id,
        userId: userId,
        modelType: data.modelType || data.model || 'agent',
        model: data.modelType || data.model || 'agent',
        input: data.input || {},
        output: data.output || {},
        createdAt: createdAtDate,
        createdAtDate: createdAtDate
      };
    });
  } catch (error) {
    console.error('Error fetching user predictions from Firestore:', error);
    throw error;
  }
}

// Backward-compatible alias
export const getUserPredictionHistory = getUserPredictions;

/**
 * Delete a prediction record owned by the authenticated user
 * 
 * @param {string} userId
 * @param {string} predictionId
 */
export async function deletePrediction(userId, predictionId) {
  if (!isFirebaseConfigured || !db || !userId || !predictionId) {
    return false;
  }

  try {
    const docRef = doc(db, 'users', userId, 'predictions', predictionId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting prediction from Firestore:', error);
    throw error;
  }
}

// Backward-compatible alias
export const deletePredictionRecord = deletePrediction;

/**
 * Calculate factual prediction statistics for the Dashboard.
 * Strictly based on the current authenticated user's prediction history.
 * No fabricated numbers; clean zero-states when no records exist.
 * 
 * @param {string} userId
 */
export async function getUserPredictionStats(userId) {
  if (!isFirebaseConfigured || !db || !userId) {
    return {
      totalPredictions: 0,
      agentPredictions: 0,
      starsPredictions: 0,
      recentPredictions: [],
      latestPrediction: null,
      latestActivity: null
    };
  }

  try {
    const history = await getUserPredictions(userId);

    const agentCount = history.filter((p) => p.modelType === 'agent' || p.model === 'agent').length;
    const starsCount = history.filter((p) => p.modelType === 'stars' || p.model === 'stars').length;
    const latest = history.length > 0 ? history[0] : null;

    return {
      totalPredictions: history.length,
      agentPredictions: agentCount,
      starsPredictions: starsCount,
      recentPredictions: history.slice(0, 4),
      latestPrediction: latest,
      latestActivity: latest?.createdAt || null
    };
  } catch (error) {
    console.error('Error computing prediction statistics:', error);
    return {
      totalPredictions: 0,
      agentPredictions: 0,
      starsPredictions: 0,
      recentPredictions: [],
      latestPrediction: null,
      latestActivity: null
    };
  }
}
