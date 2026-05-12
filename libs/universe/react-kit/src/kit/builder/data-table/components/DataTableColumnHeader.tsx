import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react';
import { cn } from '../../../../shadcn/lib/utils';
import { Button } from '../../../../shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../shadcn/ui/dropdown-menu';
import type { HTMLAttributes } from 'react';

export interface DataTableColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  label?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  label,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  label = (column.columnDef.meta as { label?: string })?.label ?? label;

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{label}</div>;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-8"
          >
            <span>{label}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : (
              <ChevronsUpDown className="ml-2 size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="mr-2 size-4" /> Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="mr-2 size-4" /> Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {column.getCanHide() && (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOff className="mr-2 size-4" /> Hide
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
