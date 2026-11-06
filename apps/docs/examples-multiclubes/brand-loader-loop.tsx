import { BrandLoader } from "@multiclubes/ui/components/brand-loader";

export default function BrandLoaderLoop() {
  return (
    <div className="flex flex-col items-center gap-3">
      <BrandLoader loop label="Carregando dados" />
      <p className="text-sm text-muted-foreground">Carregando dados...</p>
    </div>
  );
}
