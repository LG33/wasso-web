'use client';

import {
  DocumentData,
  DocumentReference,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import { useState, useEffect, useCallback } from 'react';

export const useDocSnapshot = <T = DocumentData>(
  docRef: DocumentReference<T, DocumentData>,
  defaultIsSubscribed = true,
): [T | undefined, boolean] => {
  const [docData, setDocData] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDoc(docRef).then((snapshot) => {
      setDocData(snapshot.data());
      setIsLoading(false);
      if (defaultIsSubscribed) subscribe();
    });
  }, []);

  const subscribe = useCallback(() => {
    const unsub = onSnapshot(docRef, (snapshot) => {
      setDocData(snapshot.data());
    });
    return unsub;
  }, [docRef]);

  return [docData, isLoading];
};
