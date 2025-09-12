import type { FormBuilderFieldConfig, FormBuilderSectionConfig } from '../types';

// Section factory functions
export const createSection = {
  card: (
    title: string,
    fields: FormBuilderFieldConfig<any>[],
    options: Partial<FormBuilderSectionConfig<any>> = {},
  ): FormBuilderSectionConfig<any> => ({
    title,
    fields,
    variant: 'card',
    ...options,
  }),

  separator: (
    title: string,
    fields: FormBuilderFieldConfig<any>[],
    options: Partial<FormBuilderSectionConfig<any>> = {},
  ): FormBuilderSectionConfig<any> => ({
    title,
    fields,
    variant: 'separator',
    ...options,
  }),

  plain: (
    fields: FormBuilderFieldConfig<any>[],
    options: Partial<FormBuilderSectionConfig<any>> = {},
  ): FormBuilderSectionConfig<any> => ({
    fields,
    variant: 'plain',
    ...options,
  }),
};
