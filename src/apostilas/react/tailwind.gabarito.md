# Gabarito — Tailwind CSS

Abra só depois de tentar.

## Tema 1

1. `flex flex-col items-center gap-4 p-6 rounded-xl bg-white shadow-sm`
2. ```tsx
   <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
     <img src={img} alt={nome} className="aspect-square w-full object-cover" />
     <div className="flex flex-1 flex-col gap-2 p-4">
       <h3 className="line-clamp-2 font-medium">{nome}</h3>
       <p className="text-xl font-bold text-emerald-600">{preco}</p>
       <button className="mt-auto rounded-lg bg-gray-900 py-2 font-semibold text-white hover:bg-gray-700">Adicionar</button>
     </div>
   </article>
   ```
   `mt-auto` empurra o botão para baixo, alinhando os botões de cards com textos de tamanhos diferentes.
3. `<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">`
4. ```tsx
   <button
     disabled={carregando}
     className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
   >
     {carregando && <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
     {carregando ? 'Salvando...' : 'Salvar'}
   </button>
   ```
5. ```css
   @import "tailwindcss";
   @custom-variant dark (&:where(.dark, .dark *));
   ```
   ```tsx
   function BotaoTema() {
     const [escuro, setEscuro] = useState(() => {
       try { return localStorage.getItem('tema') === 'escuro' } catch { return false }
     })
     useEffect(() => {
       document.documentElement.classList.toggle('dark', escuro)
       try { localStorage.setItem('tema', escuro ? 'escuro' : 'claro') } catch { /* sem storage */ }
     }, [escuro])
     return (
       <button onClick={() => setEscuro(e => !e)} aria-pressed={escuro}>
         {escuro ? 'Tema claro' : 'Tema escuro'}
       </button>
     )
   }
   ```
   Bônus: aplique a classe num `<script>` pequeno no `index.html`, antes do React carregar, para evitar o "piscar" do tema claro.

## Tema 2

1. ```css
   @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");
   @import "tailwindcss";

   @theme {
     --color-marca-50: #f0fdfa;
     --color-marca-100: #ccfbf1;
     --color-marca-500: #14b8a6;
     --color-marca-600: #0d9488;
     --color-marca-700: #0f766e;
     --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
     --radius-padrao: 0.75rem;
   }
   ```
   (O `@import url(...)` de fontes precisa vir antes dos outros imports; em projeto real, prefira o `<link>` no `index.html`.)
2. ```tsx
   const ESTILOS = {
     sucesso: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
     aviso: 'bg-amber-50 text-amber-800 ring-amber-600/20',
     erro: 'bg-red-50 text-red-700 ring-red-600/20',
     neutro: 'bg-gray-50 text-gray-700 ring-gray-500/20',
   } as const

   export function Badge({ variante = 'neutro', className, ...props }:
     React.HTMLAttributes<HTMLSpanElement> & { variante?: keyof typeof ESTILOS }) {
     return <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset', ESTILOS[variante], className)} {...props} />
   }
   ```
3. O Tailwind encontra classes procurando o **texto completo** nos arquivos. `text-${cor}-600` não aparece inteiro em lugar nenhum, então a classe não é gerada. Correção com mapa:
   ```tsx
   const COR_TEXTO = { verde: 'text-green-600', vermelho: 'text-red-600', azul: 'text-blue-600' } as const
   <div className={COR_TEXTO[cor]} />
   ```
4. Prática. Teste: Tab até o botão, Enter abre, o foco vai para dentro do diálogo, Tab não sai dele, Esc fecha e o foco volta ao botão que abriu.
5. ```tsx
   function CardSkeleton() {
     return (
       <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white" aria-hidden>
         <div className="aspect-square bg-gray-200" />
         <div className="space-y-3 p-4">
           <div className="h-4 w-3/4 rounded bg-gray-200" />
           <div className="h-6 w-1/3 rounded bg-gray-200" />
           <div className="h-10 rounded-lg bg-gray-200" />
         </div>
       </div>
     )
   }
   ```
   Para leitores de tela, anuncie o carregamento em outro lugar (ex.: `<p role="status" className="sr-only">Carregando produtos</p>`).

## Projeto da etapa

Checklist:

- Nenhum valor mágico repetido (`bg-[#...]` em vários lugares): tudo no `@theme`.
- Componentes aceitam `className` e o `cn` resolve conflitos.
- Tema escuro sem "piscar" ao carregar.
- Animações com `motion-safe:`.
- README com a comparação de antes e depois.
