import { Button } from "@multiclubes/ui/components/button";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComponentPreview } from "@/components/component-preview";
import { INTERFACES } from "@/interfaces";

export const dynamicParams = false;

export function generateStaticParams() {
  return INTERFACES.map((entry) => ({ name: entry.name }));
}

type Props = { params: Promise<{ name: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const entry = INTERFACES.find((item) => item.name === name);
  if (!entry) notFound();
  return { title: entry.title, description: entry.description };
}

// Página de uma seção: prévia em largura total e o código do exemplo.
export default async function Page({ params }: Props) {
  const { name } = await params;
  const entry = INTERFACES.find((item) => item.name === name);
  if (!entry) notFound();

  return (
    <div className="container-wrapper flex flex-1 flex-col px-6">
      <div className="mx-auto flex w-full max-w-350 flex-1 flex-col gap-6 py-10">
        <div className="flex flex-col gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit"
            nativeButton={false}
            render={<Link href="/interfaces" />}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            Interfaces
          </Button>
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {entry.category}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{entry.title}</h1>
          <p className="max-w-2xl text-muted-foreground sm:text-lg">{entry.description}</p>
        </div>
        <ComponentPreview name={entry.name} previewClassName="h-auto min-h-96 p-6 md:p-10" />
      </div>
    </div>
  );
}
