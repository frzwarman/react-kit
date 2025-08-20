import { FormBuilderFieldConfig } from '../components/FormBuilder';
import { commonValidations } from './validations';

// Field factory functions
export const createField = {
  text: (
    name: string,
    label: string,
    options: Partial<FormBuilderFieldConfig> = {},
  ): FormBuilderFieldConfig => ({
    name,
    label,
    type: 'text',
    required: false,
    ...options,
  }),

  email: (
    name: string,
    label: string,
    options: Partial<FormBuilderFieldConfig> = {},
  ): FormBuilderFieldConfig => ({
    name,
    label,
    type: 'email',
    required: false,
    validation: commonValidations.email,
    ...options,
  }),

  password: (
    name: string,
    label: string,
    options: Partial<FormBuilderFieldConfig> = {},
  ): FormBuilderFieldConfig => ({
    name,
    label,
    type: 'password',
    required: false,
    validation: commonValidations.password,
    ...options,
  }),

  number: (
    name: string,
    label: string,
    options: Partial<FormBuilderFieldConfig> = {},
  ): FormBuilderFieldConfig => ({
    name,
    label,
    type: 'number',
    required: false,
    ...options,
  }),

  textarea: (
    name: string,
    label: string,
    options: Partial<FormBuilderFieldConfig> = {},
  ): FormBuilderFieldConfig => ({
    name,
    label,
    type: 'textarea',
    required: false,
    gridCols: 2, // Default to full width
    ...options,
  }),

  select: (
    name: string,
    label: string,
    options: { label: string; value: string | number | null }[],
    fieldOptions: Partial<FormBuilderFieldConfig> = {},
  ): FormBuilderFieldConfig => ({
    name,
    label,
    type: 'select',
    options,
    required: false,
    ...fieldOptions,
  }),

  checkbox: (
    name: string,
    label: string,
    options: Partial<FormBuilderFieldConfig> = {},
  ): FormBuilderFieldConfig => ({
    name,
    label,
    type: 'checkbox',
    required: false,
    defaultValue: false,
    ...options,
  }),

  radio: (
    name: string,
    label: string,
    options: { label: string; value: string | number }[],
    fieldOptions: Partial<FormBuilderFieldConfig> = {},
  ): FormBuilderFieldConfig => ({
    name,
    label,
    type: 'radio',
    options,
    required: false,
    ...fieldOptions,
  }),

  date: (
    name: string,
    label: string,
    options: Partial<FormBuilderFieldConfig> = {},
  ): FormBuilderFieldConfig => ({
    name,
    label,
    type: 'date',
    required: false,
    ...options,
  }),

  file: (
    name: string,
    label: string,
    options: Partial<FormBuilderFieldConfig> = {},
  ): FormBuilderFieldConfig => ({
    name,
    label,
    type: 'file',
    required: false,
    ...options,
  }),

  object: (
    name: string,
    label: string,
    fields: FormBuilderFieldConfig[],
    options: Partial<FormBuilderFieldConfig> = {},
  ): FormBuilderFieldConfig => ({
    name,
    label,
    type: 'object',
    fields,
    required: false,
    gridCols: 2, // Default to full width
    ...options,
  }),

  array: (
    name: string,
    label: string,
    fields: FormBuilderFieldConfig[],
    options: Partial<FormBuilderFieldConfig> = {},
  ): FormBuilderFieldConfig => ({
    name,
    label,
    type: 'array',
    fields,
    required: false,
    gridCols: 2, // Default to full width
    defaultValue: [],
    ...options,
  }),
};
