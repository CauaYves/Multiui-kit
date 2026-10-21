"use client";

import { Button } from "@multiclubes/ui/components/button";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import * as React from "react";
import { copyToClipboard } from "@/components/copy-button";

/** Copia o MDX da página, para colar em um chat de IA ou em uma issue. */
export function DocsCopyPage({ page }: { page: string }) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (!hasCopied) return;
    const timer = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [hasCopied]);

  return (
    <Button
      variant="secondary"
      size="sm"
      className="h-8 shadow-none md:h-7 md:text-[0.8rem]"
      onClick={async () => {
        if (await copyToClipboard(page)) setHasCopied(true);
      }}
    >
      {hasCopied ? <CheckIcon /> : <CopyIcon />}
      Copiar página
    </Button>
  );
}
