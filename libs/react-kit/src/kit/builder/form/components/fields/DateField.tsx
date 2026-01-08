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
      disabled={field.disabled || field.readOnly}
      placeholder={field.placeholder}
      type="date"
      defaultValue={
        value
          ? new Date(value as Date | string).toISOString().split('T')[0]
          : ''
      }
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
