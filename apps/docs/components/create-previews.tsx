"use client";

import { Badge } from "@multiclubes/ui/components/badge";
import { Button } from "@multiclubes/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@multiclubes/ui/components/card";
import { Checkbox } from "@multiclubes/ui/components/checkbox";
import { DateField } from "@multiclubes/ui/components/date-field";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@multiclubes/ui/components/field";
import { Input } from "@multiclubes/ui/components/input";
import { MetricCard } from "@multiclubes/ui/components/metric-card";
import { NativeSelect, NativeSelectOption } from "@multiclubes/ui/components/native-select";
import { Switch } from "@multiclubes/ui/components/switch";
import {
  ArrowRightIcon,
  CheckIcon,
  CurrencyCircleDollarIcon,
  DotsThreeIcon,
  DownloadSimpleIcon,
  PlusIcon,
  ReceiptIcon,
  TrashIcon,
  UserMinusIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import * as React from "react";

export type CreateItem = {
  name: string;
  title: string;
  description: string;
  /** Página da documentação aberta pelo botão "Documentação". */
  docs: string;
  /** Outros termos que encontram o item na busca, como os componentes que ele usa. */
  keywords: string[];
  preview: React.ComponentType;
};

// Itens da prévia em /create. Todos os textos e valores são ilustrativos.
export const CREATE_ITEMS: CreateItem[] = [
  {
    name: "metric-card",
    title: "Metric Card",
    description: "Indicador para dashboards, com valor, ícone e variação.",
    docs: "/docs/components/metric-card",
    keywords: ["dashboard", "indicador", "kpi"],
    preview: MetricCardPreview,
  },
  {
    name: "button",
    title: "Button",
    description: "Variantes, tamanhos e ícones, com Badge.",
    docs: "/docs/components/button",
    keywords: ["botão", "badge"],
    preview: ButtonPreview,
  },
  {
    name: "form",
    title: "Formulário",
    description: "Campos, seleção, data e opções, com o botão de envio.",
    docs: "/docs/components/field",
    keywords: ["field", "input", "select", "switch", "checkbox", "date field", "campo"],
    preview: FormPreview,
  },
  {
    name: "card",
    title: "Card",
    description: "Superfície com cabeçalho, ação, conteúdo e rodapé.",
    docs: "/docs/components/card",
    keywords: ["cartão", "superfície"],
    preview: CardPreview,
  },
];

function MetricCardPreview() {
  return (
    <div className="grid gap-4 @md/preview:grid-cols-2 @4xl/preview:grid-cols-4">
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
      />
      <MetricCard icon={<ReceiptIcon />} title="Pedidos" value="567" change="Sem variação" />
      <MetricCard
        icon={<UserMinusIcon />}
        title="Cancelamentos"
        value="89"
        change="-3% vs período anterior"
        trend="negative"
      />
    </div>
  );
}

function ButtonPreview() {
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button>Principal</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Contorno</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button variant="destructive">Excluir</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Pequeno</Button>
          <Button>Padrão</Button>
          <Button size="lg">Grande</Button>
          <Button size="icon" aria-label="Adicionar">
            <PlusIcon />
          </Button>
          <Button variant="outline" size="icon" aria-label="Mais opções">
            <DotsThreeIcon />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button>
            <DownloadSimpleIcon data-icon="inline-start" />
            Baixar
          </Button>
          <Button variant="outline">
            Continuar
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button variant="destructive">
            <TrashIcon data-icon="inline-start" />
            Remover
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Novo</Badge>
          <Badge variant="secondary">Rascunho</Badge>
          <Badge variant="outline">
            <CheckIcon data-icon="inline-start" />
            Concluído
          </Badge>
          <Badge variant="destructive">Atrasado</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function FormPreview() {
  const [date, setDate] = React.useState("");

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Cadastro</CardTitle>
        <CardDescription>Preencha os dados para continuar.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="preview-name">Nome</FieldLabel>
            <Input id="preview-name" placeholder="Nome completo" />
          </Field>
          <div className="grid gap-4 @md/preview:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="preview-date">Data</FieldLabel>
              <DateField
                id="preview-date"
                label="Data"
                mode="input"
                value={date}
                onChange={setDate}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="preview-plan">Plano</FieldLabel>
              <NativeSelect id="preview-plan" defaultValue="">
                <NativeSelectOption value="">Selecione</NativeSelectOption>
                <NativeSelectOption value="a">Plano A</NativeSelectOption>
                <NativeSelectOption value="b">Plano B</NativeSelectOption>
              </NativeSelect>
            </Field>
          </div>
          <FieldSeparator />
          <Field orientation="horizontal">
            <Checkbox id="preview-terms" defaultChecked />
            <FieldLabel htmlFor="preview-terms" className="font-normal">
              Aceito os termos de uso
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="preview-news" className="flex-1 font-normal">
              Receber novidades por e-mail
            </FieldLabel>
            <Switch id="preview-news" />
          </Field>
          <FieldDescription>Você pode mudar essas opções depois.</FieldDescription>
        </FieldGroup>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">
          Cancelar
        </Button>
        <Button className="flex-1">Salvar</Button>
      </CardFooter>
    </Card>
  );
}

function CardPreview() {
  return (
    <div className="grid gap-4 @2xl/preview:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Plano anual</CardTitle>
          <CardDescription>Renovação automática.</CardDescription>
          <CardAction>
            <Badge variant="secondary">Ativo</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <p className="font-heading text-3xl font-semibold tracking-tight">R$ 1.200</p>
          <p className="text-sm text-muted-foreground">por ano, em até 12 vezes</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Ver detalhes</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Atividade recente</CardTitle>
          <CardDescription>Últimos 7 dias.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3 text-sm">
            {["Item A atualizado", "Item B criado", "Item C removido"].map((entry, index) => (
              <li key={entry} className="flex items-center justify-between gap-3">
                <span>{entry}</span>
                <span className="text-muted-foreground tabular-nums">há {index + 1} dia(s)</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Ver tudo
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
