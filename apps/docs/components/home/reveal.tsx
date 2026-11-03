"use client";

import { cn } from "cn";
import type * as React from "react";
import { useInView } from "./use-in-view";

/** Entrada fluida (mola leve, de menor e desfocado para nítido) ao aparecer na tela. Sem animação se o usuário prefere. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Atraso em ms, para escalonar itens irmãos. */
  delay?: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      className={cn(inView ? "animate-fluid-in" : "opacity-0", className)}
    >
      {children}
    </div>
  );
}
