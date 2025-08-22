import { useCallback } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import { cn } from '../../../../shadcn/lib/utils';
import { Label } from '../../../../shadcn/ui/label';
import { FormBuilderFieldConfig } from './FormBuilder';
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
  FileField,
  ObjectField,
  ArrayField,
} from './fields';

export interface FormBuilderFieldProps {
  field: FormBuilderFieldConfig;
  control: Control<FieldValues>;
  onChange?: (value: unknown) => void;
  onFieldChange?: (name: string, value: unknown, allValues: Record<string, unknown>) => void;
  parentPath?: string;
}

export function FormBuilderField({ field, control, onChange, parentPath }: FormBuilderFieldProps) {
  const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;

  const {
    field: controllerField,
    fieldState: { error },
  } = useController({
    name: fieldPath,
    control,
    disabled: field.disabled,
  });

  const handleChange = useCallback((value: unknown) => {
    controllerField.onChange(value);
    onChange?.(value);
  }, [controllerField.onChange, onChange]);
  const baseClassName = cn(
    error && 'border-destructive focus-visible:ring-destructive',
    field.className,
  );

  const renderField = () => {
    switch (field.type) {
      case 'autocomplete':
        return (
          <AutocompleteField
            field={field}
            control={control}
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
            control={control}
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
            control={control}
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
            control={control}
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
            control={control}
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
            control={control}
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
            control={control}
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
            control={control}
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
            control={control}
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
            control={control}
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
            control={control}
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
            control={control}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
      default:
        return (
          <TextField
            field={field}
            control={control}
            fieldPath={fieldPath}
            value={controllerField.value}
            onChange={handleChange}
            className={baseClassName}
          />
        );
    }
  };

  // For checkbox/switch, label is handled inside the specific field component
  if (field.type === 'checkbox' || field.type === 'switch') {
    return (
      <div className={cn('space-y-2', field.gridCols && `md:col-span-${field.gridCols}`)}>
        {renderField()}
        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}
        {error && (
          <p className="text-sm text-destructive">{error.message}</p>
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
          <p className="text-sm text-destructive">{error.message}</p>
        )}
      </div>
    );
  }

  if (placement === 'inline' && field.type !== 'array') {
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
          <p className="text-sm text-destructive">{error.message}</p>
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
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
}

export default FormBuilderField;
