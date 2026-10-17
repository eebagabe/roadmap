# Gabarito — SQL e Modelagem

Abra só depois de tentar. Os resultados indicados usam os dados de exemplo da apostila.

## Tema 1

1. ```sql
   SELECT nome, preco FROM produtos WHERE categoria = 'Mercearia' ORDER BY preco DESC;
   -- Café 500g 25.00 | Filtro 8.00
   ```
2. ```sql
   SELECT status, COUNT(*) FROM pedidos GROUP BY status;
   -- PAGO 4 | CANCELADO 1 | PENDENTE 1
   ```
3. ```sql
   SELECT nome,
          COALESCE(cidade, 'Não informada') AS cidade,
          CASE uf WHEN 'PE' THEN 'Nordeste' WHEN 'SP' THEN 'Sudeste' WHEN 'PR' THEN 'Sul' END AS regiao
   FROM clientes;
   ```
4. ```sql
   SELECT pr.nome, SUM(i.quantidade * i.preco_unitario) AS faturamento
   FROM itens i JOIN produtos pr ON pr.id = i.produto_id
   GROUP BY pr.nome
   HAVING SUM(i.quantidade * i.preco_unitario) > 100
   ORDER BY faturamento DESC;
   -- Cafeteira 580.00 | Café 500g 150.00 | Caneca 120.00
   ```
   (Considera todos os pedidos, inclusive cancelado e pendente, porque o enunciado não filtrou status. Na vida real, pergunte qual status conta como faturamento.)
5. `5, 4, 3`. `COUNT(*)` conta linhas (5 clientes); `COUNT(cidade)` ignora a cidade nula da Elisa (4); `COUNT(DISTINCT cidade)` conta cidades diferentes não nulas: Recife, São Paulo, Curitiba (3).

## Tema 2

1. ```sql
   SELECT p.id, c.nome, p.status, SUM(i.quantidade * i.preco_unitario) AS total
   FROM pedidos p
   JOIN clientes c ON c.id = p.cliente_id
   JOIN itens i ON i.pedido_id = p.id
   GROUP BY p.id, c.nome, p.status
   ORDER BY p.id;
   ```
2. ```sql
   SELECT c.nome
   FROM clientes c
   LEFT JOIN pedidos p ON p.cliente_id = c.id AND p.status = 'PAGO'
   WHERE p.id IS NULL;
   -- Diego (só pendente) e Elisa (nenhum pedido)
   ```
   Alternativa: `WHERE NOT EXISTS (SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id AND p.status = 'PAGO')`.
3. ```sql
   SELECT pr.categoria, SUM(i.quantidade * i.preco_unitario) AS faturamento
   FROM pedidos p
   JOIN itens i ON i.pedido_id = p.id
   JOIN produtos pr ON pr.id = i.produto_id
   WHERE p.status = 'PAGO'
   GROUP BY pr.categoria
   ORDER BY faturamento DESC;
   -- Eletro 580.00 | Mercearia 158.00 | Casa 40.00
   ```
4. ```sql
   WITH gasto AS (
     SELECT p.cliente_id, SUM(i.quantidade * i.preco_unitario) AS total
     FROM pedidos p JOIN itens i ON i.pedido_id = p.id
     WHERE p.status = 'PAGO'
     GROUP BY p.cliente_id
   )
   SELECT c.nome, g.total
   FROM gasto g JOIN clientes c ON c.id = g.cliente_id
   ORDER BY g.total DESC
   LIMIT 1;
   -- Bruno 375.00 (Ana tem 338.00)
   ```
   Para empates, use `RANK()` ou `FETCH FIRST 1 ROWS WITH TIES`.
5. O join com `itens` multiplica as linhas: um pedido com 2 itens conta 2 vezes. O resultado (7) é o número de **itens** de pedidos pagos. Correções: `SELECT COUNT(*) FROM pedidos WHERE status = 'PAGO'` (4), ou, se precisar do join, `COUNT(DISTINCT p.id)`.

## Tema 3

1. ```sql
   SELECT cliente_id, id, data,
          ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data) AS n_pedido
   FROM pedidos;
   ```
2. ```sql
   WITH vendas AS (
     SELECT pr.categoria, pr.nome, SUM(i.quantidade) AS qtd
     FROM itens i JOIN produtos pr ON pr.id = i.produto_id
     GROUP BY pr.categoria, pr.nome
   ),
   ranking AS (
     SELECT *, RANK() OVER (PARTITION BY categoria ORDER BY qtd DESC) AS pos FROM vendas
   )
   SELECT categoria, nome, qtd FROM ranking WHERE pos = 1;
   -- Casa: Caneca 3 | Eletro: Cafeteira 2 | Mercearia: Café 500g 6
   ```
   (Café 500g: 2 + 1 + 3 = 6; Filtro: 1 + 5 = 6. É um **empate** na Mercearia, e o `RANK` mostra os dois. Com `ROW_NUMBER`, um deles seria escolhido arbitrariamente; por isso a escolha da função importa.)
