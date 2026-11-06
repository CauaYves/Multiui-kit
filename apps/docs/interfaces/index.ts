import type * as React from "react";

// Seções de interface mostradas em /interfaces. Cada uma é um exemplo em
// interfaces/<name>.tsx, com título e descrição aqui.
export type InterfaceItem = { name: string; title: string; description: string; category: string };

export const INTERFACE_CATEGORIES: string[] = ["Conversa"];

export const INTERFACES: InterfaceItem[] = [
  {
    name: "chatbot",
    title: "Chatbot",
    description: "Conversa com mensagens, indicador de digitação e campo de envio.",
    category: "Conversa",
  },
];

export const InterfaceLoaders: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  chatbot: () => import("@/interfaces/chatbot"),
};
