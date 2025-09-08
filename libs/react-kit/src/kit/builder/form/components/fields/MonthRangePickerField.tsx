import * as React from 'react'
import type { FieldRenderProps } from './types'
import { MonthRangeInput } from '../../../../components/monthpicker/MonthRangeInput'

export function MonthRangePickerField({ field, value, onChange, className }: FieldRenderProps) {
  const v = React.useMemo(() => {
    if (!value || typeof value !== 'object') return undefined as { start: Date; end: Date } | undefined
    const anyVal = value as { start?: unknown; end?: unknown }
    const toDate = (x: unknown) => {
      if (!x) return undefined
      if (x instanceof Date) return x
      const d = new Date(x as string)
      return Number.isNaN(d.getTime()) ? undefined : d
    }
    const start = toDate(anyVal.start)
    const end = toDate(anyVal.end)
    if (!start || !end) return undefined
    return { start, end }
  }, [value])

  return (
    <MonthRangeInput
      className={className}
      value={v ?? null}
      onChange={(range) => onChange(range)}
      minDate={field.minDate}
      maxDate={field.maxDate}
      showQuickSelectors
      popoverSide={field.popoverSide}
      showFooter
      cancelLabel={field.cancelLabel}
      applyLabel={field.applyLabel}
    />
  )
}
