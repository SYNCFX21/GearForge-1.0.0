import admin from "firebase-admin";
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.applicationDefault(), // Wait, no, we need a service account. We don't have it.
});
