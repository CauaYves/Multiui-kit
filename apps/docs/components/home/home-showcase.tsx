"use client";

import { TooltipProvider } from "@multiclubes/ui/components/tooltip";
import { cn } from "cn";
import * as React from "react";
import { BRAND_COLORS, LogoMark, LogoWordmark } from "@/components/logo";
import { HexSwatch } from "./hex-swatch";
import { HomeSection } from "./home-section";
import { Reveal } from "./reveal";
import { TypeSpecimen } from "./type-specimen";

const STEPS = [
  { label: "Ícone", hint: "O ícone do app, nas cores da marca." },
  { label: "Tipografia", hint: "Uma família, com alturas e linhas de base definidas." },
  { label: "Logo", hint: "Símbolo e nome juntos, sempre na mesma proporção." },
  { label: "Cores", hint: "As cores da marca viram tokens de tema." },
  { label: "Componente", hint: "Um componente real do kit: o login, em miniatura." },
] as const;

const TOKENS = [
  { name: "primary", className: "bg-primary", from: BRAND_COLORS.blue },
  { name: "highlight", className: "bg-highlight", from: BRAND_COLORS.yellow },
  { name: "secondary", className: "bg-secondary", from: BRAND_COLORS.blue },
  { name: "muted", className: "bg-muted", from: BRAND_COLORS.yellow },
  { name: "accent", className: "bg-accent", from: BRAND_COLORS.blue },
];

/** Entrada escalonada de um elemento interno: reinicia a cada vez que o painel fica ativo. */
function enter(
  active: boolean,
  i: number,
  kind: "animate-fluid-in" | "animate-fluid-in-sm" = "animate-fluid-in-sm",
) {
  return {
    className: active ? `${kind} motion-reduce:animate-none` : undefined,
    style: { "--fluid-index": i } as React.CSSProperties,
  };
}

