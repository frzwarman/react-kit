import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm, useWatch, type FieldValues, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '../../../../shadcn/lib/utils';
import { Button } from '../../../../shadcn/ui/button';
import SectionBuilder from '../../section/SectionBuilder';
import { buildSectionNodes } from './sectionNodes';
import { FormBuilderContext, type FormBuilderContextValue } from './FormBuilderContext';
import type {
  FormBuilderProps,
  FormBuilderFieldConfig,
  FormBuilderSectionConfig,
} from '../types';

export function FormBuilder<TFieldValues extends FieldValues = FieldValues>({
  sections,
  schema,
  defaultValues,
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
  showActionsSeparator = true,
  form,
}: FormBuilderProps<TFieldValues>) {
  // Generate schema from field configs if not provided
  const generatedSchema = useMemo(() => {
    if (schema) return schema;

    const generateFieldSchema = (
      field: FormBuilderFieldConfig<TFieldValues, string | Path<TFieldValues>>
    ): z.ZodType<unknown> => {
      if (field.validation && field.validation instanceof z.ZodType) {
        return field.validation;
      }

      // Handle validation object format
      if (
        field.validation &&
        typeof field.validation === 'object' &&
        !(field.validation instanceof z.ZodType)
      ) {
        const validationObj = field.validation;
        let baseSchema: z.ZodType<unknown>;

        // Determine base schema type
        switch (field.type) {
          case 'email':
            baseSchema = z.string().email('Invalid email address');
            break;
          case 'number':
            baseSchema = z.number();
            break;
          case 'file':
            baseSchema = z.array(z.unknown());
            break;
          case 'date_picker':
          case 'month':
          case 'date':
          case 'time':
          case 'date_time':
            baseSchema = z.date();
            break;
          case 'date_range':
          case 'time_range':
          case 'date_time_range':
            baseSchema = z
              .object({ from: z.date().optional().nullable(), to: z.date().optional().nullable() })
              .nullable();
            break;
          case 'month_range':
            baseSchema = z
              .object({ start: z.date().optional().nullable(), end: z.date().optional().nullable() })
              .nullable();
            break;
          case 'autocomplete': {
            const single = z
              .union([z.string(), z.number(), z.object({})])
              .nullable();
            const multi = z.array(
              z.union([z.string(), z.number(), z.object({})])
            );
            baseSchema = field.multiple ? multi : single;
            break;
          }
          case 'checkbox':
          case 'switch':
            baseSchema = z.boolean();
            break;
          case 'custom_field':
            baseSchema = z.any();
          break;
          default:
            baseSchema = z.string();
        }

        // Apply validation constraints
        if (validationObj.pattern && baseSchema instanceof z.ZodString) {
          baseSchema = baseSchema.regex(
            validationObj.pattern.value,
            validationObj.pattern.message
          );
        }
        if (validationObj.min && baseSchema instanceof z.ZodNumber) {
          baseSchema = baseSchema.min(
            validationObj.min.value,
            validationObj.min.message
          );
        }
        if (validationObj.max && baseSchema instanceof z.ZodNumber) {
          baseSchema = baseSchema.max(
            validationObj.max.value,
            validationObj.max.message
          );
        }
        if (validationObj.minLength && baseSchema instanceof z.ZodString) {
          baseSchema = baseSchema.min(
            validationObj.minLength.value,
            validationObj.minLength.message
          );
        }
        if (validationObj.maxLength && baseSchema instanceof z.ZodString) {
          baseSchema = baseSchema.max(
            validationObj.maxLength.value,
            validationObj.maxLength.message
          );
        }
        // Array item count constraints
        if (baseSchema instanceof z.ZodArray) {
          let arr = baseSchema as z.ZodArray<z.ZodTypeAny>;
          if (validationObj.minItems) {
            arr = arr.min(
              validationObj.minItems.value,
              validationObj.minItems.message,
            );
          }
          if (validationObj.maxItems) {
            arr = arr.max(
              validationObj.maxItems.value,
              validationObj.maxItems.message,
            );
          }
          // If required and file field, enforce at least 1 item when no explicit minItems
          if (field.type === 'file' && field.required && !validationObj.minItems) {
            arr = arr.min(1, `${field.label} requires at least 1 file`);
          }
          baseSchema = arr;
        }

        return field.required ? baseSchema : baseSchema.optional();
      }

      let fieldSchema: z.ZodType<unknown>;

      switch (field.type) {
        case 'email':
          fieldSchema = z.string().email('Invalid email address');
          break;
        case 'number':
          fieldSchema = z.number();
          break;
        case 'file': {
          let arr = z.array(z.unknown());
          // If required, ensure at least 1 file
          if (field.required) {
            arr = arr.min(1, `${field.label} requires at least 1 file`);
          }
          fieldSchema = arr;
          break;
        }
        case 'date_picker':
        case 'month':
        case 'date':
        case 'time':
        case 'date_time':
          fieldSchema = z.date();
          break;
        case 'date_range':
        case 'time_range':
        case 'date_time_range':
          fieldSchema = z
            .object({ from: z.date().optional().nullable(), to: z.date().optional().nullable() })
            .nullable();
          break;
        case 'month_range':
          fieldSchema = z
            .object({ start: z.date().optional().nullable(), end: z.date().optional().nullable() })
            .nullable();
          break;
        case 'autocomplete': {
          const single = z
            .union([z.string(), z.number(), z.object({})])
            .nullable();
          const multi = z.array(
            z.union([z.string(), z.number(), z.object({})])
          );
          fieldSchema = field.multiple ? multi : single;
          break;
        }
        case 'checkbox':
        case 'switch':
          fieldSchema = z.boolean();
          break;
        case 'select':
        case 'radio':
          if (field.options && field.options.length > 0) {
            // Build a union of literals to allow specific values, including null if present
            const literals: Array<z.ZodLiteral<string | number | null>> = field.options.map((opt) =>
              z.literal(opt.value as string | number | null)
            );
            if (literals.length === 1) {
              fieldSchema = literals[0];
            } else {
              fieldSchema = z.union(
                literals as [
                  z.ZodLiteral<string | number | null>,
                  ...z.ZodLiteral<string | number | null>[]
                ]
              );
            }
          } else {
            fieldSchema = z.string();
          }
          break;
        case 'object':
          if (field.fields) {
            const objectSchema: Record<string, z.ZodType<unknown>> = {};
            for (const subField of field.fields as Array<FormBuilderFieldConfig<TFieldValues, string | Path<TFieldValues>>>) {
              objectSchema[subField.name] = generateFieldSchema(subField);
            }
            fieldSchema = z.object(objectSchema);
          } else {
            fieldSchema = z.object({});
          }
          break;
        case 'array':
          if (field.fields && field.fields.length > 0) {
            const arrayItemSchema =
              field.fields.length === 1
                ? generateFieldSchema(field.fields[0] as FormBuilderFieldConfig<TFieldValues, string | Path<TFieldValues>>)
                : z.object(
                    (field.fields as Array<FormBuilderFieldConfig<TFieldValues, string | Path<TFieldValues>>>).reduce((acc, subField) => {
                      acc[subField.name] = generateFieldSchema(subField);
                      return acc;
                    }, {} as Record<string, z.ZodType<unknown>>)
                  );
            fieldSchema = z.array(arrayItemSchema);
          } else {
            fieldSchema = z.array(z.unknown());
          }
          break;
        case 'custom_field':
          fieldSchema = z.any();
          break;
        default:
          fieldSchema = z.string();
      }

      return field.required ? fieldSchema : fieldSchema.optional();
    };

    const schemaObject: Record<string, z.ZodType<unknown>> = {};

    const forEachField = (secs: FormBuilderSectionConfig<TFieldValues>[]) => {
      for (const section of secs) {
        // Traverse tabs if present
        if (section.tabs && section.tabs.length > 0) {
          for (const tab of section.tabs) {
            forEachField(tab.sections);
          }
        }
        for (const field of (section.fields ?? [])) {
          schemaObject[field.name] = generateFieldSchema(field as FormBuilderFieldConfig<TFieldValues, string | Path<TFieldValues>>);
        }
      }
    };

    forEachField(sections);

    return z.object(schemaObject) as unknown as z.ZodType<TFieldValues>;
  }, [sections, schema]);

  // Generate default values from field configs
  const generatedDefaultValues = useMemo(() => {
    const values: Record<string, unknown> = { ...((defaultValues ?? {}) as Record<string, unknown>) };

    const processFields = (fields: FormBuilderFieldConfig<TFieldValues, string | Path<TFieldValues>>[]) => {
      for (const field of fields) {
        if (
          values[field.name] === undefined &&
          field.defaultValue !== undefined
        ) {
          values[field.name] = field.defaultValue;
        }

        if (field.type === 'object' && field.fields) {
          if (!values[field.name]) values[field.name] = {};
          const nestedValues: Record<string, unknown> = {};
          for (const subField of field.fields) {
            if (subField.defaultValue !== undefined) {
              nestedValues[subField.name] = subField.defaultValue;
            }
          }
          const existing =
            values[field.name] && typeof values[field.name] === 'object'
              ? (values[field.name] as Record<string, unknown>)
              : {};
          values[field.name] = { ...nestedValues, ...existing };
        }

        if (field.type === 'array' && field.fields) {
          if (!values[field.name]) {
            values[field.name] = field.defaultValue || [];
          }
        }
      }
    };

    const forEachSection = (secs: FormBuilderSectionConfig<TFieldValues>[]) => {
      for (const section of secs) {
        if (section.tabs && section.tabs.length > 0) {
          for (const tab of section.tabs) {
            forEachSection(tab.sections);
          }
        }
        processFields(section.fields ?? []);
      }
    };

    forEachSection(sections);

    return values;
  }, [sections, defaultValues]);

  const internalForm = useForm<TFieldValues>({
    // Dynamic schema shape: cast to any to satisfy resolver generics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(generatedSchema as any) as unknown as import('react-hook-form').Resolver<TFieldValues, any, TFieldValues>,
    defaultValues: generatedDefaultValues as unknown as import('react-hook-form').DefaultValues<TFieldValues>,
  });

  const activeForm = form ?? internalForm;

  const { control, handleSubmit, reset, setValue, getValues } = activeForm;

  // Determine dependency fields to watch
  const dependencyFields = useMemo(() => {
    const set = new Set<Path<TFieldValues>>();
    const forEachField = (secs: FormBuilderSectionConfig<TFieldValues>[]) => {
      for (const section of secs) {
        if (section.tabs && section.tabs.length > 0) {
          for (const tab of section.tabs) {
            forEachField(tab.sections);
          }
        }
        for (const f of (section.fields ?? [])) {
          for (const d of f.dependencies || []) {
            set.add(d.field);
          }
        }
      }
    };
    forEachField(sections);
    return Array.from(set);
  }, [sections]);

  const hasDependencies = dependencyFields.length > 0;

  // Watch only dependency fields via useWatch; create a stable object map
  // Always call useWatch to satisfy hooks rules. Passing an empty array is safe and returns an empty array.
  const depValuesArr = useWatch({ control, name: dependencyFields });
  const watchedValues = useMemo(() => {
    if (!hasDependencies) return {} as Record<string, unknown>;
    const obj: Record<string, unknown> = {};
    dependencyFields.forEach((n, i) => {
      obj[n] = (depValuesArr as unknown[])[i];
    });
    return obj;
    // dependencyFields is stable from sections; depValuesArr changes only when values change
  }, [hasDependencies, dependencyFields, depValuesArr]);

  // Handle field dependencies
  // Queue dependency-driven value updates to avoid calling setValue during render
  const pendingValueUpdatesRef = useRef<Array<{ name: string; value: unknown }>>(
    []
  );

  const handleFieldDependencies = useCallback(
    (field: FormBuilderFieldConfig<TFieldValues, string | Path<TFieldValues>>) => {
      if (!hasDependencies || !field.dependencies) return {};

      const result: { disabled?: boolean; hidden?: boolean } = {};

      for (const dep of field.dependencies) {
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
              const currentValue = getValues(field.name as unknown as Path<TFieldValues>);
              if (currentValue !== dep.value) {
                // Defer the update to an effect to prevent state changes during render
                pendingValueUpdatesRef.current.push({
                  name: field.name as unknown as string,
                  value: dep.value,
                });
              }
            }
            break;
        }
      }

      return result;
    },
    [hasDependencies, watchedValues, getValues]
  );

  // Flush any pending setValue updates after watchedValues change
  useEffect(() => {
    if (pendingValueUpdatesRef.current.length === 0) return;
    const updatesMap = new Map<string, unknown>();
    // last write wins per field
    for (const { name, value } of pendingValueUpdatesRef.current) {
      updatesMap.set(name, value);
    }
    pendingValueUpdatesRef.current = [];
    for (const [name, value] of updatesMap) {
      const pathName = name as unknown as Path<TFieldValues>;
      const current = getValues(pathName);
      if (current !== value) {
        setValue(pathName, value as unknown as never, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
      }
    }
  }, [setValue, getValues]);

  // Handle field change with custom onChange
  const handleFieldChange = useCallback(
    (
      field: FormBuilderFieldConfig<TFieldValues, string | Path<TFieldValues>>,
      value: unknown,
      ...extras: unknown[]
    ) => {
      if (field.onChange) {
        field.onChange(value, extras, setValue, getValues);
      }
    },
    [setValue, getValues]
  );

  const handleFormSubmit = useCallback(
    async (data: TFieldValues) => {
      try {
        await onSubmit(data);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    },
    [onSubmit]
  );

  const handleReset = useCallback(() => {
    reset(generatedDefaultValues as unknown as import('react-hook-form').DefaultValues<TFieldValues>);
    onReset?.();
  }, [reset, generatedDefaultValues, onReset]);

  // Build SectionBuilder nodes from form sections/fields
  const sectionNodes = useMemo(
    () =>
      buildSectionNodes({
        sections,
        control,
        handleFieldDependencies,
        handleFieldChange,
        onFieldChange,
        getValues,
      }),
    [sections, control, handleFieldDependencies, handleFieldChange, onFieldChange, getValues],
  );

  const contextValue = useMemo(
    () => ({
      control,
      getValues,
      setValue,
      onFieldChange,
      handleFieldDependencies,
      handleFieldChange,
    }) satisfies FormBuilderContextValue<TFieldValues>,
    [control, getValues, setValue, onFieldChange, handleFieldDependencies, handleFieldChange],
  );

  return (
    <FormBuilderContext.Provider value={contextValue as unknown as FormBuilderContextValue<FieldValues>}>
      <div className={cn('space-y-6', className)}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className={cn('space-y-6', formClassName)}
        >
          <SectionBuilder sections={sectionNodes} />

          {showActions && (
            <div
              className={cn(
                'flex flex-col sm:flex-row gap-3',
                showActionsSeparator && 'pt-6',
                showActionsSeparator && 'border-t',
                actionsClassName
              )}
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="sm:order-last"
              >
                {isSubmitting ? 'Submitting...' : submitLabel}
              </Button>

              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  {cancelLabel}
                </Button>
              )}

              {onReset && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSubmitting}
                >
                  {resetLabel}
                </Button>
              )}

              {customActions}
            </div>
          )}
        </form>
      </div>
    </FormBuilderContext.Provider>
  );
}
