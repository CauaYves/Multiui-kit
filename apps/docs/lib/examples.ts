import { Examples } from "@/examples/__index__";
import { MulticlubesExamples } from "@/examples-multiclubes";

/** Carregador de um exemplo, procurando nos do shadcn/ui e nos da Multiclubes. */
export function getExample(name: string) {
  return Examples[name] ?? MulticlubesExamples[name];
}
