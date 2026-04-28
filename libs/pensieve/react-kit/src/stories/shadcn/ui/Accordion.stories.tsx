import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../../shadcn/ui/accordion';
import { useState } from 'react';

const meta: Meta<typeof Accordion> = {
  title: 'Shadcn/UI/Accordion',
  component: Accordion,
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Basic: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to WAI-ARIA design patterns.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that can be overridden.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It uses utility classes for smooth animations.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['item-1'],
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Open multiple items?</AccordionTrigger>
        <AccordionContent>
          Yes. In multiple mode you can keep several sections open.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Keeps state independent?</AccordionTrigger>
        <AccordionContent>
          Each item can be toggled independently in multiple mode.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Works with defaultValue?</AccordionTrigger>
        <AccordionContent>
          Provide an array of values to open initially.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const DisabledItem: Story = {
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Interactable item</AccordionTrigger>
        <AccordionContent>This item can be toggled as usual.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Disabled item</AccordionTrigger>
        <AccordionContent>
          This content cannot be toggled because the item is disabled.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

function ControlledAccordionDemo() {
  const [value, setValue] = useState<string | undefined>('item-1');

  return (
    <Accordion type="single" collapsible value={value} onValueChange={setValue}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Controlled: Item 1</AccordionTrigger>
        <AccordionContent>
          Clicking again will collapse because collapsible is true.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Controlled: Item 2</AccordionTrigger>
        <AccordionContent>
          State is managed via value/onValueChange.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export const Controlled: Story = {
  render: () => <ControlledAccordionDemo />,
};
