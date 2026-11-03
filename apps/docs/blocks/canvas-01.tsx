"use client";

import { Badge } from "@multiclubes/ui/components/badge";
import { Button } from "@multiclubes/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@multiclubes/ui/components/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@multiclubes/ui/components/input-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@multiclubes/ui/components/item";
import { Kbd } from "@multiclubes/ui/components/kbd";
import { Progress, ProgressLabel, ProgressValue } from "@multiclubes/ui/components/progress";
import { ScrollArea } from "@multiclubes/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@multiclubes/ui/components/sheet";
import { ThemeToggle } from "@multiclubes/ui/components/theme-toggle";
import { ToggleGroup, ToggleGroupItem } from "@multiclubes/ui/components/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@multiclubes/ui/components/tooltip";
import {
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ClockIcon,
  CornersOutIcon,
  CrosshairIcon,
  EyeIcon,
  FunnelIcon,
  type Icon,
  ListIcon,
  MagnifyingGlassIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  MoonIcon,
  NotePencilIcon,
  QuestionIcon,
  RulerIcon,
  StackIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import * as React from "react";
import { LogoWordmark } from "@/components/logo";

// Casca de um app de canvas operacional: o canvas ocupa a tela inteira e tudo o mais flutua
// sobre ele (cabeçalho, painel lateral, trilho de ferramentas e resumo). Dados ilustrativos.
const CONTEXTS = [
  { name: "Ambiente 1", count: "29/49" },
  { name: "Ambiente 2", count: "18/40" },
  { name: "Ambiente 3", count: "34/52" },
  { name: "Ambiente 4", count: "7/24" },
];
const VIEWS = [
  ["3d", "Visão 3D"],
  ["planta", "Planta"],
  ["linha", "Linha do tempo"],
];
const TOOLS: { label: string; icon: Icon }[] = [
  { label: "Camadas", icon: StackIcon },
  { label: "Visibilidade", icon: EyeIcon },
  { label: "Ampliar", icon: MagnifyingGlassPlusIcon },
  { label: "Reduzir", icon: MagnifyingGlassMinusIcon },
  { label: "Centralizar", icon: CrosshairIcon },
  { label: "Régua", icon: RulerIcon },
  { label: "Anotar", icon: NotePencilIcon },
];

type Severity = "critical" | "late" | "idle";
const SEVERITY: Record<Severity, { icon: Icon; tone: string }> = {
  critical: { icon: WarningIcon, tone: "text-destructive" },
  late: { icon: ClockIcon, tone: "text-highlight" },
  idle: { icon: MoonIcon, tone: "text-muted-foreground" },
};
const ATTENTION: { n: number; title: string; severity: Severity; minutes: number }[] = [
  { n: 12, title: "Alerta crítico", severity: "critical", minutes: 62 },
  { n: 7, title: "Atraso", severity: "late", minutes: 48 },
  { n: 31, title: "Sem atividade", severity: "idle", minutes: 35 },
  { n: 3, title: "Alerta crítico", severity: "critical", minutes: 29 },
  { n: 22, title: "Atraso", severity: "late", minutes: 24 },
  { n: 45, title: "Sem atividade", severity: "idle", minutes: 18 },
  { n: 18, title: "Atraso", severity: "late", minutes: 12 },
  { n: 9, title: "Sem atividade", severity: "idle", minutes: 6 },
];

type Status = "Disponível" | "Reservado" | "Em uso" | "Conta" | "Com alerta";
const STATUS_DOT: Record<Status, string> = {
  Disponível: "bg-primary",
  Reservado: "bg-highlight",
  "Em uso": "bg-foreground",
  Conta: "bg-muted-foreground",
  "Com alerta": "bg-destructive",
};
const STATUS_BADGE: Record<Status, "default" | "secondary" | "destructive" | "outline"> = {
  Disponível: "default",
  Reservado: "secondary",
  "Em uso": "outline",
  Conta: "outline",
  "Com alerta": "destructive",
};
const STATUSES = Object.keys(STATUS_DOT) as Status[];
const LEGEND: [Status, number][] = [
  ["Disponível", 17],
  ["Reservado", 3],
  ["Em uso", 29],
  ["Conta", 4],
  ["Com alerta", 8],
];
const ALL_ITEMS = Array.from({ length: 24 }, (_, i) => ({
  n: i + 1,
  status: STATUSES[(i * 3) % STATUSES.length] as Status,
  count: ((i * 7) % 5) + 1,
}));

const SURFACE =
  "bg-card text-card-foreground shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10";

type PanelView = "atencao" | "itens";

export default function Canvas01() {
  const [asideOpen, setAsideOpen] = React.useState(true);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [view, setView] = React.useState<PanelView>("atencao");

  return (
    <TooltipProvider>
      {/* A página ocupa a altura da tela e não rola; o canvas fica atrás de tudo. */}
      <div className="relative h-svh overflow-hidden bg-muted/60 bg-[radial-gradient(circle,color-mix(in_oklch,var(--foreground)_18%,transparent)_1px,transparent_1px)] bg-size-[20px_20px]">
        <div
          aria-label="Canvas"
          role="img"
          className="absolute inset-0 flex items-center justify-center p-6"
        >
          <div className="flex aspect-video w-full max-w-2xl items-center justify-center rounded-surface bg-background/70 ring-1 ring-foreground/5 dark:ring-foreground/10">
            <span className="text-sm text-muted-foreground">Área do canvas</span>
          </div>
        </div>

        <AppHeader onOpenPanel={() => setSheetOpen(true)} />

        {asideOpen && (
          <aside
            aria-label="Painel lateral"
            className={`absolute top-20 right-3 bottom-3 hidden w-80 flex-col gap-2 rounded-surface p-2 md:flex ${SURFACE}`}
          >
            <PanelContent view={view} onViewChange={setView} />
          </aside>
        )}
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label={asideOpen ? "Recolher painel" : "Expandir painel"}
          aria-expanded={asideOpen}
          onClick={() => setAsideOpen((open) => !open)}
          className={`absolute top-24 hidden rounded-full shadow-md md:inline-flex ${asideOpen ? "right-[21.25rem]" : "right-3"}`}
        >
          {asideOpen ? <CaretRightIcon /> : <CaretLeftIcon />}
        </Button>

        <ToolRail asideOpen={asideOpen} />
        <SummaryPanel />

        {/* Celular: o painel lateral vira uma gaveta aberta pelo botão do cabeçalho. */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="gap-2 p-2 md:hidden">
            <SheetHeader className="sr-only">
              <SheetTitle>Painel lateral</SheetTitle>
              <SheetDescription>Atenção e itens do ambiente</SheetDescription>
            </SheetHeader>
            <PanelContent view={view} onViewChange={setView} />
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}

function AppHeader({ onOpenPanel }: { onOpenPanel: () => void }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [context, setContext] = React.useState(CONTEXTS[0] as (typeof CONTEXTS)[number]);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-3">
      <div
        className={`pointer-events-auto flex flex-col gap-0.5 rounded-surface px-4 py-2 ${SURFACE}`}
      >
        <LogoWordmark className="h-5 w-auto" aria-label="Multiclubes" />
        <span className="text-xs text-muted-foreground">Protótipo</span>
      </div>

      <div className="pointer-events-auto hidden flex-col items-center gap-1 sm:flex">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="secondary" className="shadow-md" />}>
            <span>01 · Ambiente</span>
            <Badge variant="secondary" className="tabular-nums">
              {context.count}
            </Badge>
            <CaretDownIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            {CONTEXTS.map((item) => (
              <DropdownMenuItem key={item.name} onClick={() => setContext(item)}>
                <span>{item.name}</span>
                <span className="ml-auto pl-4 text-xs text-muted-foreground tabular-nums">
                  {item.count}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          Layout ilustrativo
        </span>
      </div>

      <div
        className={`pointer-events-auto flex items-center gap-1 rounded-surface p-1.5 ${SURFACE}`}
      >
        <ToggleGroup
          aria-label="Visão"
          defaultValue={["3d"]}
          spacing={1}
          className="hidden rounded-field bg-muted p-1 xl:flex"
        >
          {VIEWS.map(([value, label]) => (
            <ToggleGroupItem
              key={value}
              value={value}
              size="sm"
              className="rounded-lg data-[state=on]:bg-background data-pressed:bg-background"
            >
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <InputGroup className="hidden w-48 lg:flex">
          <InputGroupAddon>
            <MagnifyingGlassIcon />
          </InputGroupAddon>
          <InputGroupInput aria-label="Buscar" placeholder="Buscar…" />
          <InputGroupAddon align="inline-end">
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <Button variant="ghost" size="icon-sm" aria-label="Filtros">
          <FunnelIcon />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Ajuda" className="hidden sm:inline-flex">
          <QuestionIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Tela cheia"
          className="hidden sm:inline-flex"
        >
          <CornersOutIcon />
        </Button>
        <ThemeToggle theme={resolvedTheme} onThemeChange={setTheme} animated={false} />
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Abrir painel lateral"
          onClick={onOpenPanel}
          className="md:hidden"
        >
          <ListIcon />
        </Button>
      </div>
    </header>
  );
}

/** Conteúdo do painel lateral: seletor do que ele mostra e a lista correspondente. */
function PanelContent({
  view,
  onViewChange,
}: {
  view: PanelView;
  onViewChange: (view: PanelView) => void;
}) {
  return (
    <>
      <ToggleGroup
        aria-label="Conteúdo do painel"
        value={[view]}
        onValueChange={(next) => {
          const value = next[0] as PanelView | undefined;
          if (value) onViewChange(value);
        }}
        spacing={1}
        className="w-full rounded-field bg-muted p-1"
      >
        <ToggleGroupItem
          value="atencao"
          size="sm"
          className="flex-1 rounded-lg data-[state=on]:bg-background data-pressed:bg-background"
        >
          Atenção (8)
        </ToggleGroupItem>
        <ToggleGroupItem
          value="itens"
          size="sm"
          className="flex-1 rounded-lg data-[state=on]:bg-background data-pressed:bg-background"
        >
          Itens (49)
        </ToggleGroupItem>
      </ToggleGroup>
      <ScrollArea className="min-h-0 flex-1">
        {view === "atencao" ? <AttentionList /> : <ItemsList />}
      </ScrollArea>
    </>
  );
}

function AttentionList() {
  return (
    <ul className="flex flex-col gap-1">
      {ATTENTION.map(({ n, title, severity, minutes }) => {
        const { icon: StatusIcon, tone } = SEVERITY[severity];
        return (
          <li key={n}>
            <Item size="xs" className="hover:bg-muted/60">
              <ItemMedia className="w-6 justify-center text-sm font-medium text-muted-foreground tabular-nums">
                {n}
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{title}</ItemTitle>
                <ItemDescription className="text-xs">5 itens · 1h11 · Responsável</ItemDescription>
              </ItemContent>
              <ItemActions>
                <StatusIcon weight="bold" className={`size-4 ${tone}`} aria-hidden />
                <span className="w-14 text-right text-sm tabular-nums">{minutes} min</span>
              </ItemActions>
            </Item>
          </li>
        );
      })}
    </ul>
  );
}

function ItemsList() {
  return (
    <ul className="flex flex-col gap-1">
      {ALL_ITEMS.map(({ n, status, count }) => (
        <li key={n}>
          <Item size="xs" className="hover:bg-muted/60">
            <ItemMedia className="w-6 justify-center text-sm font-medium text-muted-foreground tabular-nums">
              {n}
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Item {n}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Badge variant={STATUS_BADGE[status]}>{status}</Badge>
              <span className="w-12 text-right text-xs text-muted-foreground tabular-nums">
                {count} {count === 1 ? "registro" : "registros"}
              </span>
            </ItemActions>
          </Item>
        </li>
      ))}
    </ul>
  );
}

/** Trilho vertical de ferramentas: uma única pílula ao lado esquerdo do painel lateral. */
function ToolRail({ asideOpen }: { asideOpen: boolean }) {
  return (
    <div
      role="toolbar"
      aria-label="Ferramentas"
      aria-orientation="vertical"
      className={`absolute top-1/2 hidden -translate-y-1/2 flex-col gap-1 rounded-full p-1 md:flex ${SURFACE} ${asideOpen ? "right-[21.5rem]" : "right-3"}`}
    >
      {TOOLS.map(({ label, icon: ToolIcon }) => (
        <Tooltip key={label}>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label={label} />
            }
          >
            <ToolIcon />
          </TooltipTrigger>
          <TooltipContent side="left">{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

/** Resumo flutuante no canto inferior esquerdo; compacto no celular. */
function SummaryPanel() {
  return (
    <section
      aria-label="Resumo"
      className={`absolute bottom-3 left-3 flex w-80 max-w-[calc(100%-1.5rem)] flex-col gap-3 rounded-surface p-4 sm:gap-4 ${SURFACE}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
          Resumo · Ambiente
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-primary" />
          Atualizado há 0s
        </p>
      </div>
      <p className="hidden text-sm text-muted-foreground sm:block">29 em uso · 76 registros</p>
      <div className="flex items-end gap-6">
        <p className="flex items-baseline gap-1.5">
          <span className="text-5xl leading-none font-semibold tabular-nums">17</span>
          <span className="text-sm text-muted-foreground">de 49</span>
        </p>
        <dl className="ml-auto flex gap-5 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Em uso</dt>
            <dd className="font-medium tabular-nums">29</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Reservados</dt>
            <dd className="font-medium tabular-nums">3</dd>
          </div>
        </dl>
      </div>
      <Progress value={49} className="gap-2">
        <ProgressLabel>Ocupação</ProgressLabel>
        <ProgressValue>{() => "49%"}</ProgressValue>
      </Progress>
      <ToggleGroup
        aria-label="Filtro"
        defaultValue={["todos"]}
        spacing={1}
        className="hidden w-full rounded-field bg-muted p-1 sm:flex"
      >
        {[
          ["todos", "Todos"],
          ["disponiveis", "Disponíveis"],
          ["atencao", "Atenção (8)"],
        ].map(([value, label]) => (
          <ToggleGroupItem
            key={value}
            value={value}
            size="sm"
            className="flex-1 rounded-lg data-[state=on]:bg-background data-pressed:bg-background"
          >
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ul className="hidden grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground sm:grid">
        {LEGEND.map(([label, count]) => (
          <li key={label} className="flex items-center gap-1.5">
            <span aria-hidden className={`size-2 rounded-full ${STATUS_DOT[label]}`} />
            {label}
            <span className="ml-auto tabular-nums">{count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
