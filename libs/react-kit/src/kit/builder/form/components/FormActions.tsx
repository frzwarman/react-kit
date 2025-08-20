import React from 'react';
import { Button } from '../../../../shadcn/ui/button';
import { cn } from '../../../../shadcn/lib/utils';

export interface FormActionsProps {
  onSubmit?: () => void;
  onCancel?: () => void;
  onReset?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
  isSubmitting?: boolean;
  isValid?: boolean;
  showReset?: boolean;
  customActions?: React.ReactNode;
  className?: string;
  submitButtonProps?: React.ComponentProps<typeof Button>;
  cancelButtonProps?: React.ComponentProps<typeof Button>;
  resetButtonProps?: React.ComponentProps<typeof Button>;
}

export function FormActions({
  onSubmit,
  onCancel,
  onReset,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  resetLabel = 'Reset',
  isSubmitting = false,
  isValid = true,
  showReset = false,
  customActions,
  className,
  submitButtonProps,
  cancelButtonProps,
  resetButtonProps,
}: FormActionsProps) {
  return (
    <div className={cn('flex items-center justify-end space-x-4', className)}>
      {customActions}

      {showReset && onReset && (
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          disabled={isSubmitting}
          {...resetButtonProps}
        >
          {resetLabel}
        </Button>
      )}

      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          {...cancelButtonProps}
        >
          {cancelLabel}
        </Button>
      )}

      {onSubmit && (
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={isSubmitting || !isValid}
          {...submitButtonProps}
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      )}
    </div>
  );
}
