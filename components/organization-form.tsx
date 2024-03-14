'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '#/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import { Input } from '#/components/ui/input';
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group';
import { OrganizationForm, Subscription } from '#/types/firebase';
import { useEffect, useState } from 'react';
import { AddMemberResponse, AddMemberRequest } from '#/types/add_member';
import { useAsync } from '#/lib/firebase/hooks';

export default function OrganizationForm({
  title,
  description,
  paymentMethods: paymentMethods,
  subscriptions,
  onSubmit,
}: {
  title: string;
  description: string;
  paymentMethods: OrganizationForm['payment_methods'];
  subscriptions: Subscription[];
  onSubmit: (
    values: AddMemberRequest,
  ) => Promise<AddMemberResponse | undefined>;
}) {
  const [selectedSubscription, setSelectedSubscription] = useState(
    subscriptions[0],
  );
  const [trigger, responseData, isLoading, error] =
    useAsync<AddMemberResponse>();

  const formSchema = z.object({
    displayName: z
      .string({
        required_error: 'Ce champs est requis',
      })
      .min(10, {
        message: 'Username must be at least 10 characters.',
      }),
    email: z
      .string({
        required_error: 'Ce champs est requis',
      })
      .email(),
    paymentMethod: z.enum(['CHECK', 'CASH', 'ONLINE'], {
      required_error: 'You need to select a payment type.',
    }),
    subscriptionId: z.string({
      required_error: 'You need to select a payment type.',
    }),
    price: z
      .number({
        required_error: 'Ce champs est requis',
      })
      .min(selectedSubscription.min_price),
  });

  const form = useForm<AddMemberRequest>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: 'ONLINE',
      subscriptionId: selectedSubscription.id,
      price: selectedSubscription.default_price,
    },
  });
  const formValues = form.watch();

  useEffect(() => {
    setSelectedSubscription(
      subscriptions.find(({ id }) => id == formValues.subscriptionId)!,
    );
    console.log(selectedSubscription.name);
  }, [subscriptions, formValues.subscriptionId]);

  useEffect(() => {
    if (responseData?.acc_checkout_id)
      window.location.href = `/checkout/${responseData.acc_checkout_id}/opened`;
  }, [responseData]);

  function handleSubmit(values: AddMemberRequest) {
    trigger(onSubmit(values));
  }

  return (
    <Form {...form}>
      <h1 className="mb-3 text-2xl font-bold">{title}</h1>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom(s) et nom(s)</FormLabel>
              <FormControl>
                <Input
                  defaultValue={field.value}
                  onChange={field.onChange}
                  className="bg-card"
                />
              </FormControl>
              <FormDescription>
                Les noms et prénoms que vous voulez associer à votre adhésion
              </FormDescription>
              <FormMessage className="font-normal" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse email</FormLabel>
              <FormControl>
                <Input
                  defaultValue={field.value}
                  onChange={field.onChange}
                  className="bg-card"
                />
              </FormControl>
              <FormDescription>
                L&apos;adresse email qui sera associée à votre adhésion
              </FormDescription>
              <FormMessage className="font-normal" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subscriptionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formule</FormLabel>
              <FormControl>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue defaultValue={field.value} />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptions.map(({ id, name }) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage className="font-normal" />
            </FormItem>
          )}
        />
        {selectedSubscription.default_price > 0 && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix (€)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" className="bg-card" />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage className="font-normal" />
              </FormItem>
            )}
          />
        )}
        {formValues.price > 0 && paymentMethods.length > 1 && (
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Méthode de paiement</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="ONLINE" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        En ligne (carte bancaire)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="CASH" />
                      </FormControl>
                      <FormLabel className="font-normal">En espèces</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="CHECK" />
                      </FormControl>
                      <FormLabel className="font-normal">Par chèque</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="font-normal" />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" isLoading={isLoading}>
          {form.getValues('paymentMethod') == 'ONLINE'
            ? 'Suivant'
            : 'Enregistrer'}
        </Button>
      </form>
    </Form>
  );
}
