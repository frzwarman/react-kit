import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useWatch, type FieldValues, type Path } from 'react-hook-form';
import { cn } from '../../../../shadcn/lib/utils';
import { Button } from '../../../../shadcn/ui/button';
import SectionBuilder from '../../section/SectionBuilder';
import { buildSectionNodes } from './sectionNodes';
import {
  FormBuilderContext,
  type FormBuilderContextValue,
} from './FormBuilderContext';
import type {
  FormBuilderProps,
  FormBuilderFieldConfig,
  FormBuilderSectionConfig,
} from '../types';
import { useFormBuilder } from '../hooks/useFormBuilder';

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
  // Always call useFormBuilder hook (hooks must be called unconditionally)
  const { form: generatedForm } = useFormBuilder({
    sections,
    schema,
    defaultValues: defaultValues ?? undefined,
  });

  // Use provided form or fall back to generated form
  const activeForm = form ?? generatedForm;

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
        for (const f of section.fields ?? []) {
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
  const pendingValueUpdatesRef = useRef<
    Array<{ name: string; value: unknown }>
  >([]);

  const handleFieldDependencies = useCallback(
    (
      field: FormBuilderFieldConfig<TFieldValues, string | Path<TFieldValues>>,
    ) => {
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
              const currentValue = getValues(
                field.name as unknown as Path<TFieldValues>,
              );
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
    [hasDependencies, watchedValues, getValues],
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
    [setValue, getValues],
  );

  const handleFormSubmit = useCallback(
    async (data: TFieldValues) => {
      try {
        await onSubmit(data);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    },
    [onSubmit],
  );

  const handleReset = useCallback(() => {
    reset();
    onReset?.();
  }, [reset, onReset]);

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
    [
      sections,
      control,
      handleFieldDependencies,
      handleFieldChange,
      onFieldChange,
      getValues,
    ],
  );

  const contextValue = useMemo(
    () =>
      ({
        control,
        getValues,
        setValue,
        onFieldChange,
        handleFieldDependencies,
        handleFieldChange,
      }) satisfies FormBuilderContextValue<TFieldValues>,
    [
      control,
      getValues,
      setValue,
      onFieldChange,
      handleFieldDependencies,
      handleFieldChange,
    ],
  );

  return (
    <FormBuilderContext.Provider
      value={contextValue as unknown as FormBuilderContextValue<FieldValues>}
    >
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
                actionsClassName,
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
