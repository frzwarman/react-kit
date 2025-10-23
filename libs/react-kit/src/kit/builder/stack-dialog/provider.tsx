import { type PropsWithChildren, useCallback, useRef, useState } from 'react';
import { StackDialogContext } from './context';
import { StackDialogRenderer } from './renderer';
import type { StackDialogCreateConfig, StackDialogInstance } from './types';

export function StackDialogContextProvider(props: PropsWithChildren) {
  const [activeDialogs, setActiveDialogs] = useState<StackDialogInstance[]>([]);
  const ids = useRef<number>(0);

  const handleCreateDialog = useCallback((config: StackDialogCreateConfig) => {
    const dialogId = config.id ?? (ids.current++).toString();

    setActiveDialogs((prev) => {
      const clone = [...prev];
      clone.push({ ...config, id: dialogId });
      return clone;
    });

    return dialogId;
  }, []);

  const handleCloseDialog = useCallback((id?: string) => {
    setActiveDialogs((prev) => {
      const clone = [...prev];
      if (!id) clone.splice(clone.length - 1, 1);
      else clone.splice(clone.findIndex((d) => d.id === id));
      return clone;
    });
  }, []);

  const handleCloseAllDialog = useCallback(() => {
    setActiveDialogs([]);
  }, []);

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
  );
}
