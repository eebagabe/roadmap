# Engenharia de Dados — Apostila Prática

Roadmap Analista e Engenheiro de Dados · Semanas 11 a 14

## Comece por aqui

O Engenheiro de Dados constrói os **pipelines**: os "encanamentos" que buscam dados nos sistemas de origem, limpam, transformam e entregam prontos para análise, dashboards e modelos de machine learning. Se o pipeline falha, o dashboard da diretoria amanhece errado. Por isso o foco aqui é **confiabilidade**.

### Por que isso vale ouro no mercado

- Engenharia de Dados é uma das áreas com melhores salários e mais vagas em tecnologia.
- Airflow, Spark e dbt aparecem na maioria das vagas.
- IA e machine learning dependem de dados bem tratados: sem engenharia de dados, não há IA confiável.

### Como esta apostila funciona

1. Tudo roda localmente com **Docker** e **Python**.
2. Você vai evoluir o coletor de cotações da etapa de Fundamentos até virar um pipeline orquestrado.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** pipeline falhou? Pergunte em ordem: os dados de **entrada** chegaram? Mudou o **formato** da origem? Qual **etapa** falhou (log)? Rodando a etapa sozinha, com os mesmos dados, o erro se repete?

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 11 | Tema 1 — Pipelines, ETL e ELT |
| 12 | Tema 2 — Orquestração com Airflow |
| 13 | Tema 3 — Processamento com Spark |
| 14 | Tema 4 — Transformação com dbt + projeto |

## Tema 1 — Pipelines, ETL e ELT

**Objetivo:** desenhar pipelines que podem ser rodados de novo sem estragar nada.

### 1.1 ETL vs ELT

- **ETL** (Extract, Transform, Load): extrai, transforma **fora** do destino, carrega pronto. Comum quando o destino era caro ou limitado.
- **ELT** (Extract, Load, Transform): extrai, carrega **bruto** no warehouse e transforma **lá dentro** com SQL. Padrão moderno, porque warehouses na nuvem são poderosos e guardar o bruto permite reprocessar.

```
ELT moderno:
Origens (bancos, APIs, arquivos) → [ingestão] → camada bruta (raw/bronze)
     → [transformação SQL/dbt] → camadas limpas e modeladas (silver/gold) → BI, ML
```

### 1.2 Batch vs streaming

| | Batch | Streaming |
|---|---|---|
| Quando | Em lotes (de hora em hora, diário) | Contínuo, evento a evento |
| Latência | Minutos a horas | Segundos |
| Complexidade | Menor | Maior |
| Exemplos | Relatório diário de vendas | Detecção de fraude, painel ao vivo |

Regra prática: use **batch** a menos que o negócio realmente precise de dados em segundos.

### 1.3 Carga full vs incremental

- **Full:** apaga e recarrega tudo. Simples, mas cara para tabelas grandes.
- **Incremental:** carrega só o que mudou desde a última execução, usando uma coluna de controle (`atualizado_em`, ID crescente) ou **CDC** (captura de mudanças do log do banco).

```sql
-- incremental com "marca d'água"
SELECT * FROM pedidos
WHERE atualizado_em > :ultima_carga
  AND atualizado_em <= :inicio_desta_execucao;
```

Cuidado com registros **apagados** na origem (a carga incremental por data não os enxerga) e com relógios e fusos diferentes.

### 1.4 Idempotência

Um pipeline é **idempotente** se rodar a mesma execução várias vezes dá o mesmo resultado. Isso é essencial porque pipelines **vão** falhar no meio e precisar ser re-executados.

```sql
-- NÃO idempotente: rodar duas vezes duplica
INSERT INTO vendas_diarias SELECT ... WHERE data = '2025-03-15';

-- Idempotente: substitui a partição do dia
DELETE FROM vendas_diarias WHERE data = '2025-03-15';
INSERT INTO vendas_diarias SELECT ... WHERE data = '2025-03-15';
-- (numa transação; ou MERGE/upsert pela chave)
```

```sql
-- upsert no PostgreSQL
INSERT INTO cotacoes (data, moeda, valor)
VALUES ('2025-03-14', 'USD', 5.78)
ON CONFLICT (data, moeda) DO UPDATE SET valor = EXCLUDED.valor;
```

> **Cuidado! Cai na entrevista:** "O pipeline falhou ontem no meio. Como você reprocessa?" Se ele for **idempotente** e **particionado por data**, basta rodar de novo para aquela data: sobrescreve a partição, sem duplicar. Pipelines que usam `now()` em vez da **data lógica da execução** não conseguem reprocessar o passado corretamente.

