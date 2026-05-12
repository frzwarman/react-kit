import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from '../../../shadcn/ui/scroll-area';

const meta: Meta<typeof ScrollArea> = {
  title: 'Shadcn/UI/ScrollArea',
  component: ScrollArea,
};

export default meta;

type Story = StoryObj<typeof ScrollArea>;

const TAGS: string[] = [
  'nextjs',
  'shadcn',
  'tailwind',
  'radix',
  'react',
  'storybook',
  'vitest',
  'nx',
  'pnpm',
  'zod',
  'react-hook-form',
  'recharts',
  'lucide',
  'ui',
  'forms',
  'charts',
  'table',
  'sidebar',
  'dialog',
  'wizard',
  'pagination',
  'filtering',
  'sorting',
  'layout',
  'accessibility',
  'aria',
  'dark-mode',
  'light-mode',
  'themes',
  'components',
  'hooks',
  'state',
  'routing',
  'graphql',
  'rest',
  'cache',
  'testing',
  'automation',
  'ci',
  'cd',
  'lint',
  'format',
  'prettier',
  'eslint',
  'typescript',
  'javascript',
  'css',
  'html',
  'design-system',
  'docs',
  'examples',
];

export const Default: Story = {
  render: () => (
    <div className="h-[225px] w-[350px] rounded-md border">
      <ScrollArea className="h-full w-full rounded-md p-4">
        <div className="space-y-4">
          <h4 className="text-sm font-medium leading-none">Tags</h4>
          <div className="space-y-2">
            {TAGS.map((tag) => (
              <div key={tag} className="text-sm text-muted-foreground">
                #{tag}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  ),
};