function Panel({
  active,
  children,
  className,
}: {
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden={!active}
      className={cn(
        "absolute inset-0 flex items-center justify-center p-8",
        active
          ? "animate-showcase-in"
          : "pointer-events-none opacity-0 blur-sm transition-[opacity,filter] duration-150 ease-out motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Login do kit em miniatura (versão compacta do bloco login-01). */
function MiniLogin({ active }: { active: boolean }) {
  const e = (i: number) => enter(active, i);
  return (
    <div
      className={cn(
        "flex w-full max-w-72 flex-col gap-4 rounded-xl bg-card p-5 text-card-foreground shadow-lg ring-1 ring-foreground/5",
        active && "animate-fluid-in motion-reduce:animate-none",
      )}
    >
      <div style={e(3).style} className={e(3).className}>
        <LogoWordmark className="h-5 w-auto self-start text-foreground" />
      </div>
      <div className="flex flex-col gap-0.5">
        <h3
          style={e(5).style}
          className={cn("text-base font-semibold tracking-tight", e(5).className)}
        >
          Bem-vindo de volta
        </h3>
        <p style={e(6).style} className={cn("text-xs text-muted-foreground", e(6).className)}>
          Entre com sua conta para continuar.
        </p>
      </div>
    </div>
  );
}

export function HomeShowcase() {
  const [step, setStep] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [userStopped, setUserStopped] = React.useState(false);
  const [reduced, setReduced] = React.useState(true);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const auto = !reduced && !userStopped;

  // Avança uma etapa a cada 3 s; para com mouse ou foco na seção, com o botão de pausa
  // e para quem prefere menos movimento.
  React.useEffect(() => {
    if (paused || !auto) return;
    const id = window.setInterval(() => setStep((c) => (c + 1) % STEPS.length), 3000);
    return () => window.clearInterval(id);
  }, [paused, auto]);

  return (
    <HomeSection
      n={2}
      id="Multiclubes"
      eyebrow="Branding & Produto"
      title="Uma identidade em todas as interfaces."
      description="Um sistema único para construir experiências consistentes, preservar a identidade da marca e facilitar a evolução dos produtos."
    >
      <TooltipProvider>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: só pausa a troca automática */}
        <div
          className="grid items-center gap-12 md:grid-cols-2 md:gap-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <Reveal>
            {!reduced ? (
              <button
                type="button"
                onClick={() => setUserStopped((v) => !v)}
                aria-pressed={userStopped}
                className="mb-4 rounded-md px-2 py-1 text-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring"
              >
                {userStopped ? "Retomar troca automática" : "Pausar troca automática"}
              </button>
            ) : null}
            <ol className="flex flex-col">
              {STEPS.map((s, i) => {
                const on = i === step;
                return (
                  <li
                    key={s.label}
                    className="border-b border-border last:border-b-0 md:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => setStep(i)}
                      aria-current={on ? "step" : undefined}
                      className="group/step relative flex w-full flex-col gap-1 py-4 text-left outline-none focus-visible:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="flex items-baseline gap-4">
                        <span
                          aria-hidden
                          className="font-mono text-sm text-muted-foreground tabular-nums"
                        >
                          {i + 1}.
                        </span>
                        <span
                          className={cn(
                            "text-4xl leading-tight font-semibold tracking-tight transition-[color,translate] duration-(--duration-fluid-fast) ease-(--ease-out-fluid) motion-reduce:transition-none sm:text-5xl",
                            on
                              ? "translate-x-1 text-foreground"
                              : "text-muted-foreground group-hover/step:text-foreground",
                          )}
                        >
                          {s.label}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "grid pl-9 transition-[grid-template-rows,opacity] duration-(--duration-fluid-fast) ease-(--ease-out-fluid) motion-reduce:transition-none sm:pl-10",
                          on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <span className="overflow-hidden text-sm text-muted-foreground">
                          {s.hint}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <Reveal delay={120}>
            <div
              aria-live={auto && !paused ? "off" : "polite"}
              className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden"
            >
              <Panel active={step === 0}>
                {/* Ícone do app (o favicon): fundo amarelo e "m" azul no claro; no escuro, as
                  cores invertidas, como no Mosaic Loader. */}
                <div
                  role="img"
                  aria-label="Ícone da Multiclubes"
                  className={cn(
                    "flex size-36 items-center justify-center rounded-[22%] bg-(--icon-bg) text-(--icon-fg) shadow-lg sm:size-44 dark:bg-(--icon-fg) dark:text-(--icon-bg)",
                    step === 0 && "animate-fluid-in motion-reduce:animate-none",
                  )}
                  style={
                    {
                      "--icon-bg": BRAND_COLORS.yellow,
                      "--icon-fg": BRAND_COLORS.blue,
                    } as React.CSSProperties
                  }
                >
                  <LogoMark className="h-auto w-[64%]" />
                </div>
              </Panel>

              <Panel active={step === 1}>
                <TypeSpecimen active={step === 1} />
              </Panel>

              <Panel active={step === 2}>
                {/* Mesma moldura e mesmas cores do ícone: amarelo com azul no claro,
                    invertido no escuro. O raio em px é o do ícone (22% de 144/176px). */}
                <div
                  role="img"
                  aria-label="Logo da Multiclubes"
                  className={cn(
                    "flex w-full max-w-md items-center justify-center rounded-[2rem] bg-(--icon-bg) px-10 py-9 text-(--icon-fg) shadow-lg sm:rounded-[2.4rem] sm:px-12 sm:py-11 dark:bg-(--icon-fg) dark:text-(--icon-bg)",
                    step === 2 && "animate-fluid-in motion-reduce:animate-none",
                  )}
                  style={
                    {
                      "--icon-bg": BRAND_COLORS.yellow,
                      "--icon-fg": BRAND_COLORS.blue,
                    } as React.CSSProperties
                  }
                >
                  <LogoWordmark className="h-auto w-full" />
                </div>
              </Panel>

              <Panel active={step === 3}>
                <div className="flex w-full flex-col gap-6">
                  <div className="flex justify-center gap-4">
                    <HexSwatch
                      name="Azul"
                      className={cn(
                        "size-16 rounded-full",
                        step === 3 && "animate-fluid-in motion-reduce:animate-none",
                      )}
                      style={{ backgroundColor: BRAND_COLORS.blue, ["--fluid-index" as string]: 0 }}
                    />
                    <HexSwatch
                      name="Amarelo"
                      className={cn(
                        "size-16 rounded-full",
                        step === 3 && "animate-fluid-in motion-reduce:animate-none",
                      )}
                      style={{
                        backgroundColor: BRAND_COLORS.yellow,
                        ["--fluid-index" as string]: 2,
                      }}
                    />
                  </div>
                  <ul className="grid grid-cols-5 gap-3">
                    {TOKENS.map((t, i) => (
                      <li key={t.name} className="flex flex-col gap-2">
                        <HexSwatch
                          name={`--${t.name}`}
                          style={{
                            backgroundColor: step === 3 ? undefined : t.from,
                            transitionDelay: step === 3 ? `${300 + i * 90}ms` : "0ms",
                          }}
                          className={cn(
                            "block aspect-square rounded-xl transition-[background-color,transform] duration-700 motion-reduce:transition-none",
                            step === 3 && t.className,
                            step === 3 ? "scale-100" : "scale-75",
                          )}
                        />
                        <span className="truncate text-center font-mono text-xs text-muted-foreground">
                          {t.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Panel>

              <Panel active={step === 4}>
                <MiniLogin active={step === 4} />
              </Panel>
            </div>
          </Reveal>
        </div>
      </TooltipProvider>
    </HomeSection>
  );
}
