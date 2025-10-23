import { Input } from '../../../../../shadcn/ui/input';
import type { FieldRenderProps } from './types';

export function NumberField({
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
      type="number"
      value={(value as number | string) ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
