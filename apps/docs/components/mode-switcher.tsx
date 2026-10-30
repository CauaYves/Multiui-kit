"use client";

import { ThemeToggle } from "@multiclubes/ui/components/theme-toggle";
import { useTheme } from "next-themes";

export function ModeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <ThemeToggle
      theme={resolvedTheme}
      onThemeChange={setTheme}
      className="extend-touch-target size-8"
    />
  );
}
