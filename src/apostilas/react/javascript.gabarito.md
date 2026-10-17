# Gabarito — JavaScript e TypeScript

Abra só depois de tentar.

## Tema 1

1. `[] + []` → `''` (os dois viram string vazia); `[] == false` → `true` (os dois viram `0`); `null == undefined` → `true`; `null === undefined` → `false`; `typeof null` → `'object'` (um erro histórico da linguagem); `NaN === NaN` → `false` (use `Number.isNaN`).
2. ```js
   const nomes = [...new Set(pedidos.map(p => p.cliente))]
   const maior = pedidos.reduce((m, p) => (p.total > m.total ? p : m))
   const algumAcima = pedidos.some(p => p.total > 250)   // true
   ```
3. ```js
   function agruparPor(lista, chave) {
     return lista.reduce((acc, item) => {
       const k = item[chave]
       ;(acc[k] ??= []).push(item)
       return acc
     }, {})
   }
   ```
   (Existe também o nativo `Object.groupBy(lista, item => item.tipo)`.)
4. Imprime `3, 3, 3`. Com `var`, existe **uma só** variável `i` para o laço todo; quando os timeouts rodam, o laço já terminou e `i` vale 3. Com `let`, cada volta do laço tem seu próprio `i` (escopo de bloco), e cada closure guarda o seu: imprime `0, 1, 2`.
5. ```js
   function criarCarteira(saldoInicial = 0) {
     let saldo = saldoInicial
     return {
       depositar(v) { if (v <= 0) throw new Error('Valor inválido'); saldo += v },
       sacar(v) { if (v > saldo) throw new Error('Saldo insuficiente'); saldo -= v },
       saldo: () => saldo,
     }
   }
   ```
   `saldo` só existe dentro da closure; de fora não há como alterá-lo diretamente.

## Tema 2

1. `A, F, C, E, D, B`. Síncronos primeiro (A, F). Depois as microtasks na ordem em que entraram na fila: `C` (primeiro `then`) e `E` (`queueMicrotask`). O segundo `then` (`D`) só entra na fila quando o primeiro termina, então vem depois de E. Por último a macrotask `B`.
2. ```js
   async function carregar(url) {
     try {
       const r = await fetch(url)
       if (!r.ok) throw new Error(`HTTP ${r.status}`)
       mostrar(await r.json())
     } catch (e) {
       mostrarErro(e.message)
     }
   }
   ```
3. ```js
   const logins = ['torvalds', 'gaearon', 'usuario-que-nao-existe-123']
   const resultados = await Promise.allSettled(logins.map(buscarUsuario))
   const ok = resultados.filter(r => r.status === 'fulfilled').map(r => r.value)
   ```
4. ```js
   function debounce(fn, ms) {
     let timer
     return (...args) => {
       clearTimeout(timer)
       timer = setTimeout(() => fn(...args), ms)
     }
   }
   input.addEventListener('input', debounce(e => buscar(e.target.value), 400))
   ```
   Repare que o `debounce` usa closure para lembrar do `timer`.
5. `innerHTML` interpreta o texto como HTML. Se o usuário digitar `<img src=x onerror="roubarCookies()">`, o código roda na página de outras pessoas: é um ataque **XSS**. `textContent` trata tudo como texto puro. (O React escapa texto por padrão pelo mesmo motivo; o equivalente perigoso dele é o `dangerouslySetInnerHTML`.)

## Tema 3

1. ```ts
   function buscar(lista: Produto[], termo: string): Produto[] {
     return lista.filter(p => p.nome.includes(termo))
   }
   ```
2. ```ts
   type EstadoRequisicao<T> =
     | { tipo: 'ocioso' }
     | { tipo: 'carregando' }
     | { tipo: 'sucesso'; dados: T }
     | { tipo: 'erro'; mensagem: string }

   function texto<T>(e: EstadoRequisicao<T>): string {
     switch (e.tipo) {
       case 'ocioso': return 'Faça uma busca'
       case 'carregando': return 'Carregando...'
       case 'sucesso': return 'Pronto!'
       case 'erro': return `Erro: ${e.mensagem}`
     }
   }
   ```
3. ```ts
   type CriarProduto = Omit<Produto, 'id' | 'sku'>
   type AtualizarProduto = Pick<Produto, 'id'> & Partial<Omit<Produto, 'id'>>
   ```
4. `any` desliga o TypeScript: você pode fazer qualquer coisa e ele não reclama. `unknown` aceita qualquer valor, mas **obriga** a verificar antes de usar.
   ```ts
   const dado: unknown = JSON.parse(texto)
   // dado.nome.toUpperCase()          // erro de compilação: precisa verificar
   if (typeof dado === 'object' && dado !== null && 'nome' in dado && typeof dado.nome === 'string') {
     dado.nome.toUpperCase()           // ok
   }
   ```
   Com `any`, o primeiro acesso compilaria e quebraria em runtime se `nome` não existisse.
5. ```ts
   function agruparPor<T, K extends keyof T>(lista: T[], chave: K): Record<string, T[]> {
     const res: Record<string, T[]> = {}
     for (const item of lista) {
       const k = String(item[chave])
       ;(res[k] ??= []).push(item)
     }
     return res
   }
   ```

## Projeto da etapa

Checklist:

- O estado da tela é uma union discriminada, e o `switch` cobre todos os casos.
- Resposta 404 do GitHub vira mensagem "Usuário não encontrado", não erro genérico.
- O debounce cancela a busca anterior (bônus: use `AbortController` para cancelar o `fetch` em andamento).
- `npx tsc --noEmit` sem erros.
