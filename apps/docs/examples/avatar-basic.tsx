"use client" // sync-shadcn

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@multiclubes/ui/components/avatar"

export default function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage
        src="/avatars/multiclubes.svg"
        alt="@multiclubes"
        className="grayscale"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
