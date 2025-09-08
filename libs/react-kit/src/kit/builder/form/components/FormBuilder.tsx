import type React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm, useWatch, type Control, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '../../../../shadcn/lib/utils';
import { Button } from '../../../../shadcn/ui/button';
import { FormBuilderField } from './FormBuilderField';
import SectionBuilder from '../../section/SectionBuilder';
import type {
  SectionLayout,
  SectionGridOptions,
  SectionFlexOptions,
  SectionNode,
} from '../../section/types';
import type {
  AutocompleteFetcher,
  AutocompleteOption,
} from '../../../components/autocomplete/types';

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
    | 'switch'
    | 'radio'
    | 'date' // native input date
    | 'date_picker' // UI DatePicker
    | 'date_range' // UI DateRangePicker
    | 'month' // UI MonthPicker (single month Date)
    | 'month_range' // UI MonthRangePicker { start: Date, end: Date }
    | 'time' // UI TimePicker (Date with time part)
    | 'time_range' // UI TimeRangePicker { from: Date, to: Date }
    | 'date_time' // UI DateTimePicker (Date with date+time)
    | 'date_time_range' // UI DateTimeRangePicker { from: Date, to: Date }
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
  // New autocomplete features
  multiple?: boolean;
  allowCustomValue?: boolean;
  chipVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  chipClassName?: string;
  clearable?: boolean;
  initialSelectedOptions?: AutocompleteOption | AutocompleteOption[] | null;
  loadSelected?: (values: Array<string | number>) => Promise<AutocompleteOption[]>;
  validation?:
    | z.ZodType<unknown>
    | {
        pattern?: { value: RegExp; message: string };
        min?: { value: number; message: string };
        max?: { value: number; message: string };
        minLength?: { value: number; message: string };
        maxLength?: { value: number; message: string };
      };
  defaultValue?: unknown;
  fields?: FormBuilderFieldConfig[]; // For nested object/array fields
  dependencies?: {
    field: string;
    condition: (value: unknown) => boolean;
    action: 'show' | 'hide' | 'enable' | 'disable' | 'setValue';
    value?: unknown;
  }[];
  onChange?: (
    value: unknown,
    setValue: (field: string, value: unknown) => void,
    getValues: () => Record<string, unknown>
  ) => void;
  className?: string;
  gridCols?: number;
  rows?: number; // For textarea fields
  itemType?: string; // For array fields
  // Array field layout: default 'card'
  arrayLayout?: 'card' | 'table' | 'custom';
  // Custom renderer for array fields when arrayLayout === 'custom'
  arrayRender?: (params: {
    field: FormBuilderFieldConfig;
    control: Control<FieldValues>;
    fieldPath: string;
    value: unknown;
    onChange: (value: unknown) => void;
    addItem: () => void;
    removeItem: (index: number) => void;
    disabled?: boolean;
    rows?: { id: string }[]; // useFieldArray rows for stable rendering
  }) => React.ReactNode;
  // Optional styling for array layouts (used mainly for 'table')
  arrayColors?: {
    headerBgClass?: string; // e.g. 'bg-teal-700'
    headerTextClass?: string; // e.g. 'text-white'
    rowAltBgClass?: string; // e.g. 'bg-teal-50'
  };
  conditional?: {
    field: string;
    value: unknown;
  }; // For conditional field visibility
  hidden?: boolean; // Declarative hide
  // Label placement control across inputs
  labelPlacement?: 'stacked' | 'inline' | 'hidden';
  // Wrapper container className (applies to the field wrapper, not the input)
  wrapperClassName?: string;
  // Picker-specific optional props (passed through to components when applicable)
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Array<Date | { from: Date; to: Date }>;
  numberOfMonths?: number;
  popoverSide?: 'top' | 'right' | 'bottom' | 'left';
  showFooter?: boolean;
  cancelLabel?: string;
  applyLabel?: string;
  // Time picker specific
  timePrecision?: 'hour' | 'minute' | 'second';
  hourCycle?: 12 | 24;
  minuteStep?: number;
  secondStep?: number;
}

export interface FormBuilderSectionConfig {
  id?: string;
  title?: string;
  description?: string;
  fields?: FormBuilderFieldConfig[];
  variant?: 'card' | 'separator' | 'plain';
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  layout?: SectionLayout;
  grid?: SectionGridOptions;
  flex?: SectionFlexOptions;
  hidden?: boolean; // Declarative hide
  // Tabs layout support: when layout === 'tabs', provide tabs instead of direct fields
  tabs?: Array<{
    id: string;
    label: React.ReactNode;
    sections: FormBuilderSectionConfig[];
    className?: string;
    contentClassName?: string;
  }>;
  defaultTabId?: string;
  tabsListClassName?: string;
  tabsContentClassName?: string;
}

