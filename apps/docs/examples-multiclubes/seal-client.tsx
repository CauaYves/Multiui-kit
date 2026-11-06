import { Seal } from "@multiclubes/ui/components/seal";

export default function SealClient() {
  return (
    <div className="flex items-center gap-6">
      <Seal tone="brand" label="Cliente Multiclubes" className="size-32">
        <span className="font-heading text-4xl font-bold tracking-tight">AB</span>
      </Seal>
      <Seal label="Cliente Multiclubes" className="size-32">
        <span className="font-heading text-4xl font-bold tracking-tight">AB</span>
      </Seal>
    </div>
  );
}
