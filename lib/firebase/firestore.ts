import {
  getFirestore,
  CollectionReference,
  collection,
  DocumentData,
} from 'firebase/firestore';

import { firebaseApp } from './initialize';

export const firestore = getFirestore(firebaseApp);

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

import { Organization, AccCheckout } from 'types/firebase';

export const organizationCol = createCollection<Organization>('organizations');
export const accCheckouts = createCollection<AccCheckout>('acc_checkouts');
