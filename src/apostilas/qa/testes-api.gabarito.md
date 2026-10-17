# Gabarito: Testes de API

Abra só depois de tentar. A ServeRest pode evoluir; se uma mensagem mudar, confie na documentação (Swagger) do site.

## Tema 1

1. `POST /usuarios` → **201** com `message: "Cadastro realizado com sucesso"` e `_id`. `POST /login` → **200** com `message: "Login realizado com sucesso"` e `authorization: "Bearer <token>"`.
2. **400** com `message: "Este email já está sendo usado"`. Faz sentido: é um erro do cliente (regra de negócio violada), então 4xx. Algumas APIs usariam **409 Conflict**; ambos são aceitáveis se documentados.
3. Sem token: **401** com mensagem sobre token ausente, inválido ou expirado. Com usuário não administrador: **403** com mensagem de rota exclusiva para administradores.
4. Prática. Confira: `{{baseUrl}}` em todas as URLs; script de pós-resposta no login salvando o token; pre-request no cadastro gerando `{{email}}`.
5. ```js
   pm.test('status 201', () => pm.response.to.have.status(201))
   pm.test('mensagem', () => pm.expect(pm.response.json().message).to.eql('Cadastro realizado com sucesso'))
   pm.test('tempo < 1s', () => pm.expect(pm.response.responseTime).to.be.below(1000))
   ```
   `newman run colecao.json -e ambiente.json`

## Tema 2

1. ```ts
   test('login devolve token Bearer', async ({ request }) => {
     const email = `qa.${Date.now()}@exemplo.com`
     await request.post('/usuarios', { data: { nome: 'QA', email, password: 'teste123', administrador: 'true' } })
     const resp = await request.post('/login', { data: { email, password: 'teste123' } })
     expect(resp.status()).toBe(200)
     const corpo = await resp.json()
     expect(corpo.authorization).toMatch(/^Bearer /)
   })
   ```
2. ```ts
   const produto = () => ({ nome: `Produto ${Date.now()}`, preco: 100, descricao: 'Teste', quantidade: 10 })

   test('admin cria produto', async ({ admin }) => {
     expect((await admin.post('/produtos', { data: produto() })).status()).toBe(201)
   })
   test('sem token não cria', async ({ request }) => {
     expect((await request.post('/produtos', { data: produto() })).status()).toBe(401)
   })
   test('usuário comum não cria', async ({ usuarioComum }) => {
     expect((await usuarioComum.post('/produtos', { data: produto() })).status()).toBe(403)
   })
   ```
   `usuarioComum` é uma fixture igual à `admin`, mas cadastrando/logando com `administrador: "false"`.
3. ```json
   {
     "type": "object",
     "required": ["quantidade", "produtos"],
     "properties": {
       "quantidade": { "type": "integer", "minimum": 0 },
       "produtos": {
         "type": "array",
         "items": {
           "type": "object",
           "required": ["nome", "preco", "descricao", "quantidade", "_id"],
           "properties": {
             "nome": { "type": "string" },
             "preco": { "type": "integer" },
             "descricao": { "type": "string" },
             "quantidade": { "type": "integer" },
             "_id": { "type": "string" }
           }
         }
       }
     }
   }
   ```
   (Na ServeRest, `preco` e `quantidade` são inteiros.)
4. ```ts
   const casos = [
     { falta: 'nome', mensagem: 'nome é obrigatório' },
     { falta: 'email', mensagem: 'email é obrigatório' },
     { falta: 'password', mensagem: 'password é obrigatório' },
     { falta: 'administrador', mensagem: "administrador é obrigatório" },
   ]

   for (const { falta, mensagem } of casos) {
     test(`cadastro sem ${falta} retorna 400`, async ({ request }) => {
       const usuario: Record<string, string> = {
         nome: 'QA', email: `qa.${Date.now()}@exemplo.com`, password: 'teste123', administrador: 'false',
       }
       delete usuario[falta]
       const resp = await request.post('/usuarios', { data: usuario })
       expect(resp.status()).toBe(400)
       expect((await resp.json())[falta]).toBe(mensagem)
     })
   }
   ```
   Na ServeRest, o erro de validação vem com o **nome do campo** como chave (ex.: `{ "nome": "nome é obrigatório" }`). Confira as mensagens exatas na resposta real.
5. Exemplo: o serviço **Checkout** (consumidor) usa os campos `id`, `preco` e `estoqueDisponivel` da resposta do serviço **Catálogo** (provedor). Validação de schema: o time do Catálogo verifica que a resposta segue o OpenAPI dele. Se ele renomear `estoqueDisponivel` para `estoque` e atualizar o OpenAPI junto, o schema continua "válido", mas o Checkout quebra. Teste de contrato: o Checkout publica um contrato dizendo "preciso de `estoqueDisponivel` numérico"; o pipeline do Catálogo verifica esse contrato e **falha antes do deploy**, avisando que um consumidor seria quebrado.

## Projeto da etapa

O que um avaliador olharia:

- Testes independentes (cada um cria seus dados) e rodando em paralelo sem conflito.
- Casos negativos (validação, autenticação, autorização) tanto quanto os positivos.
- Schemas versionados no repositório.
- Nenhuma credencial no código.
- Teste do fluxo de carrinho conferindo que cancelar a compra devolve o estoque do produto.
