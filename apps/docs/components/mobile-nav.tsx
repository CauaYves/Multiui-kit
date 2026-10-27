"use client";

import { Button } from "@multiclubes/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@multiclubes/ui/components/popover";
import { cn } from "cn";
import Link from "next/link";
import * as React from "react";
import type { NavItem } from "@/lib/docs";

export function MobileNav({
  sections,
  components,
  className,
}: {
  sections: NavItem[];
  components: NavItem[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  const link = (item: NavItem) => (
    <Link
      key={item.url}
      href={item.url}
      onClick={() => setOpen(false)}
      className="text-2xl font-medium"
    >
      {item.title}
    </Link>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            className={cn(
              "extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 p-0! hover:bg-transparent",
              className,
            )}
          />
        }
      >
        <div className="relative flex h-8 w-4 items-center justify-center">
          <span
            className={cn(
              "absolute block h-0.5 w-4 bg-foreground transition-all duration-100",
              open ? "top-[0.4rem] -rotate-45" : "top-1",
            )}
          />
          <span
            className={cn(
              "absolute block h-0.5 w-4 bg-foreground transition-all duration-100",
              open ? "top-[0.4rem] rotate-45" : "top-2.5",
            )}
          />
        </div>
        <span className="flex h-8 items-center text-lg leading-none font-medium">Menu</span>
      </PopoverTrigger>
      <PopoverContent
        className="no-scrollbar h-(--available-height) w-(--available-width) overflow-y-auto rounded-none border-none bg-background/90 p-0 shadow-none backdrop-blur"
        align="start"
        side="bottom"
        sideOffset={14}
      >
        <div className="flex flex-col gap-12 overflow-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium text-muted-foreground">Menu</div>
            <div className="flex flex-col gap-3">
              <Link href="/" onClick={() => setOpen(false)} className="text-2xl font-medium">
                Início
              </Link>
              {sections.map(link)}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-sm font-medium text-muted-foreground">Componentes</div>
            <div className="flex flex-col gap-3">{components.map(link)}</div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
