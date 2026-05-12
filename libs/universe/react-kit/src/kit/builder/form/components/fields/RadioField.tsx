import {
  RadioGroup,
  RadioGroupItem,
} from '../../../../../shadcn/ui/radio-group';
import { Label } from '../../../../../shadcn/ui/label';
import type { FieldRenderProps } from './types';

const NULL_SENTINEL = '__NULL__';

export function RadioField({
  field,
  value,
  onChange,
  className,
  fieldPath,
}: FieldRenderProps) {
  const toUiValue = (val: unknown) =>
    val === null || val === undefined ? NULL_SENTINEL : String(val);
  const fromUiValue = (val: string) => {
    const match = field.options?.find((opt) => toUiValue(opt.value) === val);
    return match ? match.value : null;
  };

  return (
    <RadioGroup
      value={toUiValue(value)}
      onValueChange={(val) => onChange(fromUiValue(val))}
      disabled={field.disabled || field.readOnly}
      className={className}
    >
      {field.options?.map((option) => (
        <div
          key={toUiValue(option.value)}
          className="flex items-center space-x-2"
        >
          <RadioGroupItem
            value={toUiValue(option.value)}
            id={`${fieldPath}-${toUiValue(option.value)}`}
          />
          <Label htmlFor={`${fieldPath}-${toUiValue(option.value)}`}>
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
