"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@multiclubes/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import type { NavItem } from "@/lib/docs";

const ITEM_CLASS =
  "relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md data-[active=true]:border-accent data-[active=true]:bg-accent";

function SidebarLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        className={ITEM_CLASS}
        render={<Link href={item.url} />}
      >
        <span className="absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent" />
        {item.title}
        {item.badge && (
          // Ponto no amarelo da marca, como o ponto de "New" do shadcn; o nome vai no title.
          <span
            className="flex size-2 shrink-0 rounded-full bg-[#fee502] ring-1 ring-black/15"
            title={item.badge}
          >
            <span className="sr-only">{item.badge}</span>
          </span>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function DocsSidebar({
  sections,
  components,
  ...props
}: React.ComponentProps<typeof Sidebar> & { sections: NavItem[]; components: NavItem[] }) {
  const pathname = usePathname();

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+0.6rem)] z-30 hidden h-[calc(100svh-10rem)] overflow-hidden overscroll-none bg-transparent [--sidebar-menu-width:--spacing(56)] lg:flex"
      collapsible="none"
      {...props}
    >
      <div className="absolute top-12 right-2 bottom-0 hidden h-full w-px bg-[linear-gradient(to_bottom,transparent_0%,var(--border)_10%,var(--border)_90%,transparent_100%)] lg:flex" />
      <SidebarContent className="no-scrollbar w-(--sidebar-menu-width) overflow-x-hidden pl-2.5">
        <SidebarGroup className="pt-12">
          <SidebarGroupLabel className="font-medium text-muted-foreground">
            Seções
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((item) => (
                <SidebarLink
                  key={item.url}
                  item={item}
                  isActive={
                    item.url === "/docs" ? pathname === item.url : pathname.startsWith(item.url)
                  }
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="font-medium text-muted-foreground">
            Componentes
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {components.map((item) => (
                <SidebarLink key={item.url} item={item} isActive={pathname === item.url} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
