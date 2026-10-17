# Gabarito — Governança e Arquitetura

Abra só depois de tentar. As referências à LGPD são didáticas; para casos reais, consulte o encarregado de dados (DPO) e o jurídico da empresa.

## Tema 1

1. (a) Dado pessoal; (b) dado pessoal; (c) dado pessoal **sensível** (saúde); (d) **não é dado pessoal**, por ser agregado (desde que os grupos não sejam tão pequenos a ponto de identificar alguém); (e) dado pessoal (o IP pode identificar uma pessoa, especialmente combinado com outros dados).
2. Passos: (1) validar a identidade do titular e verificar se há **base legal para manter** algum dado (ex.: obrigação fiscal de guardar notas por anos); (2) localizar os dados da pessoa em todos os sistemas usando **linhagem e catálogo**: produção, bronze, prata, ouro, warehouse, ferramentas de BI, exportações; (3) apagar ou anonimizar em cada lugar, inclusive em tabelas com histórico (SCD 2) e formatos imutáveis (Parquet exige reescrever arquivos; Delta/Iceberg permitem `DELETE`, mas é preciso limpar versões antigas); (4) backups: geralmente expiram pelo ciclo de retenção, com controle para não restaurar o dado apagado; (5) registrar o atendimento. Desafios: cópias espalhadas sem linhagem, arquivos imutáveis, backups, dados enviados para terceiros (operadores).
3. Exemplos: **Cliente ativo:** cliente com pelo menos um pedido com status pago nos últimos 90 dias corridos, contados até o fim do período analisado. **Receita líquida:** soma do valor dos itens dos pedidos pagos, menos descontos e devoluções/estornos do período, **sem** frete e sem impostos destacados. **Pedido atrasado:** pedido entregue (ou ainda não entregue) depois da data de entrega prometida ao cliente no momento da compra, no fuso de Brasília; pedidos cancelados ficam de fora.
4. ```sql
   -- tests/valor_negativo.sql
   select pedido_id from {{ ref('fato_pedidos') }} where valor_total < 0

   -- tests/entrega_antes_da_compra.sql
   select pedido_id from {{ ref('fato_pedidos') }} where data_entrega < data_pedido

   -- tests/pago_sem_data_pagamento.sql
   select pedido_id from {{ ref('fato_pedidos') }} where status = 'PAGO' and data_pagamento is null
   ```
5. **Volume:** a carga de ontem trouxe muito menos linhas que o normal (ex.: 40% do esperado). **Atualidade:** a fonte não foi atualizada até o horário previsto (carga parcial ou atrasada). **Distribuição:** aumento anormal de nulos ou de um status. **Esquema:** uma coluna renomeada na origem passou a vir nula. **Reconciliação:** a soma no warehouse não bateu com o total do sistema de origem. Qualquer um desses, com alerta, avisaria o time antes de a diretoria ver a "queda".

## Tema 2

1. Exemplo econômico: **ingestão** com Airbyte (open source) ou scripts Python para poucas fontes; **warehouse** BigQuery (paga pelo uso, sem cluster para administrar) ou PostgreSQL/DuckDB se o volume for pequeno; **transformação** com dbt Core (gratuito); **orquestração** com Airflow num serviço gerenciado barato, ou o próprio agendador do dbt Cloud/GitHub Actions no começo; **BI** Metabase (open source) ou Looker Studio (gratuito); **qualidade** com testes do dbt e Elementary. Justificativa geral: poucas pessoas, então priorizar ferramentas gerenciadas ou simples, custo proporcional ao uso e SQL como linguagem comum.
2. Exemplo: "Hoje um único time de dados atende a empresa toda e virou gargalo. No Data Mesh, cada área de negócio passa a ser dona dos seus dados e os publica como produtos, com qualidade e documentação. Um time de plataforma oferece as ferramentas comuns, e regras de segurança e qualidade são definidas em conjunto e automatizadas. Funciona bem em empresas grandes, com muitos domínios e times maduros. Para empresas pequenas, o custo de coordenação costuma ser maior que o benefício."
3. Esboço:
   - **Fraude (segundos):** autorização da transação gera evento → Kafka → processamento em streaming (Flink/Spark) que calcula features em tempo real (quantidade de compras nos últimos minutos, localização incomum) e consulta um modelo → resposta em milissegundos/segundos ao autorizador. Features históricas vêm de uma feature store alimentada pelo lakehouse.
   - **Regulatório (diário):** CDC/batch dos sistemas de cartão e contas → bronze imutável e auditável → prata conciliada → ouro com as tabelas no formato exigido; reconciliação obrigatória com os sistemas de origem; linhagem completa para auditoria; testes que bloqueiam a entrega se não baterem.
   - **Inadimplência (mensal):** fatos de faturas e pagamentos, dimensão de cliente com SCD 2 (renda, limite, segmento na época), análises de safra (coorte) e modelos de risco.
   - **Transversais:** dados pessoais pseudonimizados fora do bronze, acesso por papel, criptografia, retenção conforme regulação; custo de streaming só no fluxo de fraude.
4. Extrair o texto dos PDFs (com OCR para documentos digitalizados); limpar (cabeçalhos, rodapés, numeração); guardar **metadados** (contrato, cliente, data, vigência, área responsável); dividir em pedaços com sobreposição respeitando cláusulas; gerar embeddings e indexar num banco vetorial com os metadados; aplicar **controle de acesso** (cada usuário só recupera contratos que pode ver); tratar dados pessoais (mascarar o que não for necessário); pipeline incremental para contratos novos e versões atualizadas; e um conjunto de perguntas de teste para avaliar a qualidade das respostas.
5. Resposta pessoal. Um bom plano tem: papel-alvo; lacunas a fechar (ex.: dbt e Airflow); um projeto de portfólio com prazo; prática semanal de SQL; uma certificação opcional; e metas de candidatura (ex.: 10 candidaturas por semana a partir do mês 2, com currículo adaptado a cada vaga).

## Projeto da etapa

O que um avaliador olharia:

- Arquitetura desenhada e coerente com os requisitos declarados.
- Pipeline idempotente, com backfill e testes bloqueando dados ruins.
- Glossário das métricas e classificação das colunas pessoais.
- Dashboard com KPIs definidos no glossário (os números batem com as queries).
- README que permite rodar tudo e explica os trade-offs.
