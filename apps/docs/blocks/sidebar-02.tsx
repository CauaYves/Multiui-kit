"use client";

import { Avatar, AvatarFallback } from "@multiclubes/ui/components/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@multiclubes/ui/components/dropdown-menu";
import { Kbd } from "@multiclubes/ui/components/kbd";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@multiclubes/ui/components/sidebar";
import { ThemeToggle } from "@multiclubes/ui/components/theme-toggle";
import {
  CaretDownIcon,
  CaretRightIcon,
  CaretUpDownIcon,
  type Icon,
  ListIcon,
  MagnifyingGlassIcon,
  SignOutIcon,
  SquaresFourIcon,
  UserIcon,
  XIcon,
} from "@phosphor-icons/react";
import { cn } from "cn";
import { useTheme } from "next-themes";
import * as React from "react";
import { LogoMark, LogoWordmark } from "@/components/logo";

// Casca de aplicação: o aside e o header, que dependem um do outro pelo SidebarProvider
// (o header abre e fecha o aside). Versão em que a página fica encostada no aside
// (SidebarInset).
// Dados ilustrativos.
const USER = { name: "Usuário", email: "usuario@exemplo.com", initials: "US" };

type NavItem = {
  title: string;
  url: string;
  items?: { title: string; url: string }[];
};

// Rotas genéricas: o bloco mostra a estrutura do aside, não as páginas de um produto.
// Todas têm o mesmo nome e o mesmo ícone, e só a última tem subpáginas.
const NAV_ICON: Icon = SquaresFourIcon;

const NAV: NavItem[] = [
  { title: "Route", url: "#route-1" },
  { title: "Route", url: "#route-2" },
  { title: "Route", url: "#route-3" },
  { title: "Route", url: "#route-4" },
  {
    title: "Route",
    url: "#route-5",
    items: [
      { title: "Page", url: "#page-1" },
      { title: "Page", url: "#page-2" },
    ],
  },
];

/** A rota de uma URL e, se ela for de uma subpágina, a página. */
function findRoute(url: string) {
  for (const route of NAV) {
    if (route.url === url) return { route };
    const page = route.items?.find((item) => item.url === url);
    if (page) return { route, page };
  }
  return { route: NAV[0] };
}

/** A rota selecionada, que o aside marca e o header mostra no breadcrumb. */
type NavProps = { active: string; onSelect: (url: string) => void };

/**
 * Seleciona uma rota pelo clique. As rotas são de exemplo, então o link não navega: só
 * troca a seleção. No celular, escolher uma rota também fecha a gaveta.
 */
function useSelectRoute(onSelect: NavProps["onSelect"]) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (url: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    onSelect(url);
    if (isMobile) setOpenMobile(false);
  };
}

// O item selecionado é azul também sob o mouse e no clique: o botão do kit tem hover e
// active próprios (bg-sidebar-accent), que no CSS venceriam o data-active e deixariam o item
// recém-clicado cinza até o mouse sair dele. Por isso o "!".
const ACTIVE = "data-active:bg-primary! data-active:text-primary-foreground!";

