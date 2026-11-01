import { Button } from "@multiclubes/ui/components/button";
import Link from "next/link";
import { HomeShowcase } from "@/components/home-showcase";
import { LogoWordmark } from "@/components/logo";
import { VisualIdentity } from "@/components/visual-identity";
import { getComponentPages } from "@/lib/docs";

/** Linha horizontal que atravessa a tela inteira, como as divisões de tailwindcss.com. */
function Rule() {
  return (
    <div aria-hidden="true" className="relative h-px">
      <div className="absolute -inset-x-[100vw] h-px bg-line" />
    </div>
  );
}

/** Faixa hachurada entre duas linhas. */
function Gap({ className }: { className?: string }) {
  return <div aria-hidden="true" className={`bg-hatch ${className ?? "h-10"}`} />;
}

export default function Page() {
  const components = getComponentPages().map((page) => page.title);

  return (
    <>
      <div className="overflow-x-clip px-4 sm:px-6">
        <div className="mx-auto w-full max-w-7xl border-x border-line">
          <Gap className="h-8 sm:h-12" />
          <Rule />
          <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <section className="flex flex-col items-start justify-center gap-4 px-6 py-14 sm:px-10 lg:py-20">
              <LogoWordmark className="mb-4 h-8 w-auto sm:h-9" />
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {components.length} componentes
              </span>
              <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance lg:text-5xl">
                Mosaico, o design system da Multiclubes
              </h1>
              <p className="max-w-xl text-base text-balance text-muted-foreground sm:text-lg">
                Componentes acessíveis, tema compartilhado e configurações comuns para todas as
                aplicações da Multiclubes.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Button nativeButton={false} render={<Link href="/docs" />}>
                  Começar
                </Button>
                <Button
                  variant="ghost"
                  nativeButton={false}
                  render={<Link href="/docs/components" />}
                >
                  Ver componentes
                </Button>
              </div>
            </section>
            <div className="border-t border-line lg:border-t-0 lg:border-l">
              <HomeShowcase />
            </div>
          </div>
          <Rule />
          <Gap className="h-8 sm:h-12" />
          <Rule />
        </div>
      </div>
      <div className="pt-20">
        <VisualIdentity />
      </div>
    </>
  );
}
