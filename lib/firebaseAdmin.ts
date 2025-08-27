import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!key) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set");
}
const serviceAccount = JSON.parse(key);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    })
}
const app = !getApps().length ? initializeApp({
    credential: cert(serviceAccount),
}) : getApp()

const db = getFirestore(app)
const auth = getAuth(app)
const adminn = admin;

// Function to verify Firebase ID token
export const verifyAuth = async (idToken: string) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export { auth, db, adminn };