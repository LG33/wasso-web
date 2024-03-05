//import { OrganizationProvider } from '#/components/organization-context';
import {
  getOrganizationFromSlug,
  organizationsCol,
} from '#/lib/firebase/firestore';
import { getDocs } from 'firebase/firestore';

export async function generateMetadata({
  params,
}: {
  params: { org: string };
}) {
  const { data } = await getOrganizationFromSlug(params.org);

  return {
    metadataBase: params.org,
    title: data.name,
    description: data.description,
    openGraph: {
      title: data.name,
      description: data.description,
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export async function generateStaticParams() {
  const organizations = await getDocs(organizationsCol);

  return organizations.docs.map((org) => ({
    org: org.data().slug,
  }));
}

export default function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { org: string };
}) {
  return children;
}