### 1.5 Qualidade de dados

Dimensões de qualidade: **completude** (nulos), **unicidade** (duplicados), **validade** (formato, faixa), **consistência** (bate com outras fontes), **atualidade** (chegou no horário).

Verificações no pipeline:

```python
def validar(df):
    assert len(df) > 0, "nenhuma linha recebida"
    assert df["pedido_id"].is_unique, "pedido_id duplicado"
    assert df["valor"].ge(0).all(), "valor negativo"
    assert df["data"].notna().all(), "data nula"
```

Ferramentas: testes do **dbt**, **Great Expectations**, **Soda**. A regra: dado ruim deve **parar** o pipeline (ou ir para quarentena) antes de chegar no dashboard.

### 1.6 Python para pipelines

Estrutura de um pipeline simples e bem feito:

```python
import logging
from datetime import date
import pandas as pd
import requests
from sqlalchemy import create_engine, text

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("cotacoes")


def extrair(dia: date) -> list[dict]:
    url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados"
    params = {"formato": "json", "dataInicial": dia.strftime("%d/%m/%Y"), "dataFinal": dia.strftime("%d/%m/%Y")}
    resp = requests.get(url, params=params, timeout=30)
    if resp.status_code == 404:          # a API responde 404 quando não há valor (fim de semana, feriado)
        return []
    resp.raise_for_status()
    return resp.json()


def transformar(bruto: list[dict]) -> pd.DataFrame:
    df = pd.DataFrame(bruto)
    if df.empty:
        return df
    df["data"] = pd.to_datetime(df["data"], dayfirst=True).dt.date
    df["valor"] = df["valor"].astype(float)
    df["moeda"] = "USD"
    return df[["data", "moeda", "valor"]]


def carregar(df: pd.DataFrame, engine) -> None:
    with engine.begin() as conn:                       # transação
        for linha in df.to_dict("records"):
            conn.execute(text("""
                INSERT INTO cotacoes (data, moeda, valor) VALUES (:data, :moeda, :valor)
                ON CONFLICT (data, moeda) DO UPDATE SET valor = EXCLUDED.valor
            """), linha)


def executar(dia: date, engine) -> None:
    log.info("iniciando %s", dia)
    df = transformar(extrair(dia))
    if df.empty:
        log.info("sem cotação em %s (fim de semana ou feriado)", dia)
        return
    carregar(df, engine)
    log.info("carregadas %d linhas", len(df))
```

Boas práticas: funções separadas por etapa (fáceis de testar), parâmetro de **data lógica**, logs, transação na carga, upsert, configuração por variável de ambiente.

### Atividades de fixação — Tema 1

1. Para cada caso, batch ou streaming? (a) relatório mensal de comissões; (b) bloqueio de cartão em compra suspeita; (c) atualização do estoque no site a cada venda; (d) dashboard diário de marketing.
2. Explique a diferença entre ETL e ELT e por que o ELT ficou popular.
3. Transforme este passo em idempotente: `INSERT INTO resumo_diario SELECT current_date, SUM(valor) FROM vendas WHERE data = current_date`.
4. Quais problemas uma carga incremental por `atualizado_em` pode ter? Cite 3.
5. Implemente o pipeline de cotações acima com PostgreSQL no Docker e rode duas vezes para o mesmo dia. Confirme que não duplicou.

## Tema 2 — Orquestração com Airflow

**Objetivo:** agendar, encadear e monitorar pipelines.

### 2.1 O que é orquestração

Um pipeline real tem várias etapas com **dependências** (só transforma depois de extrair), precisa rodar em **horários**, tentar de novo quando falha, **avisar** quem é responsável e permitir **reprocessar** o passado. `cron` + scripts não dão conta disso. Um orquestrador dá.

Apache **Airflow** (criado no Airbnb) é o mais usado. Alternativas: Dagster, Prefect, e serviços gerenciados (Cloud Composer, MWAA, Astronomer).

### 2.2 DAGs

Um **DAG** (grafo acíclico dirigido) descreve as tarefas e a ordem entre elas, em Python.

