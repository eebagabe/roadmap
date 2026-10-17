# Cloud e Big Data: Apostila Prática

Roadmap Analista e Engenheiro de Dados · Semanas 15 a 17

## Comece por aqui

Hoje quase toda plataforma de dados vive na **nuvem**: os dados ficam em armazenamento barato e infinito, e o processamento é alugado por demanda. Esta etapa explica os conceitos que se repetem em qualquer provedor (AWS, Google Cloud, Azure), as arquiteturas modernas (warehouse, lake, lakehouse) e o básico de **streaming**.

### Por que isso vale ouro no mercado

- Vagas de engenharia de dados pedem experiência com pelo menos uma nuvem e um warehouse (BigQuery, Snowflake, Redshift, Databricks).
- Saber controlar **custo** é uma habilidade valorizada: uma query mal escrita pode custar caro.
- Streaming (Kafka) é diferencial para vagas em fintechs, delivery e marketplaces.

### Como esta apostila funciona

1. Use os níveis gratuitos: **BigQuery Sandbox** (sem cartão de crédito), free tier da AWS, ou ferramentas locais equivalentes (MinIO no lugar do S3, DuckDB no lugar do warehouse).
2. **Configure alertas de orçamento** antes de criar qualquer recurso pago.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Atenção:** nunca suba chaves de acesso da nuvem para o GitHub. Robôs procuram chaves vazadas o tempo todo e as usam em minutos (geralmente para mineração de criptomoedas, na sua conta).

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 15 | Tema 1: Data Warehouse e Lakehouse |
| 16 | Tema 2: Dados na nuvem |
| 17 | Tema 3: Streaming + projeto |

## Tema 1: Data Warehouse e Lakehouse

**Objetivo:** entender onde os dados analíticos moram e as diferenças entre as arquiteturas.

### 1.1 Data Warehouse

Banco de dados **analítico**, otimizado para consultas grandes (agregações sobre milhões ou bilhões de linhas). Características:

- Armazenamento **colunar** e comprimido.
- Processamento massivamente paralelo.
- Dados **estruturados** e modelados (tabelas, star schema).
- SQL como linguagem principal.
- Na nuvem, **armazenamento e processamento separados**: você paga um pelo que guarda e outro pelo que processa.

### 1.2 Data Lake

Repositório de **arquivos** em armazenamento de objetos (S3, GCS, ADLS), guardando dados em qualquer formato: CSV, JSON, Parquet, imagens, logs. Barato e flexível, mas sem controle vira um **data swamp** (pântano): ninguém sabe o que tem, de onde veio, nem se está correto.

### 1.3 Lakehouse

Junta os dois: arquivos abertos no lake (Parquet) com uma **camada de tabela** por cima que traz recursos de warehouse: transações ACID, esquema, atualizações e deletes, histórico de versões ("viagem no tempo"). Os formatos de tabela abertos mais conhecidos são **Delta Lake**, **Apache Iceberg** e **Apache Hudi**.

| | Warehouse | Lake | Lakehouse |
|---|---|---|---|
| Dados | Estruturados | Qualquer formato | Qualquer formato, com tabelas |
| Custo de armazenamento | Maior | Muito baixo | Muito baixo |
| Transações e qualidade | Sim | Não | Sim |
| Uso típico | BI e SQL | Dados brutos, ML | BI, SQL e ML no mesmo lugar |

### 1.4 Arquitetura medalhão

Organiza os dados em camadas de qualidade crescente:

| Camada | Conteúdo | Exemplo |
|---|---|---|
| **Bronze** (raw) | Dados brutos, como chegaram, com metadados de carga | JSON da API exatamente como veio |
| **Prata** (silver) | Limpos, tipados, deduplicados, padronizados | Tabela de pedidos com tipos corretos e sem duplicados |
| **Ouro** (gold) | Prontos para o negócio: fatos, dimensões, agregados | `fato_vendas`, `vendas_diarias_por_loja` |

