"use client";

import { Button } from "@multiclubes/ui/components/button";
import { Separator } from "@multiclubes/ui/components/separator";
import { cn } from "cn";
import * as React from "react";

/** Mostra o código truncado, com botões para expandir e recolher. */
export function CodeCollapsibleWrapper({ className, children }: React.ComponentProps<"div">) {
  const [isOpened, setIsOpened] = React.useState(false);
  const label = isOpened ? "Recolher" : "Expandir";
  const toggle = () => setIsOpened((open) => !open);

  return (
    <div data-open={isOpened} className={cn("group/collapsible relative md:-mx-1", className)}>
      <div className="absolute top-1.5 right-9 z-10 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 rounded-md px-2 text-muted-foreground"
          onClick={toggle}
        >
          {label}
        </Button>
        <Separator orientation="vertical" className="mx-1.5 h-4!" />
      </div>
      <div
        className={cn(
          "relative mt-6 overflow-hidden [&>figure]:mt-0 [&>figure]:md:mx-0!",
          !isOpened && "max-h-64 [content-visibility:auto]",
        )}
      >
        {children}
      </div>
      {!isOpened && (
        <button
          type="button"
          onClick={toggle}
          className="absolute inset-x-0 -bottom-2 flex h-20 items-center justify-center rounded-b-lg bg-gradient-to-b from-code/70 to-code text-sm text-muted-foreground"
        >
          {label}
        </button>
      )}
    </div>
  );
}
