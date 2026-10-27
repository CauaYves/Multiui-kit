"use client" // sync-shadcn

import { Field, FieldLabel } from "@multiclubes/ui/components/field"
import { Textarea } from "@multiclubes/ui/components/textarea"

export function TextareaDisabled() {
  return (
    <Field data-disabled>
      <FieldLabel htmlFor="textarea-disabled">Message</FieldLabel>
      <Textarea
        id="textarea-disabled"
        placeholder="Type your message here."
        disabled
      />
    </Field>
  )
}
