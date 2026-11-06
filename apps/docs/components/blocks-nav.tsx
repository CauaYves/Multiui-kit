"use client";

import { Button } from "@multiclubes/ui/components/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BLOCK_CATEGORIES } from "@/blocks";

/** Categorias de /blocks, como no shadcn: Featured é a raiz e as outras viram /blocks/<slug>. */
export function BlocksNav() {
  const pathname = usePathname();

  return (
    <div id="blocks" className="flex scroll-mt-24 items-center gap-4 pb-8">
      <nav aria-label="Categorias" className="no-scrollbar flex items-center gap-1 overflow-x-auto">
        {BLOCK_CATEGORIES.map((category) => {
          const href = category.slug === "featured" ? "/blocks" : `/blocks/${category.slug}`;
          return (
            <Link
              key={category.slug}
              href={href}
              data-active={pathname === href}
              className="shrink-0 px-2.5 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-foreground"
            >
              {category.title}
            </Link>
          );
        })}
      </nav>
      <Button
        variant="secondary"
        size="sm"
        className="ml-auto hidden shrink-0 sm:inline-flex"
        nativeButton={false}
        render={<Link href="/blocks/sidebar" />}
      >
        Ver todos os blocos
      </Button>
    </div>
  );
}
