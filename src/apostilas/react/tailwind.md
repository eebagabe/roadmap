# Tailwind CSS — Apostila Prática

Roadmap Frontend React · Semanas 11 e 12

## Comece por aqui

Tailwind é um framework CSS **utility-first**: em vez de escrever classes como `.card-produto` num arquivo separado, você monta o visual direto no HTML com classes pequenas (`p-4`, `rounded-xl`, `shadow`). No começo parece estranho. Depois de uma semana, você não quer voltar.

### Por que isso vale ouro no mercado

- Tailwind virou o padrão em projetos React e Next.js novos. Vercel, Shopify e muitas startups brasileiras usam.
- shadcn/ui, uma das bibliotecas de componentes mais populares do ecossistema React, é feita com Tailwind.
- Produtividade: protótipos e telas saem muito mais rápido, com design consistente.

### Como esta apostila funciona

1. Use o seu projeto Vite com React da etapa anterior.
2. Instale a extensão **Tailwind CSS IntelliSense** no VS Code (autocompleta as classes e mostra o CSS gerado).
3. Refaça a landing page da etapa Fundamentos com Tailwind e compare.

> **Regra dos 20 minutos:** não lembra a classe? Pense no CSS que você quer (`justify-content: space-between`) e procure na documentação. Os nomes seguem o CSS quase sempre (`justify-between`).

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 11 | Tema 1 — Tailwind na prática |
| 12 | Tema 2 — Componentes e design system + projeto |

## Tema 1 — Tailwind na prática

**Objetivo:** estilizar telas responsivas e com dark mode usando só utilitários.

### 1.1 Utility-first

CSS tradicional:

```html
<button class="botao-primario">Comprar</button>
<style>
  .botao-primario { background: #0284c7; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; }
  .botao-primario:hover { background: #0369a1; }
</style>
```

Tailwind:

```html
<button class="rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700">Comprar</button>
```

Vantagens:

- **Sem inventar nomes** de classe.
- **Sem CSS morto**: o Tailwind gera só as classes que você usa.
- **Mudanças locais**: alterar um botão não quebra outra tela.
- **Design consistente**: espaçamentos e cores vêm de uma escala, não de valores aleatórios.

> **Cuidado! Cai na entrevista:** "Isso não é igual a estilo inline?" Não. Estilo inline não tem `hover`, `focus`, media queries, dark mode nem escala de design. E a repetição se resolve com **componentes React**, não com classes CSS.

### 1.2 Instalação com Vite (Tailwind v4)

```bash
npm install tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({ plugins: [react(), tailwindcss()] })
```

```css
/* src/index.css */
@import "tailwindcss";
```

Pronto. Na versão 4 não precisa mais de `tailwind.config.js`: a configuração fica no próprio CSS.

### 1.3 Espaçamento e tipografia

A escala de espaçamento usa múltiplos de **0,25rem** (4px): `1` = 4px, `2` = 8px, `4` = 16px, `8` = 32px.

| Classe | CSS |
|---|---|
| `p-4` / `px-4` / `py-2` / `pt-1` | padding (todos / horizontal / vertical / topo) |
| `m-4` / `mx-auto` / `-mt-2` | margin (`mx-auto` centraliza) |
| `gap-4` / `space-y-2` | espaço entre filhos |
| `w-full` / `max-w-3xl` / `h-12` / `size-10` | largura, largura máxima, altura, os dois |
| `text-sm` / `text-2xl` | tamanho da fonte |
| `font-semibold` / `font-bold` | peso |
| `leading-relaxed` / `tracking-tight` | altura da linha / espaçamento entre letras |
| `truncate` / `line-clamp-2` | corta com reticências |

Valor fora da escala? Use valores arbitrários: `w-[350px]`, `top-[117px]`, `bg-[#1da1f2]`. Mas, se repetir muito, coloque no tema.

### 1.4 Cores

Paleta com tons de 50 a 950: `bg-slate-100`, `text-gray-700`, `border-red-500`. Opacidade com barra: `bg-black/50`, `text-white/80`.

```html
<div class="rounded-xl border border-gray-200 bg-white p-6 text-gray-900 shadow-sm">
  <p class="text-sm text-gray-500">Saldo</p>
  <p class="text-3xl font-bold text-emerald-600">R$ 1.250,00</p>
</div>
```

### 1.5 Flex e Grid no Tailwind

