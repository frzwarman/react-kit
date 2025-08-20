import type { Meta, StoryObj } from '@storybook/react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '../../../shadcn/ui/sheet';
import { Button } from '../../../shadcn/ui/button';

const meta: Meta<typeof Sheet> = {
  title: 'Shadcn/UI/Sheet',
  component: Sheet,
};

export default meta;

type Story = StoryObj<typeof Sheet>;

export const Basic: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="p-4 text-sm text-muted-foreground">
          Put any content here. This panel slides from the right and can be closed via the X button.
        </div>
        <SheetFooter>
          <div className="flex gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
