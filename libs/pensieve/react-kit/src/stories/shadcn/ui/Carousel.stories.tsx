import type { Meta, StoryObj } from '@storybook/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../../shadcn/ui/carousel';

const meta: Meta<typeof Carousel> = {
  title: 'Shadcn/UI/Carousel',
  component: Carousel,
};

export default meta;

type Story = StoryObj<typeof Carousel>;

export const Basic: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Carousel className="rounded-md border p-4">
        <CarouselContent>
          {[1, 2, 3, 4, 5].map((n) => (
            <CarouselItem key={n} className="basis-full">
              <div className="flex h-40 items-center justify-center rounded-md bg-muted/50 text-2xl font-bold">
                Slide {n}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};
