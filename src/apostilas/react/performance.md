# Performance e Arquitetura — Apostila Prática

Roadmap Frontend React · Semanas 17 e 18

## Comece por aqui

Um app que funciona não é o mesmo que um app **rápido, organizado e fácil de manter**. Esta etapa fecha o roadmap com o que diferencia um front pleno: medir e melhorar performance, organizar o projeto para crescer, automatizar qualidade e colocar no ar. E, no fim, como responder a uma entrevista de **Frontend System Design**.

### Por que isso vale ouro no mercado

- Velocidade afeta conversão: em e-commerce, cada segundo a mais de carregamento custa vendas.
- O Google usa as Core Web Vitals como fator de ranqueamento.
- Entrevistas pleno/sênior de front pedem "desenhe o frontend de um feed/chat/autocomplete".

### Como esta apostila funciona

1. Sempre **meça antes e depois**. Otimização sem medição é chute.
2. Use o seu projeto de filmes como cobaia.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** antes de otimizar, abra o Profiler (React DevTools) ou a aba Performance e encontre o gargalo real. A causa quase nunca é onde você acha.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 17 | Tema 1 — Performance |
| 18 | Tema 2 — Arquitetura e deploy + projeto final |

## Tema 1 — Performance

**Objetivo:** medir, encontrar gargalos e aplicar as otimizações certas.

### 1.1 Core Web Vitals

| Métrica | Mede | Bom |
|---|---|---|
| **LCP** (Largest Contentful Paint) | Quando o maior elemento visível aparece | ≤ 2,5 s |
| **INP** (Interaction to Next Paint) | Quanto a página demora para responder a cliques e teclas | ≤ 200 ms |
| **CLS** (Cumulative Layout Shift) | Quanto o layout "pula" enquanto carrega | ≤ 0,1 |

Causas comuns:

- **LCP ruim:** imagem principal pesada ou carregada tarde, JavaScript demais antes de mostrar conteúdo, servidor lento.
- **INP ruim:** tarefas longas de JavaScript na thread principal, re-renderizações enormes.
- **CLS ruim:** imagem sem `width`/`height`, anúncio ou banner que aparece empurrando o conteúdo, fonte que troca de tamanho.

### 1.2 Lighthouse e DevTools

- **Lighthouse** (aba no Chrome DevTools): nota e sugestões. Rode em **janela anônima** (extensões atrapalham) e com "Mobile".
- **Aba Performance:** grave uma interação e procure **long tasks** (blocos vermelhos com mais de 50 ms).
- **Aba Network:** tamanho do JavaScript, imagens pesadas, requisições em cascata.
- **React DevTools > Profiler:** quais componentes renderizaram, quantas vezes e por quê ("Why did this render?").

> **Cuidado! Cai na entrevista:** dados de laboratório (Lighthouse na sua máquina) ≠ dados de campo (usuários reais em celulares medianos com 4G). Para campo, use o relatório do Chrome UX Report / PageSpeed Insights ou a biblioteca `web-vitals` enviando para seu analytics.

### 1.3 Re-renders e React.memo

Lembre: quando um componente re-renderiza, todos os filhos re-renderizam. Na maioria das vezes isso é rápido e **não é problema**. Só otimize quando o Profiler mostrar custo real.

Técnicas, da mais simples para a mais complexa:

1. **Mover o estado para baixo:** se só um pedaço da tela usa o estado, coloque o estado nesse pedaço.
2. **Passar componentes como `children`:** o filho criado pelo pai de cima não re-renderiza quando o estado do meio muda.
3. **`React.memo`:** o componente só re-renderiza se as props mudarem (comparação rasa). Funciona só se as props forem estáveis (`useMemo`/`useCallback` para objetos e funções).

```tsx
const LinhaFilme = memo(function LinhaFilme({ filme, onFavoritar }: Props) {
  return <li>{filme.titulo} <button onClick={() => onFavoritar(filme.id)}>★</button></li>
})

// No pai:
const favoritar = useCallback((id: string) => mutate(id), [mutate])
```

- **`useDeferredValue` / `useTransition`:** marcam atualizações como não urgentes, mantendo a digitação fluida enquanto uma lista pesada é filtrada.

### 1.4 Code splitting e lazy

Não mande o JavaScript da tela de admin para quem só vai ver a home.

