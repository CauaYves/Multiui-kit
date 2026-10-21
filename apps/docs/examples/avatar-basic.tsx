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
        src="https://github.com/shadcn.png"
        alt="@shadcn"
        className="grayscale"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
