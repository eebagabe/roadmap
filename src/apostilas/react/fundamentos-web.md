# Fundamentos da Web: Apostila Prática

Roadmap Frontend React · Semanas 01 a 03

## Comece por aqui

React, Tailwind, Next.js: tudo isso termina virando **HTML, CSS e JavaScript** rodando num navegador. Quem entende essa base resolve bugs de layout em minutos, escreve páginas acessíveis e não fica refém de framework.

### Por que isso vale ouro no mercado

- Entrevistas de front perguntam Flexbox vs Grid, especificidade, semântica e acessibilidade com frequência.
- A Lei Brasileira de Inclusão exige acessibilidade em sites; empresas grandes cobram isso no code review.
- Saber usar o DevTools é o que separa quem "acha" de quem **descobre** onde está o problema.

### Como esta apostila funciona

1. Leia a teoria e digite os exemplos num arquivo `.html` aberto no navegador (ou no codepen.io).
2. Abra o DevTools (F12) o tempo todo. Inspecione, mude valores, veja o efeito.
3. Faça as atividades e só depois veja o gabarito.

> **Regra dos 20 minutos:** layout quebrou? Coloque `outline: 1px solid red` em tudo (`* { outline: 1px solid red }`) e veja as caixas. Só depois de 20 minutos de tentativa abra o gabarito.

### Preparando o ambiente

- Navegador Chrome ou Firefox atualizado.
- VS Code com as extensões: Prettier, ESLint, Live Server.
- Git instalado e uma conta no GitHub.

```bash
git config --global user.name "Seu Nome"
git config --global user.email "voce@email.com"
```

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 01 | Tema 1: Como a web e o navegador funcionam |
| 02 | Tema 2: HTML semântico e acessibilidade |
| 03 | Tema 3: CSS e layouts + projeto |

## Tema 1: Como a web e o navegador funcionam

**Objetivo:** entender o caminho de uma URL até a página aparecer na tela.

### 1.1 HTTP, HTTPS e DNS

Quando você digita `https://loja.com`:

1. **DNS** traduz `loja.com` num endereço IP (como a agenda do celular traduz "Mãe" num número).
2. O navegador abre uma conexão segura (**HTTPS** = HTTP + criptografia TLS).
3. Envia uma **requisição HTTP** `GET /` e recebe uma **resposta** com o HTML.
4. O HTML pede outros arquivos (CSS, JS, imagens), e cada um é outra requisição.

Status mais comuns: `200` (ok), `301/302` (redirecionado), `404` (não encontrado), `500` (erro no servidor).

### 1.2 O que o navegador faz com o HTML

O caminho até os pixels é o **Critical Rendering Path**:

1. **HTML → DOM:** o navegador lê o HTML e monta uma árvore de objetos, o DOM.
2. **CSS → CSSOM:** faz o mesmo com o CSS.
3. **Render tree:** junta os dois, só com o que aparece na tela.
4. **Layout:** calcula tamanho e posição de cada caixa.
5. **Paint:** pinta os pixels.
6. **Composite:** junta as camadas.

> **Analogia:** o DOM é a planta da casa; o CSSOM é o projeto de decoração; o layout é medir onde cada móvel vai; o paint é pintar as paredes.

O JavaScript pode **bloquear** esse processo. Por isso scripts vão com `defer` ou `type="module"` (que já é deferido):

```html
<script src="app.js" defer></script>
```

> **Cuidado! Cai na entrevista:** mudar tamanho ou posição (largura, `top`) força **layout** de novo, que é caro. Animar `transform` e `opacity` evita layout e paint, e é muito mais suave.

### 1.3 DOM

O DOM é a página como objetos que o JavaScript pode ler e alterar:

```js
const titulo = document.querySelector('h1')
titulo.textContent = 'Olá, DOM!'
titulo.classList.add('destaque')
```

O React, no fundo, faz exatamente isso por você, de forma eficiente.

### 1.4 DevTools

| Aba | Para quê |
|---|---|
| Elements | Ver e editar HTML e CSS ao vivo, ver o box model |
| Console | Rodar JS, ver erros |
| Network | Ver todas as requisições, status, tempo e tamanho |
| Performance | Gravar e ver o que deixa a página lenta |
| Lighthouse | Nota de performance, acessibilidade, SEO |
| Application | localStorage, cookies |

### 1.5 Git e GitHub

Git guarda o histórico do seu código. GitHub hospeda na nuvem e é seu **portfólio**.

```bash
git init
git add .
git commit -m "feat: estrutura inicial da landing page"
git branch -M main
git remote add origin git@github.com:voce/landing.git
git push -u origin main
```

Faça commits pequenos e com mensagens claras. Recrutador olha.

### Atividades de fixação do Tema 1

1. Abra a aba Network, recarregue um site grande (ex.: um portal de notícias) e anote: quantas requisições, quanto foi transferido, qual o arquivo mais pesado.
2. Explique, em até 6 passos, o que acontece entre digitar a URL e ver a página.
3. Qual a diferença entre `<script src="x.js">`, `<script src="x.js" defer>` e `<script src="x.js" async>`?
4. Por que animar `left` é pior do que animar `transform: translateX()`?
5. Crie um repositório no GitHub chamado `estudos-front` e faça o primeiro commit com um `index.html`.

