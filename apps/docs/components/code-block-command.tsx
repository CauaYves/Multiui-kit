"use client";

import { Button } from "@multiclubes/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@multiclubes/ui/components/tabs";
import { CheckIcon, CopyIcon, TerminalIcon } from "@phosphor-icons/react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { usePackageManager } from "@/hooks/use-package-manager";

export function CodeBlockCommand({
  __npm__,
  __yarn__,
  __pnpm__,
  __bun__,
}: {
  __npm__?: string;
  __yarn__?: string;
  __pnpm__?: string;
  __bun__?: string;
}) {
  const [packageManager, setPackageManager] = usePackageManager();
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const tabs = { pnpm: __pnpm__, npm: __npm__, yarn: __yarn__, bun: __bun__ };

  return (
    <div className="overflow-x-auto">
      <Tabs
        value={packageManager}
        className="gap-0"
        onValueChange={(value) => setPackageManager(value as keyof typeof tabs)}
      >
        <div className="flex items-center gap-2 border-b border-border/50 px-3 py-1">
          <div className="flex size-4 items-center justify-center rounded-[1px] bg-foreground opacity-70">
            <TerminalIcon className="size-3 text-code" />
          </div>
          <TabsList className="rounded-none bg-transparent p-0">
            {Object.keys(tabs).map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="h-7 border border-transparent pt-0.5 shadow-none! data-active:border-input data-active:bg-background!"
              >
                {key}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="no-scrollbar overflow-x-auto">
          {Object.entries(tabs).map(([key, value]) => (
            <TabsContent key={key} value={key} className="mt-0 px-4 py-3.5">
              <pre>
                <code className="relative font-mono text-sm leading-none" data-language="bash">
                  {value}
                </code>
              </pre>
            </TabsContent>
          ))}
        </div>
      </Tabs>
      <Button
        data-slot="copy-button"
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 z-10 size-7 opacity-70 hover:opacity-100 focus-visible:opacity-100"
        onClick={() => copyToClipboard(tabs[packageManager] ?? "")}
      >
        <span className="sr-only">Copiar</span>
        {isCopied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  );
}
