import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

getDocs(collection(db, 'users')).then(async snapshot => {
  for (let d of snapshot.docs) {
    const data = d.data();
    if (!data.uid) {
      console.log("Fixing missing uid for:", d.id);
      data.uid = d.id;
      // We will also check if this was a super_admin that didn't get fully formed
      if (data.role === 'super_admin' && !data.email) {
         data.email = 'aaronsalagubang21@gmail.com'; // assuming this is Aaron
      }
      await setDoc(doc(db, 'users', d.id), data, {merge: true});
    }
  }
  console.log("Fix completed.");
  process.exit(0);
});
