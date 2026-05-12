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

export const TimeFields: Story = {
  name: 'Time fields (12/24h, precision)',
  args: {
    sections: [
      {
        title: 'Time',
        description:
          'TimePicker fields with different precisions and hour cycles',
        variant: 'card',
        layout: 'grid',
        grid: { cols: 1, mdCols: 2, gap: 'gap-4' },
        fields: [
          {
            name: 'time24h',
            label: 'Time (24h HH:mm)',
            type: 'time',
            timePrecision: 'minute',
            hourCycle: 24,
            minuteStep: 5,
          },
          {
            name: 'time12h',
            label: 'Time (12h hour only)',
            type: 'time',
            timePrecision: 'hour',
            hourCycle: 12,
          },
          {
            name: 'timeWithSeconds',
            label: 'Time (24h HH:mm:ss)',
            type: 'time',
            timePrecision: 'second',
            hourCycle: 24,
            secondStep: 10,
          },
        ],
      },
    ],
    onSubmit: (data: unknown) => {
      console.log('Submit (time):', data);
    },
    showActions: true,
  } satisfies Partial<FormBuilderProps>,
  render: (args) => (
    <div className="max-w-4xl mx-auto p-6">
      <FormBuilder {...(args as FormBuilderProps)} />
    </div>
  ),
};
