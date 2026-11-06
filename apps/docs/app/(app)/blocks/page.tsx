import { BLOCKS } from "@/blocks";
import { BlockList } from "@/components/block-list";

export default function Page() {
  return <BlockList blocks={BLOCKS.filter((block) => block.categories.includes("featured"))} />;
}
