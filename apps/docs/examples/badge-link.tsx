"use client" // sync-shadcn

import { ArrowUpRightIcon } from "lucide-react"

import { Badge } from "@multiclubes/ui/components/badge"

export function BadgeAsLink() {
  return (
    <Badge render={<a href="#link" />}>
      Open Link <ArrowUpRightIcon data-icon="inline-end" />
    </Badge>
  )
}
