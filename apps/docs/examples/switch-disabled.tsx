"use client" // sync-shadcn

import { Field, FieldLabel } from "@multiclubes/ui/components/field"
import { Switch } from "@multiclubes/ui/components/switch"

export function SwitchDisabled() {
  return (
    <Field orientation="horizontal" data-disabled className="w-fit">
      <Switch id="switch-disabled-unchecked" disabled />
      <FieldLabel htmlFor="switch-disabled-unchecked">Disabled</FieldLabel>
    </Field>
  )
}
