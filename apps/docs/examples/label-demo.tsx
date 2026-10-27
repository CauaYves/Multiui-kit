"use client" // sync-shadcn

import { Checkbox } from "@multiclubes/ui/components/checkbox"
import { Label } from "@multiclubes/ui/components/label"

export default function LabelDemo() {
  return (
    <div className="flex gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}
