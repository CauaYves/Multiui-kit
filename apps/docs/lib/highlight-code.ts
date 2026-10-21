import type { ShikiTransformer } from "shiki";
import { codeToHtml } from "shiki";

export const SHIKI_THEMES = { light: "github-light", dark: "github-dark" } as const;

/**
 * Anexa o código cru aos blocos (para o botão de copiar) e, em comandos de instalação,
 * as variações para cada gerenciador de pacotes.
 */
export const codeTransformers: ShikiTransformer[] = [
  {
    code(node) {
      if (node.tagName !== "code") return;
      const raw = this.source;
      node.properties.__raw__ = raw;

      const commands: [string, Record<string, string>][] = [
        ["npm install", { yarn: "yarn add", pnpm: "pnpm add", bun: "bun add" }],
        ["pnpm add", { npm: "npm install", yarn: "yarn add", bun: "bun add" }],
        ["npx", { yarn: "yarn dlx", pnpm: "pnpm dlx", bun: "bunx --bun" }],
        ["npm run", { yarn: "yarn", pnpm: "pnpm", bun: "bun" }],
      ];
      for (const [prefix, variants] of commands) {
        if (!raw.startsWith(prefix)) continue;
        const npm = variants.npm ? raw.replace(prefix, variants.npm) : raw;
        node.properties.__npm__ = npm;
        node.properties.__pnpm__ = variants.pnpm ? raw.replace(prefix, variants.pnpm) : raw;
        node.properties.__yarn__ = raw.replace(prefix, variants.yarn as string);
        node.properties.__bun__ = raw.replace(prefix, variants.bun as string);
        break;
      }
    },
  },
];

const cache = new Map<string, Promise<string>>();

export function highlightCode(code: string, language = "tsx") {
  const key = `${language}:${code}`;
  let html = cache.get(key);
  if (!html) {
    html = codeToHtml(code, {
      lang: language,
      themes: SHIKI_THEMES,
      transformers: [
        {
          pre(node) {
            node.properties.class =
              "no-scrollbar min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain overscroll-y-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 !bg-transparent";
          },
          code(node) {
            node.properties["data-line-numbers"] = "";
          },
          line(node) {
            node.properties["data-line"] = "";
          },
        },
      ],
    });
    cache.set(key, html);
  }
  return html;
}
