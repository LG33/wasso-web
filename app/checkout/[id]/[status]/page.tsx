import { ExternalRedirect } from '#/components/external-redirect';
import { RefreshCache } from '#/components/refresh-cache';
import { accCheckoutsCol } from '#/lib/firebase/firestore';
import { doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const checkouts = await getDocs(accCheckoutsCol);

  return checkouts.docs.map((checkout) => ({
    id: checkout.id,
  }));
}

export default async function Page({
  params,
}: {
  params: { id: string; status: string };
}) {
  const status = params.status.toLocaleUpperCase();
  const checkoutRef = doc(accCheckoutsCol, params.id);

  const checkoutData = (await getDoc(checkoutRef)).data();

  async function checkIfPostChanged() {
    'use server';
    if (
      (await getDoc(doc(accCheckoutsCol, params.id))).data()?.status !=
      checkoutData?.status
    ) {
      revalidatePath(`/checkout/${params.id}`);
    }
  }

  var message = '';

  if (checkoutData != null) {
    if (status == 'OPENED') {
      if (checkoutData.status == 'CREATED') {
        message = 'Chargement...';
      } else {
        if (checkoutData?.status == 'READY' && checkoutData.url) {
          message = 'Redirection...';
        } else if (checkoutData != null) {
          message = `Statut du paiement : ${checkoutData.status}`;
        }
      }
    } else {
      if (status != checkoutData.status)
        updateDoc(checkoutRef, { status: status?.toLocaleUpperCase() });
      if (status == 'COMPLETED') {
        message = 'Paiement réussi. Vous pouvez fermer cette fenêtre.';
      } else {
        message = `Paiement ${status}`;
      }
    }
  } else {
    message = `Le paiement ID ${params.id} est introuvable`;
  }

  return (
    <div className="text-center">
      {checkoutData?.status == 'CREATED' && (
        <RefreshCache check={checkIfPostChanged} />
      )}
      {checkoutData?.status == 'READY' && checkoutData?.url && (
        <ExternalRedirect url={checkoutData?.url} />
      )}
      <p>{message}</p>
    </div>
  );
}
