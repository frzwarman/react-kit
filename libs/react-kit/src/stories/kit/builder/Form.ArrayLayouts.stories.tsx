import type { Meta, StoryObj } from '@storybook/react'
import { FormBuilder, type FormBuilderProps } from '../../../kit/builder/form/components/FormBuilder'

const meta: Meta<typeof FormBuilder> = {
  title: 'Kit/Builder/Form',
  component: FormBuilder,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
}

export default meta

type Story = StoryObj<typeof FormBuilder>

export const ArrayCardLayout: Story = {
  name: 'Array - Card layout',
  args: {
    sections: [
      {
        title: 'Card Layout',
        description: 'Array items are displayed as stacked cards',
        layout: 'grid',
        grid: { cols: 1, gap: 'gap-4' },
        fields: [
          {
            name: 'itemsCard',
            type: 'array',
            label: 'Items (card)',
            fields: [
              { name: 'name', label: 'Name', type: 'text', required: true },
              { name: 'qty', label: 'Qty', type: 'number', required: true },
            ],
          },
        ],
      },
    ],
    showActions: true,
    onSubmit: (data: unknown) => console.log('Submit (array-card):', data),
  } satisfies Partial<FormBuilderProps>,
  render: (args) => (
    <div className="max-w-3xl mx-auto p-6">
      <FormBuilder {...(args as FormBuilderProps)} />
    </div>
  ),
}

export const ArrayTableLayout: Story = {
  name: 'Array - Table layout',
  args: {
    sections: [
      {
        title: 'Table Layout',
        description: 'Array items are displayed in a table with configurable colors',
        layout: 'grid',
        grid: { cols: 1, gap: 'gap-4' },
        fields: [
          {
            name: 'itemsTable',
            type: 'array',
            label: 'Items (table)',
            arrayLayout: 'table',
            arrayColors: {
              headerBgClass: 'bg-teal-700',
              headerTextClass: 'text-white',
              rowAltBgClass: 'bg-teal-50',
            },
            fields: [
              { name: 'product', label: 'Product', type: 'text', required: true },
              { name: 'price', label: 'Price', type: 'number', required: true },
            ],
          },
        ],
      },
    ],
    showActions: true,
    onSubmit: (data: unknown) => console.log('Submit (array-table):', data),
  } satisfies Partial<FormBuilderProps>,
  render: (args) => (
    <div className="max-w-4xl mx-auto p-6">
      <FormBuilder {...(args as FormBuilderProps)} />
    </div>
  ),
}

export const ArrayCustomLayout: Story = {
  name: 'Array - Custom renderer',
  args: {
    defaultValues: {
      itemsCustom: [],
    },
    sections: [
      {
        title: 'Custom Layout',
        description: 'Array items with a fully custom renderer',
        layout: 'grid',
        grid: { cols: 1, gap: 'gap-4' },
        fields: [
          {
            name: 'itemsCustom',
            type: 'array',
            label: 'Items (custom)',
            defaultValue: [],
            arrayLayout: 'custom',
            arrayRender: ({ value: _value = [], rows = [], addItem, removeItem, disabled }) => {
              return (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Custom Items</span>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => !disabled && addItem()}
                    >
                      Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Rows: {rows.length}</div>
                    {Array.isArray(rows) && rows.length > 0 ? (
                      rows.map((row: { id: string }, i: number) => (
                        <div key={row.id ?? i} className="flex items-center gap-3 border rounded-md p-3">
                          <span className="text-sm text-muted-foreground">Row {i + 1}</span>
                          <button
                            type="button"
                            className="ml-auto btn btn-destructive"
                            onClick={() => removeItem(i)}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No items. Click Add Item.</p>
                    )}
                  </div>
                </div>
              )
            },
          },
        ],
      },
    ],
    showActions: true,
    onSubmit: (data: unknown) => console.log('Submit (array-custom):', data),
  } satisfies Partial<FormBuilderProps>,
  render: (args) => (
    <div className="max-w-3xl mx-auto p-6">
      <FormBuilder {...(args as FormBuilderProps)} />
    </div>
  ),
}
