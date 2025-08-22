import { Input } from '../../../../../shadcn/ui/input'
import type { FieldRenderProps } from './types'

export function FileField({ field, onChange, className }: FieldRenderProps) {
  return (
    <Input
      className={className}
      disabled={field.disabled}
      placeholder={field.placeholder}
      type="file"
      onChange={(e) => onChange((e.target as HTMLInputElement).files?.[0] || null)}
    />
  )
}
