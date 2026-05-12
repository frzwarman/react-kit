import type { Meta, StoryObj } from '@storybook/react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../../../shadcn/ui/collapsible';
import { Button } from '../../../shadcn/ui/button';

const meta: Meta<typeof Collapsible> = {
  title: 'Shadcn/UI/Collapsible',
  component: Collapsible,
};

export default meta;

type Story = StoryObj<typeof Collapsible>;

export const Basic: Story = {
  render: () => (
    <Collapsible className="w-[320px]">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full">
          Toggle Details
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="text-sm text-muted-foreground mt-2 space-y-2">
          <p>
            Collapsible content can contain any elements. This example shows a
            simple paragraph that expands and collapses.
          </p>
          <p>
            It uses uncontrolled state managed by Radix. No React hooks are
            needed in the story.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};
