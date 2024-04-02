export type Organization = {
  name: string;
  description: string;
  slug: string;
  public_email: string;
};

export type OrganizationForm = {
  title: string;
  description: string;
  subscriptions: DocumentReference[];
  payment_methods: List<'CASH' | 'CHECK' | 'ONLINE'>;
  slug: string;
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

export type Member = {
  first_name: string;
  last_name: string;
  email: string;
};

export type Subscription = {
  id: string;
  name: string;
  min_price: number;
  default_price: number;
};