import type { Meta, StoryObj } from '@storybook/react';
import { DialogProvider, useDialog } from '../../../kit/builder/dialog';
import { Button } from '../../../shadcn/ui/button';

const meta: Meta = {
  title: 'Kit/Builder/Dialog',
  decorators: [
    (Story) => (
      <DialogProvider>
        <div className="space-y-6">
          <Story />
        </div>
      </DialogProvider>
    ),
  ],
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ConfirmExample: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { confirm } = useDialog();
    return (
      <div className="flex items-center gap-3">
        <Button
          onClick={async () => {
            const ok = await confirm({
              title: 'Delete item?',
              description: 'This action cannot be undone.',
              destructive: true,
              confirmText: 'Delete',
              cancelText: 'Cancel',
            });
            // eslint-disable-next-line no-console
            console.log('confirm result:', ok);
          }}
        >
          Open Confirm
        </Button>
      </div>
    );
  },
};

export const CustomExample: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { open } = useDialog();
    return (
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={async () => {
            const val = await open<string>(({ close }) => (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Custom Modal</h3>
                <p className="text-sm text-muted-foreground">You can render anything here and call close(value) to resolve.</p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => close(undefined)}>
                    Cancel
                  </Button>
                  <Button onClick={() => close('done')}>
                    Confirm
                  </Button>
                </div>
              </div>
            ), { preventCloseOnInteractOutside: true });
            // eslint-disable-next-line no-console
            console.log('custom result:', val);
          }}
        >
          Open Custom
        </Button>
      </div>
    );
  },
};
