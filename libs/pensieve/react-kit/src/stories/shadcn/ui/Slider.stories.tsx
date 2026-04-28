import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '../../../shadcn/ui/slider';
import { Label } from '../../../shadcn/ui/label';

const meta: Meta<typeof Slider> = {
  title: 'Shadcn/UI/Slider',
  component: Slider,
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Basic: Story = {
  render: () => (
    <div className="w-[320px] grid gap-3">
      <Label htmlFor="volume">Volume</Label>
      <Slider id="volume" defaultValue={[50]} max={100} step={1} />
    </div>
  ),
};
