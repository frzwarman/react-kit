import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TimePicker } from '../../../kit/components/timepicker/TimePicker';

const meta: Meta<typeof TimePicker> = {
  title: 'Kit/Components/TimePicker',
  component: TimePicker,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof TimePicker>;

export const Basic: Story = {
  name: 'Basic (HH:mm, 24h)',
  args: {
    precision: 'minute',
    hourCycle: 24,
  },
  render: (args) => {
    const [value, setValue] = React.useState<Date | null>(new Date());

    return (
      <div className="p-6 space-y-4">
        <div>
          <div className="text-sm text-muted-foreground">Selected</div>
          <div className="font-medium">
            {value?.toLocaleTimeString?.() ?? '—'}
          </div>
        </div>
        <TimePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const HourOnly12h: Story = {
  name: 'Hour only (12h)',
  args: {
    precision: 'hour',
    hourCycle: 12,
  },
  render: (args) => {
    const [value, setValue] = React.useState<Date | null>(new Date());
    return (
      <div className="p-6 space-y-4">
        <TimePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const WithSeconds: Story = {
  name: 'With seconds (HH:mm:ss, 24h)',
  args: {
    precision: 'second',
    hourCycle: 24,
  },
  render: (args) => {
    const [value, setValue] = React.useState<Date | null>(new Date());
    return (
      <div className="p-6 space-y-4">
        <TimePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};
