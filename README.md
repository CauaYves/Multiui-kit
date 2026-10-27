# Mosaico

Design system da Multiclubes: design tokens, componentes React e configurações comuns, publicados como pacotes (`@multiclubes/*`) para que todas as aplicações sigam o mesmo padrão visual e de código.

Objetivo, arquitetura e plano de execução: [docs/plano.md](docs/plano.md).

## Estrutura

| Caminho | Descrição |
| --- | --- |
| `packages/ui` | `@multiclubes/ui`: componentes React (shadcn/ui + Base UI) e tema Tailwind v4 |
| `packages/typescript-config` | `@multiclubes/typescript-config`: tsconfigs compartilhados |
| `packages/biome-config` | `@multiclubes/biome-config`: configuração base do Biome |
| `apps/docs` | Documentação dos componentes, no formato do ui.shadcn.com (porta 3001) |
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

## Componentes

O `@multiclubes/ui` traz todos os componentes do shadcn/ui no estilo `base-luma` (Base UI + Phosphor). Para adicionar ou atualizar um componente, rode o CLI dentro de `packages/ui`:

```sh
cd packages/ui
pnpm dlx shadcn@4.22.1 add dialog --overwrite
pnpm lint:fix   # na raiz: aplica a formatação do repositório
```

Os componentes importam `cn` do pacote [`cn`](https://github.com/shadcn-ui/cn), o utilitário oficial do shadcn (substitui `clsx` + `tailwind-merge`). Apps também podem importá-lo de `@multiclubes/ui/lib/utils`.

Depois de adicionado, o componente é nosso: ajuste ao padrão do kit e escreva testes (`*.test.tsx` ao lado do componente).

Além dos componentes do shadcn, o kit tem componentes próprios da Multiclubes, trazidos do Portal: `date-wheel-picker` (roda de dia/mês/ano) e `date-field` (campo de data que usa a roda no celular e máscara no desktop). Na documentação, eles ficam em `apps/docs/content/docs/components-multiclubes` e `apps/docs/examples-multiclubes`, fora das pastas geradas pelo sync.

## Documentação

`apps/docs` reproduz a documentação do [ui.shadcn.com](https://ui.shadcn.com) para os componentes do kit. As páginas (`content/docs/components`) e os exemplos (`examples/`) são gerados a partir do repositório do shadcn/ui (MIT):

```sh
pnpm --filter docs sync:shadcn
```

O script baixa a documentação, troca os imports para `@multiclubes/ui`, substitui a seção de instalação e descarta exemplos que dependem de código interno do site do shadcn (o resumo lista quais e por quê). Não edite os arquivos gerados; as páginas próprias (`content/docs/index.mdx`, `installation.mdx`) são mantidas à mão.

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
