import type { Meta, StoryObj } from '@storybook/react';
import {
  FormBuilder,
  type FormBuilderProps,
} from '../../../kit/builder/form/components/FormBuilder';

const meta: Meta<typeof FormBuilder> = {
  title: 'Kit/Builder/Form',
  component: FormBuilder,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof FormBuilder>;

export const Pickers: Story = {
  name: 'Pickers (Date, Date Range, Month, Month Range)',
  args: {
    sections: [
      {
        title: 'Pickers',
        description:
          'Showcase of DatePicker, DateRangePicker, MonthPicker, and MonthRangePicker via FormBuilder fields',
        variant: 'card',
        layout: 'grid',
        grid: { cols: 1, mdCols: 2, gap: 'gap-4' },
        fields: [
          {
            name: 'dateSingle',
            label: 'Date (DatePicker)',
            type: 'date_picker',
            placeholder: 'Select a date',
            minDate: new Date(new Date().getFullYear(), 0, 1),
            maxDate: new Date(new Date().getFullYear(), 11, 31),
          },
          {
            name: 'dateRange',
            label: 'Date Range (DateRangePicker)',
            type: 'date_range',
            placeholder: 'Select a date range',
            numberOfMonths: 2,
            popoverSide: 'bottom',
          },
          {
            name: 'monthSingle',
            label: 'Month (MonthPicker)',
            type: 'month',
            placeholder: 'Select a month',
            minDate: new Date(new Date().getFullYear() - 1, 0, 1),
            maxDate: new Date(new Date().getFullYear() + 1, 11, 31),
          },
          {
            name: 'monthRange',
            label: 'Month Range (MonthRangePicker)',
            type: 'month_range',
            placeholder: 'Select a start and end month',
          },
        ],
      },
    ],
    onSubmit: (data: unknown) => {
      console.log('Submit (pickers):', data);
    },
    showActions: true,
  } satisfies Partial<FormBuilderProps>,
  render: (args) => (
    <div className="max-w-4xl mx-auto p-6">
      <FormBuilder {...(args as FormBuilderProps)} />
    </div>
  ),
};
