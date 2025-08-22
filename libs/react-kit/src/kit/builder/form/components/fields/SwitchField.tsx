import { Switch } from '../../../../../shadcn/ui/switch'
import { Label } from '../../../../../shadcn/ui/label'
import { cn } from '../../../../../shadcn/lib/utils'
import type { FieldRenderProps } from './types'

export function SwitchField({ field, fieldPath, value, onChange, className }: FieldRenderProps) {
  const placement = field.labelPlacement ?? 'inline'

  if (placement === 'stacked') {
    const labelId = `${fieldPath}-label`
    return (
      <div className="space-y-2">
        <Label id={labelId} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Switch
          aria-labelledby={labelId}
          id={fieldPath}
          checked={(value as boolean) || false}
          onCheckedChange={onChange as (val: boolean) => void}
          disabled={field.disabled}
          className={cn(className)}
        />
      </div>
    )
  }

  if (placement === 'hidden') {
    return (
      <Switch
        id={fieldPath}
        checked={(value as boolean) || false}
        onCheckedChange={onChange as (val: boolean) => void}
        disabled={field.disabled}
        className={cn(className)}
      />
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={fieldPath}
        checked={(value as boolean) || false}
        onCheckedChange={onChange as (val: boolean) => void}
        disabled={field.disabled}
        className={cn(className)}
      />
      <Label htmlFor={fieldPath} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
    </div>
  )
}
