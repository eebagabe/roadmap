# Governança e Arquitetura: Apostila Prática

Roadmap Analista e Engenheiro de Dados · Semanas 18 e 19

## Comece por aqui

Ter dados não basta: eles precisam ser **confiáveis** (alguém acredita no número?), **encontráveis** (alguém sabe que existem?), **seguros** (quem pode ver o CPF?) e **legais** (a LGPD permite usar assim?). Esta etapa fecha o roadmap com governança, qualidade e a visão de arquitetura que separa quem executa tarefas de quem desenha plataformas.

### Por que isso vale ouro no mercado

- A LGPD trouxe multas e responsabilidade real: empresas precisam de quem entenda dados pessoais na prática.
- "O número do dashboard está diferente do outro relatório" é uma das maiores dores das empresas. Governança resolve.
- Entrevistas sênior pedem "desenhe a plataforma de dados da empresa X".

### Como esta apostila funciona

1. Use o projeto dbt e o lakehouse das etapas anteriores como base.
2. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** em perguntas de arquitetura, comece pelas **necessidades** (quem usa, para quê, com que frequência, quanto dado) antes de escolher qualquer ferramenta.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 18 | Tema 1: Governança e qualidade |
| 19 | Tema 2: Arquitetura e carreira + projeto final |

## Tema 1: Governança e qualidade

**Objetivo:** garantir que os dados sejam confiáveis, documentados e usados de forma legal.

### 1.1 LGPD

A **Lei Geral de Proteção de Dados** (Lei 13.709/2018) regula o uso de dados pessoais no Brasil.

| Conceito | Significado |
|---|---|
| **Dado pessoal** | Identifica ou pode identificar uma pessoa (nome, CPF, e-mail, IP, localização) |
| **Dado sensível** | Saúde, religião, origem racial, biometria, vida sexual, opinião política, filiação sindical. Proteção reforçada |
| **Titular** | A pessoa a quem os dados se referem |
| **Controlador / Operador** | Quem decide sobre o tratamento / quem trata em nome do controlador |
| **Bases legais** | Hipóteses que permitem tratar dados: consentimento, execução de contrato, obrigação legal, legítimo interesse, entre outras |
| **ANPD** | Autoridade Nacional de Proteção de Dados (fiscaliza e aplica sanções) |

Princípios que impactam diretamente o trabalho com dados: **finalidade** (usar só para o propósito informado), **necessidade** (coletar o mínimo), **segurança** e **prevenção**. Direitos do titular incluem acesso, correção e **eliminação**, o que exige saber **onde** os dados de uma pessoa estão em toda a plataforma.

Técnicas no dia a dia:

- **Mascaramento:** `***.456.789-**` para quem não precisa ver o CPF completo.
- **Pseudonimização:** trocar o identificador por um código (hash com chave secreta); a análise continua possível sem expor a pessoa.
- **Anonimização:** impossível reidentificar (dados agregados, generalização). Dados anonimizados de verdade saem do escopo da LGPD, mas anonimizar bem é difícil.
- **Controle de acesso** por coluna e linha; logs de quem acessou.
- **Retenção:** apagar o que não precisa mais ser guardado.

> **Cuidado! Cai na entrevista:** hash simples de CPF **não** é anonimização: existem só cerca de 1 bilhão de CPFs possíveis, e dá para calcular o hash de todos e reverter. Use hash **com chave secreta** (HMAC) para pseudonimizar, e trate o resultado como dado pessoal.

### 1.2 Catálogo de dados

Um **catálogo** é o "Google" dos dados da empresa: quais tabelas existem, o que cada coluna significa, quem é o dono, se tem dado pessoal, quando foi atualizada e quão confiável é. Ferramentas: DataHub, OpenMetadata, Unity Catalog (Databricks), Dataplex (Google), Microsoft Purview, e a documentação do dbt.

Um **glossário de negócio** define os termos: o que é "cliente ativo"? "Receita líquida" inclui frete? Sem isso, duas áreas calculam o mesmo indicador de forma diferente e os números nunca batem.

