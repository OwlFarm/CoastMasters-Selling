
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app"; // Ensure this exact import
import { getStorage, connectStorageEmulator } from "firebase/storage"; // Import connectStorageEmulator
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from "firebase/firestore"; // Import connectFirestoreEmulator
// If you use other Firebase services with emulators, import their connect functions as well (e.g., connectAuthEmulator)

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get service instances
const db = getFirestore(app);
const storage = getStorage(app);
// Get other service instances if you use them

// Connect to emulators only when explicitly enabled
const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true';
if (useEmulators) {
  console.log('Connecting to Firebase emulators...');
  const firestorePort = Number(process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_FIRESTORE_PORT ?? '8080');
  const storagePort = Number(process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_STORAGE_PORT ?? '9199');
  connectFirestoreEmulator(db, 'localhost', firestorePort);
  connectStorageEmulator(storage, 'localhost', storagePort);
  // Connect to other emulators you use (e.g., connectAuthEmulator(auth, 'http://localhost:9099');)
}

// Enable offline persistence only in the browser
if (typeof window !== 'undefined') {
  try {
    enableIndexedDbPersistence(db);
  } catch (err: any) {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support all of the features required to enable persistence.');
    } else {
      console.error("Failed to enable offline persistence:", err);
    }
  }
}

export { app, db, storage };
