import type { Meta, StoryObj } from '@storybook/react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '../../../shadcn/ui/input-otp';

const meta: Meta<typeof InputOTP> = {
  title: 'Shadcn/UI/InputOTP',
  component: InputOTP,
};

export default meta;

type Story = StoryObj<typeof InputOTP>;

export const Basic: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Enter the 6-digit code we emailed you.
      </p>
      <InputOTP maxLength={6} aria-label="One-time password input">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  ),
};
