import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

// Superfície com uma palavra gigante e apagada ao fundo ("CLIENTES" atrás da vitrine de
// logos). O componente é só a superfície: a palavra fica atrás, recortada pelas bordas, e o
// que vier em `children` fica por cima. A palavra é decorativa (fora da árvore de
// acessibilidade e sem clique). A cor padrão da palavra é o foreground a 6%; sobre um fundo
// colorido, troque com `textClassName` (`text-primary/10`). O tamanho da palavra segue a
// largura do próprio bloco (cqi), então ela ocupa a mesma proporção em qualquer largura.
const backdropTextVariants = cva(
  "pointer-events-none absolute -z-10 font-heading text-[clamp(2.5rem,20cqi,16rem)] leading-[0.8] font-black tracking-tighter whitespace-nowrap text-foreground/6 uppercase select-none",
  {
    variants: {
      position: {
        "top-end": "-top-[0.08em] -right-[0.06em]",
        "top-start": "-top-[0.08em] -left-[0.06em]",
        "bottom-end": "-right-[0.06em] -bottom-[0.12em]",
        "bottom-start": "-bottom-[0.12em] -left-[0.06em]",
        center: "top-1/2 left-1/2 -translate-1/2",
      },
    },
    defaultVariants: { position: "top-end" },
  },
);

function BackdropText({
  text,
  position,
  textClassName,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof backdropTextVariants> & {
    /** A palavra do fundo. Prefira uma palavra curta: o tamanho acompanha a largura do bloco. */
    text: string;
    /** Classes da palavra, para trocar cor ou tamanho. */
    textClassName?: string;
  }) {
  return (
    <div
      data-slot="backdrop-text"
      className={cn("@container/backdrop-text relative isolate overflow-hidden", className)}
      {...props}
    >
      <span aria-hidden className={cn(backdropTextVariants({ position }), textClassName)}>
        {text}
      </span>
      {children}
    </div>
  );
}

export { BackdropText, backdropTextVariants };