```python
# dags/cotacoes.py
from datetime import datetime, timedelta
from airflow.decorators import dag, task

@dag(
    schedule="0 9 * * 1-5",                 # dias úteis às 9h
    start_date=datetime(2025, 1, 1),
    catchup=False,
    default_args={"retries": 3, "retry_delay": timedelta(minutes=5)},
    tags=["financeiro"],
)
def cotacoes():
    @task
    def extrair(ds=None) -> list[dict]:     # ds = data lógica da execução (YYYY-MM-DD)
        from pipeline import extrair as ext
        return ext(datetime.strptime(ds, "%Y-%m-%d").date())

    @task
    def carregar(bruto: list[dict]) -> int:
        from pipeline import transformar, carregar as car, criar_engine
        df = transformar(bruto)
        if not df.empty:
            car(df, criar_engine())
        return len(df)

    carregar(extrair())

cotacoes()
```

### 2.3 Operators e tasks

- **Task:** uma unidade de trabalho (um nó do DAG).
- **Operators:** modelos de task prontos: `PythonOperator` (ou `@task`), `BashOperator`, `SQLExecuteQueryOperator`, operadores de nuvem (BigQuery, S3, Databricks), `DockerOperator`, `KubernetesPodOperator`.
- **Sensors:** esperam uma condição (um arquivo chegar no S3, outro DAG terminar).
- **XCom:** passa **pequenos** valores entre tasks. Dados grandes vão para armazenamento (S3, tabela) e o XCom leva só o caminho.

> **Na prática:** o Airflow é um **orquestrador**, não uma ferramenta de processamento. Tarefas pesadas devem rodar **fora** dele (no warehouse, no Spark, num container); o Airflow só dispara e acompanha.

### 2.4 Agendamento

O Airflow trabalha com **intervalos de dados**. Uma execução diária com data lógica `2025-03-14` processa os dados **daquele dia** e normalmente roda logo depois que o intervalo termina. Use sempre a data lógica (`ds`, `data_interval_start`) nas queries, nunca `now()`.

### 2.5 Backfill

Reprocessar execuções passadas: um bug corrigido, uma nova tabela que precisa do histórico.

```bash
airflow dags backfill cotacoes --start-date 2025-01-01 --end-date 2025-03-31
```

Só funciona bem se as tasks forem **idempotentes** e usarem a **data lógica**. Por isso tudo do Tema 1 importa.

### 2.6 Retries e alertas

- `retries` e `retry_delay` (com backoff) para falhas temporárias (API fora do ar).
- `on_failure_callback` para avisar no Slack/Teams/e-mail.
- **SLAs/prazos:** alertar se o DAG não terminou até certo horário (o dashboard das 8h depende dele).
- Interface web: ver execuções, logs de cada task, reexecutar só a task que falhou.

### Atividades de fixação — Tema 2

1. Suba o Airflow localmente com o `docker-compose.yaml` oficial (ou com o Astro CLI) e explore a interface.
2. Transforme o pipeline de cotações num DAG diário com retries e use a data lógica.
3. Faça um backfill dos últimos 30 dias. Rode de novo. A tabela duplicou?
4. Por que não é boa ideia processar um arquivo de 5 GB dentro de uma task Python do Airflow e passar o resultado por XCom? O que fazer?
5. Adicione uma task de **validação** entre extrair e carregar, que falha se o valor da cotação estiver fora de uma faixa razoável.

## Tema 3 — Processamento com Spark

**Objetivo:** processar volumes que não cabem em uma máquina.

### 3.1 Por que processamento distribuído

Pandas carrega tudo na memória de **um** computador. Com centenas de GB ou TB, isso não funciona. O **Apache Spark** divide os dados em pedaços (**partições**) e processa em paralelo em vários computadores (um **cluster**).

> **Na prática:** antes de partir para Spark, verifique se precisa. Até dezenas de GB, ferramentas de uma máquina só como **DuckDB** e **Polars** costumam ser mais simples e rápidas. Spark brilha em volumes maiores e em plataformas como Databricks.

### 3.2 Spark e PySpark

```bash
pip install pyspark
```

```python
from pyspark.sql import SparkSession, functions as F

spark = SparkSession.builder.appName("vendas").getOrCreate()

vendas = spark.read.parquet("dados/vendas/")          # pode ser uma pasta com milhares de arquivos
resumo = (
    vendas
    .filter(F.col("status") == "PAGO")
    .withColumn("mes", F.date_trunc("month", "data"))
    .groupBy("mes", "categoria")
    .agg(F.sum("valor").alias("faturamento"), F.countDistinct("cliente_id").alias("clientes"))
    .orderBy("mes")
)
resumo.show()
resumo.write.mode("overwrite").partitionBy("mes").parquet("dados/resumo_vendas/")
```

### 3.3 DataFrames e lazy evaluation

