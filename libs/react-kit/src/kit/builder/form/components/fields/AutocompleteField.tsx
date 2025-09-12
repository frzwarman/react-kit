import { Autocomplete } from '../../../../../kit/components/autocomplete/Autocomplete'
import type { AutocompleteOption } from '../../../../../kit/components/autocomplete/types'
import type { FieldRenderProps } from './types'

export function AutocompleteField({ field, value, onChange, className }: FieldRenderProps) {
  const options: AutocompleteOption[] = (field.options ?? [])
    .filter((o): o is { label: string; value: string | number } => o.value !== null && o.value !== undefined)
    .map(o => ({ label: o.label, value: o.value as string | number, raw: (o as unknown as AutocompleteOption).raw }))

  // Shape defaultValue according to single/multiple
  let defaultValueShaped: string | number | null | Array<string | number> | undefined = undefined
  if (field.defaultValue !== undefined) {
    if (field.multiple) {
      if (Array.isArray(field.defaultValue)) {
        defaultValueShaped = field.defaultValue.filter((v): v is string | number => typeof v === 'string' || typeof v === 'number')
      } else if (field.defaultValue === null || field.defaultValue === undefined) {
        defaultValueShaped = []
      } else if (typeof field.defaultValue === 'string' || typeof field.defaultValue === 'number') {
        defaultValueShaped = [field.defaultValue]
      } else {
        defaultValueShaped = []
      }
    } else {
      defaultValueShaped = (typeof field.defaultValue === 'string' || typeof field.defaultValue === 'number' || field.defaultValue === null)
        ? field.defaultValue as string | number | null
        : null
    }
  }

  return (
    <Autocomplete
      mode={field.autocompleteMode ?? 'client'}
      options={options}
      fetcher={field.fetcher}
      pageSize={field.pageSize}
      multiple={field.multiple}
      allowCustomValue={field.allowCustomValue}
      chipVariant={field.chipVariant}
      chipClassName={field.chipClassName}
      clearable={field.clearable}
      defaultValue={defaultValueShaped}
      initialSelectedOptions={field.initialSelectedOptions ?? null}
      loadSelected={field.loadSelected}
      value={field.multiple ? ((Array.isArray(value) ? value : (value ? [value] : [])) as Array<string | number>) : ((value as string | number | null) ?? null)}
      onChange={(val, option, raw) => onChange(val, option, raw)}
      placeholder={field.placeholder}
      searchPlaceholder={field.searchPlaceholder}
      renderOption={field.renderOption}
      disabled={field.disabled}
      className={className}
    />
  )
}
