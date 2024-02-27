'use client';

import { accCheckoutsCol } from '#/lib/firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { useDocSnapshot } from '#/lib/firebase/hooks';
import { useEffect } from 'react';

export function CheckoutStatus({ id, status }: { id: string; status: string }) {
  const docRef = doc(accCheckoutsCol, id);

  const [docData, isLoading] = useDocSnapshot(docRef, status == 'OPENED');

  useEffect(() => {
    if (docData?.url) window.location.href = docData?.url;
  }, [docData]);

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
        message = `Le paiement ID ${id} est introuvable`;
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
      <p>{message}</p>
    </div>
  );
}
