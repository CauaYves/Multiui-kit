"use client";

import { cn } from "cn";
import * as React from "react";

/*
 * Peças compartilhadas das demonstrações animadas da home: relógio, vaivém, cotas e Grow.
 * Usadas pela vitrine (presentation-showcase) e pelas demos de Anatomia, Comparação e Fundamentos.
 */

/** Etapa de um vaivém: 0, 1, …, n-1, n-2, …, 1, 0, 1, … */
export function pingPong(t: number, step: number, length: number) {
  const period = (length - 1) * 2;
  const i = Math.floor(Math.max(0, t) / step) % period;
  return i < length ? i : period - i;
}

/** `true` quando o usuário prefere movimento reduzido (falso no servidor). */
export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Relógio da demo: `tick` avança a cada `interval` ms (0 … length-1, em laço).
 * Pausa com hover/foco (use `bind` no contêiner) e, depois de `takeControl()`, por `resumeAfter` ms.
 * Com movimento reduzido nunca anda: `playing` é sempre falso.
 */
export function useTicker({
  interval,
  length,
  resumeAfter = 8000,
}: {
  interval: number;
  length: number;
  resumeAfter?: number;
}) {
  const reduced = useReducedMotion();
  const [tick, setTick] = React.useState(0);
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const [manual, setManual] = React.useState(0);

  const playing = !reduced && !hover && !focus && manual === 0;

  React.useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setTick((t) => (t + 1) % length), interval);
    return () => window.clearInterval(id);
  }, [playing, interval, length]);

  React.useEffect(() => {
    if (manual === 0) return;
    const id = window.setTimeout(() => setManual(0), resumeAfter);
    return () => window.clearTimeout(id);
  }, [manual, resumeAfter]);

  const bind = {
    onPointerEnter: () => setHover(true),
    onPointerLeave: () => setHover(false),
    onFocus: () => setFocus(true),
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocus(false);
    },
  };

  /** Chamar quando o usuário mexe num controle: pausa o auto-play por um tempo. */
  const takeControl = React.useCallback(() => setManual((m) => m + 1), []);

  return { tick, setTick, playing, reduced, bind, takeControl };
}

/** Linha de cota com a medida: horizontal em cima, vertical à esquerda. */
export function Dimension({ label, vertical }: { label: string; vertical?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute flex items-center justify-center text-primary",
        vertical
          ? "inset-y-0 -left-3 w-2 flex-col border-y border-current"
          : "inset-x-0 -top-3 h-2 border-x border-current",
      )}
    >
      <span className={cn("absolute bg-current", vertical ? "inset-y-0 w-px" : "inset-x-0 h-px")} />
      <span
        key={label}
        className={cn(
          "absolute animate-showcase-in font-mono text-[10px] leading-none whitespace-nowrap tabular-nums",
          vertical ? "right-full mr-1.5" : "bottom-full mb-1.5",
        )}
      >
        {label}
      </span>
    </span>
  );
}

/** Envolve o elemento com as cotas da medida usada; as linhas acompanham o tamanho dele. */
export function Measure({
  token,
  px,
  children,
  className,
}: {
  token: string;
  px: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative mt-7 ml-12 inline-flex shrink-0", className)}>
      {children}
      <Dimension label={token} />
      <Dimension label={`${px}px`} vertical />
    </div>
  );
}

/** Filho novo num grupo: abre espaço e aparece. */
export function Grow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid animate-grow-in">
      <div className="min-h-0">{children}</div>
    </div>
  );
}

const COTA_SIDE = {
  top: "-top-3 inset-x-0 h-2",
  bottom: "-bottom-3 inset-x-0 h-2",
  left: "-left-3 inset-y-0 w-2",
  right: "-right-3 inset-y-0 w-2",
} as const;

const COTA_LABEL = {
  top: "bottom-full mb-1",
  bottom: "top-full mt-1",
  left: "right-full mr-1",
  right: "left-full ml-1",
} as const;

/**
 * Colchete de cota que se desenha do centro para as pontas, com rótulo (número ou medida).
 * Posiciona-se no elemento medido (o pai precisa ser `relative`). Remonte com `key` para redesenhar.
 */
export function Cota({
  side,
  active = true,
  delay = 0,
  className,
  children,
}: {
  side: keyof typeof COTA_SIDE;
  active?: boolean;
  /** Atraso em ms para escalonar o desenho. */
  delay?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const horizontal = side === "top" || side === "bottom";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute flex items-center justify-center transition-colors duration-300",
        COTA_SIDE[side],
        active ? "text-primary" : "text-muted-foreground/60",
        className,
      )}
    >
      <span
        style={{ animationDelay: `${delay}ms` }}
        className={cn(
          "absolute inset-0 border-current",
          horizontal ? "animate-cota-x border-x" : "animate-cota-y border-y",
        )}
      >
        <span
          className={cn(
            "absolute bg-current",
            horizontal
              ? "inset-x-0 top-1/2 h-px -translate-y-1/2"
              : "inset-y-0 left-1/2 w-px -translate-x-1/2",
          )}
        />
      </span>
      {children ? (
        <span
          style={{ animationDelay: `${delay + 250}ms` }}
          className={cn(
            "absolute animate-showcase-in font-mono text-[10px] leading-none whitespace-nowrap tabular-nums",
            COTA_LABEL[side],
          )}
        >
          {children}
        </span>
      ) : null}
    </span>
  );
}
