"use client";

import { Badge } from "@multiclubes/ui/components/badge";
import { Button } from "@multiclubes/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@multiclubes/ui/components/card";
import { Field, FieldLabel } from "@multiclubes/ui/components/field";
import { Input } from "@multiclubes/ui/components/input";
import { Progress } from "@multiclubes/ui/components/progress";
import { Slider } from "@multiclubes/ui/components/slider";
import { Switch } from "@multiclubes/ui/components/switch";
import { ToggleGroup, ToggleGroupItem } from "@multiclubes/ui/components/toggle-group";
import { TooltipProvider } from "@multiclubes/ui/components/tooltip";
import { cn } from "cn";
import Link from "next/link";
import * as React from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { BRAND_COLORS } from "../logo";
import { HexSwatch } from "./hex-swatch";
import { HomeSection } from "./home-section";
import { PresentationShowcase } from "./presentation-showcase";
import { Reveal } from "./reveal";
import { Cota, pingPong, useTicker } from "./showcase-kit";

type Tab = "cores" | "forma" | "sombras" | "tipografia" | "numeros" | "espacamento" | "movimento";

const TABS: { value: Tab; label: string }[] = [
  { value: "cores", label: "Cores" },
  { value: "forma", label: "Arredondamento" },
  { value: "sombras", label: "Sombras" },
  { value: "tipografia", label: "Tipografia" },
  { value: "numeros", label: "Números" },
  { value: "espacamento", label: "Espaçamento" },
  { value: "movimento", label: "Movimento" },
];

type Line = [token: string, value: string, use: string];

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="max-w-prose text-sm text-muted-foreground">{children}</p>;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">{children}</p>
  );
}

