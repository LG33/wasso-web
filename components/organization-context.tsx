import { getOrganizationFromSlug } from '#/lib/firebase/firestore';
import { Organization } from '#/types/firebase';
import React from 'react';

const OrganizationContext = React.createContext<Organization | undefined>(
  undefined,
);

export async function OrganizationProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const currentOrganization = await getOrganizationFromSlug(slug);

  return (
    <OrganizationContext.Provider value={currentOrganization}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useCurrentOrganization(): Organization | undefined {
  const context = React.useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      'useCurrentOrganization must be used within an OrganizationProvider',
    );
  }
  return context;
}
