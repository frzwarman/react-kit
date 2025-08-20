import type { Meta, StoryObj } from '@storybook/react';
import { Autocomplete, type AutocompleteProps } from '../../../kit/components/autocomplete/Autocomplete';
import type { AutocompleteOption, AutocompleteFetchResult } from '../../../kit/components/autocomplete/types';

const meta: Meta<typeof Autocomplete> = {
  title: 'Kit/Components/Autocomplete',
  component: Autocomplete,
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['client', 'server'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Autocomplete>;

// Client-side options
const CITY_OPTIONS: AutocompleteOption[] = [
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
];

export const ClientMode: Story = {
  name: 'Client mode',
  args: {
    mode: 'client',
    options: CITY_OPTIONS,
    placeholder: 'Select a city...',
    searchPlaceholder: 'Search cities...',
    pageSize: 5,
    defaultOpen: false,
  } satisfies Partial<AutocompleteProps>,
  render: (args) => <Autocomplete {...args} />,
};

// Mock server fetcher
function makeServerFetcher(all: AutocompleteOption[], minLatency = 350) {
  return async ({ search, page, pageSize }: {
    search: string;
    page?: number;
    pageSize: number;
  }): Promise<AutocompleteFetchResult> => {
    const q = (search || '').toLowerCase();
    const resolvedPage = page ?? 1;
    const filtered = q ? all.filter(o => o.label.toLowerCase().includes(q)) : all;
    const start = (resolvedPage - 1) * pageSize;
    const slice = filtered.slice(start, start + pageSize);
    const hasMore = start + pageSize < filtered.length;
    await new Promise(r => setTimeout(r, minLatency));
    return { items: slice, hasMore, nextCursor: null };
  };
}

const MANY_OPTIONS: AutocompleteOption[] = Array.from({ length: 100 }).map((_, i) => ({
  label: `Option ${i + 1}`,
  value: i + 1,
}));

export const ServerMode: Story = {
  name: 'Server mode (infinite scroll)',
  args: {
    mode: 'server',
    fetcher: makeServerFetcher(MANY_OPTIONS),
    placeholder: 'Pick an option...',
    searchPlaceholder: 'Search options...',
    pageSize: 10,
  } satisfies Partial<AutocompleteProps>,
  render: (args) => <Autocomplete {...args} />,
};

export const CustomRender: Story = {
  name: 'Custom option rendering',
  args: {
    mode: 'client',
    options: CITY_OPTIONS,
    renderOption: (option, selected) => (
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-primary" />
        <span className={selected ? 'font-medium' : undefined}>{option.label}</span>
      </div>
    ),
  } satisfies Partial<AutocompleteProps>,
  render: (args) => <Autocomplete {...args} />,
};
