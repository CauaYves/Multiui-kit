"use client" // sync-shadcn

import { Checkbox } from "@multiclubes/ui/components/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@multiclubes/ui/components/field"

export function CheckboxDescription() {
  return (
    <FieldGroup className="mx-auto w-72">
      <Field orientation="horizontal">
        <Checkbox
          id="terms-checkbox-desc"
          name="terms-checkbox-desc"
          defaultChecked
        />
        <FieldContent>
          <FieldLabel htmlFor="terms-checkbox-desc">
            Accept terms and conditions
          </FieldLabel>
          <FieldDescription>
            By clicking this checkbox, you agree to the terms and conditions.
          </FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