```html
<!-- barra de navegação -->
<header class="flex items-center justify-between gap-4 px-6 py-4">
  <a href="/" class="font-bold">Loja</a>
  <nav class="flex gap-6 text-sm">...</nav>
  <button class="rounded-lg bg-gray-900 px-4 py-2 text-white">Entrar</button>
</header>

<!-- grade de cards -->
<ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <li class="rounded-xl bg-white p-4 shadow">...</li>
</ul>

<!-- centralizar -->
<div class="grid min-h-dvh place-items-center">...</div>
```

### 1.6 Responsivo (sm, md, lg)

Tailwind é **mobile first**. Classe sem prefixo vale para todas as telas; com prefixo, vale **a partir** daquela largura.

| Prefixo | A partir de |
|---|---|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1536px |

```html
<h1 class="text-2xl md:text-4xl lg:text-5xl">Título</h1>
<aside class="hidden lg:block">Só aparece no desktop</aside>
```

> **Cuidado! Cai na entrevista:** `sm:` **não** significa "celular". Significa "640px ou mais". Para estilizar o celular, use a classe **sem** prefixo.

### 1.7 Estados (hover, focus e outros)

```html
<button class="bg-sky-600 hover:bg-sky-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50">
  Salvar
</button>

<input class="border border-gray-300 invalid:border-red-500 focus:border-sky-500" />

<!-- estilizar o filho quando o pai tem hover -->
<a class="group flex items-center gap-2">
  Ver mais <span class="transition group-hover:translate-x-1">→</span>
</a>
```

Outros úteis: `first:`, `last:`, `odd:`, `peer-checked:`, `aria-expanded:`, `data-[estado=aberto]:`.

### 1.8 Dark mode

Por padrão, `dark:` segue a preferência do sistema operacional:

```html
<div class="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">...</div>
```

Para um botão de alternar tema (classe `dark` no `<html>`), configure no CSS:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

```ts
document.documentElement.classList.toggle('dark')
```

### Atividades de fixação — Tema 1

1. Traduza para Tailwind: `display:flex; flex-direction:column; align-items:center; gap:16px; padding:24px; border-radius:12px; background:white; box-shadow: pequena`.
2. Faça um card de produto: imagem no topo, nome (no máximo 2 linhas), preço em destaque, botão. No hover, o card sobe levemente e a sombra aumenta.
3. Faça uma grade de cards: 1 coluna no celular, 2 a partir de 640px, 4 a partir de 1024px.
4. Crie um botão com estados: hover, foco visível pelo teclado, desabilitado e carregando (com um spinner `animate-spin`).
5. Adicione dark mode controlado por um botão, salvando a escolha no localStorage.

## Tema 2 — Componentes e design system

**Objetivo:** organizar o Tailwind em componentes reutilizáveis e com tema próprio.

### 2.1 Tema e design tokens

No Tailwind v4, você define seu tema com variáveis CSS dentro de `@theme`. Cada variável vira classes automaticamente:

```css
@import "tailwindcss";

@theme {
  --color-marca-50: #eff6ff;
  --color-marca-500: #3b82f6;
  --color-marca-700: #1d4ed8;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --radius-card: 1rem;
}
```

Agora existem `bg-marca-500`, `text-marca-700`, `rounded-card`, e a fonte padrão é a Inter. Esses valores são os **design tokens**: a fonte única de verdade do visual.

### 2.2 Componentes reutilizáveis

A repetição de classes se resolve com **componentes**, não com CSS:

```tsx
type BotaoProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: 'primario' | 'secundario' | 'perigo'
  tamanho?: 'sm' | 'md' | 'lg'
}

const VARIANTES = {
  primario: 'bg-marca-500 text-white hover:bg-marca-700',
  secundario: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50',
  perigo: 'bg-red-600 text-white hover:bg-red-700',
}
const TAMANHOS = { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4', lg: 'h-12 px-6 text-lg' }

export function Botao({ variante = 'primario', tamanho = 'md', className, ...props }: BotaoProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50',
        VARIANTES[variante],
        TAMANHOS[tamanho],
        className,
      )}
      {...props}
    />
  )
}
```

> **Na prática:** classes devem aparecer **inteiras** no código (`'bg-red-600'`). O Tailwind lê seus arquivos procurando texto; uma classe montada como `` `bg-${cor}-600` `` não é encontrada e não é gerada. Use mapas como `VARIANTES`.

