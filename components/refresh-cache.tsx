'use client';

import { useInterval } from 'interval-hooks';
import { useEffect, useState } from 'react';

export function RefreshCache({ check }: { check: () => Promise<void> }) {
  useInterval(check, 500);

  return null;
}
