# Backend: Apostila Prática

Roadmap Java Backend · Semanas 10 a 12

## Comece por aqui

Antes do Spring, existe o **backend em si**: receber uma requisição HTTP, validar, consultar um banco e devolver uma resposta com segurança. Isso vale para Java, Node, Go ou Python. Quem domina esses fundamentos troca de linguagem sem sofrer.

### Por que isso vale ouro no mercado

- Toda vaga de backend pede "APIs REST" e "SQL". Toda.
- Bugs de produção mais comuns: status code errado, query lenta sem índice, transação mal feita, CORS bloqueando o front.
- Falhas de segurança (SQL injection, senha em texto puro, token vazado) viram notícia e demissão.

### Como esta apostila funciona

1. Leia a teoria e rode os comandos (`curl`, `psql`).
2. Os quadros **Cuidado! Cai na entrevista** são perguntas reais.
3. Faça as atividades e só depois veja o gabarito.

> **Regra dos 20 minutos:** travou? Releia, teste um pedaço menor. Só depois de 20 minutos abra o gabarito.

### Preparando o ambiente

Suba um PostgreSQL com Docker:

```bash
docker run --name pg -e POSTGRES_PASSWORD=senha -p 5432:5432 -d postgres:16
docker exec -it pg psql -U postgres
```

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 10 | Tema 1: Como a web funciona e APIs |
| 11 | Tema 2: Banco de dados |
| 12 | Tema 3: Segurança e boas práticas + projeto |

## Tema 1: Como a web funciona e APIs

**Objetivo:** entender o protocolo HTTP de verdade e desenhar APIs REST que outros devs gostem de usar.

### 1.1 HTTP: requisição e resposta

HTTP é texto. Uma requisição:

```http
POST /pedidos HTTP/1.1
Host: api.loja.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...

{"produtoId": 42, "quantidade": 2}
```

Uma resposta:

```http
HTTP/1.1 201 Created
Location: /pedidos/981
Content-Type: application/json

{"id": 981, "status": "AGUARDANDO_PAGAMENTO"}
```

Partes: **método + caminho**, **headers** (metadados) e **corpo** (opcional).

### 1.2 Métodos e status codes

| Método | Para quê | Idempotente? | Seguro? |
|---|---|---|---|
| GET | Ler | Sim | Sim |
| POST | Criar / ação | Não | Não |
| PUT | Substituir inteiro | Sim | Não |
| PATCH | Alterar parte | Não necessariamente | Não |
| DELETE | Remover | Sim | Não |

**Idempotente:** repetir a mesma requisição tem o mesmo efeito que fazer uma vez. **Seguro:** não altera nada.

| Faixa | Significado | Mais usados |
|---|---|---|
| 2xx | Deu certo | 200 OK, 201 Created, 204 No Content |
| 3xx | Vá para outro lugar | 301, 302, 304 Not Modified |
| 4xx | Erro do **cliente** | 400, 401, 403, 404, 409 Conflict, 422, 429 Too Many Requests |
| 5xx | Erro do **servidor** | 500, 502 Bad Gateway, 503, 504 Gateway Timeout |

> **Cuidado! Cai na entrevista:** **401 Unauthorized** = "não sei quem você é" (falta login ou token inválido). **403 Forbidden** = "sei quem você é, mas você não pode". E "qual a diferença entre PUT e PATCH?" e "POST é idempotente?" (não).

### 1.3 REST e JSON

REST é um estilo de desenhar APIs em torno de **recursos** (substantivos), usando os métodos HTTP como verbos.

| Ruim | Bom |
|---|---|
| `POST /criarUsuario` | `POST /usuarios` |
| `GET /buscarPedidosDoUsuario?id=5` | `GET /usuarios/5/pedidos` |
| `POST /deletarProduto/9` | `DELETE /produtos/9` |

JSON é o formato padrão do corpo: objetos `{}`, listas `[]`, strings, números, `true/false`, `null`.

### 1.4 Headers, Cookies e CORS

Headers importantes: `Content-Type`, `Accept`, `Authorization`, `Cache-Control`, `Location`.

**Cookie:** o servidor manda `Set-Cookie: sessao=abc; HttpOnly; Secure; SameSite=Lax` e o navegador reenvia automaticamente nas próximas requisições para aquele domínio.

**CORS:** o navegador bloqueia JavaScript de `meusite.com` lendo respostas de `api.outro.com`, a menos que a API diga que permite, com headers como `Access-Control-Allow-Origin: https://meusite.com`. Para algumas requisições o navegador manda antes um **preflight** (`OPTIONS`).

