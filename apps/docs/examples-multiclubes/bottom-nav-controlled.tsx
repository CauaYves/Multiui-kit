"use client";

import { BottomNav, BottomNavItem } from "@multiclubes/ui/components/bottom-nav";
import { ChartLineIcon, HouseIcon, UserIcon } from "@phosphor-icons/react";
import * as React from "react";

export default function BottomNavControlled() {
  const [value, setValue] = React.useState("inicio");

  return (
    <div className="flex flex-col items-center gap-3">
      <BottomNav value={value} onValueChange={setValue}>
        <BottomNavItem value="inicio" label="Início" icon={<HouseIcon />} />
        <BottomNavItem value="graficos" label="Gráficos" icon={<ChartLineIcon />} />
        <BottomNavItem value="perfil" label="Perfil" icon={<UserIcon />} />
      </BottomNav>
      <p className="text-sm text-muted-foreground">
        Selecionado: <span className="font-medium text-foreground">{value}</span>
      </p>
    </div>
  );
}
