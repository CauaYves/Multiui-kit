"use client" // sync-shadcn

import { Slider } from "@multiclubes/ui/components/slider"

export function SliderRange() {
  return (
    <Slider
      defaultValue={[25, 50]}
      max={100}
      step={5}
      className="mx-auto w-full max-w-xs"
    />
  )
}
