import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '../../../../shadcn/lib/utils';
import { Button } from '../../../../shadcn/ui/button';
import { FormField } from './FormField';
import SectionBuilder from '../../section/SectionBuilder';
import type { SectionLayout, SectionGridOptions, SectionFlexOptions, SectionNode } from '../../section/types';
import { AutocompleteFetcher, AutocompleteOption } from '../../../components/autocomplete/types';

export interface FormBuilderFieldConfig {
  id?: string; // Optional ID for test fixtures
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'select'
    | 'autocomplete'
    | 'checkbox'
    | 'radio'
    | 'date'
    | 'file'
    | 'object'
    | 'array';
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { label: string; value: string | number | null }[];
  // Autocomplete specific (client/server)
  autocompleteMode?: 'client' | 'server';
  fetcher?: AutocompleteFetcher;
  pageSize?: number;
  searchPlaceholder?: string;
  renderOption?: (
    option: AutocompleteOption,
    selected: boolean
  ) => React.ReactNode;
  validation?: z.ZodType<any> | {
    pattern?: { value: RegExp; message: string };
    min?: { value: number; message: string };
    max?: { value: number; message: string };
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
  };
  defaultValue?: any;
  fields?: FormBuilderFieldConfig[]; // For nested object/array fields
  dependencies?: {
    field: string;
    condition: (value: any) => boolean;
    action: 'show' | 'hide' | 'enable' | 'disable' | 'setValue';
    value?: any;
  }[];
  onChange?: (
    value: any,
    setValue: (field: string, value: any) => void,
    getValues: () => any
  ) => void;
  className?: string;
  gridCols?: number;
  rows?: number; // For textarea fields
  itemType?: string; // For array fields
  conditional?: {
    field: string;
    value: any;
  }; // For conditional field visibility
  hidden?: boolean; // Declarative hide
}

export interface FormBuilderSectionConfig {
  id?: string;
  title?: string;
  description?: string;
  fields: FormBuilderFieldConfig[];
  variant?: 'card' | 'separator' | 'plain';
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  layout?: SectionLayout;
  grid?: SectionGridOptions;
  flex?: SectionFlexOptions;
  hidden?: boolean; // Declarative hide
}

export interface FormBuilderProps {
  sections: FormBuilderSectionConfig[];
  schema?: z.ZodType<any>;
  defaultValues?: Record<string, any> | null;
  onSubmit: (data: any) => void | Promise<void>;
  onCancel?: () => void;
  onReset?: () => void;
  onFieldChange?: (
    name: string,
    value: any,
    allValues: Record<string, any>
  ) => void;
  submitLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
  isSubmitting?: boolean;
  className?: string;
  formClassName?: string;
  actionsClassName?: string;
  showActions?: boolean;
  customActions?: React.ReactNode;
}

