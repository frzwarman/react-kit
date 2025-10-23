import {
  createContext,
  useCallback,
  use,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../shadcn/ui/alert-dialog';
import { Dialog, DialogContent } from '../../../shadcn/ui/dialog';

export type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
};

export type CustomModalOptions = {
  preventCloseOnEscape?: boolean;
  preventCloseOnInteractOutside?: boolean;
  // Optional size/placement pass-through to DialogContent if needed later
};

type CustomRenderer<T = unknown> = (api: {
  close: (value?: T) => void;
}) => React.ReactNode;

interface DialogContextValue {
  confirm: (opts?: ConfirmOptions) => Promise<boolean>;
  open: <T = unknown>(
    render: CustomRenderer<T>,
    opts?: CustomModalOptions,
  ) => Promise<T | undefined>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialogController(): DialogContextValue {
  const ctx = use(DialogContext);
  if (!ctx)
    throw new Error('useDialogController must be used within DialogProvider');
  return ctx;
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const resolverRef = useRef<((value: unknown) => void) | null>(null);
  const [mode, setMode] = useState<'confirm' | 'custom' | null>(null);
  const [confirmOpts, setConfirmOpts] = useState<ConfirmOptions>({});
  const [customRender, setCustomRender] =
    useState<CustomRenderer<unknown> | null>(null);
  const [customOpts, setCustomOpts] = useState<CustomModalOptions | undefined>(
    undefined,
  );

  const confirm = useCallback((options?: ConfirmOptions) => {
    setConfirmOpts(options ?? {});
    setMode('confirm');
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve as (value: unknown) => void;
    });
  }, []);

  const openCustom = useCallback(
    <T,>(render: CustomRenderer<T>, options?: CustomModalOptions) => {
      setCustomRender(() => render as unknown as CustomRenderer<unknown>);
      setCustomOpts(options);
      setMode('custom');
      setOpen(true);
      return new Promise<T | undefined>((resolve) => {
        resolverRef.current = resolve as (value: unknown) => void;
      });
    },
    [],
  );

  const handleClose = useCallback((result: unknown) => {
    setOpen(false);
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
    setMode(null);
  }, []);

  const value = useMemo<DialogContextValue>(
    () => ({ confirm, open: openCustom }),
    [confirm, openCustom],
  );

  const {
    title: cTitle = 'Are you sure?',
    description: cDesc = 'This action cannot be undone.',
    confirmText: cConfirmText = 'Continue',
    cancelText: cCancelText = 'Cancel',
    destructive = false,
  } = confirmOpts;

  const actionClass = destructive
    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
    : '';

  return (
    <DialogContext value={value}>
      {children}
      {/* Confirm Dialog */}
      {mode === 'confirm' && (
        <AlertDialog open={open} onOpenChange={(o) => !o && handleClose(false)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">
                {cTitle}
              </AlertDialogTitle>
              {cDesc ? (
                <AlertDialogDescription className="text-muted-foreground">
                  {cDesc}
                </AlertDialogDescription>
              ) : null}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="text-foreground"
                onClick={() => handleClose(false)}
              >
                {cCancelText}
              </AlertDialogCancel>
              <AlertDialogAction
                className={actionClass}
                onClick={() => handleClose(true)}
              >
                {cConfirmText}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Custom Modal */}
      {mode === 'custom' && customRender && (
        <Dialog open={open} onOpenChange={(o) => !o && handleClose(undefined)}>
          <DialogContent
            onEscapeKeyDown={(e) => {
              if (customOpts?.preventCloseOnEscape) e.preventDefault();
            }}
            onInteractOutside={(e) => {
              if (customOpts?.preventCloseOnInteractOutside) e.preventDefault();
            }}
          >
            {customRender({ close: (v?: unknown) => handleClose(v) })}
          </DialogContent>
        </Dialog>
      )}
    </DialogContext>
  );
}

export default DialogProvider;
export const useDialog = useDialogController;
