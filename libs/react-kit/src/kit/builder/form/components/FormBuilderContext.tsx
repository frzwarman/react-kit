import { createContext, useContext } from 'react';
import type {
  Control,
  FieldValues,
  Path,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import type { FormBuilderFieldConfig } from '../types';

interface DependencyState {
  disabled?: boolean;
  hidden?: boolean;
}

export interface FormBuilderContextValue<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  getValues: UseFormGetValues<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  onFieldChange?: (
    name: Path<TFieldValues> | string,
    value: unknown,
    allValues: TFieldValues
  ) => void;
  handleFieldDependencies: (
    field: FormBuilderFieldConfig<TFieldValues, string | Path<TFieldValues>>
  ) => DependencyState;
  handleFieldChange: (
    field: FormBuilderFieldConfig<TFieldValues, string | Path<TFieldValues>>,
    value: unknown,
    ...extras: unknown[]
  ) => void;
}

const FormBuilderContext = createContext<FormBuilderContextValue<FieldValues> | null>(null);

export function useFormBuilderContext<TFieldValues extends FieldValues = FieldValues>() {
  const value = useContext(FormBuilderContext) as FormBuilderContextValue<TFieldValues> | null;
  if (!value) {
    throw new Error('FormBuilderGroup must be used within a FormBuilder.');
  }
  return value;
}

export { FormBuilderContext };
