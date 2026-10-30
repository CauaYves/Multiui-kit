import Link from "next/link";
import { LogoWordmark } from "@/components/logo";
import { SECTIONS } from "@/lib/docs";

// Endpoints de texto: não são páginas, então usam <a> e não <Link>.
const IA_ENDPOINTS = [
  { title: "llms.txt", href: "/llms.txt" },
  { title: "Markdown puro", href: "/md/para-ia" },
];

const COLUMNS = [
  { title: "Documentação", items: SECTIONS.filter((item) => item.group === "docs") },
  { title: "Princípios", items: SECTIONS.filter((item) => item.group === "principios") },
  { title: "Para IA", items: SECTIONS.filter((item) => item.group === "ia") },
];

const linkClassName = "text-sm text-muted-foreground transition-colors hover:text-foreground";

export function SiteFooter() {
  return (
    <footer className="bg-muted/50 group-has-data-[slot=docs]/layout:hidden group-has-data-[slot=create]/layout:hidden">
      <div className="container-wrapper px-6">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 py-12 md:flex-row md:justify-between">
          <Link href="/" aria-label="Mosaico, página inicial" className="w-fit">
            <LogoWordmark className="h-6 w-auto" />
          </Link>
          <nav aria-label="Rodapé" className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-16">
            {COLUMNS.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <p className="text-sm font-medium">{column.title}</p>
                <ul className="flex flex-col gap-2">
                  {column.items.map((item) => (
                    <li key={item.url}>
                      <Link href={item.url} className={linkClassName}>
                        {item.title}
                      </Link>
                    </li>
                  ))}
                  {column.title === "Para IA" &&
                    IA_ENDPOINTS.map((endpoint) => (
                      <li key={endpoint.href}>
                        <a href={endpoint.href} className={linkClassName}>
                          {endpoint.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mx-auto flex w-full max-w-5xl items-center pb-8">
          <p className="text-xs text-muted-foreground">© Multiclubes</p>
        </div>
      </div>
    </footer>
  );
}
