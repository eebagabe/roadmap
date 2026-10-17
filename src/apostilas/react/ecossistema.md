# Ecossistema React: Apostila Prática

Roadmap Frontend React · Semanas 13 a 16

## Comece por aqui

React sozinho resolve a interface. Num projeto real você também precisa **buscar dados** do servidor com cache, **compartilhar estado** entre telas, **testar** e, cada vez mais, usar um framework como o **Next.js**. Esta apostila cobre as ferramentas que aparecem em quase toda vaga.

### Por que isso vale ouro no mercado

- TanStack Query (React Query) é praticamente padrão para dados de API.
- Testes com Testing Library aparecem como requisito em vagas pleno.
- Next.js é o framework React mais usado; muitas vagas pedem diretamente.

### Como esta apostila funciona

1. Cada tema adiciona uma ferramenta ao projeto da etapa anterior (catálogo de filmes).
2. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** antes de instalar mais uma biblioteca, pergunte: "qual problema ela resolve que eu tenho **agora**?".

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 13 | Tema 1: Dados do servidor |
| 14 | Tema 2: Estado global |
| 15 | Tema 3: Testes no frontend |
| 16 | Tema 4: Next.js + projeto |

## Tema 1: Dados do servidor

**Objetivo:** buscar, guardar em cache e alterar dados da API sem reinventar a roda.

### 1.1 Estado do servidor vs estado do cliente

| Estado do cliente | Estado do servidor |
|---|---|
| Tema escuro, modal aberto, texto do input | Lista de produtos, dados do usuário, pedidos |
| Só existe no navegador | A "verdade" está no servidor; você tem uma **cópia** |
| Você controla | Pode ficar desatualizado, precisa de cache e revalidação |

Tratar dados do servidor com `useState` + `useEffect` funciona para um caso, mas logo você precisa de: cache, evitar requisições duplicadas, revalidar ao voltar para a aba, paginação, retry, cancelamento, estados de loading/erro. Isso é o que o **TanStack Query** faz.

### 1.2 TanStack Query

```bash
npm install @tanstack/react-query
```

```tsx
// main.tsx
const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}><App /></QueryClientProvider>,
)
```

```tsx
function useFilme(id: string) {
  return useQuery({
    queryKey: ['filme', id],                       // identidade do dado no cache
    queryFn: () => api.get<Filme>(`/filmes/${id}`),
    staleTime: 60_000,                              // considerado fresco por 1 minuto
  })
}

function DetalheFilme({ id }: { id: string }) {
  const { data, isPending, isError, error, refetch } = useFilme(id)
  if (isPending) return <Skeleton />
  if (isError) return <Erro mensagem={error.message} onTentarDeNovo={refetch} />
  return <h1>{data.titulo}</h1>
}
```

### 1.3 Cache e revalidação

- A **queryKey** identifica o dado. Dois componentes com a mesma key compartilham o mesmo cache e uma só requisição.
- **staleTime:** por quanto tempo o dado é considerado fresco (não busca de novo). Padrão: 0.
- **gcTime:** quanto tempo um dado sem uso fica na memória antes de ser descartado. Padrão: 5 minutos.
- Revalida automaticamente ao **focar a janela** e ao **reconectar**.

> **Analogia:** o cache é uma geladeira. `staleTime` é a validade: dentro dela você come sem pensar. Depois, ainda come (mostra o dado na hora), mas vai ao mercado buscar um novo em segundo plano. Isso se chama **stale-while-revalidate**.

### 1.4 Mutations

Para criar, alterar ou excluir:

```tsx
function useFavoritar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (filmeId: string) => api.post('/favoritos', { filmeId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favoritos'] }),  // refaz a lista
  })
}

const favoritar = useFavoritar()
<button onClick={() => favoritar.mutate(filme.id)} disabled={favoritar.isPending}>Favoritar</button>
```

**Atualização otimista:** atualiza a tela **antes** da resposta do servidor (o botão de curtir muda na hora) e desfaz se der erro. Melhora muito a sensação de velocidade.

### 1.5 Loading e erro

Boas práticas de UX:

- Skeleton em vez de spinner para conteúdo com formato conhecido.
- Mensagem de erro útil com botão "tentar de novo".
- Estado vazio desenhado ("Você ainda não tem favoritos").
- Não "piscar" o loading em respostas muito rápidas.

### 1.6 Paginação e scroll infinito

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['filmes', busca],
  queryFn: ({ pageParam }) => api.get<Pagina<Filme>>(`/filmes?q=${busca}&page=${pageParam}`),
  initialPageParam: 1,
  getNextPageParam: ultima => (ultima.pagina < ultima.totalPaginas ? ultima.pagina + 1 : undefined),
})

