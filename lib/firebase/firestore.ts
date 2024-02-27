import {
  getFirestore,
  CollectionReference,
  collection,
  DocumentData,
  writeBatch,
  Query,
  getDocs,
} from 'firebase/firestore';

import { firebaseApp } from './initialize';
import {
  Organization,
  AccCheckout,
  AccTransactionLine,
  AccTransaction,
  AccAccount,
} from 'types/firebase';

export const firestore = getFirestore(firebaseApp);

export const startBatch = () => writeBatch(firestore);

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export const organizationsCol = createCollection<Organization>('organizations');
export const accCheckoutsCol = createCollection<AccCheckout>('acc_checkouts');
export const accAccountsCol = createCollection<AccAccount>('acc_accouts');
export const getAccTransactionsCol = (organizationId: string) =>
  createCollection<AccTransaction>(
    `organizations/${organizationId}/acc_transactions`,
  );
export const getAccTransactionLinesCol = (organizationId: string) =>
  createCollection<AccTransactionLine>(
    `organizations/${organizationId}/acc_transaction_lines`,
  );

export async function batchUpdate<T = DocumentData>(
  query: Query<T, DocumentData>,
  newData: Partial<T>,
) {
  const batch = startBatch();

  const querySnapshot = await getDocs(query);
  querySnapshot.forEach((doc) => {
    batch.update(doc.ref, newData);
  });
  await batch.commit();
}
