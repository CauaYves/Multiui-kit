"use client" // sync-shadcn

import { SaveIcon } from "lucide-react"

import { Button } from "@multiclubes/ui/components/button"
import { Kbd } from "@multiclubes/ui/components/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@multiclubes/ui/components/tooltip"

export function TooltipKeyboard() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="icon-sm" />}>
        <SaveIcon />
      </TooltipTrigger>
      <TooltipContent>
        Save Changes <Kbd>S</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
