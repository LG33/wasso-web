import { DocumentReference } from 'firebase/firestore';

export type Organization = {
  name: string;
  slug: number;
};

export type AccCheckout = {
  organization: DocumentReference;
  acc_account: DocumentReference;
  acc_transaction: DocumentReference;
  status: string;
  url: string;
};

export type AccAccount = {};

export type AccTransaction = {};

export type AccTransactionLine = {};
