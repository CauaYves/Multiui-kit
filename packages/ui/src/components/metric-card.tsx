import { TrendDownIcon, TrendUpIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "cn";
import type * as React from "react";

// Símbolo de moeda no começo do valor ("R$ 18.306"), desenhado menor e elevado.
const CURRENCY_PREFIX = /^(R\$|US\$|\$|€)\s*/;

function MetricValue({ value }: { value: React.ReactNode }) {
  if (typeof value !== "string" && typeof value !== "number") return value;

  const text = String(value);
  const match = text.match(CURRENCY_PREFIX);
  if (!match) return text;

  // O texto continua inteiro e na mesma ordem no DOM: o leitor de tela lê "R$ 18.306".
  return (
    <>
      <span className="align-super text-[0.55em] font-medium">{match[1]}</span>
      {text.slice(match[0].length)}
    </>
  );
}

function MetricCard({
  icon,
  title,
  value,
  change,
  trend,
  footer,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  icon?: React.ReactNode;
  title: React.ReactNode;
  /** Valor já formatado, ex. "R$ 18.306" ou 1.204. */
  value: React.ReactNode;
  /** Texto da variação, ex. "+12,5% vs 2024". Sem ele a linha de variação não aparece. */
  change?: React.ReactNode;
  /** Direção da variação. Sem ela a variação fica neutra. */
  trend?: "positive" | "negative";
  footer?: React.ReactNode;
}) {
  return (
    <div
      data-slot="metric-card"
      className={cn(
        // @container: o conteúdo reage à largura do card, não da tela, então se comporta
        // igual em grade de 2, 3 ou 4 colunas. --metric-accent troca a cor do ícone e do halo.
        "@container/metric-card relative isolate flex h-full min-h-36 flex-col justify-between overflow-hidden rounded-surface bg-card p-4 text-card-foreground shadow-md ring-1 ring-foreground/5 [--metric-accent:var(--primary)] @[15rem]/metric-card:p-5 dark:ring-foreground/10",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-8 -right-8 -z-10 size-28 rounded-full bg-(--metric-accent)/10 @[18rem]/metric-card:size-32"
      />
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-xs leading-snug font-medium wrap-break-word text-muted-foreground @[15rem]/metric-card:text-sm">
          {title}
        </p>
        {icon && (
          <span
            data-slot="metric-card-icon"
            className="flex size-9 shrink-0 items-center justify-center rounded-field bg-(--metric-accent)/15 text-(--metric-accent) [&_svg:not([class*='size-'])]:size-5"
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="font-heading text-2xl leading-none font-semibold tracking-tight text-foreground tabular-nums @[13rem]/metric-card:text-3xl @[18rem]/metric-card:text-4xl">
          <MetricValue value={value} />
        </p>
        {change && (
          <p
            data-trend={trend}
            className={cn(
              "mt-2.5 flex items-center gap-1 text-xs font-medium text-muted-foreground",
              trend === "positive" && "text-emerald-600 dark:text-emerald-400",
              trend === "negative" && "text-destructive",
            )}
          >
            {/* A seta informa a direção sem depender só da cor. */}
            {trend === "positive" && <TrendUpIcon aria-hidden weight="bold" className="size-3.5" />}
            {trend === "negative" && (
              <TrendDownIcon aria-hidden weight="bold" className="size-3.5" />
            )}
            <span className="min-w-0 wrap-break-word tabular-nums">{change}</span>
          </p>
        )}
      </div>
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}

export { MetricCard };
