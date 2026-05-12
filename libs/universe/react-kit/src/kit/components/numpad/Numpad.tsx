"use client";

import * as React from "react";
import { Delete, ChevronLeft } from "lucide-react";
import { cn } from "../../../shadcn/lib/utils";
import { Button } from "../../../shadcn/ui/button";

// Constants
const NUMBER_BUTTON_BASE_CLASSES =
  "rounded-xl border-2 border-teal-200 bg-white text-3xl font-semibold text-teal-600 hover:text-teal-900 transition-colors hover:bg-teal-50 h-auto";
const CLEAR_BUTTON_CLASSES =
  "rounded-xl border-2 border-teal-200 bg-white text-2xl font-semibold text-teal-600 hover:text-teal-900 transition-colors hover:bg-teal-50 h-auto";
const BACKSPACE_BUTTON_CLASSES =
  "rounded-xl bg-red-600 text-white transition-colors hover:bg-red-700 h-auto";
const SUBMIT_BUTTON_CLASSES =
  "row-span-3 rounded-xl bg-green-400 transition-colors hover:bg-green-500 h-auto";

export interface NumpadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  allowDecimal?: boolean;
  allowDoubleZero?: boolean;
  maxLength?: number;
  className?: string;
  buttonClassName?: string;
  customKeyStyle?: React.CSSProperties;
  customKeyClassName?: string;
  customSubmitStyle?: React.CSSProperties;
  customSubmitClassName?: string;
  showBackspaceButton?: boolean;
  showClearButton?: boolean;
  showSubmitButton?: boolean;
  onSubmit?: () => void;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

