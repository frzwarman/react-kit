import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { DatePicker } from '../../../kit/components/datepicker/DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Kit/Components/DatePicker',
  component: DatePicker,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Basic: Story = {
  name: 'Basic',
  render: () => {
    function Demo() {
      const [value, setValue] = React.useState<Date | null>(new Date());
      return (
        <div className="p-6 space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Selected date</div>
            <div className="font-medium">
              {value
                ? value.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  })
                : '—'}
            </div>
          </div>
          <DatePicker value={value} onChange={setValue} />
        </div>
      );
    }
    return <Demo />;
  },
};

export const WithConstraints: Story = {
  name: 'With constraints',
  render: () => {
    function Demo() {
      const [value, setValue] = React.useState<Date | null>(new Date());
      const now = new Date();
      const minDate = new Date(now.getFullYear(), now.getMonth(), 5);
      const maxDate = new Date(now.getFullYear(), now.getMonth(), 25);
      return (
        <div className="p-6 space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Selected date</div>
            <div className="font-medium">
              {value
                ? value.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  })
                : '—'}
            </div>
          </div>
          <DatePicker
            value={value}
            onChange={setValue}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const DisabledSingleDates: Story = {
  name: 'Disabled single dates',
  render: () => {
    function Demo() {
      const [value, setValue] = React.useState<Date | null>(new Date());
      const today = new Date();
      const d1 = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );
      const d2 = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
      );
      const d3 = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 7,
      );
      return (
        <div className="p-6 space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Selected date</div>
            <div className="font-medium">
              {value
                ? value.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  })
                : '—'}
            </div>
          </div>
          <DatePicker
            value={value}
            onChange={setValue}
            disabledDates={[d1, d2, d3]}
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const DisabledDateRanges: Story = {
  name: 'Disabled date ranges',
  render: () => {
    function Demo() {
      const [value, setValue] = React.useState<Date | null>(new Date());
      const base = new Date();
      const range1 = {
        from: new Date(base.getFullYear(), base.getMonth(), 10),
        to: new Date(base.getFullYear(), base.getMonth(), 15),
      };
      const range2 = {
        from: new Date(base.getFullYear(), base.getMonth(), 20),
        to: new Date(base.getFullYear(), base.getMonth(), 22),
      };
      return (
        <div className="p-6 space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Selected date</div>
            <div className="font-medium">
              {value
                ? value.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  })
                : '—'}
            </div>
          </div>
          <DatePicker
            value={value}
            onChange={setValue}
            disabledDates={[range1, range2]}
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const ControlledOpen: Story = {
  name: 'Controlled open + custom footer labels',
  render: () => {
    function Demo() {
      const [value, setValue] = React.useState<Date | null>(new Date());
      const [open, setOpen] = React.useState(false);
      return (
        <div className="p-6 space-y-4">
          <button
            type="button"
            className="underline text-sm"
            onClick={() => setOpen((o) => !o)}
          >
            Toggle popover
          </button>
          <DatePicker
            value={value}
            onChange={setValue}
            open={open}
            onOpenChange={setOpen}
            clearLabel="Reset"
            closeLabel="Done"
          />
        </div>
      );
    }
    return <Demo />;
  },
};
