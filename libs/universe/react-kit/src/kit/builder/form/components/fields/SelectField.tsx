import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../shadcn/ui/select';
import type { FieldRenderProps } from './types';

const NULL_SENTINEL = '__NULL__';

export function SelectField({
  field,
  value,
  onChange,
  className,
}: FieldRenderProps) {
  const toUiValue = (val: unknown) =>
    val === null || val === undefined ? NULL_SENTINEL : String(val);
  const fromUiValue = (val: string) => {
    const match = field.options?.find((opt) => toUiValue(opt.value) === val);
    return match ? match.value : null;
  };

  return (
    <Select
      value={toUiValue(value)}
      onValueChange={(val) => onChange(fromUiValue(val))}
      disabled={field.disabled || field.readOnly}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={field.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {field.options?.map((option) => (
          <SelectItem
            key={toUiValue(option.value)}
            value={toUiValue(option.value)}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