const filmes = data?.pages.flatMap(p => p.itens) ?? []
```

Use um `IntersectionObserver` num elemento no fim da lista para chamar `fetchNextPage` quando ele aparecer na tela.

### Atividades de fixação do Tema 1

1. Classifique como estado do cliente ou do servidor: (a) lista de pedidos; (b) aba selecionada; (c) perfil do usuário logado; (d) itens do carrinho ainda não salvos; (e) cotação do dólar.
2. Migre a busca de filmes do seu projeto de `useEffect` para `useQuery`. Quantas linhas sumiram?
3. Por que a `queryKey` da busca precisa incluir o termo buscado? O que acontece se não incluir?
4. Implemente "favoritar" com atualização otimista e rollback em caso de erro.
5. Implemente scroll infinito na lista de filmes.

## Tema 2: Estado global

**Objetivo:** decidir onde cada estado mora e usar uma ferramenta simples quando precisar de estado global.

### 2.1 Quando usar estado global

Antes de criar estado global, percorra a lista:

1. Dá para **calcular** a partir de outro dado? Então não é estado.
2. É dado do **servidor**? Use TanStack Query (o cache dele já é global).
3. Só um componente usa? `useState` local.
4. Alguns componentes próximos usam? **Levante** para o ancestral comum.
5. Deve sobreviver a um recarregar ou ser compartilhável por link? **URL**.
6. Muitas partes distantes usam e muda com frequência? Agora sim, **estado global**.

### 2.2 Context com reducer

Para estado global simples (tema, usuário, carrinho pequeno), Context + `useReducer` resolve sem biblioteca. Problema: todo consumidor re-renderiza quando qualquer parte do valor muda.

### 2.3 Zustand

Biblioteca pequena, sem provider, e cada componente só re-renderiza quando a parte que ele **seleciona** muda.

```bash
npm install zustand
```

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ItemCarrinho = { id: string; nome: string; preco: number; qtd: number }
type CarrinhoState = {
  itens: ItemCarrinho[]
  adicionar: (item: Omit<ItemCarrinho, 'qtd'>) => void
  remover: (id: string) => void
  limpar: () => void
}

export const useCarrinho = create<CarrinhoState>()(
  persist(
    set => ({
      itens: [],
      adicionar: item => set(s => {
        const existe = s.itens.find(i => i.id === item.id)
        return {
          itens: existe
            ? s.itens.map(i => (i.id === item.id ? { ...i, qtd: i.qtd + 1 } : i))
            : [...s.itens, { ...item, qtd: 1 }],
        }
      }),
      remover: id => set(s => ({ itens: s.itens.filter(i => i.id !== id) })),
      limpar: () => set({ itens: [] }),
    }),
    { name: 'carrinho' },   // salva no localStorage
  ),
)

// Em qualquer componente:
const quantidade = useCarrinho(s => s.itens.reduce((n, i) => n + i.qtd, 0))  // seletor
const adicionar = useCarrinho(s => s.adicionar)
```

> **Na prática:** Redux Toolkit ainda existe em muitos projetos grandes (e você pode encontrá-lo no trabalho). Para projetos novos, Zustand + TanStack Query cobre a maioria dos casos com bem menos código.

### 2.4 Estado na URL

Filtros, busca, página atual, aba selecionada: coloque na URL (`useSearchParams`). Ganha de graça: compartilhar link, botão voltar funcionando e estado que sobrevive ao recarregar.

### 2.5 Persistência no localStorage

- Só salve o necessário (preferências, carrinho, rascunhos).
- Sempre com `try/catch` (modo anônimo e storage cheio lançam erro).
- Versione o formato (`carrinho:v2`) para não quebrar quando a estrutura mudar.
- **Nunca** guarde token sensível no localStorage se puder evitar: qualquer script com XSS lê. Prefira cookies `HttpOnly`.

### Atividades de fixação do Tema 2

1. Para cada dado, diga onde ele deve morar: (a) termo de busca; (b) se o menu lateral está aberto; (c) carrinho; (d) dados do produto; (e) preferência de tema.
2. Crie a store do carrinho com Zustand e mostre a quantidade no cabeçalho e a lista numa página.
3. Explique por que `useCarrinho()` (sem seletor) causa mais re-renderizações que `useCarrinho(s => s.itens.length)`.
4. Coloque página e ordenação da lista de filmes na URL.
5. O que acontece com o carrinho salvo se você mudar o formato do item (por exemplo, `preco` vira `precoCentavos`)? Como evitar problemas?

