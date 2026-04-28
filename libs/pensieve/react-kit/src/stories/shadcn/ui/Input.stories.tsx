import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../../shadcn/ui/input';
import { Label } from '../../../shadcn/ui/label';

const meta: Meta<typeof Input> = {
  title: 'Shadcn/UI/Input',
  component: Input,
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Basic: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="m@example.com" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-2">
      <Label htmlFor="disabled">Disabled</Label>
      <Input id="disabled" placeholder="Can't type here" disabled />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="relative w-[280px]">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
        @
      </span>
      <Input className="pl-8" placeholder="username" />
    </div>
  ),
};
