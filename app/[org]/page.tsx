import { organizationsCol } from '#/lib/firebase/firestore';
import { getDocs, query, where, limit } from 'firebase/firestore';
import { Suspense } from 'react';

export async function generateStaticParams() {
  const organizations = await getDocs(organizationsCol);

  return organizations.docs.map((org) => ({
    org: org.data().slug,
  }));
}

async function getData({ org }: { org: string }) {
  const organizations = await getDocs(
    query(organizationsCol, where('slug', '==', org), limit(1)),
  );

  return organizations.docs[0].data();
}

export default async function Page({ params }: { params: { org: string } }) {
  const data = await getData(params);

  return (
    <div className="text-center">
      <p className="text-2xl font-bold">{data.name}</p>
      <p>{params.org}</p>
    </div>
  );
}
