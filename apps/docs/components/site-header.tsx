import { Button } from "@multiclubes/ui/components/button";
import { Separator } from "@multiclubes/ui/components/separator";
import Link from "next/link";
import { CommandMenu } from "@/components/command-menu";
import { LogoMark } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeSwitcher } from "@/components/mode-switcher";
import { getComponentPages, SECTIONS, toNavItem } from "@/lib/docs";

const NAV_ITEMS = [
  { title: "Docs", url: "/docs" },
  { title: "Componentes", url: "/docs/components" },
];

export function SiteHeader() {
  const components = getComponentPages().map(toNavItem);

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="container-wrapper px-6">
        <div className="flex h-(--header-height) items-center **:data-[slot=separator]:h-4!">
          <MobileNav sections={SECTIONS} components={components} className="flex lg:hidden" />
          <Button
            variant="ghost"
            size="icon"
            className="hidden size-8 lg:flex"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <LogoMark className="size-5" />
            <span className="sr-only">Multiui-kit</span>
          </Button>
          <MainNav items={NAV_ITEMS} className="hidden lg:flex" />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
              <CommandMenu sections={SECTIONS} components={components} />
            </div>
            <Separator orientation="vertical" className="ml-2 hidden lg:block" />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
