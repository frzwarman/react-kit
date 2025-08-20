import type { Meta, StoryObj } from '@storybook/react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../../../shadcn/ui/resizable';

const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'Shadcn/UI/Resizable',
  component: ResizablePanelGroup,
};

export default meta;

type Story = StoryObj<typeof ResizablePanelGroup>;

export const Horizontal: Story = {
  render: () => (
    <div className="h-[240px] w-full">
      <ResizablePanelGroup direction="horizontal" className="rounded-md border">
        <ResizablePanel defaultSize={40} minSize={20} className="p-3">
          <div className="h-full w-full rounded-sm bg-muted/40 p-2">Left content</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={20} className="p-3">
          <div className="h-full w-full rounded-sm bg-muted/40 p-2">Right content</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="h-[300px] w-full">
      <ResizablePanelGroup direction="vertical" className="rounded-md border">
        <ResizablePanel defaultSize={50} minSize={20} className="p-3">
          <div className="h-full w-full rounded-sm bg-muted/40 p-2">Top content</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={20} className="p-3">
          <div className="h-full w-full rounded-sm bg-muted/40 p-2">Bottom content</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