> **Cuidado! Cai na entrevista:** CORS é proteção **do navegador**. `curl` e Postman ignoram CORS. Se "funciona no Postman e não no front", provavelmente é CORS. E a correção é **no servidor**, não no front.

### 1.5 Design de API

Boas práticas que diferenciam um júnior de um pleno:

- **Paginação:** `GET /produtos?page=0&size=20` (ou por cursor, para listas grandes).
- **Filtros e ordenação:** `GET /pedidos?status=PAGO&sort=criadoEm,desc`.
- **Versionamento:** `/v1/pedidos` ou header.
- **Erros padronizados:** sempre o mesmo formato, por exemplo o RFC 9457 (Problem Details):
  ```json
  {"type": "about:blank", "title": "Estoque insuficiente", "status": 409,
   "detail": "Produto 42 tem 1 unidade, pedido pediu 2"}
  ```
- **Idempotency-Key** em POSTs críticos (pagamentos): o cliente manda uma chave única e o servidor não processa duas vezes.

```bash
curl -i https://api.github.com/users/octocat     # -i mostra status e headers
curl -i -X POST https://httpbin.org/post -H "Content-Type: application/json" -d '{"a":1}'
```

### Atividades de fixação do Tema 1

1. Escolha método e status para: (a) criar um cliente; (b) cliente não encontrado; (c) e-mail já cadastrado; (d) apagar um produto com sucesso; (e) token expirado; (f) usuário comum tentando acessar rota de admin.
2. Reescreva em REST: `POST /getAllProducts`, `GET /deleteUser?id=3`, `POST /updateOrderStatus`.
3. Explique por que PUT é idempotente e POST não, com um exemplo de pagamento.
4. Use `curl -i` na API do GitHub e encontre: status, `Content-Type` e algum header de rate limit.
5. Seu front em `localhost:5173` chama sua API em `localhost:8080` e dá erro de CORS. Explique o que está acontecendo e onde se corrige.

## Tema 2: Banco de dados

**Objetivo:** modelar dados, escrever SQL que não derruba a produção e entender transações.

### 2.1 SQL essencial

```sql
CREATE TABLE clientes (
  id         BIGSERIAL PRIMARY KEY,
  nome       VARCHAR(120) NOT NULL,
  email      VARCHAR(200) NOT NULL UNIQUE,
  criado_em  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE pedidos (
  id          BIGSERIAL PRIMARY KEY,
  cliente_id  BIGINT NOT NULL REFERENCES clientes(id),
  total       NUMERIC(12,2) NOT NULL,
  status      VARCHAR(30) NOT NULL
);

INSERT INTO clientes (nome, email) VALUES ('Ana', 'ana@ex.com'), ('Bruno', 'bruno@ex.com');
INSERT INTO pedidos (cliente_id, total, status) VALUES (1, 150.00, 'PAGO'), (1, 80.50, 'PENDENTE'), (2, 300.00, 'PAGO');

SELECT status, COUNT(*), SUM(total) FROM pedidos GROUP BY status HAVING SUM(total) > 100;
```

> **Na prática:** dinheiro é `NUMERIC`/`DECIMAL` no banco e `BigDecimal` no Java. **Nunca** `double`: `0.1 + 0.2` dá `0.30000000000000004`.

### 2.2 Modelagem e normalização

Modelar é decidir tabelas e relacionamentos:

- **1:N**: um cliente tem vários pedidos (`pedidos.cliente_id`).
- **N:N**: um pedido tem vários produtos e um produto está em vários pedidos: tabela intermediária `itens_pedido(pedido_id, produto_id, quantidade, preco_unitario)`.

**Normalização** evita dados repetidos. Ideia das três primeiras formas normais:

1. **1FN:** cada coluna tem um valor só (nada de `telefones = "1199..., 1198..."`).
2. **2FN:** toda coluna depende da chave **inteira** (em chaves compostas).
3. **3FN:** coluna não depende de outra coluna que não é chave (nada de `cidade` e `uf_da_cidade` repetidos em cada cliente).

> **Na prática:** às vezes se **desnormaliza** de propósito para leitura rápida (ex.: guardar `preco_unitario` no item do pedido, porque o preço do produto muda depois). É decisão, não erro.

### 2.3 Joins

```sql
-- INNER: só clientes que têm pedido
SELECT c.nome, p.total FROM clientes c JOIN pedidos p ON p.cliente_id = c.id;

-- LEFT: todos os clientes, com pedido ou não
SELECT c.nome, COUNT(p.id) AS qtd
FROM clientes c LEFT JOIN pedidos p ON p.cliente_id = c.id
GROUP BY c.nome;
```

