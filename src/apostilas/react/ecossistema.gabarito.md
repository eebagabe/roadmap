# Gabarito — Ecossistema React

Abra só depois de tentar.

## Tema 1

1. (a) Servidor; (b) cliente; (c) servidor; (d) cliente (até ser salvo; depois de salvo, vira servidor); (e) servidor.
2. Resposta pessoal. Normalmente somem os `useState` de dados, loading e erro, o `useEffect`, o `AbortController` e o controle de corrida entre requisições: 15 a 30 linhas por tela.
3. A `queryKey` é a identidade do cache. Sem o termo, todas as buscas compartilham a mesma entrada: ao mudar o termo, o TanStack Query não sabe que precisa buscar de novo e mostra o resultado da busca antiga. Com `['filmes', termo]`, cada termo tem seu cache, e voltar para um termo já buscado é instantâneo.
4. ```tsx
   function useFavoritar() {
     const qc = useQueryClient()
     return useMutation({
       mutationFn: (id: string) => api.post('/favoritos', { id }),
       onMutate: async id => {
         await qc.cancelQueries({ queryKey: ['favoritos'] })
         const anterior = qc.getQueryData<string[]>(['favoritos'])
         qc.setQueryData<string[]>(['favoritos'], (atual = []) => [...atual, id])
         return { anterior }
       },
       onError: (_erro, _id, contexto) => qc.setQueryData(['favoritos'], contexto?.anterior),
       onSettled: () => qc.invalidateQueries({ queryKey: ['favoritos'] }),
     })
   }
   ```
5. ```tsx
   const fimRef = useRef<HTMLDivElement>(null)
   useEffect(() => {
     const el = fimRef.current
     if (!el) return
     const obs = new IntersectionObserver(([entrada]) => {
       if (entrada.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage()
     })
     obs.observe(el)
     return () => obs.disconnect()
   }, [hasNextPage, isFetchingNextPage, fetchNextPage])
   // ... no fim da lista: <div ref={fimRef} />
   ```
   Mantenha também um botão "Carregar mais" como alternativa acessível.

## Tema 2

1. (a) URL; (b) estado local (ou do layout); (c) estado global persistido (Zustand + localStorage, ou no servidor se o usuário estiver logado); (d) TanStack Query; (e) estado global persistido no localStorage (ou cookie, se o servidor precisar saber).
2. Use a store da seção 2.3. No cabeçalho: `const qtd = useCarrinho(s => s.itens.reduce((n, i) => n + i.qtd, 0))`. Na página: `const itens = useCarrinho(s => s.itens)`.
3. Sem seletor, o componente "assina" o estado **inteiro**: qualquer mudança (até em um campo que ele não usa) causa re-renderização. Com o seletor, o Zustand compara o resultado selecionado e só re-renderiza se ele mudar.
4. ```tsx
   const [params, setParams] = useSearchParams()
   const pagina = Number(params.get('pagina') ?? '1')
   const ordem = params.get('ordem') ?? 'popularidade'
   const mudar = (chave: string, valor: string) =>
     setParams(p => { const n = new URLSearchParams(p); n.set(chave, valor); return n })
   ```
5. O carrinho antigo é carregado com o formato velho e o código novo lê `precoCentavos` como `undefined`, gerando `NaN` e telas quebradas. Soluções: versionar o storage e migrar (o `persist` do Zustand aceita `version` e `migrate`), ou descartar dados de versões antigas com segurança.

## Tema 3

1. ```ts
   describe('tarefasReducer', () => {
     const base = [{ id: '1', texto: 'A', feita: false }]
     it('alterna', () => expect(tarefasReducer(base, { tipo: 'alternar', id: '1' })[0].feita).toBe(true))
     it('remove', () => expect(tarefasReducer(base, { tipo: 'remover', id: '1' })).toEqual([]))
     it('não altera o estado anterior', () => {
       tarefasReducer(base, { tipo: 'alternar', id: '1' })
       expect(base[0].feita).toBe(false)
     })
   })
   ```
2. ```tsx
   it('mostra resultados da busca', async () => {
     server.use(http.get('/api/filmes', ({ request }) => {
       const q = new URL(request.url).searchParams.get('q')
       return HttpResponse.json([{ id: '1', titulo: `Resultado para ${q}` }])
     }))
     const user = userEvent.setup()
     renderComProviders(<Busca />)
     await user.type(screen.getByRole('searchbox', { name: /buscar/i }), 'tropa')
     expect(await screen.findByText('Resultado para tropa')).toBeInTheDocument()
   })
   ```
   `renderComProviders` é um helper seu que envolve o componente com `QueryClientProvider` (um `QueryClient` novo por teste, com `retry: false`) e o router.
3. A consulta por role e nome é como o usuário (e o leitor de tela) encontra o botão. Ela continua funcionando se você mudar a classe CSS ou a estrutura interna, e falha se o botão perder o nome acessível, o que é um bug real. A classe `.btn-salvar` é detalhe de implementação: renomear quebra o teste sem quebrar nada para o usuário.
4. ```tsx
   it('mostra estado vazio', () => {
     render(<Favoritos itens={[]} />)
     expect(screen.getByText('Nenhum favorito')).toBeInTheDocument()
   })
   it('não mostra estado vazio com itens', () => {
     render(<Favoritos itens={[{ id: '1', titulo: 'Bacurau' }]} />)
     expect(screen.queryByText('Nenhum favorito')).not.toBeInTheDocument()
   })
   ```
5. Prática. Use os seletores por role, como no exemplo da seção 3.4, e rode com `npx playwright test --ui` para depurar.

## Tema 4

1. Na SPA, o navegador recebe uma página quase vazia e precisa baixar e executar o JavaScript antes de mostrar o conteúdo; buscadores e prévias de link nas redes sociais podem ver pouco. No Next.js, o servidor já manda a página pronta com o conteúdo, aparece mais rápido e o navegador baixa só o JavaScript das partes interativas.
2. (a) SSG; (b) ISR (preço e estoque podem ser buscados no cliente ou com revalidação curta); (c) SSR ou CSR, porque é personalizado e não pode ser cacheado entre usuários; (d) SSG; (e) CSR (ou SSR), área logada sem necessidade de SEO.
3. Prática. `loading.tsx` exporta um componente de skeleton; `error.tsx` precisa ser Client Component (`'use client'`) e recebe `error` e `reset`.
4. (b) e (c) precisam: têm estado e eventos. (a) e (d) podem ser Server Components.
5. ```tsx
   const schema = z.object({ email: z.string().email() })

   async function inscrever(formData: FormData) {
     'use server'
     const resultado = schema.safeParse({ email: formData.get('email') })
     if (!resultado.success) return { erro: 'E-mail inválido' }
     await db.inscricao.upsert({ where: { email: resultado.data.email }, create: resultado.data, update: {} })
     return { ok: true }
   }
   ```
   Para mostrar o retorno na tela, use o hook `useActionState` num Client Component. O `upsert` torna a inscrição idempotente.

## Projeto da etapa

Checklist:

- Nenhum `useEffect` fazendo fetch: tudo via TanStack Query.
- Testes rodando no CI (`vitest run` e `playwright test`).
- MSW reaproveitado nos testes e, opcionalmente, no desenvolvimento.
- Se migrou para Next.js: `'use client'` só nos componentes interativos.
