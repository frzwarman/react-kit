import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../shadcn/ui/select';
import { Label } from '../../../shadcn/ui/label';

const meta: Meta<typeof Select> = {
  title: 'Shadcn/UI/Select',
  component: Select,
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Basic: Story = {
  render: () => (
    <div className="grid w-[240px] gap-2">
      <Label htmlFor="select">Theme</Label>
      <Select>
        <SelectTrigger id="select">
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

function ControlledDemo() {
  const [value, setValue] = useState<string>('system');
  return (
    <div className="grid w-[240px] gap-2">
      <Label>Controlled</Label>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </Select>
      <div className="text-sm text-muted-foreground">Selected: {value}</div>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