### 2.3 clsx e tailwind-merge

```bash
npm install clsx tailwind-merge
```

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes))
}
```

- `clsx` junta classes condicionalmente: `clsx('p-4', ativo && 'bg-sky-100')`.
- `twMerge` resolve conflitos: `twMerge('px-4', 'px-6')` vira `'px-6'`. Assim quem usa o componente consegue sobrescrever estilos com `className`.

Para muitas variantes, a biblioteca `cva` (class-variance-authority) organiza ainda melhor.

### 2.4 shadcn/ui

shadcn/ui não é uma dependência que você instala inteira: é uma coleção de componentes (botão, diálogo, select, tabela) que você **copia para o seu projeto** com um comando, e passa a ser dono do código.

```bash
npx shadcn@latest init
npx shadcn@latest add button dialog
```

Os componentes usam Tailwind para o visual e **Radix UI** por baixo, que cuida da parte difícil de acessibilidade (foco, teclado, ARIA).

### 2.5 Acessibilidade em componentes

O que componentes interativos precisam ter:

- **Modal/diálogo:** prende o foco dentro, fecha com Esc, devolve o foco ao botão que abriu, `role="dialog"` e `aria-modal`. (O elemento nativo `<dialog>` com `showModal()` já faz boa parte.)
- **Menu/dropdown:** abre com Enter/Espaço, navega com setas, `aria-expanded`.
- **Toast/aviso:** `role="status"` (ou `alert` para erros) para o leitor de tela anunciar.
- **Ícone sem texto:** `aria-label` no botão; o ícone com `aria-hidden`.
- **Texto só para leitor de tela:** classe `sr-only`.

```tsx
<button aria-label="Fechar" className="rounded p-2 hover:bg-gray-100">
  <IconeX aria-hidden className="size-4" />
</button>
```

> **Cuidado! Cai na entrevista:** montar modal, select e combobox acessíveis do zero é difícil. Saber **usar** bibliotecas como Radix, Headless UI ou React Aria (e saber por que elas existem) é resposta de pleno.

### 2.6 Animações e transições

```html
<div class="transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">...</div>
<div class="animate-spin">⟳</div>
<div class="animate-pulse rounded bg-gray-200 h-4 w-40"></div>   <!-- skeleton loading -->
<div class="motion-safe:animate-bounce">↓</div>                    <!-- respeita "reduzir movimento" -->
```

Anime `transform` e `opacity` (são baratos). Respeite `prefers-reduced-motion` com `motion-safe:` e `motion-reduce:`.

### Atividades de fixação — Tema 2

1. Defina um tema com sua cor de marca (tons 50, 100, 500, 600, 700), uma fonte do Google Fonts e um raio padrão.
2. Crie a função `cn` e um componente `Badge` com variantes `sucesso`, `aviso`, `erro` e `neutro`.
3. Por que este código não funciona? Corrija: `<div className={`text-${cor}-600`}>`.
4. Instale o shadcn/ui e use o `Dialog` para confirmar a exclusão de um item. Teste só com o teclado.
5. Crie um skeleton de carregamento para o card de produto do Tema 1.

## Projeto da etapa

**Refaça a landing page da etapa Fundamentos com React + Tailwind, agora como um mini design system:**

1. Tema com tokens próprios (cores, fonte, raios).
2. Componentes: `Botao`, `Card`, `Badge`, `Secao`, `Container`, todos com `className` sobrescrevível via `cn`.
3. Dark mode com botão e preferência salva.
4. Animações discretas respeitando `prefers-reduced-motion`.
5. Lighthouse 90+ em Acessibilidade e Performance.
6. Compare no README: linhas de CSS antes e depois, e o que achou mais fácil ou mais difícil.

## Resumão

- Utility-first: estilo no próprio markup, a partir de uma escala de design.
- Mobile first: classe sem prefixo é o celular; `md:` é "a partir de 768px".
- Estados com prefixos: `hover:`, `focus-visible:`, `disabled:`, `dark:`, `group-hover:`.
- Tailwind v4: `@import "tailwindcss"` e tema em `@theme` no CSS.
- Repetição se resolve com componentes React. Classes sempre inteiras no código.
- `cn` = `clsx` + `tailwind-merge`. shadcn/ui + Radix para componentes acessíveis.
