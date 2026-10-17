# SQL e Modelagem: Apostila Prática

Roadmap Analista e Engenheiro de Dados · Semanas 04 a 07

## Comece por aqui

SQL é **a** habilidade da área de dados. Analista usa todo dia para responder perguntas; engenheiro usa para transformar e modelar dados. Ferramentas mudam (Spark, BigQuery, Snowflake, dbt), mas todas falam SQL. E modelagem é o que faz o SQL ficar simples (ou um pesadelo).

### Por que isso vale ouro no mercado

- Praticamente toda entrevista de dados tem um teste de SQL, geralmente com joins, agregação e **window functions**.
- Modelagem dimensional (fatos e dimensões) é o vocabulário de qualquer time de BI e de engenharia de analytics.
- SQL eficiente economiza dinheiro de verdade: em warehouses na nuvem, você paga pelos dados lidos.

### Como esta apostila funciona

1. Suba um PostgreSQL com Docker (veja abaixo) e crie as tabelas de exemplo.
2. Digite cada query, execute e **confira o resultado à mão** nas primeiras vezes.
3. Pratique também em sites como LeetCode (seção Database), HackerRank (SQL) e StrataScratch.

> **Regra dos 20 minutos:** query complicada? Construa por partes. Primeiro o `FROM` e os `JOIN`s com `SELECT *` e `LIMIT 10`; confira as linhas. Depois filtre, depois agregue.

### Preparando o ambiente

```bash
docker run --name pg -e POSTGRES_PASSWORD=senha -p 5432:5432 -d postgres:16
docker exec -it pg psql -U postgres
```

```sql
CREATE TABLE clientes (
  id INT PRIMARY KEY, nome TEXT NOT NULL, cidade TEXT, uf CHAR(2), criado_em DATE NOT NULL
);
CREATE TABLE produtos (
  id INT PRIMARY KEY, nome TEXT NOT NULL, categoria TEXT NOT NULL, preco NUMERIC(10,2) NOT NULL
);
CREATE TABLE pedidos (
  id INT PRIMARY KEY, cliente_id INT REFERENCES clientes(id), data DATE NOT NULL, status TEXT NOT NULL
);
CREATE TABLE itens (
  pedido_id INT REFERENCES pedidos(id), produto_id INT REFERENCES produtos(id),
  quantidade INT NOT NULL, preco_unitario NUMERIC(10,2) NOT NULL,
  PRIMARY KEY (pedido_id, produto_id)
);

INSERT INTO clientes VALUES
 (1,'Ana','Recife','PE','2025-01-10'), (2,'Bruno','São Paulo','SP','2025-02-03'),
 (3,'Carla','Recife','PE','2025-02-20'), (4,'Diego','Curitiba','PR','2025-03-15'),
 (5,'Elisa',NULL,'SP','2025-03-28');
INSERT INTO produtos VALUES
 (1,'Café 500g','Mercearia',25.00), (2,'Caneca','Casa',40.00),
 (3,'Cafeteira','Eletro',300.00), (4,'Filtro','Mercearia',8.00);
INSERT INTO pedidos VALUES
 (101,1,'2025-03-01','PAGO'), (102,1,'2025-03-15','PAGO'), (103,2,'2025-03-20','CANCELADO'),
 (104,3,'2025-04-02','PAGO'), (105,2,'2025-04-10','PAGO'), (106,4,'2025-04-11','PENDENTE');
INSERT INTO itens VALUES
 (101,1,2,25.00), (101,4,1,8.00), (102,3,1,280.00), (103,2,2,40.00),
 (104,1,1,25.00), (104,2,1,40.00), (105,3,1,300.00), (105,1,3,25.00), (106,4,5,8.00);
```

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 04 | Tema 1: SQL essencial |
| 05 | Tema 2: Joins, subqueries e CTEs |
| 06 | Tema 3: Window functions e performance |
| 07 | Tema 4: Modelagem de dados + projeto |

## Tema 1: SQL essencial

**Objetivo:** filtrar, ordenar, transformar e agregar dados de uma tabela.

### 1.1 SELECT e WHERE

```sql
SELECT nome, cidade
FROM clientes
WHERE uf = 'PE';

SELECT * FROM produtos WHERE preco BETWEEN 10 AND 50;
SELECT * FROM produtos WHERE categoria IN ('Casa', 'Eletro');
SELECT * FROM clientes WHERE nome LIKE 'C%';        -- começa com C (ILIKE ignora maiúsculas no PostgreSQL)
SELECT * FROM pedidos WHERE status <> 'CANCELADO' AND data >= '2025-04-01';
```

