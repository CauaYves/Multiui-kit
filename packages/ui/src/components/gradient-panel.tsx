import { cn } from "cn";
import type * as React from "react";

// Painel de seção com fundo em degradê suave: um brilho do highlight (amarelo da marca) no
// canto superior esquerdo que se desfaz no card, com um toque frio do primary no canto oposto.
// É só a superfície, um <section>: o conteúdo e o layout interno ficam com quem usa. O brilho vem de
// --gradient-panel-glow e o toque frio de --gradient-panel-tint, trocáveis por className.
function GradientPanel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="gradient-panel"
      className={cn(
        "relative isolate overflow-hidden rounded-surface bg-card p-6 text-card-foreground shadow-sm ring-1 ring-foreground/5 md:p-10 dark:ring-foreground/10",
        "[--gradient-panel-glow:color-mix(in_oklab,var(--color-highlight)_28%,transparent)] [--gradient-panel-tint:color-mix(in_oklab,var(--color-primary)_6%,transparent)] dark:[--gradient-panel-glow:color-mix(in_oklab,var(--color-highlight)_10%,transparent)] dark:[--gradient-panel-tint:color-mix(in_oklab,var(--color-primary)_14%,transparent)]",
        "bg-[radial-gradient(ellipse_70%_90%_at_0%_0%,var(--gradient-panel-glow),transparent_70%),radial-gradient(ellipse_60%_80%_at_100%_100%,var(--gradient-panel-tint),transparent_70%)]",
        className,
      )}
      {...props}
    />
  );
}

export { GradientPanel };