3. ```sql
   WITH totais AS (
     SELECT p.id, SUM(i.quantidade * i.preco_unitario) AS total
     FROM pedidos p JOIN itens i ON i.pedido_id = p.id
     WHERE p.status = 'PAGO'
     GROUP BY p.id
   )
   SELECT id, total, ROUND(100 * total / SUM(total) OVER (), 2) AS pct_do_total
   FROM totais
   ORDER BY total DESC;
   -- total pago = 778.00; ex.: pedido 105 = 375.00 (48,20%)
   ```
4. ```sql
   WITH mensal AS (
     SELECT DATE_TRUNC('month', p.data)::date AS mes, SUM(i.quantidade * i.preco_unitario) AS faturamento
     FROM pedidos p JOIN itens i ON i.pedido_id = p.id
     WHERE p.status = 'PAGO'
     GROUP BY 1
   )
   SELECT mes, faturamento,
          ROUND(100.0 * (faturamento - LAG(faturamento) OVER (ORDER BY mes))
                / NULLIF(LAG(faturamento) OVER (ORDER BY mes), 0), 2) AS variacao_pct
   FROM mensal
   ORDER BY mes;
   -- março 338.00 | abril 440.00 (+30,18%)
   ```
   `NULLIF(..., 0)` evita divisão por zero.
5. ```sql
   WITH ordenado AS (
     SELECT *, ROW_NUMBER() OVER (PARTITION BY evento_id ORDER BY recebido_em DESC) AS rn
     FROM eventos
   )
   SELECT * FROM ordenado WHERE rn = 1;
   ```
   No BigQuery e no Snowflake existe o atalho `QUALIFY ROW_NUMBER() OVER (...) = 1`.

## Tema 4

1. (a) OLTP; (b) OLAP; (c) OLTP; (d) OLAP.
2. Processo: entregas de pedidos. **Grão:** um pedido (ou um item de pedido, se quiser analisar produtos). **Fato** `fato_pedidos`: `data_sk`, `hora`, `cliente_sk`, `restaurante_sk`, `entregador_sk`, `regiao_sk`, `valor_itens`, `taxa_entrega`, `desconto`, `gorjeta`, `tempo_preparo_min`, `tempo_entrega_min`, `distancia_km`, `foi_cancelado`. **Dimensões:** `dim_data`, `dim_cliente` (SCD 2 para endereço/bairro), `dim_restaurante` (categoria, faixa de preço, bairro), `dim_entregador` (modal: moto/bike), `dim_regiao`.
3. ```sql
   SELECT TO_CHAR(d, 'YYYYMMDD')::int AS data_sk,
          d::date                     AS data,
          EXTRACT(YEAR FROM d)::int   AS ano,
          EXTRACT(MONTH FROM d)::int  AS mes,
          EXTRACT(ISODOW FROM d)::int AS dia_semana,     -- 1 = segunda ... 7 = domingo
          EXTRACT(ISODOW FROM d) IN (6, 7) AS eh_fim_de_semana
   FROM generate_series('2025-01-01'::date, '2025-12-31'::date, interval '1 day') AS d;
   ```
4. **SCD 1:** as vendas de março aparecem em **Fortaleza** (a cidade foi sobrescrita; o histórico se perdeu). **SCD 2:** aparecem em **Recife**, porque a venda de março está ligada à versão do cliente vigente em março. SCD 1 é adequado para correções e atributos cujo histórico não importa (erro de digitação no nome). SCD 2 é adequado quando a análise histórica depende do valor da época (região de vendas, segmento do cliente, plano contratado).
5. No warehouse, o padrão é **muita leitura** e pouca escrita (cargas em lote controladas pelo pipeline). Desnormalizar reduz joins, simplifica as queries para analistas e ferramentas de BI e costuma ser mais rápido em bancos colunares. Os riscos da redundância (inconsistência em atualizações) são controlados porque só o pipeline escreve nessas tabelas.

## Projeto da etapa

O que um avaliador olharia:

- Cada query com a granularidade correta (nada de valores duplicados por join).
- Uso de CTEs com nomes claros e window functions onde fazem sentido.
- Star schema com o grão declarado no README.
- Achados de negócio escritos em português claro, não só tabelas de números.
