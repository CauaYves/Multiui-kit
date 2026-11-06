"use client";

import { cn } from "cn";
import * as React from "react";
import { urbanist } from "./urbanist";

const TEXT = "Aa";
const WEIGHT = 500;

type Metrics = { baseline: number; cap: number; xHeight: number };

const LINE_STYLE = {
  transitionDuration: "var(--duration-fluid)",
  transitionTimingFunction: "var(--ease-fluid)",
} as const;

/** Especímen Urbanist com as linhas de construção medidas na fonte real, em tempo de execução. */
export function TypeSpecimen({ active }: { active: boolean }) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const baselineRef = React.useRef<HTMLSpanElement>(null);
  const [width, setWidth] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const [m, setM] = React.useState<Metrics | null>(null);

  const narrow = width < 420;
  const gutter = narrow ? 44 : 118;
  const fs = Math.max(0, Math.min((width - gutter * 2) / 1.45, 230));

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry?.contentRect.width ?? 0));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) setReady(true);
    };
    document.fonts
      .load(`${WEIGHT} 64px ${urbanist.style.fontFamily}`, TEXT)
      .then(() => document.fonts.ready)
      .then(done, done);
    return () => {
      cancelled = true;
    };
  }, []);

  React.useLayoutEffect(() => {
    const stage = stageRef.current;
    const base = baselineRef.current;
    if (!stage || !base || !ready || fs <= 0) return;
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return;
    ctx.font = `${WEIGHT} ${fs}px ${urbanist.style.fontFamily}`;
    const asc = (t: string) => ctx.measureText(t).actualBoundingBoxAscent;
    // O painel inativo tem scale-95: divide pela escala para medir no espaço local.
    const sr = stage.getBoundingClientRect();
    const scale = stage.offsetHeight > 0 ? sr.height / stage.offsetHeight : 1;
    const baseline = (base.getBoundingClientRect().bottom - sr.top) / scale;
    setM({ baseline, cap: baseline - asc("H"), xHeight: baseline - asc("x") });
  }, [fs, ready]);

  const show = active && m !== null;
  const lines = m
    ? [
        { key: "cap", y: m.cap, label: "altura da maiúscula", short: "maiús." },
        { key: "x", y: m.xHeight, label: "altura do x", short: "x" },
        { key: "base", y: m.baseline, label: "linha de base", short: "base" },
      ]
    : [];

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        ref={stageRef}
        className="relative w-full overflow-hidden"
        style={{ height: fs * 1.3 || undefined, minHeight: fs ? undefined : 120 }}
      >
        {m && (
          <>
            <div
              aria-hidden
              className={cn(
                "absolute inset-x-0 bg-primary/5 transition-opacity motion-reduce:transition-none",
                show ? "opacity-100" : "opacity-0",
              )}
              style={{ ...LINE_STYLE, top: m.xHeight, height: m.baseline - m.xHeight }}
            />
            {lines.map((l, i) => (
              <div key={l.key} aria-hidden>
                <span
                  className={cn(
                    "absolute inset-x-0 h-px origin-left bg-foreground/15 transition-transform motion-reduce:transition-none",
                    show ? "scale-x-100" : "scale-x-0",
                  )}
                  style={{
                    ...LINE_STYLE,
                    top: l.y,
                    transitionDelay: show ? `${i * 110}ms` : "0ms",
                  }}
                />
                <span
                  className={cn(
                    "absolute left-0 font-mono text-[9px] leading-none whitespace-nowrap text-muted-foreground transition-opacity duration-500 motion-reduce:transition-none",
                    show ? "opacity-100" : "opacity-0",
                  )}
                  style={{ top: l.y - 12, transitionDelay: show ? `${450 + i * 110}ms` : "0ms" }}
                >
                  {narrow ? l.short : l.label}
                </span>
              </div>
            ))}
          </>
        )}
        <div
          className="absolute inset-y-0 flex items-center justify-center"
          style={{ left: gutter, right: gutter }}
        >
          <span
            className={cn(urbanist.className, "leading-none text-foreground")}
            style={{ fontSize: fs, fontWeight: WEIGHT }}
          >
            {TEXT}
            <span ref={baselineRef} className="inline-block size-0 align-baseline" />
          </span>
        </div>
      </div>
      <span className="font-mono text-[10px] text-muted-foreground">Urbanist</span>
    </div>
  );
}
