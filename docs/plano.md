# Multiui-kit — Visão e plano

> Status: rascunho · Última atualização: 2026-10-21

## 1. Contexto

A Multiclubes mantém hoje **dois projetos em Next.js estruturados como monolitos**. O principal é o **Portal** (`Applications/Portal` no repositório `MultiClubes/Code` do Azure DevOps). Cada um tem sua própria cópia de componentes de interface (botões, inputs, cards, modais, tabelas…) e de configurações (TypeScript, lint/format, Tailwind/tema, fontes).

Isso gera alguns problemas:

- **Retrabalho:** a mesma correção ou melhoria precisa ser feita duas vezes.
- **Divergência visual:** os componentes "iguais" evoluem de forma diferente em cada projeto, e o usuário percebe produtos que não parecem da mesma empresa.
- **Custo de começar algo novo:** cada nova aplicação parte do zero ou copia código de um dos monolitos, herdando a divergência.

## 2. Objetivo

Criar o **Multiui-kit**: um monorepo que concentra o que é compartilhável entre as aplicações da Multiclubes e o publica como pacotes versionados.

Objetivos concretos:

1. **Um padrão visual único e novo**, definido por design tokens (cores, tipografia, espaçamento, raios, sombras) e aplicado por um tema.
2. **Uma biblioteca de componentes React criada do zero**: acessível, tipada, documentada e consumida pelos dois monolitos.
3. **Configurações compartilhadas** (TypeScript, Biome, Tailwind/PostCSS) para que os projetos tenham o mesmo padrão de código.
4. **Publicação em um registry** para que aplicações futuras, em qualquer repositório, instalem os pacotes com `pnpm add`.
5. **Documentação viva** com exemplos de uso de cada componente.

### Fora do escopo (por enquanto)