Guardar o bronze permite **reprocessar** prata e ouro quando uma regra muda ou um bug é corrigido.

### 1.5 BigQuery, Snowflake e Databricks

| Plataforma | Destaques |
|---|---|
| **BigQuery** (Google) | Serverless (sem cluster para gerenciar), cobra por dados lidos ou por capacidade reservada, sandbox gratuito |
| **Snowflake** | Multinuvem, "warehouses" virtuais de computação que ligam e desligam, compartilhamento de dados |
| **Databricks** | Lakehouse sobre Spark e Delta Lake, forte em engenharia e ML |
| **Redshift** (AWS) | Warehouse da AWS, integrado ao ecossistema |
| **Synapse/Fabric** (Microsoft) | Integração com Power BI e o ecossistema Azure |

Os conceitos (SQL, colunar, particionamento, separação de armazenamento e computação) são os mesmos. Aprenda um a fundo; os outros ficam fáceis.

```sql
-- BigQuery: tabela particionada por data e clusterizada
CREATE TABLE loja.fato_vendas
PARTITION BY data_pedido
CLUSTER BY loja_id, categoria AS
SELECT * FROM loja.stg_vendas;

-- consulta que lê pouco: filtro na partição + só as colunas necessárias
SELECT categoria, SUM(valor) AS faturamento
FROM loja.fato_vendas
WHERE data_pedido BETWEEN '2025-03-01' AND '2025-03-31'
GROUP BY categoria;
```

> **Cuidado! Cai na entrevista:** "Como reduzir o custo de queries no BigQuery?" Selecionar só as colunas necessárias (nada de `SELECT *`), filtrar pela coluna de partição, clusterizar por colunas muito filtradas, materializar agregados usados com frequência, e conferir a estimativa de bytes antes de rodar.

### 1.6 Delta Lake e Iceberg

```python
# PySpark com Delta Lake (ex.: no Databricks)
df.write.format("delta").mode("overwrite").save("/lake/prata/pedidos")

from delta.tables import DeltaTable
tabela = DeltaTable.forPath(spark, "/lake/prata/pedidos")
(tabela.alias("t")
   .merge(novos.alias("n"), "t.pedido_id = n.pedido_id")
   .whenMatchedUpdateAll()
   .whenNotMatchedInsertAll()
   .execute())                                   # upsert com transação ACID

spark.read.format("delta").option("versionAsOf", 3).load("/lake/prata/pedidos")   # viagem no tempo
```

O **Iceberg** tem recursos parecidos e é suportado por muitos motores (Spark, Trino, Flink, Snowflake, BigQuery, Athena), o que facilita usar a mesma tabela em ferramentas diferentes.

### Atividades de fixação do Tema 1

1. Explique para alguém de negócios a diferença entre data warehouse, data lake e lakehouse, com uma analogia.
2. Classifique em bronze, prata ou ouro: (a) eventos de clique em JSON como chegaram do app; (b) tabela de clientes com CPF validado e sem duplicados; (c) faturamento mensal por região; (d) dump diário do banco de produção.
3. No BigQuery Sandbox, explore um dataset público (ex.: `bigquery-public-data`) e compare os bytes estimados de `SELECT *` e de uma query com 2 colunas e filtro.
4. Por que guardar a camada bronze se ela é "suja"?
5. Cite duas vantagens de formatos abertos como Delta e Iceberg sobre um warehouse proprietário.

## Tema 2: Dados na nuvem

**Objetivo:** conhecer os serviços de dados dos provedores e cuidar de segurança e custo.

### 2.1 Armazenamento de objetos (S3)

O **S3** (AWS), **GCS** (Google) e **ADLS/Blob** (Azure) guardam arquivos ("objetos") em **buckets**, com custo baixo, durabilidade altíssima e capacidade praticamente ilimitada. São a base de todo data lake.

