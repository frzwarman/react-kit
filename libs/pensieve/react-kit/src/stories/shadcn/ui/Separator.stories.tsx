import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '../../../shadcn/ui/separator';

const meta: Meta<typeof Separator> = {
  title: 'Shadcn/UI/Separator',
  component: Separator,
};

export default meta;

type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <div className="text-sm font-medium leading-none">Radix Primitives</div>
      <Separator className="my-2" />
      <div className="text-sm text-muted-foreground">
        An open-source UI component library.
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-10 items-center space-x-4 text-sm">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  ),
};
