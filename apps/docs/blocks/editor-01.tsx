"use client";

import { Avatar, AvatarFallback, AvatarGroup } from "@multiclubes/ui/components/avatar";
import { Button } from "@multiclubes/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@multiclubes/ui/components/collapsible";
import { NativeSelect, NativeSelectOption } from "@multiclubes/ui/components/native-select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
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
import { Tabs, TabsList, TabsTrigger } from "@multiclubes/ui/components/tabs";
import { Textarea } from "@multiclubes/ui/components/textarea";
import {
  ArrowUpIcon,
  BookOpenIcon,
  CaretRightIcon,
  ClockCounterClockwiseIcon,
  CursorIcon,
  DotsThreeIcon,
  FolderIcon,
  GearIcon,
  type Icon,
  LayoutIcon,
  PlusIcon,
  SidebarSimpleIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react";
import * as React from "react";

// Casca de um app de edição: sidebar com projetos e uma caixa de comandos no rodapé, barra
// de ferramentas no topo e um canvas de pontos ocupando o resto.
// Dados ilustrativos.
const SUBPAGES = ["Histórico", "Favoritos", "Ajustes"];
const NAV_EXTRA: { title: string; icon: Icon }[] = [
  { title: "Modelos", icon: LayoutIcon },
  { title: "Documentação", icon: BookOpenIcon },
  { title: "Ajustes", icon: GearIcon },
];
const PROJECTS = ["Projeto A", "Projeto B", "Projeto C"];
const PEOPLE = ["A", "M", "Y"];

export default function Editor01() {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* A página ocupa a altura da tela e não rola. */}
      <SidebarInset className="h-svh overflow-hidden">
        <EditorHeader />
        <div className="flex min-h-0 flex-1 p-2 pt-0">
          {/* Canvas: superfície clara com fundo de pontos discretos. */}
          <div
            aria-label="Canvas"
            role="img"
            className="min-w-0 flex-1 rounded-surface bg-muted/60 bg-[radial-gradient(circle,color-mix(in_oklch,var(--foreground)_18%,transparent)_1px,transparent_1px)] bg-size-[20px_20px]"
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
          <span className="truncate px-2 text-sm font-semibold group-data-[collapsible=icon]:hidden">
            projeto-exemplo
          </span>
          <SidebarTrigger aria-label="Recolher painel" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Área de trabalho" render={<a href="#area" />}>
                  <SquaresFourIcon weight="bold" />
                  <span>Área de trabalho</span>
                </SidebarMenuButton>
                <CollapsibleTrigger
                  render={
                    <SidebarMenuAction
                      aria-label="Subpáginas de Área de trabalho"
                      className="transition-transform group-data-open/collapsible:rotate-90"
                    />
                  }
                >
                  <CaretRightIcon />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {SUBPAGES.map((title) => (
                      <SidebarMenuSubItem key={title}>
                        <SidebarMenuSubButton render={<a href={`#${title}`} />}>
                          <span>{title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
            {NAV_EXTRA.map(({ title, icon: ItemIcon }) => (
              <Collapsible key={title} className="group/collapsible">
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip={title} render={<a href={`#${title}`} />}>
                    <ItemIcon weight="bold" />
                    <span>{title}</span>
                  </SidebarMenuButton>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuAction
                        aria-label={`Subpáginas de ${title}`}
                        className="transition-transform group-data-open/collapsible:rotate-90"
                      />
                    }
                  >
                    <CaretRightIcon />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton render={<a href={`#${title}-1`} />}>
                          <span>Página</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Projetos</SidebarGroupLabel>
          <SidebarMenu>
            {PROJECTS.map((name) => (
              <SidebarMenuItem key={name}>
                <SidebarMenuButton tooltip={name} render={<a href={`#${name}`} />}>
                  <FolderIcon weight="bold" />
                  <span>{name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Mais" className="text-muted-foreground">
                <DotsThreeIcon weight="bold" />
                <span>Mais</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {/* Em ícones a caixa de comandos some: não cabe na faixa estreita. */}
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <CommandBox />
      </SidebarFooter>
    </Sidebar>
  );
}

/** Caixa de entrada de comandos: texto, anexar, nível e enviar. */
function CommandBox() {
  const [value, setValue] = React.useState("");

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="flex flex-col gap-2 rounded-item border bg-background p-2"
    >
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="Comando"
        placeholder="Digite ou use / para comandos"
        className="min-h-12 border-0 px-1 py-1 text-sm focus-visible:ring-0"
      />
      <div className="flex items-center gap-1">
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Adicionar">
          <PlusIcon />
        </Button>
        <NativeSelect size="sm" aria-label="Nível" defaultValue="alto" className="ml-auto w-24">
          <NativeSelectOption value="alto">Alto</NativeSelectOption>
          <NativeSelectOption value="medio">Médio</NativeSelectOption>
          <NativeSelectOption value="baixo">Baixo</NativeSelectOption>
        </NativeSelect>
        <Button
          type="submit"
          size="icon-sm"
          className="rounded-full"
          aria-label="Enviar"
          disabled={!value.trim()}
        >
          <ArrowUpIcon weight="bold" />
        </Button>
      </div>
    </form>
  );
}

function EditorHeader() {
  const { isMobile } = useSidebar();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 px-3">
      {/* Celular: o painel é uma gaveta e este botão a abre. */}
      {isMobile && <SidebarTrigger aria-label="Abrir menu" />}
      <Tabs defaultValue="edicao">
        <TabsList>
          <TabsTrigger value="previa">Prévia</TabsTrigger>
          <TabsTrigger value="edicao">Edição</TabsTrigger>
          <TabsTrigger value="codigo">Código</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Ferramentas no centro da barra. */}
      <div className="flex flex-1 justify-center">
        <div className="flex items-center gap-1 rounded-full bg-muted p-1">
          <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="Adicionar">
            <PlusIcon />
          </Button>
          <Button
            variant="secondary"
            size="icon-sm"
            className="rounded-full bg-background"
            aria-label="Ponteiro"
            aria-pressed
          >
            <CursorIcon weight="fill" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="Histórico">
            <ClockCounterClockwiseIcon />
          </Button>
        </div>
      </div>
      <AvatarGroup className="hidden md:flex">
        {PEOPLE.map((initial) => (
          <Avatar key={initial}>
            <AvatarFallback className="text-xs font-semibold">{initial}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
      <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
        Compartilhar
      </Button>
      <Button size="sm">Exportar</Button>
      <Button variant="ghost" size="icon-sm" aria-label="Alternar painel">
        <SidebarSimpleIcon className="-scale-x-100" />
      </Button>
    </header>
  );
}
