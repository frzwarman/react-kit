import * as React from 'react';
import type { FieldRenderProps } from './types';
import { DateTimePicker } from '../../../../components/datetimepicker/DateTimePicker';

export function DateTimePickerField({
  field,
  value,
  onChange,
  className,
}: FieldRenderProps) {
  const v = React.useMemo(() => {
    if (!value) return null;
    if (value instanceof Date) return value;
    const d = new Date(value as string);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [value]);

  return (
    <DateTimePicker
      className={className}
      value={v}
      onChange={(d: Date | null) => onChange(d)}
      placeholder={field.placeholder}
      minDate={field.minDate}
      maxDate={field.maxDate}
      disabledDates={field.disabledDates}
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

export default DateTimePickerField;
