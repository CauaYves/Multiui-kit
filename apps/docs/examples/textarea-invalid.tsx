"use client" // sync-shadcn

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@multiclubes/ui/components/field"
import { Textarea } from "@multiclubes/ui/components/textarea"

export function TextareaInvalid() {
  return (
    <Field data-invalid>
      <FieldLabel htmlFor="textarea-invalid">Message</FieldLabel>
      <Textarea
        id="textarea-invalid"
        placeholder="Type your message here."
        aria-invalid
      />
      <FieldDescription>Please enter a valid message.</FieldDescription>
    </Field>
  )
}
