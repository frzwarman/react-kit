import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../../../shadcn/ui/textarea';
import { Label } from '../../../shadcn/ui/label';

const meta: Meta<typeof Textarea> = {
  title: 'Shadcn/UI/Textarea',
  component: Textarea,
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Basic: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-2">
      <Label htmlFor="message">Your message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" placeholder="Tell us a little about yourself" />
      <p className="text-sm text-muted-foreground">Your bio will be displayed on your profile.</p>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="disabled-textarea">Disabled</Label>
      <Textarea id="disabled-textarea" placeholder="Can't type here" disabled />
    </div>
  ),
};
