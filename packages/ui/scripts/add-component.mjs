// Wrapper do `shadcn add` para o @multiclubes/ui.
//
// O registry do shadcn passou a publicar os componentes com `import { cn } from "cn"`
// e o CLI não reescreve esse import para o alias `utils` do components.json; além disso,
// instala o pacote npm `cn`, que não tem relação com o projeto. Este script roda o
// CLI, corrige os imports e remove essa dependência.
//
// Uso: pnpm --filter @multiclubes/ui add-component button badge

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SHADCN_VERSION = "4.22.1";
const UTILS_IMPORT = "@multiclubes/ui/lib/utils";

const packageDir = fileURLToPath(new URL("..", import.meta.url));
const srcDir = join(packageDir, "src");
const components = process.argv.slice(2);

if (components.length === 0) {
  console.error(
    "Informe ao menos um componente. Ex.: pnpm --filter @multiclubes/ui add-component button",
  );
  process.exit(1);
}

// No Windows o pnpm é um .cmd e só roda via shell; por isso os argumentos são validados
// e o comando é montado como uma única string.
const invalid = components.find((arg) => !/^[\w@/.:-]+$/.test(arg));
if (invalid) {
  console.error(`Argumento inválido: ${invalid}`);
  process.exit(1);
}

const pnpm = (args) =>
  execFileSync(`pnpm ${args.join(" ")}`, { cwd: packageDir, stdio: "inherit", shell: true });

pnpm(["dlx", `shadcn@${SHADCN_VERSION}`, "add", ...components]);

for (const entry of readdirSync(srcDir, { recursive: true })) {
  if (!/\.tsx?$/.test(entry)) continue;
  const file = join(srcDir, entry);
  const content = readFileSync(file, "utf8");
  const fixed = content.replaceAll(/from ["']cn["']/g, `from "${UTILS_IMPORT}"`);
  if (fixed !== content) {
    writeFileSync(file, fixed);
    console.log(`import de cn corrigido: ${entry}`);
  }
}

const pkg = JSON.parse(readFileSync(join(packageDir, "package.json"), "utf8"));
if (pkg.dependencies?.cn || pkg.devDependencies?.cn) {
  pnpm(["remove", "cn"]);
}
