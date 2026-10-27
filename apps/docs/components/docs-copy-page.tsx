"use client";

import { Button } from "@multiclubes/ui/components/button";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

/** Copia o MDX da página, para colar em um chat de IA ou em uma issue. */
export function DocsCopyPage({ page }: { page: string }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <Button
      variant="secondary"
      size="sm"
      className="h-8 shadow-none md:h-7 md:text-[0.8rem]"
      onClick={() => copyToClipboard(page)}
    >
      {isCopied ? <CheckIcon /> : <CopyIcon />}
      Copiar página
    </Button>
  );
}
