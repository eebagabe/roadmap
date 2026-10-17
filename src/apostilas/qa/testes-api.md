# Testes de API: Apostila Prática

Roadmap QA · Semanas 10 e 11

## Comece por aqui

A maior parte da regra de negócio mora no **backend**. Testar a API diretamente é mais **rápido** (milissegundos em vez de segundos), mais **estável** (sem tela, sem animação) e encontra bugs **mais cedo** (antes mesmo de a tela existir). Na pirâmide de testes, API fica no meio: é onde o QA tem o melhor custo-benefício.

### Por que isso vale ouro no mercado

- Quase toda vaga de QA pede Postman e testes de API; vagas Java pedem REST Assured.
- Bancos e fintechs são feitos de APIs: PIX, Open Finance, integrações com parceiros.
- Testar API dá ao QA independência: não precisa esperar o front ficar pronto.

### Como esta apostila funciona

1. Vamos usar a **ServeRest** (serverest.dev), uma API gratuita brasileira feita para estudo, com usuários, login, produtos e carrinhos.
2. Primeiro Postman (manual e scripts), depois automação em código.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** requisição falhando? Leia o **status** e o **corpo da resposta** com calma: a API quase sempre diz o que está errado. Confira método, URL, headers (`Content-Type`, `Authorization`) e o JSON enviado.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 10 | Tema 1: HTTP e Postman |
| 11 | Tema 2: Automação de API + projeto |

## Tema 1: HTTP e Postman

**Objetivo:** entender requisições e respostas e testar APIs com o Postman.

### 1.1 HTTP e REST

Uma API REST organiza o sistema em **recursos** (usuários, produtos) acessados por URLs e **métodos**:

| Método | Ação | Exemplo na ServeRest |
|---|---|---|
| GET | Ler | `GET /produtos` |
| POST | Criar | `POST /usuarios` |
| PUT | Substituir/editar | `PUT /produtos/{id}` |
| DELETE | Apagar | `DELETE /usuarios/{id}` |

Requisição = método + URL + **headers** + **corpo** (opcional). Resposta = **status** + headers + corpo.

### 1.2 Status codes

| Código | Significa | Quando esperar |
|---|---|---|
| 200 OK | Sucesso | GET, PUT, DELETE |
| 201 Created | Criado | POST de cadastro |
| 204 No Content | Sucesso sem corpo | DELETE (em algumas APIs) |
| 400 Bad Request | Dados inválidos | Campo faltando, e-mail repetido |
| 401 Unauthorized | Não autenticado | Sem token ou token inválido |
| 403 Forbidden | Sem permissão | Usuário comum tentando ação de admin |
| 404 Not Found | Não existe | ID inexistente |
| 409 Conflict | Conflito | Recurso duplicado (em algumas APIs) |
| 500 Internal Server Error | Erro no servidor | **Sempre bug** |

> **Cuidado! Cai na entrevista:** "A API retornou 500 quando mandei um e-mail inválido. É bug?" **Sim.** Entrada inválida do cliente deveria gerar **4xx** com mensagem clara. Um 500 indica que o servidor não tratou o caso.

### 1.3 JSON

```json
{
  "nome": "Ana QA",
  "email": "ana.qa@exemplo.com",
  "password": "teste123",
  "administrador": "true",
  "enderecos": [{ "cidade": "Recife", "uf": "PE" }]
}
```

Tipos: texto (`"..."`), número, `true/false`, `null`, objeto `{}` e lista `[]`. Atenção: na ServeRest, `administrador` é **texto** (`"true"`), não booleano. Ler a documentação (Swagger) evita falsos bugs.

### 1.4 Postman

Fluxo básico:

1. Crie uma **Collection** "ServeRest".
2. Adicione a requisição `GET https://serverest.dev/usuarios` e clique em Send.
3. Adicione `POST https://serverest.dev/usuarios` com Body > raw > JSON.
4. Faça login: `POST /login` com `{ "email": "...", "password": "..." }`. A resposta traz `authorization: "Bearer ..."`.
5. Use esse token no header `Authorization` para criar produtos (`POST /produtos`, só admin).

### 1.5 Variáveis e ambientes

Não repita URL e token em toda requisição.

- **Environment** "ServeRest Prod" com `baseUrl = https://serverest.dev`.
- Requisições usam `{{baseUrl}}/usuarios`.
- Para trocar de ambiente (local, homologação), troque só o environment.

Guardar o token automaticamente, na aba **Scripts > Post-response** do login:

```js
const corpo = pm.response.json()
pm.environment.set('token', corpo.authorization)
```

E no header das outras requisições: `Authorization: {{token}}`.

Gerar e-mail único no **Pre-request**:

```js
pm.environment.set('email', `qa.${Date.now()}@exemplo.com`)
```

### 1.6 Scripts de teste

