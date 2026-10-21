"use client" // sync-shadcn

import { ItalicIcon } from "lucide-react"

import { Toggle } from "@multiclubes/ui/components/toggle"

export function ToggleText() {
  return (
    <Toggle aria-label="Toggle italic">
      <ItalicIcon />
      Italic
    </Toggle>
  )
}
