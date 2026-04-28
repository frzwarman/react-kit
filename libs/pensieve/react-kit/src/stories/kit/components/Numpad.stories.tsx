import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Numpad } from "../../../kit/components/numpad/Numpad";
import { Input } from "../../../shadcn/ui/input";

const meta: Meta<typeof Numpad> = {
  title: "Kit/Components/Numpad",
  component: Numpad,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof Numpad>;

export const FullNumpad: Story = {
  name: "Full Numpad",
  render: (args) => {
    const [value, setValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
      <div className="p-6 space-y-4">
        <div>
          <div className="text-sm text-muted-foreground mb-2">Amount</div>
          <Input
            ref={inputRef}
            type="text"
            value={value ? Number(value).toLocaleString("id-ID") : ""}
            onChange={(e) => {
              const numValue = (e.target as any).value.replace(/[^\d]/g, "");
              setValue(numValue);
            }}
            placeholder="0"
            className="text-2xl font-bold text-right"
          />
        </div>
        <Numpad
          {...args}
          value={value}
          onChange={setValue}
          inputRef={inputRef}
          allowDoubleZero
          showBackspaceButton
          showSubmitButton
          showClearButton
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  name: "Disabled",
  render: (args) => {
    const [value, setValue] = React.useState("12345");

    return (
      <div className="p-6 space-y-4">
        <div>
          <div className="text-sm text-muted-foreground mb-2">Amount</div>
          <Input
            type="text"
            value={value ? Number(value).toLocaleString("id-ID") : ""}
            onChange={(e) => {
              const numValue = (e.target as any).value.replace(/[^\d]/g, "");
              setValue(numValue);
            }}
            placeholder="0"
            disabled
            className="text-lg font-medium"
          />
        </div>
        <Numpad
          {...args}
          value={value}
          onChange={setValue}
          showSubmitButton
          disabled
        />
      </div>
    );
  },
};

export const CustomStyling: Story = {
  name: "Custom Styling",
  render: (args) => {
    const [value, setValue] = React.useState("");

    return (
      <div className="p-6 space-y-4">
        <div>
          <div className="text-sm text-muted-foreground mb-2">Amount</div>
          <Input
            type="text"
            value={value ? Number(value).toLocaleString("id-ID") : ""}
            onChange={(e) => {
              const numValue = (e.target as any).value.replace(/[^\d]/g, "");
              setValue(numValue);
            }}
            placeholder="0"
            className="text-lg font-medium"
          />
        </div>
        <Numpad
          {...args}
          value={value}
          onChange={setValue}
          allowDoubleZero
          customKeyStyle={{ width: "90px", height: "90px" }}
          customKeyClassName="text-3xl font-bold"
          showSubmitButton
          customSubmitStyle={{ width: "90px" }}
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
    const [focusedInput, setFocusedInput] = React.useState<"input1" | "input2">("input1");
    
    const input1Ref = React.useRef<HTMLInputElement>(null);
    const input2Ref = React.useRef<HTMLInputElement>(null);
    
    const refs = {
      input1: input1Ref,
      input2: input2Ref,
    };

    const currentValue = focusedInput === "input1" ? value1 : value2;
    const setCurrentValue = focusedInput === "input1" ? setValue1 : setValue2;

    return (
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div>
            <div className="text-sm text-muted-foreground mb-2">Amount 1</div>
            <Input
              ref={input1Ref}
              type="text"
              value={value1 ? Number(value1).toLocaleString("id-ID") : ""}
              onChange={(e) => {
                const numValue = (e.target as any).value.replace(/[^\d]/g, "");
                setValue1(numValue);
              }}
              placeholder="0"
              className="text-lg font-medium"
              onFocus={() => setFocusedInput("input1")}
            />
            {focusedInput === "input1" && (
              <div className="text-xs text-teal-600 mt-1">✓ Connected</div>
            )}
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2">Amount 2</div>
            <Input
              ref={input2Ref}
              type="text"
              value={value2 ? Number(value2).toLocaleString("id-ID") : ""}
              onChange={(e) => {
                const numValue = (e.target as any).value.replace(/[^\d]/g, "");
                setValue2(numValue);
              }}
              placeholder="0"
              className="text-lg font-medium"
              onFocus={() => setFocusedInput("input2")}
            />
            {focusedInput === "input2" && (
              <div className="text-xs text-teal-600 mt-1">✓ Connected</div>
            )}
          </div>
        </div>
        <Numpad
          {...args}
          value={currentValue}
          onChange={setCurrentValue}
          inputRef={refs[focusedInput]}
          allowDoubleZero
          showBackspaceButton
          showClearButton
          showSubmitButton
        />
      </div>
    );
  },
};
