"use client" // sync-shadcn

import { SearchIcon } from "lucide-react"

import { Button } from "@multiclubes/ui/components/button"
import { ButtonGroup } from "@multiclubes/ui/components/button-group"
import { Input } from "@multiclubes/ui/components/input"

export default function ButtonGroupInput() {
  return (
    <ButtonGroup>
      <Input placeholder="Search..." />
      <Button variant="outline" aria-label="Search">
        <SearchIcon />
      </Button>
    </ButtonGroup>
  )
}
