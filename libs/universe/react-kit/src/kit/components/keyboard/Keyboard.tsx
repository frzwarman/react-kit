"use client";

import * as React from "react";
import { Delete, ArrowLeft, CornerDownLeft } from "lucide-react";
import { cn } from "../../../shadcn/lib/utils";
import { Button } from "../../../shadcn/ui/button";

// Constants
const KEY_BUTTON_BASE_CLASSES =
  "rounded-xl border-2 border-teal-200 bg-white text-teal-600 transition-all duration-150 hover:bg-teal-50 h-16 min-w-[80px] max-w-[88px] text-lg font-semibold";
const KEY_BUTTON_COMPACT_CLASSES =
  "rounded-xl border-2 border-teal-200 bg-white text-teal-600 transition-all duration-150 hover:bg-teal-50 h-16 min-w-[80px] max-w-[80px] text-lg font-semibold";
const BACKSPACE_BUTTON_CLASSES =
  "rounded-xl bg-red-600 text-white transition-all duration-150 hover:bg-red-700 h-16 min-w-[80px] max-w-[80px]";
const SPACE_BUTTON_CLASSES =
  "rounded-xl border-2 border-teal-200 bg-white text-teal-600 transition-all duration-150 hover:bg-teal-50 h-16 min-w-[630px] max-w-[630px] flex-1 text-lg font-semibold";
const ENTER_BUTTON_CLASSES =
  "rounded-xl border-2 border-teal-200 bg-green-500 text-white transition-all duration-150 hover:bg-green-600 h-16 min-w-[80px] max-w-[80px] text-lg font-semibold";
const PRESSED_KEY_CLASSES = "bg-teal-100 border-teal-400 scale-95";
const ACTIVE_TOGGLE_CLASSES =
  "bg-teal-600 text-white border-teal-600 hover:bg-teal-700";

export type KeyboardLayout = "qwerty" | "qwertz" | "azerty";

