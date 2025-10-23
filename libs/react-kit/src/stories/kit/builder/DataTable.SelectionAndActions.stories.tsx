import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Trash2, Plus } from 'lucide-react';
import { DataTable } from '../../../kit/builder/data-table';
import { toast } from 'sonner';

interface Item {
  id: string;
  name: string;
  price: number;
}

const columns: ColumnDef<Item>[] = [
  { accessorKey: 'name', header: 'Item' },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ getValue }) => (
      <span className="tabular-nums">${(getValue() as number).toFixed(2)}</span>
    ),
  },
];

const data: Item[] = [
  { id: '1', name: 'Keyboard', price: 49.99 },
  { id: '2', name: 'Mouse', price: 24.5 },
  { id: '3', name: 'Headset', price: 79.0 },
  { id: '4', name: 'Monitor', price: 199.0 },
];

const meta: Meta<typeof DataTable<Item, unknown>> = {
  title: 'Kit/Builder/DataTable',
  component: DataTable as unknown as React.FC<any>,
};
export default meta;

type Story = StoryObj<typeof DataTable<Item, unknown>>;

export const SelectableWithActions: Story = {
  name: 'Selectable + actions',
  render: () => (
    <div className="max-w-4xl mx-auto p-6">
      <DataTable<Item, unknown>
        columns={columns}
        data={data}
        loading={false}
        selectable
        showStandardActions
        onRefresh={() => new Promise((r) => setTimeout(r, 800))}
        actions={[
          {
            key: 'create',
            label: 'New Item',
            icon: <Plus className="h-4 w-4" />,
            variant: 'outline',
            onClick: () => {
              toast.info('Create clicked');
            },
          },
        ]}
        batchActions={[
          {
            key: 'delete',
            label: 'Delete Selected',
            icon: <Trash2 className="h-4 w-4" />,
            variant: 'destructive',
            onClick: async ({ selectedRows, clearSelection }) => {
              toast.info(`Would delete ${selectedRows.length} items`);
              clearSelection();
            },
          },
        ]}
      />
    </div>
  ),
};
