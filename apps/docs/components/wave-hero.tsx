import { cn } from "cn";
import * as React from "react";

// Onda de fundo do hero: uma única curva em S, como a do yin-yang. A metade esquerda sobe
// e a direita desce na mesma medida: a curva é simétrica por rotação de 180° em torno do
// centro (720,200), então os pontos de controle de uma metade são os da outra girados.
// Não tem contorno: a curva aparece só pela mudança de cor. Fica atrás do conteúdo, então
// a opacidade é baixa para o texto continuar legível nos dois temas. O
// preserveAspectRatio="none" estica a onda na largura da tela.
const CURVE = "M0,200 C200,125 520,125 720,200 C920,275 1240,275 1440,200";

// O centro da curva fica sobre o símbolo da logo (o "m"), não no meio da palavra. O
// símbolo está 77px à esquerda do centro com a logo em h-8 e 96px com h-10, então a onda
// é alargada pelo dobro disso para a esquerda (--wave-shift). A altura põe o centro da
// curva na altura do símbolo, contando com o pt-56 do hero (app/(app)/page.tsx). O hero
// sobe por baixo do header, então a onda começa logo abaixo dele (top) e o preenchimento
// passa do topo do SVG (overflow-visible) para cobrir também a área do header.
const POSITION =
  "top-(--header-height) h-121 overflow-visible w-[calc(100%+var(--wave-shift))] left-[calc(var(--wave-shift)*-1)] [--wave-shift:9.625rem] sm:h-123 sm:[--wave-shift:12rem]";

export function WaveHero({ className, ...props }: React.ComponentProps<"svg">) {
  const id = React.useId();
  const ids = {
    color: `${id}-color`,
    glow: `${id}-glow`,
    fade: `${id}-fade`,
    mask: `${id}-mask`,
  };

  return (
    <svg
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
      aria-hidden
      data-slot="wave-hero"
      className={cn("pointer-events-none absolute -z-10", POSITION, className)}
      {...props}
    >
      {/* As duas cores da marca seguem o S: o azul (primary) domina a crista à esquerda e
          o amarelo (highlight) brilha no vale à direita. São duas camadas, não um degradê
          entre as cores, porque a mistura de azul e amarelo vira cinza. Uma máscara
          vertical apaga a cor perto da curva, para o conteúdo continuar legível. */}
      <defs>
        <linearGradient
          id={ids.color}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="1440"
          y2="0"
        >
          <stop offset="0" stopOpacity={0.34} className="[stop-color:var(--primary)]" />
          <stop offset="0.5" stopOpacity={0.14} className="[stop-color:var(--primary)]" />
          <stop offset="0.85" stopOpacity={0} className="[stop-color:var(--primary)]" />
        </linearGradient>
        <radialGradient id={ids.glow} gradientUnits="userSpaceOnUse" cx="1180" cy="120" r="560">
          <stop offset="0" stopOpacity={0.55} className="[stop-color:var(--highlight)]" />
          <stop offset="1" stopOpacity={0} className="[stop-color:var(--highlight)]" />
        </radialGradient>
        <linearGradient
          id={ids.fade}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="-200"
          x2="0"
          y2="275"
        >
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity={0.35} />
        </linearGradient>
        <mask id={ids.mask} maskUnits="userSpaceOnUse" x="0" y="-200" width="1440" height="600">
          <rect x="0" y="-200" width="1440" height="600" fill={`url(#${ids.fade})`} />
        </mask>
      </defs>
      <path
        d={`M0,-200 L${CURVE.slice(1)} L1440,-200 Z`}
        fill={`url(#${ids.color})`}
        mask={`url(#${ids.mask})`}
      />
      <path
        d={`M0,-200 L${CURVE.slice(1)} L1440,-200 Z`}
        fill={`url(#${ids.glow})`}
        mask={`url(#${ids.mask})`}
      />
    </svg>
  );
}
