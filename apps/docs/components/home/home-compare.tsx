"use client";

import { ToggleGroup, ToggleGroupItem } from "@multiclubes/ui/components/toggle-group";
import { cn } from "cn";
import { HomeSection } from "./home-section";
import { Reveal } from "./reveal";
import { Cota, useTicker } from "./showcase-kit";

const CHANGES = [
  {
    title: "Alinhamento",
    before: "Cada elemento começa num ponto diferente.",
    after: "Tudo parte da mesma margem esquerda.",
    tag: ["3 margens", "1 margem"],
  },
  {
    title: "Espaçamento em 4px",
    before: "Distâncias aleatórias entre os blocos.",
    after: "Múltiplos de 4px, sempre os mesmos.",
    tag: ["gap 7px", "gap 16px = 4 × 4"],
  },
  {
    title: "Raio único",
    before: "Cada campo com um canto diferente.",
    after: "Um raio só, que vem do tema.",
    tag: ["0 · 2 · 20 · full", "rounded-xl"],
  },
  {
    title: "Tipografia em escala",
    before: "Tamanhos soltos, sem relação entre si.",
    after: "Poucos tamanhos, de uma escala fixa.",
    tag: ["13 · 15 · 16 · 23px", "text-sm · text-xl"],
  },
];

const T =
  "transition-[padding,margin,gap,border-radius,font-size,font-weight,transform,translate,height,left,top,right,color,background-color,outline-color,outline-width,outline-offset] duration-(--duration-fluid) ease-(--ease-fluid) motion-reduce:transition-none";

const PER_SIDE = 4;

export function HomeCompare() {
  const { tick, setTick, playing, reduced, bind, takeControl } = useTicker({
    interval: 1500,
    length: PER_SIDE * 2,
  });
  const ok = reduced || tick >= PER_SIDE;
  // Com movimento reduzido: quadro fixo (Mosaico) com todas as mudanças anotadas.
  const active = reduced ? -1 : tick % PER_SIDE;
  const hl = (i: number) =>
    active === i && "outline-2 outline-offset-2 outline-primary/60 outline-solid";

  return (
    <HomeSection
      n={1}
      id="padrao"
      eyebrow="Design System"
      title="A diferença está nos detalhes"
      description="O Mosaico é o ponto de partida pra um UX/UI sob medida."
    >
      <div {...bind} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <Reveal className="flex flex-col gap-8">
          <ToggleGroup
            variant="outline"
            spacing={0}
            value={[ok ? "mosaico" : "sem"]}
            onValueChange={(v) => {
              if (!v[0]) return;
              takeControl();
              setTick((v[0] === "mosaico" ? PER_SIDE : 0) + Math.max(active, 0));
            }}
            aria-label="Versão da tela de exemplo"
          >
            <ToggleGroupItem value="sem">Sem padrão</ToggleGroupItem>
            <ToggleGroupItem value="mosaico">Mosaico</ToggleGroupItem>
          </ToggleGroup>
          <ul className="flex flex-col" aria-live={playing ? "off" : "polite"}>
            {CHANGES.map((c, i) => (
              <li
                key={c.title}
                data-active={active === i || undefined}
                className="flex flex-col gap-1 border-t border-border py-4 pl-0 transition-[color,border-color,padding] duration-(--duration-fluid-fast) ease-(--ease-out-fluid) motion-reduce:transition-none data-active:border-primary data-active:pl-3"
              >
                <span
                  className={cn(
                    "text-lg font-medium transition-colors duration-(--duration-fluid-fast) motion-reduce:transition-none",
                    active === i ? "text-primary" : "text-foreground",
                  )}
                >
                  {c.title}
                </span>
                <span
                  key={String(ok)}
                  className="animate-fluid-in-sm text-sm text-muted-foreground motion-reduce:animate-none"
                >
                  {ok ? c.after : c.before}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div
            aria-hidden="true"
            inert
            className="rounded-surface border border-border bg-dot-grid p-6 sm:p-10"
          >
            <div
              className={cn(
                "relative border border-border bg-card text-card-foreground",
                T,
                hl(2),
                ok ? "rounded-2xl p-6" : "rounded-[3px] p-[22px]",
              )}
            >
              {active === 0 && (
                <span
                  className={cn(
                    "pointer-events-none absolute inset-y-3 w-px animate-showcase-in border-l border-dashed border-primary/60",
                    T,
                    ok ? "left-6" : "left-[22px]",
                  )}
                />
              )}
              {active >= 0 && (
                <Cota key={`${active}-${ok}`} side="top" className="inset-x-6">
                  {CHANGES[active].tag[ok ? 1 : 0]}
                </Cota>
              )}
              <div
                className={cn(
                  "font-heading",
                  hl(3),
                  T,
                  ok ? "text-xl font-semibold" : "translate-x-3 text-[23px] font-bold",
                )}
              >
                Título
              </div>
              <p
                className={cn(
                  "text-muted-foreground",
                  hl(3),
                  T,
                  ok ? "mt-1 text-sm" : "mt-[5px] -translate-x-0.5 text-[15px]",
                )}
              >
                Descrição curta da tela.
              </p>

              <div
                className={cn(
                  T,
                  ok ? "mt-6 flex flex-col gap-4" : "mt-[27px] flex flex-col gap-[7px]",
                )}
              >
                <div className={cn("flex flex-col gap-2", T, !ok && "translate-x-2")}>
                  <span className={cn("font-medium", hl(3), T, ok ? "text-sm" : "text-[13px]")}>
                    Campo
                  </span>
                  <span
                    className={cn(
                      "flex h-9 items-center border border-input bg-background px-3 text-muted-foreground",
                      hl(2),
                      T,
                      ok ? "rounded-xl text-sm" : "rounded-none text-[15px]",
                    )}
                  >
                    Placeholder
                  </span>
                </div>
                <div
                  className={cn("relative flex flex-col gap-2", T, !ok && "-translate-x-1 pt-2")}
                >
                  {active === 1 && (
                    <Cota
                      key={String(ok)}
                      side="right"
                      className={cn(
                        "inset-y-auto -right-4",
                        T,
                        ok ? "-top-4 h-4" : "-top-[7px] h-[7px]",
                      )}
                    />
                  )}
                  <span className={cn("font-medium", hl(3), T, ok ? "text-sm" : "text-xs")}>
                    Campo
                  </span>
                  <span
                    className={cn(
                      "flex items-center border border-input bg-background px-3 text-muted-foreground",
                      hl(2),
                      T,
                      ok ? "h-9 rounded-xl text-sm" : "h-11 rounded-[20px] px-5 text-base",
                    )}
                  >
                    Placeholder
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  "flex items-center",
                  T,
                  ok ? "mt-6 gap-2" : "mt-[18px] gap-[13px] pl-3",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-9 items-center bg-primary px-4 text-primary-foreground",
                    hl(2),
                    T,
                    ok ? "rounded-xl text-sm font-medium" : "rounded-full text-[13px] font-bold",
                  )}
                >
                  Ação
                </span>
                <span
                  className={cn(
                    "inline-flex items-center bg-secondary px-4 text-secondary-foreground",
                    hl(2),
                    T,
                    ok ? "h-9 rounded-xl text-sm font-medium" : "h-8 rounded-[2px] text-[15px]",
                  )}
                >
                  Cancelar
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </HomeSection>
  );
}
