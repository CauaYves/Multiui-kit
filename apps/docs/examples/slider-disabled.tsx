"use client" // sync-shadcn

import { Slider } from "@multiclubes/ui/components/slider"

export function SliderDisabled() {
  return (
    <Slider
      defaultValue={[50]}
      max={100}
      step={1}
      disabled
      className="mx-auto w-full max-w-xs"
    />
  )
}
