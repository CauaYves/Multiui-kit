"use client";

import { Button } from "@multiclubes/ui/components/button";
import { Separator } from "@multiclubes/ui/components/separator";
import { Tabs, TabsList, TabsTrigger } from "@multiclubes/ui/components/tabs";
import { ToggleGroup, ToggleGroupItem } from "@multiclubes/ui/components/toggle-group";
import {
  ArrowClockwiseIcon,
  ArrowsOutIcon,
  CaretDownIcon,
  DesktopIcon,
  DeviceMobileIcon,
  DeviceTabletIcon,
  FileIcon,
  FolderOpenIcon,
} from "@phosphor-icons/react";
import * as React from "react";
import type { Block } from "@/blocks";

const VIEWPORTS = [
  { value: "desktop", label: "Desktop", icon: DesktopIcon, width: "100%" },
  { value: "tablet", label: "Tablet", icon: DeviceTabletIcon, width: "48rem" },
  { value: "mobile", label: "Celular", icon: DeviceMobileIcon, width: "24rem" },
];

/** Um bloco em /blocks, no formato do shadcn: barra de ferramentas, prévia e código. */
export function BlockViewer({
  block,
  file,
  code,
}: {
  block: Block;
  /** Caminho do arquivo mostrado na árvore da aba de código. */
  file: string;
  code: React.ReactNode;
}) {
  const [view, setView] = React.useState("preview");
  const [viewport, setViewport] = React.useState("desktop");
  // Trocar a key recria o iframe, que recarrega a prévia.
  const [reloads, setReloads] = React.useState(0);
  const width = VIEWPORTS.find((entry) => entry.value === viewport)?.width ?? "100%";

  return (
    <section id={block.name} className="flex scroll-mt-24 flex-col gap-4">
      <div className="flex items-center gap-2">
        <Tabs value={view} onValueChange={(next) => setView(String(next))}>
          <TabsList>
            <TabsTrigger value="preview">Prévia</TabsTrigger>
            <TabsTrigger value="code">Código</TabsTrigger>
          </TabsList>
        </Tabs>
        <Separator
          orientation="vertical"
          className="mx-2 hidden data-[orientation=vertical]:h-4 sm:block"
        />
        <a
          href={`#${block.name}`}
          className="min-w-0 flex-1 truncate text-sm font-medium underline-offset-4 hover:underline"
        >
          {block.description}
        </a>
        <div className="ml-auto hidden items-center gap-1.5 lg:flex">
          <ToggleGroup
            size="sm"
            aria-label="Largura da prévia"
            value={[viewport]}
            onValueChange={(next) => {
              if (!next[0]) return;
              setViewport(next[0]);
              setView("preview");
            }}
            className="rounded-field border p-0.5"
          >
            {VIEWPORTS.map(({ value, label, icon: Icon }) => (
              <ToggleGroupItem
                key={value}
                value={value}
                aria-label={label}
                title={label}
                className="size-7 min-w-7 px-0"
              >
                <Icon />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            aria-label="Abrir em nova aba"
            title="Abrir em nova aba"
            render={<a href={`/view/${block.name}`} target="_blank" rel="noreferrer" />}
          >
            <ArrowsOutIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Recarregar a prévia"
            title="Recarregar a prévia"
            onClick={() => {
              setReloads((count) => count + 1);
              setView("preview");
            }}
          >
            <ArrowClockwiseIcon />
          </Button>
        </div>
      </div>
      {view === "preview" ? (
        <div className="overflow-hidden rounded-surface border bg-muted/40">
          <div
            data-viewport={viewport}
            className="mx-auto h-[min(57rem,85svh)] max-w-full min-w-80 resize-x overflow-hidden bg-background transition-[width] duration-300 not-data-[viewport=desktop]:border-x"
            style={{ width }}
          >
            <iframe
              key={reloads}
              src={`/view/${block.name}`}
              title={block.description}
              loading="lazy"
              className="size-full"
            />
          </div>
        </div>
      ) : (
        <div className="flex h-[min(57rem,85svh)] overflow-hidden rounded-surface border">
          {/* Aside com a árvore de arquivos do bloco. */}
          <aside className="hidden w-64 shrink-0 flex-col gap-2 border-r bg-sidebar p-2 text-sidebar-foreground md:flex">
            <p className="px-2 pt-1 text-xs font-medium text-muted-foreground">Arquivos</p>
            <FileTree path={file} />
          </aside>
          <div className="min-w-0 flex-1 overflow-auto [&_figure]:m-0 [&_pre]:max-h-none">
            <div className="sticky top-0 z-10 flex h-10 items-center gap-2 border-b bg-background px-4 text-sm">
              <FileIcon className="size-4 text-muted-foreground" />
              {file}
            </div>
            {code}
          </div>
        </div>
      )}
    </section>
  );
}

/** Árvore de um caminho ("blocks/dashboard-01.tsx"): pastas abertas e o arquivo ativo. */
function FileTree({ path }: { path: string }) {
  const parts = path.split("/");
  const fileName = parts.pop() ?? path;

  return (
    <ul className="flex flex-col gap-0.5 text-sm">
      {parts.map((folder, depth) => (
        <li
          key={folder}
          className="flex h-8 items-center gap-1.5 rounded-item px-2"
          style={{ paddingLeft: `${0.5 + depth}rem` }}
        >
          <CaretDownIcon className="size-3.5 text-muted-foreground" />
          <FolderOpenIcon className="size-4" />
          {folder}
        </li>
      ))}
      <li
        aria-current="true"
        className="flex h-8 items-center gap-1.5 rounded-item bg-sidebar-accent px-2 font-medium text-sidebar-accent-foreground"
        style={{ paddingLeft: `${1.5 + parts.length}rem` }}
      >
        <FileIcon className="size-4" />
        {fileName}
      </li>
    </ul>
  );
}
