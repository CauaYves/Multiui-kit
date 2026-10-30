import { MetricCard } from "@multiclubes/ui/components/metric-card";
import { CurrencyCircleDollarIcon } from "@phosphor-icons/react/dist/ssr";

export default function MetricCardDemo() {
  return (
    <MetricCard
      className="w-full max-w-xs"
      icon={<CurrencyCircleDollarIcon />}
      title="Receita"
      value="R$ 12.345"
      change="+10% vs período anterior"
      trend="positive"
    />
  );
}
