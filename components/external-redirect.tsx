'use client';

import { useEffect } from 'react';

export function ExternalRedirect({ url }: { url: string }) {
  useEffect(() => {
    window.location.href = url;
  }, []);

  return null;
}
