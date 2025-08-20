import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../kit/builder/data-table';

// Simple type for demo
interface Person {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => (
      <span className="inline-flex items-center rounded px-2 py-0.5 text-xs ring-1 ring-border">
        {String(getValue())}
      </span>
    ),
  },
];

const data: Person[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', status: 'active' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', status: 'inactive' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', status: 'active' },
];

const meta: Meta<typeof DataTable<Person, unknown>> = {
  title: 'Kit/Builder/DataTable',
  component: DataTable as unknown as React.FC<any>,
};
export default meta;

type Story = StoryObj<typeof DataTable<Person, unknown>>;

export const Basic: Story = {
  name: 'Basic',
  render: () => (
    <div className="max-w-3xl mx-auto p-6">
      <DataTable<Person, unknown>
        columns={columns}
        data={data}
        loading={false}
        emptyText="No people found."
      />
    </div>
  ),
};
