import type { Meta, StoryObj } from '@storybook/react'
import { FormBuilder, type FormBuilderProps } from '../../../kit/builder/form/components/FormBuilder'

const meta: Meta<typeof FormBuilder> = {
  title: 'Kit/Builder/Form (DateTime)',
  component: FormBuilder,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
}

export default meta

type Story = StoryObj<typeof FormBuilder>

export const DateTimeFields: Story = {
  name: 'Date/Time fields',
  args: {
    sections: [
      {
        title: 'Date & Time',
        description: 'Examples of DateTimePicker, DateTimeRangePicker and TimeRangePicker fields',
        variant: 'card',
        layout: 'grid',
        grid: { cols: 1, mdCols: 2, gap: 'gap-4' },
        fields: [
          {
            name: 'dt',
            label: 'Date & Time',
            type: 'date_time',
            timePrecision: 'minute',
            hourCycle: 24,
          },
          {
            name: 'dtRange',
            label: 'Date & Time Range',
            type: 'date_time_range',
            numberOfMonths: 2,
            timePrecision: 'minute',
            hourCycle: 24,
          },
          {
            name: 'timeRange',
            label: 'Time Range',
            type: 'time_range',
            timePrecision: 'minute',
            hourCycle: 24,
            minuteStep: 5,
          },
        ],
      },
    ],
    onSubmit: (data: unknown) => {
      // Showing output in console for demo
      // eslint-disable-next-line no-console
      console.log('Submit (date/time):', data)
    },
    showActions: true,
  } satisfies Partial<FormBuilderProps>,
  render: (args) => (
    <div className="max-w-5xl mx-auto p-6">
      <FormBuilder {...(args as FormBuilderProps)} />
    </div>
  ),
}
