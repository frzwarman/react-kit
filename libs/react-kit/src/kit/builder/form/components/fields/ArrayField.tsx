import { useFieldArray } from 'react-hook-form'
import type { FieldArrayPath, FieldValues } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../shadcn/ui/card'
import { Button } from '../../../../../shadcn/ui/button'
import { Input } from '../../../../../shadcn/ui/input'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { cn } from '../../../../../shadcn/lib/utils'
import type { FieldRenderProps } from './types'
import { FormBuilderField } from '../FormBuilderField'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../shadcn/ui/table'

export function ArrayField({ field, control, fieldPath, value, onChange }: FieldRenderProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldPath as FieldArrayPath<FieldValues>,
  })

  const addItem = () => {
    // For custom layout, prefer appending an object so useFieldArray can generate stable IDs
    if (field.arrayLayout === 'custom') {
      append({} as never)
      return
    }
    if (field.fields && field.fields.length === 1) {
      const defaultValue = field.fields[0].defaultValue ?? ''
      append(defaultValue as never)
    } else if (field.fields) {
      const defaultObject: Record<string, unknown> = {}
      field.fields.forEach((subField) => {
        defaultObject[subField.name] = subField.defaultValue ?? ''
      })
      append(defaultObject as never)
    } else {
      append('' as never)
    }
  }

  const removeItem = (index: number) => remove(index)

  // Custom layout hook
  if (field.arrayLayout === 'custom' && typeof field.arrayRender === 'function') {
    return (
      <>{field.arrayRender({ field, control, fieldPath, value, onChange, addItem, removeItem, disabled: field.disabled, rows: fields })}</>
    )
  }

  // Table layout
  if (field.arrayLayout === 'table') {
    const hasNested = Array.isArray(field.fields) && field.fields.length > 0
    const fFields = field.fields ?? []
    const singleNested = hasNested && fFields.length === 1
    const headerBg = field.arrayColors?.headerBgClass ?? 'bg-primary'
    const headerText = field.arrayColors?.headerTextClass ?? 'text-primary-foreground'
    const altRow = field.arrayColors?.rowAltBgClass ?? 'bg-muted/40'

    return (
      <Card className={cn(field.className, 'py-3 rounded-md gap-3')}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">{field.label}</CardTitle>
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addItem} disabled={field.disabled}>
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">
              No items added yet. Click "Add Item" to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className={cn(headerBg, headerText)}>
                  {hasNested ? (
                    singleNested ? (
                      <TableHead className={cn(headerText)}>{fFields[0]?.label || 'Value'}</TableHead>
                    ) : (
                      fFields.map(sf => (
                        <TableHead key={sf.name} className={cn(headerText)}>{sf.label || sf.name}</TableHead>
                      ))
                    )
                  ) : (
                    <TableHead className={cn(headerText)}>Value</TableHead>
                  )}
                  <TableHead className={cn(headerText)}>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((item, index) => (
                  <TableRow key={item.id} className={cn(index % 2 === 1 && altRow)}>
                    {hasNested ? (
                      singleNested ? (
                        <TableCell>
                          <FormBuilderField
                            field={{ ...fFields[0], name: fFields[0]?.name, label: fFields[0]?.label || 'Value' }}
                            control={control}
                            parentPath={`${fieldPath}.${index}`}
                          />
                        </TableCell>
                      ) : (
                        fFields.map(subField => (
                          <TableCell key={subField.name}>
                            <FormBuilderField
                              field={subField}
                              control={control}
                              parentPath={`${fieldPath}.${index}`}
                            />
                          </TableCell>
                        ))
                      )
                    ) : (
                      <TableCell>
                        <Input
                          value={String(((value as unknown[] | undefined)?.[index] ?? ''))}
                          onChange={(e) => {
                            const current = (value as unknown[] | undefined) ?? []
                            const newArray = [...current]
                            newArray[index] = e.target.value
                            onChange(newArray)
                          }}
                          placeholder={`Item ${index + 1}`}
                          disabled={field.disabled}
                        />
                      </TableCell>
                    )}
                    <TableCell className="w-1 text-right">
                      <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} disabled={field.disabled}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    )
  }

  // Default: card layout (existing UI)
  return (
    <Card className={cn(field.className, 'py-3 rounded-md gap-3')}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{field.label}</CardTitle>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addItem} disabled={field.disabled}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            No items added yet. Click "Add Item" to get started.
          </p>
        ) : (
          fields.map((item, index) => (
            <Card key={item.id} className="relative py-3 rounded-md gap-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Item {index + 1}</span>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} disabled={field.disabled}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {field.fields && field.fields.length === 1 ? (
                  <FormBuilderField
                    field={{ ...field.fields[0], name: field.fields[0].name, label: field.fields[0].label || 'Value' }}
                    control={control}
                    parentPath={`${fieldPath}.${index}`}
                  />
                ) : field.fields ? (
                  <div className="grid gap-2 md:grid-cols-2">
                    {field.fields.map(subField => (
                      <FormBuilderField
                        key={subField.name}
                        field={subField}
                        control={control}
                        parentPath={`${fieldPath}.${index}`}
                      />
                    ))}
                  </div>
                ) : (
                  <Input
                    value={String(((value as unknown[] | undefined)?.[index] ?? ''))}
                    onChange={(e) => {
                      const current = (value as unknown[] | undefined) ?? []
                      const newArray = [...current]
                      newArray[index] = e.target.value
                      onChange(newArray)
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
  )
}