```tsx
import { lazy, Suspense } from 'react'

const PaginaAdmin = lazy(() => import('./pages/PaginaAdmin'))

<Route
  path="/admin"
  element={
    <Suspense fallback={<Carregando />}>
      <PaginaAdmin />
    </Suspense>
  }
/>
```

O Vite gera um arquivo separado para `PaginaAdmin`, baixado só quando a rota é acessada. Também vale para bibliotecas pesadas usadas em um só lugar (editor de texto, gráficos): `const Grafico = lazy(() => import('./Grafico'))`.

Para ver o que pesa no seu bundle: `npx vite-bundle-visualizer`.

### 1.5 Imagens otimizadas

Imagens costumam ser **a maior parte** do peso da página.

```html
<img
  src="poster-400.webp"
  srcset="poster-400.webp 400w, poster-800.webp 800w"
  sizes="(min-width: 768px) 400px, 100vw"
  width="400" height="600"
  alt="Pôster do filme Bacurau"
  loading="lazy"
  decoding="async"
/>
```

- Formatos modernos: **WebP** ou **AVIF**.
- Tamanho certo para cada tela (`srcset` e `sizes`).
- `width`/`height` (ou `aspect-ratio`) para evitar CLS.
- `loading="lazy"` para imagens abaixo da dobra; a imagem principal (LCP) **sem** lazy e com `fetchpriority="high"`.
- No Next.js, o componente `<Image>` faz tudo isso automaticamente.

### 1.6 Listas grandes (virtualização)

