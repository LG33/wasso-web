import {
  DocumentData,
  DocumentReference,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { usePathname } from 'next/navigation';
import { useState, useCallback } from 'react';

export const useDocSnapshot = <T = DocumentData>(
  docRef: DocumentReference<T, DocumentData>,
  defaultIsSubscribed = true,
): [T | undefined, boolean] => {
  const pathname = usePathname();

  const [docData, setDocData] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);

  getDoc(docRef).then((snapshot) => {
    setDocData(snapshot.data());
    setIsLoading(false);
    if (defaultIsSubscribed) subscribe();
  });

  const subscribe = useCallback(() => {
    const unsub = onSnapshot(docRef, (snapshot) => {
      setDocData(snapshot.data());
      revalidatePath(pathname);
    });
    return unsub;
  }, [docRef]);

  return [docData, isLoading];
};