export function FormBuilder({
  sections,
  schema,
  defaultValues = {},
  onSubmit,
  onCancel,
  onReset,
  onFieldChange,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  resetLabel = 'Reset',
  isSubmitting = false,
  className,
  formClassName,
  actionsClassName,
  showActions = true,
  customActions,
}: FormBuilderProps) {
  // Generate schema from field configs if not provided
  const generatedSchema = useMemo(() => {
    if (schema) return schema;

    const generateFieldSchema = (field: FormBuilderFieldConfig): z.ZodType<any> => {
      if (field.validation && field.validation instanceof z.ZodType) {
        return field.validation;
      }

      // Handle validation object format
      if (field.validation && typeof field.validation === 'object' && !(field.validation instanceof z.ZodType)) {
        const validationObj = field.validation;
        let baseSchema: z.ZodType<any>;

        // Determine base schema type
        switch (field.type) {
          case 'email':
            baseSchema = z.string().email('Invalid email address');
            break;
          case 'number':
            baseSchema = z.number();
            break;
          case 'autocomplete':
            baseSchema = z.union([z.string(), z.number()]).nullable();
            break;
          case 'checkbox':
            baseSchema = z.boolean();
            break;
          case 'date':
            baseSchema = z.date();
            break;
          default:
            baseSchema = z.string();
        }

        // Apply validation constraints
        if (validationObj.pattern && baseSchema instanceof z.ZodString) {
          baseSchema = baseSchema.regex(validationObj.pattern.value, validationObj.pattern.message);
        }
        if (validationObj.min && baseSchema instanceof z.ZodNumber) {
          baseSchema = baseSchema.min(validationObj.min.value, validationObj.min.message);
        }
        if (validationObj.max && baseSchema instanceof z.ZodNumber) {
          baseSchema = baseSchema.max(validationObj.max.value, validationObj.max.message);
        }
        if (validationObj.minLength && baseSchema instanceof z.ZodString) {
          baseSchema = baseSchema.min(validationObj.minLength.value, validationObj.minLength.message);
        }
        if (validationObj.maxLength && baseSchema instanceof z.ZodString) {
          baseSchema = baseSchema.max(validationObj.maxLength.value, validationObj.maxLength.message);
        }

        return field.required ? baseSchema : baseSchema.optional();
      }

      let fieldSchema: z.ZodType<any>;

      switch (field.type) {
        case 'email':
          fieldSchema = z.string().email('Invalid email address');
          break;
        case 'number':
          fieldSchema = z.number();
          break;
        case 'autocomplete':
          fieldSchema = z.union([z.string(), z.number(), z.object()]).nullable();
          break;
        case 'checkbox':
          fieldSchema = z.boolean();
          break;
        case 'date':
          fieldSchema = z.date();
          break;
        case 'select':
        case 'radio':
          if (field.options && field.options.length > 0) {
            // Build a union of literals to allow specific values, including null if present
            const literals = field.options.map(opt => z.literal(opt.value as any));
            if (literals.length === 1) {
              fieldSchema = literals[0];
            }
            else {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              fieldSchema = z.union(literals as any);
            }
          }
          else {
            fieldSchema = z.string();
          }
          break;
        case 'object':
          if (field.fields) {
            const objectSchema: Record<string, z.ZodType<any>> = {};
            field.fields.forEach((subField) => {
              objectSchema[subField.name] = generateFieldSchema(subField);
            });
            fieldSchema = z.object(objectSchema);
          }
          else {
            fieldSchema = z.object({});
          }
          break;
        case 'array':
          if (field.fields && field.fields.length > 0) {
            const arrayItemSchema
              = field.fields.length === 1
                ? generateFieldSchema(field.fields[0])
                : z.object(
                    field.fields.reduce((acc, subField) => {
                      acc[subField.name] = generateFieldSchema(subField);
                      return acc;
                    }, {} as Record<string, z.ZodType<any>>),
                  );
            fieldSchema = z.array(arrayItemSchema);
          }
          else {
            fieldSchema = z.array(z.any());
          }
          break;
        default:
          fieldSchema = z.string();
      }

      return field.required ? fieldSchema : fieldSchema.optional();
    };

    const schemaObject: Record<string, z.ZodType<any>> = {};

    sections.forEach((section) => {
      section.fields.forEach((field) => {
        schemaObject[field.name] = generateFieldSchema(field);
      });
    });

    return z.object(schemaObject);
  }, [sections, schema]);

  // Generate default values from field configs
  const generatedDefaultValues = useMemo(() => {
    const values: Record<string, any> = { ...defaultValues };

    const processFields = (fields: FormBuilderFieldConfig[]) => {
      fields.forEach((field) => {
        if (
          values[field.name] === undefined
          && field.defaultValue !== undefined
        ) {
          values[field.name] = field.defaultValue;
        }

        if (field.type === 'object' && field.fields) {
          if (!values[field.name]) values[field.name] = {};
          const nestedValues: Record<string, any> = {};
          field.fields.forEach((subField) => {
            if (subField.defaultValue !== undefined) {
              nestedValues[subField.name] = subField.defaultValue;
            }
          });
          values[field.name] = { ...nestedValues, ...values[field.name] };
        }

        if (field.type === 'array' && field.fields) {
          if (!values[field.name]) {
            values[field.name] = field.defaultValue || [];
          }
        }
      });
    };

    sections.forEach(section => processFields(section.fields));

    return values;
  }, [sections, defaultValues]);

  const form = useForm<any>({
    resolver: zodResolver(generatedSchema as any),
    defaultValues: generatedDefaultValues,
  });

  const { control, handleSubmit, reset, setValue, getValues, watch } = form;

  // Watch all form values for dependencies
  const watchedValues = watch();

  // Handle field dependencies
  const handleFieldDependencies = useCallback(
    (field: FormBuilderFieldConfig) => {
      if (!field.dependencies) return {};

      const result: { disabled?: boolean; hidden?: boolean } = {};

      field.dependencies.forEach((dep) => {
        const dependentValue = watchedValues[dep.field];
        const conditionMet = dep.condition(dependentValue);

        switch (dep.action) {
          case 'show':
            if (!conditionMet) result.hidden = true;
            break;
          case 'hide':
            if (conditionMet) result.hidden = true;
            break;
          case 'enable':
            if (!conditionMet) result.disabled = true;
            break;
          case 'disable':
            if (conditionMet) result.disabled = true;
            break;
          case 'setValue':
            if (conditionMet && dep.value !== undefined) {
              const currentValue = getValues(field.name);
              // Only setValue if the value is actually different to prevent infinite loops
              if (currentValue !== dep.value) {
                setValue(field.name, dep.value);
              }
            }
            break;
        }
      });

      return result;
    },
    [watchedValues, setValue, getValues],
  );

  // Handle field change with custom onChange
  const handleFieldChange = useCallback(
    (field: FormBuilderFieldConfig, value: any) => {
      if (field.onChange) {
        field.onChange(value, setValue, getValues);
      }
    },
    [setValue, getValues],
  );

  const handleFormSubmit = useCallback(
    async (data: any) => {
      try {
        await onSubmit(data);
      }
      catch (error) {
        console.error('Form submission error:', error);
      }
    },
    [onSubmit],
  );

  const handleReset = useCallback(() => {
    reset(generatedDefaultValues);
    onReset?.();
  }, [reset, generatedDefaultValues, onReset]);

  // Build SectionBuilder nodes from form sections/fields
  const sectionNodes: SectionNode[] = useMemo(() => {
    return sections.map((section, sectionIndex) => {
      const node: SectionNode = {
        id: section.id ?? `section-${sectionIndex}`,
        title: section.title,
        subtitle: section.description,
        variant: section.variant ?? 'card',
        className: section.className,
        layout: section.layout ?? 'grid',
        grid: section.grid ?? { cols: 1, mdCols: 2, gap: 'gap-4' },
        flex: section.flex,
        hidden: section.hidden,
        children: section.fields
          .map((field) => {
            const fieldState = handleFieldDependencies(field);
            if (field.hidden || fieldState.hidden) return null;

            const spanMd = Math.max(1, Math.min(12, field.gridCols ?? 1));

            return {
              key: field.name,
              span: { base: 1, md: spanMd },
              hidden: field.hidden,
              content: (
                <FormField
                  key={field.name}
                  field={{ ...field, disabled: field.disabled || fieldState.disabled }}
                  control={control}
                  onChange={(value) => {
                    handleFieldChange(field, value);
                    onFieldChange?.(field.name, value, getValues());
                  }}
                  onFieldChange={onFieldChange}
                />
              ),
            };
          })
          .filter(Boolean) as SectionNode['children'],
      };
      return node;
    });
  }, [sections, control, handleFieldDependencies, handleFieldChange, onFieldChange, getValues]);

  return (
    <div className={cn('space-y-6', className)}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={cn('space-y-6', formClassName)}>
        <SectionBuilder sections={sectionNodes} />

        {showActions && (
          <div className={cn('flex flex-col sm:flex-row gap-3 pt-6 border-t', actionsClassName)}>
            <Button type="submit" disabled={isSubmitting} className="sm:order-last">
              {isSubmitting ? 'Submitting...' : submitLabel}
            </Button>

            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                {cancelLabel}
              </Button>
            )}

            {onReset && (
              <Button type="button" variant="ghost" onClick={handleReset} disabled={isSubmitting}>
                {resetLabel}
              </Button>
            )}

            {customActions}
          </div>
        )}
      </form>
    </div>
  );
}