## Tema 2: HTML semântico e acessibilidade

**Objetivo:** escrever HTML que faz sentido para pessoas, leitores de tela e buscadores.

### 2.1 Estrutura de um documento

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Minha página</title>
    <meta name="description" content="Resumo que aparece no Google" />
  </head>
  <body>
    <h1>Título principal</h1>
  </body>
</html>
```

A meta `viewport` é o que faz o site não aparecer "miniaturizado" no celular.

### 2.2 Tags semânticas

Semântica = usar a tag que **diz o que o conteúdo é**, não como ele parece.

```html
<header>
  <nav aria-label="Principal">
    <a href="/">Início</a>
    <a href="/produtos">Produtos</a>
  </nav>
</header>
<main>
  <article>
    <h1>Como escolher um notebook</h1>
    <section>
      <h2>Processador</h2>
      <p>...</p>
    </section>
  </article>
  <aside>Posts relacionados</aside>
</main>
<footer>© 2026</footer>
```

| Em vez de | Use |
|---|---|
| `<div onclick>` | `<button>` |
| `<div class="titulo">` | `<h1>`…`<h6>` na ordem certa |
| `<span>` para link | `<a href>` |
| `<div class="lista">` | `<ul>`/`<ol>` + `<li>` |

> **Cuidado! Cai na entrevista:** "Por que `<button>` e não `<div onClick>`?" O botão já vem com foco pelo teclado, ativa com Enter e Espaço e é anunciado como "botão" pelo leitor de tela. A div não faz nada disso sem muito código extra.

### 2.3 Formulários

```html
<form action="/cadastro" method="post">
  <label for="email">E-mail</label>
  <input id="email" name="email" type="email" required autocomplete="email" />

  <label for="senha">Senha</label>
  <input id="senha" name="senha" type="password" minlength="8" required />

  <button type="submit">Criar conta</button>
</form>
```

- Todo campo precisa de `<label>` ligado pelo `for`/`id`. Placeholder **não** substitui label.
- Use o `type` certo (`email`, `tel`, `number`, `date`): o celular mostra o teclado adequado.
- `autocomplete` ajuda o navegador a preencher.

### 2.4 Links e imagens

```html
<a href="https://github.com/voce" target="_blank" rel="noopener noreferrer">Meu GitHub</a>
<img src="produto.webp" alt="Tênis de corrida azul, vista lateral" width="400" height="300" loading="lazy" />
```

- `alt` descreve a imagem para quem não vê. Imagem decorativa: `alt=""`.
- `width` e `height` evitam que a página "pule" enquanto carrega.

### 2.5 Acessibilidade (a11y) e ARIA

Acessibilidade é fazer o site funcionar para todos: pessoas cegas (leitor de tela), com baixa visão (zoom, contraste), que não usam mouse (teclado), com daltonismo.

Checklist básico:

1. HTML semântico (resolve metade).
2. Tudo funciona **só com teclado** (Tab, Shift+Tab, Enter, Espaço, Esc).
3. Foco visível (nunca `outline: none` sem substituto).
4. Contraste mínimo de 4,5:1 para texto normal (WCAG AA).
5. Não transmitir informação **só** por cor (ex.: erro em vermelho **e** com ícone/texto).

**ARIA** adiciona informação quando o HTML não basta. Regra número 1 do ARIA: **se existe uma tag HTML que faz isso, use a tag**.

```html
<button aria-expanded="false" aria-controls="menu">Menu</button>
<ul id="menu" hidden>...</ul>

<span role="status">3 itens no carrinho</span>   <!-- anunciado quando muda -->
```

### 2.6 SEO básico

- Um `<h1>` por página, títulos em ordem.
- `<title>` e `<meta name="description">` únicos por página.
- URLs legíveis (`/produtos/tenis-azul`).
- Site rápido e responsivo (o Google considera).

### Atividades de fixação do Tema 2

1. Reescreva com HTML semântico:
   ```html
   <div class="topo"><div class="menu"><span onclick="ir('/')">Início</span></div></div>
   <div class="conteudo"><div class="titulo">Bem-vindo</div><div>Texto...</div></div>
   ```
2. Crie um formulário de contato (nome, e-mail, assunto em `select`, mensagem) totalmente acessível.
3. Navegue no site do seu banco **só com o teclado**. Anote 3 problemas que encontrar.
4. Escreva o `alt` para: (a) foto de produto; (b) logo da empresa que é um link para a home; (c) ícone decorativo ao lado de um texto que já diz tudo.
5. Rode o Lighthouse (aba Accessibility) no seu formulário e corrija o que aparecer.

## Tema 3: CSS e layouts

**Objetivo:** dominar o box model, Flexbox e Grid e fazer layouts responsivos.

### 3.1 Seletores e especificidade

Quando duas regras brigam, vence a mais **específica**. A conta, do mais forte para o mais fraco:

| Peso | Exemplo |
|---|---|
| `style` inline | `style="color: red"` |
| ID | `#titulo` |
| Classe, atributo, pseudo-classe | `.ativo`, `[type="email"]`, `:hover` |
| Elemento, pseudo-elemento | `h1`, `::before` |

