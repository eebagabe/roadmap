# Gabarito — Cloud e Big Data

Abra só depois de tentar.

## Tema 1

1. Exemplo: o **warehouse** é um supermercado: tudo organizado em prateleiras e etiquetado, fácil de achar, mas só entra o que foi embalado do jeito certo. O **lake** é um galpão enorme e barato onde se guarda de tudo, em qualquer caixa; sem organização, ninguém acha nada. O **lakehouse** é o galpão com um sistema de estoque: guarda tudo barato, mas com etiquetas, controle de entrada e saída e inventário confiável.
2. (a) Bronze; (b) prata; (c) ouro; (d) bronze.
3. Resposta pessoal. A interface do BigQuery mostra, antes de executar, "Esta consulta processará X". `SELECT *` numa tabela pública grande pode estimar dezenas ou centenas de GB; selecionar 2 colunas com filtro de partição costuma cair para uma fração disso. Lembre: no BigQuery, `LIMIT` **não** reduz os bytes lidos.
4. Porque ele é a **fonte da verdade** do que chegou. Se uma regra de limpeza estava errada, se surgir uma nova necessidade de análise ou se um bug corromper a camada prata, dá para **reprocessar** a partir do bronze. Sem ele, seria preciso extrair de novo da origem, o que muitas vezes é impossível (APIs que só guardam os últimos dias, dados que mudaram).
5. (1) **Sem aprisionamento** a um fornecedor: os dados ficam em arquivos abertos no seu armazenamento, legíveis por vários motores (Spark, Trino, DuckDB, Flink, warehouses). (2) **Um único armazenamento** para BI, engenharia e ML, sem copiar dados entre sistemas; também costuma reduzir custo de armazenamento.

## Tema 2

1. | Peça | AWS | GCP | Azure |
   |---|---|---|---|
   | Objetos | S3 | Cloud Storage | ADLS Gen2 / Blob |
   | Warehouse | Redshift | BigQuery | Synapse / Fabric |
   | Spark | EMR / Glue | Dataproc | Databricks / Synapse |
   | Streaming | Kinesis / MSK | Pub/Sub / Dataflow | Event Hubs |
   | Orquestração | MWAA / Step Functions | Cloud Composer | Data Factory |
2. ```python
   import boto3, pandas as pd, io
   s3 = boto3.client("s3", endpoint_url="http://localhost:9000",
                     aws_access_key_id="minioadmin", aws_secret_access_key="minioadmin")
   s3.create_bucket(Bucket="lake")
   buf = io.BytesIO()
   df.to_parquet(buf, index=False)
   s3.put_object(Bucket="lake", Key="bronze/vendas/data=2025-03-14/vendas.parquet", Body=buf.getvalue())
   ```
   `minioadmin` é a credencial padrão do MinIO **só para estudo local**; em qualquer ambiente compartilhado, troque.
3. Três papéis: **ingestão** com `PutObject` em `lake/bronze/*`; **transformação** com `GetObject`/`ListBucket` em `lake/bronze/*` e `PutObject`/`DeleteObject` em `lake/prata/*` e `lake/ouro/*`; **analistas** com `GetObject`/`ListBucket` apenas em `lake/ouro/*`. Ninguém tem permissão de apagar o bronze (só um papel administrativo, com aprovação).
4. Exemplos: (1) alertas de orçamento e um relatório de custo por tag/projeto, para achar quem cresceu; (2) proibir `SELECT *` em tabelas grandes e exigir filtro de partição (no BigQuery, `require_partition_filter`); (3) desligar clusters ociosos e usar autoscaling/serverless; (4) materializar agregados consultados por dashboards em vez de recalcular a cada abertura; (5) ciclo de vida para dados antigos e remoção de cópias e tabelas temporárias esquecidas. Bônus: revisar transferência entre regiões.
5. ```hcl
   resource "aws_s3_bucket" "lake" {
     bucket = "meu-lake-estudos"
   }

   resource "aws_s3_bucket_versioning" "lake" {
     bucket = aws_s3_bucket.lake.id
     versioning_configuration { status = "Enabled" }
   }

   resource "aws_s3_bucket_public_access_block" "lake" {
     bucket                  = aws_s3_bucket.lake.id
     block_public_acls       = true
     block_public_policy     = true
     ignore_public_acls      = true
     restrict_public_buckets = true
   }
   ```
   Nomes de bucket no S3 são globais: se `meu-lake-estudos` já existir, use um sufixo único.

## Tema 3

1. (a) **Streaming**: a decisão precisa acontecer durante a transação. (b) **Batch**: precisa de dados completos e conciliados, não de velocidade. (c) **Streaming** (ou micro-batch de poucos minutos): a operação age agora. (d) **Batch**: o treino é semanal; streaming não traria benefício.
2. Prática. Consumidor:
   ```python
   from confluent_kafka import Consumer
   c = Consumer({"bootstrap.servers": "localhost:9092", "group.id": "estudos", "auto.offset.reset": "earliest"})
   c.subscribe(["pedidos"])
   while True:
       msg = c.poll(1.0)
       if msg is None or msg.error():
           continue
       print(msg.key(), msg.value())
   ```
3. A chave define a partição: todos os eventos do mesmo pedido (criado, pago, enviado) vão para a mesma partição, e a **ordem** entre eles é garantida. Também ajuda na compactação de tópicos e na deduplicação por chave.
4. **Entra**, desde que a janela ainda não tenha sido fechada. O watermark é calculado a partir do **maior tempo de evento já visto** menos 10 minutos. Se às 12:20 de relógio o maior evento visto era das 12:12, o watermark é 12:02 e a janela 12:00–12:05 ainda está aberta: o evento das 12:03 é incluído. Se já tivessem chegado eventos das 12:15 ou mais (watermark ≥ 12:05), a janela teria sido fechada e o evento seria descartado como atrasado demais. O que importa é o **tempo do evento** dos dados, não o horário do relógio.
5. (1) **Deletes:** CDC captura; incremental por data não vê. (2) **Mudanças intermediárias:** CDC registra cada alteração; incremental vê só o estado no momento da carga. (3) **Carga na origem e latência:** CDC lê o log de transações com pouca carga e latência de segundos; incremental faz consultas periódicas na tabela, mais pesadas e com latência do intervalo entre cargas. Bônus: CDC não depende de uma coluna `atualizado_em` confiável.

## Projeto da etapa

O que um avaliador olharia:

- Duplicados removidos na prata pela chave do evento (comprovado com contagem antes/depois).
- Eventos atrasados tratados com watermark e decisão documentada.
- Checkpoints configurados (parar e reiniciar o stream não perde nem duplica).
- Consultas da camada ouro com resultados conferidos.
- Nenhuma credencial real no repositório; se usou nuvem, alerta de orçamento e recursos destruídos ao final.
