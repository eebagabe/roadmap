# Automação Web — Apostila Prática

Roadmap QA · Semanas 06 a 09

## Comece por aqui

Automatizar é escrever código que testa o sistema por você. O objetivo não é automatizar **tudo**: é automatizar o que é **repetitivo e crítico** (regressão, fluxos principais), para sobrar tempo para o teste que exige cabeça (exploratório, novas funcionalidades).

### Por que isso vale ouro no mercado

- QA com automação ganha mais e tem mais vagas que QA só manual.
- **Playwright** cresceu muito e já é a escolha de muitos times novos; **Cypress** é muito comum em front-end JavaScript; **Selenium** ainda está em muitos projetos Java de bancos e grandes empresas.
- O que importa de verdade (e é perguntado em entrevista): seletores estáveis, esperas corretas, Page Object, testes independentes e combate a testes instáveis (flaky).

### Como esta apostila funciona

1. Vamos automatizar o **saucedemo.com** (feito para estudo).
2. A linguagem principal é **TypeScript** com Playwright. No Tema 4 você vê o mesmo teste em Cypress e em Selenium com Java.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** teste falhando? Antes de mexer no código, **veja o que aconteceu**: abra o trace/vídeo/screenshot da falha. Quase sempre a resposta está ali.

### Preparando o ambiente

- Node.js 20+ (`node -v`), VS Code com a extensão **Playwright Test for VSCode**.
- Git e uma conta no GitHub.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 06 | Tema 1 — Programação para QA |
| 07 | Tema 2 — DOM e seletores |
| 08 | Tema 3 — Playwright |
| 09 | Tema 4 — Cypress, Selenium e padrões + projeto |

## Tema 1 — Programação para QA

**Objetivo:** o mínimo de programação para escrever automação limpa.

### 1.1 Lógica e JavaScript/TypeScript essencial

```ts
// variáveis
const usuario = 'standard_user'      // não muda
let tentativas = 0                    // muda

// tipos e objetos
type Produto = { nome: string; preco: number }
const mochila: Produto = { nome: 'Sauce Labs Backpack', preco: 29.99 }

// arrays e funções
const precos = [29.99, 9.99, 15.99]
const total = precos.reduce((soma, p) => soma + p, 0)
const caros = precos.filter(p => p > 10)

// condição e repetição
if (total > 50) console.log('Frete grátis')
for (const p of precos) console.log(p.toFixed(2))

// função
function formatar(valor: number): string {
  return `$${valor.toFixed(2)}`
}
```

TypeScript ajuda muito em automação: o editor autocompleta os métodos do Playwright e avisa erros antes de rodar.

### 1.2 Node e npm

```bash
mkdir automacao-saucedemo && cd automacao-saucedemo
npm init playwright@latest        # cria o projeto, instala navegadores
npx playwright test               # roda os testes
npx playwright show-report        # abre o relatório HTML
```

`package.json` guarda as dependências e os scripts. `node_modules` nunca vai para o Git.

### 1.3 Async/await

Quase tudo em automação web é **assíncrono**: o navegador demora para responder. Toda ação do Playwright retorna uma promessa e precisa de `await`.

```ts
await page.goto('https://www.saucedemo.com/')
await page.getByPlaceholder('Username').fill('standard_user')
```

> **Cuidado! Cai na entrevista:** esquecer o `await` é o bug mais comum em automação JavaScript: o teste segue sem esperar a ação terminar e falha de forma aleatória. O ESLint com a regra `@typescript-eslint/no-floating-promises` pega isso.

### 1.4 Git e terminal

```bash
git checkout -b feat/testes-login
git add .
git commit -m "test: cenários de login do saucedemo"
git push -u origin feat/testes-login
```

Comandos de terminal úteis: `cd`, `ls`, `pwd`, `mkdir`, `cat`, `clear`, e as setas para repetir comandos.

### Atividades de fixação — Tema 1

1. Escreva uma função `somarPrecos(precos: number[]): number` e outra `maisCaro(produtos: Produto[]): Produto`.
2. Converta o texto `"$29.99"` (como aparece na tela) para o número `29.99`.
3. O que acontece neste trecho e como corrigir? `page.click('#login'); expect(page.url()).toContain('inventory')`
4. Crie o projeto Playwright, rode o teste de exemplo e abra o relatório.
5. Crie um repositório no GitHub para o projeto e faça o primeiro push.

## Tema 2 — DOM e seletores

**Objetivo:** encontrar elementos de forma **estável**: seletores ruins são a causa número 1 de testes quebrando.

### 2.1 HTML e DOM

```html
<form id="login">
  <input type="text" placeholder="Username" data-test="username" />
  <input type="password" placeholder="Password" data-test="password" />
  <input type="submit" value="Login" data-test="login-button" class="submit-button btn_action" />
</form>
```

