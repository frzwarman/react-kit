import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type Table as ReactTable,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { Loader2, RefreshCw } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../../shadcn/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../../shadcn/ui/accordion';
import { Button } from '../../../../shadcn/ui/button';
import { Checkbox } from '../../../../shadcn/ui/checkbox';
import { Skeleton } from '../../../../shadcn/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../shadcn/ui/table';
import { FormBuilder, type FormBuilderSectionConfig } from '../../form';
import type { DataTableAction, DataTableBatchAction, DataTableFiltersProp } from '../types';
import { DataTablePagination } from './DataTablePagination';
import { DataTableViewOptions } from './DataTableViewOptions';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Optional controlled states
  loading: boolean;
  sorting?: boolean;
  sortingState?: SortingState;
  onSortingChange?: (newState: SortingState) => void;
  columnFilters?: boolean;
  columnFiltersState?: ColumnFiltersState;
  onColumnFiltersChange?: (newState: ColumnFiltersState) => void;
  rowCount?: number;
  pagination?: boolean;
  paginationState?: PaginationState;
  paginationVariant?: 'full' | 'compact';
  onPaginationChange?: (newState: PaginationState) => void;
  columnVisibility?: boolean;
  columnVisibilityState?: VisibilityState;
  onColumnVisibilityChange?: (newState: VisibilityState) => void;
  // Expose table instance
  onTable?: (table: ReactTable<TData>) => void;
  // UI
  className?: string;
  emptyText?: string;
  // Filters UI (section-based or simple)
  formFilters?: DataTableFiltersProp;
  formFilterValues?: Record<string, unknown> | null;
  onFormFilterChange?: (values: Record<string, unknown>) => void;
  // Selection & Actions
  selectable?: boolean;
  actions?: DataTableAction[];
  batchActions?: DataTableBatchAction<TData>[];
  // Standard actions
  showStandardActions?: boolean;
  onRefresh?: () => void | Promise<void>;
  // Row interactions
  onRowClick?: (row: TData) => void;
  // Filters wrapper options
  filterWrapper?: 'accordion' | 'card' | 'none';
  filterTitle?: string;
  filterShowActionsSeparator?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
  sorting,
  sortingState,
  onSortingChange,
  columnFilters,
  columnFiltersState,
  onColumnFiltersChange,
  rowCount,
  pagination,
  paginationVariant = 'full',
  onPaginationChange,
  paginationState,
  columnVisibility,
  columnVisibilityState,
  onColumnVisibilityChange,
  onTable,
  className,
  emptyText = 'No results.',
  formFilters,
  formFilterValues,
  onFormFilterChange,
  selectable,
  actions,
  batchActions,
  showStandardActions,
  onRefresh,
  onRowClick,
  filterWrapper,
  filterTitle,
  filterShowActionsSeparator,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [internalSortingState, setInternalSortingState] = React.useState<SortingState>([]);
  const [internalFiltersState, setInternalFiltersState] = React.useState<ColumnFiltersState>([]);
  const [internalPaginationState, setInternalPaginationState] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [internalVisibilityState, setInternalVisibilityState] = React.useState<VisibilityState>({});

  const effectiveSortingState = sortingState ?? internalSortingState;
  const effectiveFiltersState = columnFiltersState ?? internalFiltersState;
  const effectiveVisibilityState = columnVisibilityState ?? internalVisibilityState;
  const effectivePaginationState = paginationState ?? internalPaginationState;

  const isPaginationEnabled = pagination;
  const isManualPaginationEnabled = paginationState !== undefined && onPaginationChange !== undefined;
  const isSortingEnabled = sorting;
  const isColumnFiltersEnabled = columnFilters;
  const isColumnVisibilityEnabled = columnVisibility;

  // Build selection-aware columns by injecting a selection column at the start
  const selectionColumn = React.useMemo<ColumnDef<TData, unknown>>(() => ({
    id: '__select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={val => table.toggleAllPageRowsSelected(!!val)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={val => row.toggleSelected(!!val)}
        aria-label="Select row"
        onClick={e => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 32,
    minSize: 32,
    maxSize: 32,
  }), []);

  const renderedColumns = React.useMemo(
    () => (selectable ? [selectionColumn as unknown as ColumnDef<TData, TValue>, ...columns] : columns),
    [selectable, selectionColumn, columns]
  );

  const table = useReactTable({
    data,
    columns: renderedColumns,
    initialState: {
      pagination: effectivePaginationState,
    },
    rowCount,
    state: {
      sorting: effectiveSortingState,
      columnFilters: effectiveFiltersState,
      pagination: effectivePaginationState,
      columnVisibility: effectiveVisibilityState,
      ...(selectable ? { rowSelection } : {}),
    },
    enableRowSelection: !!selectable,
    onRowSelectionChange: selectable ? setRowSelection : undefined,
    manualPagination: isManualPaginationEnabled,
    enableSorting: isSortingEnabled,
    enableColumnFilters: isColumnFiltersEnabled,
    onSortingChange: isSortingEnabled ? updater => {
      const next = typeof updater === 'function' ? (updater as (old: SortingState) => SortingState)(effectiveSortingState) : updater;
      setInternalSortingState(next);
      onSortingChange?.(next);
    } : undefined,
    onColumnFiltersChange: isColumnFiltersEnabled ? updater => {
      const next = typeof updater === 'function' ? (updater as (old: ColumnFiltersState) => ColumnFiltersState)(effectiveFiltersState) : updater;
      setInternalFiltersState(next);
      onColumnFiltersChange?.(next);
    } : undefined,
    onPaginationChange: isPaginationEnabled ? updater => {
      const next = typeof updater === 'function' ? (updater as (old: PaginationState) => PaginationState)(effectivePaginationState) : updater;
      setInternalPaginationState(next);
      onPaginationChange?.(next);
    } : undefined,
    onColumnVisibilityChange: updater => {
      const next = typeof updater === 'function' ? (updater as (old: VisibilityState) => VisibilityState)(effectiveVisibilityState) : updater;
      setInternalVisibilityState(next);
      onColumnVisibilityChange?.(next);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Notify parent of table instance
  React.useEffect(() => {
    if (onTable) onTable(table);
  }, [onTable, table]);

  // Selected rows convenience
  const selectedRows = table.getSelectedRowModel().rows.map(r => r.original as TData);

  // Safe action arrays to avoid array literal defaults in props
  const safeActions = React.useMemo(() => actions ?? [], [actions]);
  const safeBatchActions = React.useMemo(() => batchActions ?? [], [batchActions]);

  // Skeleton row keys (avoid using array index as key)
  const skeletonRowKeys = React.useMemo(
    () => Array.from({ length: Math.max(3, effectivePaginationState.pageSize ?? 10) }, () => Math.random().toString(36).slice(2)),
    [effectivePaginationState.pageSize]
  );

  // Standard actions state
  const handleRefresh = React.useCallback(async () => {
    if (!onRefresh) return;
    await onRefresh();
  }, [onRefresh]);

  // Render a button from action definition
  const renderActionButton = (action: DataTableAction, key: React.Key) => {
    if (action.element) return <React.Fragment key={key}>{action.element}</React.Fragment>;
    const content = (
      <div className="flex items-center gap-x-2">
        {action.icon && <span className={cn(action.iconPosition === 'right' ? 'order-last' : '')}>{action.icon}</span>}
        {action.label}
      </div>
    );
    return (
      <Button
        key={key}
        size="sm"
        variant={action.variant ?? 'default'}
        disabled={action.disabled}
        onClick={action.onClick}
        className="h-8"
      >
        {content}
      </Button>
    );
  };

  const renderBatchButton = (action: DataTableBatchAction<TData>, key: React.Key) => {
    if (action.element) return <React.Fragment key={key}>{action.element}</React.Fragment>;
    const onClick = () => action.onClick?.({ selectedRows, clearSelection: () => table.resetRowSelection() });
    const content = (
      <div className="flex items-center gap-x-2">
        {action.icon && <span className={cn(action.iconPosition === 'right' ? 'order-last' : '')}>{action.icon}</span>}
        {action.label}
      </div>
    );
    return (
      <Button
        key={key}
        size="sm"
        variant={action.variant ?? 'default'}
        disabled={action.disabled}
        onClick={onClick}
        className="h-8"
      >
        {content}
      </Button>
    );
  };

  // Defaults
  const effectiveFilterWrapper = filterWrapper ?? 'accordion';
  const effectiveFilterTitle = filterTitle ?? 'Filters';

  return (
    <div className={cn('space-y-3', className)}>
      {formFilters && formFilters.length ? (
        effectiveFilterWrapper === 'accordion' ? (
          <div className="rounded-md border border-border">
            <Accordion type="single" collapsible className="w-full" defaultValue="filters">
              <AccordionItem value="filters">
                <AccordionTrigger className="px-4 py-3 border-b border-border text-md">{effectiveFilterTitle}</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-5">
                  <FormBuilder
                    key={JSON.stringify(formFilterValues ?? {})}
                    sections={formFilters as FormBuilderSectionConfig[]}
                    defaultValues={formFilterValues}
                    onSubmit={data => onFormFilterChange?.(data as Record<string, unknown>)}
                    onReset={() => onFormFilterChange?.({})}
                    showActions
                    submitLabel="Apply"
                    resetLabel="Clear"
                    showActionsSeparator={filterShowActionsSeparator}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ) : effectiveFilterWrapper === 'card' ? (
          <div className="rounded-md border border-border p-4">
            <FormBuilder
              key={JSON.stringify(formFilterValues ?? {})}
              sections={formFilters as FormBuilderSectionConfig[]}
              defaultValues={formFilterValues}
              onSubmit={data => onFormFilterChange?.(data as Record<string, unknown>)}
              onReset={() => onFormFilterChange?.({})}
              showActions
              submitLabel="Apply"
              resetLabel="Clear"
              showActionsSeparator={filterShowActionsSeparator}
            />
          </div>
        ) : (
          <FormBuilder
            key={JSON.stringify(formFilterValues ?? {})}
            sections={formFilters as FormBuilderSectionConfig[]}
            defaultValues={formFilterValues}
            onSubmit={data => onFormFilterChange?.(data as Record<string, unknown>)}
            onReset={() => onFormFilterChange?.({})}
            showActions
            submitLabel="Apply"
            resetLabel="Clear"
            showActionsSeparator={filterShowActionsSeparator}
          />
        )
      ) : null}
      {/* Actions Bar */}
      {(safeActions.length || showStandardActions || (selectable && table.getSelectedRowModel().rows.length > 0 && safeBatchActions.length)) && (
        <div className="rounded-md p-2 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectable && table.getSelectedRowModel().rows.length > 0 && safeBatchActions.map((a) => renderBatchButton(a, a.key))}
            </div>
            <div className="flex items-center gap-2">
              {showStandardActions && onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="h-8"
                  title="Refresh"
                >
                  <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} /> Refresh
                </Button>
              )}
              {isColumnVisibilityEnabled ? (
                <DataTableViewOptions table={table} />
              ) : null}
              {safeActions.map((a) => renderActionButton(a, a.key))}
            </div>
          </div>
        </div>
      )}
      <div className="relative overflow-hidden rounded-md border border-border" aria-busy={loading || undefined}>
        {loading && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-end p-2">
            <span className="inline-flex items-center gap-2 rounded bg-background/80 px-2 py-1 text-xs shadow-sm ring-1 ring-border">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading...
            </span>
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              skeletonRowKeys.map((rowKey) => (
                <TableRow key={`skeleton-${rowKey}`}>
                  {table.getVisibleLeafColumns().map((col) => (
                    <TableCell key={`skeleton-cell-${rowKey}-${col.id}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(onRowClick && 'cursor-pointer hover:bg-muted/50')}
                  onClick={onRowClick ? () => onRowClick(row.original as TData) : undefined}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-24 text-center">
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isPaginationEnabled && (
        <DataTablePagination table={table} paginationVariant={paginationVariant} />
      )}
    </div>
  );
}
