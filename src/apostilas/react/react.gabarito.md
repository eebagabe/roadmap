# Gabarito — React

Abra só depois de tentar.

## Tema 1

1. ```tsx
   function Avatar({ nome, url }: { nome: string; url?: string }) {
     if (url) return <img src={url} alt={`Foto de ${nome}`} className="avatar" width={48} height={48} />
     const iniciais = nome.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]!.toUpperCase()).join('')
     return <span className="avatar" role="img" aria-label={nome}>{iniciais}</span>
   }
   ```
2. ```tsx
   <>
     <label htmlFor="email" className="rotulo">E-mail</label>
     <input id="email" type="email" required />
     <img src="logo.png" alt="Logo da empresa" />
   </>
   ```
3. ```tsx
   function ListaTarefas({ tarefas }: { tarefas: { id: number; texto: string }[] }) {
     if (tarefas.length === 0) return <p>Nenhuma tarefa</p>
     return <ul>{tarefas.map(t => <li key={t.id}>{t.texto}</li>)}</ul>
   }
   ```
4. Com `key={index}`, ao remover o primeiro item, o item que era o índice 1 passa a ser o índice 0. O React acha que o componente de `key=0` **continua** e só mudou de props, então reaproveita o componente e o **estado interno** dele (o texto digitado no input). Resultado: os textos ficam "deslocados" e aparecem no item errado. Com `key={tarefa.id}`, o React sabe exatamente qual item saiu.
5. ```tsx
   function Card({ titulo, children }: { titulo: string; children: React.ReactNode }) {
     return (
       <section className="card">
         <h2>{titulo}</h2>
         {children}
       </section>
     )
   }
   ```

## Tema 2

1. ```tsx
   type Tarefa = { id: string; texto: string; feita: boolean }

   function Tarefas() {
     const [tarefas, setTarefas] = useState<Tarefa[]>([])
     const [texto, setTexto] = useState('')

     function adicionar(e: React.FormEvent) {
       e.preventDefault()
       if (!texto.trim()) return
       setTarefas(ts => [...ts, { id: crypto.randomUUID(), texto, feita: false }])
       setTexto('')
     }
     const alternar = (id: string) => setTarefas(ts => ts.map(t => (t.id === id ? { ...t, feita: !t.feita } : t)))
     const remover = (id: string) => setTarefas(ts => ts.filter(t => t.id !== id))

     return (
       <>
         <form onSubmit={adicionar}>
           <input value={texto} onChange={e => setTexto(e.target.value)} aria-label="Nova tarefa" />
           <button>Adicionar</button>
         </form>
         <ul>
           {tarefas.map(t => (
             <li key={t.id}>
               <label><input type="checkbox" checked={t.feita} onChange={() => alternar(t.id)} /> {t.texto}</label>
               <button onClick={() => remover(t.id)} aria-label={`Remover ${t.texto}`}>×</button>
             </li>
           ))}
         </ul>
       </>
     )
   }
   ```
2. (1) `onClick={adicionar('Café')}` **chama** a função durante a renderização (e ela chama `setState`, causando loop infinito de renderização). Correto: `onClick={() => adicionar('Café')}`. (2) `itens.push` altera o array existente e `setItens(itens)` passa a **mesma referência**: o React não vê mudança. Além disso, `total` é estado duplicado: é só `itens.length`. Correto: `setItens(i => [...i, item])` e `const total = itens.length`.
3. Aumenta **1**. As três chamadas usam o mesmo `n` daquela renderização (closure): todas pedem `n + 1`. Para aumentar 3, use a forma de função: `setN(v => v + 1)` três vezes, pois cada uma recebe o valor atualizado pela anterior.
4. ```tsx
   function LarguraJanela() {
     const [largura, setLargura] = useState(window.innerWidth)
     useEffect(() => {
       const aoMudar = () => setLargura(window.innerWidth)
       window.addEventListener('resize', aoMudar)
       return () => window.removeEventListener('resize', aoMudar)
     }, [])
     return <p>{largura}px</p>
   }
   ```
5. `filtrados` é um valor **derivado** de `produtos` e `busca`. O efeito causa uma renderização extra (renderiza com a lista antiga e depois com a nova) e cria estado duplicado. Basta calcular durante a renderização:
   ```tsx
   const filtrados = produtos.filter(p => p.nome.includes(busca))
   // se for caro: const filtrados = useMemo(() => ..., [produtos, busca])
   ```

## Tema 3

1. ```tsx
   function BuscaComFoco() {
     const ref = useRef<HTMLInputElement>(null)
     useEffect(() => { ref.current?.focus() }, [])
     return <input ref={ref} aria-label="Buscar" />
   }
   ```
   (Para esse caso específico, o atributo `autoFocus` também funciona.)
