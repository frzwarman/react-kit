'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../../shadcn/lib/utils';
import { Button } from '../../../shadcn/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../../shadcn/ui/popover';
import { Calendar } from '../../../shadcn/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shadcn/ui/select';

export type TimePrecision = 'hour' | 'minute' | 'second';

export interface DateTimeRangeValue {
  from?: Date | null;
  to?: Date | null;
}

export interface DateTimeRangePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: DateTimeRangeValue | null;
  onChange?: (range: DateTimeRangeValue | null) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Array<Date | { from: Date; to: Date }>;
  numberOfMonths?: number;
  popoverSide?: 'top' | 'right' | 'bottom' | 'left';
  // time config
  timePrecision?: TimePrecision; // default 'minute'
  hourCycle?: 12 | 24; // default 24
  minuteStep?: number; // default 5
  secondStep?: number; // default 5
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showFooter?: boolean; // default true
  cancelLabel?: string; // default 'Cancel'
  applyLabel?: string; // default 'Apply'
  clearLabel?: string; // default 'Clear'
  contentClassName?: string; // custom classes for the inner content container
}

const pad2 = (n: number) => String(n).padStart(2, '0');
function startOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function sameDay(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function isBefore(date: Date, min?: Date) { return !!(min && date < startOfDay(min)); }
function isAfter(date: Date, max?: Date) { return !!(max && date > startOfDay(max)); }
function inDisabled(date: Date, items?: Array<Date | { from: Date; to: Date }>) {
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
function rangeContainsDisabled(from?: Date, to?: Date, items?: Array<Date | { from: Date; to: Date }>) {
  if (!from || !to) return false;
  if (!items || items.length === 0) return false;
  const a = startOfDay(from); const b = startOfDay(to);
  const start = a <= b ? a : b; const end = a <= b ? b : a;
  let cur = start;
  while (cur <= end) {
    if (inDisabled(cur, items)) return true;
    cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1);
  }
  return false;
}

function TimeSelectors({
  label,
  value,
  onChange,
  precision,
  hourCycle,
  minuteStep,
  secondStep,
  disabled,
  compact,
}: {
  label: string;
  value: Date | null | undefined;
  onChange: (val: Date | null) => void;
  precision: TimePrecision;
  hourCycle: 12 | 24;
  minuteStep: number;
  secondStep: number;
  disabled?: boolean;
  compact?: boolean;
}) {
  const hours = React.useMemo(() => (hourCycle === 12 ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 24 }, (_, i) => i)), [hourCycle]);
  const minutes = React.useMemo(() => Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep), [minuteStep]);
  const seconds = React.useMemo(() => Array.from({ length: Math.ceil(60 / secondStep) }, (_, i) => i * secondStep), [secondStep]);
  const selectedHour = React.useMemo(() => {
    if (!value) return hourCycle === 12 ? 12 : 0;
    const h = value.getHours();
    return hourCycle === 12 ? (h % 12 === 0 ? 12 : h % 12) : h;
  }, [value, hourCycle]);
  const selectedMinute = value?.getMinutes() ?? 0;
  const selectedSecond = value?.getSeconds() ?? 0;
  const selectedPeriod: 'AM' | 'PM' = value && value.getHours() >= 12 ? 'PM' : 'AM';

  const setPart = (part: 'hour' | 'minute' | 'second' | 'period', v: number | 'AM' | 'PM') => {
    const base = value
      ? new Date(value)
      : (() => {
          const n = new Date();
          return new Date(n.getFullYear(), n.getMonth(), n.getDate(), 0, 0, 0, 0);
        })();
    if (part === 'hour') {
      let h = Number(v);
      if (hourCycle === 12) {
        const isPM = base.getHours() >= 12;
        h = h % 12;
        base.setHours(isPM ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h));
      } else {
        base.setHours(h);
      }
    } else if (part === 'minute') {
      base.setMinutes(Number(v));
    } else if (part === 'second') {
      base.setSeconds(Number(v));
    } else if (part === 'period' && (v === 'AM' || v === 'PM')) {
      const curH = base.getHours();
      const isAMNow = curH < 12;
      if (v === 'AM' && !isAMNow) base.setHours(curH - 12);
      if (v === 'PM' && isAMNow) base.setHours(curH + 12);
    }
    base.setMilliseconds(0);
    onChange(base);
  };

  const widthClass = compact ? 'w-16' : 'w-24';
  return (
    <div className={compact ? '' : 'space-y-1'}>
      {!compact && <div className="text-xs text-muted-foreground">{label}</div>}
      <div className="flex items-end gap-2">
        <div className={widthClass}>
          {!compact && <div className="mb-1 block text-xs text-muted-foreground">Hour</div>}
          <Select disabled={disabled} value={String(selectedHour)} onValueChange={(v) => setPart('hour', Number(v))}>
            <SelectTrigger aria-label={`${label} hour`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hours.map((h) => (
                <SelectItem key={h} value={String(h)}>{hourCycle === 12 ? h : pad2(h)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {(precision === 'minute' || precision === 'second') && (
          <div className={widthClass}>
            {!compact && <div className="mb-1 block text-xs text-muted-foreground">Minute</div>}
            <Select disabled={disabled} value={String(selectedMinute - (selectedMinute % minuteStep))} onValueChange={(v) => setPart('minute', Number(v))}>
              <SelectTrigger aria-label={`${label} minute`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {minutes.map((m) => (
                  <SelectItem key={m} value={String(m)}>{pad2(m)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {precision === 'second' && (
          <div className={widthClass}>
            {!compact && <div className="mb-1 block text-xs text-muted-foreground">Second</div>}
            <Select disabled={disabled} value={String(selectedSecond - (selectedSecond % secondStep))} onValueChange={(v) => setPart('second', Number(v))}>
              <SelectTrigger aria-label={`${label} second`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {seconds.map((s) => (
                  <SelectItem key={s} value={String(s)}>{pad2(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {hourCycle === 12 && (
          <div className={widthClass}>
            {!compact && <div className="mb-1 block text-xs text-muted-foreground">Period</div>}
            <Select disabled={disabled} value={selectedPeriod} onValueChange={(v) => setPart('period', v as 'AM' | 'PM')}>
              <SelectTrigger aria-label={`${label} period`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}

export function DateTimeRangePicker({
  value,
  onChange,
  placeholder = 'Pick a date & time range',
  disabled,
  minDate,
  maxDate,
  disabledDates,
  numberOfMonths = 2,
  popoverSide,
  timePrecision = 'minute',
  hourCycle = 24,
  minuteStep = 5,
  secondStep = 5,
  className,
  buttonVariant = 'outline',
  contentClassName,
  ...props
}: DateTimeRangePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = typeof props.open === 'boolean' ? props.open : internalOpen;
  const setOpen = (o: boolean) => (props.onOpenChange ? props.onOpenChange(o) : setInternalOpen(o));
  const [draft, setDraft] = React.useState<DateTimeRangeValue | null>(value ?? null);

  React.useEffect(() => {
    if (isOpen) setDraft(value ?? null);
  }, [isOpen, value]);

  const fmtTime = React.useCallback((d?: Date | null) => {
    if (!d) return '';
    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    return hourCycle === 12
      ? `${((h % 12) || 12)}:${pad2(m)}${timePrecision === 'second' ? `:${pad2(s)}` : ''} ${h >= 12 ? 'PM' : 'AM'}`
      : `${pad2(h)}:${pad2(m)}${timePrecision === 'second' ? `:${pad2(s)}` : ''}`;
  }, [hourCycle, timePrecision]);

  const label = React.useMemo(() => {
    const f = draft?.from ?? value?.from ?? null;
    const t = draft?.to ?? value?.to ?? null;
    if (f && t) {
      const fd = f.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
      const td = t.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
      return `${fd} ${fmtTime(f)} – ${td} ${fmtTime(t)}`;
    }
    return placeholder;
  }, [draft, value, placeholder, fmtTime]);

  // Date inputs and parsing (DD / MM / YYYY)
  const fmtDate = React.useCallback((d?: Date | null) => {
    if (!d) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd} / ${mm} / ${yyyy}`;
  }, []);
  const [fromInput, setFromInput] = React.useState<string>(fmtDate(draft?.from ?? value?.from ?? null));
  const [toInput, setToInput] = React.useState<string>(fmtDate(draft?.to ?? value?.to ?? null));
  React.useEffect(() => {
    if (isOpen) {
      setFromInput(fmtDate(value?.from ?? null));
      setToInput(fmtDate(value?.to ?? null));
    }
  }, [isOpen, value, fmtDate]);
  const maskDate = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    const parts: string[] = [];
    const dd = digits.slice(0, Math.min(2, digits.length)); if (dd) parts.push(dd);
    const mm = digits.length > 2 ? digits.slice(2, Math.min(4, digits.length)) : ''; if (mm) parts.push(mm);
    const yyyy = digits.length > 4 ? digits.slice(4) : ''; if (yyyy) parts.push(yyyy);
    return parts.join(' / ');
  };
  const parseMasked = (masked: string): Date | undefined => {
    const m = masked.match(/^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/);
    if (!m) return undefined;
    const dd = Number(m[1]); const mm = Number(m[2]); const yyyy = Number(m[3]);
    if (mm < 1 || mm > 12) return undefined;
    const lastDay = new Date(yyyy, mm, 0).getDate();
    if (dd < 1 || dd > lastDay) return undefined;
    const out = new Date(yyyy, mm - 1, dd);
    if (isBefore(out, minDate) || isAfter(out, maxDate) || inDisabled(out, disabledDates)) return undefined;
    return out;
  };
  const fromParsed = parseMasked(fromInput);
  const toParsed = parseMasked(toInput);
  const mergedFrom = React.useMemo(() => {
    if (fromParsed) {
      const base = draft?.from ?? value?.from ?? null;
      if (base) {
        return new Date(
          fromParsed.getFullYear(),
          fromParsed.getMonth(),
          fromParsed.getDate(),
          base.getHours(),
          base.getMinutes(),
          base.getSeconds()
        );
      }
      return fromParsed;
    }
    return draft?.from ?? undefined;
  }, [fromParsed, draft, value]);
  const mergedTo = React.useMemo(() => {
    if (toParsed) {
      const base = draft?.to ?? value?.to ?? null;
      if (base) {
        return new Date(
          toParsed.getFullYear(),
          toParsed.getMonth(),
          toParsed.getDate(),
          base.getHours(),
          base.getMinutes(),
          base.getSeconds()
        );
      }
      return toParsed;
    }
    return draft?.to ?? undefined;
  }, [toParsed, draft, value]);
  const invalidRange = !mergedFrom || !mergedTo || isBefore(mergedFrom, minDate) || isAfter(mergedTo, maxDate) || mergedFrom > mergedTo || rangeContainsDisabled(mergedFrom, mergedTo, disabledDates);

  return (
    <div className={cn('w-fit', className)} {...props}>
      <Popover open={isOpen} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" disabled={disabled} variant={buttonVariant} className={cn('w-[360px] justify-start text-left font-normal', !value && 'text-muted-foreground')}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto max-w-none p-4" align="start" side={popoverSide ?? 'bottom'} sideOffset={8}>
          <div className={cn('w-fit min-w-0', contentClassName)}>
            {/* Header row: date inputs with inline time selectors beside each */}
            <div className="mb-3 rounded-md border border-input bg-background/50 px-3 py-2">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex items-end gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={fromInput}
                    onChange={(e) => setFromInput(maskDate(e.target.value))}
                    onBlur={() => {
                      const p = parseMasked(fromInput);
                      if (p) {
                        const prev = draft?.from ?? null;
                        const withTime = new Date(
                          p.getFullYear(),
                          p.getMonth(),
                          p.getDate(),
                          prev ? prev.getHours() : 0,
                          prev ? prev.getMinutes() : 0,
                          prev ? prev.getSeconds() : 0
                        );
                        setDraft((d) => ({ ...(d ?? {}), from: withTime }));
                      }
                    }}
                    placeholder="dd/mm/yyyy"
                    className="h-9 w-40 rounded-md border bg-background px-3 text-sm shadow-xs outline-hidden"
                  />
                  <TimeSelectors
                    label="From"
                    compact
                    value={draft?.from ?? null}
                    onChange={(d) => setDraft((prev) => ({ ...(prev ?? {}), from: d }))}
                    precision={timePrecision}
                    hourCycle={hourCycle}
                    minuteStep={minuteStep}
                    secondStep={secondStep}
                    disabled={disabled}
                  />
                </div>
                <span className="text-muted-foreground">–</span>
                <div className="flex items-end gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={toInput}
                    onChange={(e) => setToInput(maskDate(e.target.value))}
                    onBlur={() => {
                      const p = parseMasked(toInput);
                      if (p) {
                        const prev = draft?.to ?? null;
                        const withTime = new Date(
                          p.getFullYear(),
                          p.getMonth(),
                          p.getDate(),
                          prev ? prev.getHours() : 0,
                          prev ? prev.getMinutes() : 0,
                          prev ? prev.getSeconds() : 0
                        );
                        setDraft((d) => ({ ...(d ?? {}), to: withTime }));
                      }
                    }}
                    placeholder="dd/mm/yyyy"
                    className="h-9 w-40 rounded-md border bg-background px-3 text-sm shadow-xs outline-hidden"
                  />
                  <TimeSelectors
                    label="To"
                    compact
                    value={draft?.to ?? null}
                    onChange={(d) => setDraft((prev) => ({ ...(prev ?? {}), to: d }))}
                    precision={timePrecision}
                    hourCycle={hourCycle}
                    minuteStep={minuteStep}
                    secondStep={secondStep}
                    disabled={disabled}
                  />
                </div>
              </div>
            </div>

            {/* Calendar */}
            <Calendar
              mode="range"
              numberOfMonths={numberOfMonths}
              selected={draft?.from && draft?.to ? { from: draft.from, to: draft.to } : undefined}
              onSelect={(range) => {
                if (disabled) return;
                if (!range) { setDraft(null); return; }
                const { from, to } = range as { from?: Date; to?: Date };
                if (from && (isBefore(from, minDate) || isAfter(from, maxDate))) return;
                if (to && (isBefore(to, minDate) || isAfter(to, maxDate))) return;
                if (from && to && rangeContainsDisabled(from, to, disabledDates)) return;
                const prevFrom = draft?.from ?? from;
                const prevTo = draft?.to ?? to;
                const nextFrom = from
                  ? new Date(from.getFullYear(), from.getMonth(), from.getDate(), prevFrom?.getHours?.() ?? 0, prevFrom?.getMinutes?.() ?? 0, prevFrom?.getSeconds?.() ?? 0)
                  : undefined;
                const nextTo = to
                  ? new Date(to.getFullYear(), to.getMonth(), to.getDate(), prevTo?.getHours?.() ?? 0, prevTo?.getMinutes?.() ?? 0, prevTo?.getSeconds?.() ?? 0)
                  : undefined;
                setDraft({ from: nextFrom ?? null, to: nextTo ?? null });
                setFromInput(fmtDate(nextFrom ?? null));
                setToInput(fmtDate(nextTo ?? null));
              }}
              defaultMonth={draft?.from ?? value?.from ?? new Date()}
              disabled={(d) => isBefore(d, minDate) || isAfter(d, maxDate) || inDisabled(d, disabledDates)}
              buttonVariant="ghost"
              showOutsideDays
            />
          </div>
          {(props.showFooter ?? true) && (
            <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)} disabled={disabled}>
                {props.cancelLabel ?? 'Cancel'}
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => onChange?.(null)} disabled={disabled}>
                  {props.clearLabel ?? 'Clear'}
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => {
                    if (invalidRange || !mergedFrom || !mergedTo) return;
                    onChange?.({ from: mergedFrom, to: mergedTo });
                    setOpen(false);
                  }}
                  disabled={disabled || invalidRange}
                >
                  {props.applyLabel ?? 'Apply'}
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

DateTimeRangePicker.displayName = 'DateTimeRangePicker';

export default DateTimeRangePicker;
