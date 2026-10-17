# Gabarito: Automação Web

Abra só depois de tentar.

## Tema 1

1. ```ts
   function somarPrecos(precos: number[]): number {
     return precos.reduce((s, p) => s + p, 0)
   }
   function maisCaro(produtos: Produto[]): Produto {
     return produtos.reduce((a, b) => (b.preco > a.preco ? b : a))
   }
   ```
2. `Number('$29.99'.replace('$', ''))` ou `parseFloat('$29.99'.slice(1))`.
3. Faltam os `await`. O `click` começa mas o teste não espera; a verificação da URL roda imediatamente, ainda na página de login, e falha (ou passa por sorte). Correto:
   ```ts
   await page.click('#login')
   await expect(page).toHaveURL(/inventory/)
   ```
   Também use a assertion web-first `toHaveURL`, que espera a navegação.
4. Prática. `npm init playwright@latest`, `npx playwright test`, `npx playwright show-report`.
5. Prática. Confira se o `.gitignore` inclui `node_modules/`, `test-results/` e `playwright-report/`.

## Tema 2

1. CSS: `[data-test="add-to-cart-sauce-labs-bike-light"]`. XPath: `//div[@data-test='inventory-item'][.//div[text()='Sauce Labs Bike Light']]//button`. Recomendado no Playwright: `page.getByTestId('inventory-item').filter({ hasText: 'Sauce Labs Bike Light' }).getByRole('button', { name: 'Add to cart' })`.
2. `page.getByRole('button', { name: 'Login' })` ou `page.getByTestId('login-button')`.
3. (a), (c), (b), (d). Role com nome e test id são os mais estáveis (há quem prefira o test id em primeiro, porque não muda nem com tradução do texto); classes de estilo mudam com o design; XPath posicional quebra com qualquer mudança de estrutura.
4. Se o sistema responder em 300 ms, você desperdiça 4,7 s em cada uso (a suíte fica lenta); se responder em 6 s num dia lento, o teste falha (flaky). Use espera por condição: `await expect(page.getByText('Pedido confirmado')).toBeVisible()` ou `await page.waitForURL(/checkout-complete/)`.
5. Exemplos: `username`, `password`, `login-button`, `inventory-item`, `shopping-cart-link`, `shopping-cart-badge`, `checkout`, `firstName`, `continue`, `finish`, `complete-header`.

## Tema 3

1. ```ts
   test('usuário bloqueado não entra', async ({ page }) => {
     await page.goto('/')
     await page.getByTestId('username').fill('locked_out_user')
     await page.getByTestId('password').fill('secret_sauce')
     await page.getByTestId('login-button').click()
     await expect(page.getByTestId('error')).toContainText('Sorry, this user has been locked out')
     await expect(page).not.toHaveURL(/inventory/)
   })
   ```
2. ```ts
   test('carrinho com 2 produtos', async ({ page }) => {
     // login no beforeEach
     await page.getByTestId('add-to-cart-sauce-labs-backpack').click()
     await page.getByTestId('add-to-cart-sauce-labs-bike-light').click()
     await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2')
     await page.getByTestId('shopping-cart-link').click()
     const itens = page.getByTestId('inventory-item-name')
     await expect(itens).toHaveCount(2)
     await expect(itens).toContainText(['Sauce Labs Backpack', 'Sauce Labs Bike Light'])
   })
   ```
3. ```ts
   test('ordena por preço crescente', async ({ page }) => {
     await page.getByTestId('product-sort-container').selectOption('lohi')
     const textos = await page.getByTestId('inventory-item-price').allTextContents()
     const precos = textos.map(t => Number(t.replace('$', '')))
     expect(precos).toEqual([...precos].sort((a, b) => a - b))
   })
   ```
   Aqui `allTextContents` é usado depois que o `selectOption` terminou; como a ordenação é local e imediata, funciona. Se a lista viesse de uma API, espere um sinal de que ela atualizou antes de ler.
4. Prática. No Trace Viewer, a aba da ação que falhou mostra o valor esperado vs recebido e o snapshot do DOM no momento.
5. Resposta pessoal. Diferenças comuns: no mobile, o layout muda (menu hambúrguer); no WebKit, algumas animações e fontes se comportam diferente. Testes com seletores por role/test id costumam passar em todos.

## Tema 4

1. Exemplo de `ProdutosPage`:
   ```ts
   export class ProdutosPage {
     constructor(private readonly page: Page) {}
     item(nome: string) { return this.page.getByTestId('inventory-item').filter({ hasText: nome }) }
     async adicionar(nome: string) { await this.item(nome).getByRole('button', { name: 'Add to cart' }).click() }
     async ordenar(opcao: 'az' | 'za' | 'lohi' | 'hilo') { await this.page.getByTestId('product-sort-container').selectOption(opcao) }
     badgeCarrinho() { return this.page.getByTestId('shopping-cart-badge') }
     async abrirCarrinho() { await this.page.getByTestId('shopping-cart-link').click() }
   }
   ```
2. Resposta pessoal. Costuma-se achar o Cypress mais simples para começar (sem `await`, ótima interface de execução) e o Playwright mais flexível (várias abas, domínios, navegadores, paralelismo nativo e trace).
3. ```java
   @Test
   void adicionaAoCarrinho() {
       driver.findElement(By.cssSelector("[data-test='username']")).sendKeys("standard_user");
       driver.findElement(By.cssSelector("[data-test='password']")).sendKeys("secret_sauce");
       driver.findElement(By.cssSelector("[data-test='login-button']")).click();
       wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("[data-test='add-to-cart-sauce-labs-backpack']"))).click();
       WebElement badge = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-test='shopping-cart-badge']")));
       assertEquals("1", badge.getText());
   }
   ```
4. (1) Espera fixa de 2 s: insuficiente em dias lentos, desperdício em dias rápidos. (2) Seletor posicional `.btn:nth-child(3)`: qualquer mudança na ordem dos botões clica no lugar errado. (3) `textContent()` lê **uma vez**, sem esperar o badge atualizar; use `await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1')`.
5. Quando ninguém do negócio vai ler ou escrever os cenários; quando o time é pequeno e técnico; quando os cenários viram scripts de clique ("clico em X") em vez de comportamento. Nesses casos, testes bem nomeados no próprio framework (Playwright/JUnit) são mais simples de manter.

## Projeto da etapa

O que um avaliador olharia:

- Nenhum `waitForTimeout` e nenhum seletor posicional.
- Testes independentes (dá para rodar qualquer um sozinho, em qualquer ordem, em paralelo).
- Page Objects sem assertions de negócio.
- Trace habilitado para falhas e relatório HTML.
- Senha fora do código.
