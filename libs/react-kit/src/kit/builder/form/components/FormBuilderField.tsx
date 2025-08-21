import { useCallback } from 'react';
import { Control, useController, useFieldArray } from 'react-hook-form';
import { cn } from '../../../../shadcn/lib/utils';
import { Button } from '../../../../shadcn/ui/button';
import { Input } from '../../../../shadcn/ui/input';
import { Textarea } from '../../../../shadcn/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shadcn/ui/select';
import { Checkbox } from '../../../../shadcn/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../../../shadcn/ui/radio-group';
import { Label } from '../../../../shadcn/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shadcn/ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { FormBuilderFieldConfig } from './FormBuilder';
import { Autocomplete } from '../../../components/autocomplete/Autocomplete';
import type { AutocompleteOption } from '../../../components/autocomplete/types';

export interface FormBuilderFieldProps {
  field: FormBuilderFieldConfig;
  control: Control<any>;
  onChange?: (value: any) => void;
  onFieldChange?: (name: string, value: any, allValues: Record<string, any>) => void;
  parentPath?: string;
}

export function FormBuilderField({ field, control, onChange, onFieldChange, parentPath }: FormBuilderFieldProps) {
  const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name;
  const NULL_SENTINEL = '__NULL__';

  const {
    field: controllerField,
    fieldState: { error },
  } = useController({
    name: fieldPath,
    control,
    disabled: field.disabled,
  });

  const handleChange = useCallback((value: any) => {
    controllerField.onChange(value);
    onChange?.(value);
  }, [controllerField.onChange, onChange]);

  const renderBasicField = () => {
    const baseProps = {
      id: fieldPath,
      disabled: field.disabled,
      placeholder: field.placeholder,
      className: cn(
        error && 'border-destructive focus-visible:ring-destructive',
        field.className,
      ),
    };

    switch (field.type) {
      case 'autocomplete': {
        const options: AutocompleteOption[] = (field.options ?? [])
          .filter((o): o is { label: string; value: string | number } => o.value !== null && o.value !== undefined)
          .map(o => ({ label: o.label, value: o.value }));
        return (
          <Autocomplete
            mode={field.autocompleteMode ?? 'client'}
            options={options}
            fetcher={field.fetcher}
            pageSize={field.pageSize}
            value={(controllerField.value as string | number | null) ?? null}
            onChange={(val) => handleChange(val)}
            placeholder={field.placeholder}
            searchPlaceholder={field.searchPlaceholder}
            renderOption={field.renderOption}
            disabled={field.disabled}
            className={baseProps.className}
          />
        );
      }
      case 'text':
      case 'email':
      case 'password':
        return (
          <Input
            {...baseProps}
            type={field.type}
            value={controllerField.value || ''}
            onChange={e => handleChange(e.target.value)}
          />
        );

      case 'number':
        return (
          <Input
            {...baseProps}
            type="number"
            value={controllerField.value || ''}
            onChange={e => handleChange(Number(e.target.value))}
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...baseProps}
            value={controllerField.value || ''}
            onChange={e => handleChange(e.target.value)}
            rows={4}
          />
        );

      case 'select': {
        const toUiValue = (val: unknown) => (val === null || val === undefined ? NULL_SENTINEL : String(val));
        const fromUiValue = (val: string) => {
          const match = field.options?.find(opt => toUiValue(opt.value) === val);
          return match ? match.value : null;
        };
        return (
          <Select
            value={toUiValue(controllerField.value)}
            onValueChange={val => handleChange(fromUiValue(val))}
            disabled={field.disabled}
          >
            <SelectTrigger className={baseProps.className}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={toUiValue(option.value)} value={toUiValue(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      case 'checkbox': {
        const placement = field.labelPlacement ?? 'inline';
        if (placement === 'stacked') {
          const labelId = `${fieldPath}-label`;
          return (
            <div className="space-y-2">
              <Label id={labelId} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Checkbox
                aria-labelledby={labelId}
                id={fieldPath}
                checked={controllerField.value || false}
                onCheckedChange={handleChange}
                disabled={field.disabled}
                className={cn(error && 'border-destructive', field.className)}
              />
            </div>
          );
        }
        if (placement === 'hidden') {
          return (
            <Checkbox
              id={fieldPath}
              checked={controllerField.value || false}
              onCheckedChange={handleChange}
              disabled={field.disabled}
              className={cn(error && 'border-destructive', field.className)}
            />
          );
        }
        // inline (default)
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldPath}
              checked={controllerField.value || false}
              onCheckedChange={handleChange}
              disabled={field.disabled}
              className={cn(error && 'border-destructive', field.className)}
            />
            <Label htmlFor={fieldPath} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
          </div>
        );
      }

      case 'radio': {
        const toUiValue = (val: unknown) => (val === null || val === undefined ? NULL_SENTINEL : String(val));
        const fromUiValue = (val: string) => {
          const match = field.options?.find(opt => toUiValue(opt.value) === val);
          return match ? match.value : null;
        };
        return (
          <RadioGroup
            value={toUiValue(controllerField.value)}
            onValueChange={val => handleChange(fromUiValue(val))}
            disabled={field.disabled}
            className={field.className}
          >
            {field.options?.map(option => (
              <div key={toUiValue(option.value)} className="flex items-center space-x-2">
                <RadioGroupItem value={toUiValue(option.value)} id={`${fieldPath}-${toUiValue(option.value)}`} />
                <Label htmlFor={`${fieldPath}-${toUiValue(option.value)}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      }

      case 'date':
        return (
          <Input
            {...baseProps}
            type="date"
            value={controllerField.value ? new Date(controllerField.value).toISOString().split('T')[0] : ''}
            onChange={e => handleChange(e.target.value ? new Date(e.target.value) : null)}
          />
        );

      case 'file':
        return (
          <Input
            {...baseProps}
            type="file"
            onChange={e => handleChange(e.target.files?.[0] || null)}
          />
        );

      default:
        return (
          <Input
            {...baseProps}
            value={controllerField.value || ''}
            onChange={e => handleChange(e.target.value)}
          />
        );
    }
  };

  const renderObjectField = () => {
    if (!field.fields) return null;

    return (
      <Card className={field.className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{field.label}</CardTitle>
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {field.fields.map(subField => (
              <FormBuilderField
                key={subField.name}
                field={subField}
                control={control}
                parentPath={fieldPath}
                onChange={onChange}
                onFieldChange={onFieldChange}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderArrayField = () => {
    const { fields, append, remove } = useFieldArray({
      control,
      name: fieldPath,
    });

    const addItem = () => {
      if (field.fields && field.fields.length === 1) {
        // Single field array (e.g., array of strings)
        const defaultValue = field.fields[0].defaultValue || '';
        append(defaultValue);
      }
      else if (field.fields) {
        // Object array
        const defaultObject: Record<string, any> = {};
        field.fields.forEach((subField) => {
          defaultObject[subField.name] = subField.defaultValue || '';
        });
        append(defaultObject);
      }
      else {
        append('');
      }
    };

    return (
      <Card className={field.className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{field.label}</CardTitle>
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              disabled={field.disabled}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No items added yet. Click "Add Item" to get started.
            </p>
          ) : (
            fields.map((item, index) => (
              <Card key={item.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Item
                        {index + 1}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={field.disabled}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {field.fields && field.fields.length === 1 ? (
                    // Single field array
                    <FormBuilderField
                      field={{
                        ...field.fields[0],
                        name: field.fields[0].name,
                        label: field.fields[0].label || 'Value',
                      }}
                      control={control}
                      parentPath={`${fieldPath}.${index}`}
                      onChange={onChange}
                    />
                  ) : field.fields ? (
                    // Object array
                    <div className="grid gap-4 md:grid-cols-2">
                      {field.fields.map(subField => (
                        <FormBuilderField
                          key={subField.name}
                          field={subField}
                          control={control}
                          parentPath={`${fieldPath}.${index}`}
                          onChange={onChange}
                          onFieldChange={onFieldChange}
                        />
                      ))}
                    </div>
                  ) : (
                    // Fallback for arrays without field definitions
                    <Input
                      value={controllerField.value?.[index] || ''}
                      onChange={(e) => {
                        const newArray = [...(controllerField.value || [])];
                        newArray[index] = e.target.value;
                        handleChange(newArray);
                      }}
                      placeholder={`Item ${index + 1}`}
                      disabled={field.disabled}
                    />
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    );
  };

  if (field.type === 'object') {
    return renderObjectField();
  }

  if (field.type === 'array') {
    return renderArrayField();
  }

  // For checkbox, label may be inline/stacked/hidden handled inside renderBasicField
  if (field.type === 'checkbox') {
    return (
      <div className={cn('space-y-2', field.gridCols && `md:col-span-${field.gridCols}`)}>
        {renderBasicField()}
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
  if (placement === 'hidden') {
    return (
      <div className={cn('space-y-2', field.gridCols && `md:col-span-${field.gridCols}`)}>
        {renderBasicField()}
        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}
        {error && (
          <p className="text-sm text-destructive">{error.message}</p>
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
          {renderBasicField()}
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
      {renderBasicField()}
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
