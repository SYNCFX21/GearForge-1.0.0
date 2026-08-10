import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc } from "firebase/firestore";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

getDocs(collection(db, 'users')).then(async snapshot => {
  for (let doc of snapshot.docs) {
    if (!doc.data().uid) {
      console.log("Deleting bad user doc:", doc.id);
      await deleteDoc(doc.ref);
    }
  }
  console.log("Done");
  process.exit(0);
});
