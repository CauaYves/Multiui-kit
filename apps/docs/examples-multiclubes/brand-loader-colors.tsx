import { BrandLoader } from "@multiclubes/ui/components/brand-loader";

export default function BrandLoaderColors() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10">
      {/* Só as cores da marca: traço amarelo e pontos alternando azul e amarelo. */}
      <BrandLoader className="[--brand-loader-dot-1:var(--color-primary)] [--brand-loader-dot-2:var(--color-highlight)] [--brand-loader-dot-3:var(--color-primary)] [--brand-loader-dot-4:var(--color-highlight)]" />
      {/* Sobre o azul da marca. */}
      <div className="flex size-32 items-center justify-center rounded-surface bg-primary">
        <BrandLoader className="[--brand-loader-dot-1:white] [--brand-loader-dot-2:white] [--brand-loader-dot-3:white] [--brand-loader-dot-4:white]" />
      </div>
      {/* Tamanho menor, para botões e linhas de tabela. */}
      <BrandLoader className="size-8" />
    </div>
  );
}
