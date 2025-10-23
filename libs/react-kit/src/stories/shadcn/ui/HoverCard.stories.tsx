import type { Meta, StoryObj } from '@storybook/react';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '../../../shadcn/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../shadcn/ui/avatar';
import { Button } from '../../../shadcn/ui/button';

const meta: Meta<typeof HoverCard> = {
  title: 'Shadcn/UI/HoverCard',
  component: HoverCard,
};

export default meta;

type Story = StoryObj<typeof HoverCard>;

export const Basic: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="px-0">
          @shadcn
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">shadcn</h4>
            <p className="text-sm text-muted-foreground">
              Creator of shadcn/ui. Building beautiful, accessible components.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
