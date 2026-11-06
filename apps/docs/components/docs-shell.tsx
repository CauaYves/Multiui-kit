"use client";

import { SidebarProvider } from "@multiclubes/ui/components/sidebar";
import { usePathname } from "next/navigation";
import type * as React from "react";

/** Rotas de galeria: têm a própria sidebar de categorias, então a do docs some. */
const GALLERY_PATHS = new Set(["/docs/components", "/docs/marca"]);

export function DocsShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const gallery = GALLERY_PATHS.has(usePathname().replace(/\/$/, ""));

  return (
    <SidebarProvider
      className={
        gallery
          ? "min-h-min flex-1 items-start px-0 [--top-spacing:0]"
          : "min-h-min flex-1 items-start px-0 [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--top-spacing:calc(var(--spacing)*4)]"
      }
      style={{ "--sidebar-width": "calc(var(--spacing) * 72)" } as React.CSSProperties}
    >
      {!gallery && sidebar}
      <div className="h-full w-full min-w-0">{children}</div>
    </SidebarProvider>
  );
}
