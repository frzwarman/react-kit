import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from '../../../shadcn/ui/aspect-ratio';

const meta: Meta<typeof AspectRatio> = {
  title: 'Shadcn/UI/AspectRatio',
  component: AspectRatio,
};

export default meta;

type Story = StoryObj<typeof AspectRatio>;

export const Image16x9: Story = {
  name: 'Image (16:9)',
  render: (args) => (
    <div className="w-[450px]">
      <AspectRatio ratio={16 / 9} {...args}>
        <img
          src="https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=1600&auto=format&fit=crop"
          alt="Landscape"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const Square1x1: Story = {
  name: 'Image (1:1 square)',
  render: (args) => (
    <div className="w-[300px]">
      <AspectRatio ratio={1 / 1} {...args}>
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"
          alt="Square"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const YouTube16x9: Story = {
  name: 'YouTube Embed (16:9)',
  render: (args) => (
    <div className="w-[450px]">
      <AspectRatio ratio={16 / 9} {...args}>
        <iframe
          className="h-full w-full rounded-md"
          src="https://www.youtube.com/embed/yMqDgbZmBdk"
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </AspectRatio>
    </div>
  ),
};
