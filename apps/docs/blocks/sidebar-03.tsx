"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@multiclubes/ui/components/breadcrumb";
import { Button } from "@multiclubes/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@multiclubes/ui/components/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@multiclubes/ui/components/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@multiclubes/ui/components/input-group";
import { Kbd } from "@multiclubes/ui/components/kbd";
import { Popover, PopoverContent, PopoverTrigger } from "@multiclubes/ui/components/popover";
import { Separator } from "@multiclubes/ui/components/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@multiclubes/ui/components/sidebar";
import { ThemeToggle } from "@multiclubes/ui/components/theme-toggle";
import {
  ArrowsInIcon,
  ArrowsOutIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpDownIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  SlidersHorizontalIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react";
import { cn } from "cn";
import { useTheme } from "next-themes";
import * as React from "react";
import { LogoMark, LogoWordmark } from "@/components/logo";

// Casca de aplicação com aside de altura inteira (variante inset): no topo a marca e um
// seletor no formato do team switcher; abaixo, dois grupos de rotas (o segundo com
// contagens) e um grupo recolhível, que vira popover quando o aside está em ícones. À
// direita, o cabeçalho com breadcrumb, busca, tema e tela cheia, uma faixa de números e a
// área de trabalho ao lado de um painel que recolhe para um trilho de 56px.
// Rotas e conteúdo genéricos: o bloco mostra a estrutura, não um produto.

const WORKSPACES = ["Workspace", "Workspace", "Workspace"];

const ROUTES = ["#route-1", "#route-2", "#route-3"];
const FOOTER_ROUTE = "#route-footer";
const FILTERS = [
  { url: "#filter-1", count: 24 },
  { url: "#filter-2", count: 18 },
  { url: "#filter-3", count: 6 },
];

const index = (i: number) => String(i + 1).padStart(2, "0");

export default function Sidebar03() {
  const [active, setActive] = React.useState(ROUTES[0] ?? "");

  return (
    <SidebarProvider className="h-svh min-h-0">
      <AppSidebar active={active} onSelect={setActive} />
      <SidebarInset className="min-h-0 min-w-0 overflow-hidden max-lg:m-0 max-lg:rounded-none max-lg:shadow-none">
        <Header />
        <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid shrink-0 grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((card) => (
              <div key={card} className="h-20 rounded-xl bg-muted/50" />
            ))}
          </div>
          <div className="flex min-h-0 flex-1 gap-4">
            <div className="min-w-0 flex-1 rounded-xl bg-muted/50" />
            <Panel />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppSidebar({ active, onSelect }: { active: string; onSelect: (url: string) => void }) {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const [groupOpen, setGroupOpen] = React.useState(false);
  const collapsed = state === "collapsed" && !isMobile;

  // As rotas são de exemplo: o link não navega, só troca a seleção. No celular o aside é
  // uma folha e sai da frente depois da escolha.
  const select = (url: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    onSelect(url);
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Marca em uma cor só. Aberto: a logo com o nome; recolhido em ícones, só o "m". */}
            <SidebarMenuButton
              size="lg"
              aria-label="Início"
              render={<a href="#route-1" />}
              className="hover:bg-transparent active:bg-transparent"
            >
              <LogoWordmark className="h-6! w-auto! shrink-0 text-foreground group-data-[collapsible=icon]:hidden" />
              <LogoMark className="hidden size-7! shrink-0 text-foreground group-data-[collapsible=icon]:block" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <WorkspaceSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Group</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ROUTES.map((url) => (
                <SidebarMenuItem key={url}>
                  <SidebarMenuButton
                    isActive={active === url}
                    tooltip="Route"
                    render={<a href={url} onClick={select(url)} />}
                  >
                    <SquaresFourIcon />
                    <span>Route</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Group</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {FILTERS.map(({ url, count }) => (
                <SidebarMenuItem key={url}>
                  <SidebarMenuButton
                    isActive={active === url}
                    tooltip={`Route (${count})`}
                    render={<a href={url} onClick={select(url)} />}
                  >
                    <SquaresFourIcon />
                    <span>Route</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge className="font-mono tabular-nums">{count}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recolhido em ícones não há espaço para o conteúdo do grupo: ele abre num popover. */}
        {collapsed ? (
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <Popover>
                  <PopoverTrigger render={<SidebarMenuButton tooltip="Group" />}>
                    <SlidersHorizontalIcon />
                    <span>Group</span>
                  </PopoverTrigger>
                  <PopoverContent side="right" align="start" className="w-64">
                    <GroupContent />
                  </PopoverContent>
                </Popover>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        ) : (
          <Collapsible
            open={groupOpen}
            onOpenChange={setGroupOpen}
            render={<SidebarGroup />}
            className="group/collapsible"
          >
            <SidebarGroupLabel render={<CollapsibleTrigger />} className="w-full justify-between">
              Group
              <CaretRightIcon className="transition-transform group-data-panel-open/collapsible:rotate-90" />
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent className="px-2">
                <GroupContent />
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={active === FOOTER_ROUTE}
              tooltip="Route"
              render={<a href={FOOTER_ROUTE} onClick={select(FOOTER_ROUTE)} />}
            >
              <SquaresFourIcon />
              <span>Route</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

/** Conteúdo vazio do grupo recolhível: o mesmo serve o grupo aberto e o popover. */
function GroupContent() {
  return (
    <div className="flex flex-col gap-2 py-1">
      <div className="h-8 rounded-lg bg-muted/50" />
      <div className="h-8 rounded-lg bg-muted/50" />
      <div className="h-8 rounded-lg bg-muted/50" />
    </div>
  );
}

/** Seletor no topo do aside, no formato do team switcher do shadcn. */
function WorkspaceSwitcher() {
  const { isMobile } = useSidebar();
  const [active, setActive] = React.useState(0);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                tooltip="Workspace"
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
              />
            }
          >
            <span
              aria-hidden
              className="flex aspect-square size-8 flex-none items-center justify-center rounded-lg bg-foreground font-mono text-xs font-semibold text-background tabular-nums"
            >
              {index(active)}
            </span>
            <span className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate text-sm font-semibold">Workspace</span>
              <span className="truncate text-xs text-muted-foreground">Description</span>
            </span>
            <CaretUpDownIcon aria-hidden className="ml-auto flex-none" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={8}
            className="max-w-[calc(100vw-2rem)] min-w-64"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              {WORKSPACES.map((name, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: os itens de exemplo têm o mesmo nome.
                <DropdownMenuItem key={i} onClick={() => setActive(i)} className="min-h-10 gap-3">
                  <span
                    aria-hidden
                    className="w-5 flex-none font-mono text-xs text-muted-foreground"
                  >
                    {index(i)}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{name}</span>
                  <span aria-hidden className="grid size-4 flex-none place-items-center">
                    {i === active && <CheckIcon className="size-4" />}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

/** Cabeçalho da página: só dentro do SidebarInset, à direita do aside, nunca por cima dele. */
function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [fullscreen, setFullscreen] = React.useState(false);

  React.useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex min-w-0 flex-1 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" aria-label="Alternar menu lateral" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem className="hidden md:block">Route</BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-none items-center gap-1 px-4">
        <InputGroup className="mr-1 hidden w-56 md:flex">
          <InputGroupInput placeholder="Buscar..." aria-label="Buscar" />
          <InputGroupAddon>
            <MagnifyingGlassIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
        {/* Nos blocos a troca de tema é direta, sem a animação do site. */}
        <ThemeToggle theme={resolvedTheme} onThemeChange={setTheme} animated={false} />
        <Button
          variant="ghost"
          size="icon"
          aria-label={fullscreen ? "Sair da tela cheia" : "Tela cheia"}
          onClick={toggleFullscreen}
        >
          {fullscreen ? <ArrowsInIcon /> : <ArrowsOutIcon />}
        </Button>
      </div>
    </header>
  );
}

/** Painel à direita da área de trabalho. Recolhido, vira um trilho de 56px. */
function Panel() {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      aria-label="Painel"
      className={cn(
        "relative hidden h-full flex-none flex-col overflow-hidden rounded-xl border bg-card transition-[width] duration-200 ease-out motion-reduce:transition-none lg:flex",
        collapsed ? "w-14" : "w-65 xl:w-73",
      )}
    >
      {collapsed ? (
        <div className="flex flex-col items-center py-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Expandir painel"
            aria-expanded={false}
            onClick={() => setCollapsed(false)}
          >
            <CaretLeftIcon />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
            <span className="text-sm font-medium">Panel</span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Recolher painel"
              aria-expanded
              onClick={() => setCollapsed(true)}
            >
              <CaretRightIcon />
            </Button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="h-12 rounded-lg bg-muted/50" />
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
