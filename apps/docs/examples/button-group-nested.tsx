"use client" // sync-shadcn

import { AudioLinesIcon, PlusIcon } from "lucide-react"

import { Button } from "@multiclubes/ui/components/button"
import { ButtonGroup } from "@multiclubes/ui/components/button-group"
import { Input } from "@multiclubes/ui/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@multiclubes/ui/components/input-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@multiclubes/ui/components/tooltip"

export function ButtonGroupNested() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput placeholder="Send a message..." />
          <Tooltip>
            <TooltipTrigger render={<InputGroupAddon align="inline-end" />}>
              <AudioLinesIcon />
            </TooltipTrigger>
            <TooltipContent>Voice Mode</TooltipContent>
          </Tooltip>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  )
}