2. ```ts
   type Acao = { tipo: 'adicionar'; texto: string } | { tipo: 'alternar'; id: string } | { tipo: 'remover'; id: string }

   function tarefasReducer(estado: Tarefa[], acao: Acao): Tarefa[] {
     switch (acao.tipo) {
       case 'adicionar': return [...estado, { id: crypto.randomUUID(), texto: acao.texto, feita: false }]
       case 'alternar': return estado.map(t => (t.id === acao.id ? { ...t, feita: !t.feita } : t))
       case 'remover': return estado.filter(t => t.id !== acao.id)
     }
   }

   // teste simples
   const s1 = tarefasReducer([], { tipo: 'adicionar', texto: 'Estudar' })
   console.assert(s1.length === 1 && s1[0].feita === false)
   const s2 = tarefasReducer(s1, { tipo: 'alternar', id: s1[0].id })
   console.assert(s2[0].feita === true && s1[0].feita === false) // s1 não foi alterado
   ```
   (Gerar o `id` dentro do reducer o torna impuro; numa versão mais rigorosa, o `id` vem na ação.)
3. ```tsx
   type Usuario = { nome: string }
   const AuthContext = createContext<{ usuario: Usuario | null; entrar: (nome: string) => void; sair: () => void } | null>(null)

   export function AuthProvider({ children }: { children: React.ReactNode }) {
     const [usuario, setUsuario] = useState<Usuario | null>(null)
     const value = useMemo(() => ({
       usuario,
       entrar: (nome: string) => setUsuario({ nome }),
       sair: () => setUsuario(null),
     }), [usuario])
     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
   }

   export function useAuth() {
     const ctx = useContext(AuthContext)
     if (!ctx) throw new Error('useAuth fora do AuthProvider')
     return ctx
   }
   ```
4. ```ts
   function useDebounce<T>(valor: T, ms = 400): T {
     const [atrasado, setAtrasado] = useState(valor)
     useEffect(() => {
       const t = setTimeout(() => setAtrasado(valor), ms)
       return () => clearTimeout(t)
     }, [valor, ms])
     return atrasado
   }
   ```
5. O `useState` é chamado **depois** de um `return` condicional. Quando `logado` muda, o número e a ordem de hooks chamados mudam entre renderizações, e o React perde a correspondência entre hooks e estados (ele avisa com erro). Corrija chamando todos os hooks no topo, antes de qualquer `return`, ou movendo a parte logada para outro componente.

## Tema 4

1. Use a estrutura de `<Routes>` da seção 4.1, com `useParams` no detalhe e `path="*"` para o 404.
2. ```tsx
   function Produtos() {
     const [params, setParams] = useSearchParams()
     const categoria = params.get('categoria') ?? 'todas'
     const visiveis = categoria === 'todas' ? produtos : produtos.filter(p => p.categoria === categoria)
     return (
       <>
         <select value={categoria} onChange={e => setParams(e.target.value === 'todas' ? {} : { categoria: e.target.value })}>
           <option value="todas">Todas</option>
           <option value="bebidas">Bebidas</option>
         </select>
         {/* lista de visiveis */}
       </>
     )
   }
   ```
3. ```ts
   const schema = z.object({
     nome: z.string().min(2, 'Nome muito curto'),
     email: z.string().email('E-mail inválido'),
     senha: z.string().min(8, 'Mínimo de 8 caracteres').regex(/\d/, 'Inclua pelo menos um número'),
     confirmacao: z.string(),
   }).refine(d => d.senha === d.confirmacao, { message: 'As senhas não conferem', path: ['confirmacao'] })
   ```
4. `<a href>` faz o navegador **recarregar a página inteira**: baixa tudo de novo e perde todo o estado do React. `<Link>` muda a URL pela History API e o React Router troca só o componente da rota, instantaneamente e mantendo o estado.
5. ```tsx
   import { ErrorBoundary } from 'react-error-boundary'

   <ErrorBoundary fallback={<p>Não foi possível mostrar este produto.</p>}>
     <DetalheProduto />
   </ErrorBoundary>
   ```
   Error Boundaries capturam erros de **renderização**; erros em handlers de evento e em código assíncrono precisam de `try/catch` próprio.

## Projeto da etapa

Checklist:

- Nenhum `useEffect` para valor derivado.
- `key` com ID do filme em todas as listas.
- Termo de busca na URL: recarregar a página mantém a busca.
- Favoritos persistem após fechar o navegador.
- Navegável por teclado; mensagens de erro com `role="alert"`.
