import { BackdropText } from "@multiclubes/ui/components/backdrop-text";

export default function BackdropTextColors() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <BackdropText
        text="Palavra"
        position="top-start"
        textClassName="text-primary/10"
        className="h-48 rounded-surface bg-highlight"
      />
      <BackdropText
        text="Palavra"
        position="bottom-end"
        textClassName="text-primary-foreground/10"
        className="h-48 rounded-surface bg-primary"
      />
    </div>
  );
}
