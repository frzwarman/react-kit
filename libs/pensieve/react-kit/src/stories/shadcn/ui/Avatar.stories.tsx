import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from '../../../shadcn/ui/avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Shadcn/UI/Avatar',
  component: Avatar,
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Basic: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="" alt="fallback" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  ),
};
