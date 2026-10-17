# Gabarito: Engenharia de Dados

Abra só depois de tentar.

## Tema 1

1. (a) Batch; (b) streaming (decisão em segundos, durante a compra); (c) streaming ou micro-batch de poucos segundos; (d) batch.
2. No ETL, os dados são transformados antes de chegar ao destino, num servidor intermediário. No ELT, os dados brutos são carregados no warehouse e transformados lá dentro, com SQL. O ELT ficou popular porque warehouses em nuvem têm processamento escalável e armazenamento barato; guardar o bruto permite reprocessar quando a regra muda; e transformar em SQL (com dbt) aproxima analistas e engenheiros.
3. Use a **data lógica** como parâmetro e substitua a partição:
   ```sql
   BEGIN;
   DELETE FROM resumo_diario WHERE data = :data_logica;
   INSERT INTO resumo_diario (data, total)
   SELECT :data_logica, SUM(valor) FROM vendas WHERE data = :data_logica;
   COMMIT;
   ```
   Ou `INSERT ... ON CONFLICT (data) DO UPDATE` com a data como chave. `current_date` impede reprocessar dias passados.
4. (1) Registros **apagados** na origem não aparecem. (2) Linhas atualizadas sem mudar o `atualizado_em` (bug ou atualização em massa direto no banco) são perdidas. (3) Diferença de **relógio/fuso** entre servidores pode pular registros na fronteira da janela; transações longas podem gravar com horário anterior à última carga (commit atrasado). Mitigações: CDC pelo log do banco; janela com sobreposição (reler os últimos minutos) e upsert; cargas full periódicas de reconciliação.
5. Prática. Crie a tabela antes:
   ```sql
   CREATE TABLE cotacoes (data DATE, moeda TEXT, valor NUMERIC(10,4), PRIMARY KEY (data, moeda));
   ```
   Rodando duas vezes, `SELECT COUNT(*) FROM cotacoes WHERE data = ...` continua 1, graças à chave primária + `ON CONFLICT`.

## Tema 2

1. Prática. Com o compose oficial: baixe o `docker-compose.yaml` da documentação do Airflow, rode `docker compose up airflow-init` e depois `docker compose up`; a interface fica em `localhost:8080`.
2. Use o DAG da seção 2.2. Ponto principal: a data vem de `ds`, não de `date.today()`.
3. Não duplica, porque cada execução usa sua data lógica e a carga faz upsert. Se tivesse duplicado, a carga não era idempotente. (Dias sem cotação, como fins de semana, simplesmente não carregam nada; em DAGs com `schedule` em dias úteis, eles nem são executados.)
4. O XCom guarda os valores no **banco de metadados** do Airflow, feito para pequenas informações: 5 GB pesariam o banco e a memória do worker. E processar 5 GB dentro do worker do Airflow compete com as outras tasks. O certo: a task grava/processa o arquivo num armazenamento (S3, GCS, warehouse) ou dispara um processamento externo (Spark, warehouse, container), e passa por XCom só o **caminho** ou o identificador.
5. ```python
   @task
   def validar(bruto: list[dict]) -> list[dict]:
       for linha in bruto:
           valor = float(linha["valor"])
           if not 3.0 <= valor <= 10.0:
               raise ValueError(f"cotação fora da faixa esperada: {linha}")
       return bruto

   carregar(validar(extrair()))
   ```
   A faixa é uma regra de negócio que deve ser revista com o tempo; uma alternativa mais robusta é comparar com a variação em relação ao dia anterior.

## Tema 3

