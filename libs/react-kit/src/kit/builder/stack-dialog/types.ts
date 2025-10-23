import type { ReactNode } from 'react';

export type StackDialogContextInstance = {
  activeDialogs: StackDialogInstance[];
  createDialog: (config: StackDialogCreateConfig) => string;
  closeDialog: (id?: string) => void;
  closeAllDialogs: () => void;
};

export type StackDialogInstance = {
  id: string;
  template: ReactNode;
  dialogContentClassName?: string;
  onInterruptClosing?: () => boolean;
  closeOnInteractOutside?: boolean;
  closeOnEscapePressed?: boolean;
};

export type StackDialogCreateConfig = {
  /** Optional ID for the dialog, generated when omited. */
  id?: string;
  /** The element to be rendered in the dialog. */
  template: ReactNode;
  /** Return **`true`** to continue closing the dialog. */
  onInterruptClosing?: () => boolean;
  /** Allow closing the dialog by clicking outside of dialog. */
  closeOnInteractOutside?: boolean;
  /** Allow closing the dialog by pressing Escape key. */
  closeOnEscapePressed?: boolean;
  /** Classname for DialogContent */
  dialogContentClassName?: string;
};

export type StackDialogHook = Omit<StackDialogContextInstance, 'activeDialogs'>;