export interface KeyboardProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "onKeyPress"
  > {
  value?: string;
  onChange?: (value: string) => void;
  onKeyPress?: (key: string) => void;
  disabled?: boolean;
  layout?: KeyboardLayout;
  showNumbers?: boolean;
  showSymbols?: boolean;
  showShift?: boolean;
  showSpace?: boolean;
  showBackspace?: boolean;
  showEnter?: boolean;
  className?: string;
  buttonClassName?: string;
  customKeyStyle?: React.CSSProperties;
  customKeyClassName?: string;
  capsLock?: boolean;
  onCapsLockChange?: (capsLock: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

const QWERTY_LAYOUT = {
  row1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  row2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  row3: ["z", "x", "c", "v", "b", "n", "m"],
};

const QWERTZ_LAYOUT = {
  row1: ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p"],
  row2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  row3: ["y", "x", "c", "v", "b", "n", "m"],
};

const AZERTY_LAYOUT = {
  row1: ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p"],
  row2: ["q", "s", "d", "f", "g", "h", "j", "k", "l", "m"],
  row3: ["w", "x", "c", "v", "b", "n"],
};

const NUMBER_ROW = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const getLayout = (layout: KeyboardLayout) => {
  switch (layout) {
    case "qwertz":
      return QWERTZ_LAYOUT;
    case "azerty":
      return AZERTY_LAYOUT;
    default:
      return QWERTY_LAYOUT;
  }
};

export function Keyboard({
  value: controlledValue,
  onChange,
  onKeyPress,
  disabled = false,
  layout = "qwerty",
  showNumbers = true,
  showSymbols = true,
  showShift = true,
  showSpace = true,
  showBackspace = true,
  showEnter = false,
  className,
  buttonClassName,
  customKeyStyle,
  customKeyClassName,
  capsLock: controlledCapsLock,
  onCapsLockChange,
  inputRef,
  ...props
}: KeyboardProps) {
  const [internalValue, setInternalValue] = React.useState("");
  const [internalCapsLock, setInternalCapsLock] = React.useState(false);
  const [shiftPressed, setShiftPressed] = React.useState(false);
  const [symbolMode, setSymbolMode] = React.useState(false);
  const [pressedKey, setPressedKey] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const pendingCursorPos = React.useRef<number | null>(null);

  // Use a ref to track if virtual Caps Lock was just clicked (to prevent sync override)
  const virtualCapsLockJustToggled = React.useRef(false);
  // Track the last known Caps Lock state to detect changes
  const lastKnownCapsLockState = React.useRef(false);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Sync inputValue with actual input value when inputRef is provided
  React.useEffect(() => {
    if (inputRef?.current) {
      const updateInputValue = () => {
        setInputValue(inputRef.current?.value ?? "");
      };
      
      // Initial sync
      updateInputValue();
      
      // Listen to input events to keep in sync
      const input = inputRef.current;
      input.addEventListener("input", updateInputValue);
      input.addEventListener("change", updateInputValue);
      
      return () => {
        input.removeEventListener("input", updateInputValue);
        input.removeEventListener("change", updateInputValue);
      };
    }
    setInputValue(value);
    return undefined;
  }, [inputRef, value]);

  // Restore cursor position after React re-renders
  React.useEffect(() => {
    if (inputRef?.current && pendingCursorPos.current !== null) {
      const pos = pendingCursorPos.current;
      pendingCursorPos.current = null;
      // Use setTimeout to ensure React has finished rendering
      setTimeout(() => {
        if (inputRef?.current) {
          inputRef.current.setSelectionRange(pos, pos);
        }
      }, 0);
    }
  }, [value, inputRef]);

  // Get the actual input value for disabled checks
  const actualInputValue = inputRef?.current ? inputValue : value;

  const isCapsLockControlled = controlledCapsLock !== undefined;
  const capsLock = isCapsLockControlled ? controlledCapsLock : internalCapsLock;

  // Update ref when capsLock changes
  React.useEffect(() => {
    lastKnownCapsLockState.current = capsLock;
  }, [capsLock]);

  const keyboardLayout = React.useMemo(() => getLayout(layout), [layout]);

  const isShiftActive = capsLock || shiftPressed;

  // Map real keyboard keys to virtual keyboard keys
  const mapRealKeyToVirtual = React.useCallback(
    (key: string, event: KeyboardEvent): string | null => {
      const keyLower = key.toLowerCase();

      // Handle special keys
      if (key === "Backspace" || key === "Delete") return "Backspace";
      if (key === "Enter") return "Enter";
      if (key === " ") return "Space";
      if (key === "Tab") return "Tab";
      if (key === "Shift" || key === "ShiftLeft" || key === "ShiftRight")
        return "Shift";
      if (key === "CapsLock") return "CapsLock";
      if (key === "#" || key === "+" || key === "=") return "#+=";

      // Handle numbers
      if (/^[0-9]$/.test(key)) {
        return symbolMode ? null : key;
      }

      // Handle letters
      if (/^[a-z]$/i.test(key)) {
        if (symbolMode) {
          // In symbol mode, letters map to symbols
          return null; // Symbols are shown in dedicated rows
        }
        return keyLower;
      }

      // Handle symbols when shift is pressed
      if (event.shiftKey) {
        const shiftSymbolMap: Record<string, string> = {
          "1": ".",
          "2": "@",
          "3": "#",
          "4": "_",
          "5": "%",
          "6": "^",
          "7": "&",
          "8": "*",
          "9": "(",
          "0": ")",
          "-": ",",
          "=": "+",
          "[": "{",
          "]": "}",
          "\\": "|",
          ";": ":",
          "'": '"',
          ",": "<",
          ".": ">",
          "/": "?",
          "`": "~",
        };
        return shiftSymbolMap[key] || null;
      }

      // Handle regular symbols
      const symbolMap: Record<string, string> = {
        "-": "-",
        "=": "=",
        "[": "[",
        "]": "]",
        "\\": "\\",
        ";": ";",
        "'": "'",
        ",": ",",
        ".": ".",
        "/": "/",
        "`": "`",
      };
      return symbolMap[key] || null;
    },
    [symbolMode],
  );

  const handleKeyPress = React.useCallback(
    (key: string) => {
      if (disabled) return;

      // If inputRef is provided, manipulate the input directly to handle selection
      if (inputRef?.current) {
        const input = inputRef.current;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const currentValue = input.value;

        // Replace selected text with the new key
        const newValue =
          currentValue.slice(0, start) + key + currentValue.slice(end);
        const newCursorPos = start + key.length;

        // Update our internal state first
        setInputValue(newValue);
        
        // Store cursor position to restore after React re-renders
        pendingCursorPos.current = newCursorPos;
        
        // Call onChange to update parent state - React will handle the re-render
        onChange?.(newValue);
        if (!isControlled) {
          setInternalValue(newValue);
        }
        
        onKeyPress?.(key);
        return;
      }

      // Fallback to old behavior if no inputRef
      const newValue = value + key;
      if (isControlled) {
        onChange?.(newValue);
      } else {
        setInternalValue(newValue);
        onChange?.(newValue);
      }
      onKeyPress?.(key);
    },
    [disabled, value, isControlled, onChange, onKeyPress, inputRef],
  );

  const handleBackspace = React.useCallback(() => {
    if (disabled) return;

    // If inputRef is provided, check the actual input value
    if (inputRef?.current) {
      const input = inputRef.current;
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      const currentValue = input.value;

      if (start === end && start === 0) return; // Nothing to delete

      // Set pressed key for animation
      setPressedKey("Backspace");
      setTimeout(() => {
        setPressedKey(null);
      }, 150);

      // If text is selected, delete the selection
      // Otherwise, delete the character before the cursor
      let newValue: string;
      let newCursorPos: number;

      if (start !== end) {
        // Delete selected text
        newValue = currentValue.slice(0, start) + currentValue.slice(end);
        newCursorPos = start;
      } else {
        // Delete character before cursor
        newValue = currentValue.slice(0, start - 1) + currentValue.slice(start);
        newCursorPos = Math.max(0, start - 1);
      }

      // Update our internal state first
      setInputValue(newValue);
      
      // Store cursor position to restore after React re-renders
      pendingCursorPos.current = newCursorPos;
      
      // Call onChange to update parent state - React will handle the re-render
      onChange?.(newValue);
      if (!isControlled) {
        setInternalValue(newValue);
      }
      
      onKeyPress?.("Backspace");
      return;
    }

    // Fallback to old behavior if no inputRef
    if (value.length === 0) return;
    
    // Set pressed key for animation
    setPressedKey("Backspace");
    setTimeout(() => {
      setPressedKey(null);
    }, 150);
    
    const newValue = value.slice(0, -1);
    if (isControlled) {
      onChange?.(newValue);
    } else {
      setInternalValue(newValue);
      onChange?.(newValue);
    }
    onKeyPress?.("Backspace");
  }, [disabled, value, isControlled, onChange, onKeyPress, inputRef]);

  const handleSpace = React.useCallback(() => {
    // Set pressed key for animation
    setPressedKey("Space");
    setTimeout(() => {
      setPressedKey(null);
    }, 150);
    handleKeyPress(" ");
  }, [handleKeyPress]);

  const handleEnter = React.useCallback(() => {
    if (disabled) return;

    // Set pressed key for animation
    setPressedKey("Enter");
    setTimeout(() => {
      setPressedKey(null);
    }, 150);

    // If inputRef is provided, handle Enter like a real keyboard
    if (inputRef?.current) {
      const input = inputRef?.current;
      const isTextarea = input.tagName === "TEXTAREA";
      const isInput = input.tagName === "INPUT";

      if (isTextarea) {
        // For textarea: insert newline like real keyboard
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const currentValue = input.value;

        // Replace selected text with newline, or insert newline at cursor
        const newValue =
          currentValue.slice(0, start) + "\n" + currentValue.slice(end);
        const newCursorPos = start + 1;

        // Update input value
        input.value = newValue;

        // Set cursor position
        input.setSelectionRange(newCursorPos, newCursorPos);

        // Trigger input event for React
        const inputEvent = new Event("input", { bubbles: true });
        input.dispatchEvent(inputEvent);

        // Update controlled/uncontrolled state
        if (isControlled) {
          onChange?.(newValue);
        } else {
          setInternalValue(newValue);
          onChange?.(newValue);
        }
      } else if (isInput) {
        // For input: trigger Enter key events like real keyboard
        // This will trigger form submission if inside a form

        // Create and dispatch keydown event
        const keyDownEvent = new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
        });
        input.dispatchEvent(keyDownEvent);

        // Only trigger keypress and keyup if keydown wasn't prevented
        if (!keyDownEvent.defaultPrevented) {
          // Create and dispatch keypress event
          const keyPressEvent = new KeyboardEvent("keypress", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
          });
          input.dispatchEvent(keyPressEvent);

          // Create and dispatch keyup event
          const keyUpEvent = new KeyboardEvent("keyup", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
          });
          input.dispatchEvent(keyUpEvent);

          // If input is inside a form, trigger form submit
          const form = input.closest("form");
          if (form && !keyPressEvent.defaultPrevented) {
            // Trigger form submit event
            const submitEvent = new Event("submit", {
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

      // Call onKeyPress callback
      onKeyPress?.("Enter");
      return;
    }

    // Fallback: if no inputRef, just add newline to value
    const newValue = value + "\n";
    if (isControlled) {
      onChange?.(newValue);
    } else {
      setInternalValue(newValue);
      onChange?.(newValue);
    }
    onKeyPress?.("Enter");
  }, [disabled, value, isControlled, onChange, onKeyPress, inputRef]);

  const toggleCapsLock = React.useCallback(() => {
    // Set pressed key for animation
    setPressedKey("CapsLock");
    setTimeout(() => {
      setPressedKey(null);
    }, 150);

    // Set flag to prevent sync from overriding our toggle for a short period
    virtualCapsLockJustToggled.current = true;

    // Always use functional update to get the latest state
    if (isCapsLockControlled) {
      // For controlled components, use the current prop value
      const currentCapsLock = controlledCapsLock ?? false;
      const newCapsLock = !currentCapsLock;
      lastKnownCapsLockState.current = newCapsLock;
      onCapsLockChange?.(newCapsLock);
    } else {
      // For uncontrolled components, use functional update to avoid stale closures
      setInternalCapsLock((prev) => {
        const newCapsLock = !prev;
        lastKnownCapsLockState.current = newCapsLock;
        onCapsLockChange?.(newCapsLock);
        return newCapsLock;
      });
    }

    // Reset flag after a delay to allow sync again
    setTimeout(() => {
      virtualCapsLockJustToggled.current = false;
    }, 200);
  }, [isCapsLockControlled, onCapsLockChange, controlledCapsLock]);

  const toggleSymbolMode = React.useCallback(() => {
    // Set pressed key for animation
    setPressedKey("#+=");
    setTimeout(() => {
      setPressedKey(null);
    }, 150);
    setSymbolMode((prev) => !prev);
  }, []);

  // Listen to real keyboard events and sync Caps Lock state
  React.useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Caps Lock key press on physical keyboard
      if (event.key === "CapsLock" || event.key === "Caps") {
        setPressedKey("CapsLock");
        virtualCapsLockJustToggled.current = false; // Reset flag - physical keyboard takes priority

        // When Caps Lock is pressed, the state changes AFTER this event
        // So we toggle based on the last known state
        const newCapsLock = !lastKnownCapsLockState.current;
        lastKnownCapsLockState.current = newCapsLock;

        if (!isCapsLockControlled) {
          setInternalCapsLock(newCapsLock);
          onCapsLockChange?.(newCapsLock);
        } else {
          onCapsLockChange?.(newCapsLock);
        }
        return;
      }

      // Sync with browser's actual caps lock state on any key press
      // This ensures we stay in sync with physical keyboard
      // But skip if virtual Caps Lock was just toggled (to prevent override)
      if (!virtualCapsLockJustToggled.current) {
        const browserCapsLock = event.getModifierState("CapsLock");

        // Only update if state has actually changed
        if (browserCapsLock !== lastKnownCapsLockState.current) {
          lastKnownCapsLockState.current = browserCapsLock;

          if (!isCapsLockControlled) {
            setInternalCapsLock(browserCapsLock);
            onCapsLockChange?.(browserCapsLock);
          } else {
            onCapsLockChange?.(browserCapsLock);
          }
        }
      }

      const virtualKey = mapRealKeyToVirtual(event.key, event);
      if (virtualKey) {
        setPressedKey(virtualKey);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKey(null);

      // Also check Caps Lock state on keyup to catch any changes
      if (!virtualCapsLockJustToggled.current) {
        const browserCapsLock = event.getModifierState("CapsLock");
        if (browserCapsLock !== lastKnownCapsLockState.current) {
          lastKnownCapsLockState.current = browserCapsLock;

          if (!isCapsLockControlled) {
            setInternalCapsLock(browserCapsLock);
            onCapsLockChange?.(browserCapsLock);
          } else {
            onCapsLockChange?.(browserCapsLock);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [disabled, mapRealKeyToVirtual, isCapsLockControlled, onCapsLockChange]);

  // Helper to animate key press
  const animateKeyPress = React.useCallback((key: string) => {
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 150);
  }, []);

  const formatKey = (key: string): string => {
    if (symbolMode) {
      const symbolMap: Record<string, string> = {
        q: "[",
        w: "]",
        e: "\\",
        r: ";",
        t: "'",
        y: ",",
        u: ".",
        i: "/",
        o: "=",
        p: "-",
        a: "{",
        s: "}",
        d: ":",
        f: '"',
        g: "<",
        h: ">",
        j: "?",
        k: "+",
        l: "_",
        z: "|",
        x: "~",
        c: "`",
        v: "|",
        b: "~",
        n: "`",
        m: "|",
      };
      return symbolMap[key.toLowerCase()] || key;
    }
    return isShiftActive ? key.toUpperCase() : key.toLowerCase();
  };

  const getNumberSymbol = (num: string, shift: boolean): string => {
    if (!shift) return num;
    const symbols: Record<string, string> = {
      "1": ".",
      "2": "@",
      "3": "#",
      "4": "_",
      "5": "%",
      "6": "^",
      "7": "&",
      "8": "*",
      "9": "(",
      "0": ")",
    };
    return symbols[num] || num;
  };

  // Helper component for key buttons
  const KeyButton = React.useCallback(
    ({
      children,
      onClick,
      isPressed = false,
      className = "",
      compact = false,
    }: {
      children: React.ReactNode;
      onClick: () => void;
      isPressed?: boolean;
      className?: string;
      compact?: boolean;
    }) => (
      <Button
        type="button"
        disabled={disabled}
        onClick={onClick}
        style={customKeyStyle}
        className={cn(
          compact ? KEY_BUTTON_COMPACT_CLASSES : KEY_BUTTON_BASE_CLASSES,
          isPressed && PRESSED_KEY_CLASSES,
          buttonClassName,
          customKeyClassName,
          className
        )}
      >
        {children}
      </Button>
    ),
    [disabled, customKeyStyle, buttonClassName, customKeyClassName]
  );

  // Helper component for symbol buttons
  const SymbolButton = React.useCallback(
    ({ sym }: { sym: string }) => {
      const isPressed = pressedKey === sym;
      return (
        <KeyButton
          isPressed={isPressed}
          onClick={() => {
            animateKeyPress(sym);
            handleKeyPress(sym);
          }}
        >
          {sym}
        </KeyButton>
      );
    },
    [pressedKey, animateKeyPress, handleKeyPress, KeyButton]
  );

  // Helper component for letter buttons
  const LetterButton = React.useCallback(
    ({ keyChar }: { keyChar: string }) => {
      const displayChar = formatKey(keyChar);
      const isPressed = pressedKey === keyChar.toLowerCase();
      return (
        <KeyButton
          isPressed={isPressed}
          onClick={() => {
            animateKeyPress(keyChar.toLowerCase());
            handleKeyPress(displayChar);
            if (shiftPressed) setShiftPressed(false);
          }}
        >
          {displayChar}
        </KeyButton>
      );
    },
    [
      pressedKey,
      shiftPressed,
      animateKeyPress,
      handleKeyPress,
      formatKey,
      KeyButton,
    ]
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-6 bg-background border border-border rounded-lg shadow-sm",
        className,
      )}
      {...props}
    >
      {/* Number row - hidden when symbol mode is active */}
      {showNumbers && (
        <div className="flex gap-3 justify-center">
          {NUMBER_ROW.map((num) => {
            const displayChar = shiftPressed ? getNumberSymbol(num, true) : num;
            const isPressed = pressedKey === num;
            return (
              <KeyButton
                key={num}
                isPressed={isPressed}
                onClick={() => {
                  animateKeyPress(num);
                  handleKeyPress(displayChar);
                  if (shiftPressed) setShiftPressed(false);
                }}
              >
                {displayChar}
              </KeyButton>
            );
          })}
        </div>
      )}

      {/* Symbol rows - shows when symbol mode is active */}
      {symbolMode && (
        <>
          {/* Row 1: Special symbols - 10 keys balanced */}
          <div className="flex gap-3 justify-center">
            {["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"].map((sym) => (
              <SymbolButton key={sym} sym={sym} />
            ))}
          </div>
          {/* Row 2: Brackets and quotes - 10 keys balanced */}
          <div className="flex gap-3 justify-center">
            {["[", "]", "{", "}", "|", "\\", ";", ":", "'", '"'].map((sym) => (
              <SymbolButton key={sym} sym={sym} />
            ))}
          </div>
          {/* Row 3: Punctuation and operators - 9 keys */}
          <div className="flex gap-3 justify-center">
            {[",", ".", "/", "?", "+", "-", "=", "_", "~"].map((sym) => (
              <SymbolButton key={sym} sym={sym} />
            ))}
            {showBackspace && (
              <button
                type="button"
                disabled={disabled || actualInputValue.length === 0}
                onClick={handleBackspace}
                style={customKeyStyle}
                className={cn(
                  BACKSPACE_BUTTON_CLASSES,
                  buttonClassName,
                  customKeyClassName
                )}
              >
                <Delete className="mx-auto h-6 w-6" />
              </button>
            )}
          </div>
        </>
      )}

      {/* Letter rows - hidden when symbol mode is active */}
      {!symbolMode && (
        <>
          {/* Row 1 - Letter row Q-P */}
          <div className="flex gap-3 justify-center">
            {keyboardLayout.row1.map((keyChar) => (
              <LetterButton key={keyChar} keyChar={keyChar} />
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex gap-3 justify-center">
            {keyboardLayout.row2.map((keyChar) => (
              <LetterButton key={keyChar} keyChar={keyChar} />
            ))}
          </div>
        </>
      )}

      {/* Row 3 - Bottom letter row with controls */}
      <div className="flex gap-3 justify-center">
        {!symbolMode && (
          <>
            {showShift && (
              <KeyButton
                compact
                isPressed={pressedKey === "CapsLock" && !capsLock}
                onClick={toggleCapsLock}
                className={capsLock ? ACTIVE_TOGGLE_CLASSES : ""}
              >
                <ArrowLeft className="h-6 w-6 rotate-90" />
              </KeyButton>
            )}
            {keyboardLayout.row3.map((keyChar) => (
              <LetterButton key={keyChar} keyChar={keyChar} />
            ))}
            {showBackspace && (
              <button
                type="button"
                disabled={disabled || actualInputValue.length === 0}
                onClick={handleBackspace}
                style={customKeyStyle}
                className={cn(
                  BACKSPACE_BUTTON_CLASSES,
                  buttonClassName,
                  customKeyClassName
                )}
              >
                <Delete className="mx-auto h-6 w-6" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Bottom row */}
      <div className="flex gap-3 justify-center">
        <KeyButton
          compact
          isPressed={pressedKey === "#+=" && !symbolMode}
          onClick={toggleSymbolMode}
          className={symbolMode ? ACTIVE_TOGGLE_CLASSES : ""}
        >
          #+=
        </KeyButton>
        {showSpace && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleSpace}
            style={customKeyStyle}
            className={cn(
              SPACE_BUTTON_CLASSES,
              pressedKey === "Space" && PRESSED_KEY_CLASSES,
              buttonClassName,
              customKeyClassName
            )}
          >
            Space
          </Button>
        )}
        {showEnter && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleEnter}
            style={customKeyStyle}
            className={cn(
              ENTER_BUTTON_CLASSES,
              buttonClassName,
              customKeyClassName
            )}
          >
            <CornerDownLeft className="mx-auto h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}

Keyboard.displayName = "Keyboard";

export default Keyboard;
