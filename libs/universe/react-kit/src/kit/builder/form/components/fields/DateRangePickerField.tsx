import * as React from 'react';
import type { FieldRenderProps } from './types';
import { DateRangePicker } from '../../../../components/datepicker/DateRangePicker';
import type { DateRange } from 'react-day-picker';

function coerceDate(input: unknown): Date | undefined {
  if (!input) return undefined;
  if (input instanceof Date) return input;
  const d = new Date(input as string);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export function DateRangePickerField({
  field,
  value,
  onChange,
  className,
}: FieldRenderProps) {
  const v = React.useMemo<DateRange | null>(() => {
    if (!value) return null;
    if (typeof value === 'object' && value !== null) {
      const anyVal = value as { from?: unknown; to?: unknown };
      return {
        from: coerceDate(anyVal.from),
        to: coerceDate(anyVal.to),
      };
    }
    return null;
  }, [value]);

  const dateFormat = (from?: Date, to?: Date) => {
    if (!to) {
      return `${field.dateFormat?.(from!)} \t– …`;
    }
    return `${field.dateFormat?.(from!)} \t– ${field.dateFormat?.(to!)}`;
  }

  return (
    <DateRangePicker
      className={className}
      value={v}
      onChange={(r) => onChange(r)}
      minDate={field.minDate}
      maxDate={field.maxDate}
      disabledDates={field.disabledDates}
      format={field.dateFormat ? dateFormat : undefined}
      placeholder={field.placeholder}
      numberOfMonths={field.numberOfMonths ?? 2}
      popoverSide={field.popoverSide}
      showFooter={field.showFooter}
      cancelLabel={field.cancelLabel}
      applyLabel={field.applyLabel}
    />
  );
}
