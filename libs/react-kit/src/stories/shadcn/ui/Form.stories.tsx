import type { Meta, StoryObj } from '@storybook/react';
import { Form } from '../../../shadcn/ui/form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../../../shadcn/ui/form';
import { Input } from '../../../shadcn/ui/input';
import { Button } from '../../../shadcn/ui/button';
import { toast } from 'sonner';

const meta: Meta<typeof Form> = {
  title: 'Shadcn/UI/Form',
  component: Form,
};

export default meta;

type Story = StoryObj<typeof Form>;

function ValidatedFormDemo() {
  const schema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  function onSubmit(values: FormValues) {
    // For demo purposes in Storybook
    toast.success(`Submitted: ${JSON.stringify(values, null, 2)}`);
  }

  return (
    <div className="max-w-md space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormDescription>We’ll never share your email.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </Form>
    </div>
  );
}

export const WithValidation: Story = {
  render: () => <ValidatedFormDemo />,
};

