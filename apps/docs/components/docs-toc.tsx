"use client";

import { cn } from "cn";
import * as React from "react";
import type { TocItem } from "@/lib/docs";

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "0% 0% -80% 0%" },
    );
    const elements = itemIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [itemIds]);

  return activeId;
}

export function DocsTableOfContents({ toc, className }: { toc: TocItem[]; className?: string }) {
  const itemIds = React.useMemo(() => toc.map((item) => item.url.slice(1)), [toc]);
  const activeHeading = useActiveItem(itemIds);

  if (!toc.length) return null;

  return (
    <div className={cn("flex flex-col gap-2 p-4 pt-0 text-sm", className)}>
      <p className="h-6 bg-background text-xs font-medium text-muted-foreground">Nesta página</p>
      {toc.map((item) => (
        <a
          key={item.url}
          href={item.url}
          className="text-[0.8rem] text-muted-foreground no-underline transition-colors hover:text-foreground data-[active=true]:font-medium data-[active=true]:text-foreground data-[depth=3]:pl-4 data-[depth=4]:pl-6"
          data-active={item.url === `#${activeHeading}`}
          data-depth={item.depth}
        >
          {item.title}
        </a>
      ))}
    </div>
  );
}
