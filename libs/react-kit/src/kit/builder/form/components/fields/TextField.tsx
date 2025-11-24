import { Input } from '../../../../../shadcn/ui/input';
import type { FieldRenderProps } from './types';

export function TextField({
  field,
  fieldPath,
  value,
  onChange,
  className,
}: FieldRenderProps) {
  const type: 'text' | 'email' | 'password' =
    field.type === 'email' || field.type === 'password' ? field.type : 'text';
  return (
    <Input
      id={fieldPath}
      className={className}
      disabled={field.disabled || field.readOnly}
      readOnly={field.readOnly}
      placeholder={field.placeholder}
      type={type}
      value={(value as string) || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
