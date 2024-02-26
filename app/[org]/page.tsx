import { organizationCol } from '#/lib/firebase/firestore';
import { getDocs, query, where, limit } from 'firebase/firestore';

export async function generateStaticParams() {
  const organizations = await getDocs(organizationCol);

  return organizations.docs.map((org) => ({
    org: org.data().slug,
  }));
}

export async function getData({ org }: { org: string }) {
  const organizations = await getDocs(
    query(organizationCol, where('slug', '==', org), limit(1)),
  );

  return organizations.docs[0].data();
}

export default async function Page({ params }: { params: { org: string } }) {
  const data = await getData(params);

  return (
    <p>
      {data.name} {params.org}
    </p>
  );
}