As **transformações** (`filter`, `select`, `groupBy`, `join`) só montam um **plano**. Nada é executado até uma **ação** (`show`, `count`, `collect`, `write`). Isso permite ao Spark **otimizar** o plano inteiro (por exemplo, empurrar filtros para a leitura e ler só as colunas usadas).

```python
resumo.explain()   # mostra o plano
```

> **Cuidado! Cai na entrevista:** `collect()` traz **todos** os dados para a máquina do driver: com dados grandes, estoura a memória. Use `show()`, `take(n)` ou grave o resultado.

### 3.4 Partições e shuffle

- Os dados ficam em **partições**; cada uma é processada por uma tarefa em paralelo.
- Operações como `groupBy`, `join` e `orderBy` precisam reorganizar os dados entre as máquinas: o **shuffle**. É a parte mais cara (rede e disco).
- **Data skew** (desbalanceamento): uma chave com muito mais dados que as outras (ex.: um cliente gigante) deixa uma tarefa lenta enquanto as outras esperam.

Técnicas: filtrar e selecionar colunas **antes** dos joins; **broadcast join** quando uma tabela é pequena (ela é copiada para todas as máquinas e o shuffle da grande é evitado); ajustar o número de partições; tratar chaves com skew.

```python
from pyspark.sql.functions import broadcast
vendas.join(broadcast(dim_produto), "produto_id")
```

### 3.5 Parquet e particionamento de arquivos

- **Parquet:** colunar, comprimido, com tipos e estatísticas (o Spark pula blocos que não satisfazem o filtro).
- **Particionar por coluna** (`partitionBy("data")`) cria pastas `data=2025-03-14/`; consultas filtrando por data leem só as pastas necessárias.
- Cuidado com **arquivos pequenos demais** (milhares de arquivos de poucos KB deixam tudo lento) e com particionar por colunas com muitos valores distintos (ex.: `cliente_id`).

### 3.6 Spark SQL

```python
vendas.createOrReplaceTempView("vendas")
spark.sql("""
  SELECT categoria, SUM(valor) AS faturamento
  FROM vendas
  WHERE status = 'PAGO'
  GROUP BY categoria
""").show()
```

O mesmo motor e as mesmas otimizações. Use o que for mais legível para o time.

### Atividades de fixação — Tema 3

1. Explique lazy evaluation com um exemplo, e por que ela permite otimizações.
2. Baixe um mês de dados de viagens de táxi de Nova York (formato Parquet, site oficial da TLC) e calcule com PySpark: viagens e receita por dia, e a média de gorjeta por forma de pagamento.
3. Quais operações do exercício 2 causam shuffle?
4. Uma tabela de 2 TB de eventos é juntada com uma tabela de 50 MB de países. Como otimizar o join?
5. Grave o resultado do exercício 2 particionado por dia. Liste as pastas criadas e explique o ganho numa consulta de um único dia.

## Tema 4 — Transformação com dbt

**Objetivo:** organizar as transformações SQL do warehouse como um projeto de software.

### 4.1 O que é dbt

O **dbt** (data build tool) cuida do **T** do ELT. Você escreve `SELECT`s em arquivos `.sql`; o dbt descobre a ordem, cria as tabelas e views no warehouse, roda testes e gera documentação. Traz boas práticas de engenharia para o SQL: versionamento, testes, reaproveitamento, ambientes.

```bash
pip install dbt-duckdb        # ou dbt-postgres, dbt-bigquery, dbt-snowflake
dbt init meu_projeto
```

### 4.2 Models e ref

Cada arquivo em `models/` é um **model**: um SELECT que vira tabela ou view.

```
models/
  staging/
    stg_pedidos.sql
    stg_clientes.sql
  marts/
    dim_clientes.sql
    fato_vendas.sql
```

```sql
-- models/staging/stg_pedidos.sql
select
    id                      as pedido_id,
    cliente_id,
    cast(data as date)      as data_pedido,
    upper(trim(status))     as status
from {{ source('loja', 'pedidos') }}
```

```sql
-- models/marts/fato_vendas.sql
select
    p.pedido_id,
    p.data_pedido,
    p.cliente_id,
    i.produto_id,
    i.quantidade,
    i.quantidade * i.preco_unitario as valor
from {{ ref('stg_pedidos') }} p
join {{ ref('stg_itens') }} i using (pedido_id)
where p.status = 'PAGO'
```

`ref()` cria a **dependência** entre models: o dbt monta o grafo e executa na ordem certa. Nunca escreva o nome da tabela "na mão".

Camadas comuns: **staging** (limpeza 1:1 da fonte: renomear, tipar), **intermediate** (lógica de junção), **marts** (fatos e dimensões para o negócio).