Renderizar 10 mil linhas cria 10 mil elementos no DOM: lento para montar e para rolar. **Virtualização** renderiza só as linhas visíveis (mais uma margem) e reaproveita enquanto você rola.

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function ListaGigante({ itens }: { itens: Filme[] }) {
  const paiRef = useRef<HTMLDivElement>(null)
  const v = useVirtualizer({ count: itens.length, getScrollElement: () => paiRef.current, estimateSize: () => 56 })
  return (
    <div ref={paiRef} className="h-[600px] overflow-auto">
      <div style={{ height: v.getTotalSize(), position: 'relative' }}>
        {v.getVirtualItems().map(linha => (
          <div key={linha.key} style={{ position: 'absolute', top: 0, transform: `translateY(${linha.start}px)`, width: '100%' }}>
            {itens[linha.index].titulo}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Atividades de fixação — Tema 1

1. Rode o Lighthouse (mobile) no seu projeto e anote LCP, CLS e a nota de Performance. Corrija os 3 principais itens e meça de novo.
2. Use o Profiler para encontrar um componente que re-renderiza sem necessidade. Corrija com uma das 3 técnicas da seção 1.3 e prove com o Profiler.
3. Por que `React.memo` não funciona aqui? `<LinhaFilme filme={f} onFavoritar={id => favoritar(id)} />`
4. Divida o código do seu app por rotas com `lazy` e compare o tamanho do JavaScript inicial antes e depois (aba Network).
5. Renderize 10 mil itens sem virtualização e com virtualização. Compare o tempo de montagem e a fluidez da rolagem.

## Tema 2 — Arquitetura e deploy

**Objetivo:** organizar o projeto para crescer, automatizar a qualidade e publicar.

### 2.1 Organização de pastas

Para projetos pequenos, por **tipo** funciona. Para projetos que crescem, organize por **funcionalidade** (feature):

```
src/
  app/                 → providers, rotas, layout
  features/
    filmes/
      api.ts           → chamadas e hooks do TanStack Query
      components/      → componentes só desta feature
      pages/
      types.ts
    favoritos/
    auth/
  components/ui/       → componentes genéricos (Botao, Modal, Card)
  lib/                 → utilitários (cn, formatadores, cliente HTTP)
  test/                → setup e helpers de teste
```

Regras simples: uma feature não importa o "interior" de outra (só o que ela exporta); componentes de `ui/` não conhecem nenhuma feature.

### 2.2 Variáveis de ambiente

```bash
# .env.local (não vai para o Git)
VITE_API_URL=https://api.exemplo.com
```

```ts
const apiUrl = import.meta.env.VITE_API_URL
```

> **Cuidado! Cai na entrevista:** no frontend, **tudo** que vai para o bundle é público, incluindo variáveis `VITE_*` (ou `NEXT_PUBLIC_*`). Nunca coloque chave secreta de API no front. Chamadas que exigem segredo passam por um backend (ou por rotas de servidor no Next.js).

### 2.3 ESLint e Prettier

- **ESLint:** encontra erros e más práticas (hooks fora de ordem, dependências faltando em efeitos, variáveis sem uso).
- **Prettier:** formata o código automaticamente. Acaba com discussão sobre aspas e ponto e vírgula.
- **Husky + lint-staged:** rodam lint e formatação antes de cada commit.

```json
{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  }
}
```

### 2.4 CI com GitHub Actions

```yaml
# .github/workflows/ci.yml
name: ci
on: [push, pull_request]
jobs:
  qualidade:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
```

Configure o GitHub para **exigir** o CI verde antes de fazer merge de um pull request.

### 2.5 Deploy na Vercel

1. Importe o repositório em vercel.com.
2. Configure as variáveis de ambiente no painel.
3. Cada push na `main` faz deploy em produção; cada pull request ganha uma **URL de preview** para testar antes do merge.

Para SPA com React Router (sem Next.js), configure o fallback de rotas para o `index.html`, senão recarregar `/filmes/123` dá 404:

```json
// vercel.json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Alternativas: Netlify, Cloudflare Pages, GitHub Pages (só estático), AWS Amplify.

### 2.6 Frontend System Design

Roteiro para a entrevista (45 minutos), adaptado do System Design de backend:

1. **Requisitos:** o que o usuário faz? Quais dispositivos? Precisa funcionar offline? Acessibilidade? Internacionalização?
2. **Arquitetura:** SPA, SSR ou híbrido? Quais componentes principais (desenhe a árvore)?
3. **Modelo de dados:** o que vem da API, o que é estado do cliente, onde cada estado mora.
4. **API:** formato das respostas, paginação (offset ou cursor), tempo real (polling, SSE, WebSocket).
5. **Performance:** carregamento inicial, code splitting, imagens, virtualização, cache.
6. **UX:** loading, erro, vazio, otimista, acessibilidade, teclado.
7. **Aprofundar:** o entrevistador escolhe um ponto (ex.: "e se a lista tiver 100 mil itens?").

Exemplo rápido, **autocomplete de busca**:

- Debounce de ~300 ms; cancelar a requisição anterior (`AbortController`) para respostas fora de ordem não sobrescreverem a atual.
- Cache por termo (TanStack Query, ou um `Map`).
- Navegação por setas, Enter seleciona, Esc fecha; `role="combobox"` e `aria-activedescendant`.
- Destacar o trecho buscado no resultado.
- Mínimo de 2 caracteres; estado vazio "nenhum resultado".

### Atividades de fixação — Tema 2

1. Reorganize seu projeto de filmes por features. O que ficou mais fácil de encontrar?
2. Um colega colocou `VITE_STRIPE_SECRET_KEY` no `.env` do front. Explique o problema e a solução.
3. Configure ESLint, Prettier e o workflow de CI do exemplo. Abra um pull request com um erro de lint e veja o CI falhar.
4. Faça o deploy na Vercel e teste: recarregar a página numa rota interna funciona?
5. Faça o Frontend System Design de um **feed de notícias com scroll infinito** seguindo o roteiro 2.6.

## Projeto da etapa — Projeto final do roadmap

**Escolha um dos projetos avançados da página do roadmap** (Loja virtual com Next.js ou Design system próprio) e entregue com:

1. TypeScript estrito, Tailwind, testes (unitários, componentes e 1 E2E).
2. Lighthouse 90+ em todas as categorias (mobile).
3. Organização por features, ESLint, Prettier e CI exigido para merge.
4. Deploy na Vercel com previews por pull request.
5. README com: decisões de arquitetura, métricas de performance (antes e depois das otimizações) e como rodar.

Esse é o projeto que você mostra na entrevista.

## Resumão

- Meça antes de otimizar: Lighthouse, aba Performance, React Profiler.
- Core Web Vitals: LCP (carregamento), INP (resposta), CLS (estabilidade).
- Re-render quase nunca é problema; quando for: mova estado para baixo, use `children`, depois `memo`.
- Code splitting por rota com `lazy`; imagens WebP/AVIF com tamanho certo; virtualize listas enormes.
- Organize por features. Nada secreto no front.
- CI com lint, tipos, testes e build; deploy com preview por PR.
