import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Progress } from '../../../shadcn/ui/progress';

const meta: Meta<typeof Progress> = {
  title: 'Shadcn/UI/Progress',
  component: Progress,
};

export default meta;

type Story = StoryObj<typeof Progress>;

function ProgressDemo() {
  const [value, setValue] = useState(13);
  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 7)), 700);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="w-64 space-y-2">
      <Progress value={value} />
      <div className="text-sm text-muted-foreground">{value}%</div>
    </div>
  );
}

export const Basic: Story = {
  render: () => <ProgressDemo />,
};
