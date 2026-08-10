import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

getDocs(collection(db, 'users')).then(snapshot => {
  const users = snapshot.docs.map(doc => doc.data());
  console.log("Users:", JSON.stringify(users, null, 2));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
