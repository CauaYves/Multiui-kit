"use client";

import { Button } from "@multiclubes/ui/components/button";
import { cn } from "cn";
import * as React from "react";

export function ComponentPreviewTabs({
  className,
  previewClassName,
  align = "center",
  hideCode = false,
  chromeLessOnMobile = false,
  component,
  source,
  sourcePreview,
}: {
  className?: string;
  previewClassName?: string;
  align?: "center" | "start" | "end";
  hideCode?: boolean;
  chromeLessOnMobile?: boolean;
  component: React.ReactNode;
  source: React.ReactNode;
  sourcePreview?: React.ReactNode;
}) {
  const [isCodeVisible, setIsCodeVisible] = React.useState(false);

  return (
    <div
      data-slot="component-preview"
      data-not-typeset
      className={cn(
        "group relative mt-4 mb-12 flex flex-col overflow-hidden rounded-item border",
        className,
      )}
    >
      <div data-slot="preview">
        <div
          data-align={align}
          data-chromeless={chromeLessOnMobile}
          className={cn(
            "preview relative flex h-72 w-full justify-center p-10 data-[align=center]:items-center data-[align=end]:items-start data-[align=start]:items-start data-[chromeless=true]:h-auto data-[chromeless=true]:p-0 sm:data-[align=end]:items-end",
            previewClassName,
          )}
        >
          {component}
        </div>
      </div>
      {!hideCode && (
        <div
          data-slot="code"
          className="relative overflow-hidden **:data-[slot=copy-button]:right-4 [&_[data-rehype-pretty-code-figure]]:m-0! [&_[data-rehype-pretty-code-figure]]:rounded-t-none [&_[data-rehype-pretty-code-figure]]:border-t [&_pre]:max-h-72"
        >
          {isCodeVisible ? (
            source
          ) : (
            <div className="relative **:data-[slot=copy-button]:hidden">
              {sourcePreview}
              <div className="absolute inset-0 flex items-center justify-center pb-4">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, var(--color-code), color-mix(in oklab, var(--color-code) 60%, transparent), transparent)",
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="relative z-10 rounded-lg bg-background text-foreground shadow-none hover:bg-muted dark:bg-background dark:text-foreground dark:hover:bg-muted"
                  onClick={() => setIsCodeVisible(true)}
                >
                  Ver código
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
