import { useMemo } from 'react';
import { useForm, type FieldValues, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { FormBuilderFieldConfig, FormBuilderSectionConfig } from '../types';

export interface UseFormBuilderOptions<TFieldValues extends FieldValues = FieldValues> {
  sections: FormBuilderSectionConfig<TFieldValues>[];
  defaultValues?: Partial<TFieldValues>;
  schema?: z.ZodType<TFieldValues>;
}

export interface UseFormBuilderReturn<TFieldValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TFieldValues>;
  sections: FormBuilderSectionConfig<TFieldValues>[];
  schema: z.ZodType<unknown>;
}

export function useFormBuilder<TFieldValues extends FieldValues = FieldValues>(
  options: UseFormBuilderOptions<TFieldValues>
): UseFormBuilderReturn<TFieldValues> {
  const { sections, defaultValues, schema: providedSchema } = options;

  // Generate schema from field configs if not provided
  const generatedSchema = useMemo(() => {
    if (providedSchema) return providedSchema;

    const generateFieldSchema = (
      field: FormBuilderFieldConfig<TFieldValues, string>
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
        const validationObj = field.validation as Record<string, unknown>;
        let baseSchema: z.ZodType<unknown>;

        switch (field.type) {
          case 'email':
            baseSchema = z.string().email(
              (validationObj.email as { message?: string })?.message || 'Invalid email address'
            );
            break;
          case 'number':
            baseSchema = z.number();
            break;
          case 'checkbox':
          case 'switch':
            baseSchema = z.boolean();
            break;
          case 'select':
          case 'radio':
          case 'autocomplete':
            // Check if field supports multiple values
            if ((field as { multiple?: boolean }).multiple) {
              // Multiple: array of string/number/boolean
              baseSchema = z.array(z.union([z.string(), z.number(), z.boolean()]));
            } else {
              // Single: string, number, boolean, or null (when empty)
              baseSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
            }
            break;
          case 'file':
            baseSchema = z.array(z.unknown());
            break;
          case 'date_picker':
          case 'date':
          case 'time':
          case 'date_time':
          case 'month':
            baseSchema = z.date();
            break;
          case 'date_range':
          case 'time_range':
          case 'date_time_range':
          case 'month_range':
            baseSchema = z.object({
              from: z.date().optional().nullable(),
              to: z.date().optional().nullable(),
            }).nullable();
            break;
          default:
            baseSchema = z.string();
        }

        if (validationObj.min && baseSchema instanceof z.ZodNumber) {
          baseSchema = baseSchema.min(
            (validationObj.min as { value: number }).value,
            (validationObj.min as { message?: string }).message
          );
        }
        if (validationObj.max && baseSchema instanceof z.ZodNumber) {
          baseSchema = baseSchema.max(
            (validationObj.max as { value: number }).value,
            (validationObj.max as { message?: string }).message
          );
        }
        if (validationObj.minLength && baseSchema instanceof z.ZodString) {
          baseSchema = baseSchema.min(
            (validationObj.minLength as { value: number }).value,
            (validationObj.minLength as { message?: string }).message
          );
        }
        if (validationObj.maxLength && baseSchema instanceof z.ZodString) {
          baseSchema = baseSchema.max(
            (validationObj.maxLength as { value: number }).value,
            (validationObj.maxLength as { message?: string }).message
          );
        }
        // Array item count constraints
        if (baseSchema instanceof z.ZodArray) {
          let arr = baseSchema as z.ZodArray<z.ZodTypeAny>;
          if (validationObj.minItems) {
            arr = arr.min(
              (validationObj.minItems as { value: number }).value,
              (validationObj.minItems as { message?: string }).message,
            );
          }
          if (validationObj.maxItems) {
            arr = arr.max(
              (validationObj.maxItems as { value: number }).value,
              (validationObj.maxItems as { message?: string }).message,
            );
          }
          // If required and file field, enforce at least 1 item when no explicit minItems
          if (field.type === 'file' && field.required && !validationObj.minItems) {
            arr = arr.min(1, `${field.label} requires at least 1 file`);
          }
          baseSchema = arr;
        }

        // Make optional fields accept undefined/null/empty FIRST (before any refinements)
        if (!field.required) {
          return baseSchema.nullish(); // Accepts null, undefined, and the base type
        }

        // For required fields, add validation
        // For string fields, enforce non-empty when required (only if minLength not already set)
        if (baseSchema instanceof z.ZodString && !validationObj.minLength) {
          baseSchema = baseSchema.min(1, `${field.label || field.name} is required`);
        }

        // For union fields (select/radio/autocomplete), add refinement for required validation
        if (baseSchema instanceof z.ZodUnion) {
          baseSchema = baseSchema.refine(
            (val) => val !== null && val !== undefined,
            { message: `${field.label || field.name} is required` }
          );
        }

        return baseSchema;
      }

      let fieldSchema: z.ZodType<unknown>;

      const fieldLabel = field.label || field.name;

      switch (field.type) {
        case 'email':
          fieldSchema = z.string().email('Please enter a valid email address');
          break;
        case 'number':
          fieldSchema = z.number({
            message: `${fieldLabel} must be a number`,
          });
          break;
        case 'checkbox':
        case 'switch':
          fieldSchema = z.boolean({
            message: `${fieldLabel} must be true or false`,
          });
          break;
        case 'select':
        case 'radio':
        case 'autocomplete':
          // Check if field supports multiple values
          if ((field as { multiple?: boolean }).multiple) {
            // Multiple: array of string/number/boolean
            fieldSchema = z.array(z.union([z.string(), z.number(), z.boolean()]));
          } else {
            // Single: string, number, boolean, or null (when empty)
            fieldSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
          }
          break;
        case 'file': {
          let arr = z.array(z.unknown());
          // If required, ensure at least 1 file
          if (field.required) {
            arr = arr.min(1, `Please select at least 1 file for ${fieldLabel}`);
          }
          fieldSchema = arr;
          break;
        }
        case 'date_picker':
        case 'date':
        case 'time':
        case 'date_time':
        case 'month':
          fieldSchema = z.date({
            message: `${fieldLabel} must be a valid date`,
          });
          break;
        case 'date_range':
        case 'time_range':
        case 'date_time_range':
        case 'month_range':
          fieldSchema = z.object({
            from: z.date().optional().nullable(),
            to: z.date().optional().nullable(),
          }).nullable();
          break;
        case 'object':
          if (field.fields) {
            const nestedSchema: Record<string, z.ZodType<unknown>> = {};
            for (const subField of field.fields) {
              nestedSchema[subField.name] = generateFieldSchema(subField);
            }
            fieldSchema = z.object(nestedSchema);
          } else {
            fieldSchema = z.object({});
          }
          break;
        case 'array':
          if (field.fields && field.fields.length > 0) {
            const itemSchema: Record<string, z.ZodType<unknown>> = {};
            for (const subField of field.fields) {
              itemSchema[subField.name] = generateFieldSchema(subField);
            }
            fieldSchema = z.array(z.object(itemSchema));
          } else {
            fieldSchema = z.array(z.unknown());
          }
          break;
        case 'custom_field':
          fieldSchema = z.any();
          break;
        default:
          // Default to string for text, textarea, password, etc.
          fieldSchema = z.string();
      }

      // Make optional fields accept undefined/null/empty FIRST (before any refinements)
      if (!field.required) {
        return fieldSchema.nullish(); // Accepts null, undefined, and the base type
      }

      // For required fields, add validation
      // For string fields, enforce non-empty when required
      if (fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(1, `${fieldLabel} is required`);
      }

      // For array fields (multiple select/autocomplete), enforce at least 1 item when required
      if (fieldSchema instanceof z.ZodArray) {
        fieldSchema = fieldSchema.min(1, `${fieldLabel} requires at least 1 selection`);
      }

      // For union fields (single select/radio/autocomplete), add refinement for required validation
      if (fieldSchema instanceof z.ZodUnion) {
        fieldSchema = fieldSchema.refine(
          (val) => val !== null && val !== undefined,
          { message: `${fieldLabel} is required` }
        );
      }

      return fieldSchema;
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
        // Process fields
        for (const field of section.fields ?? []) {
          schemaObject[field.name] = generateFieldSchema(field);
        }
      }
    };

    forEachField(sections);

    return z.object(schemaObject) as unknown as z.ZodType<TFieldValues>;
  }, [sections, providedSchema]);

  // Generate default values from field configs
  const generatedDefaultValues = useMemo(() => {
    const values: Record<string, unknown> = { ...((defaultValues ?? {}) as Record<string, unknown>) };

    const processFields = (fields: FormBuilderFieldConfig<TFieldValues, string>[]) => {
      for (const field of fields) {
        // Skip if value already exists
        if (values[field.name] !== undefined) {
          continue;
        }

        // Use explicit defaultValue if provided
        if (field.defaultValue !== undefined) {
          values[field.name] = field.defaultValue;
          continue;
        }

        // Set sensible defaults based on field type to avoid undefined
        switch (field.type) {
          case 'text':
          case 'email':
          case 'textarea':
          case 'password':
          case 'select':
          case 'radio':
            values[field.name] = '';
            break;
          case 'number':
            values[field.name] = null;
            break;
          case 'checkbox':
          case 'switch':
            values[field.name] = false;
            break;
          case 'file':
          case 'array':
            values[field.name] = [];
            break;
          case 'object':
            if (field.fields) {
              const nestedValues: Record<string, unknown> = {};
              for (const subField of field.fields) {
                if (subField.defaultValue !== undefined) {
                  nestedValues[subField.name] = subField.defaultValue;
                }
              }
              values[field.name] = nestedValues;
            } else {
              values[field.name] = {};
            }
            break;
          case 'date_picker':
          case 'date':
          case 'time':
          case 'date_time':
          case 'month':
            values[field.name] = null;
            break;
          case 'date_range':
          case 'time_range':
          case 'date_time_range':
          case 'month_range':
            values[field.name] = null;
            break;
          case 'autocomplete':
            values[field.name] = field.multiple ? [] : null;
            break;
          default:
            // For unknown types, use empty string as safe default
            values[field.name] = '';
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

  // Create form with validation
  const form = useForm<TFieldValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(generatedSchema as any) as unknown as import('react-hook-form').Resolver<TFieldValues, any, TFieldValues>,
    defaultValues: generatedDefaultValues as unknown as import('react-hook-form').DefaultValues<TFieldValues>,
  });

  return {
    form,
    sections,
    schema: generatedSchema,
  };
}
