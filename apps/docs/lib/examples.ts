import { BlockLoaders } from "@/blocks";
import { Examples } from "@/examples/__index__";
import { MulticlubesExamples } from "@/examples-multiclubes";
import { InterfaceLoaders } from "@/interfaces";

/** Carregador de um exemplo, procurando nos do shadcn/ui, nos da Multiclubes, nos blocos e nas interfaces. */
export function getExample(name: string) {
  return (
    MulticlubesExamples[name] ?? Examples[name] ?? BlockLoaders[name] ?? InterfaceLoaders[name]
  );
}

const EXAMPLE_NAMES = [
  ...Object.keys(Examples),
  ...Object.keys(MulticlubesExamples),
  ...Object.keys(BlockLoaders),
  ...Object.keys(InterfaceLoaders),
];

/**
 * Carregador da prévia de um componente: o exemplo `name` exato ou, na falta dele, o primeiro
 * cujo nome começa por `base` (ex. "code-block" -> "code-block-actions").
 */
export function findExample(name: string, base?: string) {
  const exact = getExample(name);
  if (exact) return exact;
  if (!base) return undefined;
  const match =
    EXAMPLE_NAMES.find((key) => key === `${base}-demo`) ??
    EXAMPLE_NAMES.find((key) => key.startsWith(`${base}-`));
  return match ? getExample(match) : undefined;
}
