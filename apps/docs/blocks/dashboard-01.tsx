"use client";

import { Avatar, AvatarFallback } from "@multiclubes/ui/components/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@multiclubes/ui/components/dropdown-menu";
import { Kbd } from "@multiclubes/ui/components/kbd";
import { Separator } from "@multiclubes/ui/components/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@multiclubes/ui/components/sidebar";
import {
  CaretDownIcon,
  CaretRightIcon,
  CaretUpDownIcon,
  type Icon,
  ListIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  ScanSmileyIcon,
  SignOutIcon,
  SquaresFourIcon,
  StorefrontIcon,
  SunIcon,
  TicketIcon,
  UserIcon,
  UserSoundIcon,
  XIcon,
} from "@phosphor-icons/react";
import { cn } from "cn";
import { useTheme } from "next-themes";
import type * as React from "react";
import { LogoMark, LogoWordmark } from "@/components/logo";

// Aside do Dashboard, versão em que a página vira um cartão sobre o fundo do aside.
// Dados ilustrativos.
const USER = { name: "Usuário", email: "usuario@exemplo.com", initials: "US" };

type NavItem = {
  title: string;
  url: string;
  icon: Icon;
  active?: boolean;
  items?: { title: string; url: string }[];
};

const NAV: NavItem[] = [
  { title: "Visão Geral", url: "#visao-geral", icon: SquaresFourIcon, active: true },
  { title: "Acessos", url: "#acessos", icon: ScanSmileyIcon },
  {
    title: "Consumo",
    url: "#consumo",
    icon: StorefrontIcon,
    items: [
      { title: "Curva ABC", url: "#curva-abc" },
      { title: "Mais vendidos", url: "#mais-vendidos" },
    ],
  },
  { title: "Ingressos", url: "#ingressos", icon: TicketIcon },
  { title: "Promotores", url: "#promotores", icon: UserSoundIcon },
];

// O aside tem dois estados, selecionado e não selecionado. O hover pintaria um terceiro,
// que numa lista curta lê como "meio selecionado".
const NO_HOVER = "hover:bg-transparent hover:text-sidebar-foreground";
const ACTIVE = "data-active:bg-primary data-active:text-primary-foreground";

