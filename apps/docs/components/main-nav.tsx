"use client";

import { Button } from "@multiclubes/ui/components/button";
import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/docs";

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className={cn("items-center gap-0", className)} {...props}>
      {items.map((item) => (
        <Button
          key={item.url}
          variant="ghost"
          size="sm"
          className="px-2.5 data-[active=true]:text-foreground"
          nativeButton={false}
          render={<Link href={item.url} data-active={pathname === item.url} />}
        >
          {item.title}
        </Button>
      ))}
    </nav>
  );
}
