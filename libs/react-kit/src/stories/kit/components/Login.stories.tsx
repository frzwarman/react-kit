import type { Meta, StoryObj } from '@storybook/react';
import { Login } from '../../../kit/components/login/Login';
import { FormBuilder, type FormBuilderSectionConfig } from '../../../kit/builder/form/components';
import { z } from 'zod';
import { Button } from '../../../shadcn/ui/button';

const meta: Meta<typeof Login> = {
  title: 'Kit/Components/Login',
  component: Login,
};

export default meta;

type Story = StoryObj<typeof Login>;

const formSections: FormBuilderSectionConfig[] = [
  {
    variant: 'plain',
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'm@example.com',
        required: true,
        validation: z.string().email('Please enter a valid email'),
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        validation: z.string().min(6, 'Password must be at least 6 characters'),
      },
    ],
  },
];

const handleSubmit = async (data: Record<string, unknown>) => {
  // Demo only
  console.log('Login submit', data);
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 6.9 2 2.7 6.2 2.7 11.3S6.9 20.7 12 20.7c6 0 9.9-4.2 9.9-10.1 0-.7-.1-1.2-.2-1.7H12z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#F25022" d="M11.5 11.5H2.5V2.5h9z" />
      <path fill="#7FBA00" d="M21.5 11.5h-9V2.5h9z" />
      <path fill="#00A4EF" d="M11.5 21.5H2.5v-9h9z" />
      <path fill="#FFB900" d="M21.5 21.5h-9v-9h9z" />
    </svg>
  );
}

export const Basic: Story = {
  name: 'Basic with FormBuilder',
  render: () => (
    <Login
      appTitle="Acme Inc"
      subtitle="Enter your email and password to sign in"
      signupLabel="Don't have an account?"
      signupLinkLabel="Create one"
      signupHref="#signup"
      rightImageSrc="https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2069&auto=format&fit=crop"
    >
      <FormBuilder
        sections={formSections}
        onSubmit={handleSubmit}
        submitLabel="Login"
        className=""
        formClassName=""
      />
    </Login>
  ),
};

export const WithSocial: Story = {
  name: 'With social continue-with',
  render: () => (
    <Login
      appTitle="Acme Inc"
      subtitle="Welcome back"
      signupLabel="New here?"
      signupLinkLabel="Sign up"
      signupHref="#signup"
      rightImageSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2070&auto=format&fit=crop"
      continueWith={
        <>
          <Button variant="outline" className="w-full justify-center gap-2">
            <GoogleIcon />
            Continue with Google
          </Button>
          <Button variant="outline" className="w-full justify-center gap-2">
            <MicrosoftIcon />
            Continue with Microsoft
          </Button>
        </>
      }
    >
      <FormBuilder
        sections={formSections}
        onSubmit={handleSubmit}
        submitLabel="Login"
      />
    </Login>
  ),
};

export const WithForgotPassword: Story = {
  name: 'With forgot password (default label)',
  render: () => (
    <Login
      appTitle="Acme Inc"
      subtitle="Use your credentials to sign in"
      signupLabel="Don't have an account?"
      signupLinkLabel="Create one"
      signupHref="#signup"
      forgotPasswordLabel="Forgot your password?"
      forgotPasswordLinkLabel="Reset Here"
      forgotPasswordHref="#forgot-password"
      rightImageSrc="https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2069&auto=format&fit=crop"
    >
      <FormBuilder
        sections={formSections}
        onSubmit={handleSubmit}
        submitLabel="Login"
      />
    </Login>
  ),
};

export const WithForgotPasswordCustom: Story = {
  name: 'With forgot password (custom label/link)',
  render: () => (
    <Login
      appTitle="Acme Inc"
      subtitle="Welcome back"
      signupLabel="New here?"
      signupLinkLabel="Join now"
      signupHref="#signup"
      forgotPasswordHref="/auth/reset-password"
      forgotPasswordLabel="Your password is lost?"
      forgotPasswordLinkLabel="Reset Here"
      rightImageSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2070&auto=format&fit=crop"
    >
      <FormBuilder
        sections={formSections}
        onSubmit={handleSubmit}
        submitLabel="Login"
      />
    </Login>
  ),
};
