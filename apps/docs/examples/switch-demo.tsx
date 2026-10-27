"use client" // sync-shadcn

import { Label } from "@multiclubes/ui/components/label"
import { Switch } from "@multiclubes/ui/components/switch"

export function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}