```js
pm.test('status 201', () => {
  pm.response.to.have.status(201)
})

pm.test('mensagem de sucesso', () => {
  const corpo = pm.response.json()
  pm.expect(corpo.message).to.eql('Cadastro realizado com sucesso')
  pm.expect(corpo._id).to.be.a('string').and.not.empty
  pm.environment.set('usuarioId', corpo._id)
})

pm.test('responde em menos de 1s', () => {
  pm.expect(pm.response.responseTime).to.be.below(1000)
})
```

O **Collection Runner** executa a coleção inteira em ordem e mostra quais testes passaram.

### 1.7 Newman

Roda coleções do Postman pela linha de comando, por exemplo no CI:

```bash
npm install -g newman newman-reporter-htmlextra
newman run serverest.postman_collection.json -e prod.postman_environment.json -r cli,htmlextra
```

### O que testar numa API (checklist)

- **Caminho feliz:** status, corpo, headers (`Content-Type`).
- **Validações:** campos obrigatórios faltando, tipos errados, tamanhos, formatos (e-mail), valores limite.
- **Regras de negócio:** e-mail duplicado, estoque, permissões.
- **Autenticação/autorização:** sem token, token inválido, token de usuário sem permissão.
- **Recurso inexistente:** IDs que não existem, IDs mal formados.
- **Idempotência:** repetir PUT/DELETE.
- **Contrato:** campos e tipos da resposta.
- **Tempo de resposta.**

### Atividades de fixação do Tema 1

1. Na ServeRest, cadastre um usuário administrador e faça login. Que status e campos vieram em cada resposta?
2. Tente cadastrar o mesmo e-mail de novo. Qual status e qual mensagem? Faz sentido?
3. Crie um produto **sem** o token. Depois com o token de um usuário **não** administrador. Anote os status e as mensagens.
4. Monte a coleção com environment, token salvo automaticamente e e-mail gerado no pre-request.
5. Escreva os testes (scripts) para: status, mensagem e tempo de resposta do `POST /usuarios`; rode tudo com o Collection Runner e depois com o Newman.

## Tema 2: Automação de API

**Objetivo:** escrever testes de API em código, que rodam no pipeline.

### 2.1 Testes de API no Playwright

O Playwright tem um cliente HTTP embutido (`request`), ótimo para quem já usa Playwright na web e para **preparar dados** de testes E2E.

```ts
import { test, expect } from '@playwright/test'

test.use({ baseURL: 'https://serverest.dev' })

test('cadastra usuário', async ({ request }) => {
  const email = `qa.${Date.now()}@exemplo.com`
  const resp = await request.post('/usuarios', {
    data: { nome: 'QA Auto', email, password: 'teste123', administrador: 'false' },
  })
  expect(resp.status()).toBe(201)
  const corpo = await resp.json()
  expect(corpo.message).toBe('Cadastro realizado com sucesso')
  expect(corpo._id).toBeTruthy()
})

test('não permite e-mail duplicado', async ({ request }) => {
  const email = `qa.${Date.now()}@exemplo.com`
  const usuario = { nome: 'QA', email, password: 'teste123', administrador: 'false' }
  await request.post('/usuarios', { data: usuario })
  const resp = await request.post('/usuarios', { data: usuario })
  expect(resp.status()).toBe(400)
  expect((await resp.json()).message).toBe('Este email já está sendo usado')
})
```

### 2.2 REST Assured (Java)

Biblioteca padrão para testes de API em Java, com sintaxe **given / when / then**.

```xml
<!-- pom.xml (trecho) -->
<dependency>
  <groupId>io.rest-assured</groupId>
  <artifactId>rest-assured</artifactId>
  <version>5.5.0</version>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>io.rest-assured</groupId>
  <artifactId>json-schema-validator</artifactId>
  <version>5.5.0</version>
  <scope>test</scope>
</dependency>
```

```java
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

class UsuariosTest {
    @BeforeAll
    static void config() {
        baseURI = "https://serverest.dev";
    }

    @Test
    void cadastraUsuario() {
        var email = "qa." + System.currentTimeMillis() + "@exemplo.com";
        var corpo = Map.of("nome", "QA Java", "email", email, "password", "teste123", "administrador", "false");

        given()
            .contentType("application/json")
            .body(corpo)
        .when()
            .post("/usuarios")
        .then()
            .statusCode(201)
            .body("message", equalTo("Cadastro realizado com sucesso"))
            .body("_id", not(emptyOrNullString()));
    }

    @Test
    void buscaUsuarioInexistente() {
        given()
        .when()
            .get("/usuarios/{id}", "idInexistente123")
        .then()
            .statusCode(400)
            .body("message", equalTo("Usuário não encontrado"));
    }
}
```

> **Na prática:** repare que a ServeRest devolve **400** (e não 404) para usuário não encontrado. É uma decisão da API, documentada. Seu teste deve seguir o **contrato documentado**; se você acha que o contrato está errado, isso é uma conversa com o time, não um teste que falha para sempre.

### 2.3 Validação de schema

