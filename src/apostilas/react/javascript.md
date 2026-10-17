# JavaScript e TypeScript — Apostila Prática

Roadmap Frontend React · Semanas 04 a 06

## Comece por aqui

React é "só JavaScript". Quem domina JavaScript aprende React em poucas semanas; quem não domina passa meses brigando com `undefined`, `this` e promessas que nunca resolvem. E o TypeScript virou padrão: a grande maioria das vagas de front pede.

### Por que isso vale ouro no mercado

- Entrevistas de front adoram: closures, event loop, `this`, `==` vs `===`, promessas.
- `map`, `filter`, `reduce`, desestruturação e spread aparecem em toda linha de código React.
- TypeScript pega bugs antes de rodar e serve de documentação viva.

### Como esta apostila funciona

1. Rode os exemplos no console do navegador (F12) ou com `node arquivo.js`.
2. Antes de rodar, **preveja** o resultado. Errou? Descubra o porquê.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** não entendeu um trecho? Coloque `console.log` em cada linha ou use `debugger;` e execute passo a passo no DevTools.

### Preparando o ambiente

```bash
node -v                       # use Node 20 ou mais novo
npm create vite@latest js-estudos -- --template vanilla-ts
```

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 04 | Tema 1 — JavaScript essencial |
| 05 | Tema 2 — Assíncrono e o navegador |
| 06 | Tema 3 — TypeScript + projeto |

## Tema 1 — JavaScript essencial

**Objetivo:** escrever JavaScript moderno sem cair nas pegadinhas da linguagem.

### 1.1 Tipos e coerção

Primitivos: `string`, `number`, `boolean`, `null`, `undefined`, `bigint`, `symbol`. Todo o resto é **objeto** (incluindo arrays e funções).

- `undefined`: "ainda não tem valor".
- `null`: "não tem valor, de propósito".

**Coerção** é o JavaScript convertendo tipos sozinho:

```js
'5' + 1        // '51'  (vira texto)
'5' - 1        // 4     (vira número)
0 == ''        // true  (!!)
0 === ''       // false
```

> **Cuidado! Cai na entrevista:** use **sempre `===`** (compara tipo e valor). E saiba os valores **falsy**: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`. Todo o resto é truthy, incluindo `[]`, `{}` e `'0'`.

### 1.2 let, const e escopo

- `const`: não pode ser **reatribuída** (mas um objeto `const` pode ser alterado por dentro).
- `let`: pode ser reatribuída. Escopo de **bloco** (`{}`).
- `var`: escopo de função e "hoisting" confuso. **Não use.**

```js
const usuario = { nome: 'Ana' }
usuario.nome = 'Bia'      // ok
// usuario = {}           // erro: reatribuição
```

### 1.3 Funções e arrow functions

```js
function somar(a, b) { return a + b }
const somar2 = (a, b) => a + b
const dobro = n => n * 2
const criar = nome => ({ nome })   // objeto: precisa de parênteses
```

Funções são **valores**: dá para guardar em variável, passar como argumento e retornar. Isso é a base de `map`, `filter` e de todo o React.

### 1.4 Objetos, arrays, desestruturação e spread

```js
const produto = { id: 1, nome: 'Café', preco: 20, tags: ['bebida'] }

const { nome, preco } = produto                 // desestruturação
const [primeira] = produto.tags

const promo = { ...produto, preco: 15 }         // cópia com alteração (spread)
const lista = [...produto.tags, 'promo']        // novo array

function exibir({ nome, preco = 0 }) { return `${nome}: R$ ${preco}` }  // no parâmetro, com padrão
```

Encadeamento opcional e coalescência:

```js
usuario?.endereco?.cidade ?? 'Não informada'
```

`??` só usa o padrão se for `null` ou `undefined`. `||` usa para qualquer falsy (inclusive `0`, o que costuma ser bug).

### 1.5 map, filter e reduce

```js
const pedidos = [
  { cliente: 'Ana', total: 150, pago: true },
  { cliente: 'Bruno', total: 300, pago: false },
  { cliente: 'Ana', total: 80, pago: true },
]

