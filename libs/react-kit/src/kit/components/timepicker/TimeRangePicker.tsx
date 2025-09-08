'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../../shadcn/lib/utils';
import { Button } from '../../../shadcn/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../../shadcn/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shadcn/ui/select';

export type TimePrecision = 'hour' | 'minute' | 'second';

export interface TimeRangePickerValue {
  from?: Date | null;
  to?: Date | null;
}

export interface TimeRangePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: TimeRangePickerValue | null;
  onChange?: (range: TimeRangePickerValue | null) => void;
  placeholder?: string;
  disabled?: boolean;
  precision?: TimePrecision; // default 'minute'
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
  format?: (from?: Date | null, to?: Date | null) => string;
}

const pad2 = (n: number) => String(n).padStart(2, '0');

function TimeUnitSelector({
  label,
  hourCycle,
  precision,
  minuteStep,
  secondStep,
  disabled,
  value,
  onChange,
}: {
  label: string;
  hourCycle: 12 | 24;
  precision: TimePrecision;
  minuteStep: number;
  secondStep: number;
  disabled?: boolean;
  value: Date | null | undefined;
  onChange: (next: Date | null) => void;
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

  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex items-end gap-2">
        <div className="w-24">
          <div className="mb-1 block text-xs text-muted-foreground">Hour</div>
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
          <div className="w-24">
            <div className="mb-1 block text-xs text-muted-foreground">Minute</div>
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
          <div className="w-24">
            <div className="mb-1 block text-xs text-muted-foreground">Second</div>
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
          <div className="w-24">
            <div className="mb-1 block text-xs text-muted-foreground">Period</div>
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

export function TimeRangePicker({
  value,
  onChange,
  placeholder = 'Pick a time range',
  disabled,
  precision = 'minute',
  hourCycle = 24,
  minuteStep = 5,
  secondStep = 5,
  className,
  buttonVariant = 'outline',
  format,
  ...props
}: TimeRangePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = typeof props.open === 'boolean' ? props.open : internalOpen;
  const setOpen = (o: boolean) => (props.onOpenChange ? props.onOpenChange(o) : setInternalOpen(o));
  const [draft, setDraft] = React.useState<TimeRangePickerValue | null>(value ?? null);

  React.useEffect(() => {
    if (isOpen) setDraft(value ?? null);
  }, [isOpen, value]);

  const label = React.useMemo(() => {
    const f = draft?.from ?? value?.from ?? null;
    const t = draft?.to ?? value?.to ?? null;
    if (format) return format(f ?? null, t ?? null);
    const fs = f ? (hourCycle === 12
      ? `${((f.getHours() % 12) || 12)}:${pad2(f.getMinutes())}${precision === 'second' ? `:${pad2(f.getSeconds())}` : ''} ${f.getHours() >= 12 ? 'PM' : 'AM'}`
      : `${pad2(f.getHours())}:${pad2(f.getMinutes())}${precision === 'second' ? `:${pad2(f.getSeconds())}` : ''}`) : null;
    const ts = t ? (hourCycle === 12
      ? `${((t.getHours() % 12) || 12)}:${pad2(t.getMinutes())}${precision === 'second' ? `:${pad2(t.getSeconds())}` : ''} ${t.getHours() >= 12 ? 'PM' : 'AM'}`
      : `${pad2(t.getHours())}:${pad2(t.getMinutes())}${precision === 'second' ? `:${pad2(t.getSeconds())}` : ''}`) : null;
    return fs && ts ? `${fs} – ${ts}` : placeholder;
  }, [draft, value, format, hourCycle, precision, placeholder]);

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
            <Clock className="mr-2 h-4 w-4" />
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3 w-auto" align="start">
          <div className="space-y-4">
            <TimeUnitSelector
              label="From"
              value={draft?.from ?? null}
              onChange={(d) => setDraft((prev) => ({ ...(prev ?? {}), from: d }))}
              hourCycle={hourCycle}
              precision={precision}
              minuteStep={minuteStep}
              secondStep={secondStep}
              disabled={disabled}
            />
            <TimeUnitSelector
              label="To"
              value={draft?.to ?? null}
              onChange={(d) => setDraft((prev) => ({ ...(prev ?? {}), to: d }))}
              hourCycle={hourCycle}
              precision={precision}
              minuteStep={minuteStep}
              secondStep={secondStep}
              disabled={disabled}
            />
          </div>

          {(props.showFooter ?? true) && (
            <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t">
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

TimeRangePicker.displayName = 'TimeRangePicker';

export default TimeRangePicker;