Em vez de verificar campo por campo, valide a **estrutura** inteira da resposta com JSON Schema: quais campos existem, os tipos e quais são obrigatórios.

```json
{
  "type": "object",
  "required": ["quantidade", "usuarios"],
  "properties": {
    "quantidade": { "type": "integer" },
    "usuarios": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["nome", "email", "password", "administrador", "_id"],
        "properties": {
          "nome": { "type": "string" },
          "email": { "type": "string", "format": "email" },
          "administrador": { "type": "string", "enum": ["true", "false"] },
          "_id": { "type": "string" }
        }
      }
    }
  }
}
```

```java
get("/usuarios").then().body(matchesJsonSchemaInClasspath("schemas/usuarios.json"));
```

Em JavaScript/TypeScript, use `ajv` ou valide com `zod`.

### 2.4 Autenticação nos testes

- Obtenha o token **uma vez** (num `@BeforeAll` ou fixture) e reaproveite.
- Credenciais em **variáveis de ambiente**.
- Teste também os casos de segurança: sem token, token expirado, token alterado, usuário sem permissão.

```ts
// fixture do Playwright com token de admin
export const test = base.extend<{ admin: APIRequestContext }>({
  admin: async ({ playwright }, use) => {
    const ctx = await playwright.request.newContext({ baseURL: 'https://serverest.dev' })
    const login = await ctx.post('/login', { data: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_SENHA } })
    const { authorization } = await login.json()
    const admin = await playwright.request.newContext({
      baseURL: 'https://serverest.dev',
      extraHTTPHeaders: { Authorization: authorization },
    })
    await use(admin)
    await admin.dispose()
    await ctx.dispose()
  },
})
```

### 2.5 Contract testing

Em microsserviços, o serviço A (consumidor) depende do formato da resposta do serviço B (provedor). Se B muda um campo, A quebra em produção. **Testes de contrato** (ex.: **Pact**) registram o que o consumidor espera e verificam no pipeline do provedor que ele continua cumprindo, **sem** precisar subir os dois juntos.

Diferença para validação de schema: o schema verifica a resposta contra uma especificação; o contrato verifica contra o que **os consumidores realmente usam**.

### 2.6 SQL para QA

Muitas vezes o QA precisa **conferir no banco** se a API gravou certo, ou preparar dados:

```sql
-- o pedido foi gravado com o status certo?
SELECT id, status, total FROM pedidos WHERE cliente_id = 42 ORDER BY criado_em DESC LIMIT 1;

-- quantos usuários foram criados hoje pelos testes?
SELECT COUNT(*) FROM usuarios WHERE email LIKE 'qa.%' AND criado_em >= CURRENT_DATE;

-- itens de um pedido com nome do produto
SELECT p.nome, i.quantidade, i.preco_unitario
FROM itens_pedido i JOIN produtos p ON p.id = i.produto_id
WHERE i.pedido_id = 981;
```

O básico que todo QA deve saber: `SELECT`, `WHERE`, `ORDER BY`, `JOIN`, `GROUP BY`, `COUNT`. Em ambientes compartilhados, **nunca** rode `UPDATE` ou `DELETE` sem `WHERE` (e, de preferência, só com permissão de leitura).

### Atividades de fixação do Tema 2

1. Automatize no Playwright (ou REST Assured): cadastrar usuário, fazer login e verificar que o token começa com "Bearer".
2. Automatize: criar produto com admin (201), sem token (401) e com usuário comum (403).
3. Escreva o JSON Schema da resposta de `GET /produtos` e valide no teste.
4. Escreva testes parametrizados (data-driven) para o cadastro de usuário com campos faltando: sem nome, sem e-mail, sem senha, sem administrador. Verifique status e mensagem de cada um.
5. Explique a diferença entre validação de schema e testes de contrato com um exemplo de dois microsserviços.

## Projeto da etapa

**Framework de testes de API da ServeRest:**

1. Escolha: Playwright + TypeScript **ou** Java + REST Assured + JUnit 5.
2. Cobertura: usuários (CRUD + validações), login (válido/inválido), produtos (permissões, duplicidade), carrinhos (criar, concluir, cancelar compra e devolver estoque).
3. Dados gerados (e-mails únicos), testes independentes e limpeza do que for criado.
4. Validação de schema em pelo menos 3 endpoints.
5. Credenciais em variáveis de ambiente; relatório HTML (ou Allure).
6. Bônus: a coleção do Postman da semana anterior rodando com Newman no mesmo repositório.

## Resumão

- API testada direto = rápido, estável e cedo.
- Status 4xx para erro do cliente; **500 é sempre bug**.
- Postman: collections, environments, scripts, Newman no CI.
- Teste caminho feliz, validações, regras, autenticação/autorização, inexistentes e contrato.
- Playwright `request` ou REST Assured (given/when/then).
- Schema valida a estrutura; contract testing protege consumidores.
- SQL básico para conferir e preparar dados.
