import { Alert, AlertDescription, AlertTitle } from "@multiclubes/ui/components/alert";
import { cn } from "cn";
import type * as React from "react";

export function Callout({
  title,
  children,
  icon,
  className,
  ...props
}: React.ComponentProps<typeof Alert> & { icon?: React.ReactNode; title?: string }) {
  return (
    <Alert
      className={cn(
        "not-typeset mt-6 w-auto rounded-item border-surface bg-surface text-surface-foreground md:-mx-1 **:[a]:font-medium **:[a]:underline **:[a]:decoration-current/30 **:[a]:hover:decoration-current **:[code]:border",
        className,
      )}
      {...props}
    >
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="text-card-foreground/80">{children}</AlertDescription>
    </Alert>
  );
}