export interface FormBuilderProps {
  sections: FormBuilderSectionConfig[];
  schema?: z.ZodType<unknown>;
  defaultValues?: Record<string, unknown> | null;
  onSubmit: (data: unknown) => void | Promise<void>;
  onCancel?: () => void;
  onReset?: () => void;
  onFieldChange?: (
    name: string,
    value: unknown,
    allValues: Record<string, unknown>
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
  // UI: show a separator line above action buttons
  showActionsSeparator?: boolean;
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
  showActionsSeparator = true,
}: FormBuilderProps) {
  // Generate schema from field configs if not provided
  const generatedSchema = useMemo(() => {
    if (schema) return schema;

    const generateFieldSchema = (
      field: FormBuilderFieldConfig
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
            for (const subField of field.fields) {
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
                ? generateFieldSchema(field.fields[0])
                : z.object(
                    field.fields.reduce((acc, subField) => {
                      acc[subField.name] = generateFieldSchema(subField);
                      return acc;
                    }, {} as Record<string, z.ZodType<unknown>>)
                  );
            fieldSchema = z.array(arrayItemSchema);
          } else {
            fieldSchema = z.array(z.unknown());
          }
          break;
        default:
          fieldSchema = z.string();
      }

      return field.required ? fieldSchema : fieldSchema.optional();
    };

    const schemaObject: Record<string, z.ZodType<unknown>> = {};

    const forEachField = (secs: FormBuilderSectionConfig[]) => {
      for (const section of secs) {
        // Traverse tabs if present
        if (section.tabs && section.tabs.length > 0) {
          for (const tab of section.tabs) {
            forEachField(tab.sections);
          }
        }
        for (const field of (section.fields ?? [])) {
          schemaObject[field.name] = generateFieldSchema(field);
        }
      }
    };

    forEachField(sections);

    return z.object(schemaObject);
  }, [sections, schema]);

  // Generate default values from field configs
  const generatedDefaultValues = useMemo(() => {
    const values: Record<string, unknown> = { ...defaultValues };

    const processFields = (fields: FormBuilderFieldConfig[]) => {
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

    const forEachSection = (secs: FormBuilderSectionConfig[]) => {
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

  const form = useForm<FieldValues>({
    // Dynamic schema shape: cast to any to satisfy resolver generics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(generatedSchema as any) as unknown as import('react-hook-form').Resolver<FieldValues, any, FieldValues>,
    defaultValues: generatedDefaultValues as FieldValues,
  });

  const { control, handleSubmit, reset, setValue, getValues } = form;

  // Determine dependency fields to watch
  const dependencyFields = useMemo(() => {
    const set = new Set<string>();
    const forEachField = (secs: FormBuilderSectionConfig[]) => {
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
    (field: FormBuilderFieldConfig) => {
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
              const currentValue = getValues(field.name);
              if (currentValue !== dep.value) {
                // Defer the update to an effect to prevent state changes during render
                pendingValueUpdatesRef.current.push({
                  name: field.name,
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
      const current = getValues(name);
      if (current !== value) {
        setValue(name, value, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
      }
    }
  }, [setValue, getValues]);

  // Handle field change with custom onChange
  const handleFieldChange = useCallback(
    (field: FormBuilderFieldConfig, value: unknown) => {
      if (field.onChange) {
        field.onChange(value, setValue, getValues);
      }
    },
    [setValue, getValues]
  );

  const handleFormSubmit = useCallback(
    async (data: unknown) => {
      try {
        await onSubmit(data);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    },
    [onSubmit]
  );

  const handleReset = useCallback(() => {
    reset(generatedDefaultValues);
    onReset?.();
  }, [reset, generatedDefaultValues, onReset]);

  // Build SectionBuilder nodes from form sections/fields
  const sectionNodes: SectionNode[] = useMemo(() => {
    const buildLeavesFromFields = (fields?: FormBuilderFieldConfig[]): SectionNode['children'] =>
      (fields ?? [])
        .map((field) => {
          const fieldState = handleFieldDependencies(field);
          if (field.hidden || fieldState.hidden) return null;

          const spanMd = Math.max(1, Math.min(12, field.gridCols ?? 1));

          return {
            key: field.name,
            span: { base: 1, md: spanMd },
            className: field.wrapperClassName,
            hidden: field.hidden,
            content: (
              <FormBuilderField
                key={field.name}
                field={{
                  ...field,
                  disabled: field.disabled || fieldState.disabled,
                }}
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
        .filter(Boolean) as SectionNode['children'];

    const buildSectionNode = (
      section: FormBuilderSectionConfig,
      sectionIndex: number,
    ): SectionNode => {
      const baseNode: SectionNode = {
        id: section.id ?? `section-${sectionIndex}`,
        title: section.title,
        subtitle: section.description,
        variant: section.variant ?? 'plain',
        className: section.className,
        layout: section.layout ?? (section.tabs && section.tabs.length > 0 ? 'tabs' : 'grid'),
        grid: section.grid ?? { cols: 1, mdCols: 2, gap: 'gap-4' },
        flex: section.flex,
        hidden: section.hidden,
      };

      // Tabs layout
      if (baseNode.layout === 'tabs' && section.tabs && section.tabs.length > 0) {
        baseNode.defaultTabId = section.defaultTabId ?? section.tabs[0]?.id;
        baseNode.tabsListClassName = section.tabsListClassName;
        baseNode.tabsContentClassName = section.tabsContentClassName;
        baseNode.tabs = section.tabs.map((tab, _tabIdx) => {
          // Each tab can contain multiple sub-sections; wrap them under a container node
          const nestedNodes = tab.sections.map((subSection, subIdx) => buildSectionNode(subSection, subIdx));
          const containerNode: SectionNode = {
            id: `${baseNode.id}-tab-${tab.id}`,
            title: undefined,
            subtitle: undefined,
            variant: 'plain',
            layout: 'grid',
            grid: section.grid ?? { cols: 1, mdCols: 2, gap: 'gap-4' },
            children: nestedNodes,
          } as SectionNode;
          return {
            id: tab.id,
            label: tab.label,
            className: tab.className,
            contentClassName: tab.contentClassName,
            node: containerNode,
          };
        });
        return baseNode;
      }

      // Regular non-tab section with direct fields
      baseNode.children = buildLeavesFromFields(section.fields);
      return baseNode;
    };

    return sections.map((section, sectionIndex) => buildSectionNode(section, sectionIndex));
  }, [
    sections,
    control,
    handleFieldDependencies,
    handleFieldChange,
    onFieldChange,
    getValues,
  ]);

  return (
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
  );
}
