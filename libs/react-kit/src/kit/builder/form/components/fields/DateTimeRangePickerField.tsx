import * as React from 'react';
import type { FieldRenderProps } from './types';
import { DateTimeRangePicker } from '../../../../components/datetimepicker/DateTimeRangePicker';

export function DateTimeRangePickerField({
  field,
  value,
  onChange,
  className,
}: FieldRenderProps) {
  const v = React.useMemo(() => {
    if (!value || typeof value !== 'object')
      return null as { from?: Date | null; to?: Date | null } | null;
    const anyVal = value as { from?: unknown; to?: unknown };
    const toDate = (x: unknown) => {
      if (!x) return undefined;
      if (x instanceof Date) return x;
      const d = new Date(x as string);
      return Number.isNaN(d.getTime()) ? undefined : d;
    };
    const from = toDate(anyVal.from) ?? null;
    const to = toDate(anyVal.to) ?? null;
    return { from, to };
  }, [value]);

  return (
    <DateTimeRangePicker
      className={className}
      value={v}
      onChange={(range) => onChange(range)}
      placeholder={field.placeholder}
      minDate={field.minDate}
      maxDate={field.maxDate}
      disabledDates={field.disabledDates}
      numberOfMonths={field.numberOfMonths ?? 2}
      popoverSide={field.popoverSide}
      timePrecision={field.timePrecision ?? 'minute'}
      hourCycle={field.hourCycle ?? 24}
      minuteStep={field.minuteStep ?? 5}
      secondStep={field.secondStep ?? 5}
      showFooter={field.showFooter}
      cancelLabel={field.cancelLabel}
      applyLabel={field.applyLabel}
    />
  );
}

export default DateTimeRangePickerField;
