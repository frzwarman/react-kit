import { Autocomplete } from '../../../../../kit/components/autocomplete/Autocomplete'
import type { AutocompleteOption } from '../../../../../kit/components/autocomplete/types'
import type { FieldRenderProps } from './types'

export function AutocompleteField({ field, value, onChange, className }: FieldRenderProps) {
  const options: AutocompleteOption[] = (field.options ?? [])
    .filter((o): o is { label: string; value: string | number } => o.value !== null && o.value !== undefined)
    .map(o => ({ label: o.label, value: o.value as string | number }))

  return (
    <Autocomplete
      mode={field.autocompleteMode ?? 'client'}
      options={options}
      fetcher={field.fetcher}
      pageSize={field.pageSize}
      value={(value as string | number | null) ?? null}
      onChange={(val) => onChange(val)}
      placeholder={field.placeholder}
      searchPlaceholder={field.searchPlaceholder}
      renderOption={field.renderOption}
      disabled={field.disabled}
      className={className}
    />
  )
}
