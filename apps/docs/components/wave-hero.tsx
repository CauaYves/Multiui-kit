import { cn } from "cn";
import * as React from "react";

// Onda de fundo do hero: uma única curva em S, como a do yin-yang. A metade esquerda sobe
// e a direita desce na mesma medida: a curva é simétrica por rotação de 180° em torno do
// centro (720,200), então os pontos de controle de uma metade são os da outra girados.
// O preenchimento é um degradê do primary, mais forte no topo, e uma linha fina marca o
// contorno. Fica atrás do conteúdo, então a opacidade é baixa para o texto continuar
// legível nos dois temas. O preserveAspectRatio="none" estica a onda na largura da tela.
const CURVE = "M0,200 C200,110 520,110 720,200 C920,290 1240,290 1440,200";

export function WaveHero({ className, ...props }: React.ComponentProps<"svg">) {
  const gradientId = React.useId();

  return (
    <svg
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0 top-0 -z-10 h-full w-full", className)}
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopOpacity={0.14} className="[stop-color:var(--primary)]" />
          <stop offset="1" stopOpacity={0.03} className="[stop-color:var(--primary)]" />
        </linearGradient>
      </defs>
      <path d={`M0,0 L${CURVE.slice(1)} L1440,0 Z`} fill={`url(#${gradientId})`} />
      {/* non-scaling-stroke: a linha mantém 1px mesmo com a onda esticada. */}
      <path
        d={CURVE}
        fill="none"
        vectorEffect="non-scaling-stroke"
        className="stroke-primary/25"
        strokeWidth={1}
      />
    </svg>
  );
}
