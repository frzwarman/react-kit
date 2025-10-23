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
import type { DateRange } from 'react-day-picker';

export interface DateRangePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: DateRange | null;
  onChange?: (range: DateRange | null) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Array<Date | { from: Date; to: Date }>;
  numberOfMonths?: number;
  format?: (from?: Date, to?: Date) => string;
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  popoverSide?: 'top' | 'right' | 'bottom' | 'left';
  // Footer and actions
  showFooter?: boolean; // default true
  cancelLabel?: string; // default 'Cancel'
  applyLabel?: string; // default 'Update'
  // Presets panel on the right
  presetsPanel?: boolean; // default true
  presets?: Array<{ id?: string; label: string; getRange: () => DateRange }>; // custom presets
  // Back-compat aliases (will be ignored if `presets` provided)
  showQuickSelectors?: boolean;
  quickSelectors?: Array<{ label: string; getRange: () => DateRange }>;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
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

function rangeContainsDisabled(
  from?: Date,
  to?: Date,
  items?: Array<Date | { from: Date; to: Date }>,
) {
  if (!from || !to) return false;
  if (!items || items.length === 0) return false;
  const a = startOfDay(from);
  const b = startOfDay(to);
  const start = a <= b ? a : b;
  const end = a <= b ? b : a;
  let cur = start;
  while (cur <= end) {
    if (inDisabled(cur, items)) return true;
    cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1);
  }
  return false;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pick a date range',
  disabled,
  minDate,
  maxDate,
  disabledDates,
  numberOfMonths = 2,
  format,
  className,
  buttonVariant = 'outline',
  ...props
}: DateRangePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = typeof props.open === 'boolean' ? props.open : internalOpen;
  const setOpen = (o: boolean) =>
    props.onOpenChange ? props.onOpenChange(o) : setInternalOpen(o);

  const isDisabled = (date: Date) => {
    if (isBefore(date, minDate) || isAfter(date, maxDate)) return true;
    if (inDisabled(date, disabledDates)) return true;
    return false;
  };

  const label = value?.from
    ? format
      ? format(value.from, value.to)
      : value.to
        ? `${value.from.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })} \t– ${value.to.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })}`
        : `${value.from.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })} \t– …`
    : placeholder;

  // Draft (apply mode) — selection applies when clicking Update
  const [draft, setDraft] = React.useState<DateRange | null>(value ?? null);
  // Sync draft when opening or when value changes while closed
  React.useEffect(() => {
    if (!isOpen) setDraft(value ?? null);
  }, [isOpen, value]);

  // Inputs state at the top
  const fmt = React.useCallback((d?: Date) => {
    if (!d) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd} / ${mm} / ${yyyy}`;
  }, []);
  const [fromInput, setFromInput] = React.useState<string>(fmt(value?.from));
  const [toInput, setToInput] = React.useState<string>(fmt(value?.to));
  const [fromTouched, setFromTouched] = React.useState(false);
  const [toTouched, setToTouched] = React.useState(false);
  React.useEffect(() => {
    setFromInput(fmt(draft?.from));
    setToInput(fmt(draft?.to));
  }, [draft, fmt]);

  // Input masking helpers (DD / MM / YYYY)
  const maskDate = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    const parts: string[] = [];
    const dd = digits.slice(0, Math.min(2, digits.length));
    if (dd) parts.push(dd);
    const mm =
      digits.length > 2 ? digits.slice(2, Math.min(4, digits.length)) : '';
    if (mm) parts.push(mm);
    const yyyy = digits.length > 4 ? digits.slice(4) : '';
    if (yyyy) parts.push(yyyy);
    return parts.join(' / ');
  };

  const parseMasked = (masked: string): Date | undefined => {
    const m = masked.match(/^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/);
    if (!m) return undefined;
    const dd = Number(m[1]);
    const mm = Number(m[2]);
    const yyyy = Number(m[3]);
    if (mm < 1 || mm > 12) return undefined;
    const lastDay = new Date(yyyy, mm, 0).getDate();
    if (dd < 1 || dd > lastDay) return undefined;
    const out = new Date(yyyy, mm - 1, dd);
    // bounds and disabled validation
    if (
      minDate &&
      out <
        new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    )
      return undefined;
    if (
      maxDate &&
      out >
        new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
    )
      return undefined;
    if (inDisabled(out, disabledDates)) return undefined;
    return out;
  };

  const onFromChange = (val: string) => {
    const masked = maskDate(val);
    setFromInput(masked);
  };
  const onToChange = (val: string) => {
    const masked = maskDate(val);
    setToInput(masked);
  };

  const fromParsed = parseMasked(fromInput);
  const toParsed = parseMasked(toInput);
  const fromInvalid = fromTouched && !!fromInput && !fromParsed;
  const toInvalid = toTouched && !!toInput && !toParsed;
  const mergedFrom = fromParsed ?? draft?.from ?? undefined;
  const mergedTo = toParsed ?? draft?.to ?? undefined;
  const invalidRange =
    !mergedFrom ||
    !mergedTo ||
    isDisabled(mergedFrom) ||
    isDisabled(mergedTo) ||
    mergedFrom > mergedTo ||
    rangeContainsDisabled(mergedFrom, mergedTo, disabledDates);

  const applyFromInput = () => {
    setFromTouched(true);
    if (!fromParsed) return;
    setDraft((prev) => ({ from: fromParsed, to: prev?.to }) as DateRange);
  };
  const applyToInput = () => {
    setToTouched(true);
    if (!toParsed) return;
    setDraft((prev) => ({ from: prev?.from, to: toParsed }) as DateRange);
  };

  // If current draft is invalid (e.g., starts on a disabled day), hide it from the calendar selection
  const draftInvalidForSelection =
    (!!draft?.from && isDisabled(draft.from)) ||
    (!!draft?.to && isDisabled(draft.to)) ||
    (!!draft?.from &&
      !!draft?.to &&
      rangeContainsDisabled(draft.from, draft.to, disabledDates));
  const selectedRange = draftInvalidForSelection
    ? undefined
    : (draft ?? undefined);

  // Helpers for presets
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const startOfWeek = (d: Date) => {
    const s = startOfDay(d);
    return new Date(s.getFullYear(), s.getMonth(), s.getDate() - s.getDay()); // Sunday start
  };
  const endOfWeek = (d: Date) => {
    const s = startOfWeek(d);
    return new Date(s.getFullYear(), s.getMonth(), s.getDate() + 6);
  };
  const clamp = (d: Date) => {
    let out = startOfDay(d);
    if (minDate && out < startOfDay(minDate)) out = startOfDay(minDate);
    if (maxDate && out > startOfDay(maxDate)) out = startOfDay(maxDate);
    return out;
  };
  const defaultPresets: Array<{ label: string; getRange: () => DateRange }> = [
    {
      label: 'Today',
      getRange: () => {
        const t = startOfDay(new Date());
        return { from: clamp(t), to: clamp(t) };
      },
    },
    {
      label: 'Yesterday',
      getRange: () => {
        const t = startOfDay(new Date());
        const y = new Date(t);
        y.setDate(t.getDate() - 1);
        return { from: clamp(y), to: clamp(y) };
      },
    },
    {
      label: 'Last 7 days',
      getRange: () => {
        const end = startOfDay(new Date());
        const start = new Date(end);
        start.setDate(end.getDate() - 6);
        return { from: clamp(start), to: clamp(end) };
      },
    },
    {
      label: 'Last 14 days',
      getRange: () => {
        const end = startOfDay(new Date());
        const start = new Date(end);
        start.setDate(end.getDate() - 13);
        return { from: clamp(start), to: clamp(end) };
      },
    },
    {
      label: 'Last 30 days',
      getRange: () => {
        const end = startOfDay(new Date());
        const start = new Date(end);
        start.setDate(end.getDate() - 29);
        return { from: clamp(start), to: clamp(end) };
      },
    },
    {
      label: 'This Week',
      getRange: () => {
        const now = new Date();
        return { from: clamp(startOfWeek(now)), to: clamp(endOfWeek(now)) };
      },
    },
    {
      label: 'Last Week',
      getRange: () => {
        const now = new Date();
        const last = new Date(now);
        last.setDate(now.getDate() - 7);
        return { from: clamp(startOfWeek(last)), to: clamp(endOfWeek(last)) };
      },
    },
    {
      label: 'This Month',
      getRange: () => {
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth(), 1);
        const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { from: clamp(from), to: clamp(to) };
      },
    },
    {
      label: 'Last Month',
      getRange: () => {
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const to = new Date(now.getFullYear(), now.getMonth(), 0);
        return { from: clamp(from), to: clamp(to) };
      },
    },
  ];
  const presets: Array<{ label: string; getRange: () => DateRange }> = (
    props.presets ??
    props.quickSelectors ??
    defaultPresets
  ).filter(Boolean);

  const eqRange = (a?: DateRange | null, b?: DateRange | null) => {
    if (!a?.from || !a?.to || !b?.from || !b?.to) return false;
    return sameDay(a.from, b.from) && sameDay(a.to, b.to);
  };

  return (
    <div className={cn('w-fit', className)} {...props}>
      <Popover open={isOpen} onOpenChange={(o) => !disabled && setOpen(o)}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            disabled={disabled}
            variant={buttonVariant}
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !value?.from && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-4"
          align="start"
          side={props.popoverSide ?? 'bottom'}
          sideOffset={8}
        >
          <div className="flex gap-6 min-w-[900px]">
            <div className="flex-1 pr-2">
              {/* Inputs */}
              <div className="flex items-center justify-center gap-2 mb-4 rounded-md border border-input bg-background/50 px-2 py-1 w-fit mx-auto">
                <input
                  type="text"
                  inputMode="numeric"
                  value={fromInput}
                  onChange={(e) => onFromChange(e.target.value)}
                  onBlur={applyFromInput}
                  placeholder="dd/mm/yyyy"
                  className={cn(
                    'h-9 w-40 rounded-md border bg-background px-3 text-sm shadow-xs outline-hidden',
                    fromInvalid
                      ? 'border-destructive ring-1 ring-destructive/50'
                      : 'border-input',
                  )}
                />
                <span className="text-muted-foreground">–</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={toInput}
                  onChange={(e) => onToChange(e.target.value)}
                  onBlur={applyToInput}
                  placeholder="dd/mm/yyyy"
                  className={cn(
                    'h-9 w-40 rounded-md border bg-background px-3 text-sm shadow-xs outline-hidden',
                    toInvalid
                      ? 'border-destructive ring-1 ring-destructive/50'
                      : 'border-input',
                  )}
                />
              </div>
              {/* Calendar */}
              <Calendar
                mode="range"
                numberOfMonths={numberOfMonths}
                selected={selectedRange}
                onSelect={(range) => {
                  if (disabled) return;
                  if (!range) {
                    setDraft(null);
                    return;
                  }
                  const { from, to } = range;
                  // If user attempts to start on a disabled day, ignore (DayPicker typically prevents this already)
                  if (from && isDisabled(from)) {
                    setDraft(null);
                    return;
                  }
                  if (to && isDisabled(to)) {
                    setDraft({ from, to: undefined });
                    return;
                  }
                  // If the selected span contains any disabled date, reset selection
                  if (
                    from &&
                    to &&
                    rangeContainsDisabled(from, to, disabledDates)
                  ) {
                    setDraft(null);
                    setFromTouched(true);
                    setToTouched(true);
                    setFromInput('');
                    setToInput('');
                    return;
                  }
                  setDraft(range);
                  // sync inputs
                  setFromTouched(false);
                  setToTouched(false);
                  setFromInput(fmt(from));
                  setToInput(fmt(to));
                }}
                defaultMonth={selectedRange?.from ?? value?.from ?? new Date()}
                disabled={isDisabled}
                buttonVariant="ghost"
                showOutsideDays
              />
            </div>
            {(props.presetsPanel ?? true) && presets.length > 0 && (
              <div className="w-64 border-l pl-4 max-h-[420px] overflow-auto">
                <div className="flex flex-col gap-1">
                  {presets.map((p) => {
                    const pr = p.getRange();
                    const active = eqRange(draft, pr);
                    return (
                      <Button
                        key={p.label}
                        type="button"
                        size="sm"
                        variant={active ? 'secondary' : 'ghost'}
                        className="justify-between w-full"
                        onClick={() => {
                          // Ignore presets that include disabled dates
                          if (
                            rangeContainsDisabled(pr.from, pr.to, disabledDates)
                          )
                            return;
                          setDraft(pr);
                          setFromTouched(false);
                          setToTouched(false);
                          setFromInput(fmt(pr.from));
                          setToInput(fmt(pr.to));
                        }}
                      >
                        {p.label}
                        {active ? '✓' : ''}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {(props.showFooter ?? true) && (
            <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setDraft(value ?? null);
                  setOpen(false);
                }}
              >
                {props.cancelLabel ?? 'Cancel'}
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  if (invalidRange || !mergedFrom || !mergedTo) return;
                  onChange?.({ from: mergedFrom, to: mergedTo });
                  setOpen(false);
                }}
                disabled={disabled || invalidRange}
              >
                {props.applyLabel ?? 'Update'}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

DateRangePicker.displayName = 'DateRangePicker';

export default DateRangePicker;
