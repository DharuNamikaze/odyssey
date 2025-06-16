import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

if (!admin.apps.length){
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    })
}
const app = !getApps().length ? initializeApp({
    credential: cert(serviceAccount), 
})
: getApp()

const db = getFirestore(app)
const auth = getAuth(app)
const adminn = admin;

export {auth, db, adminn};