import { Dialog } from '@/shadcn/ui/dialog';
import { StackDialogInstance } from './types';
import { DialogContent } from '@radix-ui/react-dialog';

export function StackDialogRenderer(props: {
  dialogs: StackDialogInstance[],
  closeDialog: (id: string) => void
}) {
  const handleCloseDialog = (id: string) => () => {
    props.closeDialog(id)
  }

  return props.dialogs.map((dialog) => (
    (
      <Dialog
        open
        onOpenChange={(open) => (!open && handleCloseDialog(dialog.id))}
        key={dialog.id}
      >
        <DialogContent
          onEscapeKeyDown={e => {
            if (!dialog.closeOnEscapePressed) e.preventDefault();
          }}
          onInteractOutside={e => {
            if (!dialog.closeOnInteractOutside) e.preventDefault();
          }}
        >
          {dialog.template}
        </DialogContent>
      </Dialog>
    )
  ));
}