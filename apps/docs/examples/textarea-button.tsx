"use client" // sync-shadcn

import { Button } from "@multiclubes/ui/components/button"
import { Textarea } from "@multiclubes/ui/components/textarea"

export function TextareaButton() {
  return (
    <div className="grid w-full gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  )
}
