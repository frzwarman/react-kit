import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { MonthRangePicker } from '../../../kit/components/monthpicker/MonthRangePicker';

const meta: Meta<typeof MonthRangePicker> = {
  title: 'Kit/Components/MonthRangePicker',
  component: MonthRangePicker,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof MonthRangePicker>;

export const Basic: Story = {
  name: 'Basic',
  render: () => {
    const [range, setRange] = React.useState<
      { start: Date; end: Date } | undefined
    >({
      start: new Date(new Date().getFullYear(), 0),
      end: new Date(new Date().getFullYear(), 11),
    });

    return (
      <div className="p-6 space-y-4">
        <div>
          <div className="text-sm text-muted-foreground">Selected range</div>
          <div className="font-medium">
            {range
              ? `${range.start.toLocaleString(undefined, { month: 'short', year: 'numeric' })} → ${range.end.toLocaleString(undefined, { month: 'short', year: 'numeric' })}`
              : '—'}
          </div>
        </div>
        <MonthRangePicker
          selectedMonthRange={range}
          onMonthRangeSelect={(r) => setRange(r)}
        />
      </div>
    );
  },
};

export const WithQuickSelectorsAndConstraints: Story = {
  name: 'With quick selectors + constraints',
  render: () => {
    const [range, setRange] = React.useState<
      { start: Date; end: Date } | undefined
    >();

    const now = new Date();
    const minDate = new Date(now.getFullYear() - 1, 0); // Jan last year
    const maxDate = new Date(now.getFullYear() + 1, 11); // Dec next year

    const customSelectors = [
      {
        label: 'This year',
        startMonth: new Date(now.getFullYear(), 0),
        endMonth: new Date(now.getFullYear(), 11),
      },
      {
        label: 'YTD',
        startMonth: new Date(now.getFullYear(), 0),
        endMonth: new Date(now.getFullYear(), now.getMonth()),
      },
      {
        label: 'Last 6 months',
        startMonth: new Date(
          now.getFullYear(),
          Math.max(0, now.getMonth() - 5),
        ),
        endMonth: new Date(now.getFullYear(), now.getMonth()),
      },
    ];

    return (
      <div className="p-6 space-y-4">
        <div>
          <div className="text-sm text-muted-foreground">Selected range</div>
          <div className="font-medium">
            {range
              ? `${range.start.toLocaleString(undefined, { month: 'short', year: 'numeric' })} → ${range.end.toLocaleString(undefined, { month: 'short', year: 'numeric' })}`
              : '—'}
          </div>
        </div>
        <MonthRangePicker
          selectedMonthRange={range}
          onMonthRangeSelect={(r) => setRange(r)}
          minDate={minDate}
          maxDate={maxDate}
          quickSelectors={customSelectors}
          showQuickSelectors
          callbacks={{ yearLabel: (y) => `${y}` }}
          variant={{
            calendar: { main: 'ghost', selected: 'default' },
            chevrons: 'outline',
          }}
        />
        <div className="text-xs text-muted-foreground">
          Allowed:{' '}
          {minDate.toLocaleString(undefined, {
            month: 'short',
            year: 'numeric',
          })}{' '}
          →{' '}
          {maxDate.toLocaleString(undefined, {
            month: 'short',
            year: 'numeric',
          })}
        </div>
      </div>
    );
  },
};
