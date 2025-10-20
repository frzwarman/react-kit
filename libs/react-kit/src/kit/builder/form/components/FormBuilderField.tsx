import { useCallback } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { cn } from '../../../../shadcn/lib/utils';
import { Label } from '../../../../shadcn/ui/label';
import type { FormBuilderFieldConfig } from '../types';
import {
  AutocompleteField,
  TextField,
  NumberField,
  TextareaField,
  SelectField,
  CheckboxField,
  SwitchField,
  RadioField,
  DateField,
  DatePickerField,
  DateRangePickerField,
  MonthPickerField,
  MonthRangePickerField,
  TimePickerField,
  TimeRangePickerField,
  DateTimePickerField,
  DateTimeRangePickerField,
  FileField,
  ObjectField,
  ArrayField,
} from './fields';

export interface FormBuilderFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends string | Path<TFieldValues> = Path<TFieldValues>
> {
  field: FormBuilderFieldConfig<TFieldValues, TName>;
  control: Control<TFieldValues>;
  onChange?: (value: unknown, ...extras: unknown[]) => void;
  onFieldChange?: (name: import('react-hook-form').Path<TFieldValues> | string, value: unknown, allValues: TFieldValues) => void;
  parentPath?: string;
}

export function FormBuilderField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends string | Path<TFieldValues> = Path<TFieldValues>
>({ field, control, onChange, parentPath }: FormBuilderFieldProps<TFieldValues, TName>) {
  const fieldPath = parentPath ? `${parentPath}.${field.name}` : (field.name as string);

  const {
    field: controllerField,
    fieldState: { error },
  } = useController<TFieldValues>({
    name: fieldPath as unknown as Path<TFieldValues>,
    control,
    disabled: field.disabled,
  });

  const handleChange = useCallback((value: unknown, ...extras: unknown[]) => {
    // Only patch the RHF value with the first argument (the canonical value)
    controllerField.onChange(value);
    // Forward any extra metadata upstream (e.g., option, raw)
    onChange?.(value, ...extras);
  }, [controllerField, onChange]);
  const baseClassName = cn(
    error && 'border-destructive focus-visible:ring-destructive',
    field.className,
  );

  const renderField = () => {
    switch (field.type) {
      case 'hidden':
        return (
          <input
            id={fieldPath}
            type="hidden"
            name={controllerField.name}
            value={controllerField.value ?? ''}
            onChange={(event) => handleChange(event.target.value)}
            onBlur={controllerField.onBlur}
            ref={controllerField.ref}
          />
        );
      case 'autocomplete':
        return (
          <AutocompleteField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'text':
      case 'email':
      case 'password':
        return (
          <TextField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'number':
        return (
          <NumberField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'textarea':
        return (
          <TextareaField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'select':
        return (
          <SelectField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'checkbox':
        return (
          <CheckboxField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'switch':
        return (
          <SwitchField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'radio':
        return (
          <RadioField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'date':
        return (
          <DateField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'date_picker':
        return (
          <DatePickerField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'date_range':
        return (
          <DateRangePickerField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'month':
        return (
          <MonthPickerField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'month_range':
        return (
          <MonthRangePickerField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'time':
        return (
          <TimePickerField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'time_range':
        return (
          <TimeRangePickerField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'date_time':
        return (
          <DateTimePickerField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'date_time_range':
        return (
          <DateTimeRangePickerField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'file':
        return (
          <FileField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'object':
        return (
          <ObjectField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'array':
        return (
          <ArrayField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      case 'custom_field':
        return field.customRender?.({
          field,
          fieldPath,
          control,
          value: controllerField.value,
          handleChange
        });
      default:
        return (
          <TextField
            field={field}
            control={control as unknown as Control<FieldValues>}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
    }
  };

  if (field.type === 'hidden') {
    return renderField();
  }

  // For checkbox/switch, label is handled inside the specific field component
  if (field.type === 'checkbox' || field.type === 'switch') {
    return (
      <div className={cn('space-y-2', field.gridCols && `md:col-span-${field.gridCols}`)}>
        {renderField()}
        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}
        {error && (
          <p className="text-sm font-medium text-destructive" role="alert" aria-live="polite">
            {error.message}
          </p>
        )}
      </div>
    );
  }

  // Non-checkbox fields: support labelPlacement
  const placement = field.labelPlacement ?? 'stacked';
  if (placement === 'hidden' || field.type === 'array') {
    return (
      <div className={cn('space-y-2', field.gridCols && `md:col-span-${field.gridCols}`)}>
        {renderField()}
        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}
        {error && (
          <p className="text-sm font-medium text-destructive" role="alert" aria-live="polite">
            {error.message}
          </p>
        )}
      </div>
    );
  }

  if (placement === 'inline') {
    return (
      <div className={cn('space-y-1', field.gridCols && `md:col-span-${field.gridCols}`)}>
        <div className="flex items-center gap-2">
          <Label htmlFor={fieldPath} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {renderField()}
        </div>
        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}
        {error && (
          <p className="text-sm font-medium text-destructive" role="alert" aria-live="polite">
            {error.message}
          </p>
        )}
      </div>
    );
  }

  // stacked (default)
  return (
    <div className={cn('space-y-2', field.gridCols && `md:col-span-${field.gridCols}`)}>
      <Label htmlFor={fieldPath} className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      {error && (
        <p className="text-sm font-medium text-destructive" role="alert" aria-live="polite">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default FormBuilderField;
