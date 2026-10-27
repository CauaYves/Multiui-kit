"use client" // sync-shadcn

import { Field, FieldLabel } from "@multiclubes/ui/components/field"
import { Switch } from "@multiclubes/ui/components/switch"

export default function FieldSwitch() {
  return (
    <Field orientation="horizontal" className="w-fit">
      <FieldLabel htmlFor="2fa">Multi-factor authentication</FieldLabel>
      <Switch id="2fa" />
    </Field>
  )
}