No DevTools (F12), clique com o botão direito no elemento > **Inspecionar**. No console, teste seletores com `$$('seletor')`.

### 2.2 Seletores CSS

| Seletor | Encontra |
|---|---|
| `#login` | id="login" |
| `.btn_action` | class contém btn_action |
| `input[type="password"]` | atributo |
| `[data-test="username"]` | atributo de teste |
| `form input` | input dentro de form (qualquer nível) |
| `ul > li` | li filho direto |
| `li:nth-child(2)` | segundo filho |
| `[class^="inventory"]` | classe começando com "inventory" |

### 2.3 XPath

Mais poderoso (pode subir na árvore e buscar por texto), mas mais difícil de ler.

```
//button[text()='Add to cart']
//div[@class='inventory_item'][.//div[text()='Sauce Labs Backpack']]//button
//input[@data-test='username']
```

Use quando não houver alternativa melhor.

### 2.4 Locators por papel e texto

A forma **mais estável e recomendada** hoje: encontrar o elemento como o **usuário** encontra.

```ts
page.getByRole('button', { name: 'Login' })
page.getByRole('link', { name: 'Twitter' })
page.getByLabel('E-mail')
page.getByPlaceholder('Username')
page.getByText('Sauce Labs Backpack')
page.getByTestId('username')          // data-testid (configurável)
```

Ordem de preferência:

1. `getByRole` com nome (também valida acessibilidade).
2. `getByLabel`, `getByPlaceholder`, `getByText`.
3. `getByTestId` (atributo combinado com os devs, não muda com o layout).
4. CSS simples.
5. XPath (último recurso).

> **Cuidado! Cai na entrevista:** evite seletores frágeis como `div > div:nth-child(3) > span` ou classes geradas (`.css-1x2y3z`). Qualquer mudança de layout quebra o teste. A melhor resposta: "combino com os devs um `data-testid` nos elementos importantes, e uso seletores por papel/texto quando possível".

### 2.5 data-testid

Atributo **só para testes**, que não muda quando o design muda. O saucedemo usa `data-test`. Configure o Playwright para usá-lo:

```ts
// playwright.config.ts
export default defineConfig({
  use: { testIdAttribute: 'data-test' },
})
```

### 2.6 Esperas

O elemento pode ainda não estar na tela quando o teste tenta usá-lo.

- **Espera fixa** (`sleep(3000)`): **evite**. Lenta quando o sistema é rápido, insuficiente quando é lento.
- **Espera explícita:** esperar uma condição (elemento visível, texto aparecer). Padrão no Selenium.
- **Auto-wait:** Playwright e Cypress esperam automaticamente o elemento estar visível, habilitado e estável antes de agir, e as assertions tentam de novo até um tempo limite.

```ts
await expect(page.getByText('Pedido confirmado')).toBeVisible()  // tenta até 5s (padrão)
```

### Atividades de fixação — Tema 2

1. No saucedemo (página de produtos), escreva um seletor CSS e um XPath para o botão "Add to cart" da **Sauce Labs Bike Light**.
2. Reescreva usando locators recomendados: `page.locator('#root > div > div > form > input.btn_action')`.
3. Ordene do mais ao menos estável: (a) `getByRole('button', { name: 'Checkout' })`; (b) `.btn.btn-primary.mt-3`; (c) `getByTestId('checkout')`; (d) `//div[3]/div/button[2]`.
4. Por que `waitForTimeout(5000)` é uma má prática? O que usar no lugar?
5. Abra o DevTools no saucedemo e liste 5 atributos `data-test` que você usaria nos testes.

## Tema 3 — Playwright

**Objetivo:** escrever, rodar e depurar testes E2E com Playwright.

### 3.1 Estrutura do projeto

```
automacao-saucedemo/
  playwright.config.ts
  tests/
    login.spec.ts
    carrinho.spec.ts
  pages/                 (Page Objects, Tema 4)
  package.json
```

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
})
```

### 3.2 Locators e actions

```ts
import { test, expect } from '@playwright/test'

