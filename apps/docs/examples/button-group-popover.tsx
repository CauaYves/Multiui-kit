"use client" // sync-shadcn

import { BotIcon, ChevronDownIcon } from "lucide-react"

import { Button } from "@multiclubes/ui/components/button"
import { ButtonGroup } from "@multiclubes/ui/components/button-group"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@multiclubes/ui/components/field"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@multiclubes/ui/components/popover"
import { Textarea } from "@multiclubes/ui/components/textarea"

export default function ButtonGroupPopover() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <BotIcon /> Copilot
      </Button>
      <Popover>
        <PopoverTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Open Popover" />
          }
        >
          <ChevronDownIcon />
        </PopoverTrigger>
        <PopoverContent align="end" className="rounded-xl text-sm">
          <PopoverHeader>
            <PopoverTitle>Start a new task with Copilot</PopoverTitle>
            <PopoverDescription>
              Describe your task in natural language.
            </PopoverDescription>
          </PopoverHeader>
          <Field>
            <FieldLabel htmlFor="task" className="sr-only">
              Task Description
            </FieldLabel>
            <Textarea
              id="task"
              placeholder="I need to..."
              className="resize-none"
            />
            <FieldDescription>
              Copilot will open a pull request for review.
            </FieldDescription>
          </Field>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  )
}