### 1.2 ORDER BY e LIMIT

```sql
SELECT nome, preco FROM produtos ORDER BY preco DESC LIMIT 2;   -- os 2 mais caros
```

### 1.3 Funções de texto e data

```sql
SELECT UPPER(nome), LENGTH(nome), COALESCE(cidade, 'Não informada') FROM clientes;

SELECT id,
       EXTRACT(MONTH FROM data)        AS mes,
       DATE_TRUNC('month', data)::date AS inicio_mes,
       data + INTERVAL '30 days'       AS vencimento
FROM pedidos;
```

Funções de data variam entre bancos (PostgreSQL, BigQuery, SQL Server). O conceito é o mesmo; a sintaxe você confere na documentação.

### 1.4 CASE WHEN

```sql
SELECT nome, preco,
       CASE
         WHEN preco < 20  THEN 'barato'
         WHEN preco < 100 THEN 'médio'
         ELSE 'caro'
       END AS faixa
FROM produtos;
```

### 1.5 GROUP BY e HAVING

```sql
-- faturamento por pedido
SELECT pedido_id, SUM(quantidade * preco_unitario) AS total
FROM itens
GROUP BY pedido_id
HAVING SUM(quantidade * preco_unitario) > 100   -- filtra GRUPOS
ORDER BY total DESC;
```

Ordem lógica de execução (decore, ajuda muito):

```
FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT
```

> **Cuidado! Cai na entrevista:** "Qual a diferença entre WHERE e HAVING?" WHERE filtra **linhas antes** de agrupar; HAVING filtra **grupos depois** de agrupar (por isso pode usar `SUM`, `COUNT`). E por que não dá para usar o apelido do SELECT no WHERE? Porque o WHERE executa antes do SELECT.

### 1.6 NULL

`NULL` é "desconhecido". Qualquer comparação com `NULL` dá desconhecido (nem verdadeiro, nem falso).

```sql
SELECT * FROM clientes WHERE cidade = NULL;     -- não retorna nada!
SELECT * FROM clientes WHERE cidade IS NULL;    -- certo
SELECT COUNT(*), COUNT(cidade) FROM clientes;   -- 5 e 4: COUNT(coluna) ignora NULL
```

`AVG`, `SUM` e outras agregações também ignoram `NULL`. Isso pode mudar o resultado sem você perceber.

### Atividades de fixação do Tema 1

1. Liste os produtos da categoria Mercearia, do mais caro para o mais barato.
2. Quantos pedidos existem por status?
3. Mostre os clientes com a cidade, trocando cidade nula por "Não informada", e uma coluna `regiao` que vale "Nordeste" para PE, "Sudeste" para SP e "Sul" para PR.
4. Qual o faturamento (soma de quantidade × preço unitário) de cada produto? Mostre só os acima de R$ 100.
5. Explique o resultado de `SELECT COUNT(*), COUNT(cidade), COUNT(DISTINCT cidade) FROM clientes;`.

## Tema 2: Joins, subqueries e CTEs

**Objetivo:** combinar tabelas sem duplicar nem perder linhas.

### 2.1 INNER e LEFT JOIN

```sql
-- INNER: só o que tem correspondência dos dois lados
SELECT p.id, c.nome, p.status
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id;

-- LEFT: todos da esquerda, com ou sem correspondência
SELECT c.nome, COUNT(p.id) AS qtd_pedidos
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
GROUP BY c.nome
ORDER BY qtd_pedidos DESC;     -- Elisa aparece com 0
```

Clientes **sem** pedido (anti-join):

```sql
SELECT c.nome
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.id IS NULL;
```

> **Cuidado! Cai na entrevista:** filtrar a tabela da direita no `WHERE` depois de um `LEFT JOIN` (ex.: `WHERE p.status = 'PAGO'`) transforma o LEFT em INNER, porque as linhas sem pedido têm `status` nulo e são eliminadas. Coloque o filtro no `ON`.

### 2.2 Joins que duplicam linhas

Juntar uma tabela "1" com uma tabela "N" **multiplica** as linhas do lado "1". Somar uma coluna do lado "1" depois disso gera valores inflados.

```sql
-- ERRADO: o frete (se existisse em pedidos) seria somado uma vez por item
SELECT SUM(p.frete) FROM pedidos p JOIN itens i ON i.pedido_id = p.id;
```

