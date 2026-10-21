# Multiui-kit

Kit de UI compartilhado da Multiclubes: design tokens, componentes React e configurações comuns, publicados como pacotes para que todas as aplicações sigam o mesmo padrão visual e de código.

Objetivo, arquitetura e plano de execução: [docs/plano.md](docs/plano.md).

## Estrutura

| Caminho | Descrição |
| --- | --- |
| `packages/ui` | `@multiclubes/ui`: componentes React (shadcn/ui + Base UI) e tema Tailwind v4 |
| `packages/typescript-config` | `@multiclubes/typescript-config`: tsconfigs compartilhados |
| `packages/biome-config` | `@multiclubes/biome-config`: configuração base do Biome |
| `apps/docs` | Catálogo/documentação dos componentes (porta 3001) |
| `apps/web` | Playground que consome o kit como um app real (porta 3000) |

## Desenvolvimento

Requisitos: Node.js >= 24 e pnpm 12.

```sh
pnpm install
pnpm dev            # sobe todos os apps
pnpm build          # build de todos os pacotes e apps
pnpm check-types    # verificação de tipos
pnpm test           # testes (Vitest)
pnpm lint           # Biome (lint + formatação)
pnpm lint:fix       # aplica as correções do Biome
```

Para rodar só um app: `pnpm exec turbo dev --filter=web`.

## Adicionando componentes

Use o script do pacote `ui`, não o `shadcn add` direto:

```sh
pnpm --filter @multiclubes/ui add-component dialog
```

O registry do shadcn publica os componentes com `import { cn } from "cn"` e o CLI não reescreve esse import. O script roda o CLI, corrige o import para `@multiclubes/ui/lib/utils` e remove o pacote npm `cn` que o CLI instala.

Depois de adicionado, o componente é nosso: ajuste ao padrão do kit, escreva testes (`*.test.tsx` ao lado do componente) e documente no `apps/docs`.

## Usando o kit em um app

```css
/* app/globals.css */
@import "tailwindcss";
@import "@multiclubes/ui/styles.css";
```

```tsx
import { Button } from "@multiclubes/ui/components/button";
```

Enquanto o pacote não é publicado (Fase 4), apps Next.js do monorepo precisam de `transpilePackages: ["@multiclubes/ui"]` no `next.config.js`.
