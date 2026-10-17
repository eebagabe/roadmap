# Gabarito — Performance e Arquitetura

Abra só depois de tentar.

## Tema 1

1. Resposta pessoal. Os itens mais comuns e suas correções: imagens grandes (converter para WebP e usar `srcset`); JavaScript não usado (code splitting); imagens sem dimensões (adicionar `width`/`height`); fontes bloqueando renderização (`display=swap` e pré-carregamento).
2. Resposta pessoal. Caso típico: um campo de busca no topo da página guarda o texto em estado no componente da página inteira; cada tecla re-renderiza a lista. Correção: mover o estado do texto para o componente da busca e só "subir" o termo com debounce.
3. A arrow function `id => favoritar(id)` é **criada de novo a cada renderização** do pai, então a prop `onFavoritar` sempre muda e o `memo` sempre deixa re-renderizar. Correção: `const aoFavoritar = useCallback((id: string) => favoritar(id), [favoritar])` e passar `onFavoritar={aoFavoritar}`. (Com o React Compiler ativo no projeto, isso é feito automaticamente.)
4. Resposta pessoal. É comum o JavaScript inicial cair bastante quando há páginas pesadas (admin, gráficos, editores) separadas em chunks próprios. Na aba Network, confira que o chunk da rota só é baixado ao navegar para ela.
5. Resposta pessoal. Sem virtualização, a montagem de 10 mil linhas costuma levar centenas de milissegundos ou mais (uma long task visível na aba Performance), e a rolagem pode engasgar em aparelhos modestos. Com virtualização, só algumas dezenas de linhas existem no DOM e a montagem é quase instantânea.

## Tema 2

1. Resposta pessoal. Ganhos esperados: tudo de "filmes" num só lugar, fácil de apagar ou mover; menos imports cruzados; dá para ver as dependências entre features.
2. Qualquer variável `VITE_*` é **embutida no JavaScript** enviado ao navegador; qualquer pessoa pode abrir o DevTools e copiar a chave secreta, podendo fazer cobranças e reembolsos em nome da empresa. Solução: a chave secreta fica **só no backend** (ou em uma rota de servidor/Server Action no Next.js). O front usa apenas a chave **pública** (publishable key) e chama o backend para operações sensíveis. Como a chave já vazou, ela precisa ser **revogada e trocada** no painel do Stripe.
3. Prática. Para exigir o CI: em Settings > Branches (ou Rulesets) do GitHub, crie uma regra para a `main` exigindo o check `qualidade`.
4. Sem o `rewrite`, recarregar `/filmes/123` retorna 404, porque o servidor procura um arquivo `filmes/123` que não existe. Com o `vercel.json`, todas as rotas devolvem o `index.html` e o React Router resolve a rota no navegador.
5. Esboço:
   - **Requisitos:** feed de posts com texto e imagem; curtir; scroll infinito; funciona bem em celular; novos posts aparecem com um aviso "N novos posts".
   - **Arquitetura:** SSR da primeira página (rápido e com SEO, se público) e CSR para o resto. Componentes: `Feed`, `Post`, `BotaoCurtir`, `AvisoNovosPosts`.
   - **Dados:** paginação por **cursor** (não offset, porque novos posts entrando deslocariam as páginas e gerariam itens duplicados). `useInfiniteQuery`. Curtir com atualização otimista.
   - **Tempo real:** polling a cada 30 s só do "tem post novo?" (ou SSE); não insere automaticamente para não pular o conteúdo, mostra o aviso.
   - **Performance:** virtualização com altura variável; imagens com lazy e dimensões reservadas (sem CLS); skeletons.
   - **UX/a11y:** `role="feed"` e `aria-busy` ao carregar; botão "carregar mais" como alternativa ao scroll infinito; foco preservado; restaurar a posição de rolagem ao voltar de um post.

## Projeto da etapa

O avaliador vai olhar:

- README com métricas de antes e depois (não só "otimizei").
- CI obrigatório e verde.
- Nenhum segredo no bundle.
- Acessibilidade testada com teclado e com o Lighthouse.
- Commits pequenos e com mensagens claras ao longo do desenvolvimento.
