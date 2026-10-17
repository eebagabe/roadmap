# React — Apostila Prática

Roadmap Frontend React · Semanas 07 a 10

## Comece por aqui

React é uma biblioteca para construir interfaces com **componentes**: peças pequenas e reutilizáveis que juntas formam a tela. A ideia central é simples: **a interface é uma função do estado**. Você descreve como a tela deve ficar para cada estado, e o React cuida de atualizar o DOM.

### Por que isso vale ouro no mercado

- React é a biblioteca de frontend mais pedida em vagas no Brasil e no mundo.
- O mesmo conhecimento serve para React Native (apps mobile) e Next.js.
- Perguntas clássicas: por que `key`, quando um componente re-renderiza, `useEffect` e suas dependências, estado imutável.

### Como esta apostila funciona

1. Crie um projeto Vite e digite os exemplos.
2. Instale a extensão **React Developer Tools** no navegador para ver componentes, props e estado.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** componente se comportando estranho? Pergunte: "qual é o estado agora?" e "quem é dono desse estado?". Quase todo bug de React é estado no lugar errado ou estado alterado sem `set`.

### Preparando o ambiente

```bash
npm create vite@latest react-estudos -- --template react-ts
cd react-estudos
npm install
npm run dev
```

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 07 | Tema 1 — Componentes, JSX e props |
| 08 | Tema 2 — Estado, eventos e efeitos |
| 09 | Tema 3 — Hooks e padrões |
| 10 | Tema 4 — Rotas e formulários + projeto |

## Tema 1 — Componentes, JSX e props

**Objetivo:** criar componentes, passar dados entre eles e renderizar listas.

### 1.1 Por que React

Sem React, você atualiza o DOM manualmente: encontra o elemento, muda o texto, adiciona classe, remove item. Com muitas partes da tela dependendo dos mesmos dados, isso vira caos. Com React, você **declara** a tela a partir dos dados; quando os dados mudam, o React recalcula e aplica só as diferenças no DOM.

> **Analogia:** em vez de dar instruções ao pintor ("pinta essa parede de azul, agora tira o quadro"), você mostra a foto de como a sala deve ficar e ele descobre o que mudar.

### 1.2 JSX

JSX é uma sintaxe parecida com HTML dentro do JavaScript. Ela vira chamadas de função.

```tsx
const nome = 'Ana'
const elemento = <h1 className="titulo">Olá, {nome}!</h1>
```

Diferenças para HTML: `className` em vez de `class`, `htmlFor` em vez de `for`, atributos em camelCase (`onClick`, `tabIndex`), toda tag precisa fechar (`<img />`), e só uma raiz por retorno (use `<>...</>` fragment).

Dentro de `{}` vai qualquer **expressão** JavaScript (não `if` nem `for`, que são instruções).

### 1.3 Componentes e props

Componente é uma função que recebe **props** e retorna JSX. Nome começa com letra maiúscula.

```tsx
type CardProdutoProps = {
  nome: string
  preco: number
  emPromocao?: boolean
}

function CardProduto({ nome, preco, emPromocao = false }: CardProdutoProps) {
  return (
    <article className="card">
      <h2>{nome}</h2>
      <p>{preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
      {emPromocao && <span className="selo">Promoção</span>}
    </article>
  )
}

export function App() {
  return <CardProduto nome="Café" preco={19.9} emPromocao />
}
```

Props são **somente leitura**. Um componente nunca altera as próprias props.

A prop especial `children` é o conteúdo entre as tags:

```tsx
function Caixa({ children }: { children: React.ReactNode }) {
  return <div className="caixa">{children}</div>
}
<Caixa><p>Qualquer coisa aqui</p></Caixa>
```

### 1.4 Renderização condicional

```tsx
{carregando ? <Spinner /> : <Lista itens={itens} />}
{erro && <Alerta mensagem={erro} />}
{itens.length === 0 && <p>Nenhum item</p>}
```

> **Cuidado! Cai na entrevista:** `{itens.length && <Lista />}` mostra um **0** na tela quando a lista está vazia, porque `0` é falsy mas é renderizado. Use `itens.length > 0 &&`.

### 1.5 Listas e key

