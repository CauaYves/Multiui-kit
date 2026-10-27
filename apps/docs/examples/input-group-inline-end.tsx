"use client" // sync-shadcn

import { EyeOffIcon } from "lucide-react"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@multiclubes/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@multiclubes/ui/components/input-group"

export function InputGroupInlineEnd() {
  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="inline-end-input">Input</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="inline-end-input"
          type="password"
          placeholder="Enter password"
        />
        <InputGroupAddon align="inline-end">
          <EyeOffIcon />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Icon positioned at the end.</FieldDescription>
    </Field>
  )
}
