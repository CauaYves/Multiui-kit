import { cn } from "cn";
import type * as React from "react";

// Carregamento da marca: o "m" da Multiclubes se desenha num traço só e quatro pontos quicam
// em volta, um depois do outro. As animações estão no styles.css do kit (brand-loader-*).
// O traço usa --brand-loader-stroke (padrão: highlight) e os pontos --brand-loader-dot-1 a
// -4, trocáveis por className.

/** Caminho do "m" em traço único, na caixa de 100×100. */
const M_PATH = "M 22 65 C 22 25, 45 25, 55 55 C 65 85, 35 85, 45 55 C 55 25, 78 25, 78 65";

const DOTS = [
  { cx: 20, cy: 25 },
  { cx: 40, cy: 85 },
  { cx: 60, cy: 25 },
  { cx: 80, cy: 85 },
];

function BrandLoader({
  loop = false,
  label = "Carregando",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /**
   * false (padrão): o "m" se desenha uma vez e fica; só os pontos continuam. true: o "m" se
   * desenha, segura e apaga em laço, para esperas longas.
   */
  loop?: boolean;
  /** Texto para leitores de tela. */
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-label={label}
      data-slot="brand-loader"
      className={cn(
        "inline-flex size-20 [--brand-loader-dot-1:#3b82f6] [--brand-loader-dot-2:#ef4444] [--brand-loader-dot-3:#f59e0b] [--brand-loader-dot-4:#22c55e] [--brand-loader-stroke:var(--color-highlight)]",
        className,
      )}
      {...props}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" className="size-full overflow-visible">
        <path
          d={M_PATH}
          fill="none"
          pathLength={1}
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1"
          className={cn(
            "stroke-(--brand-loader-stroke) motion-reduce:animate-none",
            loop
              ? "animate-[brand-loader-draw-loop_4s_ease-in-out_infinite]"
              : "animate-[brand-loader-draw_2.5s_ease-in-out_0.5s_both]",
          )}
        />
        {DOTS.map((dot, index) => (
          <circle
            key={dot.cx}
            cx={dot.cx}
            cy={dot.cy}
            r="4"
            className="animate-[brand-loader-dot_2s_ease-in-out_infinite] [transform-box:fill-box] [transform-origin:center] motion-reduce:animate-none"
            style={{
              fill: `var(--brand-loader-dot-${index + 1})`,
              animationDelay: `${index * 0.25}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export { BrandLoader };
