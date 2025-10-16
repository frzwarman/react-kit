import type { Meta, StoryObj } from '@storybook/react'
import { FormBuilder } from '../../../kit/builder/form/components/FormBuilder'
import { type FormBuilderProps } from '../../../kit/builder/form/types'

const meta: Meta<typeof FormBuilder> = {
  title: 'Kit/Builder/Form',
  component: FormBuilder,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
}

export default meta

type Story = StoryObj<typeof FormBuilder>

const CITY_OPTIONS = [
  { label: 'New York', value: 'nyc' },
  { label: 'San Francisco', value: 'sf' },
  { label: 'Los Angeles', value: 'la' },
  { label: 'Seattle', value: 'sea' },
  { label: 'Austin', value: 'aus' },
  { label: 'Chicago', value: 'chi' },
  { label: 'Miami', value: 'mia' },
  { label: 'Boston', value: 'bos' },
  { label: 'Denver', value: 'den' },
  { label: 'Portland', value: 'pdx' },
]

export const SingleAutocomplete: Story = {
  name: 'Autocomplete - Single select (clearable + custom allowed)',
  args: {
    sections: [
      {
        title: 'Destination',
        variant: 'card',
        layout: 'grid',
        grid: { cols: 1, mdCols: 2, gap: 'gap-4' },
        fields: [
          {
            name: 'city',
            label: 'City',
            type: 'autocomplete',
            placeholder: 'Select a city...',
            autocompleteMode: 'client',
            options: CITY_OPTIONS,
            clearable: true,
            allowCustomValue: true,
          },
        ],
      },
    ],
    onSubmit: (data: unknown) => {
      console.log('Submit (single):', data)
    },
    showActions: true,
  } satisfies Partial<FormBuilderProps>,
  render: (args) => (
    <div className="max-w-3xl mx-auto p-6">
      <FormBuilder {...(args as FormBuilderProps)} />
    </div>
  ),
}

// ---- Server edit page (prefilled IDs -> fetch labels) ----
const ALL_SERVER_OPTIONS = Array.from({ length: 100 }).map((_, i) => ({
  label: `Server Option ${i + 1}`,
  value: i + 1,
}));

function makeServerFetcher(all = ALL_SERVER_OPTIONS, minLatency = 250) {
  return async ({ search, page = 1, pageSize = 10 }: { search: string; page?: number; pageSize: number; }) => {
    const q = (search || '').toLowerCase();
    const filtered = q ? all.filter(o => o.label.toLowerCase().includes(q)) : all;
    const start = (page - 1) * pageSize;
    const slice = filtered.slice(start, start + pageSize);
    const hasMore = start + pageSize < filtered.length;
    await new Promise(r => setTimeout(r, minLatency));
    return { items: slice, hasMore, nextCursor: null };
  };
}

async function loadSelectedByIds(values: Array<string | number>) {
  // Simulate server lookup for labels by ID
  await new Promise(r => setTimeout(r, 150));
  const nums = values.map(v => (typeof v === 'string' ? Number(v) : v));
  return ALL_SERVER_OPTIONS.filter(o => nums.includes(o.value));
}

export const ServerEditPrefilledByIds: Story = {
  name: 'Autocomplete - Server edit page (prefilled IDs)',
  args: {
    sections: [
      {
        title: 'Server Field (Edit)',
        variant: 'card',
        layout: 'grid',
        grid: { cols: 1, mdCols: 2, gap: 'gap-4' },
        fields: [
          {
            name: 'cities',
            label: 'Cities',
            type: 'autocomplete',
            autocompleteMode: 'server',
            fetcher: makeServerFetcher(),
            // No local options; labels are not yet known for current values
            options: [],
            pageSize: 10,
            multiple: true,
            clearable: true,
            chipVariant: 'secondary',
            // Provide resolver to fetch labels for the current values
            loadSelected: loadSelectedByIds,
            // Pre-seed labels so chips render labels immediately on load
            initialSelectedOptions: ALL_SERVER_OPTIONS.filter(o => [2, 5, 17].includes(o.value)),
          },
        ],
      },
    ],
    // Simulate edit page: IDs persisted in DB without labels
    defaultValues: {
      cities: [2, 5, 17],
    },
    onSubmit: (data: unknown) => {
      console.log('Submit (server edit):', data)
    },
    showActions: true,
  } satisfies Partial<FormBuilderProps>,
  render: (args) => (
    <div className="max-w-3xl mx-auto p-6">
      <FormBuilder {...(args as FormBuilderProps)} />
    </div>
  ),
}

export const MultiAutocompleteChips: Story = {
  name: 'Autocomplete - Multi select with chips',
  args: {
    sections: [
      {
        title: 'Destinations',
        variant: 'card',
        layout: 'grid',
        grid: { cols: 1, mdCols: 2, gap: 'gap-4' },
        fields: [
          {
            name: 'cities',
            label: 'Cities',
            type: 'autocomplete',
            placeholder: 'Select cities...',
            autocompleteMode: 'client',
            options: CITY_OPTIONS,
            multiple: true,
            clearable: true,
            chipVariant: 'secondary',
          },
        ],
      },
    ],
    onSubmit: (data: unknown) => {
      console.log('Submit (multi):', data)
    },
    showActions: true,
  } satisfies Partial<FormBuilderProps>,
  render: (args) => (
    <div className="max-w-3xl mx-auto p-6">
      <FormBuilder {...(args as FormBuilderProps)} />
    </div>
  ),
}

export const TaggingAutocomplete: Story = {
  name: 'Autocomplete - Tagging (no options, custom values)',
  args: {
    sections: [
      {
        title: 'Tags',
        variant: 'card',
        layout: 'grid',
        grid: { cols: 1, mdCols: 2, gap: 'gap-4' },
        fields: [
          {
            name: 'tags',
            label: 'Tags',
            type: 'autocomplete',
            placeholder: 'Type and press Enter to add tags',
            autocompleteMode: 'client',
            options: [],
            multiple: true,
            allowCustomValue: true,
            clearable: true,
            chipVariant: 'outline',
          },
        ],
      },
    ],
    onSubmit: (data: unknown) => {
      console.log('Submit (tagging):', data)
    },
    showActions: true,
  } satisfies Partial<FormBuilderProps>,
  render: (args) => (
    <div className="max-w-3xl mx-auto p-6">
      <FormBuilder {...(args as FormBuilderProps)} />
    </div>
  ),
}
