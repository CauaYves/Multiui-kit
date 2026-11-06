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
 * `true` enquanto o elemento está na tela. Diferente do `useInView` (que marca a primeira
 * vez e para de observar), este volta a `false` quando o elemento sai, para a animação
 * rodar de novo a cada vez que ele aparece. Recebe o elemento por estado, para servir
 * também a refs de callback.
 */
export function useOnScreen(element: Element | null, threshold = 0.2) {
  const [onScreen, setOnScreen] = React.useState(false);
  React.useEffect(() => {
    if (!element || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(Boolean(entry?.isIntersecting)), {
      threshold,
    });
    io.observe(element);
    return () => io.disconnect();
  }, [element, threshold]);
  return onScreen;
}

/**
 * Relógio da demo: `tick` avança a cada `interval` ms (0 … length-1, em laço).
 * Pausa com hover/foco (use `bind` no contêiner) e, depois de `takeControl()`, por `resumeAfter` ms.
 * Fora da tela ele para, e ao voltar recomeça do início: quem rola até a demo sempre a vê
 * desde o primeiro passo. Com movimento reduzido nunca anda: `playing` é sempre falso.
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
  const [element, setElement] = React.useState<HTMLElement | null>(null);
  const onScreen = useOnScreen(element);

  // Ao entrar na tela, volta ao primeiro passo.
  React.useEffect(() => {
    if (onScreen) setTick(0);
  }, [onScreen]);

  const playing = !reduced && onScreen && !hover && !focus && manual === 0;

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
    ref: setElement,
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

/**
 * Linha de cota com a medida: horizontal em cima, vertical à esquerda. Como a `Cota`, ela se
 * desenha do centro para as pontas cada vez que aparece na tela.
 */
export function Dimension({ label, vertical }: { label: string; vertical?: boolean }) {
  const [element, setElement] = React.useState<HTMLSpanElement | null>(null);
  const onScreen = useOnScreen(element);

  return (
    <span
      ref={setElement}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute flex items-center justify-center text-primary",
        vertical ? "inset-y-0 -left-3 w-2 flex-col" : "inset-x-0 -top-3 h-2",
      )}
    >
      <span
        className={cn(
          "absolute inset-0 border-current",
          vertical ? "border-y" : "border-x",
          onScreen ? (vertical ? "animate-cota-y" : "animate-cota-x") : "opacity-0",
        )}
      >
        <span
          className={cn("absolute bg-current", vertical ? "inset-y-0 w-px" : "inset-x-0 h-px")}
        />
      </span>
      <span
        key={label}
        style={{ animationDelay: "250ms" }}
        className={cn(
          "absolute font-mono text-[10px] leading-none whitespace-nowrap tabular-nums",
          onScreen ? "animate-showcase-in" : "opacity-0",
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
 * Posiciona-se no elemento medido (o pai precisa ser `relative`). Remonte com `key` para
 * redesenhar. Só se desenha na tela, e de novo a cada vez que volta a aparecer.
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
  const [element, setElement] = React.useState<HTMLSpanElement | null>(null);
  const onScreen = useOnScreen(element);

  return (
    <span
      ref={setElement}
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
          horizontal ? "border-x" : "border-y",
          onScreen ? (horizontal ? "animate-cota-x" : "animate-cota-y") : "opacity-0",
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
            "absolute font-mono text-[10px] leading-none whitespace-nowrap tabular-nums",
            onScreen ? "animate-showcase-in" : "opacity-0",
            COTA_LABEL[side],
          )}
        >
          {children}
        </span>
      ) : null}
    </span>
  );
}
