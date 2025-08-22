import type { Control, FieldValues } from 'react-hook-form'
import type { FormBuilderFieldConfig } from '../FormBuilder'

export interface FieldRenderProps {
  field: FormBuilderFieldConfig
  control: Control<FieldValues>
  fieldPath: string
  value: unknown
  onChange: (value: unknown) => void
  className?: string
  disabled?: boolean
  errorMessage?: string
  onFieldChange?: (name: string, value: unknown, allValues: Record<string, unknown>) => void
}
