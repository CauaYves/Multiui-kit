"use client";

import * as React from "react";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

const STORAGE_KEY = "multiui-docs:package-manager";
const listeners = new Set<() => void>();

function read(): PackageManager {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "npm" || value === "yarn" || value === "bun") return value;
  } catch {}
  return "pnpm";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Gerenciador de pacotes escolhido nos blocos de comando, compartilhado entre eles. */
export function usePackageManager() {
  const value = React.useSyncExternalStore(subscribe, read, () => "pnpm" as const);
  const setValue = React.useCallback((next: PackageManager) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    for (const listener of listeners) listener();
  }, []);
  return [value, setValue] as const;
}
