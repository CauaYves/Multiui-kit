import { cn } from "cn";
import type * as React from "react";

// Curva original da wave (viewBox 0 0 1440 200).
const CURVE = "M0,155 C240,122 480,122 720,145 C960,168 1200,168 1440,132";
// Caixa da wave logo abaixo do header. O header mede a posição dela (data-slot="wave-hero")
// para saber quando o hero ficou para trás.
const POSITION =
  "left-0 w-full top-(--header-height) h-[var(--wave-height,30.25rem)] overflow-visible";

// Área acima da curva como máscara CSS. Ao contrário de um <clipPath> dentro de um SVG
// esticado (preserveAspectRatio="none"), a máscara estica só o recorte e a imagem por baixo
// mantém a proporção (object-cover), sem distorcer.
const WAVE_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 200' preserveAspectRatio='none'><path d='M0,0 L${CURVE.slice(1)} L1440,0 Z'/></svg>`,
)}")`;

/**
 * Fundo do hero: a imagem da marca (tubos 3D, PNG com fundo transparente) recortada pela
 * curva da wave. O recorte cobre também a faixa do header, que fica transparente sobre ele.
 * Atrás da imagem há um brilho da marca: azul no claro, amarelo no escuro.
 * A imagem ocupa sempre 100% da largura, sem cortar as laterais. O centro da faixa dos tubos
 * (~68% da altura da imagem) fica no meio da área visível acima da curva; a altura da onda
 * acompanha a largura da tela (page.tsx), então a palavra cabe inteira em qualquer tamanho.
 */
export function WaveHero({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <div
        aria-hidden
        data-slot="wave-hero"
        className={cn("pointer-events-none absolute", POSITION)}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 -z-10 isolate h-[calc(var(--header-height)+var(--wave-height,30.25rem))] overflow-hidden bg-background",
          // Brilho de fundo: azul da marca no claro, amarelo da marca no escuro.
          "bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,color-mix(in_oklab,#0540c5_22%,transparent),transparent_75%),radial-gradient(ellipse_60%_60%_at_85%_100%,color-mix(in_oklab,#0540c5_12%,transparent),transparent_70%)]",
          "dark:bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,color-mix(in_oklab,#fee502_16%,transparent),transparent_75%),radial-gradient(ellipse_60%_60%_at_85%_100%,color-mix(in_oklab,#fee502_8%,transparent),transparent_70%)]",
          className,
        )}
        style={{
          maskImage: `linear-gradient(#000, #000), ${WAVE_MASK}`,
          maskSize: "100% var(--header-height), 100% var(--wave-height, 30.25rem)",
          maskPosition: "0 0, 0 var(--header-height)",
          maskRepeat: "no-repeat",
          WebkitMaskImage: `linear-gradient(#000, #000), ${WAVE_MASK}`,
          WebkitMaskSize: "100% var(--header-height), 100% var(--wave-height, 30.25rem)",
          WebkitMaskPosition: "0 0, 0 var(--header-height)",
          WebkitMaskRepeat: "no-repeat",
        }}
        {...props}
      >
        {/*:

          --hero-zoom  Tamanho da imagem em relação à largura da tela.
                       1 = 100% da largura. 1.2 = 20% maior (corta as laterais por igual).
                       0.8 = 80% da largura, centralizada.

          --hero-y     Onde fica a BASE da imagem, em fração da altura da onda (medida a partir
                       do header). 0.84 = base no ponto mais baixo da curva, então o corte reto
                       da arte some sob a onda. Menor sobe a imagem (ex.: 0.7); maior desce
                       (ex.: 0.95). Abaixo de ~0.7 o corte reto pode aparecer nas laterais.
        */}
        {/* Uma imagem por tema: no claro os tubos sólidos (o neon some sobre o branco);
            no escuro o neon com brilho. Cada uma tem o seu --hero-y. */}
        {(
          [
            {
              src: "/hero-tubo.webp",
              srcSet: "/hero-tubo.webp 1600w, /hero-tubo-2x.webp 2900w",
              y: 1.02,
              className: "dark:hidden",
            },
            {
              src: "/hero-tubo.webp",
              srcSet: "/hero-tubo.webp 1600w, /hero-tubo-2x.webp 2900w",
              y: 1.02,
              className: "hidden dark:block",
            },
          ] as const
        ).map((imagem) => (
          // biome-ignore lint/performance/noImgElement: imagem decorativa estática de fundo
          <img
            key={imagem.src}
            src={imagem.src}
            srcSet={imagem.srcSet}
            sizes="90vw"
            alt=""
            style={{ "--hero-zoom": 1, "--hero-y": imagem.y } as React.CSSProperties}
            className={`absolute top-[calc(var(--header-height)+var(--wave-height,30.25rem)*var(--hero-y))] left-1/2 h-auto w-[calc(100%*var(--hero-zoom))] max-w-none -translate-x-1/2 -translate-y-full select-none ${imagem.className}`}
          />
        ))}
      </div>
    </>
  );
}
