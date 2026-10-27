"use client" // sync-shadcn

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@multiclubes/ui/components/field"
import { Input } from "@multiclubes/ui/components/input"

export function InputInvalid() {
  return (
    <Field data-invalid>
      <FieldLabel htmlFor="input-invalid">Invalid Input</FieldLabel>
      <Input id="input-invalid" placeholder="Error" aria-invalid />
      <FieldDescription>
        This field contains validation errors.
      </FieldDescription>
    </Field>
  )
}
