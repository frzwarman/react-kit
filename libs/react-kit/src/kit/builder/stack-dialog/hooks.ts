import { useContext } from 'react';
import { StackDialogContext } from './context';

export function useStackDialog() {
  const { createDialog, closeDialog, closeAllDialogs } = useContext(StackDialogContext);
  return {
    createDialog,
    closeDialog,
    closeAllDialogs,
  }
}