export function Numpad({
  value: controlledValue,
  onChange,
  disabled = false,
  allowDecimal = false,
  allowDoubleZero = true,
  maxLength,
  className,
  buttonClassName,
  customKeyStyle,
  customKeyClassName,
  customSubmitStyle,
  customSubmitClassName,
  showBackspaceButton = true,
  showClearButton = true,
  showSubmitButton = false,
  onSubmit,
  inputRef,
  ...props
}: NumpadProps) {
  const [internalValue, setInternalValue] = React.useState("");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Helper function to update input value with cursor position handling
  const updateInputValue = React.useCallback(
    (
      input: HTMLInputElement | HTMLTextAreaElement,
      newValue: string,
      cursorPos: number
    ) => {
      input.value = newValue;
      input.setSelectionRange(cursorPos, cursorPos);
      const event = new Event("input", { bubbles: true });
      input.dispatchEvent(event);

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (disabled) return;
      if (maxLength && newValue.length > maxLength) return;

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [disabled, maxLength, isControlled, onChange]
  );

  const handleNumberClick = React.useCallback(
    (num: string) => {
      if (disabled) return;

      if (inputRef?.current) {
        const input = inputRef.current;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const newValue =
          input.value.slice(0, start) + num + input.value.slice(end);
        const newCursorPos = start + num.length;

        if (maxLength && newValue.length > maxLength) return;

        updateInputValue(input, newValue, newCursorPos);
        return;
      }

      handleValueChange(value + num);
    },
    [disabled, value, handleValueChange, inputRef, maxLength, updateInputValue]
  );

  const handleDecimalClick = React.useCallback(() => {
    if (disabled || !allowDecimal) return;

    if (inputRef?.current) {
      const input = inputRef.current;
      if (input.value.includes(".")) return;

      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      const newValue = input.value.slice(0, start) + "." + input.value.slice(end);
      const newCursorPos = start + 1;

      if (maxLength && newValue.length > maxLength) return;

      updateInputValue(input, newValue, newCursorPos);
      return;
    }

    if (value.includes(".")) return;
    handleValueChange(value + ".");
  }, [
    disabled,
    allowDecimal,
    value,
    handleValueChange,
    inputRef,
    maxLength,
    updateInputValue,
  ]);

  const handleBackspace = React.useCallback(() => {
    if (disabled) return;

    if (inputRef?.current) {
      const input = inputRef.current;
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;

      if (start === end && start === 0) return;

      const newValue =
        start !== end
          ? input.value.slice(0, start) + input.value.slice(end)
          : input.value.slice(0, start - 1) + input.value.slice(start);
      const newCursorPos = start !== end ? start : Math.max(0, start - 1);

      updateInputValue(input, newValue, newCursorPos);
      return;
    }

    if (value.length > 0) {
      handleValueChange(value.slice(0, -1));
    }
  }, [disabled, value, handleValueChange, inputRef, updateInputValue]);

  const handleClear = React.useCallback(() => {
    handleValueChange("");
  }, [handleValueChange]);

  const handleSubmit = React.useCallback(() => {
    if (disabled) return;

    // If inputRef is provided, handle Enter like a real keyboard
    if (inputRef?.current) {
      const input = inputRef.current;
      const isTextarea = input.tagName === 'TEXTAREA';
      const isInput = input.tagName === 'INPUT';
      
      if (isTextarea) {
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const newValue =
          input.value.slice(0, start) + "\n" + input.value.slice(end);
        const newCursorPos = start + 1;
        updateInputValue(input, newValue, newCursorPos);
      } else if (isInput) {
        // For input: trigger Enter key events like real keyboard
        // This will trigger form submission if inside a form
        
        // Create and dispatch keydown event
        const keyDownEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
        });
        input.dispatchEvent(keyDownEvent);
        
        // Only trigger keypress and keyup if keydown wasn't prevented
        if (!keyDownEvent.defaultPrevented) {
          // Create and dispatch keypress event
          const keyPressEvent = new KeyboardEvent('keypress', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
          });
          input.dispatchEvent(keyPressEvent);
          
          // Create and dispatch keyup event
          const keyUpEvent = new KeyboardEvent('keyup', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
          });
          input.dispatchEvent(keyUpEvent);
          
          // If input is inside a form, trigger form submit
          const form = input.closest('form');
          if (form && !keyPressEvent.defaultPrevented) {
            // Trigger form submit event
            const submitEvent = new Event('submit', {
              bubbles: true,
              cancelable: true,
            });
            form.dispatchEvent(submitEvent);
            
            // If submit wasn't prevented, actually submit the form
            if (!submitEvent.defaultPrevented) {
              form.requestSubmit();
            }
          }
        }
      }
    }

    onSubmit?.();
  }, [disabled, onSubmit, inputRef, updateInputValue]);

  // Helper component for number buttons
  const NumberButton = React.useCallback(
    ({ num, onClick }: { num: string; onClick: () => void }) => (
      <Button
        type="button"
        disabled={disabled}
        onClick={onClick}
        style={customKeyStyle}
        className={cn(
          NUMBER_BUTTON_BASE_CLASSES,
          buttonClassName,
          customKeyClassName
        )}
      >
        {num}
      </Button>
    ),
    [disabled, customKeyStyle, buttonClassName, customKeyClassName]
  );

  return (
    <div className={cn("grid grid-cols-4 gap-3 w-fit", className)} {...props}>
      {/* Layout: 1,2,3,Delete | 4,5,6,Submit | 7,8,9 | 0,00,000 */}
      {/* Row 1: 1, 2, 3, Delete */}
      <NumberButton num="1" onClick={() => handleNumberClick("1")} />
      <NumberButton num="2" onClick={() => handleNumberClick("2")} />
      <NumberButton num="3" onClick={() => handleNumberClick("3")} />
      {showBackspaceButton && (
        <button
          type="button"
          disabled={disabled || value.length === 0}
          onClick={handleBackspace}
          style={customKeyStyle}
          className={cn(
            BACKSPACE_BUTTON_CLASSES,
            buttonClassName,
            customKeyClassName
          )}
        >
          <Delete className="mx-auto h-8 w-8" />
        </button>
      )}

      {/* Row 2: 4, 5, 6, Clear */}
      <NumberButton num="4" onClick={() => handleNumberClick("4")} />
      <NumberButton num="5" onClick={() => handleNumberClick("5")} />
      <NumberButton num="6" onClick={() => handleNumberClick("6")} />
      {showClearButton && (
        <Button
          type="button"
          disabled={disabled || value.length === 0}
          onClick={handleClear}
          style={customKeyStyle}
          className={cn(
            CLEAR_BUTTON_CLASSES,
            buttonClassName,
            customKeyClassName
          )}
        >
          Clear
        </Button>
      )}
      {showSubmitButton && (
        <>
          <div />
          <div />
          <div />
          <button
            type="button"
            disabled={disabled}
            onClick={handleSubmit}
            style={customSubmitStyle}
            className={cn(
              SUBMIT_BUTTON_CLASSES,
              buttonClassName,
              customSubmitClassName
            )}
          >
            <ChevronLeft className="mx-auto h-12 w-12 rotate-180 text-gray-800" />
          </button>
        </>
      )}

      {/* Row 3: 7, 8, 9 */}
      <NumberButton num="7" onClick={() => handleNumberClick("7")} />
      <NumberButton num="8" onClick={() => handleNumberClick("8")} />
      <NumberButton num="9" onClick={() => handleNumberClick("9")} />

      {/* Row 4: 0, 00, 000 */}
      <NumberButton num="0" onClick={() => handleNumberClick("0")} />
      {allowDoubleZero ? (
        <>
          <NumberButton num="00" onClick={() => handleNumberClick("00")} />
          <NumberButton num="000" onClick={() => handleNumberClick("000")} />
        </>
      ) : allowDecimal ? (
        <Button
          type="button"
          disabled={disabled}
          onClick={handleDecimalClick}
          style={customKeyStyle}
          className={cn(
            NUMBER_BUTTON_BASE_CLASSES,
            buttonClassName,
            customKeyClassName
          )}
        >
          .
        </Button>
      ) : (
        <>
          <div />
          <div />
        </>
      )}
      {showSubmitButton && <div />}
    </div>
  );
}

Numpad.displayName = "Numpad";

export default Numpad;
