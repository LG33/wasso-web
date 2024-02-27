import { ExternalRedirect } from '#/components/external-redirect';
import { RefreshCache } from '#/components/refresh-cache';
import { accCheckouts } from '#/lib/firebase/firestore';
import { useDocSnapshot } from '#/lib/firebase/hooks';
import {
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

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
  const status = params.status.toLocaleUpperCase();
  const docRef = doc(accCheckouts, params.id);

  const docData = (await getDoc(docRef)).data();

  async function checkIfPostChanged() {
    'use server';
    if (
      (await getDoc(doc(accCheckouts, params.id))).data()?.status !=
      docData?.status
    ) {
      revalidatePath('/');
    }
  }

  var message = '';

  if (status == 'OPENED') {
    if (docData?.status == 'CREATED') {
      message = 'Chargement...';
    } else {
      if (docData?.status == 'READY' && docData?.url) {
        message = 'Redirection...';
      } else if (docData != null) {
        message = `Statut du paiement : ${docData?.status}`;
      } else {
        message = `Le paiement ID ${params.id} est introuvable`;
      }
    }
  } else {
    if (status != docData?.status)
      updateDoc(docRef, { status: status?.toLocaleUpperCase() });
    if (status == 'COMPLETED')
      message = 'Paiement réussi. Vous pouvez fermer cette fenêtre.';
    message = `Paiement ${status}`;
  }

  return (
    <div className="text-center">
      {docData?.status == 'CREATED' && (
        <RefreshCache check={checkIfPostChanged} />
      )}
      {docData?.status == 'READY' && docData?.url && (
        <ExternalRedirect url={docData?.url} />
      )}
      <p>{message}</p>
    </div>
  );
}
