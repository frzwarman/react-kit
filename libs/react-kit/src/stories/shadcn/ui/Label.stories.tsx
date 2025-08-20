import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '../../../shadcn/ui/label';
import { Input } from '../../../shadcn/ui/input';

const meta: Meta<typeof Label> = {
  title: 'Shadcn/UI/Label',
  component: Label,
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Basic: Story = {
  render: () => (
    <div className="grid gap-3 w-[320px]">
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="disabled" className="group" data-disabled>
          Disabled input
        </Label>
        <Input id="disabled" placeholder="Disabled" disabled />
      </div>
    </div>
  ),
};
