import { Button } from "@multiclubes/ui/components/button";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Multiui-kit</h1>
        <p className="text-muted-foreground">
          Catálogo de componentes da Multiclubes. A documentação de cada componente entra na Fase 3.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Button</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Pequeno</Button>
          <Button>Padrão</Button>
          <Button size="lg">Grande</Button>
        </div>
      </section>
    </main>
  );
}
