'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../../shadcn/lib/utils';
import { Button } from '../../../shadcn/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../shadcn/ui/popover';
import { Calendar } from '../../../shadcn/ui/calendar';

export interface DatePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Array<Date | { from: Date; to: Date }>;
  format?: (date: Date) => string;
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showFooter?: boolean;
  clearLabel?: string;
  closeLabel?: string;
}

function isBefore(date: Date, min?: Date) {
  return !!(
    min && date < new Date(min.getFullYear(), min.getMonth(), min.getDate())
  );
}

function isAfter(date: Date, max?: Date) {
  return !!(
    max && date > new Date(max.getFullYear(), max.getMonth(), max.getDate())
  );
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function inDisabled(
  date: Date,
  items?: Array<Date | { from: Date; to: Date }>,
) {
  if (!items || items.length === 0) return false;
  const d = startOfDay(date);
  for (const it of items) {
    if (it instanceof Date) {
      if (sameDay(d, it)) return true;
    } else if (it && 'from' in it && 'to' in it) {
      const from = startOfDay(it.from);
      const to = startOfDay(it.to);
      if (d >= from && d <= to) return true;
    }
  }
  return false;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled,
  minDate,
  maxDate,
  disabledDates,
  format,
  className,
  buttonVariant = 'outline',
  ...props
}: DatePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = typeof props.open === 'boolean' ? props.open : internalOpen;
  const setOpen = (o: boolean) =>
    props.onOpenChange ? props.onOpenChange(o) : setInternalOpen(o);

  const isDisabled = (date: Date) => {
    if (isBefore(date, minDate) || isAfter(date, maxDate)) return true;
    if (inDisabled(date, disabledDates)) return true;
    return false;
  };

  const label = value
    ? format
      ? format(value)
      : value.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        })
    : placeholder;

  return (
    <div className={cn('w-fit', className)} {...props}>
      <Popover open={isOpen} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            disabled={disabled}
            variant={buttonVariant}
            className={cn(
              'w-[240px] justify-start text-left font-normal',
              !value && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={(d) => {
              if (disabled) return;
              if (!d) {
                onChange?.(null);
                return;
              }
              if (isDisabled(d)) return;
              onChange?.(d);
              setOpen(false);
            }}
            defaultMonth={value ?? new Date()}
            disabled={isDisabled}
            buttonVariant="ghost"
            showOutsideDays
          />
          {(props.showFooter ?? true) && (
            <div className="flex items-center justify-between gap-2 p-2 border-t">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange?.(null)}
                disabled={disabled}
              >
                {props.clearLabel ?? 'Clear'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setOpen(false)}
              >
                {props.closeLabel ?? 'Close'}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

DatePicker.displayName = 'DatePicker';

export default DatePicker;
