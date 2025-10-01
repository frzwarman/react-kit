import { cn } from '../../../shadcn/lib/utils';
import { Dialog, DialogContent } from '../../../shadcn/ui/dialog';
import { StackDialogInstance } from './types';

export function StackDialogRenderer(props: {
  dialogs: StackDialogInstance[],
  closeDialog: (id: string) => void
}) {
  const handleCloseDialog = (dialog: StackDialogInstance) => () => {
    if (dialog.onInterruptClosing == null) {
      props.closeDialog(dialog.id);
    }
    else if (dialog.onInterruptClosing()) {
      props.closeDialog(dialog.id)
    }
  }

  return props.dialogs.map((dialog, i) => (
    (
      <Dialog
        open={!!props.dialogs[i]}
        onOpenChange={handleCloseDialog(dialog)}
        key={dialog.id}
      >
        <DialogContent
          className={cn("w-auto min-w-[300px]", dialog.dialogContentClassName)}
          onEscapeKeyDown={e => {
            if (dialog.closeOnEscapePressed === false) e.preventDefault();
          }}
          onInteractOutside={e => {
            if (dialog.closeOnInteractOutside === false) e.preventDefault();
          }}
        >
          {dialog.template}
        </DialogContent>
      </Dialog>
    )
  ));
}