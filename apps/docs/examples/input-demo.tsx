"use client" // sync-shadcn

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@multiclubes/ui/components/field"
import { Input } from "@multiclubes/ui/components/input"

export function InputDemo() {
  return (
    <Field>
      <FieldLabel htmlFor="input-demo-api-key">API Key</FieldLabel>
      <Input id="input-demo-api-key" type="password" placeholder="sk-..." />
      <FieldDescription>
        Your API key is encrypted and stored securely.
      </FieldDescription>
    </Field>
  )
}
