import { readFileSync } from "node:fs";
import path from "node:path";
import { Button } from "@multiclubes/ui/components/button";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { BLOCKS } from "@/blocks";
import { HomeAnatomy } from "@/components/home/home-anatomy";
import { HomeCompare } from "@/components/home/home-compare";
import { HomeFacts } from "@/components/home/home-facts";
import { HomeFoundations } from "@/components/home/home-foundations";
import { HomeShowcase } from "@/components/home/home-showcase";
import { HomeStart } from "@/components/home/home-start";
import { WaveHero } from "@/components/wave-hero";
import { getComponentPages } from "@/lib/docs";

/** Conta os tokens de cor declarados no tema do kit (`--color-*` do @theme). */
function countColorTokens() {
  try {
    const css = readFileSync(
      path.join(process.cwd(), "../../packages/ui/src/styles/globals.css"),
      "utf8",
    );
    const theme = css.split(":root")[0] ?? "";
    return new Set(theme.match(/--color-[a-z0-9-]+(?=:)/g)).size;
  } catch {
    return 0;
  }
}

export default function Page() {
  return (
    <>
      <div className="container-wrapper relative isolate flex min-h-svh flex-col -mt-(--header-height) items-center justify-start overflow-hidden px-6 pt-[calc(var(--header-height)+var(--wave-height)*0.69+1rem)] pb-16 [--wave-height:max(9rem,min(34vw,55svh))]">
        {/* O hero sobe por baixo do header (-mt), que fica transparente sobre a onda, e
            ocupa a tela inteira (min-h-svh): ao abrir a página só ele aparece.
            A altura da onda acompanha a da tela (40svh, até 30,25rem; 28svh no celular, onde
            a tela estreita achata a curva), para logo, título e botões caberem na primeira
            dobra também em notebooks. O vale fica a 69% da
            altura da onda; o conteúdo começa logo abaixo dele, sem nada dentro da onda. */}
        <WaveHero />
        <section
          aria-label="Apresentação"
          className="flex max-w-3xl flex-col items-center gap-2.5 text-center mt-5"
        >
          <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
            Eleve o Nível.
          </span>
          <h1 className="text-4xl leading-tight font-bold tracking-tight text-balance lg:text-5xl">
            {/* Os dois PNGs saíram da mesma arte, na mesma escala (Mosaico 424×107,
                Multiclubes 542×120, ~35px abaixo da linha de base), então usam o mesmo
                fator: 0,011em por pixel. */}
            <Lettering
              src="/mosaico-lettering.png"
              label="Mosaico"
              className="h-[1.18em] w-[4.66em] align-[-0.385em]"
            />
            , o design system da{" "}
            <Lettering
              src="/multiclubes-lettering.png"
              label="Multiclubes"
              className="h-[1.32em] w-[5.96em] align-[-0.385em]"
            />
          </h1>
          <p className="max-w-2xl text-base text-balance text-muted-foreground sm:text-lg">
            Componentes acessíveis, tema compartilhado e configurações comuns para todas as
            aplicações da Multiclubes.
          </p>
          <div className="flex items-center gap-2 pt-2 ">
            <Button
              nativeButton={false}
              render={
                <Link
                  href="/docs"
                  className="pill gap-2 bg-ink text-paper hover:bg-ink/85 hover:text-paper"
                />
              }
            >
              Começar a usar
              <ArrowUpRight className="size-4" aria-hidden="true" />
              {/* </Link> */}
            </Button>
            <Button variant="ghost" nativeButton={false} render={<Link href="/docs/components" />}>
              Ver componentes
              {/* <ArrowUpRight className="size-4" aria-hidden="true" /> */}
            </Button>
          </div>
        </section>
      </div>
      <HomeCompare />
      <HomeShowcase />
      <HomeFoundations />
      <HomeAnatomy />
      <HomeFacts
        componentCount={getComponentPages().length}
        blockCount={BLOCKS.length}
        colorCount={countColorTokens()}
      />
      <HomeStart />
    </>
  );
}

/**
 * Palavra em lettering dentro do texto. O PNG é só a forma das letras (tinta sobre fundo
 * transparente) e vira máscara, então a palavra tem a cor do texto nos dois temas. O texto
 * real fica para leitores de tela.
 */
function Lettering({ src, label, className }: { src: string; label: string; className: string }) {
  return (
    <>
      <span
        aria-hidden
        className={`inline-block bg-current [mask-size:contain] [mask-repeat:no-repeat] ${className}`}
        style={{ maskImage: `url(${src})` }}
      />
      <span className="sr-only">{label}</span>
    </>
  );
}
