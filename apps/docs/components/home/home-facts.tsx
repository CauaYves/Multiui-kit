import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { HomeSection } from "./home-section";
import { Reveal } from "./reveal";

export function HomeFacts({
  componentCount,
  blockCount,
  colorCount,
}: {
  componentCount: number;
  blockCount: number;
  colorCount: number;
}) {
  const facts = [
    { value: componentCount, label: "componentes prontos para uso.", href: "/docs/components" },
    { value: blockCount, label: "blocos de tela montados com eles.", href: "/blocks" },
    { value: colorCount, label: "tokens de cor no tema.", href: "/docs/marca" },
    { value: 2, label: "temas, claro e escuro.", href: "/create" },
    { value: 6, label: "pesos de ícone, numa só família (Phosphor).", href: "/docs/components" },
  ];

  return (
    <HomeSection
      n={5}
      id="numeros"
      eyebrow="Em números"
      title="Tudo contado direto do código"
      description="O que o Mosaico oferece hoje. Cada número leva à sua documentação."
    >
      <ul className="-mt-6 grid border-b border-border md:grid-cols-2">
        {facts.map((f, i) => (
          <li
            key={f.label}
            className="flex border-t border-border md:odd:border-r md:last:odd:col-span-2 md:last:odd:border-r-0"
          >
            <Reveal delay={i * 60} className="flex w-full">
              <Link
                href={f.href}
                className="group flex w-full flex-col gap-8 py-8 outline-none focus-visible:bg-muted/40 md:px-8 md:py-10"
              >
                <span aria-hidden className="font-mono text-sm text-muted-foreground tabular-nums">
                  {i + 1}.
                </span>
                <span className="sr-only">{f.value} </span>
                <span
                  aria-hidden
                  className="font-heading text-[6rem] leading-[0.85] font-semibold tracking-tighter tabular-nums sm:text-[8rem] lg:text-[10rem]"
                >
                  {f.value}
                </span>
                <span className="flex items-end justify-between gap-6">
                  <span className="max-w-[16rem] text-base text-muted-foreground">{f.label}</span>
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium tracking-wider uppercase group-hover:text-primary">
                    Explorar<span className="sr-only"> {f.label.replace(/\.$/, "")}</span>
                    <ArrowRightIcon
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                    />
                  </span>
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
