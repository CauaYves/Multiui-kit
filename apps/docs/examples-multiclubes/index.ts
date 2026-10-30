// Exemplos dos componentes próprios da Multiclubes (os do shadcn ficam em examples/,
// gerados por scripts/sync-shadcn.mjs).
import type * as React from "react";

export const MulticlubesExamples: Record<string, () => Promise<{ default: React.ComponentType }>> =
  {
    "date-field-demo": () => import("./date-field-demo"),
    "date-field-drawer": () => import("./date-field-drawer"),
    "date-field-invalid": () => import("./date-field-invalid"),
    "date-wheel-picker-demo": () => import("./date-wheel-picker-demo"),
    "date-wheel-picker-format": () => import("./date-wheel-picker-format"),
    "date-wheel-picker-limits": () => import("./date-wheel-picker-limits"),
    "date-wheel-picker-states": () => import("./date-wheel-picker-states"),
    "metric-card-demo": () => import("./metric-card-demo"),
    "metric-card-grid": () => import("./metric-card-grid"),
    "theme-toggle-demo": () => import("./theme-toggle-demo"),
    "theme-toggle-icons": () => import("./theme-toggle-icons"),
  };
