import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../../../shadcn/ui/popover';
import { Button } from '../../../shadcn/ui/button';

const meta: Meta<typeof Popover> = {
  title: 'Shadcn/UI/Popover',
  component: Popover,
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Dimensions</h4>
          <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

function ControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button onClick={() => setOpen((o) => !o)} variant="default">
          {open ? 'Close' : 'Open'} popover
        </Button>
      </PopoverTrigger>
      <PopoverContent>Controlled popover content</PopoverContent>
    </Popover>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
