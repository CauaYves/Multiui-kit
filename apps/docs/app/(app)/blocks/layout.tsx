import { Button } from "@multiclubes/ui/components/button";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import type * as React from "react";
import { BlocksNav } from "@/components/blocks-nav";

export const metadata: Metadata = {
  title: "Blocks",
  description: "Telas prontas, montadas com os componentes do Mosaico.",
};

export default function BlocksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-wrapper flex flex-1 flex-col px-6">
      {/* Mesma largura do container do shadcn (1400px), para não esticar em telas largas. */}
      <div className="mx-auto flex w-full max-w-350 flex-1 flex-col">
        <section className="flex flex-col items-center gap-3 py-16 text-center lg:py-20">
          <Link
            href="/docs/components/metric-card"
            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium transition-colors hover:bg-muted/70"
          >
            Novo: Metric Card
            <ArrowRightIcon className="size-3" />
          </Link>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance lg:text-5xl">
            Blocos para montar telas
          </h1>
          <p className="max-w-2xl text-base text-balance text-muted-foreground sm:text-lg">
            Telas prontas, montadas com os componentes do Mosaico. Veja a prévia, copie o código e
            adapte à sua aplicação.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <Button variant="secondary" nativeButton={false} render={<a href="#blocks" />}>
              Ver blocos
            </Button>
            <Button variant="ghost" nativeButton={false} render={<Link href="/docs/components" />}>
              Ver componentes
            </Button>
          </div>
        </section>
        <BlocksNav />
        <div className="flex flex-1 flex-col pb-16">{children}</div>
      </div>
    </div>
  );
}
