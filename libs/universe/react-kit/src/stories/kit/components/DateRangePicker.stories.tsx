import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { DateRangePicker } from '../../../kit/components/datepicker/DateRangePicker';
import type { DateRange } from 'react-day-picker';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Kit/Components/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof DateRangePicker>;

export const Basic: Story = {
  name: 'Basic',
  render: () => {
    function Demo() {
      const [value, setValue] = React.useState<DateRange | null>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
      });
      return (
        <div className="p-6 space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Selected range</div>
            <div className="font-medium">
              {value?.from
                ? `${value.from.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })} \t– ${value?.to?.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }) ?? '…'}`
                : '—'}
            </div>
          </div>
          <DateRangePicker value={value} onChange={setValue} />
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
      const [value, setValue] = React.useState<DateRange | null>(null);
      return (
        <div className="p-6 space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Selected range</div>
            <div className="font-medium">
              {value?.from
                ? `${value.from.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })} \t– ${value?.to?.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }) ?? '…'}`
                : '—'}
            </div>
          </div>
          <DateRangePicker
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
      const base = new Date();
      const range1 = {
        from: new Date(base.getFullYear(), base.getMonth(), 10),
        to: new Date(base.getFullYear(), base.getMonth(), 15),
      };
      const range2 = {
        from: new Date(base.getFullYear(), base.getMonth(), 20),
        to: new Date(base.getFullYear(), base.getMonth(), 22),
      };
      const [value, setValue] = React.useState<DateRange | null>({
        from: range1.from,
        to: range1.from,
      });
      return (
        <div className="p-6 space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Selected range</div>
            <div className="font-medium">
              {value?.from
                ? `${value.from.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })} \t– ${value?.to?.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }) ?? '…'}`
                : '—'}
            </div>
          </div>
          <DateRangePicker
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

export const WithConstraints: Story = {
  name: 'With constraints',
  render: () => {
    function Demo() {
      const now = new Date();
      const minDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const maxDate = new Date(now.getFullYear(), now.getMonth(), 28);
      const [value, setValue] = React.useState<DateRange | null>({
        from: minDate,
        to: maxDate,
      });
      return (
        <div className="p-6 space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Selected range</div>
            <div className="font-medium">
              {value?.from
                ? `${value.from.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })} \t– ${value?.to?.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }) ?? '…'}`
                : '—'}
            </div>
          </div>
          <DateRangePicker
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

export const PresetsPanelApplyMode: Story = {
  name: 'Presets panel + apply mode',
  render: () => {
    function Demo() {
      const now = new Date();
      const [value, setValue] = React.useState<DateRange | null>({
        from: new Date(now.getFullYear(), now.getMonth(), 1),
        to: new Date(now.getFullYear(), now.getMonth(), 1),
      });
      const [open, setOpen] = React.useState<boolean>(false);
      return (
        <div className="p-6 space-y-4">
          <button
            type="button"
            className="underline text-sm"
            onClick={() => setOpen((o) => !o)}
          >
            Toggle popover
          </button>
          <DateRangePicker
            value={value}
            onChange={setValue}
            open={open}
            onOpenChange={setOpen}
            presetsPanel
            numberOfMonths={2}
            cancelLabel="Cancel"
            applyLabel="Update"
          />
        </div>
      );
    }
    return <Demo />;
  },
};
