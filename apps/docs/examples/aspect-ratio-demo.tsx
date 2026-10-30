"use client" // sync-shadcn

import Image from "next/image"

import { AspectRatio } from "@multiclubes/ui/components/aspect-ratio"

export default function AspectRatioDemo() {
  return (
    <AspectRatio ratio={16 / 9} className="w-full max-w-sm rounded-lg bg-muted">
      <Image
        src="https://avatar.vercel.sh/multiclubes1"
        alt="Photo"
        fill
        className="rounded-lg object-cover grayscale dark:brightness-20"
      />
    </AspectRatio>
  )
}