export default function Dashboard01() {
  return (
    // O fundo do provider é a cor do aside: é ele que aparece na folga em volta da página.
    <SidebarProvider className="bg-sidebar">
      <AppSidebar />
      <InsetShell>
        <AppHeader />
        {/* Moldes no lugar do conteúdo. */}
        <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {["a", "b", "c", "d"].map((card) => (
              <div key={card} className="h-32 rounded-surface bg-muted/50" />
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="aspect-video rounded-surface bg-muted/50 lg:col-span-2" />
            <div className="aspect-video rounded-surface bg-muted/50" />
          </div>
          <div className="min-h-96 flex-1 rounded-surface bg-muted/50" />
        </main>
      </InsetShell>
    </SidebarProvider>
  );
}

/**
 * Casca da página. Com o aside aberto no desktop, a página vira um cartão apoiado sobre o
 * fundo do aside, com uma folga nas laterais e embaixo. Fechado, ou no celular (em que o
 * aside é uma gaveta), ela volta a encostar nas bordas.
 */
function InsetShell({ className, ...props }: React.ComponentProps<"div">) {
  const { state, isMobile } = useSidebar();
  const inset = !isMobile && state === "expanded";

  return (
    <div
      data-inset={inset ? "on" : "off"}
      className={cn(
        "relative flex min-h-svh w-full flex-1 flex-col bg-background transition-[margin,border-radius] duration-200 ease-linear motion-reduce:transition-none",
        inset &&
          "mx-2 mb-2 min-h-[calc(100svh-0.5rem)] overflow-hidden rounded-surface border border-sidebar-border shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function AppSidebar() {
  return (
    // Sem a borda do aside: quem separa o aside da página é a folga em volta do cartão.
    <Sidebar collapsible="icon" className="group-data-[side=left]:border-r-0">
      <SidebarHeader className="relative">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              aria-label="Multiclubes, início"
              className={NO_HOVER}
              render={<a href="#visao-geral" />}
            >
              {/* Aberto mostra a logo com o nome; recolhido em ícones, só o "m". */}
              <LogoWordmark className="h-6! w-auto! shrink-0 group-data-[collapsible=icon]:hidden" />
              <LogoMark className="hidden size-7! shrink-0 group-data-[collapsible=icon]:block" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarCloseButton />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {NAV.map((item) =>
              item.items ? (
                <NavGroup key={item.title} item={item} />
              ) : (
                <NavLink key={item.title} item={item} />
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu variant="sidebar" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function NavLink({ item }: { item: NavItem }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={item.active}
        tooltip={item.title}
        className={cn(ACTIVE, !item.active && NO_HOVER)}
        render={<a href={item.url} />}
      >
        {/* O ícone do item ativo fica preenchido, os outros em negrito. */}
        <item.icon weight={item.active ? "fill" : "bold"} />
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/**
 * Item com subpáginas. A linha continua sendo um link para a página do item; quem abre e
 * fecha as subpáginas é a seta ao lado.
 */
function NavGroup({ item }: { item: NavItem }) {
  return (
    <Collapsible className="group/collapsible">
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={item.active}
          tooltip={item.title}
          className={cn(ACTIVE, !item.active && NO_HOVER)}
          render={<a href={item.url} />}
        >
          <item.icon weight={item.active ? "fill" : "bold"} />
          <span>{item.title}</span>
        </SidebarMenuButton>
        <CollapsibleTrigger
          render={
            <SidebarMenuAction
              aria-label={`Subpáginas de ${item.title}`}
              className="transition-transform group-data-open/collapsible:rotate-90"
            />
          }
        >
          <CaretRightIcon />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((sub) => (
              <SidebarMenuSubItem key={sub.title}>
                <SidebarMenuSubButton className={NO_HOVER} render={<a href={sub.url} />}>
                  <span>{sub.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

/**
 * No tablet o aside aberto fica por cima do conteúdo e cobre o botão do header. Este botão
 * aparece só com o aside aberto e abaixo de lg, para fechar sem depender do atalho.
 */
function SidebarCloseButton() {
  const { setOpen } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label="Fechar menu"
      onClick={() => setOpen(false)}
      className="absolute top-2 right-2 z-20 hidden max-lg:group-data-[state=expanded]:flex"
    >
      <XIcon />
    </Button>
  );
}

function AppHeader() {
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <header className="relative z-10 h-14 w-full shrink-0 border-b bg-background">
      {/* Celular: tema, logo no centro e o menu. A grade de 3 colunas mantém a logo centrada. */}
      <div className="grid h-full grid-cols-3 items-center px-4 md:hidden">
        <div className="flex justify-start">
          <ThemeButton />
        </div>
        <a href="#visao-geral" className="flex justify-center" aria-label="Início">
          <LogoMark className="size-7" />
        </a>
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            aria-label={openMobile ? "Fechar menu" : "Abrir menu"}
            aria-expanded={openMobile}
            onClick={() => setOpenMobile(!openMobile)}
          >
            {openMobile ? <XIcon /> : <ListIcon />}
          </Button>
        </div>
      </div>
      {/* Desktop e tablet: o botão de abrir e fechar o aside, caminho, busca, tema e perfil. */}
      <div className="hidden h-full items-center gap-3 px-4 sm:px-6 md:flex">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb className="min-w-0 flex-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Visão Geral</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant="outline"
          size="sm"
          className="w-56 justify-start font-normal text-muted-foreground"
        >
          <MagnifyingGlassIcon data-icon="inline-start" />
          Buscar...
          <Kbd className="ml-auto">Ctrl K</Kbd>
        </Button>
        <ThemeButton />
        <Separator orientation="vertical" className="data-[orientation=vertical]:h-5" />
        <UserMenu variant="header" />
      </div>
    </header>
  );
}

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Alternar tema"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Os dois ícones ficam no DOM e o CSS escolhe: sem diferença de hidratação. */}
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
    </Button>
  );
}

/** Menu do usuário: linha completa no rodapé do aside, avatar com seta no header. */
function UserMenu({ variant }: { variant: "sidebar" | "header" }) {
  const { isMobile } = useSidebar();
  const inSidebar = variant === "sidebar";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          inSidebar ? (
            <SidebarMenuButton size="lg" tooltip={USER.name} />
          ) : (
            <Button variant="ghost" className="h-9 gap-1.5 px-1" aria-label="Menu do usuário" />
          )
        }
      >
        <Avatar className={inSidebar ? "size-8" : "size-7"}>
          <AvatarFallback className="text-xs font-semibold">{USER.initials}</AvatarFallback>
        </Avatar>
        {inSidebar ? (
          <>
            <span className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{USER.name}</span>
              <span className="truncate text-xs text-muted-foreground">{USER.email}</span>
            </span>
            <CaretUpDownIcon className="ml-auto size-4" />
          </>
        ) : (
          <CaretDownIcon className="size-3 text-muted-foreground" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={inSidebar && !isMobile ? "right" : "bottom"}
        align="end"
        sideOffset={8}
        className="min-w-56"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="font-medium text-foreground">{USER.name}</span>
            <span className="font-normal">{USER.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {!inSidebar && (
          <>
            <DropdownMenuItem>
              <UserIcon />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem variant="destructive">
          <SignOutIcon />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
