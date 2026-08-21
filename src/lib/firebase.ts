import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth, browserSessionPersistence, setPersistence } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
// Pass the provisioned custom database ID so Firestore connects to GearForgeDB database
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
export const auth = getAuth(app);

// Avoid auto log in every time by setting session persistence
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.warn("Auth persistence error:", error);
});

// Test GearForgeDB connection

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