/** Tabela hairline: token · valor · onde se usa. Empilha no mobile. */
function DataTable({
  rows,
  head = ["Token", "Valor", "Aplicação no Sistema"],
}: {
  rows: Line[];
  head?: string[];
}) {
  return (
    <div className="border-b border-border">
      <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.6fr)] gap-4 py-2 font-mono text-xs text-muted-foreground uppercase sm:grid">
        {head.map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      <ul>
        {rows.map(([token, value, use]) => (
          <li
            key={token}
            className="grid gap-x-4 gap-y-0.5 border-t border-border py-3 text-sm sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.6fr)]"
          >
            <span className="font-mono break-words">{token}</span>
            <span className="font-mono text-muted-foreground tabular-nums">{value}</span>
            <span className="text-muted-foreground">{use}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Panel({
  demo,
  table,
  bind,
}: {
  demo: React.ReactNode;
  table: React.ReactNode;
  /** Props de hover/foco do relógio: pausam o auto-play da demo. */
  bind?: React.HTMLAttributes<HTMLElement>;
}) {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-16">
      <div {...bind} className="flex min-w-0 flex-col gap-6">
        {demo}
      </div>
      <div className="min-w-0">{table}</div>
    </div>
  );
}

/* 0. Cores --- */

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex([r, g, b]: number[]) {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

/** sRGB → OKLab → OKLCH (Björn Ottosson). */
function hexToOklch(hex: string) {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = hexToRgb(hex).map(lin) as [number, number, number];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  const H = C < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  const f = (n: number) => String(Math.round(n * 1000) / 1000);
  return `oklch(${f(L)} ${f(C)} ${f(H)})`;
}

/** Valor que copia ao clicar, com “Copiado” inline. */
function CopyValue({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1500 });
  return (
    <button
      type="button"
      onClick={() => copyToClipboard(value)}
      title="Copiar"
      className={cn(
        "cursor-pointer text-left font-mono break-words tabular-nums underline-offset-4 outline-none hover:underline focus-visible:underline",
        className,
      )}
    >
      {isCopied ? <span className="text-primary">Copiado</span> : (children ?? value)}
    </button>
  );
}

const BRAND = [
  {
    name: "Amarelo",
    hex: BRAND_COLORS.yellow,
    fg: "#000000",
    note: "Destaque e acento. No tema escuro, é a cor dos gráficos.",
  },
  {
    name: "Azul",
    hex: BRAND_COLORS.blue,
    fg: "#ffffff",
    note: "Cor principal da marca. No tema claro, é a cor dos gráficos.",
  },
];

type TokenRow = { token: string; cls: string; light: string; dark: string };
const TOKENS: TokenRow[] = [
  { token: "--background", cls: "bg-background", light: "oklch(1 0 0)", dark: "oklch(0.145 0 0)" },
  {
    token: "--foreground",
    cls: "text-foreground",
    light: "oklch(0.145 0 0)",
    dark: "oklch(0.985 0 0)",
  },
  {
    token: "--primary",
    cls: "bg-primary",
    light: "oklch(0.44 0.213 263)",
    dark: "oklch(0.62 0.2 263)",
  },
  {
    token: "--primary-foreground",
    cls: "text-primary-foreground",
    light: "oklch(0.985 0 0)",
    dark: "oklch(0.985 0 0)",
  },
  {
    token: "--highlight",
    cls: "bg-highlight",
    light: "oklch(0.914 0.191 101.4)",
    dark: "oklch(0.914 0.191 101.4)",
  },
  { token: "--secondary", cls: "bg-secondary", light: "oklch(0.97 0 0)", dark: "oklch(0.269 0 0)" },
  { token: "--muted", cls: "bg-muted", light: "oklch(0.97 0 0)", dark: "oklch(0.269 0 0)" },
  { token: "--accent", cls: "bg-accent", light: "oklch(0.97 0 0)", dark: "oklch(0.269 0 0)" },
  {
    token: "--border",
    cls: "border-border",
    light: "oklch(0.922 0 0)",
    dark: "oklch(1 0 0 / 10%)",
  },
  { token: "--ring", cls: "ring-ring", light: "oklch(0.55 0.19 263)", dark: "oklch(0.62 0.2 263)" },
  {
    token: "--destructive",
    cls: "bg-destructive",
    light: "oklch(0.577 0.245 27.325)",
    dark: "oklch(0.704 0.191 22.216)",
  },
];

const CHARTS: { token: string; light: string; dark: string }[] = [
  { token: "--chart-brand", light: "#0540c5", dark: "#fee502" },
  { token: "--chart-1", light: "marca 100%", dark: "marca 100%" },
  { token: "--chart-2", light: "marca 75% + fundo", dark: "marca 75% + fundo" },
  { token: "--chart-3", light: "marca 55% + fundo", dark: "marca 55% + fundo" },
  { token: "--chart-4", light: "marca 35% + fundo", dark: "marca 35% + fundo" },
  { token: "--chart-5", light: "marca 20% + fundo", dark: "marca 20% + fundo" },
];

const OPACITIES = [1, 0.8, 0.6, 0.45, 0.3, 0.2];

function Colors() {
  const probes = React.useRef<Record<string, HTMLSpanElement | null>>({});
  const [live, setLive] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const read = () => {
      const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      const next: Record<string, string> = {};
      for (const [key, el] of Object.entries(probes.current)) {
        if (!el) continue;
        const color = getComputedStyle(el).backgroundColor;
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = "#000";
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        next[key] =
          toHex([r ?? 0, g ?? 0, b ?? 0]) +
          (a !== 255 ? ` · ${Math.round(((a ?? 0) / 255) * 100)}%` : "");
      }
      setLive(next);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  const probe = (key: string, token: string) => (
    <span
      ref={(el) => {
        probes.current[key] = el;
      }}
      aria-hidden
      className="hidden"
      style={{ backgroundColor: `var(${token})` }}
    />
  );

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-14">
        {/* Marca */}
        <div className="flex flex-col gap-4">
          <Label>Marca</Label>
          <div className="grid gap-4 sm:grid-cols-2">
            {BRAND.map((c) => {
              const [r, g, b] = hexToRgb(c.hex);
              return (
                <div key={c.name} className="flex min-w-0 flex-col gap-3">
                  <HexSwatch
                    name={c.name}
                    className="flex h-40 items-end p-4 sm:h-56"
                    style={{ backgroundColor: c.hex, color: c.fg }}
                  >
                    <span className="font-heading text-3xl font-medium tracking-tight">
                      {c.name}
                    </span>
                  </HexSwatch>
                  <dl className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-y-1 text-sm">
                    <dt className="font-mono text-xs text-muted-foreground uppercase">HEX</dt>
                    <dd>
                      <CopyValue value={c.hex.toUpperCase()} />
                    </dd>
                    <dt className="font-mono text-xs text-muted-foreground uppercase">RGB</dt>
                    <dd>
                      <CopyValue value={`rgb(${r} ${g} ${b})`} />
                    </dd>
                    <dt className="font-mono text-xs text-muted-foreground uppercase">OKLCH</dt>
                    <dd>
                      <CopyValue value={hexToOklch(c.hex)} />
                    </dd>
                  </dl>
                  <Caption>{c.note}</Caption>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tokens */}
        <div className="flex flex-col gap-4">
          <Label>Tokens de tema</Label>
          <div className="border-b border-border">
            <div className="hidden grid-cols-[3.5rem_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_5.5rem] gap-4 py-2 font-mono text-xs text-muted-foreground uppercase lg:grid">
              <span>Claro · Escuro</span>
              <span>Token</span>
              <span>Classe</span>
              <span>Claro</span>
              <span>Escuro</span>
              <span>Agora</span>
            </div>
            <ul>
              {TOKENS.map((t) => (
                <li
                  key={t.token}
                  className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 border-t border-border py-3 text-sm lg:grid-cols-[3.5rem_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_5.5rem]"
                >
                  <span className="flex h-8 w-14 overflow-hidden ring-1 ring-foreground/10">
                    <HexSwatch
                      name={`${t.token} · claro`}
                      color={t.light}
                      className="flex-1"
                      style={{ backgroundColor: t.light }}
                    />
                    <HexSwatch
                      name={`${t.token} · escuro`}
                      color={t.dark}
                      className="flex-1"
                      style={{ backgroundColor: t.dark }}
                    />
                  </span>
                  <span className="font-mono break-words">{t.token}</span>
                  <span className="col-start-2 font-mono text-muted-foreground lg:col-start-auto">
                    {t.cls}
                  </span>
                  <span className="col-start-2 lg:col-start-auto">
                    <CopyValue value={t.light} className="text-muted-foreground">
                      <span className="mr-2 text-xs uppercase lg:hidden">Claro</span>
                      {t.light}
                    </CopyValue>
                  </span>
                  <span className="col-start-2 lg:col-start-auto">
                    <CopyValue value={t.dark} className="text-muted-foreground">
                      <span className="mr-2 text-xs uppercase lg:hidden">Escuro</span>
                      {t.dark}
                    </CopyValue>
                  </span>
                  <span className="col-start-2 lg:col-start-auto">
                    {probe(t.token, t.token)}
                    <CopyValue value={live[t.token] ?? ""} className="text-xs">
                      <span className="mr-2 text-muted-foreground uppercase lg:hidden">Agora</span>
                      {live[t.token]?.split(" ")[0] ?? "—"}
                    </CopyValue>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Caption>
            “Agora” é a cor calculada no tema atual; alterne o tema para ver a mudança.
          </Caption>
        </div>

        {/* Gráficos */}
        <div className="flex flex-col gap-4">
          <Label>Gráficos</Label>
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <div className="flex min-w-0 flex-col gap-4">
              <ul className="flex h-16 overflow-hidden ring-1 ring-foreground/10">
                {CHARTS.map((c) => (
                  <li key={c.token} className="flex flex-1">
                    <HexSwatch
                      name={c.token}
                      className="block flex-1"
                      style={{ backgroundColor: `var(${c.token})` }}
                    />
                  </li>
                ))}
              </ul>
              <ul className="border-b border-border">
                {CHARTS.map((c) => (
                  <li
                    key={c.token}
                    className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-4 gap-y-0.5 border-t border-border py-2 text-sm"
                  >
                    <span className="font-mono">{c.token}</span>
                    <CopyValue value={c.light} className="text-xs text-muted-foreground">
                      Claro {c.light}
                    </CopyValue>
                    <span />
                    <CopyValue value={c.dark} className="text-xs text-muted-foreground">
                      Escuro {c.dark}
                    </CopyValue>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex h-24 items-end gap-2 border-b border-border pb-0">
                {OPACITIES.map((o) => (
                  <HexSwatch
                    key={o}
                    name={`--chart-brand · ${Math.round(o * 100)}%`}
                    className="flex-1 bg-(--chart-brand)"
                    style={{ opacity: o, height: `${30 + o * 70}%` }}
                  />
                ))}
              </div>
              <p className="font-mono text-xs text-muted-foreground tabular-nums">
                var(--chart-brand) · opacidade {OPACITIES.join(" / ")}
              </p>
              <Caption>
                Gráficos são monocromáticos na cor da marca: azul no tema claro, amarelo no escuro.
                A hierarquia vem da opacidade, não de uma paleta de cores.
              </Caption>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

/* 1. Arredondamento ------------------------------------------------------ */

const RADII = [0, 6, 12, 18, 24];

function Shape() {
  const [radius, setRadius] = React.useState(10);
  const { tick, playing, bind, takeControl } = useTicker({
    interval: 1100,
    length: (RADII.length - 1) * 2,
  });
  React.useEffect(() => {
    if (playing) setRadius(RADII[pingPong(tick, 1, RADII.length)]);
  }, [playing, tick]);
  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const itemRef = React.useRef<HTMLSpanElement>(null);
  const [live, setLive] = React.useState<[number, number, number]>([0, 0, 0]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: o efeito lê o raio já aplicado no DOM, então precisa rodar de novo quando `radius` muda.
  React.useLayoutEffect(() => {
    const px = (el: Element | null) =>
      el ? Math.round(Number.parseFloat(getComputedStyle(el).borderTopLeftRadius) * 10) / 10 : 0;
    setLive([
      px(surfaceRef.current),
      px(fieldRef.current?.querySelector("input") ?? null),
      px(itemRef.current),
    ]);
  }, [radius]);

  const surface = radius * 3.2;
  const f = (n: number) => `${Math.max(0, Math.round(n * 10) / 10)}px`;
  const rows: Line[] = [
    ["--radius", `${radius}px (0.625rem)`, "Base. Trocar reescala o kit inteiro"],
    ["--surface-radius", `${f(surface)} = radius × 3.2`, "Card, Dialog, Drawer, Alert Dialog"],
    ["--radius-step", "8px (0.5rem)", "Diferença entre camadas aninhadas"],
    ["--radius-surface", f(surface), "rounded-surface · 8 componentes"],
    [
      "--radius-field",
      `${f(surface - 8)} = surface − step`,
      "rounded-field · 35 · Button, Input, Badge",
    ],
    [
      "--radius-item",
      `${f(surface - 16)} = surface − 2·step`,
      "rounded-item · 33 · Accordion, Alert, Command",
    ],
    ["--radius-sm / md", `${f(radius * 0.6)} / ${f(radius * 0.8)}`, "radius × 0.6 / 0.8"],
    ["--radius-lg / xl", `${f(radius)} / ${f(radius * 1.4)}`, "radius × 1 / 1.4"],
    [
      "--radius-2xl / 3xl / 4xl",
      `${f(radius * 1.8)} / ${f(radius * 2.2)} / ${f(radius * 2.6)}`,
      "radius × 1.8 / 2.2 / 2.6",
    ],
  ];

  return (
    <Panel
      demo={
        <>
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="hf-radius" className="text-sm font-medium">
              Raio
            </label>
            <span className="font-mono text-sm text-muted-foreground tabular-nums">
              --radius: {radius}px
            </span>
          </div>
          <Slider
            id="hf-radius"
            min={0}
            max={24}
            step={1}
            value={[radius]}
            onValueChange={(v) => {
              takeControl();
              setRadius(Array.isArray(v) ? (v[0] ?? 0) : v);
            }}
            aria-label="Raio"
          />
          <div
            className="relative mt-6"
            style={{ "--radius": `${radius}px` } as React.CSSProperties}
          >
            <Cota side="top">{`--radius ${radius}px`}</Cota>
            <Card ref={surfaceRef as never} className="gap-4 py-4">
              <CardHeader>
                <CardTitle>Superfície</CardTitle>
                <CardDescription className="font-mono tabular-nums">
                  rounded-surface · {live[0]}px
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div ref={fieldRef} className="flex flex-col gap-2">
                  <Input placeholder="Campo · rounded-field" aria-label="Campo" />
                  <p className="font-mono text-xs text-muted-foreground tabular-nums">
                    rounded-field · {live[1]}px
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    ref={itemRef}
                    className="rounded-item bg-accent px-3 py-1.5 text-sm text-accent-foreground"
                  >
                    Item
                  </span>
                  <Badge variant="outline">Badge · field</Badge>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    rounded-item · {live[2]}px
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          <Caption>
            Raios concêntricos: o campo dentro da superfície perde um passo; o item dentro do campo
            perde dois. Os cantos acompanham a curva do pai.
          </Caption>
        </>
      }
      table={<DataTable rows={rows} />}
      bind={bind}
    />
  );
}

/* 2. Sombras -- */

const ELEVATION: { cls: string; use: string }[] = [
  {
    cls: "ring-1 ring-foreground/5 dark:ring-foreground/10",
    use: "Card, Dialog, Alert Dialog, Combobox",
  },
  { cls: "ring-1 ring-foreground/10", use: "Chart, Code Block, Context Menu" },
  { cls: "shadow-sm", use: "Switch, Sidebar, Gradient Panel" },
  { cls: "shadow-md", use: "Card, Slider, Navigation Menu" },
  { cls: "shadow-lg", use: "Popover, Dropdown Menu, Select, Hover Card" },
  { cls: "shadow-xl", use: "Dialog, Sheet, Drawer, Alert Dialog" },
];

function Shadows() {
  const { tick, playing, reduced, bind } = useTicker({ interval: 1400, length: ELEVATION.length });
  const active = reduced || !playing ? -1 : tick;
  const rows: Line[] = [
    ["ring-foreground/5", "18× · 1px", "Card, Dialog, Combobox"],
    ["ring-foreground/10", "19× · 1px", "Chart, Code Block, Context Menu"],
    ["shadow-sm", "4×", "Switch, Sidebar"],
    ["shadow-md", "4×", "Card, Slider, Navigation Menu"],
    ["shadow-lg", "14×", "Popover, Dropdown Menu, Select"],
    ["shadow-xl", "4×", "Dialog, Sheet, Drawer"],
    ["shadow-none", "6×", "Input Group, Toggle Group, Combobox"],
  ];
  return (
    <Panel
      demo={
        <>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
            {ELEVATION.map((e, i) => (
              <li
                key={e.cls}
                className={cn(
                  "flex min-w-0 flex-col gap-2 transition-opacity duration-500",
                  active >= 0 && active !== i && "opacity-50",
                )}
              >
                <span className="relative mt-4 block">
                  {active === i && <Cota key={tick} side="top">{`nível ${i + 1}`}</Cota>}
                  <span
                    className={cn(
                      "block h-20 rounded-field bg-card transition-transform duration-500",
                      active === i && "-translate-y-1",
                      e.cls,
                    )}
                  />
                </span>
                <span className="font-mono text-xs break-words">
                  {e.cls.replace(" dark:ring-foreground/10", "")}
                </span>
                <span className="text-xs text-muted-foreground">{e.use}</span>
              </li>
            ))}
          </ul>
          <Caption>
            Menos bordas: antes de recorrer a uma borda, tente sombra, cor de fundo diferente ou
            mais espaço. A elevação vem de um anel de 5% a 10% e, nos overlays, de uma sombra.
          </Caption>
        </>
      }
      table={<DataTable rows={rows} />}
      bind={bind}
    />
  );
}

/* 3. Tipografia- */

const WEIGHTS = [400, 500, 600, 700];

const SIZES = [
  ["text-xs", 12],
  ["text-sm", 14],
  ["text-base", 16],
  ["text-lg", 18],
  ["text-xl", 20],
  ["text-2xl", 24],
  ["text-3xl", 30],
  ["text-4xl", 36],
  ["text-5xl", 48],
] as const;

function Typography() {
  const [weight, setWeight] = React.useState(500);
  const { tick, playing, bind, takeControl } = useTicker({
    interval: 700,
    length: SIZES.length * WEIGHTS.length,
  });
  const row = playing ? tick % SIZES.length : -1;
  React.useEffect(() => {
    if (playing) setWeight(WEIGHTS[Math.floor(tick / SIZES.length)]);
  }, [playing, tick]);
  const rows: Line[] = [
    [
      "--font-sans",
      "Geist (variável)",
      "Fonte principal. Garante legibilidade e consistência visual.",
    ],
    ["--font-mono", "Geist Mono", "Dados tabulares, trechos de código e rótulos técnicos."],
    [
      "--heading-font",
      "var(--font-sans)",
      "Tipografia dedicada para títulos e métricas em destaque.",
    ],
    [
      "font-medium / semibold",
      "500 / 600",
      "Define a hierarquia (Títulos, botões e rótulos ativos).",
    ],
    [
      "tracking-tight / tighter",
      "−0.025em / −0.05em",
      "Ajuste fino de entrelinhas para títulos de grande porte.",
    ],
    ["leading-tight / none", "1.25 / 1", "Altura de linha reduzida para blocos de texto curtos."],
    [
      "/create",
      "Geist, Inter, Roboto...",
      "Opções tipográficas disponíveis na customização do tema.",
    ],
  ];
  return (
    <Panel
      demo={
        <>
          <ul className="flex flex-col gap-4">
            {[
              ["sans", "font-sans", "Geist Sans"],
              ["mono", "font-mono", "Geist Mono"],
              ["heading", "font-heading", "Fonte de títulos"],
            ].map(([k, cls, text]) => (
              <li
                key={k}
                className="flex items-baseline justify-between gap-4 border-t border-border pt-3"
              >
                <span className={cn("truncate text-3xl", cls)} style={{ fontWeight: weight }}>
                  {text}
                </span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">{cls}</span>
              </li>
            ))}
          </ul>
          <ToggleGroup
            variant="outline"
            spacing={0}
            value={[String(weight)]}
            onValueChange={(v) => {
              if (!v[0]) return;
              takeControl();
              setWeight(Number(v[0]));
            }}
            aria-label="Peso da fonte"
            className="max-w-full flex-wrap self-start"
          >
            {[400, 500, 600, 700].map((w) => (
              <ToggleGroupItem key={w} value={String(w)} className="tabular-nums">
                {w}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <ul className="border-b border-border">
            {SIZES.map(([cls, px], i) => (
              <li
                key={cls}
                data-active={row === i || undefined}
                className="flex items-baseline justify-between gap-4 border-t border-border py-1.5 transition-colors duration-300 data-active:border-primary"
              >
                <span className={`${cls} truncate leading-tight`} style={{ fontWeight: weight }}>
                  Título
                </span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums transition-colors duration-300 in-data-active:text-primary">
                  {cls} · {px}px
                </span>
              </li>
            ))}
          </ul>
        </>
      }
      table={
        <div className="flex flex-col gap-6">
          <DataTable rows={rows} />
          <Caption>
            A centralização da tipografia garante que a hierarquia da informação seja previsível. Ao
            depender de variáveis globais, evitamos inconsistências visuais e asseguramos a mesma
            identidade estrutural em qualquer dispositivo.
          </Caption>
        </div>
      }
      bind={bind}
    />
  );
}

/* 4. Números -- */

const VALUES = [1234.5, 98.75, 10, 7305.1, 111.11];
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dec = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 });
const pct = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });
const compact = new Intl.NumberFormat("pt-BR", { notation: "compact" });

function Numbers() {
  const { tick, playing, bind } = useTicker({ interval: 900, length: VALUES.length });
  const active = playing ? tick : -1;
  const rows: Line[] = [
    [
      "tabular-nums",
      "6× · font-variant-numeric",
      "Dígitos monoespaçados. Evita trepidação em gráficos e painéis.",
    ],
    [
      "milhar / decimal",
      dec.format(1234567.891),
      "Padrão de formatação local (pt-BR) seguro e consistente.",
    ],
    [
      "Intl pt-BR · BRL",
      brl.format(7305.1),
      "Formatação nativa padronizada para dados financeiros e moedas.",
    ],
    [
      "Intl pt-BR · percent",
      pct.format(0.1234),
      "Formatação rigorosa para métricas de conversão e taxas.",
    ],
    [
      "Intl pt-BR · compact",
      compact.format(1234567),
      "Abreviação inteligente para melhor uso do espaço em tela.",
    ],
    [
      "text-right + tabular",
      "Alinhar à direita",
      "Padrão ouro para alinhamento de colunas numéricas em tabelas.",
    ],
    [
      "font-heading",
      "Número de impacto",
      "Estilo reservado para exibição de métricas principais em dashboards.",
    ],
  ];
  return (
    <Panel
      demo={
        <>
          <div className="grid grid-cols-2 gap-6">
            {[
              ["Proporcional", "[font-variant-numeric:proportional-nums]"],
              ["tabular-nums", "tabular-nums"],
            ].map(([title, cls]) => (
              <div key={title} className="flex min-w-0 flex-col gap-2">
                <Label>{title}</Label>
                <ul className="border-b border-border">
                  {VALUES.map((v, i) => (
                    <li
                      key={v}
                      className={cn(
                        "border-t border-border py-1.5 text-right text-lg transition-colors duration-300",
                        active === i && "bg-primary/10 text-primary",
                        cls,
                      )}
                    >
                      {brl.format(v)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1 border-t border-border pt-4">
            <Label>Número grande · font-heading</Label>
            <p className="font-heading text-6xl leading-none font-medium tracking-tighter tabular-nums">
              {dec.format(12840.5)}
            </p>
          </div>
          <Caption>
            O tratamento rigoroso de dados numéricos é vital para interfaces de gestão. O uso de
            fontes tabulares aliado à formatação nativa (Intl API) transmite precisão técnica, evita
            quebra de layouts e facilita a leitura dinâmica.
          </Caption>
        </>
      }
      table={<DataTable rows={rows} />}
      bind={bind}
    />
  );
}

/* 5. Espaçamento */

const STEPS = [1, 2, 3, 4, 6, 8, 12, 16];

function Spacing() {
  const { tick, playing, bind } = useTicker({ interval: 900, length: STEPS.length });
  const active = playing ? tick : -1;
  const rows: Line[] = [
    ["--spacing", "0.25rem = 4px", "Módulo base. Define o ritmo espacial de toda a interface."],
    [
      "--card-spacing",
      "24px (6) · 16px (sm)",
      "Token global usado para estruturar contêineres principais.",
    ],
    ["CardHeader gap", "gap-1.5 = 6px", "Distância hierárquica padrão entre títulos e subtítulos."],
    [
      "Button h-6/8/9/10",
      "24/32/36/40px",
      "Alturas padronizadas para garantir áreas de toque acessíveis.",
    ],
    [
      "Button px-2.5/3/4",
      "10/12/16px",
      "Paddings laterais matematicamente proporcionais à altura.",
    ],
    [
      "Button gap",
      "gap-1 / gap-1.5",
      "Respiro visual padronizado entre ícones e rótulos textuais.",
    ],
    [
      "Input h-7/9",
      "28/36px",
      "Garante alinhamento horizontal perfeito ao lado dos botões correspondentes.",
    ],
  ];
  return (
    <Panel
      demo={
        <>
          <ul className="flex flex-wrap items-end gap-x-5 gap-y-4 border-b border-border pt-6 pb-4">
            {STEPS.map((n, i) => (
              <li key={n} className="flex flex-col gap-2">
                <span className="relative block">
                  {active === i && <Cota key={tick} side="top" />}
                  <span
                    className={cn(
                      "block h-5 transition-colors duration-300",
                      active === i ? "bg-primary" : "bg-foreground",
                    )}
                    style={{ width: n * 4 }}
                  />
                </span>
                <span
                  className={cn(
                    "font-mono text-xs tabular-nums transition-colors duration-300",
                    active === i ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {n} · {n * 4}px
                </span>
              </li>
            ))}
          </ul>
          <div className="relative">
            <Card className="gap-6 py-6">
              <CardHeader className="relative">
                <CardTitle>Título do Card</CardTitle>
                <CardDescription>Descrição de apoio</CardDescription>
              </CardHeader>
              <CardContent className="relative flex items-center gap-1.5">
                <Button size="sm">Ação</Button>
                <Button size="sm" variant="outline">
                  Cancelar
                </Button>
              </CardContent>
            </Card>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-primary/15"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-primary/15"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-primary/15"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-primary/15"
            />
            <span className="absolute top-1 left-1/2 -translate-x-1/2 font-mono text-xs tabular-nums text-primary">
              24
            </span>
            <span className="absolute top-1/2 left-1 -translate-y-1/2 font-mono text-xs tabular-nums text-primary">
              24
            </span>
          </div>
          <Caption>
            Um sistema de espaçamento rigoroso baseado em múltiplos de 4px constrói um ritmo visual
            previsível. Ele remove a hesitação durante o desenvolvimento e assegura que os
            componentes respirem de forma harmônica e técnica.
          </Caption>
        </>
      }
      table={<DataTable rows={rows} />}
      bind={bind}
    />
  );
}

/* 6. Movimento  */

function Motion() {
  const [run, setRun] = React.useState(0);
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="w-full">
        <PresentationShowcase />
      </div>
      <Card key={run} className="fluid-stagger animate-fluid-in w-full max-w-sm">
        <CardHeader className="fluid-stagger">
          <CardTitle className="animate-fluid-in-sm">Título</CardTitle>
          <CardDescription className="animate-fluid-in-sm">Descrição curta.</CardDescription>
        </CardHeader>
        <CardContent className="fluid-stagger flex flex-col gap-4">
          <Field className="animate-fluid-in-sm">
            <FieldLabel htmlFor="motion-a">Campo</FieldLabel>
            <Input id="motion-a" placeholder="Texto" />
          </Field>
          <Field className="animate-fluid-in-sm">
            <FieldLabel htmlFor="motion-b">Outro campo</FieldLabel>
            <Input id="motion-b" placeholder="Texto" />
          </Field>
          <div className="flex animate-fluid-in-sm items-center justify-between gap-4">
            <span className="text-sm">Opção</span>
            <Switch aria-label="Opção" defaultChecked />
          </div>
          <Progress value={60} className="animate-fluid-in-sm" />
        </CardContent>
        <CardFooter className="fluid-stagger gap-2">
          <Button className="animate-fluid-in-sm">Ação</Button>
          <Button variant="outline" className="animate-fluid-in-sm">
            Cancelar
          </Button>
        </CardFooter>
      </Card>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRun((r) => r + 1)}
            className="active:scale-[0.97]"
          >
            Reproduzir
          </Button>
          <Link
            href="/docs/animacoes"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Ver detalhes das animações<span aria-hidden> →</span>
          </Link>
        </div>
        <Caption>
          Animações no sistema possuem uma finalidade clara: guiar a atenção do usuário, comunicar o
          estado da interface com feedback imediato e suavizar o carregamento de dados, mantendo a
          sensação de performance.
        </Caption>
      </div>
    </div>
  );
}

export function HomeFoundations() {
  const [tab, setTab] = React.useState<Tab>("cores");
  return (
    <HomeSection
      n={3}
      id="fundamentos"
      eyebrow="Fundamentos"
      title="Fundamentos centralizados para escalabilidade"
      description="Regras essenciais de design — como tipografia, proporções e espaçamento — mapeadas diretamente em tokens. O restante da interface apenas herda essas decisões, garantindo coesão absoluta e manutenções simplificadas."
    >
      <Reveal className="-mt-6 flex flex-col gap-10">
        <ToggleGroup
          variant="outline"
          spacing={0}
          value={[tab]}
          onValueChange={(v) => {
            if (v[0]) setTab(v[0] as Tab);
          }}
          aria-label="Escolha um fundamento"
          className="max-w-full flex-wrap self-start"
        >
          {TABS.map((t) => (
            <ToggleGroupItem key={t.value} value={t.value}>
              {t.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <section
          aria-live={tab === "cores" || tab === "movimento" ? "polite" : "off"}
          aria-label="Detalhes do fundamento escolhido"
          className="contents"
        >
          {tab === "cores" ? <Colors /> : null}
          {tab === "forma" ? <Shape /> : null}
          {tab === "sombras" ? <Shadows /> : null}
          {tab === "tipografia" ? <Typography /> : null}
          {tab === "numeros" ? <Numbers /> : null}
          {tab === "espacamento" ? <Spacing /> : null}
          {tab === "movimento" ? <Motion /> : null}
        </section>
      </Reveal>
    </HomeSection>
  );
}
