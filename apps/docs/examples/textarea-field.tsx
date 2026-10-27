"use client" // sync-shadcn

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@multiclubes/ui/components/field"
import { Textarea } from "@multiclubes/ui/components/textarea"

export function TextareaField() {
  return (
    <Field>
      <FieldLabel htmlFor="textarea-message">Message</FieldLabel>
      <FieldDescription>Enter your message below.</FieldDescription>
      <Textarea id="textarea-message" placeholder="Type your message here." />
    </Field>
  )
}