export default function Sidebar02() {
  // A rota selecionada fica acima do aside e do header: o aside marca o item e o header
  // mostra o caminho no breadcrumb.
  const [active, setActive] = React.useState(NAV[0].url);

  return (
    <SidebarProvider>
      <AppSidebar active={active} onSelect={setActive} />
      {/* A página ocupa a altura da tela e não rola. */}
      <SidebarInset className="h-svh overflow-hidden">
        <AppHeader active={active} onSelect={setActive} />
        {/* Moldes no lugar do conteúdo. Cabem na altura da tela: as duas últimas linhas
            dividem o espaço que sobra abaixo dos cartões. */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6">
          <div className="grid shrink-0 grid-cols-2 gap-4 xl:grid-cols-4">
            {["a", "b", "c", "d"].map((card) => (
              <div key={card} className="h-32 rounded-surface bg-muted/50" />
            ))}
          </div>
          <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-3">
            <div className="rounded-surface bg-muted/50 lg:col-span-2" />
            <div className="rounded-surface bg-muted/50" />
          </div>
          <div className="min-h-0 flex-1 rounded-surface bg-muted/50" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppSidebar({ active, onSelect }: NavProps) {
  const select = useSelectRoute(onSelect);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="relative">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              aria-label="Multiclubes, início"
              className="justify-center"
              render={<a href={NAV[0].url} onClick={select(NAV[0].url)} />}
            >
              {/* Aberto mostra a logo com o nome; recolhido em ícones, só o "m". Nos dois
                  casos a logo fica centrada no aside. */}
              <LogoWordmark className="h-6! w-auto! shrink-0 group-data-[collapsible=icon]:hidden" />
              <LogoMark className="hidden size-7! shrink-0 group-data-[collapsible=icon]:block" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarCloseButton />
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <SidebarGroup>
          <SidebarMenu>
            {NAV.map((item) =>
              item.items ? (
                <NavGroup key={item.url} item={item} active={active} onSelect={onSelect} />
              ) : (
                <NavLink key={item.url} item={item} active={active} onSelect={onSelect} />
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
    </Sidebar>
  );
}

function NavLink({ item, active, onSelect }: { item: NavItem } & NavProps) {
  const select = useSelectRoute(onSelect);
  const isActive = active === item.url;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={item.title}
        className={ACTIVE}
        render={<a href={item.url} onClick={select(item.url)} />}
      >
        {/* O ícone do item ativo fica preenchido, os outros em negrito. */}
        <NAV_ICON weight={isActive ? "fill" : "bold"} />
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/**
 * Item com subpáginas. A linha continua sendo um link para a página do item; quem abre e
 * fecha as subpáginas é a seta ao lado.
 */
function NavGroup({ item, active, onSelect }: { item: NavItem } & NavProps) {
  const select = useSelectRoute(onSelect);
  const isActive = active === item.url;

  return (
    // Começa aberto quando a página selecionada é uma das subpáginas.
    <Collapsible
      className="group/collapsible"
      defaultOpen={item.items?.some((page) => page.url === active)}
    >
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isActive}
          tooltip={item.title}
          className={ACTIVE}
          render={<a href={item.url} onClick={select(item.url)} />}
        >
          <NAV_ICON weight={isActive ? "fill" : "bold"} />
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
              <SidebarMenuSubItem key={sub.url}>
                <SidebarMenuSubButton
                  isActive={active === sub.url}
                  render={<a href={sub.url} onClick={select(sub.url)} />}
                >
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
 * Botão de fechar o aside abaixo de lg. No tablet, o aside aberto fica por cima do conteúdo
 * e cobre o botão do header; no celular, o aside é uma gaveta e o overlay cobre o botão de
 * menu do header. Nos dois casos, este botão fecha sem depender do atalho. No desktop, e
 * com o aside recolhido em ícones, ele não aparece.
 */
function SidebarCloseButton() {
  const { isMobile, setOpen, setOpenMobile } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Fechar menu"
      onClick={() => (isMobile ? setOpenMobile(false) : setOpen(false))}
      className={cn(
        "absolute top-1/2 right-2 z-20 -translate-y-1/2",
        !isMobile && "hidden max-lg:group-data-[state=expanded]:flex",
      )}
    >
      <XIcon />
    </Button>
  );
}

function AppHeader({ active, onSelect }: NavProps) {
  const { openMobile, setOpenMobile } = useSidebar();
  const select = useSelectRoute(onSelect);
  const { route, page } = findRoute(active);

  return (
    <header className="relative z-10 h-14 w-full shrink-0 bg-background">
      {/* Celular: tema, logo no centro e o menu. A grade de 3 colunas mantém a logo centrada. */}
      <div className="grid h-full grid-cols-3 items-center px-4 md:hidden">
        <div className="flex justify-start">
          <ThemeButton />
        </div>
        <a
          href={NAV[0].url}
          onClick={select(NAV[0].url)}
          className="flex justify-center"
          aria-label="Início"
        >
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
            {/* Numa subpágina, a rota vira um link de volta e a página é o item atual. */}
            <BreadcrumbItem>
              {page ? (
                <BreadcrumbLink render={<a href={route.url} onClick={select(route.url)} />}>
                  {route.title}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{route.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {page && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{page.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
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
        <UserMenu variant="header" />
      </div>
    </header>
  );
}

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();

  // Nos blocos a troca é direta, sem a animação do site.
  return <ThemeToggle theme={resolvedTheme} onThemeChange={setTheme} animated={false} />;
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