### 4.3 Sources

```yaml
# models/staging/sources.yml
version: 2
sources:
  - name: loja
    schema: raw
    tables:
      - name: pedidos
        loaded_at_field: carregado_em
        freshness:
          warn_after: { count: 12, period: hour }
          error_after: { count: 24, period: hour }
      - name: clientes
```

`dbt source freshness` alerta se os dados brutos estão atrasados.

### 4.4 Materializations

| Tipo | O que cria | Quando usar |
|---|---|---|
| `view` | View | Staging, models leves |
| `table` | Tabela recriada inteira | Marts consultados com frequência |
| `incremental` | Tabela que recebe só o novo | Fatos grandes |
| `ephemeral` | Nada (vira CTE) | Lógica intermediária reaproveitada |

```sql
{{ config(materialized='incremental', unique_key='pedido_id') }}

select * from {{ ref('stg_pedidos') }}
{% if is_incremental() %}
where data_pedido > (select max(data_pedido) from {{ this }})
{% endif %}
```

### 4.5 Testes

```yaml
# models/marts/schema.yml
version: 2
models:
  - name: fato_vendas
    description: "Uma linha por item de pedido pago."
    columns:
      - name: pedido_id
        tests: [not_null]
      - name: valor
        tests:
          - not_null
      - name: cliente_id
        tests:
          - relationships:
              to: ref('dim_clientes')
              field: cliente_id
  - name: dim_clientes
    columns:
      - name: cliente_id
        tests: [unique, not_null]
```

Testes genéricos prontos: `unique`, `not_null`, `accepted_values`, `relationships`. Testes próprios são SELECTs que devem retornar **zero linhas**. Pacotes como `dbt_utils` e `dbt_expectations` trazem muitos outros.

```bash
dbt build     # roda models e testes na ordem do grafo; um teste falhando bloqueia o que depende dele
```

### 4.6 Documentação e linhagem

```bash
dbt docs generate && dbt docs serve
```

Gera um site com a descrição de cada model e coluna e o **grafo de linhagem**: de quais fontes cada tabela vem e quais dependem dela. Antes de mudar uma coluna, você vê o que vai impactar.

> **Cuidado! Cai na entrevista:** "Como você garante a qualidade das transformações?" Testes do dbt em chaves (unique/not_null), relacionamentos e regras de negócio; freshness das fontes; `dbt build` no CI a cada pull request (num ambiente separado); documentação e linhagem para avaliar impacto.

### Atividades de fixação — Tema 4

1. Crie um projeto dbt com DuckDB, carregue os CSVs da etapa de SQL (clientes, produtos, pedidos, itens) como seeds ou sources e crie os models de staging.
2. Crie `dim_clientes`, `dim_produtos` e `fato_vendas` (grão: item de pedido pago).
3. Adicione testes: chaves únicas, não nulas, relacionamentos e `accepted_values` para status. Force uma falha e veja o resultado.
4. Converta a `fato_vendas` para incremental. O que acontece se um pedido antigo mudar de status? Como lidar?
5. Gere a documentação e explique o grafo de linhagem do seu projeto.

## Projeto da etapa

**Pipeline ELT orquestrado (local):**

1. **Extração:** DAG do Airflow que busca dados de uma API pública (cotações do Banco Central, ou outra) e da base Olist (simulando chegadas diárias).
2. **Carga:** dados brutos numa camada `raw` (PostgreSQL ou DuckDB), de forma idempotente.
3. **Transformação:** projeto dbt com staging, marts (star schema) e testes, disparado pelo Airflow após a carga.
4. **Qualidade:** testes do dbt bloqueando dados ruins; freshness das fontes.
5. **Infra:** tudo com Docker Compose; README com arquitetura (desenho), como rodar e decisões.
6. **Bônus:** um job PySpark que processa o histórico completo e grava em Parquet particionado.

## Resumão

- ELT: carregue bruto, transforme no warehouse. Batch, a menos que precise de segundos.
- Incremental economiza; cuidado com deletes e fusos.
- **Idempotência** + **data lógica** = reprocessar e fazer backfill sem medo.
- Qualidade de dados: dado ruim para o pipeline antes de chegar no dashboard.
- Airflow orquestra (dependências, agenda, retries, alertas, backfill); o processamento pesado roda fora.
- Spark: lazy evaluation, partições, shuffle é caro, broadcast em tabelas pequenas, nada de `collect` em dados grandes.
- dbt: models com `ref`, camadas staging/marts, testes, materializations e linhagem.
