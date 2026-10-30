import { BlockLoaders } from "@/blocks";
import { Examples } from "@/examples/__index__";
import { MulticlubesExamples } from "@/examples-multiclubes";

/** Carregador de um exemplo, procurando nos do shadcn/ui, nos da Multiclubes e nos blocos. */
export function getExample(name: string) {
  return Examples[name] ?? MulticlubesExamples[name] ?? BlockLoaders[name];
}
