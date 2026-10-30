import { Avatar, AvatarFallback } from "@multiclubes/ui/components/avatar";
import { Badge } from "@multiclubes/ui/components/badge";
import { Button } from "@multiclubes/ui/components/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@multiclubes/ui/components/card";
import { Input } from "@multiclubes/ui/components/input";
import { Switch } from "@multiclubes/ui/components/switch";
import {
  ArrowRightIcon,
  BellIcon,
  CalendarIcon,
  CheckCircleIcon,
  CreditCardIcon,
  DownloadSimpleIcon,
  EnvelopeSimpleIcon,
  GearIcon,
  HeartIcon,
  HouseIcon,
  InfoIcon,
  LockIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusIcon,
  ShareNetworkIcon,
  StarIcon,
  TrashIcon,
  TrophyIcon,
  UserIcon,
  UsersThreeIcon,
  WarningIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "cn";
import type * as React from "react";
import { BRAND_COLORS } from "@/components/logo";

// Cores da marca, de components/logo.tsx.
const BRAND = [
  { name: "Amarelo", hex: BRAND_COLORS.yellow, text: "#0a0a0a" },
  { name: "Azul", hex: BRAND_COLORS.blue, text: "#ffffff" },
];

// Tokens do tema (packages/ui/src/styles/globals.css). As cores seguem o modo claro ou escuro.
const TOKENS = [
  { name: "background", className: "bg-background text-foreground" },
  { name: "foreground", className: "bg-foreground text-background" },
  { name: "primary", className: "bg-primary text-primary-foreground" },
  { name: "highlight", className: "bg-highlight text-highlight-foreground" },
  {
    name: "secondary",
    className: "bg-secondary text-secondary-foreground",
  },
  { name: "muted", className: "bg-muted text-muted-foreground" },
  { name: "accent", className: "bg-accent text-accent-foreground" },
  { name: "border", className: "bg-border text-foreground" },
  { name: "ring", className: "bg-ring text-background" },
  {
    name: "destructive",
    className: "bg-destructive text-background",
  },
];

const CHARTS = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"];

const TYPE_SCALE = [
  { token: "text-4xl", className: "text-4xl font-semibold tracking-tight", note: "36 px" },
  { token: "text-2xl", className: "text-2xl font-semibold tracking-tight", note: "24 px" },
  { token: "text-xl", className: "text-xl font-semibold", note: "20 px" },
  { token: "text-base", className: "text-base", note: "16 px" },
  { token: "text-sm", className: "text-sm", note: "14 px" },
  { token: "text-xs", className: "text-xs", note: "12 px" },
];

const WEIGHTS = [
  { name: "Regular", className: "font-normal" },
  { name: "Medium", className: "font-medium" },
  { name: "Semibold", className: "font-semibold" },
];

const ICONS: { name: string; icon: React.ComponentType<React.ComponentProps<"svg">> }[] = [
  { name: "House", icon: HouseIcon },
  { name: "MagnifyingGlass", icon: MagnifyingGlassIcon },
  { name: "Bell", icon: BellIcon },
  { name: "Gear", icon: GearIcon },
  { name: "User", icon: UserIcon },
  { name: "UsersThree", icon: UsersThreeIcon },
  { name: "Heart", icon: HeartIcon },
  { name: "Star", icon: StarIcon },
  { name: "Trophy", icon: TrophyIcon },
  { name: "Calendar", icon: CalendarIcon },
  { name: "CreditCard", icon: CreditCardIcon },
  { name: "EnvelopeSimple", icon: EnvelopeSimpleIcon },
  { name: "Lock", icon: LockIcon },
  { name: "ShareNetwork", icon: ShareNetworkIcon },
  { name: "DownloadSimple", icon: DownloadSimpleIcon },
  { name: "PencilSimple", icon: PencilSimpleIcon },
  { name: "Plus", icon: PlusIcon },
  { name: "X", icon: XIcon },
  { name: "ArrowRight", icon: ArrowRightIcon },
  { name: "CheckCircle", icon: CheckCircleIcon },
  { name: "Warning", icon: WarningIcon },
  { name: "Info", icon: InfoIcon },
  { name: "Trash", icon: TrashIcon },
];

const ICON_SIZES = [
  { size: "size-3", label: "12 px, badge" },
  { size: "size-4", label: "16 px, botão" },
  { size: "size-5", label: "20 px" },
  { size: "size-6", label: "24 px" },
];

const RADII = [
  { name: "surface", note: "dialog, card, command", className: "rounded-surface" },
  { name: "field", note: "campo, botão, popover", className: "rounded-field" },
  { name: "item", note: "item de menu e de lista", className: "rounded-item" },
  { name: "full", note: "círculos e pílulas", className: "rounded-full" },
];

const ALPHABET = (
  <>
    ABCDEFGHIJKLMNOPQRSTUVWXYZ
    <br />
    abcdefghijklmnopqrstuvwxyz
    <br />
    0123456789
  </>
);

function Block({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {note && <p className="text-right text-xs text-muted-foreground">{note}</p>}
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium text-muted-foreground">{children}</p>;
}

/** Cores, fontes, ícones, tipografia e formas do Mosaico, mostrados com os próprios componentes. */
export function VisualIdentity() {
  return (
    <div className="container-wrapper px-6 pb-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-20">
        <Block id="cores" title="Cores" note="Acompanham o modo claro e escuro">
          <div className="flex flex-col gap-3">
            <Label>Marca, extraída da logo</Label>
            <div className="grid grid-cols-2 gap-3">
              {BRAND.map((color) => (
                <div
                  key={color.hex}
                  className="flex h-28 flex-col justify-end rounded-field p-4"
                  style={{ backgroundColor: color.hex, color: color.text }}
                >
                  <span className="text-sm font-semibold">{color.name}</span>
                  <span className="font-mono text-xs opacity-80">{color.hex}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Tema do kit</Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {TOKENS.map((token) => (
                <div
                  key={token.name}
                  className={cn(
                    "flex h-24 flex-col justify-end rounded-field p-4 shadow-sm",
                    token.className,
                  )}
                >
                  <span className="text-sm font-medium">{token.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Gráficos</Label>
            <div className="flex h-12 overflow-hidden rounded-full">
              {CHARTS.map((className) => (
                <div key={className} className={cn("flex-1", className)} />
              ))}
            </div>
          </div>
        </Block>

        <Block id="fontes" title="Fontes" note="Fontes oficiais do kit">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-surface bg-muted p-6">
              <Label>Geist Sans</Label>
              <p className="font-sans text-7xl font-semibold tracking-tight">Aa</p>
              <p className="font-sans text-lg leading-snug">{ALPHABET}</p>
            </div>
            <div className="flex flex-col gap-4 rounded-surface bg-muted p-6">
              <Label>Geist Mono</Label>
              <p className="font-mono text-7xl font-semibold tracking-tight">Aa</p>
              <p className="font-mono text-lg leading-snug">{ALPHABET}</p>
            </div>
          </div>
        </Block>

        <Block id="tipografia" title="Tipografia">
          <div className="flex flex-col">
            {TYPE_SCALE.map((item) => (
              <div key={item.token} className="flex items-baseline gap-6 py-2.5">
                <span className="w-32 shrink-0 font-mono text-xs text-muted-foreground">
                  {item.token} · {item.note}
                </span>
                <span className={cn("truncate", item.className)}>Multiclubes une o clube</span>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {WEIGHTS.map((weight) => (
              <div key={weight.name} className="rounded-field bg-muted p-5">
                <p className={cn("text-3xl", weight.className)}>Aa</p>
                <p className="pt-2 text-xs text-muted-foreground">{weight.name}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 rounded-surface bg-muted p-6">
            <p className="text-xl font-semibold tracking-tight">Título da seção</p>
            <p className="text-sm text-muted-foreground">
              Texto de apoio em cinza secundário. Enfraquecer o que é secundário cria hierarquia sem
              precisar aumentar o resto.
            </p>
          </div>
        </Block>

        <Block id="icones" title="Ícones" note="Phosphor Icons">
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
            {ICONS.map(({ name, icon: Icon }) => (
              <div
                key={name}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-field bg-muted"
              >
                <Icon className="size-6" aria-hidden="true" />
                <span className="max-w-full truncate px-1 text-[10px] text-muted-foreground">
                  {name}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-8 rounded-surface bg-muted p-6">
            {ICON_SIZES.map((item) => (
              <div key={item.size} className="flex flex-col items-center gap-2">
                <HeartIcon className={item.size} aria-hidden="true" />
                <span className="text-[11px] text-muted-foreground">{item.label}</span>
              </div>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm">
                <PlusIcon data-icon="inline-start" /> Novo clube
              </Button>
              <Button size="sm" variant="outline">
                Ver <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </Block>

        <Block id="formas" title="Formas" note="Formas suaves, como a logo">
          <div className="flex flex-col gap-3">
            <Label>
              Escala de raios: cada nível interno tem o raio do externo menos o espaço entre eles
            </Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {RADII.map((radius) => (
                <div key={radius.name} className="flex flex-col items-center gap-2">
                  <div className={cn("aspect-square w-full bg-foreground/15", radius.className)} />
                  <span className="font-mono text-xs text-muted-foreground">{radius.name}</span>
                  <span className="text-center text-xs text-muted-foreground">{radius.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Nos componentes</Label>
            <div className="grid gap-3 md:grid-cols-2">
              <Card className="gap-4">
                <CardHeader>
                  <CardTitle>Card · surface</CardTitle>
                  <CardDescription>Superfícies maiores têm o raio mais generoso.</CardDescription>
                </CardHeader>
              </Card>
              <div className="flex flex-col justify-center gap-3 rounded-surface bg-muted p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Button>Botão · pílula</Button>
                  <Button variant="outline">Contorno</Button>
                  <Button variant="secondary">Secundário</Button>
                  <Button variant="ghost">Texto</Button>
                </div>
                <Input placeholder="Campo · field" aria-label="Exemplo de campo" />
                <div className="flex items-center gap-3">
                  <Badge>Badge</Badge>
                  <Badge variant="secondary">Secundário</Badge>
                  <Badge variant="outline">Contorno</Badge>
                  <Switch aria-label="Exemplo de switch" defaultChecked />
                  <Avatar>
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        </Block>
      </div>
    </div>
  );
}
