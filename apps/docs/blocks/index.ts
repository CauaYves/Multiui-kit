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
  { slug: "editor", title: "Editor" },
  { slug: "canvas", title: "Canvas" },
];

export const BLOCKS: Block[] = [
  {
    name: "sidebar-01",
    description: "Sidebar que recolhe para ícones, com a página em cartão",
    categories: ["featured", "sidebar"],
  },
  {
    name: "sidebar-02",
    description: "Sidebar que recolhe para ícones, com a página encostada",
    categories: ["featured", "sidebar"],
  },
  {
    name: "login-01",
    description: "Login com imagem recortada por onda no desktop e no topo no celular",
    categories: ["login"],
  },
  {
    name: "signup-01",
    description: "Criar conta, espelho do login: imagem à direita no desktop e onda invertida",
    categories: ["signup"],
  },
  {
    name: "editor-01",
    description: "Editor com sidebar de projetos, caixa de comandos e canvas de pontos",
    categories: ["featured", "editor"],
  },
  {
    name: "canvas-01",
    description:
      "Casca de app com canvas: header com marca, seletor e busca, painel lateral com abas e lista, resumo e ferramentas flutuantes",
    categories: ["featured", "canvas"],
  },
];

export const BlockLoaders: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  "sidebar-01": () => import("./sidebar-01"),
  "sidebar-02": () => import("./sidebar-02"),
  "login-01": () => import("./login-01"),
  "signup-01": () => import("./signup-01"),
  "editor-01": () => import("./editor-01"),
  "canvas-01": () => import("./canvas-01"),
};
