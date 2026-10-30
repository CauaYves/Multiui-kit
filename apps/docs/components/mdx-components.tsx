import { Alert, AlertDescription, AlertTitle } from "@multiclubes/ui/components/alert";
import { Button } from "@multiclubes/ui/components/button";
import { Kbd } from "@multiclubes/ui/components/kbd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@multiclubes/ui/components/tabs";
import { ArrowSquareOutIcon, InfoIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "cn";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Callout } from "@/components/callout";
import { CodeBlockCommand } from "@/components/code-block-command";
import { ComponentPreview } from "@/components/component-preview";
import { ComponentSource } from "@/components/component-source";
import { ComponentsList } from "@/components/components-list";
import { CopyButton } from "@/components/copy-button";
import { Installation } from "@/components/installation";
import { headingId } from "@/lib/docs";

function getNodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getNodeText(node.props.children);
  }
  return "";
}

function HeadingAnchor({ id, children }: { id?: string; children: React.ReactNode }) {
  if (!id) return children;
  return (
    <a className="group no-underline" href={`#${id}`}>
      <span className="underline-offset-4 group-hover:underline">{children}</span>
      <span
        aria-hidden="true"
        className="ml-2 text-muted-foreground opacity-0 group-hover:opacity-100"
      >
        #
      </span>
    </a>
  );
}

function heading(Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  return function Heading({ children, id, ...props }: React.ComponentProps<typeof Tag>) {
    const resolvedId = id ?? (headingId(getNodeText(children)) || undefined);
    return (
      <Tag id={resolvedId} {...props}>
        <HeadingAnchor id={resolvedId}>{children}</HeadingAnchor>
      </Tag>
    );
  };
}

type CodeProps = React.ComponentProps<"code"> & {
  __raw__?: string;
  __npm__?: string;
  __yarn__?: string;
  __pnpm__?: string;
  __bun__?: string;
};

export const mdxComponents = {
  h1: heading("h1"),
  h2: heading("h2"),
  h3: heading("h3"),
  h4: heading("h4"),
  h5: heading("h5"),
  h6: heading("h6"),
  table: (props: React.ComponentProps<"table">) => (
    <div className="no-scrollbar overflow-x-auto *:[table]:w-full">
      <table {...props} />
    </div>
  ),
  pre: ({ className, ...props }: React.ComponentProps<"pre">) => (
    <pre
      data-not-typeset
      className={cn(
        "no-scrollbar min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain overscroll-y-auto px-4 py-3.5 outline-none has-data-highlighted-line:px-0 has-data-line-numbers:px-0",
        className,
      )}
      {...props}
    />
  ),
  figcaption: ({ className, ...props }: React.ComponentProps<"figcaption">) => (
    <figcaption
      className={cn("flex items-center gap-2 text-code-foreground", className)}
      {...props}
    />
  ),
  code: ({ __raw__, __npm__, __yarn__, __pnpm__, __bun__, ...props }: CodeProps) => {
    if (typeof props.children === "string") return <code {...props} />;
    if (__npm__ && __yarn__ && __pnpm__ && __bun__) {
      return (
        <CodeBlockCommand
          __npm__={__npm__}
          __yarn__={__yarn__}
          __pnpm__={__pnpm__}
          __bun__={__bun__}
        />
      );
    }
    return (
      <>
        {__raw__ && <CopyButton value={__raw__} />}
        <code {...props} />
      </>
    );
  },
  Step: (props: React.ComponentProps<"h3">) => <h3 {...props} />,
  Steps: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
      className={cn(
        "steps mb-12 [counter-reset:step] md:ml-4 md:border-l md:pl-8 [&>h3]:step",
        className,
      )}
      {...props}
    />
  ),
  Image: ({ src, className, width, height, alt }: React.ComponentProps<"img">) => (
    <Image
      className={cn("mt-6 rounded-item border", className)}
      src={typeof src === "string" ? src : ""}
      width={Number(width)}
      height={Number(height)}
      alt={alt ?? ""}
    />
  ),
  Tabs: ({ className, ...props }: React.ComponentProps<typeof Tabs>) => (
    <Tabs className={cn("not-typeset relative mt-6 w-full", className)} {...props} />
  ),
  TabsList: (props: React.ComponentProps<typeof TabsList>) => (
    <TabsList variant="line" {...props} />
  ),
  TabsTrigger,
  TabsContent: ({ className, ...props }: React.ComponentProps<typeof TabsContent>) => (
    <TabsContent
      className={cn("relative *:[figure]:first:mt-0 [&>.steps]:mt-6", className)}
      {...props}
    />
  ),
  // As abas de instalação do shadcn (CLI/manual) começam na CLI.
  CodeTabs: (props: React.ComponentProps<typeof Tabs>) => (
    <Tabs defaultValue="cli" className="not-typeset relative mt-6 w-full" {...props} />
  ),
  Button: ({ className, ...props }: React.ComponentProps<typeof Button>) => (
    <Button className={cn("not-typeset", className)} {...props} />
  ),
  Alert,
  AlertTitle,
  AlertDescription,
  Callout,
  ComponentPreview,
  ComponentSource,
  ComponentsList,
  Installation,
  Kbd,
  Link,
  // Ícones que os MDX do shadcn importam de lucide/tabler (o sync remove esses imports).
  ExternalLinkIcon: ArrowSquareOutIcon,
  IconInfoCircle: InfoIcon,
  InfoIcon,
};
