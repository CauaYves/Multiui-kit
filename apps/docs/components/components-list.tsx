import Link from "next/link";
import { getComponentPages } from "@/lib/docs";

export function ComponentsList() {
  return (
    <div className="not-typeset mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
      {getComponentPages().map((page) => (
        <Link
          key={page.url}
          href={page.url}
          className="text-lg font-medium underline-offset-4 hover:underline md:text-base"
        >
          {page.title}
        </Link>
      ))}
    </div>
  );
}
