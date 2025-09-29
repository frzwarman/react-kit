import { useMemo } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { FormBuilder } from '../../../index'
import type { FormBuilderSectionConfig } from '../../../kit/builder/form/types'

interface SplitFormValues {
  userId: string
  firstName: string
  lastName: string
  email: string
  accountType: 'individual' | 'business'
  companyName?: string
  address: {
    street: string
    city: string
    zip: string
  }
  marketingOptIn: boolean
  preferredContactMethod: 'email' | 'phone'
  phoneNumber?: string
  newsletterTopics: string[]
  complianceContactEmail?: string
  eventsWebhookUrl?: string
  smsOptIn: boolean
  smsFrequency?: 'daily' | 'weekly' | 'monthly'
  timezone: string
  authorizedContacts: Array<{ contactId: string; contactName: string }>
}

const generalInfoSections: FormBuilderSectionConfig<SplitFormValues>[] = [
  {
    title: 'Profile',
    layout: 'grid',
    grid: { cols: 2, gap: 'gap-4' },
    fields: [
      {
        name: 'userId',
        label: 'User ID',
        type: 'hidden',
      },
      {
        name: 'firstName',
        label: 'First name',
        type: 'text',
        required: true,
      },
      {
        name: 'lastName',
        label: 'Last name',
        type: 'text',
        required: true,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        gridCols: 2,
      },
      {
        name: 'accountType',
        label: 'Account type',
        type: 'radio',
        options: [
          { label: 'Individual', value: 'individual' },
          { label: 'Business', value: 'business' },
        ],
        defaultValue: 'individual',
        gridCols: 2,
        description: 'Switch to Business to reveal additional company details.',
      },
      {
        name: 'companyName',
        label: 'Company name',
        type: 'text',
        placeholder: 'Acme Inc.',
        dependencies: [
          {
            field: 'accountType',
            condition: (value) => value === 'business',
            action: 'show',
          },
        ],
        gridCols: 2,
      },
    ],
  },
  {
    title: 'Address',
    layout: 'grid',
    grid: { cols: 3, gap: 'gap-4' },
    fields: [
      {
        name: 'address.street',
        label: 'Street',
        type: 'text',
        required: true,
        gridCols: 3,
      },
      {
        name: 'address.city',
        label: 'City',
        type: 'text',
        required: true,
        gridCols: 2,
      },
      {
        name: 'address.zip',
        label: 'ZIP code',
        type: 'text',
        required: true,
      },
    ],
  },
]

