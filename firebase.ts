import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  User,
  browserLocalPersistence,
  setPersistence,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Set auth persistence to LOCAL
setPersistence(auth, browserLocalPersistence).catch(console.error);

// Initialize Firestore with persistence enabled
let db: ReturnType<typeof getFirestore>;
try {
  // Try to get existing Firestore instance
  db = getFirestore(app);
} catch {
  // If no instance exists, initialize with persistence
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentSingleTabManager(),
      cacheSizeBytes: CACHE_SIZE_UNLIMITED
    })
  });
}

export { db };

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return { user: null, error };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Email sign-in error:', error);
    return { user: null, error };
  }
};

export const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    await sendEmailVerification(userCredential.user);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Sign-up error:', error);
    return { user: null, error };
  }
};

export const resendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
    return { error: null };
  } catch (error) {
    console.error('Verification email error:', error);
    return { error };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Sign-out error:', error);
    return { error };
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export { onAuthStateChanged };