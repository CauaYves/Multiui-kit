import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cn } from "cn";
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper";
import { CopyButton } from "@/components/copy-button";
import { highlightCode } from "@/lib/highlight-code";

const uiSrc = join(process.cwd(), "..", "..", "packages", "ui", "src");

async function readSource({ kit, src, demo }: { kit?: string; src?: string; demo?: string }) {
  try {
    if (kit) {
      const file = join(uiSrc, kit);
      return await readFile(/* turbopackIgnore: true */ `${file}.tsx`, "utf8").catch(() =>
        readFile(/* turbopackIgnore: true */ `${file}.ts`, "utf8"),
      );
    }
    if (src)
      return await readFile(
        /* turbopackIgnore: true */ join(process.cwd(), "content", "sources", src),
        "utf8",
      );
    if (demo) {
      const read = (dir: string) =>
        readFile(/* turbopackIgnore: true */ join(process.cwd(), dir, `${demo}.tsx`), "utf8");
      return await read("examples").catch(() => read("examples-multiclubes"));
    }
  } catch {}
  return null;
}

/**
 * Exibe o código de um arquivo: do kit (`kit="components/button"`), de um demo
 * (`demo="button-demo"`) ou copiado do upstream (`src`).
 */
export async function ComponentSource({
  kit,
  src,
  demo,
  title,
  language,
  collapsible = true,
  className,
  maxLines,
}: {
  kit?: string;
  src?: string;
  demo?: string;
  title?: string;
  language?: string;
  collapsible?: boolean;
  className?: string;
  maxLines?: number;
}) {
  let code = await readSource({ kit, src, demo });
  if (!code) return null;

  // Diretiva adicionada pelo scripts/sync-shadcn.mjs, que não faz parte do exemplo original.
  code = code.replace(/^"use client" \/\/ sync-shadcn\r?\n\r?\n/, "");

  if (maxLines) code = code.split("\n").slice(0, maxLines).join("\n");
  const lang = language ?? title?.split(".").pop() ?? "tsx";
  const highlighted = await highlightCode(code, lang);

  const figure = (
    <figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-96">
      {title && (
        <figcaption
          data-rehype-pretty-code-title=""
          className="flex items-center gap-2 text-code-foreground"
          data-language={lang}
        >
          {title}
        </figcaption>
      )}
      <CopyButton value={code} />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: HTML gerado pelo Shiki no build. */}
      <div data-not-typeset dangerouslySetInnerHTML={{ __html: highlighted }} />
    </figure>
  );

  if (!collapsible) return <div className={cn("relative", className)}>{figure}</div>;
  return <CodeCollapsibleWrapper className={className}>{figure}</CodeCollapsibleWrapper>;
}