const preferencesSections: FormBuilderSectionConfig<SplitFormValues>[] = [
  {
    title: 'Preferences',
    layout: 'grid',
    grid: { cols: 2, gap: 'gap-4' },
    fields: [
      {
        name: 'marketingOptIn',
        label: 'Marketing emails',
        type: 'switch',
        defaultValue: true,
        description: 'Receive occasional product updates and tips.',
      },
      {
        name: 'newsletterTopics',
        label: 'Topics of interest',
        type: 'select',
        options: [
          { label: 'Product releases', value: 'product' },
          { label: 'Best practices', value: 'best-practices' },
          { label: 'Events', value: 'events' },
          { label: 'Integrations', value: 'integrations' },
        ],
        multiple: true,
        placeholder: 'Choose one or more topics',
        dependencies: [
          {
            field: 'marketingOptIn',
            condition: (value) => Boolean(value),
            action: 'show',
          },
          {
            field: 'marketingOptIn',
            condition: (value) => !value,
            action: 'setValue',
            value: [],
          },
        ],
      },
      {
        name: 'eventsWebhookUrl',
        label: 'Events webhook URL',
        type: 'text',
        placeholder: 'https://example.com/webhooks/events',
        description: 'Provide a webhook to receive notifications about upcoming events.',
        dependencies: [
          {
            field: 'newsletterTopics',
            condition: (value) => Array.isArray(value) && value.includes('events'),
            action: 'show',
          },
        ],
      },
      {
        name: 'preferredContactMethod',
        label: 'Preferred contact method',
        type: 'radio',
        options: [
          { label: 'Email', value: 'email' },
          { label: 'Phone', value: 'phone' },
        ],
        defaultValue: 'email',
      },
      {
        name: 'phoneNumber',
        label: 'Phone number',
        type: 'text',
        placeholder: '(555) 123-4567',
        dependencies: [
          {
            field: 'preferredContactMethod',
            condition: (value) => value === 'phone',
            action: 'show',
          },
        ],
      },
      {
        name: 'smsOptIn',
        label: 'SMS updates',
        type: 'switch',
        defaultValue: false,
        description: 'Get real-time notifications via SMS.',
        dependencies: [
          {
            field: 'preferredContactMethod',
            condition: (value) => value === 'phone',
            action: 'show',
          },
        ],
      },
      {
        name: 'smsFrequency',
        label: 'SMS frequency',
        type: 'select',
        options: [
          { label: 'Daily recap', value: 'daily' },
          { label: 'Weekly summary', value: 'weekly' },
          { label: 'Monthly digest', value: 'monthly' },
        ],
        placeholder: 'Choose how often we should text you',
        dependencies: [
          {
            field: 'smsOptIn',
            condition: (value) => Boolean(value),
            action: 'show',
          },
        ],
      },
      {
        name: 'complianceContactEmail',
        label: 'Compliance contact email',
        type: 'email',
        placeholder: 'compliance@company.com',
        description: 'Required for business accounts to receive compliance updates.',
        dependencies: [
          {
            field: 'accountType',
            condition: (value) => value === 'business',
            action: 'show',
          },
        ],
        gridCols: 2,
      },
      {
        name: 'timezone',
        label: 'Timezone',
        type: 'select',
        options: [
          { label: 'UTC−08:00 Pacific', value: 'America/Los_Angeles' },
          { label: 'UTC−05:00 Eastern', value: 'America/New_York' },
          { label: 'UTC+00:00 London', value: 'Europe/London' },
          { label: 'UTC+07:00 Jakarta', value: 'Asia/Jakarta' },
        ],
        required: true,
      },
      {
        name: 'authorizedContacts',
        label: 'Authorized contacts',
        description: 'Names remain editable while hidden IDs stay intact for submission.',
        type: 'array',
        arrayLayout: 'table',
        defaultValue: [
          { contactId: 'contact-001', contactName: 'Jane Smith' },
          { contactId: 'contact-002', contactName: 'John Appleseed' },
        ],
        fields: [
          {
            name: 'contactId',
            label: 'Contact ID',
            type: 'hidden',
            defaultValue: '',
          },
          {
            name: 'contactName',
            label: 'Name',
            type: 'text',
            placeholder: 'Alex Johnson',
            required: true,
          },
        ],
      },
    ],
  },
]

const SplitFormExample = () => {
  const form = useForm<SplitFormValues>({
    defaultValues: {
      userId: 'user-001',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      accountType: 'individual',
      companyName: '',
      address: {
        street: '123 Storybook Way',
        city: 'Componentville',
        zip: '90210',
      },
      marketingOptIn: true,
      newsletterTopics: ['product'],
      eventsWebhookUrl: '',
      preferredContactMethod: 'email',
      phoneNumber: '',
      smsOptIn: false,
      smsFrequency: undefined,
      complianceContactEmail: '',
      timezone: 'Asia/Jakarta',
      authorizedContacts: [
        { contactId: 'contact-001', contactName: 'Jane Smith' },
        { contactId: 'contact-002', contactName: 'John Appleseed' },
      ],
    },
    mode: 'onSubmit',
  })

  const logSubmit = useMemo(
    () =>
      form.handleSubmit((values) => {
        console.log('Story submit', values)
      }),
    [form],
  )

  return (
    <div className="space-y-6">
      <FormBuilder
        form={form}
        sections={generalInfoSections}
        onSubmit={async () => {
          /* handled by explicit button */
        }}
        showActions={false}
      />

      <FormBuilder
        form={form}
        sections={preferencesSections}
        onSubmit={async () => {
          /* handled by explicit button */
        }}
        customActions={(
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md"
            onClick={logSubmit}
          >
            Save all sections
          </button>
        )}
      />
    </div>
  )
}

const meta: Meta<typeof SplitFormExample> = {
  title: 'Kit/Builder/Form',
  component: SplitFormExample,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates sharing a single `react-hook-form` instance across multiple `FormBuilder` blocks using the new `form` prop.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof SplitFormExample>

export const SharedFormInstance: Story = {
  name: 'Shared form instance across sections',
  render: () => <SplitFormExample />,
}
