"use client" // sync-shadcn

import { AlertCircleIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@multiclubes/ui/components/alert"

export default function AlertDestructive() {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        Your payment could not be processed. Please check your payment method
        and try again.
      </AlertDescription>
    </Alert>
  )
}
