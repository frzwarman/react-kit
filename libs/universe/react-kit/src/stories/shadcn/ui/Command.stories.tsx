import type { Meta, StoryObj } from '@storybook/react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '../../../shadcn/ui/command';

const meta: Meta<typeof Command> = {
  title: 'Shadcn/UI/Command',
  component: Command,
};

export default meta;

type Story = StoryObj<typeof Command>;

export const Basic: Story = {
  render: () => (
    <div className="max-w-md">
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              Calendar
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem>
              Search Emoji
              <CommandShortcut>⌘E</CommandShortcut>
            </CommandItem>
            <CommandItem>
              Calculator
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>Profile</CommandItem>
            <CommandItem>Billing</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};
