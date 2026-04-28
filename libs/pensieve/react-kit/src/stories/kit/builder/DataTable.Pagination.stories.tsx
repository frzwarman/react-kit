import type React from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../kit/builder/data-table';

interface Person {
  id: string;
  name: string;
  email: string;
}

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
];

const data: Person[] = Array.from({ length: 48 }, (_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
}));

const meta: Meta<typeof DataTable<Person, unknown>> = {
  title: 'Kit/Builder/DataTable',
  component: DataTable as unknown as React.FC<any>,
};
export default meta;

type Story = StoryObj<typeof DataTable<Person, unknown>>;

export const WithClientPagination: Story = {
  name: 'With pagination (client)',
  render: () => (
    <div className="max-w-4xl mx-auto p-6">
      <DataTable<Person, unknown>
        columns={columns}
        data={data}
        loading={false}
        pagination
      />
    </div>
  ),
};

export const WithControlledPagination: Story = {
  name: 'With pagination (controlled/server-like)',
  render: () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const slice = data.slice(start, end);

    return (
      <div className="max-w-4xl mx-auto p-6">
        <DataTable<Person, unknown>
          columns={columns}
          data={slice}
          loading={false}
          pagination
          rowCount={data.length}
          paginationState={{ pageIndex, pageSize }}
          onPaginationChange={(next) => {
            setPageIndex(next.pageIndex);
            setPageSize(next.pageSize);
          }}
        />
      </div>
    );
  },
};