- **Copiar ou extrair componentes dos monolitos.** Os componentes são escritos do zero neste repositório, com o estilo próprio do kit. Os monolitos servem apenas como referência de *quais* componentes são necessários e de quais restrições técnicas precisam ser respeitadas (ver [seção 3.1](#31-restrições-vindas-do-portal)).
- Juntar os dois monolitos em um único repositório.
- Compartilhar regras de negócio, chamadas de API ou estado global. O kit é só de **UI e configuração**.
- Reescrever telas inteiras. A adoção é incremental, componente por componente.

## 3. Estado atual do repositório

O repositório foi criado a partir do starter do Turborepo e começou a ser configurado para shadcn/ui, mas ainda não funciona como biblioteca:

> Diagnóstico feito antes da Fase 1. Todos os itens abaixo foram resolvidos nela.

| Item | Situação |
| --- | --- |
| Monorepo | Turborepo + pnpm workspaces (`apps/*`, `packages/*`) ✅ |
| Nome/escopo | Raiz chamada `my-turborepo`; pacotes no escopo `@repo/*`; `apps/web/components.json` usa `@workspace/ui` (inconsistente) |
| `packages/ui` | `exports` aponta para `./src/*.tsx`, mas os arquivos estão em `shadcn/`; o CSS referenciado (`src/styles/globals.css`) não existe |
| Componentes | Apenas os stubs do starter (`Button` com `alert`, `Card` com links de UTM, `Code`) |
| Tailwind | Referenciado no `components.json`, mas não instalado |
| Lint/format | Biome na raiz, mas `apps/docs` importa `@repo/eslint-config` (inexistente) e o script `format` chama Prettier (não instalado) |
| Build/publicação | Não há build da biblioteca, versionamento, changelog nem CI |
| Testes | Nenhum |
| README | Ainda é o do starter |

### 3.1 Restrições vindas do Portal

O kit não reaproveita código do Portal, mas precisa encaixar nele. A stack atual do Portal define estas restrições:

| No Portal | Impacto no kit |
| --- | --- |
| Next 16.3, React 19.2 | `peerDependencies`: `react`/`react-dom` `^19.2` e testes do kit contra essas versões |
| Tailwind v4 via `@tailwindcss/postcss` | Confirma Tailwind v4 como estratégia de estilo; o consumo via `@import` + `@source` funciona sem mudar o setup do Portal |
| **Temas por cliente** (`src/themes/flamengo`, `vitrine`, `vitrine-v2`) que sobrescrevem CSS variables no padrão shadcn (`--primary`, `--background`, `--radius`, `--sidebar`…) | O kit precisa suportar **multi-tema (white-label)**: um tema padrão Multiclubes + temas de cliente que só sobrescrevem variáveis. Manter os **nomes de variáveis do contrato shadcn** faz os temas de cliente continuarem funcionando com os novos componentes |
| `next-themes` + `global-dark-mode.css` | Modo escuro por classe (`.dark`), compatível com `next-themes` |
| shadcn `new-york` com Radix e ícones `lucide-react` | O kit usa Base UI e Phosphor. Na migração, as duas bases convivem no Portal até o componente antigo ser removido. É aceitável, mas aumenta o bundle temporariamente |
| npm (`package-lock.json`), não pnpm | O pacote publicado não pode depender de nada específico do pnpm (`workspace:*` é resolvido na publicação) |
| Biome 1.9 | A `@multiclubes/biome-config` usa Biome 2.x, que tem formato de configuração diferente. Adotá-la no Portal exige atualizar o Biome lá |
| Vitest | Mesmo runner de testes no kit, para facilitar contribuições |
| Repositório no Azure DevOps | Azure Artifacts é o registry natural (mesma autenticação e pipelines) |

## 4. Arquitetura proposta

```mermaid
flowchart LR
  subgraph kit[Multiui-kit monorepo]
    tokens[styles / tokens]
    ui["@multiclubes/ui"]
    cfg["@multiclubes/typescript-config<br/>@multiclubes/biome-config"]
    docs[apps/docs<br/>catálogo]
    play[apps/web<br/>playground]
    tokens --> ui
    ui --> docs
    ui --> play
  end
  ui -- publicado --> reg[(Registry privado)]
  cfg -- publicado --> reg
  reg --> m1[Monolito A]
  reg --> m2[Monolito B]
  reg --> novos[Novas aplicações]
```

### 4.1 Pacotes

| Pacote | Conteúdo | Publicado? |
| --- | --- | --- |
| `@multiclubes/ui` | Componentes React, utilitário `cn`, hooks de UI e o CSS do tema (`@multiclubes/ui/styles.css`) com os tokens em CSS variables | Sim |
| `@multiclubes/typescript-config` | `base.json`, `nextjs.json`, `react-library.json` | Sim |
| `@multiclubes/biome-config` | Configuração base do Biome, usada via `extends` | Sim |
| `apps/docs` | Catálogo/documentação dos componentes | Não (deploy como site interno) |
| `apps/web` | Playground que consome o kit **como um app real consumiria** | Não |

Os tokens começam dentro de `@multiclubes/ui`. Se surgir uma demanda real de consumir tokens sem os componentes (e-mail, app mobile, ferramentas de design), eles viram um pacote `@multiclubes/tokens` separado.

### 4.2 Base técnica dos componentes

- **shadcn/ui** como ponto de partida (o repositório já está configurado com o estilo `base-luma`, primitivos Base UI e ícones Phosphor). Os componentes gerados passam a ser **nossos**: ajustados ao padrão Multiclubes e mantidos aqui.
- **Tailwind CSS v4** com tema definido por CSS variables, suportando modo claro/escuro.
- **Multi-tema:** o kit publica o tema padrão Multiclubes; cada app ou cliente pode sobrescrever as variáveis (cores, raio, fontes) sem tocar nos componentes. Os componentes só usam tokens semânticos (`bg-primary`, `text-muted-foreground`), nunca cores fixas.
- **Sem dependência de Next.js** dentro de `@multiclubes/ui`. Integrações como `Link` e `Image` entram por composição (`render`/`asChild`), para que apps que não usam Next também consumam o kit.
- `react` e `react-dom` como `peerDependencies`.

### 4.3 Como o pacote é distribuído

Os monolitos estão em outros repositórios, então o workspace (`workspace:*`) só atende os apps internos do kit. Para fora, há dois modelos:

| Modelo | Como funciona | Prós | Contras |
| --- | --- | --- | --- |
| **A. Pacote npm compilado** (recomendado) | `@multiclubes/ui` é buildado (ESM + `.d.ts`) e publicado; apps instalam e atualizam por versão | Uma fonte da verdade; correções chegam via upgrade; padrão visual garantido | Customização local exige props/variantes previstas no kit |
| B. Registry shadcn próprio | O kit expõe um `registry.json`; apps rodam `shadcn add` e recebem o código-fonte | Total liberdade para editar no app | Cada app vira dono da cópia: a divergência volta |

**Recomendação:** modelo A como padrão. O modelo B pode ser útil mais tarde para **blocos/templates** (ex.: layout de login, página de listagem) que naturalmente variam por app.

Pontos de atenção no build (modelo A):

- Preservar a diretiva `"use client"` nos componentes interativos (build sem bundle, preservando módulos), para funcionar com React Server Components.
- `exports` explícitos no `package.json` (`.`, `./styles.css`, e subpaths se necessário) e `sideEffects` configurado para tree-shaking.
- Com Tailwind v4, o app consumidor só importa o Tailwind e o tema. O `styles.css` do kit declara `@source` relativo a si mesmo, então as classes dos componentes são geradas sem configuração extra no app (validado na Fase 1):

  ```css
  @import "tailwindcss";
  @import "@multiclubes/ui/styles.css";
  ```

  Na Fase 4, o `@source` passa a apontar para o código publicado (`dist`). Alternativa a avaliar: publicar um CSS já compilado, para apps que não usam Tailwind.

### 4.4 Versionamento e release

- **SemVer** com **Changesets**: todo PR que muda um pacote publicado inclui um changeset descrevendo a mudança.
- A CI abre um PR de "Version Packages"; ao fazer merge, publica no registry e gera o `CHANGELOG.md`.
- Versões `0.x` durante a fase piloto; `1.0.0` quando os dois monolitos estiverem usando os componentes base.

## 5. Plano de execução

### Fase 0 — Direção visual e requisitos

Definir o que será construído e com que cara. Nada é copiado dos monolitos.

- Definir a direção visual do kit: paleta, tipografia, raios, densidade, tom dos estados (hover, foco, erro), modo escuro.
- Listar os componentes que o Portal e o segundo monolito usam, para saber **quais** construir e em que ordem (só a lista, não o código).
- Mapear o contrato de variáveis que os temas de cliente do Portal sobrescrevem, para que o kit o respeite.
- Levantar a stack do segundo monolito (a do Portal está na [seção 3.1](#31-restrições-vindas-do-portal)).
- Responder as [decisões em aberto](#8-decisões-em-aberto).

**Pronto quando:** a direção visual está definida, a lista de componentes está priorizada e as decisões de registry e escopo estão tomadas.

### Fase 1 — Fundação do repositório ✅

Corrigir o starter e deixar a base pronta para receber componentes.

> **Concluída em 2026-10-21.** Pacotes renomeados para `@multiclubes/*`; `packages/ui` reorganizado em `src/` com `exports` por subpath; Tailwind v4 no kit e nos apps; Biome como única ferramenta de lint/format, com `@multiclubes/biome-config`; Vitest + Testing Library no `ui`; `Button` (shadcn `base-luma`) com testes, renderizado no `web` e no `docs`; CI em GitHub Actions (lint, tipos, testes, build). O registry do shadcn publica componentes com `import { cn } from "cn"`, que o CLI não reescreve; o script `add-component` do `ui` corrige isso.

- Renomear raiz e pacotes para o escopo `@multiclubes/*` e alinhar todos os `components.json`.
- Reorganizar `packages/ui` (`src/components`, `src/lib`, `src/hooks`, `src/styles`) e ajustar `exports` e `tsconfig`.
- Instalar e configurar Tailwind v4 no `ui` e nos apps internos.
- Padronizar em Biome (remover referências a ESLint/Prettier) e criar `@multiclubes/biome-config`.
- CI no PR: `check-types`, `format-and-lint`, `build`, testes.
- Substituir o README do starter.

**Pronto quando:** `pnpm build` e `pnpm check-types` passam, `apps/web` renderiza um componente do `ui` com o tema aplicado, e a CI roda em todo PR.

### Fase 2 — Tokens e tema

- Traduzir a direção visual definida na Fase 0 em tokens (CSS variables) e no tema do Tailwind.
- Tipografia e fontes oficiais, escala de espaçamento, raios, sombras, breakpoints.
- Modo claro e escuro.
- Mecanismo de temas de cliente: um tema de exemplo que só sobrescreve variáveis, provando que o white-label funciona.
- Página de tokens no catálogo, com troca de tema e de modo claro/escuro.

**Pronto quando:** o tema padrão reproduz a direção visual, um tema de cliente funciona sem alterar componentes, e ambos estão documentados.

### Fase 3 — Componentes base

Começar pelos componentes que o Portal mais usa, segundo a lista da Fase 0. Primeira leva sugerida:

`Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Label`/`Field`, `Card`, `Dialog`, `Dropdown Menu`, `Tooltip`, `Toast`, `Tabs`, `Table`, `Badge`, `Avatar`, `Skeleton`, `Spinner`.

Para cada componente:

- API tipada e consistente (variantes, tamanhos, `className`, composição).
- Acessibilidade: teclado, foco visível, ARIA, contraste.
- Testes com Vitest + Testing Library, incluindo verificação automática de a11y (axe).
- Página no catálogo com exemplos e props.

**Pronto quando:** a primeira leva está publicada em `0.x`, documentada e testada.

### Fase 4 — Publicação

- Configurar build da biblioteca (ESM + tipos, preservando `"use client"`).
- Configurar o registry escolhido (`.npmrc`, `publishConfig`, autenticação na CI e nas máquinas dos devs).
- Changesets + workflow de release automatizado.
- Deploy do catálogo como site interno.

**Pronto quando:** um projeto fora do monorepo instala `@multiclubes/ui` do registry e usa um componente sem nenhum ajuste manual.

### Fase 5 — Piloto no Portal

- Instalar o kit e o tema, convivendo com os componentes atuais em `src/components/ui`.
- Validar os temas de cliente (`flamengo`, `vitrine`, `vitrine-v2`) com os componentes do kit.
- Substituir componentes de forma incremental (começando por telas de menor risco), removendo o componente antigo e suas dependências (Radix, lucide) à medida que cada um é migrado.
- Atualizar o Biome para 2.x e adotar `@multiclubes/typescript-config` e `@multiclubes/biome-config`.
- Registrar atritos de API e devolvê-los ao kit como melhorias.

**Pronto quando:** os componentes base do Portal vêm do kit, os temas de cliente funcionam e não há regressões relevantes.

### Fase 6 — Adoção no segundo monolito

- Repetir o processo da Fase 5, já com a API amadurecida pelo piloto.
- Publicar `1.0.0`.

**Pronto quando:** os dois monolitos usam a mesma versão major do kit para os componentes base.

### Fase 7 — Evolução contínua

- Componentes compostos e padrões recorrentes (formulários, tabelas com filtro/paginação, layouts).
- Testes de regressão visual (ex.: screenshots com Playwright) no catálogo.
- Avaliar o registry shadcn (modelo B) para blocos/templates.
- Template de nova aplicação já configurada com o kit.

## 6. Governança

- **Donos:** definir um time/pessoas responsáveis por revisar PRs no kit.
- **Contribuição:** qualquer dev pode propor componente ou mudança via PR, com changeset, testes e documentação.
- **Critério de entrada:** um componente entra no kit quando é usado (ou vai ser usado) por pelo menos dois projetos. Componentes específicos de um produto continuam no produto.
- **Breaking changes:** só em versão major, com guia de migração no changelog. Antes de remover, marcar como `@deprecated` por pelo menos uma versão minor.
- **Design:** mudanças visuais passam pelo responsável de design.

## 7. Riscos e mitigações

| Risco | Mitigação |
| --- | --- |
| Segundo monolito com stack de estilo diferente (ex.: sem Tailwind) dificulta a adoção | Mapear na Fase 0; se necessário, publicar também CSS compilado |
| Novo visual quebra os temas de cliente do Portal | Manter o contrato de variáveis shadcn; validar cada tema de cliente no piloto |
| Visual novo muda a experiência dos usuários atuais do Portal | Alinhar com produto antes do piloto; migrar por tela, não tudo de uma vez |
| Radix + Base UI e lucide + Phosphor convivendo no Portal durante a migração | Remover a dependência antiga assim que o último componente que a usa for migrado |
| Versões de React/Next diferentes entre os projetos | `peerDependencies` com faixa compatível; testar o kit contra as versões em uso |
| Kit vira gargalo (apps esperando componentes) | Critério de entrada claro; apps podem estender localmente via composição enquanto o kit evolui |
| Regressões visuais na migração | Migração incremental por tela; regressão visual no catálogo; validação com QA/design |
| Divergência volta com o tempo | Governança, catálogo como referência e lint/configs compartilhados |
| Dependência pesada de uma única pessoa | Documentação, revisão em par e mais de um dono do kit |

## 8. Decisões em aberto

| # | Decisão | Opções | Recomendação |
| --- | --- | --- | --- |
| 1 | Registry de publicação | Azure Artifacts, GitHub Packages, npm (org privada) | Azure Artifacts, já que o Portal está no Azure DevOps |
| 2 | Escopo dos pacotes | `@multiclubes/*`, outro | `@multiclubes/*` |
| 3 | Estratégia de estilo | Tailwind v4 + CSS variables, CSS compilado, ambos | Tailwind v4 (o Portal já usa); confirmar no segundo monolito |
| 4 | Ferramenta do catálogo | `apps/docs` (Next + MDX), Storybook | Definir após a Fase 0 conforme a necessidade de testes visuais |
| 5 | Onde o repositório do kit vai morar | GitHub pessoal (atual), Azure DevOps da Multiclubes | Azure DevOps, junto com o registry e as pipelines |
| 6 | Donos do kit | — | — |

**Decidido:**

- **Padrão visual:** identidade nova, criada neste repositório. Os componentes são escritos do zero, sem copiar código dos monolitos.
- **App piloto:** Portal.

## 9. Como medir o sucesso

- Número de componentes duplicados removidos dos monolitos.
- Percentual de telas usando componentes do kit.
- Tempo para iniciar uma nova aplicação com o padrão visual completo.
- Tempo entre uma correção no kit e sua chegada nos dois projetos.
