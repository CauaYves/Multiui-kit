"use client" // sync-shadcn

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@multiclubes/ui/components/avatar"

export function AvatarWithBadge() {
  return (
    <Avatar>
      <AvatarImage src="/avatars/multiclubes.svg" alt="@multiclubes" />
      <AvatarFallback>CN</AvatarFallback>
      <AvatarBadge className="bg-green-600 dark:bg-green-800" />
    </Avatar>
  )
}
