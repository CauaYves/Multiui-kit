import type * as React from "react";
import { DocsShell } from "@/components/docs-shell";
import { DocsSidebar } from "@/components/docs-sidebar";
import { getComponentNav, SECTIONS } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const { brand, components } = getComponentNav();

  return (
    <div className="container-wrapper flex flex-1 flex-col px-2">
      <DocsShell
        sidebar={<DocsSidebar sections={SECTIONS} brand={brand} components={components} />}
      >
        {children}
      </DocsShell>
    </div>
  );
}
