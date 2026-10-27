"use client" // sync-shadcn

import { Button } from "@multiclubes/ui/components/button"
import { ButtonGroup } from "@multiclubes/ui/components/button-group"
import { Kbd, KbdGroup } from "@multiclubes/ui/components/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@multiclubes/ui/components/tooltip"

export default function KbdTooltip() {
  return (
    <div className="flex flex-wrap gap-4">
      <ButtonGroup>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            Save
          </TooltipTrigger>
          <TooltipContent>
            Save Changes <Kbd>S</Kbd>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            Print
          </TooltipTrigger>
          <TooltipContent>
            Print Document{" "}
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>P</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </ButtonGroup>
    </div>
  )
}