### 1.3 Linhagem

**Linhagem** mostra de onde cada dado vem e para onde vai: fonte → tabelas intermediárias → dashboard. Serve para:

- **Análise de impacto:** "se eu mudar esta coluna, quais dashboards quebram?"
- **Investigar problemas:** "o número está errado; de qual etapa veio o erro?"
- **LGPD:** "em quais tabelas o e-mail do cliente foi copiado?"

O dbt gera linhagem entre models automaticamente; catálogos ampliam para BI e para as origens.

### 1.4 Data contracts

Um **contrato de dados** é um acordo entre quem **produz** os dados (geralmente o time de software dono do sistema) e quem **consome** (time de dados): esquema, tipos, significado, regras de qualidade, frequência de atualização e como mudanças são comunicadas.

```yaml
# exemplo de contrato (formato ilustrativo)
dataset: pedidos
dono: time-checkout
versao: 2.1.0
atualizacao: a cada 15 minutos
colunas:
  - nome: pedido_id
    tipo: string
    regras: [unico, nao_nulo]
  - nome: valor_total
    tipo: decimal(12,2)
    regras: [nao_nulo, maior_ou_igual: 0]
    descricao: "Valor pago pelo cliente, com desconto e sem frete"
  - nome: cpf_cliente
    tipo: string
    classificacao: pessoal
mudancas_incompativeis: aviso com 30 dias e nova versão
```

O problema que resolve: o time de software renomeia uma coluna no banco e o pipeline de dados quebra às 3h da manhã. Com contrato (e validação automática no CI do time produtor), a mudança incompatível é detectada **antes** do deploy.

### 1.5 Testes de dados

Camadas de verificação:

| Tipo | Exemplo | Ferramenta |
|---|---|---|
| Esquema | Coluna existe, tipo correto | dbt contracts, data contracts |
| Integridade | Chave única, não nula, relacionamentos | dbt tests |
| Regras de negócio | Valor ≥ 0; data de entrega ≥ data do pedido | dbt tests personalizados, Great Expectations |
| Volume | Chegou um número de linhas parecido com o normal | Soda, Great Expectations, observabilidade |
| Atualidade | Dados atualizados nas últimas X horas | `dbt source freshness` |
| Reconciliação | Soma no warehouse bate com a do sistema de origem | Queries de reconciliação |

```sql
-- teste dbt personalizado: deve retornar ZERO linhas
-- tests/entrega_antes_do_pedido.sql
select pedido_id
from {{ ref('fato_pedidos') }}
where data_entrega < data_pedido
```

### 1.6 Observabilidade de dados

Assim como software tem monitoramento, dados também precisam. Os "pilares" costumam incluir: **atualidade** (chegou na hora?), **volume** (quantidade normal?), **distribuição** (os valores mudaram de padrão? de repente 40% de nulos?), **esquema** (mudou?) e **linhagem** (o que é afetado?).

O objetivo é o time de dados descobrir o problema **antes** do usuário do dashboard. Ferramentas: Monte Carlo, Elementary (sobre dbt), Soda, e métricas próprias com alertas.

### Atividades de fixação do Tema 1

1. Classifique: (a) e-mail; (b) histórico de compras associado ao CPF; (c) tipo sanguíneo; (d) contagem de pedidos por estado; (e) IP de acesso. Quais são dados pessoais? Quais são sensíveis? Qual não é dado pessoal?
2. Um cliente pede a eliminação dos seus dados. Liste os passos e os desafios numa plataforma com banco de produção, data lake (bronze/prata/ouro), warehouse e backups.
3. Escreva o glossário (definição precisa) de: "cliente ativo", "receita líquida" e "pedido atrasado" para um e-commerce.
4. Escreva 3 testes de regra de negócio (em SQL, no estilo dbt) para uma tabela de pedidos.
5. O dashboard de vendas mostrou queda de 60% ontem, mas as vendas estavam normais. Quais verificações de observabilidade teriam detectado o problema antes?

## Tema 2: Arquitetura e carreira

