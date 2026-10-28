// Gera skills/mosaico-design/references/principios.md a partir de content/docs/para-ia.mdx.
//   node scripts/sync-ia.mjs          escreve o arquivo
//   node scripts/sync-ia.mjs --check  falha se o arquivo estiver desatualizado (usado na CI)
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { skillReference } from "../lib/ia.ts";

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(
  docsRoot,
  "..",
  "..",
  "skills",
  "mosaico-design",
  "references",
  "principios.md",
);
const expected = skillReference(docsRoot);

if (process.argv.includes("--check")) {
  let current = "";
  try {
    current = readFileSync(target, "utf8");
  } catch {}
  if (current.replace(/\r\n/g, "\n") !== expected) {
    console.error('A referência da skill está desatualizada. Rode "pnpm --filter docs sync:ia".');
    process.exit(1);
  }
  console.log("Referência da skill em dia.");
} else {
  writeFileSync(target, expected);
  console.log(`Escrito: ${target}`);
}
