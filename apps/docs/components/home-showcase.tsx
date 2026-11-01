"use client";

import { Avatar, AvatarFallback, AvatarGroup } from "@multiclubes/ui/components/avatar";
import { Badge } from "@multiclubes/ui/components/badge";
import { Button } from "@multiclubes/ui/components/button";
import { ButtonGroup } from "@multiclubes/ui/components/button-group";
import { Card, CardContent } from "@multiclubes/ui/components/card";
import { Field, FieldGroup, FieldLabel } from "@multiclubes/ui/components/field";
import { Input } from "@multiclubes/ui/components/input";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@multiclubes/ui/components/item";
import { NativeSelect, NativeSelectOption } from "@multiclubes/ui/components/native-select";
import { Switch } from "@multiclubes/ui/components/switch";
import {
  ArrowRightIcon,
  HeartIcon,
  PlusIcon,
  StarIcon,
  TrophyIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "cn";
import * as React from "react";
import { BRAND_COLORS, LogoMark } from "@/components/logo";

/*
 * Vitrine animada da home: ícones, fontes, cores e componentes se revezam no mesmo palco.
 * Um relógio único (t, em ms desde o início da cena) dirige as etapas de cada cena.
 */

const TICK = 100;

const SCENES = [
  { id: "icones", duration: 6000 },
  { id: "fontes", duration: 6000 },
  { id: "cores", duration: 6000 },
  { id: "componentes", duration: 7000 },
] as const;

export function HomeShowcase() {
  const [clock, setClock] = React.useState({ index: 0, t: 0, run: 0 });

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setClock((c) =>
        c.t + TICK >= SCENES[c.index].duration
          ? { index: (c.index + 1) % SCENES.length, t: 0, run: c.run + 1 }
          : { ...c, t: c.t + TICK },
      );
    }, TICK);
    return () => window.clearInterval(id);
  }, []);

  const scene = SCENES[clock.index];

  return (
    <section
      aria-label="Identidade visual do Mosaico"
      className="relative h-full min-h-[28rem] overflow-hidden bg-dot-grid"
      inert
    >
      <div
        key={clock.run}
        className="absolute inset-0 flex animate-showcase-in items-center justify-center p-6 sm:p-8"
      >
        {scene.id === "icones" && <IconScene t={clock.t} />}
        {scene.id === "fontes" && <FontScene t={clock.t} />}
        {scene.id === "cores" && <ColorScene t={clock.t} />}
        {scene.id === "componentes" && <ComponentScene t={clock.t} />}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------------------------- */
/* Tamanhos e cotas                                                                              */
/* --------------------------------------------------------------------------------------------- */

const SIZE_STEP = 500;

/** Etapa de um vaivém: 0, 1, …, n-1, n-2, …, 1, 0, 1, … */
function pingPong(t: number, step: number, length: number) {
  const period = (length - 1) * 2;
  const i = Math.floor(Math.max(0, t) / step) % period;
  return i < length ? i : period - i;
}

type Tier = 0 | 1 | 2;

/** Pequeno, padrão e grande, começando no padrão: padrão → grande → padrão → pequeno → … */
function tierAt(t: number): Tier {
  const i = Math.floor(Math.max(0, t) / SIZE_STEP + 1) % 4;
  return (i === 3 ? 1 : i) as Tier;
}

type Size = { token: string; px: number };

const ICON_SIZES: Size[] = [
  { token: "size-4", px: 16 },
  { token: "size-5", px: 20 },
  { token: "size-6", px: 24 },
];
const MEDIA_SIZES: Size[] = [
  { token: "size-6", px: 24 },
  { token: "size-8", px: 32 },
  { token: "size-10", px: 40 },
];
const BUTTON_SIZES = [
  { token: "sm", px: 32 },
  { token: "default", px: 36 },
  { token: "lg", px: 40 },
] as const;
const ITEM_SIZES = ["xs", "sm", "default"] as const;
const AVATAR_SIZES = [
  { token: "sm", px: 24 },
  { token: "default", px: 32 },
  { token: "lg", px: 40 },
] as const;

/** Linha de cota com a medida: horizontal em cima, vertical à esquerda. */
function Dimension({ label, vertical }: { label: string; vertical?: boolean }) {
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
function Measure({
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

/* --------------------------------------------------------------------------------------------- */
/* Ícones: três exemplos, ampliados para ficarem legíveis no palco.                              */
/* --------------------------------------------------------------------------------------------- */

const STEP = 2000;

type Step = { key: string; render: (tier: Tier) => React.ReactNode };

const ICON_STEPS: Step[] = [
  {
    key: "icon",
    render: (tier) => (
      <Measure {...ICON_SIZES[tier]}>
        <HeartIcon className={cn("transition-all duration-300", ICON_SIZES[tier].token)} />
      </Measure>
    ),
  },
  {
    key: "button",
    render: (tier) => (
      <div className="flex items-end gap-2">
        <Measure {...BUTTON_SIZES[tier]}>
          <Button size={BUTTON_SIZES[tier].token}>
            <PlusIcon data-icon="inline-start" weight="bold" /> Novo sócio
          </Button>
        </Measure>
        <Button size={BUTTON_SIZES[tier].token} variant="outline">
          Ver <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
    ),
  },
  {
    key: "item",
    render: (tier) => (
      <Item variant="outline" size={ITEM_SIZES[tier]} className="mt-7 ml-12 w-72">
        <Measure {...MEDIA_SIZES[tier]} className="m-0">
          <ItemMedia
            className={cn(
              "rounded-field bg-primary/10 text-primary transition-all duration-300",
              MEDIA_SIZES[tier].token,
            )}
          >
            <TrophyIcon
              weight="duotone"
              className={cn("transition-all duration-300", ICON_SIZES[tier].token)}
            />
          </ItemMedia>
        </Measure>
        <ItemContent>
          <ItemTitle>Campeonato interno</ItemTitle>
          <ItemDescription>12 equipes inscritas</ItemDescription>
        </ItemContent>
      </Item>
    ),
  },
];

function IconScene({ t }: { t: number }) {
  const index = Math.min(ICON_STEPS.length - 1, Math.floor(t / STEP));
  const step = ICON_STEPS[index];
  return (
    <div
      key={step.key}
      className="flex animate-showcase-in justify-center [zoom:1.25] sm:[zoom:1.75]"
    >
      {step.render(tierAt(t - index * STEP))}
    </div>
  );
}

/* --------------------------------------------------------------------------------------------- */
/* Fontes: uma letra passando pela escala, pelos pesos e pelos estilos do kit.                   */
/* --------------------------------------------------------------------------------------------- */

const TYPE_SIZES: Size[] = [
  { token: "text-sm", px: 14 },
  { token: "text-base", px: 16 },
  { token: "text-xl", px: 20 },
  { token: "text-2xl", px: 24 },
  { token: "text-4xl", px: 36 },
];
const FONT_WEIGHTS = ["font-normal", "font-medium", "font-semibold"];
const FONT_STYLES = ["font-sans", "font-sans italic", "font-mono"];

function FontScene({ t }: { t: number }) {
  const size = TYPE_SIZES[pingPong(t, SIZE_STEP, TYPE_SIZES.length)];
  const weight = FONT_WEIGHTS[Math.floor(t / 1000) % FONT_WEIGHTS.length];
  const style = FONT_STYLES[Math.floor(t / STEP) % FONT_STYLES.length];

  return (
    <div className="flex justify-center [zoom:1.75] sm:[zoom:2.5]">
      <Measure token={size.token} px={size.px}>
        {/* leading-none: a altura da caixa é o próprio tamanho da fonte. */}
        <span
          className={cn(
            "block leading-none transition-[font-size,font-weight] duration-300",
            size.token,
            weight,
            style,
          )}
        >
          A
        </span>
      </Measure>
    </div>
  );
}

/* --------------------------------------------------------------------------------------------- */
/* Cores: as duas cores da logo saem dela, e o tema deriva o resto.                              */
/* --------------------------------------------------------------------------------------------- */

const EXTRACTED = [
  { at: 600, hex: BRAND_COLORS.blue },
  { at: 1500, hex: BRAND_COLORS.yellow },
];

const DERIVED = [
  "oklch(0.44 0.213 263)",
  "oklch(0.55 0.19 263)",
  "oklch(0.62 0.2 263)",
  "oklch(0.85 0.18 101)",
  "oklch(0.914 0.191 101.4)",
];

function ColorScene({ t }: { t: number }) {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-8">
      <div className="flex items-center gap-6">
        <div
          className="relative size-28 shrink-0 rounded-surface shadow-lg"
          style={{ backgroundColor: BRAND_COLORS.blue, color: BRAND_COLORS.yellow }}
        >
          <LogoMark className="absolute top-1/2 left-1/2 w-[70%] -translate-1/2" />
        </div>
        <div className="flex flex-col gap-3">
          {EXTRACTED.map((color) => (
            <span
              key={color.hex}
              className={cn(
                "size-12 rounded-full border border-line transition-all duration-500",
                t >= color.at ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
              )}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>
      <div className="grid w-full grid-cols-5 gap-2">
        {DERIVED.map((value, index) => (
          <div
            key={value}
            className={cn(
              "h-12 rounded-field border border-line transition-all duration-500",
              t >= 2600 + index * 150 ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}
            style={{ backgroundColor: value }}
          />
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------------------------- */
/* Componentes: os grupos recebem filhos um a um, e o layout se ajusta.                          */
/* --------------------------------------------------------------------------------------------- */

function Grow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid animate-grow-in">
      <div className="min-h-0">{children}</div>
    </div>
  );
}

const FIELDS = [
  <Field key="nome">
    <FieldLabel>Nome do clube</FieldLabel>
    <Input readOnly defaultValue="Clube Atlético" />
  </Field>,
  <Field key="email">
    <FieldLabel>E-mail</FieldLabel>
    <Input readOnly defaultValue="contato@clube.com.br" />
  </Field>,
  <Field key="plano">
    <FieldLabel>Plano</FieldLabel>
    <NativeSelect defaultValue="familia" className="w-full">
      <NativeSelectOption value="familia">Família</NativeSelectOption>
    </NativeSelect>
  </Field>,
  <Field key="avisar" orientation="horizontal" className="justify-between">
    <FieldLabel>Avisar os sócios</FieldLabel>
    <Switch defaultChecked />
  </Field>,
  <Button key="salvar" className="w-full">
    Criar clube
  </Button>,
];

const PERIODS = ["Dia", "Semana", "Mês", "Ano"];
const MEMBERS = ["AM", "CS", "JP", "LR", "MF"];
const STATUS = [
  <Badge key="ativo">Ativo</Badge>,
  <Badge key="pendente" variant="secondary">
    Pendente
  </Badge>,
  <Badge key="convidado" variant="outline">
    Convidado
  </Badge>,
  <Badge key="destaque" className="bg-highlight text-highlight-foreground">
    <StarIcon weight="fill" /> Destaque
  </Badge>,
];

function ComponentScene({ t }: { t: number }) {
  if (t < 3800) {
    const count = Math.min(FIELDS.length, Math.floor(t / 550) + 1);
    return (
      <Card className="w-full max-w-xs py-5">
        <CardContent className="px-5">
          <FieldGroup className="gap-4">
            {FIELDS.slice(0, count).map((field) => (
              <Grow key={field.key}>{field}</Grow>
            ))}
          </FieldGroup>
        </CardContent>
      </Card>
    );
  }

  const count = Math.floor((t - 3800) / 450) + 1;
  const tier = tierAt(t - 3800);
  return (
    <div className="flex animate-showcase-in flex-col items-center gap-4">
      <div className="flex h-20 items-end">
        <Measure {...BUTTON_SIZES[tier]}>
          <ButtonGroup>
            {PERIODS.slice(0, count).map((period, index) => (
              <Button
                key={period}
                variant={index === 0 ? "default" : "outline"}
                size={BUTTON_SIZES[tier].token}
                className="animate-showcase-in"
              >
                {period}
              </Button>
            ))}
          </ButtonGroup>
        </Measure>
      </div>
      <div className="flex h-20 items-end">
        <Measure {...AVATAR_SIZES[tier]}>
          <AvatarGroup>
            {MEMBERS.slice(0, count).map((initials) => (
              <Avatar
                key={initials}
                size={AVATAR_SIZES[tier].token}
                className="animate-showcase-in transition-all duration-300"
              >
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </Measure>
      </div>
      <div className="flex flex-wrap justify-center gap-2 pt-4">
        {STATUS.slice(0, count).map((badge) => (
          <span key={badge.key} className="animate-showcase-in">
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}
