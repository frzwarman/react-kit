import type { Meta, StoryObj } from '@storybook/react';
import SectionBuilder from '../../../kit/builder/section/SectionBuilder';
import type {
  SectionLeaf,
  SectionNode,
} from '../../../kit/builder/section/types';

const meta: Meta<typeof SectionBuilder> = {
  title: 'Kit/Builder/Section',
  component: SectionBuilder,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
  render: (args) => <SectionBuilder {...args} />,
};

type Story = StoryObj<typeof SectionBuilder>;

export const TabsLayout: Story = {
  name: 'Tabs layout',
  args: {
    sections: [
      {
        id: 'tabs-1',
        title: 'Tabbed Section',
        subtitle: 'Demonstrates tabs with nested sections',
        variant: 'card',
        layout: 'tabs',
        tabsListClassName: 'w-full',
        tabsContentClassName: 'mt-2',
        tabs: [
          {
            id: 'tab-a',
            label: 'Overview',
            node: {
              id: 'tab-a-node',
              layout: 'grid',
              grid: { cols: 1, mdCols: 12, gap: 'gap-4' },
              children: [
                {
                  key: 't1',
                  content: demoBox('Overview content A'),
                  span: { md: 6 },
                },
                {
                  key: 't2',
                  content: demoBox('Overview content B'),
                  span: { md: 6 },
                },
              ],
            },
          },
          {
            id: 'tab-b',
            label: 'Details',
            node: {
              id: 'tab-b-node',
              layout: 'grid',
              grid: { cols: 1, mdCols: 12, gap: 'gap-4' },
              children: [
                {
                  id: 'inner-details',
                  title: 'Inner details section',
                  variant: 'separator',
                  layout: 'grid',
                  grid: { cols: 1, mdCols: 12 },
                  children: [
                    {
                      key: 'd1',
                      content: demoBox('Detail 1'),
                      span: { md: 4 },
                    },
                    {
                      key: 'd2',
                      content: demoBox('Detail 2'),
                      span: { md: 4 },
                    },
                    {
                      key: 'd3',
                      content: demoBox('Detail 3'),
                      span: { md: 4 },
                    },
                  ],
                } as unknown as SectionNode,
              ],
            },
          },
        ],
      } as unknown as SectionNode,
    ],
  },
  render: (args) => <SectionBuilder {...args} />,
};

export default meta;

function demoBox(text: string, className?: string) {
  return (
    <div
      className={['rounded border p-3 text-sm', className]
        .filter(Boolean)
        .join(' ')}
    >
      {text}
    </div>
  );
}

const gridLeaves: SectionLeaf[] = [
  { key: 'a', content: demoBox('A'), span: { md: 6 } },
  { key: 'b', content: demoBox('B'), span: { md: 6 } },
  { key: 'c', content: demoBox('C'), span: { md: 4 } },
  { key: 'd', content: demoBox('D'), span: { md: 4 } },
  { key: 'e', content: demoBox('E'), span: { md: 4 } },
];

export const GridLayout: Story = {
  name: 'Grid layout',
  args: {
    sections: [
      {
        id: 'grid-1',
        title: 'Grid (responsive spans)',
        subtitle: 'Uses md column spans 6/6 then 4/4/4',
        variant: 'card',
        layout: 'grid',
        grid: { cols: 1, mdCols: 12, gap: 'gap-4' },
        children: gridLeaves,
      },
    ] satisfies SectionNode[],
  },
  render: (args) => <SectionBuilder {...args} />,
};

export const WithLabels: Story = {
  name: 'Leaves with labels',
  args: {
    sections: [
      {
        id: 'labels-1',
        title: 'Label layouts',
        variant: 'card',
        layout: 'grid',
        grid: { cols: 1, mdCols: 12 },
        children: [
          {
            key: 'l1',
            label: 'Inline label',
            labelLayout: 'inline',
            inlineLabelWidthClass: 'w-40',
            content: demoBox('Value content inline'),
            span: { md: 12 },
          },
          {
            key: 'l2',
            label: 'Stacked label',
            labelLayout: 'stacked',
            description: 'Optional description appears under value',
            content: demoBox('Value content stacked'),
            span: { md: 6 },
          },
          {
            key: 'l3',
            label: 'No description',
            labelLayout: 'stacked',
            content: demoBox('Another value'),
            span: { md: 6 },
          },
        ],
      },
    ] satisfies SectionNode[],
  },
  render: (args) => <SectionBuilder {...args} />,
};

export const FlexLayout: Story = {
  name: 'Flex layout',
  args: {
    sections: [
      {
        id: 'flex-1',
        title: 'Horizontal flex with wrap',
        variant: 'card',
        layout: 'flex',
        flex: {
          direction: 'row',
          wrap: true,
          gap: 'gap-3',
          align: 'start',
          justify: 'start',
        },
        children: [
          { key: 'f1', content: demoBox('Item 1'), className: 'w-56' },
          { key: 'f2', content: demoBox('Item 2'), className: 'w-56' },
          { key: 'f3', content: demoBox('Item 3'), className: 'w-56' },
          { key: 'f4', content: demoBox('Item 4'), className: 'w-56' },
        ],
      },
    ] satisfies SectionNode[],
  },
};

export const NestedSections: Story = {
  name: 'Nested sections',
  args: {
    sections: [
      {
        id: 'outer',
        title: 'Outer section',
        variant: 'card',
        layout: 'grid',
        grid: { cols: 1, mdCols: 12 },
        children: [
          {
            id: 'inner-1',
            title: 'Inner A',
            variant: 'separator',
            layout: 'grid',
            grid: { cols: 1, mdCols: 12 },
            children: [
              { key: 'ia', content: demoBox('Inner A1'), span: { md: 6 } },
              { key: 'ib', content: demoBox('Inner A2'), span: { md: 6 } },
            ],
          },
          {
            id: 'inner-2',
            title: 'Inner B',
            variant: 'plain',
            layout: 'grid',
            grid: { cols: 1, mdCols: 12 },
            children: [
              { key: 'ic', content: demoBox('Inner B1'), span: { md: 4 } },
              { key: 'id', content: demoBox('Inner B2'), span: { md: 4 } },
              { key: 'ie', content: demoBox('Inner B3'), span: { md: 4 } },
            ],
          },
        ],
      } as unknown as SectionNode,
    ],
  },
  render: (args) => <SectionBuilder {...args} />,
};

export const CustomLeafRenderer: Story = {
  name: 'Custom leaf renderer',
  args: {
    sections: [
      {
        id: 'custom-1',
        title: 'Custom renderer',
        layout: 'grid',
        grid: { cols: 1, mdCols: 12 },
        children: [
          {
            key: 'x',
            label: 'Name',
            labelLayout: 'inline',
            content: 'Jane Doe',
            span: { md: 6 },
          },
          {
            key: 'y',
            label: 'Email',
            labelLayout: 'inline',
            content: 'jane@example.com',
            span: { md: 6 },
          },
        ],
      },
    ] satisfies SectionNode[],
    renderLeaf: (leaf) => (
      <div className="rounded border p-3">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {leaf.label ?? 'Field'}
        </div>
        <div className="text-sm">{leaf.content}</div>
      </div>
    ),
  },
  render: (args) => <SectionBuilder {...args} />,
};
