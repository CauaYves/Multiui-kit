import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@multiclubes/ui/components/card";
import { Skeleton } from "@multiclubes/ui/components/skeleton";
import { CircleDashedIcon, TrendDownIcon, TrendUpIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "cn";
import type * as React from "react";

// Variação de métrica do Card: só composição das partes do Card, sem componente próprio.
// Textos e valores de exemplo, sem domínio de negócio.

function Metric({
  icon,
  title,
  value,
  change,
  trend,
  footer,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  value: React.ReactNode;
  change?: React.ReactNode;
  trend?: "positive" | "negative";
  footer?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        {icon && (
          <CardAction>
            <span className="flex size-9 items-center justify-center rounded-field bg-primary/15 text-primary [&_svg]:size-5">
              {icon}
            </span>
          </CardAction>
        )}
        <CardTitle className="text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      {(change || footer) && (
        <CardFooter className="flex-col items-start gap-1 text-xs">
          {change && (
            // A seta informa a direção sem depender só da cor.
            <div
              className={cn(
                "flex items-center gap-1 font-medium text-muted-foreground",
                trend === "positive" && "text-emerald-600 dark:text-emerald-400",
                trend === "negative" && "text-destructive",
              )}
            >
              {trend === "positive" && (
                <TrendUpIcon aria-hidden weight="bold" className="size-3.5" />
              )}
              {trend === "negative" && (
                <TrendDownIcon aria-hidden weight="bold" className="size-3.5" />
              )}
              {change}
            </div>
          )}
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

const VARIANTS: { label: string; card: React.ReactNode }[] = [
  {
    label: "Padrão",
    card: (
      <Metric
        icon={<CircleDashedIcon />}
        title="Título da métrica"
        value="0.000"
        change="+0,0% vs período anterior"
        trend="positive"
      />
    ),
  },
  {
    label: "Variação negativa",
    card: (
      <Metric
        icon={<CircleDashedIcon />}
        title="Título da métrica"
        value="0.000"
        change="-0,0% vs período anterior"
        trend="negative"
      />
    ),
  },
  {
    label: "Variação neutra",
    card: (
      <Metric
        icon={<CircleDashedIcon />}
        title="Título da métrica"
        value="0.000"
        change="Sem variação"
      />
    ),
  },
  {
    label: "Moeda",
    card: (
      <Metric
        icon={<CircleDashedIcon />}
        title="Título da métrica"
        value="R$ 0.000"
        change="+0,0% vs período anterior"
        trend="positive"
      />
    ),
  },
  {
    label: "Sem ícone",
    card: <Metric title="Título da métrica" value="0.000" change="Texto de apoio" />,
  },
  {
    label: "Só valor",
    card: <Metric title="Título da métrica" value="0.000" />,
  },
  {
    label: "Com rodapé",
    card: (
      <Metric
        icon={<CircleDashedIcon />}
        title="Título da métrica"
        value="0.000"
        footer={<p className="text-muted-foreground">Texto de rodapé</p>}
      />
    ),
  },
  {
    label: "Carregando",
    card: (
      <Metric
        icon={<CircleDashedIcon />}
        title={<Skeleton className="h-4 w-24" />}
        value={<Skeleton className="h-8 w-20" />}
        change={<Skeleton className="h-3 w-32" />}
      />
    ),
  },
];

export default function MetricCardVariants() {
  return (
    <div className="grid w-full gap-x-4 gap-y-6 sm:grid-cols-2">
      {VARIANTS.map(({ label, card }) => (
        <div key={label} className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          {card}
        </div>
      ))}
    </div>
  );
}