```bash
aws s3 mb s3://meu-lake-estudos
aws s3 cp vendas.parquet s3://meu-lake-estudos/bronze/vendas/data=2025-03-14/
aws s3 ls s3://meu-lake-estudos/bronze/vendas/ --recursive
```

Boas práticas: organização de pastas por camada e data (`bronze/origem/tabela/data=AAAA-MM-DD/`); **classes de armazenamento** e regras de ciclo de vida (mover dado antigo para camadas mais baratas); bucket **privado** por padrão; versionamento para proteção contra exclusão acidental.

Para estudar sem nuvem: **MinIO** é compatível com a API do S3 e roda em Docker.

### 2.2 Serviços de dados da AWS

| Serviço | Para quê |
|---|---|
| **S3** | Data lake |
| **Glue** | Catálogo de dados e jobs de ETL (Spark gerenciado) |
| **Athena** | SQL direto sobre arquivos no S3 (paga por dados lidos) |
| **Redshift** | Data warehouse |
| **EMR** | Clusters Spark/Hadoop gerenciados |
| **Kinesis / MSK** | Streaming (MSK = Kafka gerenciado) |
| **Lambda** | Funções sob demanda (pequenas ingestões, gatilhos) |
| **MWAA** | Airflow gerenciado |

### 2.3 Serviços de dados do GCP e Azure

| Função | Google Cloud | Azure |
|---|---|---|
| Armazenamento | Cloud Storage (GCS) | ADLS Gen2 / Blob |
| Warehouse | BigQuery | Synapse / Fabric |
| Spark | Dataproc | Databricks, Synapse Spark |
| Streaming | Pub/Sub, Dataflow | Event Hubs, Stream Analytics |
| Orquestração | Cloud Composer (Airflow) | Data Factory |

Os nomes mudam; as peças são as mesmas: **armazenar, processar, consultar, orquestrar, transmitir**.

### 2.4 IAM e segurança

**IAM** (gestão de identidade e acesso) define **quem** pode fazer **o quê** em **qual** recurso.