const totais = pedidos.map(p => p.total)                  // [150, 300, 80]
const pagos = pedidos.filter(p => p.pago)                 // 2 pedidos
const soma = pagos.reduce((acc, p) => acc + p.total, 0)   // 230

const porCliente = pedidos.reduce((acc, p) => {
  acc[p.cliente] = (acc[p.cliente] ?? 0) + p.total
  return acc
}, {})                                                     // { Ana: 230, Bruno: 300 }
```

Outros que você vai usar: `find`, `some`, `every`, `includes`, `sort` (**altera** o array original; use `toSorted`), `flatMap`.

### 1.6 Closures

Uma **closure** é uma função que "lembra" das variáveis do lugar onde foi criada, mesmo depois que esse lugar terminou de executar.

```js
function criarContador() {
  let contagem = 0
  return () => ++contagem
}
const proximo = criarContador()
proximo() // 1
proximo() // 2   (contagem continua viva dentro da closure)
```

> **Analogia:** a função sai de casa levando uma mochila com as variáveis que existiam lá. Ela pode abrir a mochila quando quiser.

Os hooks do React dependem de closures. E o bug de "estado antigo" (stale closure) que você verá no React é exatamente uma closure que guardou um valor velho.

### 1.7 this

O valor de `this` depende de **como** a função é chamada, não de onde foi escrita:

```js
const pessoa = {
  nome: 'Ana',
  ola() { return `Oi, ${this.nome}` },
  olaArrow: () => `Oi, ${this?.nome}`,
}
pessoa.ola()               // 'Oi, Ana'
const f = pessoa.ola
f()                        // this é undefined (em módulos/strict mode): erro ou 'Oi, undefined'
pessoa.olaArrow()          // arrow não tem this próprio: pega o de fora
```

No React moderno (componentes de função), você quase não usa `this`. Mas cai em entrevista.

### Atividades de fixação — Tema 1

1. Preveja o resultado: `[] + []`, `[] == false`, `null == undefined`, `null === undefined`, `typeof null`, `NaN === NaN`.
2. Com o array `pedidos` acima: (a) nomes únicos de clientes; (b) o pedido de maior valor; (c) existe algum pedido acima de 250?
3. Escreva `agruparPor(lista, chave)` com `reduce`, que transforma `[{tipo:'a'},{tipo:'b'},{tipo:'a'}]` em `{ a: [...], b: [...] }`.
4. O que imprime e por quê? Como corrigir usando `let`?
   ```js
   for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0)
   ```
5. Crie uma função `criarCarteira(saldoInicial)` que retorna `depositar`, `sacar` e `saldo`, sem permitir alterar o saldo direto de fora (use closure).

## Tema 2 — Assíncrono e o navegador

**Objetivo:** entender como o JavaScript faz várias coisas "ao mesmo tempo" com uma thread só.

### 2.1 Event Loop

JavaScript no navegador roda numa **única thread**. Para não travar enquanto espera rede ou timer, ele usa o **event loop**:

1. **Call stack:** o código que está rodando agora.
2. **Web APIs:** o navegador cuida de timers, `fetch`, eventos.
3. Quando terminam, os callbacks vão para filas:
   - **Microtasks** (promises, `queueMicrotask`): prioridade alta.
   - **Macrotasks** (`setTimeout`, eventos): depois.
4. Quando a stack esvazia, o loop roda **todas** as microtasks, depois **uma** macrotask, e repete.

```js
console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
console.log('4')
// 1, 4, 3, 2
```

> **Cuidado! Cai na entrevista:** essa ordem (sync → microtasks → macrotasks) é pergunta clássica. E um loop pesado síncrono **trava a página inteira**, porque o event loop não consegue rodar mais nada.

### 2.2 Callbacks e Promises

Callback é passar uma função para ser chamada depois. Muitos callbacks aninhados viram o "callback hell". **Promise** representa um valor futuro, com três estados: pendente, resolvida, rejeitada.

```js
function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

