import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth, browserSessionPersistence, setPersistence } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize core Firebase App instance
const app = initializeApp(firebaseConfig);

/**
 * Firestore database instance configured with the custom database ID if provisioned,
 * otherwise defaults to the default Firestore database.
 * 
 * @whereUsed
 * - All database queries and operations in `src/lib/firestore.ts`
 */
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

/**
 * Firebase Authentication instance.
 * 
 * @whereUsed
 * - AuthGate.tsx (user login, registration, guest auth)
 * - App.tsx (auth state listener)
 * - UserProfileModal.tsx (avatar and name updates)
 */
export const auth = getAuth(app);

// Avoid auto log in every time by setting session persistence
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.warn("Auth persistence error:", error);
});

/**
 * Verifies network connectivity to the Firestore database server.
 * Handles offline state warnings gracefully during initialization.
 * 
 * @whereUsed
 * - Automatically executed during initial module loading to diagnose connection health.
 */
async function testGearForgeDBConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("GearForgeDB offline check:", error.message);
    }
  }
}
testGearForgeDBConnection();
