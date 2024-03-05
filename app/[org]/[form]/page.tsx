import {
  getFormFromSlug,
  getFormsCol,
  getOrganizationFromSlug,
} from '#/lib/firebase/firestore';
import { addDoc, getDoc, getDocs } from 'firebase/firestore';
import OrganizationForm from '#/components/organization-form';
import { Subscription } from '#/types/firebase';

export async function generateMetadata({
  params,
}: {
  params: { org: string; form: string };
}) {
  const { organization, data } = await getFormFromSlug(params.org, params.form);

  return {
    metadataBase: params.form,
    title: `${data.title} - ${organization.data.name}`,
    description: data.description,
    openGraph: {
      title: `${data.title} - ${organization.data.name}`,
      description: data.description,
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export async function generateStaticParams({
  params,
}: {
  params: { org: string };
}) {
  const { doc } = await getOrganizationFromSlug(params.org);

  const forms = await getDocs(getFormsCol(doc.id));

  return forms.docs.map((form) => ({ form: form.data().slug }));
}

export default async function Page({
  params,
}: {
  params: { org: string; form: string };
}) {
  const { data } = await getFormFromSlug(params.org, params.form);
  const subscriptions: Subscription[] = (
    await Promise.all(data.subscriptions.map((subRef) => getDoc(subRef)))
  )
    .filter((doc) => doc.exists())
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Subscription, 'id'>),
    }));

  return (
    <OrganizationForm
      title={data.title}
      description={data.description}
      payment_methods={data.payment_methods}
      subscriptions={subscriptions}
    ></OrganizationForm>
  );
}
