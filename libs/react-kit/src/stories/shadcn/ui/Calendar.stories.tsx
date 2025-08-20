import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Calendar } from '../../../shadcn/ui/calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Shadcn/UI/Calendar',
  component: Calendar,
};

export default meta;

type Story = StoryObj<typeof Calendar>;

function CalendarSingleStory() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <div className="p-2">
      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
      <div className="text-sm text-muted-foreground mt-2">
        Selected: {date ? date.toDateString() : '—'}
      </div>
    </div>
  );
}

export const Single: Story = {
  render: () => <CalendarSingleStory />,
};
