import { BrandCard, BrandCardContent } from "@multiclubes/ui/components/brand-card";

const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function BrandCardSeeds() {
  return (
    <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
      {SEEDS.map((seed) => (
        <BrandCard
          key={seed}
          seed={seed}
          variant={seed % 2 ? "highlight" : "primary"}
          className="aspect-video min-h-0"
        >
          <BrandCardContent className="items-end justify-end p-4 @md/brand-card:p-4">
            <p className="font-heading text-sm font-bold">seed={seed}</p>
          </BrandCardContent>
        </BrandCard>
      ))}
    </div>
  );
}
