import * as React from 'react';
import type { FieldRenderProps } from './types';
import { MonthInput } from '../../../../components/monthpicker/MonthInput';

export function MonthPickerField({
  field,
  value,
  onChange,
  className,
}: FieldRenderProps) {
  const v = React.useMemo(() => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    const d = new Date(value as string);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }, [value]);

  return (
    <MonthInput
      className={className}
      value={v ?? null}
      onChange={(d: Date | null) => onChange(d)}
      minDate={field.minDate}
      maxDate={field.maxDate}
      disabledDates={field.disabledDates?.filter(
        (it): it is Date => it instanceof Date,
      )}
      showFooter
      clearLabel={field.cancelLabel}
      closeLabel={field.applyLabel}
    />
  );
}