**Objetivo:** enxergar a plataforma de dados como um todo e escolher seu caminho.

### 2.1 Modern Data Stack

Conjunto de ferramentas, geralmente em nuvem e gerenciadas, que se tornou padrão:

```
Origens          Ingestão              Armazenamento       Transformação    Consumo
(bancos, APIs,  → (Fivetran, Airbyte, → (BigQuery,        → (dbt)         → (Power BI, Looker,
 SaaS, eventos)    Kafka/CDC, scripts)    Snowflake,                         Metabase, notebooks,
                                          Databricks)                        ML, APIs de dados)
                     Orquestração (Airflow, Dagster) · Qualidade e observabilidade · Catálogo e governança
```

Vantagem: montar uma plataforma rápido, com ferramentas especializadas. Riscos: custo que cresce com volume, muitas ferramentas para integrar, dependência de fornecedores.

### 2.2 Data Mesh

Proposta organizacional para empresas grandes, em que um time central de dados vira gargalo. Quatro princípios:

1. **Propriedade por domínio:** cada área de negócio (pagamentos, logística) é dona dos seus dados.
2. **Dados como produto:** cada domínio publica dados com qualidade, documentação, contrato e "SLA", como um produto para os consumidores.
3. **Plataforma self-service:** um time de plataforma oferece a infraestrutura comum para os domínios não reinventarem tudo.
4. **Governança federada:** regras comuns (segurança, padrões, LGPD) definidas em conjunto e automatizadas.

> **Na prática:** Data Mesh é mais sobre **organização e responsabilidade** do que sobre tecnologia. Para empresas pequenas, um time central bem organizado costuma ser mais eficiente.

### 2.3 Data System Design

Roteiro para entrevistas e projetos ("desenhe a plataforma de dados de um app de delivery"):

1. **Requisitos:** quem consome (diretoria, operação, ML, clientes)? Quais perguntas? Que **latência** é aceitável (diária, horária, segundos)? Volume (eventos/dia, TB)? Restrições (LGPD, custo, time pequeno)?
2. **Origens:** bancos dos microsserviços, eventos do app, APIs de parceiros, planilhas.
3. **Ingestão:** batch (cargas diárias/horárias) e/ou streaming (CDC, eventos).
4. **Armazenamento e camadas:** lake/lakehouse/warehouse, medalhão.
5. **Transformação e modelagem:** dbt, Spark; fatos e dimensões.
6. **Consumo:** BI, feature store para ML, APIs, exportações.
7. **Transversais:** orquestração, qualidade, observabilidade, catálogo, segurança e LGPD, custo.
8. **Trade-offs:** o que você escolheu, por quê, e o que fica para depois.

Exemplo curto, **delivery**:

- Operação precisa de pedidos atrasados **em minutos**: CDC dos pedidos → Kafka → streaming → tabela de pedidos em andamento → painel operacional.
- Diretoria precisa de resultado **diário**: batch → bronze/prata/ouro → star schema (grão: pedido) → Power BI.
- Time de ML precisa de **histórico** para estimar tempo de entrega: prata/ouro no lakehouse + feature store.
- LGPD: endereço e telefone pseudonimizados fora do bronze; acesso por papel; retenção definida.
- Custo: streaming só onde a latência importa; o resto batch.

### 2.4 Dados para IA e LLMs

IA generativa depende de dados tanto quanto o BI:

- **RAG** (Retrieval-Augmented Generation): o LLM responde usando documentos da empresa. O pipeline de dados prepara os documentos: extrair, limpar, dividir em pedaços, gerar **embeddings** (vetores) e indexar num **banco vetorial** (pgvector, Pinecone, Weaviate, ou o próprio warehouse).
- **Text-to-SQL:** um assistente gera SQL a partir de perguntas em português. Só funciona bem com um **modelo de dados bem documentado** (nomes claros, descrições, métricas definidas), ou seja, com boa governança.
- **Qualidade e LGPD** valem em dobro: o modelo pode expor dados pessoais que estavam nos documentos.
- **Dados não estruturados** (PDFs, e-mails, áudios) entram no lakehouse como mais uma fonte.