## Tema 3: Testes no frontend

**Objetivo:** testar componentes do jeito que o usuário usa.

### 3.1 Vitest

Executor de testes rápido e integrado ao Vite, com API parecida com a do Jest.

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

```ts
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', setupFiles: './src/setupTests.ts', globals: true },
})
```

```ts
// src/setupTests.ts
import '@testing-library/jest-dom/vitest'
```

Testes de funções puras são os mais simples:

```ts
import { describe, expect, it } from 'vitest'
import { formatarPreco } from './formatar'

describe('formatarPreco', () => {
  it('formata em reais', () => {
    expect(formatarPreco(1234.5)).toBe('R$ 1.234,50')   //   = espaço não separável
  })
})
```

### 3.2 Testing Library: testar comportamento

A filosofia: **teste o que o usuário vê e faz**, não detalhes de implementação (estado interno, nome de função).

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

it('adiciona uma tarefa', async () => {
  const user = userEvent.setup()
  render(<Tarefas />)

  await user.type(screen.getByRole('textbox', { name: /nova tarefa/i }), 'Estudar React')
  await user.click(screen.getByRole('button', { name: /adicionar/i }))

  expect(screen.getByText('Estudar React')).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: /nova tarefa/i })).toHaveValue('')
})
```

Prioridade das consultas: `getByRole` (com `name`) > `getByLabelText` > `getByText` > ... > `getByTestId` (último recurso). Se você não consegue achar o elemento por role e nome, provavelmente ele **não está acessível**. Os testes ajudam na acessibilidade.

| Prefixo | Quando |
|---|---|
| `getBy` | Deve existir agora (erro se não existir) |
| `queryBy` | Para afirmar que **não** existe |
| `findBy` | Vai aparecer (assíncrono) |

### 3.3 Mock de API com MSW

**Mock Service Worker** intercepta requisições de rede e devolve respostas falsas, sem mexer no seu código.

```ts
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

export const server = setupServer(
  http.get('/api/filmes', () => HttpResponse.json([{ id: '1', titulo: 'Central do Brasil' }])),
)
// setupTests.ts: beforeAll(() => server.listen()); afterEach(() => server.resetHandlers()); afterAll(() => server.close())
```

```tsx
it('mostra erro quando a API falha', async () => {
  server.use(http.get('/api/filmes', () => new HttpResponse(null, { status: 500 })))
  renderComProviders(<ListaFilmes />)
  expect(await screen.findByRole('alert')).toHaveTextContent(/não foi possível/i)
})
```

### 3.4 Playwright (E2E)

Testes ponta a ponta rodam num navegador de verdade, no app inteiro.

```bash
npm init playwright@latest
```

```ts
import { test, expect } from '@playwright/test'

test('usuário busca e favorita um filme', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('searchbox', { name: 'Buscar filmes' }).fill('Cidade de Deus')
  await page.getByRole('link', { name: /Cidade de Deus/ }).first().click()
  await page.getByRole('button', { name: 'Favoritar' }).click()
  await page.getByRole('link', { name: 'Favoritos' }).click()
  await expect(page.getByText('Cidade de Deus')).toBeVisible()
})
```

> **Cuidado! Cai na entrevista:** "O que você testa no front?" Lógica pura com testes unitários; componentes com Testing Library (comportamento, não implementação); fluxos críticos (login, checkout) com E2E. Poucos E2E, porque são lentos e mais frágeis.

### Atividades de fixação do Tema 3

1. Escreva testes para o reducer de tarefas (adicionar, alternar, remover) com Vitest.
2. Teste o componente de busca: digitar um termo e verificar que os resultados aparecem (use MSW).
3. Por que `getByRole('button', { name: 'Salvar' })` é melhor que `container.querySelector('.btn-salvar')`?
4. Teste que a mensagem "Nenhum favorito" aparece quando a lista está vazia e **não** aparece quando há itens.
5. Escreva um teste E2E com Playwright para o fluxo principal do seu projeto.

## Tema 4: Next.js

**Objetivo:** entender por que usar um framework e os conceitos principais do Next.js.

### 4.1 Por que um framework

Um app React com Vite é uma **SPA**: o servidor manda um HTML quase vazio e o JavaScript monta tudo no navegador. Problemas: primeira carga mais lenta, SEO mais difícil, e você precisa decidir roteamento, busca de dados e build sozinho.

Next.js adiciona: renderização no servidor, roteamento por arquivos, otimização de imagens e fontes, rotas de API e deploy simples.

### 4.2 App Router

As rotas são **pastas** dentro de `app/`:

```
app/
  layout.tsx              → layout de todas as páginas
  page.tsx                → /
  filmes/
    page.tsx              → /filmes
    [id]/
      page.tsx            → /filmes/123
      loading.tsx         → mostrado enquanto carrega
      error.tsx           → mostrado em caso de erro
