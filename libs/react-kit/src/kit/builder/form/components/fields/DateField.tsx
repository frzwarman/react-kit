import { Input } from '../../../../../shadcn/ui/input';
import type { FieldRenderProps } from './types';

export function DateField({
  field,
  value,
  onChange,
  className,
}: FieldRenderProps) {
  const parseDateValueForInput = (date: unknown) => {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }

    if (typeof date === 'string') {
      return parseDateValueForInput(new Date(date));
    }

    return '';
  }

  return (
    <Input
      className={className}
      disabled={field.disabled || field.readOnly}
      placeholder={field.placeholder}
      type="date"
      value={parseDateValueForInput(value)}
      defaultValue={parseDateValueForInput(value)}
      min={parseDateValueForInput(field.minDate)}
      max={parseDateValueForInput(field.maxDate)}
      onChange={(e) =>
        onChange(e.target.value ? new Date(e.target.value) : null)
      }
    />
  );
}
