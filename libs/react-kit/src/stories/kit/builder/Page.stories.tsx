import type { Meta, StoryObj } from '@storybook/react';
import { Page, type PageAction } from '../../../kit/builder/page';
import { Button } from '../../../shadcn/ui/button';
import { Plus, Download, MoreHorizontal, RefreshCw, Trash2 } from 'lucide-react';

const meta: Meta<typeof Page> = {
  title: 'kit/Builder/Page',
  component: Page,
};

export default meta;

type Story = StoryObj<typeof Page>;

export const Basic: Story = {
  name: 'Basic',
  render: () => (
    <Page title="Orders" subtitle="Manage and review customer orders" containerWidth="lg">
      <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
        Page content goes here.
      </div>
    </Page>
  ),
};

export const WithActions: Story = {
  name: 'With actions',
  render: () => {
    const actions: PageAction[] = [
      {
        type: 'button',
        label: 'New Order',
        variant: 'default',
        leftIcon: <Plus className="h-4 w-4" />,
        onClick: () => console.log('new'),
      },
      {
        type: 'button',
        label: 'Export',
        variant: 'outline',
        leftIcon: <Download className="h-4 w-4" />,
        onClick: () => console.log('export'),
      },
      {
        type: 'dropdown',
        trigger: {
          label: 'More',
          variant: 'ghost',
          leftIcon: <MoreHorizontal className="h-4 w-4" />,
        },
        items: [
          { label: 'Refresh', leftIcon: <RefreshCw className="h-4 w-4" />, onSelect: () => console.log('refresh') },
          { type: 'separator' },
          { label: 'Delete selected', leftIcon: <Trash2 className="h-4 w-4" />, destructive: true, onSelect: () => console.log('delete') },
        ],
      },
    ];

    return (
      <Page title="Orders" subtitle="Manage and review customer orders" actions={actions} containerWidth="xl">
        <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
          Content with actions.
        </div>
      </Page>
    );
  },
};

export const WithFooter: Story = {
  name: 'With footer',
  render: () => (
    <Page
      title="Settings"
      subtitle="Configure your workspace"
      containerWidth="md"
      footerLeft={<span className="text-xs">Last updated 2 hours ago</span>}
      footerRight={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => console.log('cancel')}>Cancel</Button>
          <Button onClick={() => console.log('save')}>Save changes</Button>
        </div>
      }
    >
      <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
        Settings content here.
      </div>
    </Page>
  ),
};
