"use client";

import { BackdropText } from "@multiclubes/ui/components/backdrop-text";
import { BrandCard, BrandCardContent } from "@multiclubes/ui/components/brand-card";
import { BrandLoader } from "@multiclubes/ui/components/brand-loader";
import { Button } from "@multiclubes/ui/components/button";
import { GradientPanel } from "@multiclubes/ui/components/gradient-panel";
import { MosaicLoader } from "@multiclubes/ui/components/mosaic-loader";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

const CARDS = [
  { seed: 3, side: "end", title: "Título de destaque" },
  { seed: 5, side: "start", title: "Outro destaque" },
  { seed: 3, side: "end", title: "Mais um destaque" },
] as const;

export function MarketingPreview() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <GradientPanel className="flex flex-col items-start gap-4">
        <h2 className="max-w-[16ch] font-heading text-4xl leading-none font-bold tracking-tight md:text-5xl">
          Título principal da página
        </h2>
        <p className="max-w-[44ch] text-muted-foreground">
          Texto de apoio com uma descrição curta do que está sendo apresentado.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="lg">
            Ação principal
            <ArrowUpRightIcon data-icon="inline-end" />
          </Button>
          <Button size="lg" variant="outline">
            Ação secundária
          </Button>
        </div>
      </GradientPanel>

      <BackdropText
        text="Título"
        className="flex min-h-64 items-center rounded-surface bg-muted/50 p-6 md:p-10"
      >
        <div className="relative flex max-w-[40ch] flex-col gap-3">
          <h3 className="font-heading text-2xl font-semibold tracking-tight">Seção em destaque</h3>
          <p className="text-muted-foreground">Texto da seção sobre a palavra ao fundo.</p>
          <Button className="self-start">Saiba mais</Button>
        </div>
      </BackdropText>

      <div className="grid gap-4 md:grid-cols-3">
        {CARDS.map((card, index) => (
          <BrandCard
            // biome-ignore lint/suspicious/noArrayIndexKey: lista estática
            key={index}
            seed={card.seed}
            side={card.side}
            variant={index === 1 ? "primary" : "highlight"}
            className="aspect-video min-h-0"
          >
            <BrandCardContent
              className={
                card.side === "start" ? "items-start justify-end" : "items-end justify-end"
              }
            >
              <p className="font-heading text-xl font-bold tracking-tight">{card.title}</p>
              <p className="text-sm">Texto de apoio.</p>
            </BrandCardContent>
          </BrandCard>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-surface bg-card ring-1 ring-foreground/10">
          <MosaicLoader />
        </div>
        <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-surface bg-card ring-1 ring-foreground/10">
          <BrandLoader loop />
        </div>
      </div>
    </div>
  );
}