Sempre pergunte: **qual a granularidade** (o que uma linha representa) antes e depois do join? Uma linha de `pedidos` é um pedido; uma linha de `itens` é um produto dentro de um pedido.

### 2.3 Subqueries

```sql
-- produtos mais caros que a média
SELECT nome, preco FROM produtos
WHERE preco > (SELECT AVG(preco) FROM produtos);

-- clientes que já compraram Eletro
SELECT nome FROM clientes
WHERE id IN (
  SELECT p.cliente_id FROM pedidos p
  JOIN itens i ON i.pedido_id = p.id
  JOIN produtos pr ON pr.id = i.produto_id
  WHERE pr.categoria = 'Eletro'
);
```

Cuidado com `NOT IN` quando a subquery pode retornar `NULL`: o resultado fica vazio. Prefira `NOT EXISTS`.

### 2.4 CTEs (WITH)

CTEs dão nome a etapas da query. Ficam muito mais legíveis que subqueries aninhadas.

```sql
WITH total_pedido AS (
  SELECT pedido_id, SUM(quantidade * preco_unitario) AS total
  FROM itens
  GROUP BY pedido_id
),
pedidos_pagos AS (
  SELECT p.id, p.cliente_id, t.total
  FROM pedidos p
  JOIN total_pedido t ON t.pedido_id = p.id
  WHERE p.status = 'PAGO'
)
SELECT c.nome, SUM(pp.total) AS gasto, COUNT(*) AS pedidos, ROUND(AVG(pp.total), 2) AS ticket_medio
FROM pedidos_pagos pp
JOIN clientes c ON c.id = pp.cliente_id
GROUP BY c.nome
ORDER BY gasto DESC;
```

### 2.5 UNION

Empilha resultados com as mesmas colunas. `UNION` remove duplicados (mais caro); `UNION ALL` mantém tudo (use quando não houver duplicados ou quando quiser mantê-los).

### 2.6 Granularidade

Antes de escrever qualquer query de análise, responda: **"uma linha do resultado representa o quê?"** (um cliente? um cliente por mês? um pedido?). Esse hábito evita a maior parte dos erros de número em dashboards.

### Atividades de fixação do Tema 2

1. Liste cada pedido com o nome do cliente e o valor total do pedido.
2. Quais clientes nunca fizeram um pedido pago? (Inclua quem nunca fez pedido nenhum.)
3. Faturamento pago por categoria de produto.
4. Usando CTE, encontre o cliente com maior gasto em pedidos pagos.
5. Por que `SELECT COUNT(*) FROM pedidos p JOIN itens i ON i.pedido_id = p.id WHERE p.status = 'PAGO'` não responde "quantos pedidos pagos existem"? Corrija.

## Tema 3: Window functions e performance

**Objetivo:** fazer cálculos "olhando para outras linhas" sem perder o detalhe, e escrever queries rápidas.

### 3.1 O que é uma window function

`GROUP BY` **colapsa** as linhas. Window function calcula sobre um grupo de linhas (a "janela") e **mantém** cada linha.

```sql
SELECT pedido_id, produto_id, quantidade * preco_unitario AS valor,
       SUM(quantidade * preco_unitario) OVER (PARTITION BY pedido_id) AS total_do_pedido
FROM itens;
```

`PARTITION BY` define os grupos; `ORDER BY` dentro do `OVER` define a ordem para cálculos sequenciais.

### 3.2 ROW_NUMBER e RANK

```sql
-- produto mais caro de cada categoria
WITH ranking AS (
  SELECT nome, categoria, preco,
         ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY preco DESC) AS pos
  FROM produtos
)
SELECT * FROM ranking WHERE pos = 1;
```

| Função | Empates (100, 100, 90) |
|---|---|
| `ROW_NUMBER()` | 1, 2, 3 (desempata arbitrariamente) |
| `RANK()` | 1, 1, 3 (pula) |
| `DENSE_RANK()` | 1, 1, 2 (não pula) |

O padrão "pegar a última linha de cada grupo" com `ROW_NUMBER` também serve para **remover duplicados**, mantendo o registro mais recente.

### 3.3 LAG e LEAD

Acessam a linha anterior ou seguinte.

```sql
-- dias entre um pedido e o anterior do mesmo cliente
SELECT cliente_id, id, data,
       data - LAG(data) OVER (PARTITION BY cliente_id ORDER BY data) AS dias_desde_anterior
FROM pedidos;
```

### 3.4 Totais acumulados e médias móveis

