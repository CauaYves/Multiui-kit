import { notFound } from "next/navigation";
import { getBlockDemos } from "@/lib/docs";
import { getExample } from "@/lib/examples";

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlockDemos().map((name) => ({ name }));
}

/** Renderiza um demo em tela cheia, para os previews do tipo "block" (iframe). */
export default async function ViewPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const load = getExample(name);
  if (!load) notFound();
  const { default: Demo } = await load();

  return (
    <div className="bg-background">
      <Demo />
    </div>
  );
}
