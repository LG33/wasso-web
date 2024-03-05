import {
  getFirestore,
  CollectionReference,
  collection,
  DocumentData,
  writeBatch,
  Query,
  getDocs,
  query,
  limit,
  where,
} from 'firebase/firestore';

import { firebaseApp } from './initialize';
import {
  Organization,
  AccCheckout,
  AccTransactionLine,
  AccTransaction,
  AccAccount,
  OrganizationForm,
} from 'types/firebase';

export const firestore = getFirestore(firebaseApp);

export const startBatch = () => writeBatch(firestore);

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};
const createSubCollection = <T = DocumentData>(
  collectionName: string,
  collectionId: string,
  subCollectionName: string,
) => {
  return collection(
    firestore,
    collectionName,
    collectionId,
    subCollectionName,
  ) as CollectionReference<T>;
};

export const organizationsCol = createCollection<Organization>('organizations');
export const accCheckoutsCol = createCollection<AccCheckout>('acc_checkouts');
export const accAccountsCol = createCollection<AccAccount>('acc_accouts');
export const getAccTransactionsCol = (organizationId: string) =>
  createSubCollection<AccTransaction>(
    'organizations',
    organizationId,
    'acc_transactions',
  );
export const getAccTransactionLinesCol = (organizationId: string) =>
  createSubCollection<AccTransactionLine>(
    'organizations',
    organizationId,
    'acc_transaction_lines',
  );
export const getFormsCol = (organizationId: string) =>
  createSubCollection<OrganizationForm>(
    'organizations',
    organizationId,
    'forms',
  );
export const getSubscriptionsCol = (organizationId: string) =>
  createSubCollection<OrganizationForm>(
    'organizations',
    organizationId,
    'subscriptions',
  );

export async function getOrganizationFromSlug(slug: string) {
  const organizations = await getDocs(
    query(organizationsCol, where('slug', '==', slug), limit(1)),
  );

  return { doc: organizations.docs[0], data: organizations.docs[0].data() };
}

export async function getFormFromSlug(
  organizationSlug: string,
  formSlug: string,
) {
  const organization = await getOrganizationFromSlug(organizationSlug);
  const forms = await getDocs(
    query(
      getFormsCol(organization.doc.id),
      where('slug', '==', formSlug),
      limit(1),
    ),
  );

  return { organization, doc: forms.docs[0], data: forms.docs[0].data() };
}

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