esperar(500)
  .then(() => fetch('/api/produtos'))
  .then(resp => resp.json())
  .then(produtos => console.log(produtos))
  .catch(erro => console.error(erro))
```

Combinações:

- `Promise.all([...])`: espera todas; falha se **uma** falhar.
- `Promise.allSettled([...])`: espera todas e diz qual deu certo ou errado.
- `Promise.race` / `Promise.any`: a primeira que terminar / a primeira que der certo.

### 2.3 async/await e fetch

`async/await` é açúcar sobre promises: código assíncrono com cara de síncrono.

```js
async function buscarUsuario(login) {
  const resp = await fetch(`https://api.github.com/users/${login}`)
  if (!resp.ok) throw new Error(`Erro ${resp.status}`)   // fetch NÃO rejeita em 404/500!
  return resp.json()
}

try {
  const [ana, bia] = await Promise.all([buscarUsuario('ana'), buscarUsuario('bia')])  // em paralelo
} catch (e) {
  console.error('Falhou:', e.message)
}
```

> **Cuidado! Cai na entrevista:** `fetch` só rejeita a promise em **falha de rede**. Uma resposta 404 ou 500 é uma resposta válida: confira `resp.ok`. E dois `await` em sequência rodam **um depois do outro**; use `Promise.all` para paralelo.

Enviar JSON:

```js
await fetch('/api/pedidos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ produtoId: 1, quantidade: 2 }),
})
```

### 2.4 DOM e eventos

```js
const form = document.querySelector('#busca')
form.addEventListener('submit', async (evento) => {
  evento.preventDefault()                         // não recarrega a página
  const termo = new FormData(form).get('q')
  const lista = document.querySelector('#resultados')
  lista.replaceChildren()                          // limpa
  for (const item of await buscar(termo)) {
    const li = document.createElement('li')
    li.textContent = item.nome                     // textContent, não innerHTML (evita XSS)
    lista.append(li)
  }
})
```

**Propagação:** eventos "sobem" do elemento clicado até o `document` (bubbling). Isso permite **delegação**: um único listener no pai trata cliques de todos os filhos.

### 2.5 Módulos ES

```js
// utils.js
export const formatarPreco = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export default function somar(a, b) { return a + b }

// main.js
import somar, { formatarPreco } from './utils.js'
```

### Atividades de fixação — Tema 2

1. Preveja a ordem:
   ```js
   console.log('A')
   setTimeout(() => console.log('B'), 0)
   Promise.resolve().then(() => console.log('C')).then(() => console.log('D'))
   queueMicrotask(() => console.log('E'))
   console.log('F')
   ```
2. Reescreva com `async/await` e tratamento de erro: `fetch(url).then(r => r.json()).then(d => mostrar(d))`.
3. Busque 3 usuários do GitHub em paralelo e mostre os que deram certo, mesmo que um falhe.
4. Faça uma busca com `input` que só chama a API 400 ms depois que a pessoa para de digitar (**debounce**).
5. Por que usar `textContent` em vez de `innerHTML` para mostrar texto vindo do usuário?

## Tema 3 — TypeScript

**Objetivo:** tipar código JavaScript e React com confiança.

### 3.1 Tipos básicos e inferência

```ts
let nome: string = 'Ana'
let idade = 30                 // inferido como number
const tags: string[] = ['a', 'b']
function somar(a: number, b: number): number { return a + b }
```

Deixe o TypeScript **inferir** sempre que possível. Tipe parâmetros de função e retornos públicos.

Evite `any` (desliga a checagem). Quando não souber o tipo, use `unknown` e verifique antes de usar.

### 3.2 Interfaces e types

```ts
type Produto = {
  id: number
  nome: string
  preco: number
  descricao?: string        // opcional
  readonly sku: string
}

interface Usuario {
  id: string
  email: string
}
interface Admin extends Usuario {
  permissoes: string[]
}
```

`type` e `interface` são quase equivalentes para objetos. Regra simples: use `type` por padrão (serve para unions também) e `interface` quando precisar de extensão/declaração aberta. O importante é ser consistente no projeto.

### 3.3 Union types e narrowing

```ts
type Status = 'carregando' | 'sucesso' | 'erro'