> **Na prática:** a camada semântica (definições de métricas e dimensões) e a documentação do dbt, que pareciam "burocracia", são exatamente o que faz assistentes de IA responderem perguntas de dados corretamente.

### 2.5 Analista, engenheiro ou cientista

| | Analista de Dados / BI | Engenheiro de Dados | Analytics Engineer | Cientista de Dados |
|---|---|---|---|---|
| Pergunta central | O que aconteceu e por quê? | Os dados chegam confiáveis e no prazo? | Os dados estão modelados e prontos para análise? | O que vai acontecer? O que causa o quê? |
| Ferramentas | SQL, Power BI, Excel, Python | Python, SQL, Spark, Airflow, cloud, Kafka | SQL, dbt, Git, modelagem | Python, estatística, ML |
| Entrega | Dashboards, análises, recomendações | Pipelines e plataforma | Modelos dbt, camada semântica, testes | Modelos preditivos, experimentos |
| Perfil | Negócio + comunicação | Software + infraestrutura | Meio-termo entre os dois | Matemática + negócio |

Caminhos comuns: começar como analista e migrar para analytics engineer ou engenheiro; ou vir de desenvolvimento de software direto para engenharia de dados.

Portfólio que chama atenção: 2 ou 3 projetos completos no GitHub (com README, desenho de arquitetura e decisões), em vez de 15 notebooks soltos. Certificações de nuvem (como as de dados do Google Cloud, AWS ou Azure) e do dbt ajudam em processos seletivos.

### Atividades de fixação do Tema 2

1. Desenhe a Modern Data Stack que você montaria para uma startup de 50 pessoas, com orçamento limitado. Justifique cada escolha.
2. Explique Data Mesh para um gestor em até 5 frases. Para qual tipo de empresa você recomendaria?
3. Faça o Data System Design de uma **fintech de cartão de crédito**: fraude (segundos), relatórios regulatórios (diário) e análise de inadimplência (mensal).
4. Que preparação de dados seria necessária para um assistente que responde perguntas sobre os contratos da empresa (PDFs) usando RAG?
5. Com base no que estudou no roadmap, qual papel combina mais com você? Escreva um plano de 3 meses para chegar a uma vaga nesse papel.

## Projeto da etapa: projeto final do roadmap

**Plataforma de dados de ponta a ponta (escolha um domínio: e-commerce, delivery, finanças pessoais):**

1. **Ingestão:** batch de uma API pública + base histórica (ex.: Olist); bônus: eventos simulados em Kafka.
2. **Armazenamento:** medalhão (bronze/prata/ouro) em DuckDB, PostgreSQL ou lakehouse local (MinIO + Delta).
3. **Transformação:** dbt com star schema, testes de integridade e de regra de negócio, freshness e documentação.
4. **Orquestração:** Airflow com retries, alertas e backfill funcionando.
5. **Governança:** glossário das métricas, classificação das colunas pessoais, pseudonimização de identificadores, contrato de dados de uma fonte.
6. **Consumo:** dashboard (Power BI, Metabase ou Looker Studio) com 4 KPIs e resumo executivo de uma análise.
7. **README:** desenho da arquitetura, decisões e trade-offs, como rodar com `docker compose up`, custos estimados se fosse para a nuvem.

Esse é o projeto que você apresenta na entrevista.

## Resumão

- LGPD: finalidade, necessidade, segurança; saiba onde estão os dados pessoais. Hash simples de CPF não anonimiza.
- Catálogo e glossário evitam números diferentes para a mesma métrica.
- Linhagem: impacto de mudanças, investigação e LGPD.
- Data contracts protegem os pipelines de mudanças na origem.
- Teste esquema, integridade, regras, volume, atualidade; observe os dados como se observa software.
- Modern Data Stack monta rápido; Data Mesh é organização, para empresas grandes.
- Data System Design começa pelos requisitos (consumidores e latência), não pelas ferramentas.
- Boa governança é o que faz IA sobre dados funcionar.
