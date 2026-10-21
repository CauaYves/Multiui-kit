import { notFound } from "next/navigation";
import { Examples } from "@/examples/__index__";
import { getBlockDemos } from "@/lib/docs";

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlockDemos().map((name) => ({ name }));
}

/** Renderiza um demo em tela cheia, para os previews do tipo "block" (iframe). */
export default async function ViewPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const load = Examples[name];
  if (!load) notFound();
  const { default: Demo } = await load();

  return (
    <div className="bg-background">
      <Demo />
    </div>
  );
}
