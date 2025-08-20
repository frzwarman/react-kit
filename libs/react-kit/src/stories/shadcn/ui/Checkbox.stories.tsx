import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from '../../../shadcn/ui/checkbox';
import { Label } from '../../../shadcn/ui/label';

const meta: Meta<typeof Checkbox> = {
  title: 'Shadcn/UI/Checkbox',
  component: Checkbox,
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Basic: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="cursor-pointer">
        Accept terms and conditions
      </Label>
    </div>
  ),
};

function ControlledDemo() {
  const [checked, setChecked] = useState<boolean>(false);
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="controlled" checked={checked} onCheckedChange={(v) => setChecked(Boolean(v))} />
      <Label htmlFor="controlled">Controlled: {checked ? 'checked' : 'unchecked'}</Label>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

function IndeterminateDemo() {
  const [state, setState] = useState<true | false | 'indeterminate'>('indeterminate');
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="indeterminate"
        checked={state}
        onCheckedChange={(v) => setState(v as true | false | 'indeterminate')}
      />
      <Label htmlFor="indeterminate">Indeterminate</Label>
    </div>
  );
}

export const Indeterminate: Story = {
  render: () => <IndeterminateDemo />,
};
