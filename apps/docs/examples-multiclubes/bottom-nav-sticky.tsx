"use client";

import { BottomNav, BottomNavItem } from "@multiclubes/ui/components/bottom-nav";
import { ChatCircleIcon, HouseIcon, TrophyIcon, UserIcon } from "@phosphor-icons/react";

export default function BottomNavSticky() {
  return (
    // transform cria um novo contexto para o `fixed`, prendendo a barra à moldura
    <div className="relative mx-auto h-96 w-60 translate-x-0 overflow-hidden rounded-[2rem] border-4 border-foreground/80 bg-background [transform:translateZ(0)]">
      <div className="space-y-3 p-5">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-20 rounded-xl bg-muted" />
        <div className="h-20 rounded-xl bg-muted" />
      </div>
      <BottomNav sticky defaultValue="inicio" className="absolute">
        <BottomNavItem value="inicio" label="Início" icon={<HouseIcon />} />
        <BottomNavItem value="mensagens" label="Mensagens" icon={<ChatCircleIcon />} badge />
        <BottomNavItem value="conquistas" label="Conquistas" icon={<TrophyIcon />} />
        <BottomNavItem value="perfil" label="Perfil" icon={<UserIcon />} />
      </BottomNav>
    </div>
  );
}
