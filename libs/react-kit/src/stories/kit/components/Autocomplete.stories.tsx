import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Autocomplete,
  type AutocompleteProps,
} from '../../../kit/components/autocomplete/Autocomplete';
import type {
  AutocompleteOption,
  AutocompleteFetchResult,
} from '../../../kit/components/autocomplete/types';

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
    pageSize: 5,
    defaultOpen: false,
  } satisfies Partial<AutocompleteProps>,
  render: (args) => <Autocomplete {...args} />,
};

// Mock server fetcher
function makeServerFetcher(all: AutocompleteOption[], minLatency = 350) {
  return async ({
    search,
    page,
    pageSize,
  }: {
    search: string;
    page?: number;
    pageSize: number;
  }): Promise<AutocompleteFetchResult> => {
    const q = (search || '').toLowerCase();
    const resolvedPage = page ?? 1;
    const filtered = q
      ? all.filter((o) => o.label.toLowerCase().includes(q))
      : all;
    const start = (resolvedPage - 1) * pageSize;
    const slice = filtered.slice(start, start + pageSize);
    const hasMore = start + pageSize < filtered.length;
    await new Promise((r) => setTimeout(r, minLatency));
    return { items: slice, hasMore, nextCursor: null };
  };
}

const MANY_OPTIONS: AutocompleteOption[] = Array.from({ length: 100 }).map(
  (_, i) => ({
    label: `Option ${i + 1}`,
    value: i + 1,
  }),
);

export const ServerMode: Story = {
  name: 'Server mode (infinite scroll)',
  args: {
    mode: 'server',
    fetcher: makeServerFetcher(MANY_OPTIONS),
    placeholder: 'Pick an option...',
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
        <span className={selected ? 'font-medium' : undefined}>
          {option.label}
        </span>
      </div>
    ),
  } satisfies Partial<AutocompleteProps>,
  render: (args) => <Autocomplete {...args} />,
};

export const MultiSelectWithChips: Story = {
  name: 'Multi select with chips',
  args: {
    mode: 'client',
    options: CITY_OPTIONS,
    multiple: true,
    placeholder: 'Select cities...',
    chipVariant: 'secondary',
  } satisfies Partial<AutocompleteProps>,
  render: (args) => <Autocomplete {...args} />,
};

export const TaggingNoOptions: Story = {
  name: 'Tagging (no options)',
  args: {
    mode: 'client',
    options: [],
    multiple: true,
    allowCustomValue: true,
    placeholder: 'Type and press Enter to add tags',
    chipVariant: 'outline',
  } satisfies Partial<AutocompleteProps>,
  render: (args) => <Autocomplete {...args} />,
};

export const PreselectedSingle: Story = {
  name: 'Pre-selected (single)',
  args: {
    mode: 'client',
    options: CITY_OPTIONS,
    defaultValue: 'sf', // San Francisco
    placeholder: 'Select a city...',
  } satisfies Partial<AutocompleteProps>,
  render: (args) => <Autocomplete {...args} />,
};

export const PreselectedMultiple: Story = {
  name: 'Pre-selected (multiple)',
  args: {
    mode: 'client',
    options: CITY_OPTIONS,
    multiple: true,
    defaultValue: ['nyc', 'sf', 'chi'], // New York, San Francisco, Chicago
    placeholder: 'Select cities...',
    chipVariant: 'secondary',
  } satisfies Partial<AutocompleteProps>,
  render: (args) => <Autocomplete {...args} />,
};

function EditFormExample() {
  // Simulating loading user data from API
  const userData = {
    id: 1,
    name: 'John Doe',
    favoriteCity: 'la', // Los Angeles
    visitedCities: ['nyc', 'bos', 'den'], // New York, Boston, Denver
  };

  const [favoriteCity, setFavoriteCity] = useState(userData.favoriteCity);
  const [visitedCities, setVisitedCities] = useState(userData.visitedCities);

  return (
    <div className="space-y-6 max-w-md">
      <div className="rounded-lg border p-4 bg-card">
        <h3 className="font-semibold mb-4">Edit User Profile</h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="favoriteCity"
              className="text-sm font-medium mb-2 block"
            >
              Favorite City (Single Select)
            </label>
            <Autocomplete
              mode="client"
              options={CITY_OPTIONS}
              value={favoriteCity}
              onChange={(value) => setFavoriteCity(value as string)}
              placeholder="Select your favorite city..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Current: {favoriteCity}
            </p>
          </div>

          <div>
            <label
              htmlFor="visitedCities"
              className="text-sm font-medium mb-2 block"
            >
              Visited Cities (Multiple Select)
            </label>
            <Autocomplete
              mode="client"
              options={CITY_OPTIONS}
              multiple
              value={visitedCities}
              onChange={(value) => setVisitedCities(value as string[])}
              placeholder="Select cities you've visited..."
              chipVariant="secondary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Selected {visitedCities.length} cities
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          <span role="img" aria-label="lightbulb">
            💡
          </span>{' '}
          Notice: Labels are automatically populated from the options array
          without needing <code>initialSelectedOptions</code>
        </div>
      </div>
    </div>
  );
}

export const EditFormScenario: Story = {
  name: 'Edit form (controlled)',
  render: () => <EditFormExample />,
};

function ServerModeWithLoadSelectedExample() {
  // Simulate data from database/API (only IDs)
  const userPreferences = {
    selectedOptionIds: [5, 15, 25], // Only IDs, no labels
  };

  const [selectedIds, setSelectedIds] = useState(
    userPreferences.selectedOptionIds,
  );

  // Simulate fetcher that searches/paginates
  const serverFetcher = makeServerFetcher(MANY_OPTIONS, 500);

  // Function to load labels for selected IDs
  const loadSelectedLabels = async (ids: Array<string | number>) => {
    console.log('🔍 Loading labels for IDs:', ids);

    // Simulate API call to fetch specific items by IDs
    await new Promise((r) => setTimeout(r, 800));

    return MANY_OPTIONS.filter((opt) => ids.includes(opt.value));
  };

  return (
    <div className="space-y-6 max-w-md">
      <div className="rounded-lg border p-4 bg-card">
        <h3 className="font-semibold mb-2">Server Mode with loadSelected</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Pre-selected IDs: {selectedIds.join(', ')}
        </p>

        <Autocomplete
          mode="server"
          fetcher={serverFetcher}
          pageSize={10}
          multiple
          value={selectedIds}
          onChange={(value) => setSelectedIds(value as number[])}
          loadSelected={loadSelectedLabels}
          placeholder="Search options..."
          chipVariant="secondary"
        />

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            <span role="img" aria-label="info">
              ℹ️
            </span>{' '}
            How it works:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Component receives only IDs: [5, 15, 25]</li>
            <li>
              When dropdown opens, <code>loadSelected</code> is called
            </li>
            <li>Fetches labels from server and displays them</li>
            <li>Perfect for edit forms with server-side data</li>
          </ul>
        </div>

        <div className="mt-3 p-2 bg-muted rounded text-xs">
          <strong>Selected:</strong> {selectedIds.length} items
          <br />
          <strong>IDs:</strong> [{selectedIds.join(', ')}]
        </div>
      </div>
    </div>
  );
}

export const ServerModeWithLoadSelected: Story = {
  name: 'Server mode with loadSelected',
  render: () => <ServerModeWithLoadSelectedExample />,
};