```tsx
<ul>
  {produtos.map(p => (
    <li key={p.id}>{p.nome}</li>
  ))}
</ul>
```

A `key` diz ao React **qual item é qual** entre renderizações. Use um ID estável e único. **Não** use o índice do array se a lista pode ser reordenada, filtrada ou ter itens inseridos: o React vai confundir os itens (e o estado interno deles, como o texto de um input).

### Atividades de fixação — Tema 1

1. Crie um componente `Avatar` que recebe `nome` e `url` e mostra a imagem com `alt` adequado. Se `url` não vier, mostra as iniciais.
2. Converta este HTML em JSX válido: `<label for="email" class="rotulo">E-mail</label><input id="email" type="email" required><img src="logo.png">`.
3. Renderize uma lista de tarefas com `map`, mostrando "Nenhuma tarefa" quando vazia.
4. Explique o bug de usar `index` como `key` numa lista em que você pode remover o primeiro item e cada item tem um `<input>`.
5. Crie um componente `Card` que aceita `titulo` e `children`, e use-o para três conteúdos diferentes.

## Tema 2 — Estado, eventos e efeitos

**Objetivo:** fazer a interface reagir a ações do usuário e sincronizar com o mundo externo.

### 2.1 useState

**Estado** é um dado que muda com o tempo e, quando muda, a tela atualiza.

```tsx
import { useState } from 'react'

function Contador() {
  const [valor, setValor] = useState(0)
  return (
    <button onClick={() => setValor(valor + 1)}>
      Cliquei {valor} vezes
    </button>
  )
}
```

Quando você chama `setValor`, o React **re-renderiza** o componente: chama a função de novo, agora com o valor novo.

Atualização baseada no valor anterior: use a forma de função.

```tsx
setValor(v => v + 1)   // seguro mesmo com várias atualizações seguidas
```

### 2.2 Eventos

```tsx
function Busca({ onBuscar }: { onBuscar: (termo: string) => void }) {
  const [termo, setTermo] = useState('')
  return (
    <form onSubmit={e => { e.preventDefault(); onBuscar(termo) }}>
      <input value={termo} onChange={e => setTermo(e.target.value)} aria-label="Buscar" />
      <button type="submit">Buscar</button>
    </form>
  )
}
```

Passe a **função**, não o resultado: `onClick={salvar}` ou `onClick={() => salvar(id)}`, nunca `onClick={salvar()}`.

### 2.3 Estado imutável

O React compara a referência do estado para saber se mudou. Se você alterar o objeto por dentro, a referência é a mesma e **nada acontece**.

```tsx
// ERRADO
tarefas.push(nova)
setTarefas(tarefas)

// CERTO: crie um novo array/objeto
setTarefas([...tarefas, nova])                                     // adicionar
setTarefas(tarefas.filter(t => t.id !== id))                       // remover
setTarefas(tarefas.map(t => t.id === id ? { ...t, feita: !t.feita } : t))  // alterar
setUsuario({ ...usuario, endereco: { ...usuario.endereco, cidade: 'Recife' } })  // aninhado
```

### 2.4 Levantar estado

Quando dois componentes precisam do mesmo dado, o estado sobe para o **ancestral comum** mais próximo, que passa o valor e as funções por props.

```tsx
function Loja() {
  const [carrinho, setCarrinho] = useState<Produto[]>([])
  return (
    <>
      <Catalogo onAdicionar={p => setCarrinho(c => [...c, p])} />
      <ResumoCarrinho itens={carrinho} />
    </>
  )
}
```

Regra de ouro: **uma única fonte de verdade**. Não duplique estado. E não guarde em estado o que dá para **calcular** a partir de outro estado:

```tsx
const total = carrinho.reduce((s, p) => s + p.preco, 0)   // derivado: sem useState!
```

### 2.5 useEffect

`useEffect` serve para **sincronizar** o componente com algo **fora do React**: API, timer, `document.title`, eventos da janela, localStorage.

