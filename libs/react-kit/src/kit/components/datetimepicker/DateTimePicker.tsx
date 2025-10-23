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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shadcn/ui/select';

export type TimePrecision = 'hour' | 'minute' | 'second';

export interface DateTimePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Array<Date | { from: Date; to: Date }>;
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
}

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const pad2 = (n: number) => String(n).padStart(2, '0');
const isBefore = (date: Date, min?: Date) => !!(min && date < startOfDay(min));
const isAfter = (date: Date, max?: Date) => !!(max && date > startOfDay(max));
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

function TimeSelectors({
  value,
  onChange,
  precision,
  hourCycle,
  minuteStep,
  secondStep,
  disabled,
}: {
  value: Date | null;
  onChange: (val: Date | null) => void;
  precision: TimePrecision;
  hourCycle: 12 | 24;
  minuteStep: number;
  secondStep: number;
  disabled?: boolean;
}) {
  const hours = React.useMemo(
    () =>
      hourCycle === 12
        ? Array.from({ length: 12 }, (_, i) => i + 1)
        : Array.from({ length: 24 }, (_, i) => i),
    [hourCycle],
  );
  const minutes = React.useMemo(
    () =>
      Array.from(
        { length: Math.ceil(60 / minuteStep) },
        (_, i) => i * minuteStep,
      ),
    [minuteStep],
  );
  const seconds = React.useMemo(
    () =>
      Array.from(
        { length: Math.ceil(60 / secondStep) },
        (_, i) => i * secondStep,
      ),
    [secondStep],
  );
  const selectedHour = React.useMemo(() => {
    if (!value) return hourCycle === 12 ? 12 : 0;
    const h = value.getHours();
    return hourCycle === 12 ? (h % 12 === 0 ? 12 : h % 12) : h;
  }, [value, hourCycle]);
  const selectedMinute = value?.getMinutes() ?? 0;
  const selectedSecond = value?.getSeconds() ?? 0;
  const selectedPeriod: 'AM' | 'PM' =
    value && value.getHours() >= 12 ? 'PM' : 'AM';

  const setPart = (
    part: 'hour' | 'minute' | 'second' | 'period',
    v: number | 'AM' | 'PM',
  ) => {
    const base = value
      ? new Date(value)
      : (() => {
          const n = new Date();
          return new Date(
            n.getFullYear(),
            n.getMonth(),
            n.getDate(),
            0,
            0,
            0,
            0,
          );
        })();
    if (part === 'hour') {
      let h = Number(v);
      if (hourCycle === 12) {
        const isPM = base.getHours() >= 12;
        h = h % 12;
        base.setHours(isPM ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h);
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

  return (
    <div className="flex items-end gap-2">
      <div className="w-24">
        <div className="mb-1 block text-xs text-muted-foreground">Hour</div>
        <Select
          disabled={disabled}
          value={String(selectedHour)}
          onValueChange={(v) => setPart('hour', Number(v))}
        >
          <SelectTrigger aria-label="Hour">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {hours.map((h) => (
              <SelectItem key={h} value={String(h)}>
                {hourCycle === 12 ? h : pad2(h)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(precision === 'minute' || precision === 'second') && (
        <div className="w-24">
          <div className="mb-1 block text-xs text-muted-foreground">Minute</div>
          <Select
            disabled={disabled}
            value={String(selectedMinute - (selectedMinute % minuteStep))}
            onValueChange={(v) => setPart('minute', Number(v))}
          >
            <SelectTrigger aria-label="Minute">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {pad2(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {precision === 'second' && (
        <div className="w-24">
          <div className="mb-1 block text-xs text-muted-foreground">Second</div>
          <Select
            disabled={disabled}
            value={String(selectedSecond - (selectedSecond % secondStep))}
            onValueChange={(v) => setPart('second', Number(v))}
          >
            <SelectTrigger aria-label="Second">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {seconds.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {pad2(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {hourCycle === 12 && (
        <div className="w-24">
          <div className="mb-1 block text-xs text-muted-foreground">Period</div>
          <Select
            disabled={disabled}
            value={selectedPeriod}
            onValueChange={(v) => setPart('period', v as 'AM' | 'PM')}
          >
            <SelectTrigger aria-label="Period">
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
  );
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Pick a date & time',
  disabled,
  minDate,
  maxDate,
  disabledDates,
  timePrecision = 'minute',
  hourCycle = 24,
  minuteStep = 5,
  secondStep = 5,
  className,
  buttonVariant = 'outline',
  ...props
}: DateTimePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = typeof props.open === 'boolean' ? props.open : internalOpen;
  const setOpen = (o: boolean) =>
    props.onOpenChange ? props.onOpenChange(o) : setInternalOpen(o);
  const [draft, setDraft] = React.useState<Date | null>(value ?? null);

  React.useEffect(() => {
    if (isOpen) setDraft(value ?? null);
  }, [isOpen, value]);

  const isDisabled = (date: Date) => {
    if (isBefore(date, minDate) || isAfter(date, maxDate)) return true;
    if (inDisabled(date, disabledDates)) return true;
    return false;
  };

  const fmtLabel = (d: Date | null): string => {
    if (!d) return placeholder;
    const dateStr = d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    const timeStr =
      hourCycle === 12
        ? `${h % 12 || 12}:${pad2(m)}${timePrecision === 'second' ? `:${pad2(s)}` : ''} ${h >= 12 ? 'PM' : 'AM'}`
        : `${pad2(h)}:${pad2(m)}${timePrecision === 'second' ? `:${pad2(s)}` : ''}`;
    return `${dateStr} ${timeStr}`;
  };

  const label = fmtLabel(value ?? null);

  return (
    <div className={cn('w-fit', className)} {...props}>
      <Popover open={isOpen} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            disabled={disabled}
            variant={buttonVariant}
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !value && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <div className="p-3 space-y-3">
            <Calendar
              mode="single"
              selected={draft ?? undefined}
              onSelect={(d) => {
                if (disabled) return;
                if (!d) return;
                if (isDisabled(d)) return;
                // preserve time parts if exist
                if (draft) {
                  const nd = new Date(
                    d.getFullYear(),
                    d.getMonth(),
                    d.getDate(),
                    draft.getHours(),
                    draft.getMinutes(),
                    draft.getSeconds(),
                  );
                  setDraft(nd);
                } else {
                  setDraft(
                    new Date(
                      d.getFullYear(),
                      d.getMonth(),
                      d.getDate(),
                      0,
                      0,
                      0,
                    ),
                  );
                }
              }}
              defaultMonth={draft ?? new Date()}
              disabled={isDisabled}
              buttonVariant="ghost"
              showOutsideDays
            />
            <div>
              <div className="mb-1 block text-xs text-muted-foreground">
                Time
              </div>
              <TimeSelectors
                value={draft}
                onChange={(d) => setDraft(d)}
                precision={timePrecision}
                hourCycle={hourCycle}
                minuteStep={minuteStep}
                secondStep={secondStep}
                disabled={disabled}
              />
            </div>
          </div>

          {(props.showFooter ?? true) && (
            <div className="flex items-center justify-between gap-2 p-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={disabled}
              >
                {props.cancelLabel ?? 'Cancel'}
              </Button>
              <div className="flex gap-2">
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
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

DateTimePicker.displayName = 'DateTimePicker';

export default DateTimePicker;
