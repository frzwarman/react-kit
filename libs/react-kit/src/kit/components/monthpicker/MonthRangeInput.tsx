'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../../shadcn/lib/utils';
import { Button } from '../../../shadcn/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../../shadcn/ui/popover';
import { MonthRangePicker } from './MonthRangePicker';

export interface MonthRangeInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: { start?: Date | null; end?: Date | null } | null;
  onChange?: (range: { start?: Date | null; end?: Date | null } | null) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  // quick selectors panel
  showQuickSelectors?: boolean;
  // formatting
  format?: (start?: Date | null, end?: Date | null) => string;
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  popoverSide?: 'top' | 'right' | 'bottom' | 'left';
  // Footer
  showFooter?: boolean; // default true
  cancelLabel?: string; // default 'Cancel'
  applyLabel?: string; // default 'Apply'
}

export function MonthRangeInput({
  value,
  onChange,
  placeholder = 'Pick a month range',
  disabled,
  minDate,
  maxDate,
  showQuickSelectors = true,
  format,
  className,
  buttonVariant = 'outline',
  popoverSide,
  ...props
}: MonthRangeInputProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = typeof props.open === 'boolean' ? props.open : internalOpen;
  const setOpen = (o: boolean) => (props.onOpenChange ? props.onOpenChange(o) : setInternalOpen(o));
  const [draft, setDraft] = React.useState<{ start?: Date | null; end?: Date | null } | null>(value ?? null);

  React.useEffect(() => {
    if (isOpen) {
      setDraft(value ?? null);
    }
  }, [isOpen, value]);

  const label = ((): string => {
    const s = value?.start ?? null;
    const e = value?.end ?? null;
    if (format) return format(s, e);
    if (s && e) {
      const fmt = (d: Date) => d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
      return `${fmt(s)} – ${fmt(e)}`;
    }
    return placeholder;
  })();

  return (
    <div className={cn('w-fit', className)} {...props}>
      <Popover open={isOpen} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            disabled={disabled}
            variant={buttonVariant}
            className={cn('w-[280px] justify-start text-left font-normal', !value && 'text-muted-foreground')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-auto max-w-none" align="start" side={popoverSide}>
          <MonthRangePicker
            selectedMonthRange={draft?.start && draft?.end ? { start: draft.start, end: draft.end } : undefined}
            onStartMonthSelect={(d) => {
              if (disabled) return;
              setDraft({ start: d, end: d });
            }}
            onMonthRangeSelect={({ start, end }) => {
              if (disabled) return;
              setDraft({ start, end });
            }}
            minDate={minDate}
            maxDate={maxDate}
            showQuickSelectors={showQuickSelectors}
            variant={{
              calendar: { main: 'ghost', selected: 'default' },
              chevrons: 'outline',
            }}
          />
          {(props.showFooter ?? true) && (
            <div className="flex items-center justify-between gap-2 pt-2 border-t mt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={disabled}
              >
                {props.cancelLabel ?? 'Cancel'}
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
                {props.applyLabel ?? 'Apply'}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

MonthRangeInput.displayName = 'MonthRangeInput';

export default MonthRangeInput;
