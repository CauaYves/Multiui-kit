import { Button } from "@multiclubes/ui/components/button";
import Link from "next/link";
import { LogoWordmark } from "@/components/logo";
import { VisualIdentity } from "@/components/visual-identity";
import { WaveHero } from "@/components/wave-hero";
import { getComponentPages } from "@/lib/docs";

export default function Page() {
  const total = getComponentPages().length;

  return (
    <>
      <div className="container-wrapper relative isolate flex min-h-svh flex-col -mt-(--header-height) items-center justify-start overflow-hidden px-6 pt-[calc(14rem+var(--header-height))] pb-16">
        {/* O hero sobe por baixo do header (-mt), que fica transparente sobre a onda, e
            ocupa a tela inteira (min-h-svh): ao abrir a página só ele aparece.
            justify-start: a logo fica sempre a 14rem do header, onde a onda espera o símbolo. */}
        <WaveHero />
        <section className="flex max-w-3xl flex-col items-center gap-4 text-center">
          <LogoWordmark className="mb-4 h-8 w-auto sm:h-10" />
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {total} componentes
          </span>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance lg:text-5xl">
            Mosaico, o design system da Multiclubes
          </h1>
          <p className="max-w-2xl text-base text-balance text-muted-foreground sm:text-lg">
            Componentes acessíveis, tema compartilhado e configurações comuns para todas as
            aplicações da Multiclubes.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <Button nativeButton={false} render={<Link href="/docs" />}>
              Começar
            </Button>
            <Button variant="ghost" nativeButton={false} render={<Link href="/docs/components" />}>
              Ver componentes
            </Button>
          </div>
        </section>
      </div>
      <VisualIdentity />
    </>
  );
}
