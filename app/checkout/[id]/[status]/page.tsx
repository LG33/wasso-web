import { CheckoutStatus } from '#/components/checkout-status';
import { accCheckouts } from '#/lib/firebase/firestore';
import { getDocs } from 'firebase/firestore';

export async function generateStaticParams() {
  const checkouts = await getDocs(accCheckouts);

  return checkouts.docs.map((checkout) => ({
    id: checkout.id,
  }));
}

export default async function Page({
  params,
}: {
  params: { id: string; status: string };
}) {
  return (
    <CheckoutStatus id={params.id} status={params.status.toLocaleUpperCase()} />
  );
}
