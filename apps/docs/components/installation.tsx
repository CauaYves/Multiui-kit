import Link from "next/link";
import { CodeBlockCommand } from "@/components/code-block-command";

/** Substitui a seção "Installation" do shadcn: os componentes vêm do pacote do kit. */
export function Installation({ name }: { name: string }) {
  return (
    <>
      <p>
        O componente faz parte do <code>@multiclubes/ui</code>. Se o pacote ainda não está no
        projeto, instale-o e importe o tema (veja a{" "}
        <Link href="/docs/installation">instalação</Link>
        ).
      </p>
      <figure data-rehype-pretty-code-figure="">
        <CodeBlockCommand
          __pnpm__="pnpm add @multiclubes/ui"
          __npm__="npm install @multiclubes/ui"
          __yarn__="yarn add @multiclubes/ui"
          __bun__="bun add @multiclubes/ui"
        />
      </figure>
      <p>
        Importe de <code>@multiclubes/ui/components/{name}</code>.
      </p>
    </>
  );
}
