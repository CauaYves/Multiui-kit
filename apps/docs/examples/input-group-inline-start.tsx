"use client" // sync-shadcn

import { SearchIcon } from "lucide-react"

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

export function InputGroupInlineStart() {
  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="inline-start-input">Input</FieldLabel>
      <InputGroup>
        <InputGroupInput id="inline-start-input" placeholder="Search..." />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Icon positioned at the start.</FieldDescription>
    </Field>
  )
}
