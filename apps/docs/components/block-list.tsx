import type { Block } from "@/blocks";
import { BlockViewer } from "@/components/block-viewer";
import { ComponentSource } from "@/components/component-source";

/** Lista de blocos de uma categoria, cada um no visualizador com prévia e código. */
export function BlockList({ blocks }: { blocks: Block[] }) {
  if (blocks.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-surface border border-dashed p-8 text-center text-sm text-muted-foreground">
        Ainda não há blocos nesta categoria.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16">
      {blocks.map((block) => (
        <BlockViewer
          key={block.name}
          block={block}
          file={`blocks/${block.name}.tsx`}
          code={<ComponentSource demo={block.name} collapsible={false} />}
        />
      ))}
    </div>
  );
}