```tsx
function Usuario({ login }: { login: string }) {
  const [dados, setDados] = useState<GitHubUser | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const controle = new AbortController()
    setErro(null)
    fetch(`https://api.github.com/users/${login}`, { signal: controle.signal })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setDados)
      .catch(e => { if (e.name !== 'AbortError') setErro(e.message) })
    return () => controle.abort()       // limpeza: cancela se login mudar ou o componente sair
  }, [login])                           // roda de novo quando 'login' mudar

  if (erro) return <p>Erro: {erro}</p>
  if (!dados) return <p>Carregando...</p>
  return <h2>{dados.name}</h2>
}
```

Array de dependências:

| Dependências | Roda |
|---|---|
| Sem array | Depois de **toda** renderização |
| `[]` | Uma vez, ao montar |
| `[a, b]` | Ao montar e quando `a` ou `b` mudar |

> **Cuidado! Cai na entrevista:** "Você talvez não precise de um efeito." Calcular valor derivado, filtrar uma lista, reagir a um clique: nada disso precisa de `useEffect`. Efeito é para sincronizar com o mundo externo. E sempre declare **todas** as dependências que o efeito usa (o ESLint avisa).

### 2.6 Ciclo de renderização e Strict Mode

1. **Trigger:** algo pede renderização (montagem, `setState`, pai re-renderizou).
2. **Render:** o React chama seu componente e calcula o novo JSX (deve ser uma função **pura**).
3. **Commit:** aplica as diferenças no DOM.
4. Depois roda os efeitos.

Quando um componente re-renderiza, **todos os filhos** re-renderizam também (por padrão).

Em desenvolvimento, o `<StrictMode>` monta, desmonta e monta de novo cada componente, e roda os efeitos duas vezes. É de propósito: revela efeitos sem limpeza. Em produção roda uma vez.

### Atividades de fixação — Tema 2

1. Faça uma lista de tarefas: adicionar, marcar como feita, remover. Tudo com estado imutável.
2. Encontre os 2 bugs:
   ```tsx
   function Carrinho() {
     const [itens, setItens] = useState<string[]>([])
     const [total, setTotal] = useState(0)
     function adicionar(item: string) { itens.push(item); setItens(itens); setTotal(itens.length) }
     return <button onClick={adicionar('Café')}>Adicionar ({total})</button>
   }
   ```
3. Clicar no botão abaixo aumenta quanto? Por quê? Como fazer aumentar 3?
   ```tsx
   <button onClick={() => { setN(n + 1); setN(n + 1); setN(n + 1) }}>+3</button>
   ```
4. Faça um componente que mostra a largura da janela e atualiza ao redimensionar. Não esqueça a limpeza.
5. Por que o efeito abaixo é desnecessário? Reescreva.
   ```tsx
   const [filtrados, setFiltrados] = useState<Produto[]>([])
   useEffect(() => { setFiltrados(produtos.filter(p => p.nome.includes(busca))) }, [produtos, busca])
   ```

## Tema 3 — Hooks e padrões

**Objetivo:** usar os outros hooks e organizar lógica reutilizável.

### 3.1 useRef

Guarda um valor que **persiste** entre renderizações mas **não causa** re-renderização ao mudar. Dois usos:

```tsx
// 1. Acessar um elemento do DOM
const inputRef = useRef<HTMLInputElement>(null)
<input ref={inputRef} />
<button onClick={() => inputRef.current?.focus()}>Focar</button>

// 2. Guardar um valor mutável (id de timer, valor anterior)
const timerRef = useRef<number | undefined>(undefined)
```

### 3.2 useMemo e useCallback

- `useMemo` memoriza o **resultado** de um cálculo caro.
- `useCallback` memoriza uma **função** (mesma referência entre renderizações).

```tsx
const ordenados = useMemo(() => produtos.toSorted((a, b) => a.preco - b.preco), [produtos])
const aoSelecionar = useCallback((id: number) => setSelecionado(id), [])
```

> **Na prática:** não use em tudo. Só quando há um cálculo realmente caro ou quando a referência estável importa (filho com `React.memo`, dependência de efeito). O **React Compiler** já automatiza boa parte dessas memorizações em projetos que o adotam.

### 3.3 useReducer

Para estado com várias ações relacionadas, um **reducer** centraliza a lógica:

```tsx
type Estado = { itens: Item[]; cupom: string | null }
type Acao =
  | { tipo: 'adicionar'; item: Item }
  | { tipo: 'remover'; id: number }
  | { tipo: 'aplicarCupom'; cupom: string }

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.tipo) {
    case 'adicionar': return { ...estado, itens: [...estado.itens, acao.item] }
    case 'remover': return { ...estado, itens: estado.itens.filter(i => i.id !== acao.id) }
    case 'aplicarCupom': return { ...estado, cupom: acao.cupom }
  }
}

