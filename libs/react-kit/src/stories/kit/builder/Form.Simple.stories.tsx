import type { Meta, StoryObj } from '@storybook/react';
import { FormBuilder } from '../../../kit/builder/form/components/FormBuilder';
import {
  createSection,
  createField,
  commonValidations,
} from '../../../kit/builder/form/utils';

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

export const SimpleExample: Story = {
  name: 'Simple example',
  render: () => {
    const handleSubmit = (data: unknown) => {
      console.log('Form submitted:', data);
    };

    const sections = [
      createSection.card('Contact Information', [
        createField.text('name', 'Full Name', {
          required: true,
          placeholder: 'Enter your full name',
        }),
        createField.email('email', 'Email Address', {
          required: true,
          placeholder: 'Enter your email address',
        }),
        createField.text('phone', 'Phone Number', {
          validation: commonValidations.phone,
          placeholder: '+1 (555) 123-4567',
        }),
        createField.select(
          'subject',
          'Subject',
          [
            { label: 'General Inquiry', value: 'general' },
            { label: 'Technical Support', value: 'support' },
            { label: 'Sales Question', value: 'sales' },
            { label: 'Partnership', value: 'partnership' },
          ],
          {
            required: true,
            placeholder: 'Select a subject',
          },
        ),
        createField.textarea('message', 'Message', {
          required: true,
          placeholder: 'Enter your message here...',
          gridCols: 2,
        }),
        createField.checkbox('subscribe', 'Subscribe to newsletter', {
          defaultValue: false,
          gridCols: 2,
        }),
        createField.switch('contactPermission', 'Allow contact by phone', {
          defaultValue: false,
          gridCols: 2,
        }),
      ]),
    ];

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-gray-600 mt-2">
            Fill out the form below and we'll get back to you as soon as
            possible.
          </p>
        </div>

        <FormBuilder
          sections={sections}
          onSubmit={handleSubmit}
          className="space-y-6"
        />
      </div>
    );
  },
};
