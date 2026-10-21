"use client" // sync-shadcn

import { Badge } from "@multiclubes/ui/components/badge"
import { Field, FieldLabel } from "@multiclubes/ui/components/field"
import { Input } from "@multiclubes/ui/components/input"

export function InputBadge() {
  return (
    <Field>
      <FieldLabel htmlFor="input-badge">
        Webhook URL{" "}
        <Badge variant="secondary" className="ml-auto">
          Beta
        </Badge>
      </FieldLabel>
      <Input
        id="input-badge"
        type="url"
        placeholder="https://api.example.com/webhook"
      />
    </Field>
  )
}
