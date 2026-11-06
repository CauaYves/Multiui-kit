import { CopyButton } from "@/components/copy-button";

/** Bloco de código com botão de copiar, no estilo do restante da documentação. */
export function InstallCode({ code }: { code: string }) {
  return (
    <div className="relative min-w-0 rounded-2xl bg-code text-code-foreground">
      <pre className="py-4 pr-12 pl-4 break-words whitespace-pre-wrap">
        <code className="font-mono text-sm leading-relaxed">{code}</code>
      </pre>
      <CopyButton value={code} />
    </div>
  );
}
