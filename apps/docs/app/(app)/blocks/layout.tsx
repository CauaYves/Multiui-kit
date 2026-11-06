import type { Metadata } from "next";
import type * as React from "react";
import { BLOCKS } from "@/blocks";
import { BlocksNav } from "@/components/blocks-nav";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Blocks",
  description: "Telas prontas, montadas com os componentes do Mosaico.",
};

export default function BlocksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-wrapper flex flex-1 flex-col px-6">
      {/* Mesma largura do container do shadcn (1400px), para não esticar em telas largas. */}
      <div className="mx-auto flex w-full max-w-350 flex-1 flex-col">
        <PageHeader
          eyebrow="Blocos"
          title="Blocos"
          count={BLOCKS.length}
          description="Telas prontas, montadas com os componentes do Mosaico. Veja a prévia, copie o código e adapte à sua aplicação."
          className="py-10"
        />
        <BlocksNav />
        <div className="flex flex-1 flex-col pb-16">{children}</div>
      </div>
    </div>
  );
}
