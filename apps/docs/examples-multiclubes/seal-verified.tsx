import { Seal } from "@multiclubes/ui/components/seal";

export default function SealVerified() {
  return (
    <div className="flex items-center gap-6">
      <Seal tone="verified" label="Cliente Multiclubes verificado" className="size-24" />
      <Seal tone="verified" label="Cliente Multiclubes verificado" className="size-12" />
      <Seal tone="verified" label="Cliente Multiclubes verificado" className="size-6" />
    </div>
  );
}
