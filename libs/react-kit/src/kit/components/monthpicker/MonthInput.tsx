'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../../shadcn/lib/utils';
import { Button } from '../../../shadcn/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../../shadcn/ui/popover';
import { MonthPicker } from './MonthPicker';

export interface MonthInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  format?: (date: Date) => string;
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showFooter?: boolean; // default true
  cancelLabel?: string; // default 'Cancel'
  applyLabel?: string; // default 'Apply'
  // Back-compat aliases
  clearLabel?: string;
  closeLabel?: string;
}

export function MonthInput({
  value,
  onChange,
  placeholder = 'Pick a month',
  disabled,
  minDate,
  maxDate,
  disabledDates,
  format,
  className,
  buttonVariant = 'outline',
  ...props
}: MonthInputProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = typeof props.open === 'boolean' ? props.open : internalOpen;
  const setOpen = (o: boolean) => (props.onOpenChange ? props.onOpenChange(o) : setInternalOpen(o));
  const [draft, setDraft] = React.useState<Date | null>(value ?? null);

  React.useEffect(() => {
    if (isOpen) {
      // Reset draft when opening to current value
      setDraft(value ?? null);
    }
  }, [isOpen, value]);

  const label = value
    ? format
      ? format(value)
      : value.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
    : placeholder;

  return (
    <div className={cn('w-fit', className)} {...props}>
      <Popover open={isOpen} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            disabled={disabled}
            variant={buttonVariant}
            className={cn('w-[240px] justify-start text-left font-normal', !value && 'text-muted-foreground')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <MonthPicker
            selectedMonth={draft ?? undefined}
            onMonthSelect={(d) => {
              if (disabled) return;
              setDraft(d ?? null);
            }}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            variant={{
              calendar: { main: 'ghost', selected: 'default' },
              chevrons: 'outline',
            }}
          />
          {(props.showFooter ?? true) && (
            <div className="flex items-center justify-between gap-2 p-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={disabled}
              >
                {props.cancelLabel ?? props.clearLabel ?? 'Cancel'}
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => {
                  onChange?.(draft ?? null);
                  setOpen(false);
                }}
              >
                {props.applyLabel ?? props.closeLabel ?? 'Apply'}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

MonthInput.displayName = 'MonthInput';

export default MonthInput;
