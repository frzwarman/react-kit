import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from '../../../shadcn/ui/switch';

const meta: Meta<typeof Switch> = {
  title: 'Shadcn/UI/Switch',
  component: Switch,
};

export default meta;

type Story = StoryObj<typeof Switch>;

function SwitchDemo() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <Switch checked={enabled} onCheckedChange={setEnabled} id="demo-switch" />
      <label htmlFor="demo-switch" className="text-sm">
        {enabled ? 'Enabled' : 'Disabled'}
      </label>
    </div>
  );
}

export const Basic: Story = {
  render: () => <SwitchDemo />,
};
