import { ReactNode } from 'react';

export type StackDialogContextInstance = {
  activeDialogs: StackDialogInstance[],
  createDialog: (config: StackDialogCreateConfig) => string,
  closeDialog: (id?: string) => void,
  closeAllDialogs: () => void,
};

export type StackDialogInstance = {
  id: string,
  template: ReactNode,
  closeOnInteractOutside?: boolean,
  closeOnEscapePressed?: boolean,
};

export type StackDialogCreateConfig = {
  id?: string,
  template: ReactNode,
  closeOnInteractOutside?: boolean,
  closeOnEscapePressed?: boolean,
};
