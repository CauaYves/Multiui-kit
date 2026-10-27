"use client" // sync-shadcn

import { Field, FieldLabel } from "@multiclubes/ui/components/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@multiclubes/ui/components/input-otp"

export function InputOTPDisabled() {
  return (
    <InputOTP id="disabled" maxLength={6} disabled value="123456">
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
  )
}
