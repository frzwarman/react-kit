import * as React from 'react';
import type { FieldRenderProps } from './types';
import { DatePicker } from '../../../../components/datepicker/DatePicker';

export function DatePickerField({
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
    <DatePicker
      className={className}
      value={v}
      onChange={(d: Date | null) => onChange(d)}
      minDate={field.minDate}
      maxDate={field.maxDate}
      disabledDates={field.disabledDates}
      buttonVariant="outline"
    />
  );
}