type Resultado =
  | { status: 'carregando' }
  | { status: 'sucesso'; dados: Produto[] }
  | { status: 'erro'; mensagem: string }

function render(r: Resultado) {
  switch (r.status) {
    case 'carregando': return 'Carregando...'
    case 'sucesso':    return `${r.dados.length} produtos`   // aqui o TS sabe que existe 'dados'
    case 'erro':       return r.mensagem
  }
}
```

Isso é uma **union discriminada**: o campo `status` diz qual formato o objeto tem. Padrão muito usado em estados de tela no React.

Narrowing com `typeof`, `in`, `instanceof` e checagem de `null`:

```ts
function tamanho(x: string | string[] | null) {
  if (x === null) return 0
  if (typeof x === 'string') return x.length
  return x.length
}
```

### 3.4 Generics

```ts
function primeiro<T>(lista: T[]): T | undefined {
  return lista[0]
}
primeiro([1, 2, 3])        // number | undefined
primeiro(['a'])            // string | undefined

type RespostaApi<T> = { dados: T; pagina: number; total: number }
async function get<T>(url: string): Promise<T> {
  const r = await fetch(url)
  return r.json() as Promise<T>
}
const produtos = await get<RespostaApi<Produto[]>>('/api/produtos')
```

### 3.5 Utility types

| Utility | Faz | Exemplo |
|---|---|---|
| `Partial<T>` | Tudo opcional | Formulário de edição |
| `Required<T>` | Tudo obrigatório | |
| `Pick<T, K>` | Só algumas chaves | `Pick<Produto, 'id' \| 'nome'>` |
| `Omit<T, K>` | Tudo menos algumas | `Omit<Produto, 'id'>` para criação |
| `Record<K, V>` | Objeto chave → valor | `Record<Status, string>` |
| `ReturnType<F>` | Tipo do retorno | |

### 3.6 tsconfig

Opções importantes:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx"
  }
}
```

> **Cuidado! Cai na entrevista:** TypeScript só existe **em tempo de desenvolvimento**. Os tipos somem no JavaScript final. Dados que vêm de fora (API, formulário) não são validados pelo TS: para isso use uma biblioteca de validação em runtime, como o **Zod**.

### Atividades de fixação — Tema 3

1. Tipe esta função: `function buscar(lista, termo) { return lista.filter(p => p.nome.includes(termo)) }` para uma lista de `Produto`.
2. Crie um tipo `EstadoRequisicao<T>` como union discriminada (ocioso, carregando, sucesso com dados `T`, erro com mensagem) e uma função que retorna um texto para cada estado.
3. Usando utility types, crie a partir de `Produto`: (a) o tipo para criar produto (sem `id` e `sku`); (b) o tipo para atualizar (tudo opcional menos `id`).
4. Qual a diferença entre `any` e `unknown`? Mostre um exemplo em que `unknown` evita um bug.
5. Escreva uma função genérica `agruparPor<T, K extends keyof T>(lista: T[], chave: K)`.

## Projeto da etapa

**Busca de usuários do GitHub em TypeScript puro (sem framework):**

1. Projeto Vite `vanilla-ts`.
2. Campo de busca com debounce de 400 ms.
3. Mostra avatar, nome, bio e os 5 repositórios mais recentes.
4. Estados de carregando, vazio e erro (com union discriminada).
5. Sem nenhum `any`. `strict: true`.

Quando chegar no React, refaça este projeto e compare quanto código o React economiza.

## Resumão

- Use `===`, `const` por padrão, `let` quando precisar, nunca `var`.
- Saiba os falsy. `??` para padrões de null/undefined.
- `map`/`filter`/`reduce` e spread estão em todo código React.
- Closures guardam variáveis do lugar onde a função nasceu.
- Event loop: síncrono → microtasks (promises) → macrotasks (timers).
- `fetch` não rejeita em 404/500. Paralelo com `Promise.all`.
- TypeScript: infira quando puder, evite `any`, use unions discriminadas, valide dados externos em runtime.
