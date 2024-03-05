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

export default function OrganizationForm(
  data: Omit<OrganizationForm, 'subscriptions' | 'slug'> & {
    subscriptions: Subscription[];
  },
) {
  const [selectedSubscription, setSelectedSubscription] = useState(
    data.subscriptions[0],
  );
  const formSchema = z.object({
    display_name: z
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
    payment_type: z.enum(['check', 'cash', 'online'], {
      required_error: 'You need to select a payment type.',
    }),
    subscription: z.string({
      required_error: 'You need to select a payment type.',
    }),
    price: z
      .number({
        required_error: 'Ce champs est requis',
      })
      .min(selectedSubscription.min_price),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_type: 'online',
      subscription: selectedSubscription.id,
      price: selectedSubscription.default_price,
    },
  });
  const formValues = form.watch();

  useEffect(() => {
    setSelectedSubscription(
      data.subscriptions.find(({ id }) => id == formValues.subscription)!,
    );
    console.log(selectedSubscription.name);
  }, [data.subscriptions, formValues.subscription]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <h1 className="mb-3 text-2xl font-bold">{data.title}</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom(s) et nom(s)</FormLabel>
              <FormControl>
                <Input {...field} className="bg-card" />
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
                <Input {...field} className="bg-card" />
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
          name="subscription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formule</FormLabel>
              <FormControl>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue defaultValue={field.value} />
                  </SelectTrigger>
                  <SelectContent>
                    {data.subscriptions.map(({ id, name }) => (
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
          <>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className="bg-card" />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage className="font-normal" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_type"
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
                          <RadioGroupItem value="online" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          En ligne (carte bancaire)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="cash" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          En espèces
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="check" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Par chèque
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="font-normal" />
                </FormItem>
              )}
            />
          </>
        )}
        <Button type="submit">
          {form.getValues('payment_type') == 'online'
            ? 'Suivant'
            : 'Enregistrer'}
        </Button>
      </form>
    </Form>
  );
}
