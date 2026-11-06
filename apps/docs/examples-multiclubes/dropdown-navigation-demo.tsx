"use client";

import { DropdownNavigation } from "@multiclubes/ui/components/dropdown-navigation";
import {
  BookOpenIcon,
  CloudIcon,
  CodeIcon,
  GitBranchIcon,
  GlobeIcon,
  LightningIcon,
  PlugsConnectedIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@phosphor-icons/react";

export default function DropdownNavigationDemo() {
  return (
    <DropdownNavigation
      aria-label="Principal"
      items={[
        {
          label: "Produtos",
          groups: [
            {
              title: "Plataforma",
              items: [
                {
                  label: "Prévias",
                  description: "Entregue mais rápido",
                  icon: <RocketLaunchIcon />,
                  href: "#",
                },
                {
                  label: "Integrações",
                  description: "Conecte suas ferramentas",
                  icon: <PlugsConnectedIcon />,
                  href: "#",
                },
                {
                  label: "Segurança",
                  description: "Proteção em cada etapa",
                  icon: <ShieldCheckIcon />,
                  href: "#",
                },
              ],
            },
            {
              title: "Infraestrutura",
              items: [
                {
                  label: "Rede global",
                  description: "Respostas perto de cada pessoa",
                  icon: <GlobeIcon />,
                  href: "#",
                },
                {
                  label: "Funções",
                  description: "Execute código sob demanda",
                  icon: <LightningIcon />,
                  href: "#",
                },
                {
                  label: "Armazenamento",
                  description: "Arquivos e dados em um só lugar",
                  icon: <CloudIcon />,
                  href: "#",
                },
              ],
            },
          ],
        },
        {
          label: "Soluções",
          groups: [
            {
              title: "Plataforma",
              items: [
                {
                  label: "Lojas virtuais",
                  description: "Vendas que carregam rápido",
                  icon: <StarIcon />,
                  href: "#",
                },
                {
                  label: "Sites de conteúdo",
                  description: "Publique sem esperar",
                  icon: <BookOpenIcon />,
                  href: "#",
                },
              ],
            },
          ],
        },
        {
          label: "Recursos",
          groups: [
            {
              title: "Código aberto",
              items: [
                {
                  label: "Repositórios",
                  description: "Explore e contribua",
                  icon: <GitBranchIcon />,
                  href: "#",
                },
                {
                  label: "Guias",
                  description: "Aprenda com exemplos",
                  icon: <CodeIcon />,
                  href: "#",
                },
              ],
            },
          ],
        },
        { label: "Preços", href: "#" },
      ]}
    />
  );
}
