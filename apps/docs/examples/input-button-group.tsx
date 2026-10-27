"use client" // sync-shadcn

import { Button } from "@multiclubes/ui/components/button"
import { ButtonGroup } from "@multiclubes/ui/components/button-group"
import { Field, FieldLabel } from "@multiclubes/ui/components/field"
import { Input } from "@multiclubes/ui/components/input"

export function InputButtonGroup() {
  return (
    <Field>
      <FieldLabel htmlFor="input-button-group">Search</FieldLabel>
      <ButtonGroup>
        <Input id="input-button-group" placeholder="Type to search..." />
        <Button variant="outline">Search</Button>
      </ButtonGroup>
    </Field>
  )
}
