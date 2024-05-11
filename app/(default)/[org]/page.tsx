import { getOrganizationFromSlug } from '#/lib/firebase/firestore';

export default async function Page({ params }: { params: { org: string } }) {
  const { data } = await getOrganizationFromSlug(params.org);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">{data.name}</h1>
      <p>{params.org}</p>
    </div>
  );
}
