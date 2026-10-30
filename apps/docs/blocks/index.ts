// Blocos: telas inteiras montadas com os componentes do kit, exibidas em /blocks e em
// /view/[name]. Seguem o formato do ui.shadcn.com/blocks, com o conteúdo em moldes.
import type * as React from "react";

export type Block = {
  name: string;
  description: string;
  /** Categorias em que o bloco aparece. "featured" é a página /blocks. */
  categories: string[];
};

/** Categorias da navegação, na ordem do shadcn. "featured" é a raiz, /blocks. */
export const BLOCK_CATEGORIES = [
  { slug: "featured", title: "Featured" },
  { slug: "sidebar", title: "Sidebar" },
  { slug: "login", title: "Login" },
  { slug: "signup", title: "Signup" },
];

export const BLOCKS: Block[] = [
  {
    name: "dashboard-01",
    description: "Sidebar que recolhe para ícones, com a página em cartão",
    categories: ["featured", "sidebar"],
  },
  {
    name: "dashboard-02",
    description: "Sidebar que recolhe para ícones, com a página encostada",
    categories: ["featured", "sidebar"],
  },
  {
    name: "login-01",
    description: "Login com imagem recortada por onda no desktop e no topo no celular",
    categories: ["login"],
  },
];

export const BlockLoaders: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  "dashboard-01": () => import("./dashboard-01"),
  "dashboard-02": () => import("./dashboard-02"),
  "login-01": () => import("./login-01"),
};
