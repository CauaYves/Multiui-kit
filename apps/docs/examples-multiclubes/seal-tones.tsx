import { Seal } from "@multiclubes/ui/components/seal";

export default function SealTones() {
  return (
    <div className="flex items-center gap-6">
      <Seal tone="default" />
      <Seal tone="brand" />
      <div className="rounded-lg bg-foreground p-4">
        <Seal tone="inverse" />
      </div>
    </div>
  );
}
