"use client" // sync-shadcn

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@multiclubes/ui/components/progress"

export function ProgressWithLabel() {
  return (
    <Progress value={56} className="w-full max-w-sm">
      <ProgressLabel>Upload progress</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
}
