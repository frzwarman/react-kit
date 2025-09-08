import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { TimeRangePicker } from '../../../kit/components/timepicker/TimeRangePicker'

const meta: Meta<typeof TimeRangePicker> = {
  title: 'Kit/Components/TimeRangePicker',
  component: TimeRangePicker,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
}

export default meta

type Story = StoryObj<typeof TimeRangePicker>

export const Basic: Story = {
  name: 'Basic (HH:mm – HH:mm, 24h)',
  args: {
    precision: 'minute',
    hourCycle: 24,
  },
  render: (args) => {
    const [value, setValue] = React.useState<{ from?: Date | null; to?: Date | null } | null>({
      from: new Date(),
      to: new Date(new Date().getTime() + 60 * 60 * 1000),
    })

    return (
      <div className="p-6 space-y-4">
        <TimeRangePicker {...args} value={value} onChange={setValue} />
        <div className="text-xs text-muted-foreground">Value: {value?.from?.toLocaleTimeString?.()} – {value?.to?.toLocaleTimeString?.()}</div>
      </div>
    )
  },
}