- **Menor privilégio:** cada usuário/serviço tem só as permissões necessárias.
- **Papéis (roles)** para serviços, em vez de chaves de acesso fixas.
- Segredos num cofre (Secrets Manager, Secret Manager, Key Vault).
- Criptografia em repouso e em trânsito (geralmente padrão).
- Dados sensíveis (CPF, dados de saúde) com acesso restrito, mascaramento e logs de acesso (LGPD).

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": ["arn:aws:s3:::meu-lake-estudos", "arn:aws:s3:::meu-lake-estudos/ouro/*"]
  }]
}
```

Esta política permite **só ler** a camada ouro: um analista não precisa (e não deve) apagar dados do bronze.

### 2.5 Custos

Na nuvem, o custo cresce silenciosamente. Hábitos essenciais:

- **Alerta de orçamento** desde o primeiro dia.
- Desligar clusters ociosos (ou usar serverless/autoscaling).
- Queries que leem só o necessário (partição, colunas).
- Ciclo de vida para dados antigos.
- **Tags** nos recursos (projeto, time) para saber quem gasta o quê.
- Cuidado com **transferência de dados** entre regiões e para fora da nuvem (egress).

> **Cuidado! Cai na entrevista:** custo é requisito de arquitetura. Ao desenhar um pipeline, diga **quanto** custa aproximadamente e como você controlaria: isso mostra senioridade.

### 2.6 Infraestrutura como código

Criar recursos clicando no console não é reproduzível nem revisável. Com **Terraform** (ou Pulumi, CloudFormation), a infraestrutura vira código versionado no Git, revisado em pull request.

```hcl
resource "aws_s3_bucket" "lake" {
  bucket = "meu-lake-estudos"
  tags   = { projeto = "roadmap-dados" }
}

resource "aws_s3_bucket_public_access_block" "lake" {
  bucket                  = aws_s3_bucket.lake.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
```

```bash
terraform init && terraform plan && terraform apply
terraform destroy      # apaga tudo ao terminar os estudos
```

### Atividades de fixação do Tema 2

1. Monte uma tabela "peça → AWS → GCP → Azure" para: armazenamento de objetos, warehouse, Spark gerenciado, streaming e orquestração.
2. Suba o MinIO com Docker, crie um bucket e grave arquivos Parquet organizados por camada e data com Python (`boto3` ou `s3fs`).
3. Escreva uma política IAM (ou descreva em palavras) para: o pipeline de ingestão pode escrever no bronze; o job de transformação lê o bronze e escreve no prata e no ouro; analistas só leem o ouro.
4. Liste 5 ações para reduzir a conta de nuvem de um time de dados que dobrou em 3 meses.
5. Escreva em Terraform um bucket com bloqueio de acesso público e versionamento.

## Tema 3: Streaming

**Objetivo:** entender quando e como processar dados em tempo real.

### 3.1 Quando usar streaming

Use quando o **valor do dado cai rápido com o tempo**: fraude (decidir durante a transação), preços dinâmicos, rastreamento de entregas, alertas de monitoramento, recomendações em sessão. Se o negócio olha o dado uma vez por dia, batch é mais simples e barato.

### 3.2 Kafka

**Apache Kafka** é a plataforma de streaming mais usada: um **log distribuído** de eventos.

- **Tópico:** uma categoria de eventos (`pedidos`, `pagamentos`).
- **Partições:** cada tópico é dividido para paralelismo; a ordem é garantida dentro de uma partição; a **chave** do evento define a partição.
- **Produtor:** publica eventos. **Consumidor:** lê; consumidores de um mesmo **grupo** dividem as partições.
- **Retenção:** eventos ficam guardados por um período (dias), mesmo depois de lidos; dá para reler.

```python
from confluent_kafka import Producer
import json

p = Producer({"bootstrap.servers": "localhost:9092"})
evento = {"pedido_id": 981, "valor": 150.0, "status": "CRIADO", "ts": "2025-03-14T12:00:00Z"}
p.produce("pedidos", key=str(evento["pedido_id"]), value=json.dumps(evento))
p.flush()
```

### 3.3 CDC

**Change Data Capture** captura cada inserção, atualização e exclusão do banco transacional lendo o **log de transações** (sem consultar as tabelas) e publica como eventos. Ferramenta mais conhecida: **Debezium** (com Kafka Connect).

Vantagens sobre a carga incremental por data: pega **deletes**, pega todas as mudanças (não só o estado final), baixa latência e pouca carga no banco de origem.

### 3.4 Janelas de tempo

Agregar um fluxo infinito exige **janelas**:

| Janela | Como | Exemplo |
|---|---|---|
| **Tumbling** (fixa) | Blocos sem sobreposição | Vendas a cada 5 minutos |
| **Sliding/Hopping** (deslizante) | Blocos que se sobrepõem | Vendas dos últimos 10 min, atualizado a cada 1 min |
| **Session** | Agrupa por atividade, fecha após inatividade | Sessão de navegação de um usuário |

**Tempo do evento** (quando aconteceu) ≠ **tempo de processamento** (quando chegou). Eventos chegam **atrasados** (celular sem sinal). **Watermark** define quanto atraso tolerar antes de fechar uma janela.

### 3.5 Spark Structured Streaming

A mesma API de DataFrames, aplicada a um fluxo:

```python
from pyspark.sql import functions as F
from pyspark.sql.types import StructType, StructField, LongType, DoubleType, StringType, TimestampType

esquema = StructType([
    StructField("pedido_id", LongType()), StructField("valor", DoubleType()),
    StructField("status", StringType()), StructField("ts", TimestampType()),
])

eventos = (spark.readStream.format("kafka")
    .option("kafka.bootstrap.servers", "localhost:9092")
    .option("subscribe", "pedidos")
    .load()
    .select(F.from_json(F.col("value").cast("string"), esquema).alias("e"))
    .select("e.*"))

por_janela = (eventos
    .withWatermark("ts", "10 minutes")
    .groupBy(F.window("ts", "5 minutes"))
    .agg(F.sum("valor").alias("faturamento"), F.count("*").alias("pedidos")))

(por_janela.writeStream
    .format("delta")
    .outputMode("append")
    .option("checkpointLocation", "/lake/checkpoints/faturamento_5min")
    .start("/lake/ouro/faturamento_5min"))
```

O **checkpoint** guarda até onde o stream já processou, para retomar após falhas sem perder nem duplicar.

Outras ferramentas: **Apache Flink** (streaming nativo, latência muito baixa), Kafka Streams, e serviços gerenciados (Dataflow, Kinesis Data Analytics).

### 3.6 Exactly-once

Garantias de entrega (as mesmas de mensageria):

- **At most once:** pode perder.
- **At least once:** não perde, pode duplicar (o mais comum).
- **Exactly once:** efeito de exatamente uma vez.

Na prática, "exactly once" de ponta a ponta exige **fonte reprocessável** (Kafka) + **checkpoint** + **destino idempotente ou transacional** (Delta Lake, upsert por chave). Quando o destino não é idempotente, use **at least once com deduplicação** pela chave do evento.

> **Cuidado! Cai na entrevista:** "Como evitar duplicados num pipeline de streaming?" Cada evento com um **ID único**; escrita idempotente (merge/upsert por ID) ou deduplicação com estado (`dropDuplicates` com watermark no Spark); checkpoints para retomar do ponto certo.

### Atividades de fixação do Tema 3

1. Para cada caso, streaming ou batch? Justifique. (a) bloqueio de transação suspeita; (b) relatório de vendas para o fechamento contábil; (c) painel de pedidos atrasados para a operação de delivery; (d) treinamento semanal de um modelo de recomendação.
2. Suba Kafka com Docker, crie um tópico `pedidos` e escreva um produtor Python que publica 1 evento por segundo e um consumidor que imprime os eventos.
3. Explique por que usar o `pedido_id` como chave do evento no Kafka.
4. Vendas por janelas de 5 minutos: um evento das 12:03 chega às 12:20. Com watermark de 10 minutos, ele entra na conta? Por quê?
5. Compare CDC com carga incremental por `atualizado_em` em 3 aspectos.

## Projeto da etapa

**Lakehouse de pedidos (local, sem custo):**

1. **MinIO** como data lake e **Kafka** com um produtor simulando pedidos (com alguns eventos duplicados e atrasados de propósito).
2. **Spark Structured Streaming** grava a camada bronze (eventos brutos em Delta ou Parquet) e a prata (deduplicada, tipada).
3. Um job batch diário gera a camada ouro (faturamento por dia e por categoria).
4. Consultas na camada ouro com **DuckDB** (lendo Parquet/Delta do MinIO).
5. Docker Compose, README com o desenho da arquitetura medalhão e a explicação de como duplicados e atrasos foram tratados.
6. **Bônus na nuvem:** a mesma ideia no BigQuery Sandbox ou na AWS free tier, com alerta de orçamento e `terraform destroy` ao final.

## Resumão

- Warehouse: colunar, SQL, estruturado. Lake: arquivos baratos de qualquer formato. Lakehouse: os dois, com tabelas ACID (Delta, Iceberg).
- Medalhão: bronze (bruto) → prata (limpo) → ouro (negócio). Guarde o bronze.
- Custo na nuvem: só as colunas necessárias, filtro de partição, desligar ocioso, alerta de orçamento.
- IAM com menor privilégio; segredos em cofre; nada de chave no Git.
- Infra como código com Terraform.
- Streaming quando o dado perde valor rápido. Kafka: tópicos, partições, chave, grupos.
- CDC pega todas as mudanças, inclusive deletes. Janelas + watermark para eventos atrasados.
- Exactly-once na prática = fonte reprocessável + checkpoint + destino idempotente.
