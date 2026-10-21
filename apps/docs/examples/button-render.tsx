"use client" // sync-shadcn

import { buttonVariants } from "@multiclubes/ui/components/button"

export default function ButtonRender() {
  return (
    <a
      href="#"
      className={buttonVariants({ variant: "secondary", size: "sm" })}
    >
      Login
    </a>
  )
}
