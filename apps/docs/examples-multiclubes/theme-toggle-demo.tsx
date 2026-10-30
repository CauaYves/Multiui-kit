"use client";

import { ThemeToggle } from "@multiclubes/ui/components/theme-toggle";
import { useTheme } from "next-themes";

export default function ThemeToggleDemo() {
  const { resolvedTheme, setTheme } = useTheme();

  return <ThemeToggle theme={resolvedTheme} onThemeChange={setTheme} />;
}