```sql
WITH diario AS (
  SELECT p.data, SUM(i.quantidade * i.preco_unitario) AS faturamento
  FROM pedidos p JOIN itens i ON i.pedido_id = p.id
  WHERE p.status = 'PAGO'
  GROUP BY p.data
)
SELECT data, faturamento,
       SUM(faturamento) OVER (ORDER BY data) AS acumulado,
       AVG(faturamento) OVER (ORDER BY data ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS media_movel_3
FROM diario
ORDER BY data;
```

> **Cuidado! Cai na entrevista:** window functions são **o** tema mais cobrado em testes de SQL para dados. Pratique: top N por grupo, diferença para o período anterior, acumulado, percentual do total (`valor / SUM(valor) OVER ()`) e deduplicação.

### 3.5 EXPLAIN

```sql
EXPLAIN ANALYZE
SELECT * FROM pedidos WHERE cliente_id = 1;
```

Mostra o plano: `Seq Scan` (lê a tabela toda), `Index Scan` (usa índice), tipo de join, linhas estimadas vs reais, tempo.

### 3.6 Índices e particionamento

- **Índices** (bancos transacionais como PostgreSQL): aceleram filtros e joins em colunas específicas. `CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);`
- **Particionamento** (comum em warehouses): divide a tabela, geralmente por **data**. Uma consulta com filtro na coluna de partição lê só as partições necessárias.
- **Clustering** (BigQuery, Snowflake): ordena os dados dentro das partições por colunas muito filtradas.

Boas práticas em warehouses pagos por dados lidos:

- Nunca `SELECT *` em tabela grande: selecione só as colunas necessárias (armazenamento colunar).
- Sempre filtre pela coluna de partição.
- Filtre antes de juntar; agregue antes de juntar quando possível.

### Atividades de fixação do Tema 3

1. Para cada cliente, numere os pedidos em ordem de data (1º pedido, 2º pedido...).
2. Mostre o produto mais vendido (em quantidade) de cada categoria.
3. Para cada pedido pago, mostre o valor e o percentual que ele representa do faturamento pago total.
4. Faturamento pago por mês e a variação percentual em relação ao mês anterior.
5. Uma tabela de eventos tem duplicados (mesmo `evento_id` com `recebido_em` diferentes). Escreva a query que mantém só o registro mais recente de cada `evento_id`.

## Tema 4: Modelagem de dados

**Objetivo:** organizar tabelas para que as análises fiquem simples, corretas e rápidas.

### 4.1 OLTP vs OLAP

| | OLTP (transacional) | OLAP (analítico) |
|---|---|---|
| Para quê | Rodar o sistema (cadastrar pedido) | Analisar (faturamento por mês) |
| Operações | Muitas escritas pequenas | Leituras grandes, agregações |
| Modelo | Normalizado | Dimensional (desnormalizado) |
| Exemplos | PostgreSQL, MySQL do app | BigQuery, Snowflake, Redshift |

Analisar direto no banco de produção pesa o sistema e as queries ficam complexas. Por isso os dados são copiados e remodelados num **data warehouse**.

### 4.2 Normalização

Evita redundância e inconsistência (bom para OLTP). As três primeiras formas normais, em resumo: cada coluna guarda um valor atômico (1FN); toda coluna depende da chave inteira (2FN); nenhuma coluna depende de outra coluna que não é chave (3FN).

### 4.3 Fatos e dimensões

Modelagem dimensional (Kimball):

- **Fato:** o **evento** que se mede, com números (métricas). Ex.: uma venda: quantidade, valor, desconto.
- **Dimensão:** o **contexto** do evento, usado para filtrar e agrupar. Ex.: cliente, produto, data, loja.

Perguntas de negócio têm a forma "**métrica** por **dimensão**": faturamento (fato) por categoria e mês (dimensões).

### 4.4 Star schema

```
              dim_data
                 |
dim_cliente --- fato_vendas --- dim_produto
                 |
              dim_loja
```

