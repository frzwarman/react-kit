import type { Meta, StoryObj } from '@storybook/react';
import { FormBuilder, type FormBuilderProps } from '../../../kit/builder/form/components/FormBuilder';

const meta: Meta<typeof FormBuilder> = {
  title: 'Kit/Builder/Form',
  component: FormBuilder,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof FormBuilder>;

export const BasicUsage: Story = {
  name: 'Basic usage',
  args: {
    sections: [
      {
        title: 'User Info',
        description: 'A minimal configuration using grid layout',
        variant: 'card',
        layout: 'grid',
        grid: { cols: 1, mdCols: 2, gap: 'gap-4' },
        fields: [
          { name: 'firstName', label: 'First name', type: 'text', required: true },
          { name: 'lastName', label: 'Last name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'newsletter', label: 'Subscribe to newsletter', type: 'checkbox', defaultValue: false, gridCols: 2 },
        ],
      },
    ],
    onSubmit: (data: unknown) => {
      console.log('Submit (basic):', data);
    },
    showActions: true,
  } satisfies Partial<FormBuilderProps>,
  render: (args) => (
    <div className="max-w-3xl mx-auto p-6">
      <FormBuilder {...(args as FormBuilderProps)} />
    </div>
  ),
};
