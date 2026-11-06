"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@multiclubes/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@multiclubes/ui/components/input-group";
import { ToggleGroup, ToggleGroupItem } from "@multiclubes/ui/components/toggle-group";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { HomeSection } from "./home-section";
import { Reveal } from "./reveal";
import { Cota, useTicker } from "./showcase-kit";

type State = "padrao" | "foco" | "erro" | "desabilitado";

const STATES: { value: State; label: string }[] = [
  { value: "padrao", label: "Padrão" },
  { value: "foco", label: "Foco" },
  { value: "erro", label: "Erro" },
  { value: "desabilitado", label: "Desabilitado" },
];

const PARTS = [
  { n: 1, name: "Label", text: "Diz o que preencher. Sempre visível, nunca só o placeholder." },
  {
    n: 2,
    name: "Ícone",
    text: "Reforça o tipo do dado. É decorativo e some para leitores de tela.",
  },
  { n: 3, name: "Placeholder", text: "Mostra um exemplo do formato esperado." },
  {
    n: 4,
    name: "Texto de ajuda",
    text: "Explica por que pedimos o dado. Vira mensagem de erro quando falha.",
  },
];

const SPECS = [
  "text-sm · font-medium",
  "size-4 · aria-hidden",
  "text-muted-foreground",
  "text-sm · aria-describedby",
];

/** Número da cota. Destacado quando é a parte em foco. */
function Mark({ n, active }: { n: number; active: boolean }) {
  return (
    <span
      className={cn(
        "flex size-5 items-center justify-center rounded-full font-mono text-[10px] tabular-nums transition-all duration-300",
        active ? "scale-110 bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
      )}
    >
      {n}
    </span>
  );
}

const STATE_STEP = 4;

export function HomeAnatomy() {
  const { tick, setTick, playing, reduced, bind, takeControl } = useTicker({
    interval: 625,
    length: STATES.length * STATE_STEP,
  });
  const state = STATES[Math.floor(tick / STATE_STEP)].value;
  // Com movimento reduzido: quadro fixo com todas as cotas desenhadas e destacadas.
  const part = reduced ? 0 : (tick % STATE_STEP) + 1;
  const invalid = state === "erro";
  const disabled = state === "desabilitado";
  const on = (n: number) => reduced || part === n;
  const cota = (n: number) => `${n}-${state}`;

  return (
    <HomeSection
      n={4}
      id="anatomia"
      eyebrow="Componentes"
      title="Cada parte tem um motivo"
      description="Troque o estado do campo e veja o que o componente resolve sozinho."
    >
      <div {...bind} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <Reveal className="flex flex-col gap-6">
          <ToggleGroup
            variant="outline"
            spacing={0}
            value={[state]}
            onValueChange={(v) => {
              if (!v[0]) return;
              takeControl();
              setTick(STATES.findIndex((s) => s.value === v[0]) * STATE_STEP);
            }}
            aria-label="Estado do campo de exemplo"
            className="max-w-full flex-wrap"
          >
            {STATES.map((s) => (
              <ToggleGroupItem key={s.value} value={s.value}>
                {s.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <ol className="flex flex-col">
            {PARTS.map((p) => (
              <li
                key={p.n}
                data-active={part === p.n || undefined}
                className="grid grid-cols-[2rem_1fr] items-baseline gap-x-3 border-t border-border py-4 transition-colors duration-300 data-active:border-primary"
              >
                <span className="font-mono text-sm text-muted-foreground tabular-nums transition-colors duration-300 in-data-active:text-primary">
                  {p.n}.
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-lg font-medium">{p.name}</span>
                  <span className="text-sm text-muted-foreground">{p.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={120}>
          <div
            aria-hidden="true"
            inert
            className="flex flex-col gap-6 rounded-surface border border-border bg-dot-grid px-10 py-8 sm:px-16"
          >
            <Field data-invalid={invalid || undefined} data-disabled={disabled || undefined}>
              <div className="relative">
                <Cota key={cota(1)} side="left" active={on(1)} delay={0}>
                  <Mark n={1} active={on(1)} />
                </Cota>
                <FieldLabel htmlFor="ha-email">Campo</FieldLabel>
              </div>
              <div className="relative">
                <Cota key={cota(2)} side="left" active={on(2)} delay={120}>
                  <Mark n={2} active={on(2)} />
                </Cota>
                <Cota key={cota(3)} side="right" active={on(3)} delay={240}>
                  <Mark n={3} active={on(3)} />
                </Cota>
                <InputGroup
                  data-disabled={disabled}
                  className={cn(
                    "bg-background",
                    state === "foco" && "border-ring/60 ring-1 ring-ring/60",
                    disabled && "opacity-60",
                  )}
                >
                  <InputGroupAddon>
                    <EnvelopeSimpleIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="ha-email"
                    type="email"
                    placeholder="Placeholder"
                    aria-invalid={invalid || undefined}
                    disabled={disabled}
                    tabIndex={-1}
                  />
                </InputGroup>
              </div>
              <div className="relative">
                <Cota key={cota(4)} side="right" active={on(4)} delay={360}>
                  <Mark n={4} active={on(4)} />
                </Cota>
                {invalid ? (
                  <FieldError>Mensagem de erro.</FieldError>
                ) : (
                  <FieldDescription>Texto de ajuda do campo.</FieldDescription>
                )}
              </div>
            </Field>
            <p className="min-h-4 border-t border-border pt-3 font-mono text-xs text-muted-foreground tabular-nums">
              {part ? `${part} · ${PARTS[part - 1].name.toLowerCase()} · ${SPECS[part - 1]}` : null}
            </p>
          </div>
        </Reveal>
      </div>
      <span className="sr-only" aria-live={playing ? "off" : "polite"}>
        {`Estado do campo: ${STATES.find((s) => s.value === state)?.label}`}
      </span>
    </HomeSection>
  );
}
