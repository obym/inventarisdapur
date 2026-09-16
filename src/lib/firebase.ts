import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore using the specific provisioned databaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const FIRESTORE_COLLECTIONS = {
  KITCHENS: 'kitchens',
  ITEMS: 'inventory_items',
};
