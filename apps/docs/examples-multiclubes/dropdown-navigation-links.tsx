"use client";

import { DropdownNavigation } from "@multiclubes/ui/components/dropdown-navigation";
import { BookOpenIcon, ChatCircleIcon, QuestionIcon } from "@phosphor-icons/react";

export default function DropdownNavigationLinks() {
  return (
    <DropdownNavigation
      aria-label="Principal"
      items={[
        { label: "Início", href: "#" },
        {
          label: "Recursos",
          groups: [
            {
              title: "Código aberto",
              items: [
                {
                  label: "Documentação",
                  description: "Tudo o que você precisa saber",
                  icon: <BookOpenIcon />,
                  href: "#",
                },
                {
                  label: "Comunidade",
                  description: "Converse com outras pessoas",
                  icon: <ChatCircleIcon />,
                  href: "#",
                },
              ],
            },
          ],
        },
        { label: "Preços", href: "#" },
        {
          label: "Ajuda",
          groups: [
            {
              title: "Plataforma",
              items: [
                {
                  label: "Central de ajuda",
                  description: "Respostas para dúvidas comuns",
                  icon: <QuestionIcon />,
                  href: "#",
                },
              ],
            },
          ],
        },
        { label: "Contato", href: "#" },
      ]}
    />
  );
}
