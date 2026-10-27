"use client" // sync-shadcn

import { Checkbox } from "@multiclubes/ui/components/checkbox"
import { Field, FieldGroup, FieldLabel } from "@multiclubes/ui/components/field"

export function CheckboxDisabled() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" data-disabled>
        <Checkbox
          id="toggle-checkbox-disabled"
          name="toggle-checkbox-disabled"
          disabled
        />
        <FieldLabel htmlFor="toggle-checkbox-disabled">
          Enable notifications
        </FieldLabel>
      </Field>
    </FieldGroup>
  )
}
