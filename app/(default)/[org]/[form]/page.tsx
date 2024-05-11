import {
  getFormFromSlug,
  getFormsCol,
  getOrganizationFromSlug,
} from '#/lib/firebase/firestore';
import { getDoc, getDocs } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import OrganizationForm from '#/components/organization-form';
import { Subscription } from '#/types/firebase';
import { AddMemberResponse, AddMemberRequest } from '#/types/add_member';
import { firebaseApp } from '#/lib/firebase/initialize';

export async function generateMetadata({
  params,
}: {
  params: { org: string; form: string };
}) {
  const { organization, data } = await getFormFromSlug(params.org, params.form);

  return {
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
  const { organization, data } = await getFormFromSlug(params.org, params.form);
  const subscriptions: Subscription[] = (
    await Promise.all(data.subscriptions.map((subRef) => getDoc(subRef)))
  )
    .filter((doc) => doc.exists())
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Subscription, 'id'>),
    }));

  async function handleSubmit(values: AddMemberRequest) {
    'use server';
    console.log(values);
    const functions = getFunctions(firebaseApp, 'europe-west6');
    const addMember = httpsCallable<AddMemberRequest, AddMemberResponse>(
      functions,
      'addMember',
    );
    try {
      return (
        await addMember({ ...values, organizationId: organization.doc.id })
      ).data;
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <OrganizationForm
      title={data.title}
      description={data.description}
      paymentMethods={data.payment_methods}
      subscriptions={subscriptions}
      onSubmit={handleSubmit}
    ></OrganizationForm>
  );
}
