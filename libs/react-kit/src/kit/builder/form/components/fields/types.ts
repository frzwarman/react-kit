import type { Control, FieldValues } from 'react-hook-form';
import type { FormBuilderFieldConfig } from '../../types';

export interface FieldRenderProps {
  field: FormBuilderFieldConfig<any, any>;
  control: Control<FieldValues>;
  fieldPath: string;
  value: unknown;
  onChange: (value: unknown, ...extras: unknown[]) => void;
  className?: string;
  disabled?: boolean;
  errorMessage?: string;
  onFieldChange?: (
    name: string,
    value: unknown,
    allValues: Record<string, unknown>,
  ) => void;
}
