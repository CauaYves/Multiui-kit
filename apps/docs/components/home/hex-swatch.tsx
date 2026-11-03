"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@multiclubes/ui/components/tooltip";
import * as React from "react";

let ctx: CanvasRenderingContext2D | null | undefined;

/** Qualquer cor CSS (rgb, oklch, oklab, color()) → "#RRGGBB", via pixel de um canvas 1×1. */
export function cssToHex(color: string): string {
  if (ctx === undefined) {
    ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  }
  if (!ctx || !color) return "";
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "#000";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0, a = 255] = ctx.getImageData(0, 0, 1, 1).data;
  const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
  return a === 255 ? hex : `${hex} · ${Math.round((a / 255) * 100)}%`;
}

type HexSwatchProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** Nome mostrado em texto discreto, ex.: "--primary". */
  name: string;
  /** Cor CSS explícita (ex.: valor do tema escuro). Sem ela, lê o backgroundColor computado. */
  color?: string;
  children?: React.ReactNode;
};

/**
 * Amostra de cor focável com Tooltip "#HEX · nome". O HEX é lido na hora em que o tooltip
 * abre (e enquanto está aberto, se o tema mudar), então sempre reflete o tema atual.
 * Clicar (ou Enter/Espaço) copia o HEX; o tooltip mostra "Copiado" por um instante.
 */
export function HexSwatch({ name, color, children, onClick, ...props }: HexSwatchProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [hex, setHex] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    const el = ref.current;
    const value = cssToHex(color ?? (el ? getComputedStyle(el).backgroundColor : ""));
    // Só o "#RRGGBB"; a opacidade, quando há, fica de fora da cópia.
    navigator.clipboard?.writeText(value.split(" ")[0] ?? value);
    setOpen(true);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const read = React.useCallback(() => {
    const el = ref.current;
    setHex(cssToHex(color ?? (el ? getComputedStyle(el).backgroundColor : "")));
  }, [color]);

  React.useEffect(() => {
    if (!open) return;
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, [open, read]);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger
        render={
          // biome-ignore lint/a11y/useSemanticElements: span mantém o layout das amostras (blocos, faixas, metades); o teclado é tratado no onKeyDown
          <span
            ref={ref}
            tabIndex={0}
            role="button"
            aria-label={`Copiar ${hex || name} (${name})`}
            {...props}
            className={`cursor-copy ${props.className ?? ""}`}
            onClick={(event) => {
              copy();
              onClick?.(event);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                copy();
              }
            }}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>
        {copied ? (
          <span>Copiado</span>
        ) : (
          <>
            <span className="font-mono uppercase">{hex || "—"}</span>
            <span className="text-background/60">· {name}</span>
          </>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