```

### 4.3 Server Components

No App Router, componentes são **Server Components** por padrão: rodam **só no servidor**, podem buscar dados direto (até no banco), e **não enviam JavaScript** para o navegador.

```tsx
// app/filmes/[id]/page.tsx  (Server Component)
export default async function PaginaFilme({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const filme = await fetch(`${process.env.API_URL}/filmes/${id}`).then(r => r.json())
  return (
    <main>
      <h1>{filme.titulo}</h1>
      <BotaoFavoritar id={id} />   {/* componente interativo */}
    </main>
  )
}
```

Para interatividade (estado, eventos, efeitos), marque o arquivo como **Client Component**:

```tsx
'use client'
export function BotaoFavoritar({ id }: { id: string }) {
  const [fav, setFav] = useState(false)
  return <button onClick={() => setFav(f => !f)}>{fav ? '★' : '☆'} Favoritar</button>
}
```

> **Cuidado! Cai na entrevista:** coloque `'use client'` o mais **perto das folhas** possível (só nos componentes interativos). Assim a maior parte da página continua no servidor, com menos JavaScript no navegador.

### 4.4 SSR, SSG e ISR

| Sigla | Quando o HTML é gerado | Bom para |
|---|---|---|
| CSR | No navegador | Áreas logadas, dashboards |
| SSR | No servidor, a cada requisição | Dados personalizados ou que mudam sempre |
| SSG | No build | Páginas que quase não mudam (blog, docs) |
| ISR | No build e regenerado de tempos em tempos | Catálogo de produtos |

No Next.js App Router você controla isso com opções de cache do `fetch` e de segmento (por exemplo, `export const revalidate = 3600` para regenerar a cada hora). Os padrões de cache mudaram entre versões do Next.js: confira a documentação da versão que você usa.

### 4.5 Server Actions

Funções que rodam no servidor e podem ser chamadas direto de um formulário, sem criar rota de API:

```tsx
// app/contato/page.tsx
async function enviar(formData: FormData) {
  'use server'
  const email = String(formData.get('email'))
  await db.contato.create({ data: { email } })
  revalidatePath('/contato')
}

export default function Contato() {
  return (
    <form action={enviar}>
      <label htmlFor="email">E-mail</label>
      <input id="email" name="email" type="email" required />
      <button>Enviar</button>
    </form>
  )
}
```

Server Actions são endpoints públicos por baixo: **valide os dados e cheque permissões** como em qualquer API.

### 4.6 SEO e metadata

```tsx
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const filme = await buscarFilme(id)
  return { title: `${filme.titulo} | CineApp`, description: filme.sinopse, openGraph: { images: [filme.poster] } }
}
```

### Atividades de fixação do Tema 4

1. Explique a diferença entre uma SPA com Vite e uma página Next.js com Server Components para alguém de produto.
2. Para cada página, escolha CSR, SSR, SSG ou ISR: (a) blog; (b) página de produto de e-commerce; (c) extrato bancário; (d) termos de uso; (e) dashboard de analytics logado.
3. Crie um projeto Next.js com a página `/filmes/[id]` buscando dados no servidor, com `loading.tsx` e `error.tsx`.
4. Quais destes precisam de `'use client'`? (a) lista de filmes estática; (b) botão de favoritar; (c) campo de busca com sugestões enquanto digita; (d) rodapé.
5. Crie um formulário de newsletter com Server Action e validação com Zod.

## Projeto da etapa

**Evolua o catálogo de filmes:**

1. TanStack Query para todos os dados (com scroll infinito na busca).
2. Zustand para favoritos, persistidos.
3. Testes: reducer/store com Vitest, 3 componentes com Testing Library + MSW, 1 fluxo E2E com Playwright.
4. **Bônus:** migre para Next.js com a página do filme renderizada no servidor e metadata para SEO.

## Resumão

- Estado do servidor ≠ estado do cliente. TanStack Query cuida de cache, revalidação e mutations.
- Antes de estado global: derive, levante, use a URL. Zustand quando precisar mesmo.
- Testes: comportamento do usuário, `getByRole` primeiro, MSW para a API, poucos E2E.
- Next.js: Server Components por padrão, `'use client'` só onde há interação.
- SSG/ISR para conteúdo público estável, SSR para personalizado, CSR para áreas logadas.
