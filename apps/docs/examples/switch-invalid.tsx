"use client" // sync-shadcn

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@multiclubes/ui/components/field"
import { Switch } from "@multiclubes/ui/components/switch"

export function SwitchInvalid() {
  return (
    <Field orientation="horizontal" className="max-w-sm" data-invalid>
      <FieldContent>
        <FieldLabel htmlFor="switch-terms">
          Accept terms and conditions
        </FieldLabel>
        <FieldDescription>
          You must accept the terms and conditions to continue.
        </FieldDescription>
      </FieldContent>
      <Switch id="switch-terms" aria-invalid />
    </Field>
  )
}
