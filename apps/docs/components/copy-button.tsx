"use client";

import { Button } from "@multiclubes/ui/components/button";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import type * as React from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export function CopyButton({
  value,
  className,
  variant = "ghost",
  ...props
}: React.ComponentProps<typeof Button> & { value: string }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <Button
      data-slot="copy-button"
      data-copied={isCopied}
      size="icon"
      variant={variant}
      className={cn(
        "absolute top-3 right-2 z-10 size-7 bg-code hover:opacity-100 focus-visible:opacity-100",
        className,
      )}
      onClick={() => copyToClipboard(value)}
      {...props}
    >
      <span className="sr-only">Copiar</span>
      {isCopied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}
