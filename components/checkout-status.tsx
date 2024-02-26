'use client';

import { accCheckouts } from '#/lib/firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { ExternalRedirect } from './external-redirect';
import { useDocSnapshot } from '#/lib/firebase/hooks';

export function CheckoutStatus({ id, status }: { id: string; status: string }) {
  const docRef = doc(accCheckouts, id);

  const [docData, isLoading] = useDocSnapshot(docRef, status == 'OPENED');

  if (status == 'OPENED') {
    if (isLoading || docData?.status == 'CREATED') {
      return <p>Chargement...</p>;
    } else {
      if (docData?.status == 'READY' && docData?.url) {
        return <ExternalRedirect url={docData.url} />;
      } else if (docData != null) {
        return <p>Statut du paiement : {docData?.status}</p>;
      } else {
        return <p>Le paiement ID {id} est introuvable</p>;
      }
    }
  } else {
    if (status != docData?.status)
      updateDoc(docRef, { status: status?.toLocaleUpperCase() });
    if (status == 'COMPLETED')
      return <p>Paiement réussi. Vous pouvez fermer cette fenêtre.</p>;
    return <p>Paiement {status}</p>;
  }
}
