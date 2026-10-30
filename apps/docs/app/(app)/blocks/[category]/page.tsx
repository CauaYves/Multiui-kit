import { notFound } from "next/navigation";
import { BLOCK_CATEGORIES, BLOCKS } from "@/blocks";
import { BlockList } from "@/components/block-list";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOCK_CATEGORIES.filter((category) => category.slug !== "featured").map((category) => ({
    category: category.slug,
  }));
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!BLOCK_CATEGORIES.some((entry) => entry.slug === category)) notFound();

  return <BlockList blocks={BLOCKS.filter((block) => block.categories.includes(category))} />;
}