### 2.4 Índices

Sem índice, o banco lê a tabela inteira (**full scan**). Um índice (normalmente uma **B-tree**) é como o índice remissivo de um livro.

```sql
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
EXPLAIN ANALYZE SELECT * FROM pedidos WHERE cliente_id = 1;
```

- Índices aceleram leitura e **deixam escrita mais lenta** (cada insert atualiza os índices).
- Índice composto `(cliente_id, status)` serve para filtrar por `cliente_id` sozinho ou por `cliente_id` + `status`, mas **não** por `status` sozinho (regra do prefixo à esquerda).
- `WHERE LOWER(email) = ...` não usa um índice em `email` comum.

> **Cuidado! Cai na entrevista:** "A query está lenta, o que você faz?" Rode `EXPLAIN ANALYZE`, procure `Seq Scan` em tabela grande, crie índice adequado, evite `SELECT *`, veja se há N+1 na aplicação.

### 2.5 Transações e ACID

Uma **transação** agrupa operações que devem acontecer **todas ou nenhuma**.

```sql
BEGIN;
UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;
COMMIT;   -- ou ROLLBACK se algo deu errado
```

| Letra | Significado | Em português simples |
|---|---|---|
| A | Atomicidade | Tudo ou nada |
| C | Consistência | Regras (constraints) sempre respeitadas |
| I | Isolamento | Transações simultâneas não se atrapalham (em níveis) |
| D | Durabilidade | Deu COMMIT, não se perde nem se a luz cair |

Níveis de isolamento (do mais fraco ao mais forte): Read Uncommitted, **Read Committed** (padrão do PostgreSQL), Repeatable Read, Serializable. Quanto mais forte, menos anomalias e menos desempenho.

### 2.6 NoSQL

| Tipo | Exemplo | Bom para |
|---|---|---|
| Documento | MongoDB | Dados com formato flexível, catálogos |
| Chave-valor | Redis, DynamoDB | Cache, sessão, contadores |
| Colunar largo | Cassandra | Escrita massiva, séries temporais |
| Grafo | Neo4j | Relacionamentos (recomendações, fraude) |

> **Na prática:** comece com PostgreSQL. Ele resolve 90% dos casos (e ainda tem JSONB). Use NoSQL quando houver um motivo claro.

### Atividades de fixação do Tema 2

1. Modele (tabelas, colunas, chaves) um sistema de cursos: alunos, cursos, matrículas (com data e nota final).
2. Escreva a query: nome de cada cliente e o valor total gasto em pedidos `PAGO`, incluindo clientes que gastaram zero, ordenado do maior para o menor.
3. A tabela `pedidos` tem 50 milhões de linhas e a query `WHERE status = 'PENDENTE' AND criado_em > now() - interval '1 day'` está lenta. Proponha um índice e explique a ordem das colunas.
4. Explique, com o exemplo da transferência, o que aconteceria sem atomicidade.
5. Para cada caso escolha SQL ou NoSQL (e qual tipo): (a) carrinho de compras temporário; (b) extrato bancário; (c) contador de visualizações de vídeos; (d) "pessoas que você talvez conheça".

## Tema 3: Segurança e boas práticas

**Objetivo:** não ser o dev que vaza senha de cliente.

### 3.1 Autenticação vs Autorização

- **Autenticação:** quem é você? (login, senha, token).
- **Autorização:** o que você pode fazer? (papéis, permissões).

### 3.2 Sessão vs JWT

| | Sessão | JWT |
|---|---|---|
| Onde fica o estado | No servidor (memória/Redis) | Dentro do token (assinado) |
| O cliente guarda | Um ID de sessão (cookie) | O token inteiro |
| Revogar (logout) | Fácil: apaga a sessão | Difícil: vale até expirar |
| Escala horizontal | Precisa de sessão compartilhada | Natural |

Um JWT tem três partes em Base64: `header.payload.assinatura`. **Base64 não é criptografia**: qualquer um lê o payload. A assinatura só garante que ninguém alterou.

> **Cuidado! Cai na entrevista:** nunca coloque senha ou dado sensível no payload do JWT. Use expiração curta (ex.: 15 min) com **refresh token**.

### 3.3 OAuth2

OAuth2 é o protocolo do "Entrar com Google". Seu sistema não vê a senha do usuário: o Google autentica e entrega um token dizendo "esse é o usuário X e ele permitiu Y". O fluxo recomendado para apps web é o **Authorization Code com PKCE**. **OpenID Connect** é a camada sobre OAuth2 que traz a identidade (o `id_token`).

