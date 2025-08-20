import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from '../../../shadcn/ui/sonner';
import { toast } from 'sonner';
import { Button } from '../../../shadcn/ui/button';

const meta: Meta<typeof Toaster> = {
  title: 'Shadcn/UI/Sonner',
  component: Toaster,
};

export default meta;

type Story = StoryObj<typeof Toaster>;

export const Basic: Story = {
  render: () => (
    <div className="space-y-3">
      <Toaster richColors position="top-right" />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast('Hello from Sonner!')}>Default</Button>
        <Button variant="secondary" onClick={() => toast.success('Saved successfully')}>Success</Button>
        <Button variant="destructive" onClick={() => toast.error('Something went wrong')}>Error</Button>
        <Button
          variant="outline"
          onClick={() =>
            toast('Action required', {
              action: {
                label: 'Undo',
                onClick: () => toast('Undone'),
              },
            })
          }
        >
          With action
        </Button>
      </div>
    </div>
  ),
};