test('login com usuário padrão', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('username').fill('standard_user')
  await page.getByTestId('password').fill('secret_sauce')
  await page.getByTestId('login-button').click()

  await expect(page).toHaveURL(/inventory/)
  await expect(page.getByTestId('title')).toHaveText('Products')
})
```

Outras ações: `check()`, `selectOption()`, `press('Enter')`, `hover()`, `setInputFiles()`, `dragTo()`.

Filtrar dentro de uma lista:

```ts
const item = page.getByTestId('inventory-item').filter({ hasText: 'Sauce Labs Backpack' })
await item.getByRole('button', { name: 'Add to cart' }).click()
```

### 3.3 Assertions

```ts
await expect(locator).toBeVisible()
await expect(locator).toHaveText('Products')
await expect(locator).toContainText('Backpack')
await expect(locator).toHaveCount(6)
await expect(locator).toHaveValue('standard_user')
await expect(locator).toBeDisabled()
await expect(page).toHaveTitle(/Swag Labs/)
await expect(page).toHaveURL(/cart/)
```

São **web-first**: tentam de novo até passar ou dar timeout. Não use `expect(await locator.isVisible()).toBe(true)`, que verifica só uma vez.

### 3.4 Fixtures e hooks

```ts
test.describe('carrinho', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('username').fill('standard_user')
    await page.getByTestId('password').fill('secret_sauce')
    await page.getByTestId('login-button').click()
  })

  test('adiciona um produto', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click()
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1')
  })
})
```

**Fixtures** são o jeito do Playwright de preparar e entregar coisas aos testes (`page`, `request`, `context`). Você pode criar as suas (ex.: uma página já logada).

**Login uma vez só:** para não logar pela interface em todo teste, salve o estado de autenticação (`storageState`) num passo de setup e reaproveite.

### 3.5 Trace Viewer e debug

```bash
npx playwright test --ui              # modo interativo: ver, rodar, depurar
npx playwright test --debug           # pausa passo a passo
npx playwright show-trace trace.zip   # linha do tempo com screenshots, DOM, rede e console
```

O **trace** é o melhor amigo de quem investiga falha no CI: mostra cada ação, o DOM antes e depois, as requisições e os erros.

### 3.6 Codegen

```bash
npx playwright codegen https://www.saucedemo.com
```

Você usa o site e ele gera o código. Ótimo para descobrir locators; **não** para gerar a suíte final (o código gerado precisa de organização, assertions e dados).

### 3.7 Múltiplos navegadores

Com os `projects` do config, o mesmo teste roda em Chromium, Firefox, WebKit (motor do Safari) e emulação mobile. `npx playwright test --project=firefox` roda só um.

### Atividades de fixação — Tema 3

1. Automatize: login com `locked_out_user` deve mostrar a mensagem de usuário bloqueado.
2. Automatize: adicionar 2 produtos, abrir o carrinho e verificar que os 2 estão lá.
3. Automatize: ordenar por "Price (low to high)" e verificar que os preços estão em ordem crescente.
4. Force uma falha (mude o texto esperado), rode com trace e use o Trace Viewer para entender o que aconteceu.
5. Rode a suíte nos três navegadores e no projeto mobile. Algum teste se comportou diferente?

## Tema 4 — Cypress, Selenium e padrões

**Objetivo:** conhecer as outras ferramentas e os padrões que valem para todas.

### 4.1 Cypress

Roda **dentro** do navegador, com uma interface visual excelente para desenvolver testes. Muito usado por times de front-end JavaScript.

```js
// cypress/e2e/login.cy.js
describe('login', () => {
  it('entra com usuário padrão', () => {
    cy.visit('https://www.saucedemo.com')
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
    cy.url().should('include', '/inventory')
    cy.get('[data-test="title"]').should('have.text', 'Products')
  })
})
```

Diferenças práticas: Cypress encadeia comandos (sem `await`); Playwright tem suporte nativo a várias abas, múltiplos domínios e mais navegadores; os dois têm auto-wait.

### 4.2 Selenium WebDriver

O veterano, com suporte a várias linguagens (Java, Python, C#, JavaScript). Muito presente em empresas grandes com stack Java.

```java
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;
import static org.junit.jupiter.api.Assertions.*;

class LoginTest {
    WebDriver driver;
    WebDriverWait wait;

    @BeforeEach
    void abrir() {
        driver = new ChromeDriver();          // Selenium Manager baixa o driver sozinho
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.get("https://www.saucedemo.com");
    }

    @Test
    void loginValido() {
        driver.findElement(By.cssSelector("[data-test='username']")).sendKeys("standard_user");
        driver.findElement(By.cssSelector("[data-test='password']")).sendKeys("secret_sauce");
        driver.findElement(By.cssSelector("[data-test='login-button']")).click();

        WebElement titulo = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-test='title']")));
        assertEquals("Products", titulo.getText());
    }

    @AfterEach
    void fechar() { driver.quit(); }
}
```

No Selenium, as **esperas explícitas** (`WebDriverWait`) são sua responsabilidade.

### 4.3 Page Object Model

Separe **o que o teste faz** (regra) de **como encontrar os elementos** (detalhe da página). Se a tela mudar, você corrige num lugar só.

```ts
// pages/LoginPage.ts
import { type Page, type Locator, expect } from '@playwright/test'

export class LoginPage {
  readonly usuario: Locator
  readonly senha: Locator
  readonly botaoEntrar: Locator
  readonly erro: Locator

