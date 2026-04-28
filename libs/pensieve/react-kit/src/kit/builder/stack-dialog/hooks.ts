import { useContext } from 'react';
import { StackDialogContext } from './context';
import type { StackDialogHook } from './types';

export function useStackDialog(): StackDialogHook {
  const { createDialog, closeDialog, closeAllDialogs } =
    useContext(StackDialogContext);
  return {
    createDialog,
    closeDialog,
    closeAllDialogs,
  };
}