```sql
CREATE TABLE dim_produto (
  produto_sk  INT PRIMARY KEY,      -- surrogate key (chave substituta)
  produto_id  INT,                  -- chave natural do sistema de origem
  nome TEXT, categoria TEXT
);
CREATE TABLE dim_data (
  data_sk INT PRIMARY KEY,          -- ex.: 20250315
  data DATE, ano INT, mes INT, nome_mes TEXT, dia_semana TEXT, eh_fim_de_semana BOOLEAN
);
CREATE TABLE fato_vendas (
  data_sk INT REFERENCES dim_data, cliente_sk INT, produto_sk INT REFERENCES dim_produto,
  pedido_id INT, quantidade INT, valor NUMERIC(12,2)
);

-- a análise vira um padrão simples
SELECT d.ano, d.mes, p.categoria, SUM(f.valor) AS faturamento
FROM fato_vendas f
JOIN dim_data d    ON d.data_sk = f.data_sk
JOIN dim_produto p ON p.produto_sk = f.produto_sk
GROUP BY d.ano, d.mes, p.categoria;
```

Dimensões são **desnormalizadas** de propósito (categoria repetida em cada produto): menos joins, queries mais simples. O **snowflake schema** normaliza as dimensões (categoria numa tabela própria); é menos usado em analytics moderno.

### 4.5 Slowly Changing Dimensions (SCD)

Atributos de dimensão mudam com o tempo (o cliente muda de cidade). O que fazer com o histórico?

| Tipo | Como | Efeito |
|---|---|---|
| **SCD 1** | Sobrescreve | Histórico perdido: vendas antigas aparecem na cidade nova |
| **SCD 2** | Nova linha com `valido_de`, `valido_ate`, `atual` | Histórico preservado: cada venda liga à versão vigente na época |
| SCD 3 | Coluna "valor anterior" | Guarda só a mudança mais recente |

```
cliente_sk | cliente_id | cidade    | valido_de  | valido_ate | atual
1          | 1          | Recife    | 2025-01-10 | 2025-06-30 | false
7          | 1          | Fortaleza | 2025-07-01 | 9999-12-31 | true
```

### 4.6 Granularidade da fato

A decisão mais importante do modelo: **o que uma linha da fato representa?** "Um item de pedido" é mais detalhado (e mais flexível) que "um pedido" ou "vendas por dia". Regra de Kimball: comece pelo grão **mais atômico** disponível; agregados podem ser criados depois.

> **Cuidado! Cai na entrevista:** "Modele o data warehouse de um e-commerce." Comece declarando o **processo de negócio** (vendas), depois o **grão** (um item de pedido), as **dimensões** (data, cliente, produto, loja/canal) e os **fatos** (quantidade, valor, desconto). Mencione SCD 2 para cliente.

### Atividades de fixação do Tema 4

1. Classifique como OLTP ou OLAP: (a) registrar um PIX; (b) relatório de inadimplência por região nos últimos 12 meses; (c) atualizar o estoque após uma venda; (d) dashboard de vendas da diretoria.
2. Monte o star schema (tabelas, colunas e grão) para um app de delivery: pedidos, restaurantes, clientes, entregadores.
3. Escreva a query da dimensão `dim_data` gerando todas as datas de 2025 com ano, mês, dia da semana e fim de semana (dica: `generate_series` no PostgreSQL).
4. O cliente Ana mudou de Recife para Fortaleza em julho. Com SCD 1 e com SCD 2, em qual cidade aparecem as vendas dela de março no relatório? Quando cada tipo é adequado?
5. Por que dimensões desnormalizadas são aceitáveis no warehouse, se normalizar é "o certo" no banco transacional?

## Projeto da etapa

**Análise SQL do e-commerce brasileiro (Olist):**

1. Baixe a base pública "Brazilian E-Commerce Public Dataset by Olist" no Kaggle e carregue no PostgreSQL (Docker).
2. Responda com SQL, salvando cada query num arquivo `.sql`: faturamento mensal e crescimento mês a mês; top 10 categorias por faturamento; ticket médio por estado; tempo médio de entrega por estado vs prazo prometido; % de pedidos atrasados por vendedor (com window functions); clientes que compraram mais de uma vez.
3. Desenhe um star schema para essa base (grão: item de pedido) e crie as tabelas com `CREATE TABLE AS SELECT`.
4. README com as perguntas, as respostas e os principais achados.

## Resumão

- Ordem lógica: FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.
- `IS NULL`, nunca `= NULL`; agregações ignoram NULL.
- Filtro da tabela da direita de um LEFT JOIN vai no `ON`.
- Sempre saiba a granularidade antes e depois de cada join.
- CTEs deixam queries legíveis; window functions calculam sem colapsar linhas.
- Warehouse: selecione só as colunas necessárias e filtre pela partição.
- Modelo dimensional: fato (evento e métricas) + dimensões (contexto). Defina o grão primeiro. SCD 2 preserva histórico.
