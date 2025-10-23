import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '../../../shadcn/ui/table';
import { Input } from '../../../shadcn/ui/input';
import { Button } from '../../../shadcn/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../../../shadcn/ui/select';
import { Checkbox } from '../../../shadcn/ui/checkbox';

const meta: Meta<typeof Table> = {
  title: 'Shadcn/UI/Table',
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Basic: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell>$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>INV002</TableCell>
          <TableCell>Processing</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell>$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell>$350.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

type Invoice = {
  id: string;
  status: 'Paid' | 'Processing' | 'Unpaid';
  method: 'Credit Card' | 'PayPal' | 'Bank Transfer';
  amount: number; // cents
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

const SAMPLE_DATA: Invoice[] = [
  { id: 'INV001', status: 'Paid', method: 'Credit Card', amount: 25000 },
  { id: 'INV002', status: 'Processing', method: 'PayPal', amount: 15000 },
  { id: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: 35000 },
  { id: 'INV004', status: 'Paid', method: 'Credit Card', amount: 12000 },
  { id: 'INV005', status: 'Unpaid', method: 'PayPal', amount: 9800 },
  {
    id: 'INV006',
    status: 'Processing',
    method: 'Bank Transfer',
    amount: 44000,
  },
  { id: 'INV007', status: 'Paid', method: 'Credit Card', amount: 199900 },
  { id: 'INV008', status: 'Processing', method: 'PayPal', amount: 5600 },
  { id: 'INV009', status: 'Unpaid', method: 'Credit Card', amount: 7600 },
  { id: 'INV010', status: 'Paid', method: 'Bank Transfer', amount: 87500 },
];

type SortKey = keyof Pick<Invoice, 'id' | 'status' | 'method' | 'amount'>;
type SortDir = 'asc' | 'desc';

function useSortedFilteredPagedData(
  data: Invoice[],
  opts: {
    sortKey: SortKey | null;
    sortDir: SortDir;
    query: string;
    status: 'all' | Invoice['status'];
    page: number;
    pageSize: number;
  },
) {
  const filtered = useMemo(() => {
    const q = opts.query.trim().toLowerCase();
    return data.filter((row) => {
      const matchesQuery = q
        ? row.id.toLowerCase().includes(q) ||
          row.method.toLowerCase().includes(q)
        : true;
      const matchesStatus =
        opts.status === 'all' ? true : row.status === opts.status;
      return matchesQuery && matchesStatus;
    });
  }, [data, opts.query, opts.status]);

  const sorted = useMemo(() => {
    if (!opts.sortKey) return filtered;
    const sortedCopy = [...filtered].sort((a, b) => {
      const key = opts.sortKey as SortKey;
      const av = a[key];
      const bv = b[key];
      if (typeof av === 'number' && typeof bv === 'number') return av - bv;
      return String(av).localeCompare(String(bv));
    });
    return opts.sortDir === 'asc' ? sortedCopy : sortedCopy.reverse();
  }, [filtered, opts.sortDir, opts.sortKey]);

  const total = sorted.length;
  const start = opts.page * opts.pageSize;
  const end = start + opts.pageSize;
  const pageRows = sorted.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(total / opts.pageSize));

  return { rows: pageRows, total, totalPages };
}

type StatusFilter = 'all' | Invoice['status'];

function TableAdvancedDemo() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey | null>('id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { rows, total, totalPages } = useSortedFilteredPagedData(SAMPLE_DATA, {
    sortKey,
    sortDir,
    query,
    status,
    page,
    pageSize,
  });

  function onSort(nextKey: SortKey) {
    setPage(0);
    setSortKey((prev) => {
      if (prev !== nextKey) {
        setSortDir('asc');
        return nextKey;
      }
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      return prev;
    });
  }

  // Selection helpers
  const pageIds = rows.map((r) => r.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const somePageSelected =
    pageIds.some((id) => selected.has(id)) && !allPageSelected;
  function toggleAllOnPage(checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) {
        pageIds.forEach((id) => next.add(id));
      } else {
        pageIds.forEach((id) => next.delete(id));
      }
      return next;
    });
  }
  function toggleOne(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search invoice or method..."
          value={query}
          onChange={(e) => {
            setPage(0);
            setQuery(e.target.value);
          }}
          className="w-60"
        />
        <Select
          value={status}
          onValueChange={(v) => {
            setPage(0);
            setStatus(v as StatusFilter);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => {
            setPage(0);
            setPageSize(parseInt(v, 10));
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 / page</SelectItem>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="20">20 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2 text-sm">
          <div>
            <strong>{selected.size}</strong> selected
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setSelected(new Set())}>
              Clear selection
            </Button>
            <Button variant="default">Bulk action</Button>
          </div>
        </div>
      )}

      <Table>
        <TableCaption>Invoices ({total} total)</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={somePageSelected ? 'indeterminate' : allPageSelected}
                onCheckedChange={(v) =>
                  toggleAllOnPage(v === 'indeterminate' ? true : Boolean(v))
                }
                aria-label="Select all on page"
              />
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort('id')}>
                Invoice {sortKey === 'id' && (sortDir === 'asc' ? '▲' : '▼')}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort('status')}>
                Status {sortKey === 'status' && (sortDir === 'asc' ? '▲' : '▼')}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort('method')}>
                Method {sortKey === 'method' && (sortDir === 'asc' ? '▲' : '▼')}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" onClick={() => onSort('amount')}>
                Amount {sortKey === 'amount' && (sortDir === 'asc' ? '▲' : '▼')}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="w-10">
                <Checkbox
                  checked={selected.has(row.id)}
                  onCheckedChange={(v) => toggleOne(row.id, Boolean(v))}
                  aria-label={`Select ${row.id}`}
                />
              </TableCell>
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.method}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(row.amount)}
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No results
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          Page {page + 1} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(0)}
            disabled={page === 0}
          >
            « First
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            ‹ Prev
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next ›
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(totalPages - 1)}
            disabled={page >= totalPages - 1}
          >
            Last »
          </Button>
        </div>
      </div>
    </div>
  );
}

export const WithSortingFilteringPagination: Story = {
  render: () => <TableAdvancedDemo />,
};