1. Exemplo: `df.filter(status == 'PAGO').select('valor').groupBy(...)...` só monta um plano. Quando a ação `write` é chamada, o Spark olha o plano todo e percebe que só precisa das colunas `status`, `valor` e da chave de agrupamento, e que pode aplicar o filtro **durante a leitura** do Parquet (predicate pushdown), pulando blocos inteiros. Se cada passo executasse na hora, ele leria todas as colunas e linhas antes de filtrar.
2. ```python
   viagens = spark.read.parquet("yellow_tripdata_2024-01.parquet")
   por_dia = (viagens
       .withColumn("dia", F.to_date("tpep_pickup_datetime"))
       .groupBy("dia")
       .agg(F.count("*").alias("viagens"), F.sum("total_amount").alias("receita"))
       .orderBy("dia"))
   gorjeta = viagens.groupBy("payment_type").agg(F.avg("tip_amount").alias("gorjeta_media"))
   ```
   Observações esperadas: gorjeta média bem maior em cartão (`payment_type = 1`) do que em dinheiro (`2`), porque gorjetas em dinheiro geralmente não são registradas. Também aparecem algumas datas fora do mês (dados sujos) que devem ser filtradas.
3. Os dois `groupBy` (agregação por chave exige reunir os dados de cada chave) e o `orderBy` (ordenação global). `withColumn` e leituras não causam shuffle.
4. Use **broadcast join**: a tabela de 50 MB é copiada para todos os executores e os 2 TB não precisam ser redistribuídos pela rede. O Spark costuma fazer isso automaticamente abaixo de um limite configurável (`spark.sql.autoBroadcastJoinThreshold`), mas o `broadcast()` explícito garante. Além disso, filtre e selecione só as colunas necessárias da tabela grande antes do join.
5. ```python
   por_dia.write.mode("overwrite").partitionBy("dia").parquet("saida/viagens_por_dia/")
   ```
   Cria pastas `dia=2024-01-01/`, `dia=2024-01-02/`... Uma consulta com `WHERE dia = '2024-01-15'` lê **só** a pasta desse dia (partition pruning), em vez de todos os arquivos. (Para uma tabela pequena como esta, particionar gera muitos arquivos minúsculos; o ganho real aparece ao particionar a tabela **detalhada** de viagens.)

## Tema 4

1. Prática. Coloque os CSVs em `seeds/` e rode `dbt seed`, ou carregue no DuckDB e declare como `sources`. Staging: um model por tabela, renomeando colunas e ajustando tipos.
2. ```sql
   -- models/marts/dim_clientes.sql
   select cliente_id, nome, coalesce(cidade, 'Não informada') as cidade, uf
   from {{ ref('stg_clientes') }}
   ```
   `fato_vendas` como na seção 4.2, com `where status = 'PAGO'`.
3. ```yaml
   - name: stg_pedidos
     columns:
       - name: pedido_id
         tests: [unique, not_null]
       - name: status
         tests:
           - accepted_values:
               values: ['PAGO', 'CANCELADO', 'PENDENTE']
   ```
   Para forçar a falha, insira um pedido com status `'ESTORNADO'` na fonte e rode `dbt build`: o teste falha e os models que dependem dele são pulados.
4. Com o filtro `data_pedido > max(data_pedido)`, um pedido **antigo** que mudou de status (ex.: de PENDENTE para PAGO) **não é reprocessado**: a fato fica desatualizada. Soluções: filtrar por uma coluna de **atualização** (`atualizado_em`) em vez da data do pedido; usar uma **janela de reprocessamento** (ex.: os últimos 7 dias) com `unique_key` para fazer merge; e rodar um `--full-refresh` periódico.
5. Resposta pessoal. O grafo deve mostrar: sources/seeds (`raw.*`) → `stg_*` → `dim_*` e `fato_vendas`. Clicar num model mostra o que vem antes (upstream) e o que depende dele (downstream).

## Projeto da etapa

O que um avaliador olharia:

- Reexecutar qualquer dia não duplica nada (idempotência comprovada no README).
- Backfill funcionando com a data lógica.
- `dbt build` com testes passando; um teste de negócio além de unique/not_null.
- Desenho da arquitetura e explicação de cada camada.
- Segredos fora do código e `docker compose up` funcionando de primeira.
