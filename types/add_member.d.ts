import { OrganizationForm } from './firebase';

interface IDictionary<TValue> {
  [id: string]: TValue;
}

export type AddMemberRequest = {
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  paymentMethod: OrganizationForm['payment_methods'];
  subscriptionId: string;
  price: number;
};

export type AddMemberResponse = {
  member_id: string;
  subscription_member_id: string;
  acc_transaction_id?: string;
  acc_source_transaction_line_id?: string;
  acc_target_transaction_line_id?: string;
  acc_checkout_id?: string;
};
