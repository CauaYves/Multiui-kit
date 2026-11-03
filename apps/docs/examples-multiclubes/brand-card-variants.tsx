import { BrandCard, BrandCardContent } from "@multiclubes/ui/components/brand-card";

const VARIANTS = [
  { variant: "highlight", title: "Highlight" },
  { variant: "primary", title: "Primary" },
  { variant: "card", title: "Card" },
] as const;

export default function BrandCardVariants() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-3">
      {VARIANTS.map(({ variant, title }) => (
        <BrandCard key={variant} variant={variant} className="aspect-video min-h-0">
          <BrandCardContent className="items-end justify-end">
            <p className="font-heading text-2xl font-bold tracking-tight">{title}</p>
          </BrandCardContent>
        </BrandCard>
      ))}
    </div>
  );
}