const [estado, dispatch] = useReducer(reducer, { itens: [], cupom: null })
dispatch({ tipo: 'adicionar', item })
```

Vantagem: o reducer é uma função pura, fácil de testar sem React.

### 3.4 Context API

Evita passar props por muitos níveis (**prop drilling**) para dados "globais" como tema, usuário logado, idioma.

```tsx
type Tema = 'claro' | 'escuro'
const TemaContext = createContext<{ tema: Tema; alternar: () => void } | null>(null)

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>('claro')
  const alternar = () => setTema(t => (t === 'claro' ? 'escuro' : 'claro'))
  return <TemaContext.Provider value={{ tema, alternar }}>{children}</TemaContext.Provider>
}

export function useTema() {
  const ctx = useContext(TemaContext)
  if (!ctx) throw new Error('useTema precisa estar dentro de TemaProvider')
  return ctx
}
```

Cuidado: quando o valor do contexto muda, **todos** que o consomem re-renderizam. Não é bom para estado que muda muito.

### 3.5 Custom hooks

Função que começa com `use` e usa outros hooks. É a forma de **reaproveitar lógica** (não interface).

```tsx
function useLocalStorage<T>(chave: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const salvo = localStorage.getItem(chave)
      return salvo ? (JSON.parse(salvo) as T) : inicial
    } catch {
      return inicial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(chave, JSON.stringify(valor)) } catch { /* sem storage */ }
  }, [chave, valor])
  return [valor, setValor] as const
}

const [tarefas, setTarefas] = useLocalStorage<Tarefa[]>('tarefas', [])
```

Regras dos hooks: só chame hooks **no topo** do componente ou de outro hook (nunca dentro de `if`, `for` ou funções aninhadas). O React identifica cada hook pela **ordem** de chamada.

### 3.6 Composição de componentes

Prefira compor peças pequenas a criar um componente gigante cheio de props `mostrarX`, `variantY`:

```tsx
<Modal aberto={aberto} onFechar={fechar}>
  <Modal.Titulo>Excluir produto?</Modal.Titulo>
  <Modal.Corpo>Essa ação não pode ser desfeita.</Modal.Corpo>
  <Modal.Acoes>
    <Botao variante="secundario" onClick={fechar}>Cancelar</Botao>
    <Botao variante="perigo" onClick={excluir}>Excluir</Botao>
  </Modal.Acoes>
</Modal>
```

### Atividades de fixação — Tema 3

1. Crie um campo de busca que recebe foco automaticamente quando a página abre (`useRef` + `useEffect`).
2. Reescreva a lista de tarefas do Tema 2 com `useReducer`. Escreva um teste simples (só JavaScript) para o reducer.
3. Crie um `AuthContext` com `usuario`, `entrar(nome)` e `sair()`, e um hook `useAuth`.
4. Crie o hook `useDebounce(valor, ms)` que devolve o valor só depois de `ms` sem mudanças.
5. O que está errado aqui e por quê?
   ```tsx
   function Perfil({ logado }: { logado: boolean }) {
     if (!logado) return <Login />
     const [aba, setAba] = useState('dados')
     // ...
   }
   ```

## Tema 4 — Rotas e formulários

**Objetivo:** criar aplicações com várias páginas e formulários validados.

### 4.1 React Router

```bash
npm install react-router-dom
```

```tsx
import { BrowserRouter, Routes, Route, Link, NavLink, useParams, useNavigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/">Início</NavLink>
        <NavLink to="/produtos">Produtos</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/produtos/:id" element={<DetalheProduto />} />
        <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </BrowserRouter>
  )
}

