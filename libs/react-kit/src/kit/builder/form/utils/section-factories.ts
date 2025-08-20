import { FormBuilderFieldConfig, FormBuilderSectionConfig } from '../components/FormBuilder';

// Section factory functions
export const createSection = {
  card: (
    title: string,
    fields: FormBuilderFieldConfig[],
    options: Partial<FormBuilderSectionConfig> = {},
  ): FormBuilderSectionConfig => ({
    title,
    fields,
    variant: 'card',
    ...options,
  }),

  separator: (
    title: string,
    fields: FormBuilderFieldConfig[],
    options: Partial<FormBuilderSectionConfig> = {},
  ): FormBuilderSectionConfig => ({
    title,
    fields,
    variant: 'separator',
    ...options,
  }),

  plain: (
    fields: FormBuilderFieldConfig[],
    options: Partial<FormBuilderSectionConfig> = {},
  ): FormBuilderSectionConfig => ({
    fields,
    variant: 'plain',
    ...options,
  }),
};
