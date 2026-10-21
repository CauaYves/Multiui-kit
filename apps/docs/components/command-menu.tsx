"use client";

import { Button } from "@multiclubes/ui/components/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@multiclubes/ui/components/command";
import { Kbd, KbdGroup } from "@multiclubes/ui/components/kbd";
import { ArrowRightIcon, CircleDashedIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { NavItem } from "@/lib/docs";

export function CommandMenu({
  sections,
  components,
}: {
  sections: NavItem[];
  components: NavItem[];
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || event.key === "/") {
        const target = event.target as HTMLElement | null;
        if (
          target?.isContentEditable ||
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement
        ) {
          return;
        }
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-8 w-full justify-start rounded-lg bg-muted/50 pl-3 font-normal text-muted-foreground shadow-none hover:bg-muted/50 sm:pr-12 md:w-48 lg:w-56 xl:w-64 dark:bg-card"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Buscar na documentação...</span>
        <span className="inline-flex lg:hidden">Buscar...</span>
        <KbdGroup className="absolute top-1.5 right-1.5 hidden sm:flex">
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Buscar"
        description="Busque uma página"
      >
        <Command>
          <CommandInput placeholder="Buscar página ou componente..." />
          <CommandList>
            <CommandEmpty>Nenhum resultado.</CommandEmpty>
            <CommandGroup heading="Páginas">
              {sections.map((item) => (
                <CommandItem key={item.url} value={item.title} onSelect={() => go(item.url)}>
                  <ArrowRightIcon />
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Componentes">
              {components.map((item) => (
                <CommandItem key={item.url} value={item.title} onSelect={() => go(item.url)}>
                  <CircleDashedIcon />
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