function DetalheProduto() {
  const { id } = useParams()          // rota dinâmica
  const navigate = useNavigate()
  return <button onClick={() => navigate('/produtos')}>Voltar ({id})</button>
}
```

Use `<Link>` (não `<a href>`) para navegar sem recarregar a página. Filtros e paginação podem ficar na URL com `useSearchParams`: o usuário pode compartilhar o link e o botão "voltar" funciona.

### 4.2 Formulários controlados

Controlado = o valor do input vem do estado.

```tsx
const [form, setForm] = useState({ nome: '', email: '' })
const mudar = (e: React.ChangeEvent<HTMLInputElement>) =>
  setForm(f => ({ ...f, [e.target.name]: e.target.value }))

<input name="nome" value={form.nome} onChange={mudar} />
```

Funciona bem para formulários pequenos. Em formulários grandes, cada tecla re-renderiza tudo e a validação fica trabalhosa.

### 4.3 React Hook Form + Zod

```bash
npm install react-hook-form zod @hookform/resolvers
```

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  nome: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  idade: z.coerce.number().int().min(18, 'Precisa ser maior de idade'),
})
type FormDados = z.infer<typeof schema>      // o tipo TS sai do schema!

function Cadastro() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormDados>({ resolver: zodResolver(schema) })

  const enviar = async (dados: FormDados) => {
    await fetch('/api/cadastro', { method: 'POST', body: JSON.stringify(dados) })
  }

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate>
      <label htmlFor="nome">Nome</label>
      <input id="nome" {...register('nome')} aria-invalid={!!errors.nome} />
      {errors.nome && <p role="alert">{errors.nome.message}</p>}

      <label htmlFor="email">E-mail</label>
      <input id="email" type="email" {...register('email')} aria-invalid={!!errors.email} />
      {errors.email && <p role="alert">{errors.email.message}</p>}

      <label htmlFor="idade">Idade</label>
      <input id="idade" type="number" {...register('idade')} />
      {errors.idade && <p role="alert">{errors.idade.message}</p>}

      <button disabled={isSubmitting}>{isSubmitting ? 'Enviando...' : 'Cadastrar'}</button>
    </form>
  )
}
```

O mesmo schema Zod pode validar a resposta da API, unindo validação em runtime e tipos do TypeScript.

### 4.4 Tratamento de erros

- **Error Boundary:** captura erros de renderização de uma parte da árvore e mostra uma tela alternativa, sem derrubar o app inteiro. (A biblioteca `react-error-boundary` facilita.)
- Erros de requisição: estado de erro na tela, com mensagem útil e botão "tentar de novo".
- Erros de formulário: perto do campo, com `role="alert"` e `aria-invalid`.

### Atividades de fixação — Tema 4

1. Crie um app com 3 rotas: lista de produtos, detalhe (`/produtos/:id`) e uma página 404.
2. Coloque o filtro de categoria da lista de produtos na URL (`?categoria=bebidas`) com `useSearchParams`.
3. Crie um formulário de cadastro com React Hook Form e Zod: nome, e-mail, senha (mínimo 8, com um número) e confirmação de senha (precisa ser igual).
4. Por que usar `<Link>` e não `<a href>` entre páginas do seu app?
5. Envolva a página de detalhe num Error Boundary e force um erro para ver a tela alternativa.

## Projeto da etapa

**Catálogo de filmes** usando a API pública do TMDB (ou outra API aberta):

1. Rotas: busca, detalhe do filme, favoritos e 404.
2. Busca com debounce e termo na URL.
3. Favoritos salvos no localStorage com um custom hook.
4. Tema claro/escuro com Context.
5. Formulário "avaliar filme" com React Hook Form + Zod.
6. Estados de carregando, vazio e erro em todas as telas.
7. TypeScript estrito, publicado na Vercel.

## Resumão

- A interface é uma função do estado. Props descem, eventos sobem.
- `key` estável e única em listas; nada de índice em listas que mudam.
- Estado é imutável: sempre crie objetos e arrays novos.
- Não guarde em estado o que dá para calcular.
- `useEffect` é para sincronizar com o mundo externo, com limpeza e dependências completas.
- Hooks no topo, sempre na mesma ordem. Custom hooks reaproveitam lógica.
- React Router para páginas, React Hook Form + Zod para formulários.
