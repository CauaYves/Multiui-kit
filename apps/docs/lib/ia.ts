import { readFileSync } from "node:fs";
import { join } from "node:path";

// Fonte única do conteúdo voltado a IA: content/docs/para-ia.mdx. Daqui saem o /llms.txt, os
// endpoints /md/* e a referência da skill em skills/mosaico-design (scripts/sync-ia.mjs).

const START = "## Instruções";
const END = "\n---\n\n## Para quem mantém";

/** Texto do MDX sem o frontmatter. */
export function readDocBody(file: string, root = process.cwd()) {
  const source = readFileSync(join(root, "content", "docs", file), "utf8");
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

/** As instruções para a IA, sem a introdução nem a nota para quem mantém a página. */
export function iaPayload(root = process.cwd()) {
  const body = readDocBody("para-ia.mdx", root).replace(/\r\n/g, "\n");
  const start = body.indexOf(START);
  const end = body.indexOf(END);
  if (start === -1 || end === -1) {
    throw new Error("para-ia.mdx: não achei os marcadores de início e fim das instruções.");
  }
  return body.slice(start, end).trim();
}

/** Troca os componentes do MDX por Markdown puro, para ler fora do site. */
export function toPlainMarkdown(body: string) {
  return body.replace(
    /<Callout(?: title="([^"]*)")?>\s*([\s\S]*?)\s*<\/Callout>/g,
    (_, title: string | undefined, text: string) => {
      const lines = [...(title ? [`**${title}**`, ""] : []), ...text.split("\n")];
      return lines.map((line) => (line ? `> ${line}` : ">")).join("\n");
    },
  );
}

/** Arquivo de referência da skill: as instruções, com um aviso de que é gerado. */
export function skillReference(root = process.cwd()) {
  return `<!-- Gerado de apps/docs/content/docs/para-ia.mdx por "pnpm --filter docs sync:ia". Não edite aqui. -->

# Princípios do Mosaico para materiais fora do código

${iaPayload(root).replace(START, "## Instruções")}
`;
}
