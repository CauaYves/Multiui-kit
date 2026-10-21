"use client";

import { Button } from "@multiclubes/ui/components/button";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import * as React from "react";

export async function copyToClipboard(value: string) {
  if (!value || typeof window === "undefined") return false;
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function CopyButton({
  value,
  className,
  variant = "ghost",
  ...props
}: React.ComponentProps<typeof Button> & { value: string }) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (!hasCopied) return;
    const timer = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [hasCopied]);

  return (
    <Button
      data-slot="copy-button"
      data-copied={hasCopied}
      size="icon"
      variant={variant}
      className={cn(
        "absolute top-3 right-2 z-10 size-7 bg-code hover:opacity-100 focus-visible:opacity-100",
        className,
      )}
      onClick={async () => {
        if (await copyToClipboard(value)) setHasCopied(true);
      }}
      {...props}
    >
      <span className="sr-only">Copiar</span>
      {hasCopied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}
