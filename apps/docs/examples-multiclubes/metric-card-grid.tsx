import { MetricCard } from "@multiclubes/ui/components/metric-card";
import {
  CurrencyCircleDollarIcon,
  ReceiptIcon,
  UserMinusIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";

export default function MetricCardGrid() {
  return (
    <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
      <MetricCard
        icon={<CurrencyCircleDollarIcon />}
        title="Receita"
        value="R$ 12.345"
        change="+10% vs período anterior"
        trend="positive"
      />
      <MetricCard
        icon={<UsersThreeIcon />}
        title="Usuários ativos"
        value="1.234"
        change="+5% vs período anterior"
        trend="positive"
        style={{ "--metric-accent": "var(--chart-3)" } as React.CSSProperties}
      />
      <MetricCard
        icon={<ReceiptIcon />}
        title="Pedidos"
        value="567"
        change="Sem variação"
        style={{ "--metric-accent": "var(--chart-5)" } as React.CSSProperties}
      />
      <MetricCard
        icon={<UserMinusIcon />}
        title="Cancelamentos"
        value="89"
        change="-3% vs período anterior"
        trend="negative"
        style={{ "--metric-accent": "var(--destructive)" } as React.CSSProperties}
      />
    </div>
  );
}
