import { getComponentPages, getPage } from "@/lib/docs";
import { PRINCIPLE_PAGES } from "@/lib/ia-pages";

/** Índice para IAs, no formato de https://llmstxt.org. */
export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const link = (title: string, url: string, description: string) =>
    `- [${title}](${origin}${url})${description ? `: ${description}` : ""}`;

  const principles = PRINCIPLE_PAGES.map((slug) => getPage(slug)).filter((page) => page !== null);
  const components = getComponentPages();

  const text = `# Mosaico

> Mosaico é o design system da Multiclubes: componentes React, tema (Tailwind v4, CSS variables) e configurações compartilhadas, publicados como \`@multiclubes/ui\`. Ao criar relatório, documentação, e-mail ou protótipo para a Multiclubes, leia primeiro "Para IA".

O catálogo está em português. O conteúdo de cada componente está em inglês, como no shadcn/ui, de onde o kit parte.

## Princípios

${principles.map((page) => link(page.title, `/md/${page.slug.join("/")}`, page.description)).join("\n")}

## Componentes

${components.map((page) => link(page.title, page.url, page.description)).join("\n")}
`;

  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
