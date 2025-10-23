import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { MonthPicker } from '../../../kit/components/monthpicker/MonthPicker';

const meta: Meta<typeof MonthPicker> = {
  title: 'Kit/Components/MonthPicker',
  component: MonthPicker,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof MonthPicker>;

export const Basic: Story = {
  name: 'Basic',
  render: () => {
    const [selected, setSelected] = React.useState<Date | undefined>(
      new Date(),
    );

    return (
      <div className="p-6">
        <div className="mb-4">
          <div className="text-sm text-muted-foreground">Selected month</div>
          <div className="font-medium">
            {selected?.toLocaleString(undefined, {
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
        <MonthPicker
          selectedMonth={selected}
          onMonthSelect={(d) => setSelected(d)}
          callbacks={{
            yearLabel: (y) => `${y}`,
            monthLabel: (m) => m.name,
          }}
          variant={{
            calendar: { main: 'ghost', selected: 'default' },
            chevrons: 'outline',
          }}
        />
      </div>
    );
  },
};

export const WithConstraints: Story = {
  name: 'With constraints',
  render: () => {
    const [selected, setSelected] = React.useState<Date | undefined>(
      new Date(),
    );

    const now = new Date();
    const minDate = new Date(now.getFullYear(), 2); // Mar this year
    const maxDate = new Date(now.getFullYear(), 9); // Oct this year
    const disabledDates = [
      new Date(now.getFullYear(), 4), // May
      new Date(now.getFullYear(), 5), // Jun
    ];

    return (
      <div className="p-6 space-y-4">
        <div>
          <div className="text-sm text-muted-foreground">Selected month</div>
          <div className="font-medium">
            {selected?.toLocaleString(undefined, {
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
        <MonthPicker
          selectedMonth={selected}
          onMonthSelect={(d) => setSelected(d)}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
          callbacks={{ yearLabel: (y) => `FY ${y}`, monthLabel: (m) => m.name }}
          variant={{
            calendar: { main: 'ghost', selected: 'default' },
            chevrons: 'outline',
          }}
        />
        <div className="text-xs text-muted-foreground">
          Allowed months:{' '}
          {minDate.toLocaleString(undefined, { month: 'short' })} -{' '}
          {maxDate.toLocaleString(undefined, { month: 'short' })} (
          {minDate.getFullYear()})
        </div>
      </div>
    );
  },
};
