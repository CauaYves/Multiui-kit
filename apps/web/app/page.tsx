import { Button } from "@multiclubes/ui/components/button";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Playground</h1>
        <p className="text-muted-foreground">
          Consome o <code className="font-mono">@multiclubes/ui</code> do mesmo jeito que um app
          externo consumiria.
        </p>
      </header>

      <section className="flex flex-wrap gap-3">
        <Button>Padrão</Button>
        <Button variant="secondary">Secundário</Button>
        <Button variant="outline">Contorno</Button>
        <Button variant="ghost">Fantasma</Button>
        <Button variant="destructive">Destrutivo</Button>
        <Button variant="link">Link</Button>
      </section>
    </main>
  );
}
