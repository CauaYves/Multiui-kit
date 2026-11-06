import { BrandCard, BrandCardContent } from "@multiclubes/ui/components/brand-card";
import { Button } from "@multiclubes/ui/components/button";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";

export default function BrandCardSide() {
  return (
    <BrandCard side="start" className="aspect-video w-full max-w-lg">
      <BrandCardContent className="items-start justify-end text-left">
        <h3 className="max-w-[12ch] font-heading text-3xl leading-none font-bold tracking-tight">
          Título de destaque
        </h3>
        <p className="max-w-[28ch] text-sm">Texto de apoio do cartão.</p>
        <Button className="mt-1">
          Ação
          <ArrowUpRightIcon data-icon="inline-end" />
        </Button>
      </BrandCardContent>
    </BrandCard>
  );
}
