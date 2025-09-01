import { PropsWithChildren, useCallback, useRef, useState } from 'react';
import { StackDialogContext } from './context';
import { StackDialogRenderer } from './renderer';
import { StackDialogCreateConfig, StackDialogInstance } from './types';

export function StackDialogContextProvider(props: PropsWithChildren) {
  const [activeDialogs, setActiveDialogs] = useState<StackDialogInstance[]>([]);
  const ids = useRef<number>(0)

  const handleCreateDialog = useCallback((config: StackDialogCreateConfig) => {
    const dialogId = config.id || (ids.current++).toString();

    setActiveDialogs(prev => {
      const clone = [...prev];
      clone.push({
        id: dialogId,
        template: config.template,
        closeOnEscapePressed: config.closeOnEscapePressed,
        closeOnInteractOutside: config.closeOnInteractOutside,
      });
      return clone;
    });

    return dialogId;
  }, [setActiveDialogs]);

  const handleCloseDialog = useCallback((id?: string) => {
    setActiveDialogs(prev => {
      const clone = [...prev];
      clone.splice(clone.findIndex(d => d.id === (id || '')));
      return clone;
    });
  }, [setActiveDialogs]);

  const handleCloseAllDialog = useCallback(() => {
    setActiveDialogs([]);
  }, [setActiveDialogs]);

  return (
    <StackDialogContext.Provider
      value={{
        activeDialogs,
        createDialog: handleCreateDialog,
        closeDialog: handleCloseDialog,
        closeAllDialogs: handleCloseAllDialog,
      }}
    >
      {props.children}
      <StackDialogRenderer
        dialogs={activeDialogs}
        closeDialog={handleCloseDialog}
      />
    </StackDialogContext.Provider>
  )
}