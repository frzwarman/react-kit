import type { Meta, StoryObj } from '@storybook/react';
import type { ChartConfig } from '../../../shadcn/ui/chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '../../../shadcn/ui/chart';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

const meta: Meta<typeof ChartContainer> = {
  title: 'Shadcn/UI/Chart',
  component: ChartContainer,
};

export default meta;

type Story = StoryObj<typeof ChartContainer>;

const chartData = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
];

const chartConfig: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb', // blue-600
  },
  mobile: {
    label: 'Mobile',
    color: '#16a34a', // green-600
  },
};

export const LineExample: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="h-[320px] w-full">
      <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={false}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  ),
};
