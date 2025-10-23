import { createContext } from 'react';
import type { StackDialogContextInstance } from './types';

export const StackDialogContext = createContext<StackDialogContextInstance>({
  activeDialogs: [],
  createDialog: () => {
    throw new Error('createDialog must be called within StackDialogProvider');
  },
  closeDialog: () => {
    throw new Error('closeDialog must be called within StackDialogProvider');
  },
  closeAllDialogs: () => {
    throw new Error('closeAllDialog must be called within StackDialogProvider');
  },
});
