import { evaluate } from "@mdx-js/mdx";
import type { Element, ElementContent, Root } from "hast";
import * as runtime from "react/jsx-runtime";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { mdxComponents } from "@/components/mdx-components";
import { headingId, type TocItem } from "@/lib/docs";
import { codeTransformers, SHIKI_THEMES } from "@/lib/highlight-code";

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

function textOf(node: ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(textOf).join("");
  return "";
}

/**
 * Dá um id único a cada título (títulos repetidos recebem -1, -2…) e monta o índice
 * "Nesta página" com os mesmos ids, para os links do índice sempre baterem com as âncoras.
 */
function rehypeHeadings({ toc }: { toc: TocItem[] }) {
  return (tree: Root) => {
    const used = new Map<string, number>();
    visit(tree, "element", (node: Element) => {
      if (!HEADINGS.has(node.tagName)) return;
      const title = node.children.map(textOf).join("").trim();
      const base = headingId(title);
      if (!base) return;
      const count = used.get(base) ?? 0;
      used.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count}`;
      node.properties.id = id;

      const depth = Number(node.tagName.slice(1));
      if (depth === 2 || depth === 3) toc.push({ title, url: `#${id}`, depth });
    });
  };
}

/** Compila o MDX de uma página. Roda só no servidor, durante o build. */
export async function compileMdx(source: string) {
  const toc: TocItem[] = [];
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrettyCode,
        { theme: SHIKI_THEMES, keepBackground: false, transformers: codeTransformers },
      ],
      [rehypeHeadings, { toc }],
    ],
  });
  return { content: <Content components={mdxComponents} />, toc };
}
