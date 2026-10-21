"use client" // sync-shadcn

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@multiclubes/ui/components/alert"
import { Button } from "@multiclubes/ui/components/button"

export default function AlertActionExample() {
  return (
    <Alert className="max-w-md">
      <AlertTitle>Dark mode is now available</AlertTitle>
      <AlertDescription>
        Enable it under your profile settings to get started.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="default">
          Enable
        </Button>
      </AlertAction>
    </Alert>
  )
}
