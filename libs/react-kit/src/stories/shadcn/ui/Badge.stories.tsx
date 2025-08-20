import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../../shadcn/ui/badge';

const meta: Meta<typeof Badge> = {
  title: 'Shadcn/UI/Badge',
  component: Badge,
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Basic: Story = {
  args: {
    children: 'Badge',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};
