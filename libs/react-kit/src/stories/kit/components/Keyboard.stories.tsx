import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Keyboard } from "../../../kit/components/keyboard/Keyboard";
import { Input } from "../../../shadcn/ui/input";

const meta: Meta<typeof Keyboard> = {
  title: "Kit/Components/Keyboard",
  component: Keyboard,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
  argTypes: {
    layout: {
      control: "select",
      options: ["qwerty", "qwertz", "azerty"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Keyboard>;

export const FullKeyboard: Story = {
  name: "Full Keyboard",
  render: (args) => {
    const [value, setValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
      <div className="p-6 space-y-4">
        <div>
          <div className="text-sm text-muted-foreground mb-2">Text Input</div>
          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              setValue((e.target as any).value);
            }}
            placeholder="Type here..."
            className="min-h-[60px]"
          />
        </div>
        <Keyboard
          {...args}
          value={value}
          onChange={setValue}
          inputRef={inputRef}
          showNumbers
          showShift
          showSpace
          showBackspace
          showEnter
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  name: "Disabled",
  render: (args) => {
    const [value, setValue] = React.useState("Hello World");

    return (
      <div className="p-6 space-y-4">
        <div>
          <div className="text-sm text-muted-foreground mb-2">Text Input</div>
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue((e.target as any).value)}
            placeholder="Type here..."
            disabled
            className="min-h-[60px]"
          />
        </div>
        <Keyboard {...args} value={value} onChange={setValue} disabled />
      </div>
    );
  },
};

export const CustomStyling: Story = {
  name: "Custom Styling",
  render: (args) => {
    const [value, setValue] = React.useState("");

    return (
      <div className="flex-1 p-6 space-y-4">
        <div>
          <div className="text-sm text-muted-foreground mb-2">Text Input</div>
          <Input
            type="text"
            value={value}
            onChange={(e) => {
              setValue((e.target as any).value);
            }}
            placeholder="Type here..."
            className="min-h-[60px]"
          />
        </div>
        <Keyboard
          {...args}
          value={value}
          onChange={setValue}
          showNumbers
          showShift
          showSpace
          showBackspace
          showEnter
          customKeyStyle={{ minWidth: "50px", height: "45px" }}
          customKeyClassName="text-base font-bold"
        />
      </div>
    );
  },
};

export const MultipleInputs: Story = {
  name: "Multiple Inputs (Focused)",
  render: (args) => {
    const [value1, setValue1] = React.useState("");
    const [value2, setValue2] = React.useState("");
    const [value3, setValue3] = React.useState("");
    const [value4, setValue4] = React.useState("");
    const [value5, setValue5] = React.useState("");
    const [focusedInput, setFocusedInput] = React.useState<
      "input1" | "input2" | "input3" | "input4" | "input5"
    >("input1");

    const input1Ref = React.useRef<HTMLInputElement>(null);
    const input2Ref = React.useRef<HTMLInputElement>(null);
    const input3Ref = React.useRef<HTMLInputElement>(null);
    const input4Ref = React.useRef<HTMLInputElement>(null);
    const input5Ref = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const values = {
      input1: value1,
      input2: value2,
      input3: value3,
      input4: value4,
      input5: value5,
    };
    const setters = {
      input1: setValue1,
      input2: setValue2,
      input3: setValue3,
      input4: setValue4,
      input5: setValue5,
    };
    const refs = {
      input1: input1Ref,
      input2: input2Ref,
      input3: input3Ref,
      input4: input4Ref,
      input5: input5Ref,
    };

    const currentValue = values[focusedInput];
    const setCurrentValue = setters[focusedInput];

    const handleInputFocus = (
      input: "input1" | "input2" | "input3" | "input4" | "input5"
    ) => {
      setFocusedInput(input);

      // Scroll the focused input into view
      setTimeout(() => {
        const inputElement = refs[input].current;
        if (inputElement && containerRef.current) {
          (inputElement as any).scrollIntoView?.({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }, 100);
    };

    const inputs = [
      {
        id: "input1" as const,
        label: "Text Input 1",
        value: value1,
        setValue: setValue1,
        ref: input1Ref,
      },
      {
        id: "input2" as const,
        label: "Text Input 2",
        value: value2,
        setValue: setValue2,
        ref: input2Ref,
      },
      {
        id: "input3" as const,
        label: "Text Input 3",
        value: value3,
        setValue: setValue3,
        ref: input3Ref,
      },
      {
        id: "input4" as const,
        label: "Text Input 4",
        value: value4,
        setValue: setValue4,
        ref: input4Ref,
      },
      {
        id: "input5" as const,
        label: "Text Input 5",
        value: value5,
        setValue: setValue5,
        ref: input5Ref,
      },
    ];

    return (
      <div
        ref={containerRef}
        className="h-screen p-6 pt-40 pb-96 space-y-4 overflow-y-auto relative flex-1"
      >
        <div className="flex-1 w-full space-y-4 flex flex-col">
          {inputs.map((input) => (
            <div key={input.id}>
              <div className="text-sm text-muted-foreground mb-2">
                {input.label}
              </div>
              <Input
                ref={input.ref}
                type="text"
                value={input.value}
                onChange={(e) => input.setValue((e.target as any).value)}
                placeholder="Type here..."
                className="min-h-[60px]"
                onFocus={() => handleInputFocus(input.id)}
              />
              {focusedInput === input.id && (
                <div className="text-xs text-teal-600 mt-1">✓ Connected</div>
              )}
            </div>
          ))}
        </div>
        <Keyboard
          {...args}
          value={currentValue}
          onChange={setCurrentValue}
          inputRef={refs[focusedInput]}
          className="fixed bottom-0 left-0 right-0 z-10"
          showNumbers
          showShift
          showSpace
          showBackspace
          showEnter
        />
      </div>
    );
  },
};
