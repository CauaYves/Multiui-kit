"use client";

import { BottomNav, BottomNavItem } from "@multiclubes/ui/components/bottom-nav";
import {
  ChartLineIcon,
  ChatCircleIcon,
  CreditCardIcon,
  HouseIcon,
  TrophyIcon,
  UserIcon,
} from "@phosphor-icons/react";

export default function BottomNavDemo() {
  return (
    <BottomNav defaultValue="inicio" aria-label="Navegação principal">
      <BottomNavItem value="inicio" label="Início" icon={<HouseIcon />} />
      <BottomNavItem value="graficos" label="Gráficos" icon={<ChartLineIcon />} />
      <BottomNavItem value="pagamentos" label="Pagamentos" icon={<CreditCardIcon />} />
      <BottomNavItem value="mensagens" label="Mensagens" icon={<ChatCircleIcon />} badge={3} />
      <BottomNavItem value="conquistas" label="Conquistas" icon={<TrophyIcon />} />
      <BottomNavItem value="perfil" label="Perfil" icon={<UserIcon />} />
    </BottomNav>
  );
}
