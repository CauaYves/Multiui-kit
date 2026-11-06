import { cn } from "cn";
import type * as React from "react";
import { Reveal } from "./reveal";

/** Seção da home: filete no topo, eyebrow mono, título grande e conteúdo, sempre no mesmo ritmo. */
export function HomeSection({
  n,
  id,
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  n: number;
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    // A primeira seção encosta no hero: sem filete separando os dois.
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className={cn("border-t border-border py-24 first-of-type:border-t-0 md:py-32", className)}
    >
      <div className="container-wrapper">
        <div className="mx-auto flex max-w-6xl flex-col gap-14 px-4 md:gap-20">
          <Reveal className="flex flex-col gap-6">
            <p
              aria-hidden
              className="font-mono text-xs tracking-wider text-muted-foreground uppercase"
            >
              {String(n).padStart(2, "0")} — {eyebrow}
            </p>
            <span className="sr-only">{eyebrow}</span>
            <h2
              id={`${id}-titulo`}
              className="max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl md:text-7xl"
            >
              {title}
            </h2>
            {description ? (
              <p className="max-w-xl text-base text-pretty text-muted-foreground md:text-lg">
                {description}
              </p>
            ) : null}
          </Reveal>
          {children}
        </div>
      </div>
    </section>
  );
}
