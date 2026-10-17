import type { Roadmap } from '../types'

export const dados: Roadmap = {
  id: 'dados',
  title: 'Roadmap Analista e Engenheiro de Dados',
  short: 'Dados',
  icon: '📊',
  accent: '#2563eb',
  status: 'disponivel',
  objective:
    'Formar a base comum de Analista e Engenheiro de Dados: Python, SQL e modelagem, e depois seguir para análise e BI ou para pipelines, Spark e cloud.',
  intro:
    'Toda empresa grande hoje decide com dados: quanto estocar, para quem dar crédito, qual promoção funciona. O Analista de Dados transforma dados em respostas e dashboards. O Engenheiro de Dados constrói os "encanamentos" que levam os dados limpos até lá. Os dois começam igual: Python, estatística e muito SQL. Depois de "Análise de Dados", quem quer ser analista aprofunda em BI e negócio; quem quer ser engenheiro segue para pipelines, Spark e cloud.',
  sections: [
    {
      id: 'fundamentos',
      title: 'Fundamentos',
      summary: 'Python, estatística e as ferramentas do dia a dia de quem trabalha com dados.',
      weeks: [
        {
          id: 'python',
          title: 'Python para dados',
          topics: ['Tipos e variáveis', 'Listas, dicionários e sets', 'Funções', 'Laços e compreensões', 'Ler e escrever CSV e JSON', 'Ambientes virtuais', 'Jupyter Notebook'],
        },
        {
          id: 'estatistica',
          title: 'Estatística essencial',
          topics: ['Média, mediana e moda', 'Desvio padrão e quartis', 'Distribuições', 'Correlação vs causalidade', 'Amostragem', 'Intervalo de confiança', 'Teste de hipótese'],
        },
        {
          id: 'ferramentas',
          title: 'Ferramentas do dia a dia',
          topics: ['Terminal Linux', 'Git e GitHub', 'VS Code', 'Docker básico', 'APIs e requests', 'Formatos: CSV, JSON e Parquet'],
        },
      ],
    },
    {
      id: 'sql',
      title: 'SQL e Modelagem',
      summary: 'A habilidade número um da área. Sem SQL forte, nada do resto funciona.',
      weeks: [
        {
          id: 'sql-essencial',
          title: 'SQL essencial',
          topics: ['SELECT e WHERE', 'ORDER BY e LIMIT', 'Funções de texto e data', 'CASE WHEN', 'GROUP BY e HAVING', 'NULL'],
        },
        {
          id: 'joins-ctes',
          title: 'Joins, subqueries e CTEs',
          topics: ['INNER e LEFT JOIN', 'Joins que duplicam linhas', 'Subqueries', 'CTEs (WITH)', 'UNION', 'Granularidade'],
        },
        {
          id: 'window',
          title: 'Window functions e performance',
          topics: ['ROW_NUMBER e RANK', 'LAG e LEAD', 'Totais acumulados', 'Médias móveis', 'EXPLAIN', 'Índices e particionamento'],
        },
        {
          id: 'modelagem',
          title: 'Modelagem de dados',
          topics: ['OLTP vs OLAP', 'Normalização', 'Fatos e dimensões', 'Star schema', 'Slowly Changing Dimensions', 'Granularidade da fato'],
        },
      ],
    },
    {
      id: 'analise',
      title: 'Análise de Dados e BI',
      summary: 'Transformar dados em respostas, gráficos e decisões.',
      weeks: [
        {
          id: 'pandas',
          title: 'Pandas',
          topics: ['Series e DataFrame', 'Ler e inspecionar dados', 'Limpeza de dados', 'Filtros e novas colunas', 'groupby', 'merge', 'Datas'],
        },
        {
          id: 'visualizacao',
          title: 'Visualização e BI',
          topics: ['Escolher o gráfico certo', 'Matplotlib e Seaborn', 'Power BI', 'DAX básico', 'Dashboards', 'Storytelling com dados'],
        },
        {
          id: 'metricas',
          title: 'Métricas de negócio',
          topics: ['KPIs', 'Funil de conversão', 'Coorte e retenção', 'Ticket médio e LTV', 'Teste A/B', 'Como apresentar resultados'],
        },
      ],
    },
    {
      id: 'engenharia',
      title: 'Engenharia de Dados',
      summary: 'Construir pipelines confiáveis que levam dados da origem até a análise.',
      weeks: [
        {
          id: 'pipelines',
          title: 'Pipelines, ETL e ELT',
          topics: ['ETL vs ELT', 'Batch vs streaming', 'Carga full vs incremental', 'Idempotência', 'Qualidade de dados', 'Python para pipelines'],
        },
        {
          id: 'airflow',
          title: 'Orquestração com Airflow',
          topics: ['O que é orquestração', 'DAGs', 'Operators e tasks', 'Agendamento', 'Backfill', 'Retries e alertas'],
        },
        {
          id: 'spark',
          title: 'Processamento com Spark',
          topics: ['Por que processamento distribuído', 'Spark e PySpark', 'DataFrames e lazy evaluation', 'Partições e shuffle', 'Parquet', 'Spark SQL'],
        },
        {
          id: 'dbt',
          title: 'Transformação com dbt',
          topics: ['O que é dbt', 'Models e ref', 'Sources', 'Materializations', 'Testes', 'Documentação e linhagem'],
        },
      ],
    },
    {
      id: 'cloud',
      title: 'Cloud e Big Data',
      summary: 'Onde os dados moram hoje: data warehouse, lakehouse, cloud e streaming.',
      weeks: [
        {
          id: 'warehouse',
          title: 'Data Warehouse e Lakehouse',
          topics: ['Data Warehouse', 'Data Lake', 'Lakehouse', 'Arquitetura medalhão', 'BigQuery, Snowflake e Databricks', 'Delta Lake e Iceberg'],
        },
        {
          id: 'cloud-provedores',
          title: 'Dados na nuvem',
          topics: ['Armazenamento de objetos (S3)', 'Serviços de dados da AWS', 'Serviços de dados do GCP e Azure', 'IAM e segurança', 'Custos', 'Infraestrutura como código'],
        },
        {
          id: 'streaming',
          title: 'Streaming',
          topics: ['Quando usar streaming', 'Kafka', 'CDC', 'Janelas de tempo', 'Spark Structured Streaming', 'Exactly-once'],
        },
      ],
    },
    {
      id: 'governanca',
      title: 'Governança e Arquitetura',
      summary: 'Dados confiáveis, seguros e bem organizados, e a visão de arquitetura.',
      weeks: [
        {
          id: 'governanca-qualidade',
          title: 'Governança e qualidade',
          topics: ['LGPD', 'Catálogo de dados', 'Linhagem', 'Data contracts', 'Testes de dados', 'Observabilidade de dados'],
        },
        {
          id: 'arquitetura',
          title: 'Arquitetura e carreira',
          topics: ['Modern Data Stack', 'Data Mesh', 'Data System Design', 'Dados para IA e LLMs', 'Analista, engenheiro ou cientista'],
        },
      ],
    },
  ],
  companiesTitle: 'Empresas que usam dados (e contratam)',
  companies: [
    { name: 'iFood', how: 'Plataforma de dados e ML para recomendação, logística e preços.' },
    { name: 'Nubank', how: 'Dados para crédito, prevenção a fraude e produto.' },
    { name: 'Itaú Unibanco', how: 'Grandes times de dados, engenharia e analytics em cloud.' },
    { name: 'Mercado Livre', how: 'Analytics e engenharia de dados para marketplace, pagamentos e logística.' },
    { name: 'Magalu', how: 'Dados de vendas, estoque e marketing para o e-commerce e as lojas.' },
    { name: 'Stone', how: 'Dados de pagamentos, risco e relacionamento com lojistas.' },
    { name: 'Ambev', how: 'Analytics de vendas e cadeia de suprimentos em escala.' },
    { name: 'Airbnb', how: 'Criou o Apache Airflow, hoje padrão de orquestração de pipelines.' },
    { name: 'Netflix', how: 'Dados guiam recomendações e decisões de conteúdo; criou o formato Apache Iceberg.' },
    { name: 'Spotify', how: 'Dados de escuta para recomendações e playlists personalizadas.' },
    { name: 'Uber', how: 'Plataforma de dados em tempo real para preço, rotas e fraude.' },
    { name: 'Databricks', how: 'Fundada pelos criadores do Apache Spark; plataforma lakehouse.' },
  ],
  projects: [
    {
      id: 'eda-publica',
      title: 'Análise exploratória de dados públicos',
      level: 'Iniciante',
      description: 'Escolha uma base aberta (IBGE, dados.gov.br, Kaggle) e responda 5 perguntas com Pandas e gráficos, num notebook bem explicado.',
      skills: ['Python', 'Pandas', 'Visualização', 'Storytelling'],
    },
    {
      id: 'dashboard-vendas',
      title: 'Dashboard de vendas no Power BI',
      level: 'Iniciante',
      description: 'Monte um dashboard com faturamento, ticket médio, top produtos e evolução mensal, com filtros por região.',
      skills: ['Power BI', 'DAX', 'Modelagem', 'KPIs'],
    },
    {
      id: 'sql-olist',
      title: 'Análise SQL do e-commerce brasileiro',
      level: 'Intermediário',
      description: 'Use a base pública da Olist (Kaggle) no PostgreSQL e responda perguntas de negócio com joins, CTEs e window functions.',
      skills: ['SQL', 'Window functions', 'CTEs', 'Métricas'],
    },
    {
      id: 'etl-bcb',
      title: 'Pipeline ETL de cotações',
      level: 'Intermediário',
      description: 'Colete cotações da API do Banco Central todo dia, trate e carregue no PostgreSQL de forma incremental e idempotente.',
      skills: ['Python', 'APIs', 'PostgreSQL', 'Docker', 'Carga incremental'],
    },
    {
      id: 'dbt-dimensional',
      title: 'Modelo dimensional com dbt',
      level: 'Intermediário',
      description: 'Transforme dados brutos em um star schema com dbt, com testes, documentação e linhagem.',
      skills: ['dbt', 'Star schema', 'Testes de dados', 'DuckDB ou BigQuery'],
    },
    {
      id: 'airflow-elt',
      title: 'Pipeline ELT orquestrado',
      level: 'Avançado',
      description: 'Airflow extrai dados de uma API, carrega no warehouse e dispara o dbt, com retries, alertas e backfill.',
      skills: ['Airflow', 'dbt', 'Arquitetura medalhão', 'Docker Compose'],
    },
    {
      id: 'spark-volume',
      title: 'Processamento de grande volume com Spark',
      level: 'Avançado',
      description: 'Processe milhões de linhas de dados abertos (ex.: viagens de táxi de Nova York) com PySpark, salvando em Parquet particionado.',
      skills: ['PySpark', 'Parquet', 'Particionamento', 'Otimização'],
    },
    {
      id: 'streaming-kafka',
      title: 'Pipeline de streaming',
      level: 'Avançado',
      description: 'Eventos de pedidos em Kafka processados em tempo real, com agregações por janela de tempo gravadas num lakehouse.',
      skills: ['Kafka', 'Spark Structured Streaming', 'Janelas', 'Delta Lake'],
    },
  ],
}
