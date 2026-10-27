"use client" // sync-shadcn

import { Button } from "@multiclubes/ui/components/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@multiclubes/ui/components/tooltip"

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>
        Hover
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  )
}
