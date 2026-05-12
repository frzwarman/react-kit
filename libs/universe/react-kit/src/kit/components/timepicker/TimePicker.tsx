'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../../shadcn/lib/utils';
import { Button } from '../../../shadcn/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../shadcn/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shadcn/ui/select';

export type TimePrecision = 'hour' | 'minute' | 'second';

export interface TimePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
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
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
const pad2 = (n: number) => String(n).padStart(2, '0');

export function TimePicker({
  value,
  onChange,
  placeholder = 'Pick a time',
  disabled,
  precision = 'minute',
  hourCycle = 24,
  minuteStep = 5,
  secondStep = 5,
  className,
  buttonVariant = 'outline',
  ...props
}: TimePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = typeof props.open === 'boolean' ? props.open : internalOpen;
  const setOpen = (o: boolean) =>
    props.onOpenChange ? props.onOpenChange(o) : setInternalOpen(o);

  const [draft, setDraft] = React.useState<Date | null>(value ?? null);

  React.useEffect(() => {
    if (isOpen) setDraft(value ?? null);
  }, [isOpen, value]);

  const fmtLabel = (d: Date | null): string => {
    if (!d) return placeholder;
    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    if (hourCycle === 12) {
      const period = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      if (precision === 'hour') return `${hour12} ${period}`;
      if (precision === 'minute') return `${hour12}:${pad2(m)} ${period}`;
      return `${hour12}:${pad2(m)}:${pad2(s)} ${period}`;
    }
    if (precision === 'hour') return `${pad2(h)}`;
    if (precision === 'minute') return `${pad2(h)}:${pad2(m)}`;
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
  };

  const setDraftPart = (
    part: 'hour' | 'minute' | 'second' | 'period',
    val: number | 'AM' | 'PM',
  ) => {
    setDraft((prev) => {
      const base = prev
        ? new Date(prev)
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
        let h = Number(val);
        if (hourCycle === 12) {
          const isPM = base.getHours() >= 12;
          h = h % 12;
          base.setHours(isPM ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h);
        } else {
          base.setHours(clamp(h, 0, 23));
        }
      } else if (part === 'minute') {
        base.setMinutes(clamp(Number(val), 0, 59));
      } else if (part === 'second') {
        base.setSeconds(clamp(Number(val), 0, 59));
      } else if (part === 'period' && (val === 'AM' || val === 'PM')) {
        const curH = base.getHours();
        const isAMNow = curH < 12;
        if (val === 'AM' && !isAMNow) base.setHours(curH - 12);
        if (val === 'PM' && isAMNow) base.setHours(curH + 12);
      }
      base.setMilliseconds(0);
      return new Date(base);
    });
  };

  const hours = React.useMemo(() => {
    return hourCycle === 12
      ? Array.from({ length: 12 }, (_, i) => i + 1)
      : Array.from({ length: 24 }, (_, i) => i);
  }, [hourCycle]);
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
    if (!draft) return hourCycle === 12 ? 12 : 0;
    const h = draft.getHours();
    return hourCycle === 12 ? (h % 12 === 0 ? 12 : h % 12) : h;
  }, [draft, hourCycle]);
  const selectedMinute = draft?.getMinutes() ?? 0;
  const selectedSecond = draft?.getSeconds() ?? 0;
  const selectedPeriod: 'AM' | 'PM' =
    draft && draft.getHours() >= 12 ? 'PM' : 'AM';

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
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
            )}
          >
            <Clock className="mr-2 h-4 w-4" />
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3 w-auto" align="start">
          <div className="flex items-end gap-2">
            <div className="w-24">
              <div className="mb-1 block text-xs text-muted-foreground">
                Hour
              </div>
              <Select
                disabled={disabled}
                value={String(selectedHour)}
                onValueChange={(v) => setDraftPart('hour', Number(v))}
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
                <div className="mb-1 block text-xs text-muted-foreground">
                  Minute
                </div>
                <Select
                  disabled={disabled}
                  value={String(selectedMinute - (selectedMinute % minuteStep))}
                  onValueChange={(v) => setDraftPart('minute', Number(v))}
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
                <div className="mb-1 block text-xs text-muted-foreground">
                  Second
                </div>
                <Select
                  disabled={disabled}
                  value={String(selectedSecond - (selectedSecond % secondStep))}
                  onValueChange={(v) => setDraftPart('second', Number(v))}
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
                <div className="mb-1 block text-xs text-muted-foreground">
                  Period
                </div>
                <Select
                  disabled={disabled}
                  value={selectedPeriod}
                  onValueChange={(v) =>
                    setDraftPart('period', v as 'AM' | 'PM')
                  }
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

TimePicker.displayName = 'TimePicker';

export default TimePicker;
