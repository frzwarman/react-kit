import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable, DataTableColumnHeader } from '../../../kit/builder/data-table';

interface Person {
  id: string;
  name: string;
  email: string;
  age: number;
}

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: 'age',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Age" />,
    cell: ({ getValue }) => <span className="tabular-nums">{getValue() as number}</span>,
  },
];

const data: Person[] = [
  { id: '1', name: 'Zara', email: 'zara@example.com', age: 29 },
  { id: '2', name: 'Mike', email: 'mike@example.com', age: 41 },
  { id: '3', name: 'Anna', email: 'anna@example.com', age: 22 },
  { id: '4', name: 'Ben', email: 'ben@example.com', age: 35 },
];

const meta: Meta<typeof DataTable<Person, unknown>> = {
  title: 'Kit/Builder/DataTable',
  component: DataTable as unknown as React.FC<any>,
};
export default meta;

type Story = StoryObj<typeof DataTable<Person, unknown>>;

export const WithSorting: Story = {
  name: 'With sorting',
  render: () => (
    <div className="max-w-4xl mx-auto p-6">
      <DataTable<Person, unknown>
        columns={columns}
        data={data}
        loading={false}
        sorting
      />
    </div>
  ),
};
