import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toggle } from '../../../shadcn/ui/toggle';
import { Bold, Italic, Underline } from 'lucide-react';

const meta: Meta<typeof Toggle> = {
  title: 'Shadcn/UI/Toggle',
  component: Toggle,
};

export default meta;

type Story = StoryObj<typeof Toggle>;

function ToggleDemo() {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(true);
  const [underline, setUnderline] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Toggle aria-label="Toggle bold" pressed={bold} onPressedChange={setBold}>
        <Bold />
      </Toggle>
      <Toggle
        aria-label="Toggle italic"
        pressed={italic}
        onPressedChange={setItalic}
      >
        <Italic />
      </Toggle>
      <Toggle
        aria-label="Toggle underline"
        pressed={underline}
        onPressedChange={setUnderline}
      >
        <Underline />
      </Toggle>
    </div>
  );
}

export const Basic: Story = {
  render: () => <ToggleDemo />,
};
