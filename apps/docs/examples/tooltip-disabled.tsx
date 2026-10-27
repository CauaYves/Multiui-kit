"use client" // sync-shadcn

import { Button } from "@multiclubes/ui/components/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@multiclubes/ui/components/tooltip"

export function TooltipDisabled() {
  return (
    <>
      <Tooltip>
        <TooltipTrigger render={<span className="inline-block w-fit" />}>
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This feature is currently unavailable</p>
        </TooltipContent>
      </Tooltip>
    </>
  )
}