### 3.4 Hash de senha

Senha **nunca** é guardada em texto puro e **nunca** com MD5/SHA-256 puro (rápidos demais, fáceis de quebrar por força bruta). Use algoritmos lentos de propósito e com **salt**: **bcrypt**, **Argon2** ou scrypt.

```java
// Spring Security
PasswordEncoder encoder = new BCryptPasswordEncoder();
String hash = encoder.encode("minhaSenha");          // salva isso no banco
boolean ok = encoder.matches("minhaSenha", hash);    // no login
```

**Hash** não tem volta. **Criptografia** tem volta (com a chave). Senha usa hash.

### 3.5 OWASP Top 10 (os que mais aparecem)

- **Injection:** concatenar entrada do usuário em SQL.
  ```java
  // NUNCA
  "SELECT * FROM usuarios WHERE email = '" + email + "'"
  // SEMPRE: PreparedStatement / JPA com parâmetros
  "SELECT u FROM Usuario u WHERE u.email = :email"
  ```
  Com o primeiro, `email = "' OR '1'='1"` devolve todos os usuários.
- **Broken Access Control:** `GET /pedidos/123` devolve pedido de outro usuário porque ninguém checou o dono (IDOR).
- **Falhas criptográficas:** HTTP sem TLS, senha com MD5.
- **Configuração insegura:** stack trace exposto na resposta, porta de admin aberta.
- **Componentes vulneráveis:** dependências desatualizadas (lembre do Log4Shell em 2021).

### 3.6 Logs e variáveis de ambiente

- Log bom tem contexto: `pedido 981 recusado: estoque insuficiente (produto=42, pedido=2, disponivel=1)`.
- **Nunca** logue senha, token, número de cartão ou CPF completo.
- Use níveis: `ERROR` (alguém precisa agir), `WARN`, `INFO` (eventos de negócio), `DEBUG`.
- Segredos (senha do banco, chaves de API) vêm de **variáveis de ambiente** ou de um cofre (Vault, AWS Secrets Manager). Nunca no Git.

```bash
export DB_PASSWORD=supersecreta
git log -p | grep -i password   # se aparecer algo, a senha já vazou: troque-a
```

### 3.7 Pirâmide de testes

```
        /\        E2E (poucos, lentos, caros)
       /  \
      /----\      Integração (API + banco real)
     /      \
    /--------\    Unitários (muitos, rápidos)
```

Muitos testes unitários, uma boa camada de integração e poucos testes ponta a ponta.

### Atividades de fixação do Tema 3

1. Para cada situação diga se é problema de autenticação ou autorização: (a) senha errada; (b) estagiário apagando pedido; (c) token expirado; (d) usuário vendo o pedido de outro.
2. Decodifique um JWT de exemplo em jwt.io. O que dá para ler sem a chave? O que a chave protege?
3. Por que SHA-256 com salt ainda não é boa escolha para senha, mas bcrypt é?
4. Escreva um exemplo de SQL injection num login e a versão corrigida em Java com `PreparedStatement`.
5. Encontre 3 problemas neste log: `ERRO login falhou user=ana@ex.com senha=123456 token=eyJ... cartao=4111111111111111`.

## Projeto da etapa

**API de lista de tarefas, sem Spring, só para entender o que o framework fará por você depois.** Use o `com.sun.net.httpserver.HttpServer` do JDK e JDBC com PostgreSQL:

1. `POST /tarefas`, `GET /tarefas`, `GET /tarefas/{id}`, `PATCH /tarefas/{id}`, `DELETE /tarefas/{id}`.
2. Status corretos (201 com `Location`, 404, 400 com corpo de erro padronizado).
3. `PreparedStatement` em todas as queries.
4. Índice na coluna usada em filtros.
5. Senha do banco vinda de variável de ambiente.

Quando você fizer o mesmo com Spring Boot, vai perceber o quanto ele simplifica.

## Resumão

- HTTP é texto: método, caminho, headers, corpo. Status 4xx é culpa do cliente, 5xx do servidor.
- 401 = não autenticado; 403 = sem permissão.
- REST: recursos no plural, métodos como verbos, erros padronizados, paginação.
- SQL: modele com cuidado, use índices com `EXPLAIN ANALYZE`, transações para operações que precisam ser atômicas.
- Dinheiro: `NUMERIC` e `BigDecimal`.
- Senha: bcrypt/Argon2. SQL: sempre parâmetros. Segredos: fora do Git.
