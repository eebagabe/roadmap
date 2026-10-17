# Gabarito — Fundamentos da Web

Abra só depois de tentar.

## Tema 1

1. Resposta pessoal. É comum ver mais de 100 requisições e vários MB transferidos; o arquivo mais pesado costuma ser uma imagem, um vídeo ou um bundle de JavaScript.
2. (1) DNS resolve o domínio em IP; (2) conexão TCP + TLS (HTTPS); (3) requisição HTTP `GET`; (4) servidor responde com HTML; (5) navegador monta DOM e CSSOM, baixando CSS/JS/imagens; (6) layout, paint e composição: a página aparece.
3. Sem atributo: o navegador **para** de ler o HTML, baixa e executa o script na hora. `defer`: baixa em paralelo e executa **depois** que o HTML terminou de ser lido, na ordem em que aparecem. `async`: baixa em paralelo e executa **assim que** baixar, sem ordem garantida (bom para scripts independentes, como analytics).
4. Mudar `left` altera a geometria e obriga o navegador a refazer layout e paint a cada quadro. `transform` é aplicado na etapa de composição, muitas vezes pela GPU, sem recalcular layout. Resultado: animação a 60 fps sem travar.
5. Prática. Confira se o repositório tem o `index.html` e um commit com mensagem clara.

## Tema 2

1. ```html
   <header>
     <nav aria-label="Principal"><a href="/">Início</a></nav>
   </header>
   <main>
     <h1>Bem-vindo</h1>
     <p>Texto...</p>
   </main>
   ```
   Navegação é link (`<a href>`), não `<span>` com clique.
2. ```html
   <form action="/contato" method="post">
     <label for="nome">Nome</label>
     <input id="nome" name="nome" required autocomplete="name" />

     <label for="email">E-mail</label>
     <input id="email" name="email" type="email" required autocomplete="email" />

     <label for="assunto">Assunto</label>
     <select id="assunto" name="assunto" required>
       <option value="">Selecione</option>
       <option value="duvida">Dúvida</option>
       <option value="suporte">Suporte</option>
     </select>

     <label for="mensagem">Mensagem</label>
     <textarea id="mensagem" name="mensagem" rows="5" required></textarea>

     <button type="submit">Enviar</button>
   </form>
   ```
3. Resposta pessoal. Problemas comuns: foco invisível, menus que só abrem com mouse, modais que não prendem o foco nem fecham com Esc, ordem de tabulação estranha, botões feitos com div.
4. (a) Descreva o que importa para a compra: `alt="Tênis de corrida azul com sola branca, vista lateral"`. (b) Descreva a **função** do link: `alt="Página inicial da Loja X"`. (c) `alt=""`, para o leitor de tela ignorar.
5. Prática. Problemas que o Lighthouse costuma apontar: contraste baixo, campo sem label, falta de `lang` no `<html>`, botão sem nome acessível.

## Tema 3

1. **Verde.** `!important` vence qualquer especificidade (exceto outro `!important` mais específico). Sem ele, venceria o `#txt` (azul), porque ID pesa mais que duas classes.
2. `content-box`: 300 + 20 × 2 + 5 × 2 = **350px**. `border-box`: **300px** (o conteúdo encolhe para 250px).
3. ```html
   <header class="barra">
     <a href="/" class="logo">Logo</a>
     <nav class="links"><a href="#">Produtos</a><a href="#">Preços</a><a href="#">Sobre</a></nav>
     <a href="/entrar" class="entrar">Entrar</a>
   </header>
   ```
   ```css
   .barra { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem; }
   .links { display: flex; gap: 1.5rem; }
   ```
4. ```css
   .dash {
     display: grid;
     grid-template-areas: "cabecalho" "menu" "conteudo";
     min-height: 100dvh;
   }
   .dash > header { grid-area: cabecalho; }
   .dash > nav    { grid-area: menu; }
   .dash > main   { grid-area: conteudo; }

   @media (min-width: 768px) {
     .dash {
       grid-template-columns: 240px 1fr;
       grid-template-rows: auto 1fr;
       grid-template-areas: "cabecalho cabecalho" "menu conteudo";
     }
   }
   ```
5. ```css
   :root { --fundo: #ffffff; --texto: #111827; --primaria: #0284c7; }
   @media (prefers-color-scheme: dark) {
     :root { --fundo: #0b1120; --texto: #e5e7eb; --primaria: #38bdf8; }
   }
   body { background: var(--fundo); color: var(--texto); }
   .botao { background: var(--primaria); color: var(--fundo); padding: .75rem 1.25rem; border: 0; border-radius: .5rem; }
   .botao:focus-visible { outline: 3px solid var(--texto); outline-offset: 2px; }
   ```

## Projeto da etapa

Checklist:

- `lang="pt-BR"`, `viewport`, `title` e `description`.
- Um único `h1`; seções com `h2`.
- FAQ com `<details>`/`<summary>` (acessível sem JS).
- Imagens com `width`, `height`, `alt` e `loading="lazy"` (exceto a principal, acima da dobra).
- Nenhuma regra `outline: none` sem substituto.