  constructor(private readonly page: Page) {
    this.usuario = page.getByTestId('username')
    this.senha = page.getByTestId('password')
    this.botaoEntrar = page.getByTestId('login-button')
    this.erro = page.getByTestId('error')
  }

  async abrir() {
    await this.page.goto('/')
  }

  async entrar(usuario: string, senha: string) {
    await this.usuario.fill(usuario)
    await this.senha.fill(senha)
    await this.botaoEntrar.click()
  }
}
```

```ts
// tests/login.spec.ts
test('usuário bloqueado vê mensagem de erro', async ({ page }) => {
  const login = new LoginPage(page)
  await login.abrir()
  await login.entrar('locked_out_user', 'secret_sauce')
  await expect(login.erro).toContainText('locked out')
})
```

Boas práticas: Page Objects **não fazem assertions de regra de negócio** (o teste faz); métodos com nomes de ação do usuário (`entrar`, `adicionarAoCarrinho`); não exponha detalhes desnecessários.

### 4.4 Dados de teste

- **Testes independentes:** cada teste prepara seus próprios dados e não depende da ordem de execução.
- Crie dados **pela API** (rápido), não pela interface.
- Gere dados únicos (`faker`, timestamp) para não colidir em execução paralela.
- Limpe o que criou (ou use dados descartáveis).
- Senhas e tokens em **variáveis de ambiente**, nunca no código.

### 4.5 Testes flaky (instáveis)

Teste **flaky** passa e falha sem nenhuma mudança no código. Destrói a confiança na suíte: o time começa a ignorar falhas.

| Causa | Correção |
|---|---|
| Espera fixa ou falta de espera | Assertions web-first / esperas explícitas |
| Dependência entre testes ou ordem | Testes independentes, dados próprios |
| Dados compartilhados em paralelo | Dados únicos por teste |
| Seletores frágeis | Role, label, test id |
| Animações e conteúdo dinâmico | Esperar o estado final; desligar animações no ambiente de teste |
| Ambiente instável / serviço externo | Mockar a dependência (`page.route`) ou isolar o ambiente |

> **Cuidado! Cai na entrevista:** "Como você lida com testes flaky?" Resposta boa: identifico (relatório de retries), **coloco em quarentena** para não bloquear o time, investigo a causa raiz com trace/vídeo e corrijo. `retries` no CI ajuda a não travar o pipeline, mas **não** é solução: só esconde o problema.

### 4.6 Cucumber

Liga cenários Gherkin a código. Útil quando o negócio realmente lê e escreve os cenários (BDD de verdade). Se só o QA lê, ele adiciona uma camada de manutenção sem benefício.

```gherkin
Cenário: Login com usuário bloqueado
  Dado que estou na página de login
  Quando entro com o usuário "locked_out_user"
  Então devo ver a mensagem "Sorry, this user has been locked out."
```

```ts
When('entro com o usuário {string}', async function (usuario: string) {
  await this.loginPage.entrar(usuario, process.env.SENHA_PADRAO!)
})
```

### Atividades de fixação — Tema 4

1. Crie os Page Objects `LoginPage`, `ProdutosPage` e `CarrinhoPage` e refatore os testes do Tema 3 para usá-los.
2. Escreva o mesmo teste de login em Cypress. O que achou mais fácil e mais difícil em relação ao Playwright?
3. Escreva um teste em Selenium (Java) que adiciona um produto ao carrinho e verifica o badge, usando `WebDriverWait`.
4. Liste 3 motivos pelos quais este teste é flaky: `await page.waitForTimeout(2000); await page.locator('.btn:nth-child(3)').click(); expect(await page.locator('.badge').textContent()).toBe('1')`
5. Quando você **não** recomendaria Cucumber num projeto?

## Projeto da etapa

**Automação E2E do Sauce Demo com Playwright:**

1. TypeScript, Page Objects, `data-test` como test id.
2. Cenários: login (válido, bloqueado, inválido), ordenação, adicionar/remover do carrinho, checkout completo, validação de campos do checkout.
3. Login reaproveitado com `storageState`.
4. Execução em Chromium, Firefox e mobile.
5. Relatório HTML com trace nas falhas.
6. Senha em variável de ambiente; README explicando como rodar.

## Resumão

- Automatize o repetitivo e crítico; o resto é teste exploratório.
- Sempre `await` nas ações do Playwright.
- Seletores: role/label/texto > test id > CSS simples > XPath. Nunca seletores de layout.
- Nada de espera fixa: assertions web-first e esperas explícitas.
- Page Object separa regra de detalhe da tela.
- Testes independentes com dados próprios. Flaky: quarentena, causa raiz, correção.
- Playwright, Cypress e Selenium: conceitos iguais, sintaxes diferentes.
