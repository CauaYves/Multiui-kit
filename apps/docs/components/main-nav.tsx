"use client";

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
    <nav
      className={cn("items-center gap-0.5 rounded-full border bg-muted/60 p-1", className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.url}
          href={item.url}
          data-active={pathname === item.url}
          className="rounded-full px-3.5 py-1 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-xs"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
