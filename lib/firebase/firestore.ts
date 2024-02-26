// Get the imports
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  CollectionReference,
  collection,
  DocumentData,
} from 'firebase/firestore';

// Init the firebase app
export const firebaseApp = initializeApp({
  apiKey: 'AIzaSyAREA_42fNKdfjPZF6L8oJt2GsbAGIUZhs',
  authDomain: 'allgood-zbcuyr.firebaseapp.com',
  projectId: 'allgood-zbcuyr',
  storageBucket: 'allgood-zbcuyr.appspot.com',
  messagingSenderId: '824150632971',
  appId: '1:824150632971:web:2e8ce2c8aea6a37612750e',
});

// Export firestore incase we need to access it directly
export const firestore = getFirestore();
// This is just a helper to add the type to the db responses
const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

import { Organization, AccCheckout } from 'types/firebase';

// export all your collections
export const organizationCol = createCollection<Organization>('organizations');
export const accCheckouts = createCollection<AccCheckout>('acc_checkouts');
