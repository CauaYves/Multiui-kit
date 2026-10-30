"use client" // sync-shadcn

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@multiclubes/ui/components/avatar"

export function AvatarSizeExample() {
  return (
    <div className="flex flex-wrap items-center gap-2 grayscale">
      <Avatar size="sm">
        <AvatarImage src="/avatars/multiclubes.svg" alt="@multiclubes" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/avatars/multiclubes.svg" alt="@multiclubes" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="/avatars/multiclubes.svg" alt="@multiclubes" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  )
}
