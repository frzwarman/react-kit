import { Dialog, DialogContent } from '../../../shadcn/ui/dialog';
import { StackDialogInstance } from './types';

export function StackDialogRenderer(props: {
  dialogs: StackDialogInstance[],
  closeDialog: (id: string) => void
}) {
  const handleCloseDialog = (id: string) => () => {
    props.closeDialog(id)
  }

  return props.dialogs.map((dialog, i) => (
    (
      <Dialog
        open={!!props.dialogs[i]}
        onOpenChange={handleCloseDialog(dialog.id)}
        key={dialog.id}
      >
        <DialogContent
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