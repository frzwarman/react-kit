import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../../kit/builder/data-table';
import { createSection, createField } from '../../../kit/builder/form';
import { toast } from 'sonner';

interface Order {
  id: string;
  customer: string;
  status: 'pending' | 'paid' | 'shipped';
  total: number;
}

const columns: ColumnDef<Order>[] = [
  { accessorKey: 'id', header: 'Order #' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'total', header: 'Total', cell: ({ getValue }) => `$${(getValue() as number).toFixed(2)}` },
];

const allData: Order[] = [
  { id: '1001', customer: 'Alice', status: 'pending', total: 120.4 },
  { id: '1002', customer: 'Bob', status: 'paid', total: 59.0 },
  { id: '1003', customer: 'Carol', status: 'shipped', total: 220.75 },
  { id: '1004', customer: 'Alice', status: 'paid', total: 18.0 },
  { id: '1005', customer: 'Dan', status: 'pending', total: 44.99 },
];

const filterSections = [
  createSection.card('Find orders', [
    createField.text('customer', 'Customer'),
    createField.select('status', 'Status', [
      { label: 'Any', value: null },
      { label: 'Pending', value: 'pending' },
      { label: 'Paid', value: 'paid' },
      { label: 'Shipped', value: 'shipped' },
    ]),
  ], { grid: { cols: 3 } }),
];

const meta: Meta<typeof DataTable<Order, unknown>> = {
  title: 'Kit/Builder/DataTable',
  component: DataTable as unknown as React.FC<any>,
};
export default meta;

type Story = StoryObj<typeof DataTable<Order, unknown>>;

export const WithFilters: Story = {
  name: 'With filters (FormBuilder)',
  render: () => {
    const [values, setValues] = useState<Record<string, unknown>>({});

    const filtered = allData.filter((o) => {
      const byCustomer = values.customer ? o.customer.toLowerCase().includes(String(values.customer).toLowerCase()) : true;
      const byStatus = values.status ? o.status === values.status : true;
      return byCustomer && byStatus;
    });

    return (
      <div className="max-w-5xl mx-auto p-6">
        <DataTable<Order, unknown>
          columns={columns}
          data={filtered}
          loading={false}
          columnVisibility
          formFilters={filterSections}
          formFilterValues={values}
          onFormFilterChange={setValues}
          actions={[{ key: 'export', label: 'Export', variant: 'outline', onClick: () => { toast.info('Export...') } }]}
        />
      </div>
    );
  },
};
