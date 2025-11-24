import { Textarea } from '../../../../../shadcn/ui/textarea';
import type { FieldRenderProps } from './types';

export function TextareaField({
  field,
  value,
  onChange,
  className,
}: FieldRenderProps) {
  return (
    <Textarea
      className={className}
      disabled={field.disabled || field.readOnly}
      placeholder={field.placeholder}
      value={(value as string) || ''}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
    />
  );
}
