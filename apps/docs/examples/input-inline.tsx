"use client" // sync-shadcn

import { Button } from "@multiclubes/ui/components/button"
import { Field } from "@multiclubes/ui/components/field"
import { Input } from "@multiclubes/ui/components/input"

export function InputInline() {
  return (
    <Field orientation="horizontal">
      <Input type="search" placeholder="Search..." />
      <Button>Search</Button>
    </Field>
  )
}
