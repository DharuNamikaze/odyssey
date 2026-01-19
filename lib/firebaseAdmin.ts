import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { isTokenBlacklisted } from './tokenBlacklist';
import { env } from './env';

const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_KEY);

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
    // Check if token is blacklisted
    if (isTokenBlacklisted(idToken)) {
      throw new Error('Token has been revoked');
    }
    
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export { auth, db, adminn };