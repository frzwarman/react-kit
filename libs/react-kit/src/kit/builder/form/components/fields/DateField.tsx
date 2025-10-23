import { Input } from '../../../../../shadcn/ui/input';
import type { FieldRenderProps } from './types';

export function DateField({
  field,
  value,
  onChange,
  className,
}: FieldRenderProps) {
  return (
    <Input
      className={className}
      disabled={field.disabled}
      placeholder={field.placeholder}
      type="date"
      value={
        value
          ? new Date(value as Date | string).toISOString().split('T')[0]
          : ''
      }
      onChange={(e) =>
        onChange(e.target.value ? new Date(e.target.value) : null)
      }
    />
  );
}
