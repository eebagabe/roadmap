# Gabarito: Backend

Abra só depois de tentar.

## Tema 1

1. (a) `POST /clientes` → **201 Created** com header `Location`; (b) **404 Not Found**; (c) **409 Conflict** (aceita-se 422 dependendo da convenção do time); (d) `DELETE` → **204 No Content**; (e) **401 Unauthorized**; (f) **403 Forbidden**.
2. `GET /produtos`; `DELETE /usuarios/3`; `PATCH /pedidos/{id}` com corpo `{"status": "..."}` (ou `POST /pedidos/{id}/cancelamento` quando a mudança de estado é uma ação de negócio com regras próprias).
3. `PUT /pagamentos/77 {"valor": 100, "status": "PAGO"}` enviado duas vezes deixa o recurso no mesmo estado. `POST /pagamentos {"valor": 100}` enviado duas vezes (por exemplo, o cliente reenviou porque a rede caiu) cria **dois** pagamentos. Por isso POSTs de pagamento usam `Idempotency-Key`.
4. Resposta pessoal. Espera-se `HTTP/2 200`, `content-type: application/json; charset=utf-8` e headers como `x-ratelimit-limit`, `x-ratelimit-remaining`.
5. Para o navegador, portas diferentes são **origens diferentes**. A API não devolve `Access-Control-Allow-Origin: http://localhost:5173`, então o navegador bloqueia a leitura da resposta. Corrige-se **na API**, configurando CORS para permitir essa origem (no Spring, com `@CrossOrigin` ou uma configuração global). Em desenvolvimento, outra opção é um proxy no Vite.

## Tema 2

1. Exemplo:
   ```sql
   CREATE TABLE alunos (id BIGSERIAL PRIMARY KEY, nome VARCHAR(120) NOT NULL, email VARCHAR(200) NOT NULL UNIQUE);
   CREATE TABLE cursos (id BIGSERIAL PRIMARY KEY, titulo VARCHAR(200) NOT NULL, carga_horaria INT NOT NULL);
   CREATE TABLE matriculas (
     aluno_id   BIGINT NOT NULL REFERENCES alunos(id),
     curso_id   BIGINT NOT NULL REFERENCES cursos(id),
     data       DATE NOT NULL DEFAULT CURRENT_DATE,
     nota_final NUMERIC(4,2),
     PRIMARY KEY (aluno_id, curso_id)
   );
   ```
   Matrícula é a tabela N:N com atributos próprios. `nota_final` aceita nulo porque o curso pode não ter terminado.
2. ```sql
   SELECT c.nome, COALESCE(SUM(p.total), 0) AS total_gasto
   FROM clientes c
   LEFT JOIN pedidos p ON p.cliente_id = c.id AND p.status = 'PAGO'
   GROUP BY c.id, c.nome
   ORDER BY total_gasto DESC;
   ```
   O filtro de status vai no `ON`, não no `WHERE`: no `WHERE` ele eliminaria os clientes sem pedido pago, desfazendo o `LEFT JOIN`.
3. `CREATE INDEX idx_pedidos_status_criado ON pedidos(status, criado_em);` Coluna de **igualdade** primeiro (`status`), coluna de **intervalo** depois (`criado_em`). Assim o banco vai direto no bloco `PENDENTE` e lê só a faixa de datas. Se `PENDENTE` for raro, um índice parcial `WHERE status = 'PENDENTE'` é ainda menor.
4. Se o sistema caísse entre os dois `UPDATE`, os 100 reais sairiam da conta 1 e nunca chegariam na 2: dinheiro sumindo. Com atomicidade, ou as duas alterações acontecem, ou nenhuma.
5. (a) NoSQL chave-valor (Redis), dado temporário e acessado por chave; (b) SQL, precisa de ACID e consultas; (c) chave-valor com incremento atômico (Redis `INCR`), consolidado depois num banco; (d) grafo (Neo4j), ou SQL com consultas mais complexas em escala menor.

## Tema 3

1. (a) autenticação; (b) autorização; (c) autenticação; (d) autorização (falha de controle de acesso, IDOR).
2. Sem a chave dá para ler header (algoritmo) e payload (sub, roles, exp). A chave protege a **assinatura**: sem ela ninguém consegue alterar o payload (por exemplo, trocar `role` para `ADMIN`) e gerar um token que o servidor aceite.
3. SHA-256 é feito para ser **rápido**: uma GPU calcula bilhões por segundo, então força bruta em senhas fracas é viável mesmo com salt. bcrypt tem **fator de custo** ajustável, que o torna lento de propósito (dezenas a centenas de ms por tentativa), e inclui salt automaticamente.
4. Vulnerável:
   ```java
   String sql = "SELECT * FROM usuarios WHERE email = '" + email + "' AND senha_hash = '" + hash + "'";
   ```
   Com `email = "admin@ex.com' --"`, o resto da query vira comentário e a senha é ignorada. Corrigido:
   ```java
   var ps = conn.prepareStatement("SELECT id, senha_hash FROM usuarios WHERE email = ?");
   ps.setString(1, email);
   var rs = ps.executeQuery();
   // depois compare a senha com encoder.matches(senhaDigitada, rs.getString("senha_hash"))
   ```
5. Senha em texto puro; token completo (quem lê o log consegue se passar pelo usuário); número de cartão completo (viola PCI DSS). O e-mail também é dado pessoal (LGPD): prefira o ID do usuário ou mascare.

## Projeto da etapa

Checklist de correção:

- `POST` devolve `201` e `Location: /tarefas/{id}`; corpo inválido devolve `400` com JSON de erro.
- `GET /tarefas/999` devolve `404`, não `500`.
- Nenhuma query monta SQL concatenando strings.
- Conexões fechadas com `try-with-resources`.
- `System.getenv("DB_PASSWORD")` em vez de senha no código.
