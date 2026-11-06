import { MoonIcon, SunIcon } from "@multiclubes/ui/components/theme-toggle";

export default function ThemeToggleIcons() {
  return (
    <div className="flex items-center gap-6 text-foreground">
      <SunIcon className="size-6" />
      <MoonIcon className="size-6" />
    </div>
  );
}
