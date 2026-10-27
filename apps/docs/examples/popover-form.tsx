"use client" // sync-shadcn

import { Button } from "@multiclubes/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@multiclubes/ui/components/field"
import { Input } from "@multiclubes/ui/components/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@multiclubes/ui/components/popover"

export function PopoverForm() {
  return (
    <>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Open Popover
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the dimensions for the layer.
            </PopoverDescription>
          </PopoverHeader>
          <FieldGroup className="gap-4">
            <Field orientation="horizontal">
              <FieldLabel htmlFor="width" className="w-1/2">
                Width
              </FieldLabel>
              <Input id="width" defaultValue="100%" />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="height" className="w-1/2">
                Height
              </FieldLabel>
              <Input id="height" defaultValue="25px" />
            </Field>
          </FieldGroup>
        </PopoverContent>
      </Popover>
    </>
  )
}