`#menu .item` (1 ID + 1 classe) vence `.menu .item.ativo` (3 classes). Empate: vence a que vem **depois**. `!important` passa por cima de tudo (evite).

### 3.2 Box Model

Toda caixa tem: **content** → **padding** → **border** → **margin**.

```css
*, *::before, *::after { box-sizing: border-box; }
```

Com `border-box`, a `width` inclui padding e borda. Sem isso, `width: 100%` + `padding` estoura o container. Todo projeto moderno (incluindo o Tailwind) já aplica isso.

### 3.3 Display e position

- `display: block` (ocupa a linha), `inline` (fica no texto, ignora width/height), `inline-block`, `flex`, `grid`, `none`.
- `position`: `static` (padrão), `relative` (referência para filhos absolutos), `absolute` (relativo ao ancestral posicionado mais próximo), `fixed` (relativo à tela), `sticky` (gruda ao rolar).

### 3.4 Flexbox

Para layouts em **uma dimensão** (linha ou coluna).

```css
.barra {
  display: flex;
  justify-content: space-between; /* eixo principal */
  align-items: center;            /* eixo cruzado */
  gap: 1rem;
}
.barra .busca { flex: 1; }        /* ocupa o espaço que sobrar */
```

Centralizar qualquer coisa:

```css
.pai { display: flex; justify-content: center; align-items: center; }
```

### 3.5 Grid

Para layouts em **duas dimensões** (linhas e colunas).

```css
.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.pagina {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas: "menu conteudo";
}
```

A linha `repeat(auto-fill, minmax(220px, 1fr))` cria uma galeria responsiva **sem nenhuma media query**.

> **Cuidado! Cai na entrevista:** "Flexbox ou Grid?" Flexbox quando o conteúdo dita o tamanho e é uma dimensão (barra de navegação, botões lado a lado). Grid quando você define a estrutura em duas dimensões (página, galeria, dashboard). Eles se combinam.

### 3.6 Responsividade e unidades

**Mobile first:** escreva o CSS para celular e adicione regras para telas maiores.

```css
.cards { display: grid; gap: 1rem; }
@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}
```

| Unidade | Relativa a | Use para |
|---|---|---|
| `px` | Nada (fixa) | Bordas, detalhes |
| `rem` | Fonte da raiz (16px padrão) | Fontes e espaçamentos (respeita o zoom do usuário) |
| `em` | Fonte do próprio elemento | Espaços que acompanham o texto |
| `%` | O pai | Larguras |
| `vh`/`vw`, `dvh` | Tela | Alturas de seções (prefira `dvh` no celular) |

### 3.7 Variáveis CSS

```css
:root {
  --cor-primaria: #0ea5e9;
  --raio: 0.75rem;
}
.botao { background: var(--cor-primaria); border-radius: var(--raio); }

@media (prefers-color-scheme: dark) {
  :root { --cor-primaria: #38bdf8; }
}
```

Variáveis CSS são a base de temas e dark mode, inclusive no Tailwind v4.

### Atividades de fixação do Tema 3

1. Qual cor o parágrafo terá? Explique.
   ```html
   <p id="txt" class="aviso destaque">Oi</p>
   ```
   ```css
   #txt { color: blue; }
   .aviso.destaque { color: red; }
   p { color: green !important; }
   ```
2. Uma div com `width: 300px; padding: 20px; border: 5px solid` tem qual largura total com `content-box`? E com `border-box`?
3. Monte com Flexbox uma barra de navegação: logo à esquerda, links no meio, botão "Entrar" à direita.
4. Monte com Grid um layout de dashboard: cabeçalho em cima, menu lateral à esquerda, conteúdo à direita, que vira uma coluna só no celular.
5. Faça um botão com variáveis CSS e um tema escuro usando `prefers-color-scheme`.

## Projeto da etapa

**Landing page de um produto fictício (só HTML e CSS):**

1. Cabeçalho com navegação, seção principal com chamada e botão, grade de 3 benefícios, depoimentos, perguntas frequentes (use `<details>`/`<summary>`) e rodapé.
2. Mobile first e responsiva até desktop.
3. Nota mínima 90 no Lighthouse em Acessibilidade e Performance.
4. Navegável só pelo teclado, com foco visível.
5. Publicada no GitHub Pages.

Na etapa de Tailwind você vai refazer essa mesma página e comparar.

## Resumão

- URL → DNS → HTTPS → HTML → DOM + CSSOM → layout → paint.
- HTML semântico resolve metade da acessibilidade. `<button>` para ações, `<a>` para navegação.
- Todo input tem label. Toda imagem tem alt (vazio se decorativa).
- Especificidade: inline > ID > classe > elemento.
- `box-sizing: border-box` sempre.
- Flexbox para uma dimensão, Grid para duas. Mobile first.
