# Análise de Dados e BI — Apostila Prática

Roadmap Analista e Engenheiro de Dados · Semanas 08 a 10

## Comece por aqui

Analisar dados é **responder perguntas de negócio** com evidência. Ferramentas (Pandas, Power BI) são o meio. O fim é alguém tomar uma decisão melhor: qual campanha manter, qual região precisa de atenção, se a nova funcionalidade funcionou.

### Por que isso vale ouro no mercado

- Analista de Dados e de BI estão entre as portas de entrada mais comuns na área.
- Pandas é a biblioteca de dados mais usada em Python; Power BI é muito comum nas empresas brasileiras.
- O que diferencia um bom analista: saber **qual pergunta** responder, escolher a **métrica certa** e **comunicar** de forma simples.

### Como esta apostila funciona

1. Use um dataset real: a base pública da **Olist** (Kaggle) usada na etapa de SQL, ou qualquer base do portal dados.gov.br.
2. Pandas no Jupyter; Power BI Desktop (gratuito, Windows) ou, alternativamente, Looker Studio (gratuito, no navegador).
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** número estranho no resultado? Antes de mexer no código, confira os dados de entrada: quantidade de linhas, duplicados, nulos e tipos (`df.info()`). A maioria dos erros de análise está nos dados, não na conta.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 08 | Tema 1 — Pandas |
| 09 | Tema 2 — Visualização e BI |
| 10 | Tema 3 — Métricas de negócio + projeto |

## Tema 1 — Pandas

**Objetivo:** carregar, limpar, transformar e resumir dados tabulares.

### 1.1 Series e DataFrame

- **Series:** uma coluna (valores + índice).
- **DataFrame:** uma tabela (várias Series com o mesmo índice).

```python
import pandas as pd

df = pd.DataFrame({
    "pedido": [101, 102, 103, 104],
    "cliente": ["Ana", "Ana", "Bruno", "Carla"],
    "valor": [58.0, 280.0, 80.0, 65.0],
    "status": ["PAGO", "PAGO", "CANCELADO", "PAGO"],
})
```

### 1.2 Ler e inspecionar dados

```python
pedidos = pd.read_csv("olist_orders_dataset.csv", parse_dates=["order_purchase_timestamp"])

pedidos.shape          # (linhas, colunas)
pedidos.head()         # primeiras linhas
pedidos.info()         # tipos e nulos por coluna
pedidos.describe()     # estatísticas das colunas numéricas
pedidos["order_status"].value_counts()   # frequência de cada valor
pedidos.isna().sum()   # nulos por coluna
pedidos.duplicated().sum()
```

Sempre comece por aqui. É o "exame" dos dados.

### 1.3 Limpeza de dados

```python
df = df.drop_duplicates()                                 # remove linhas duplicadas
df["cidade"] = df["cidade"].str.strip().str.title()        # " recife " -> "Recife"
df["valor"] = pd.to_numeric(df["valor"], errors="coerce") # texto inválido vira NaN
df["data"] = pd.to_datetime(df["data"], dayfirst=True)     # "15/03/2025"
df = df.dropna(subset=["valor"])                           # remove linhas sem valor
df["cupom"] = df["cupom"].fillna("SEM_CUPOM")
```

> **Cuidado! Cai na entrevista:** "Você tem nulos na coluna de renda. O que faz?" Não existe resposta única: **entenda por que** estão nulos (não informado? erro de coleta?), meça quantos são, e decida: remover linhas, preencher (mediana, valor padrão, categoria "desconhecido") ou manter e tratar na análise. E **documente** a decisão.

### 1.4 Filtros e novas colunas

```python
pagos = df[df["status"] == "PAGO"]
grandes = df[(df["valor"] > 100) & (df["status"] == "PAGO")]   # & e |, com parênteses
recife_natal = df[df["cidade"].isin(["Recife", "Natal"])]

df["valor_com_frete"] = df["valor"] + df["frete"]
df["faixa"] = pd.cut(df["valor"], bins=[0, 50, 200, float("inf")], labels=["baixo", "médio", "alto"])
df["eh_pago"] = df["status"].eq("PAGO")
```

Evite `for` linha a linha: operações **vetorizadas** (na coluna inteira) são muito mais rápidas.

### 1.5 groupby

```python
resumo = (
    df[df["status"] == "PAGO"]
    .groupby("cliente")
    .agg(pedidos=("pedido", "count"), gasto=("valor", "sum"), ticket_medio=("valor", "mean"))
    .sort_values("gasto", ascending=False)
    .reset_index()
)
```

É o `GROUP BY` do SQL. `pivot_table` cria tabelas cruzadas (linhas × colunas):

```python
pd.pivot_table(df, index="cidade", columns="status", values="valor", aggfunc="sum", fill_value=0)
```

### 1.6 merge

É o `JOIN` do SQL:

```python
pedidos_clientes = pedidos.merge(clientes, on="customer_id", how="left", validate="many_to_one")
```

O parâmetro `validate` **confere a granularidade**: se `clientes` tivesse IDs duplicados, o merge falharia em vez de duplicar linhas silenciosamente. Confira sempre o `shape` antes e depois de um merge.

### 1.7 Datas

```python
df["mes"] = df["data"].dt.to_period("M")
df["dia_semana"] = df["data"].dt.day_name()
df["dias_para_entrega"] = (df["entregue_em"] - df["comprado_em"]).dt.days

mensal = df.set_index("data").resample("MS")["valor"].sum()   # soma por mês
```

### Atividades de fixação — Tema 1

1. Carregue a tabela de pedidos da Olist e responda: quantas linhas, quantos status diferentes e quantos nulos em cada coluna de data.
2. Calcule, para pedidos entregues, o tempo de entrega em dias e a diferença para o prazo estimado. Que % chegou atrasado?
3. Junte pedidos, itens e clientes e calcule o faturamento por estado. Confira o `shape` em cada passo.
4. Monte uma tabela com faturamento mensal e o crescimento percentual mês a mês (`pct_change`).
5. Uma coluna de preço veio como texto `"R$ 1.234,56"`. Converta para número.

## Tema 2 — Visualização e BI

**Objetivo:** escolher o gráfico certo e montar dashboards que as pessoas entendem em segundos.

### 2.1 Escolher o gráfico certo

| Pergunta | Gráfico |
|---|---|
| Como mudou ao longo do tempo? | **Linha** |
| Qual categoria é maior? | **Barras** (horizontais se os nomes forem longos), ordenadas |
| Como se distribui? | **Histograma**, boxplot |
| Duas variáveis se relacionam? | **Dispersão** |
| Qual a parte de um todo? | Barras empilhadas ou 100%; **pizza só com 2 ou 3 fatias** |
| Um número importante | **Cartão** (KPI) com comparação |

Regras que melhoram qualquer gráfico:

- Título que diz a **conclusão** ("Vendas caíram 12% em março"), não só o tema ("Vendas por mês").
- Eixo de barras começa no **zero**.
- Poucas cores; destaque só o que importa.
- Sem 3D, sem sombras, sem enfeite.
- Rótulos legíveis e unidades (R$, %, dias).

### 2.2 Matplotlib e Seaborn

```python
import matplotlib.pyplot as plt
import seaborn as sns

ax = mensal.plot(kind="line", marker="o", figsize=(10, 4))
ax.set_title("Faturamento cresceu 3x entre janeiro e novembro")
ax.set_ylabel("R$")
plt.tight_layout()
plt.show()

top = resumo.head(10).sort_values("gasto")
plt.barh(top["cliente"], top["gasto"])
plt.title("Top 10 clientes por gasto")
plt.show()

sns.histplot(df["dias_para_entrega"], bins=30)
sns.boxplot(data=df, x="estado", y="dias_para_entrega")
```

### 2.3 Power BI

Fluxo de trabalho:

1. **Obter dados:** CSV, Excel, banco (PostgreSQL, SQL Server), BigQuery.
2. **Power Query:** limpar e transformar (tipos, remover colunas, mesclar). Cada passo fica registrado e se repete na atualização.
3. **Modelo:** relacionar as tabelas em **star schema** (fato no centro, dimensões em volta). Crie uma tabela de **calendário**.
4. **Medidas DAX:** os cálculos.
5. **Visual:** cartões, linhas, barras, matriz, filtros (segmentações).
6. **Publicar** no Power BI Service e agendar atualização.

### 2.4 DAX básico

```dax
Faturamento = SUM(fato_vendas[valor])

Pedidos = DISTINCTCOUNT(fato_vendas[pedido_id])

Ticket Médio = DIVIDE([Faturamento], [Pedidos])

Faturamento Pago = CALCULATE([Faturamento], fato_vendas[status] = "PAGO")

Faturamento Ano Anterior = CALCULATE([Faturamento], SAMEPERIODLASTYEAR(dim_calendario[data]))

Crescimento % = DIVIDE([Faturamento] - [Faturamento Ano Anterior], [Faturamento Ano Anterior])
```

- **Medida** é calculada no contexto do visual (filtros, linha da tabela). Prefira medidas a colunas calculadas para agregações.
- `CALCULATE` muda o contexto de filtro: é a função mais importante do DAX.
- `DIVIDE` evita erro de divisão por zero.
- Funções de inteligência de tempo (`SAMEPERIODLASTYEAR`, `DATESYTD`) precisam de uma tabela de calendário marcada como tabela de datas.

> **Cuidado! Cai na entrevista:** "Diferença entre coluna calculada e medida?" Coluna calculada é calculada **linha a linha na atualização** e ocupa memória; medida é calculada **na hora**, conforme os filtros do visual. Ticket médio é medida (média de uma coluna calculada por linha daria o resultado errado em agregados).

### 2.5 Dashboards

Um bom dashboard:

- Tem **um público e um objetivo** (diretoria acompanha resultado; time de operação acompanha atrasos).
- Segue a leitura em "Z": **KPIs no topo** (com comparação: vs meta, vs período anterior), tendências no meio, detalhes embaixo.
- Cabe numa tela, com no máximo uns 6 a 8 visuais.
- Tem filtros úteis (período, região) e definições claras das métricas.

### 2.6 Storytelling com dados

Estrutura para apresentar uma análise:

1. **Contexto:** qual a pergunta e por que ela importa.
2. **Conflito:** o que os dados mostram de surpreendente ou preocupante.
3. **Resolução:** a recomendação, com o impacto esperado.

> **Na prática:** comece pela **conclusão** ("Recomendo aumentar o prazo prometido no Norte: 30% dos pedidos atrasam e a nota de avaliação cai pela metade"). Depois mostre a evidência. Gestores têm pouco tempo.

### Atividades de fixação — Tema 2

1. Qual gráfico você usaria para: (a) faturamento dos últimos 24 meses; (b) participação de 3 meios de pagamento; (c) relação entre tempo de entrega e nota da avaliação; (d) faturamento das 15 categorias.
2. Reescreva o título "Vendas por região" para que diga a conclusão, sabendo que o Nordeste cresceu 40% e as outras regiões ficaram estáveis.
3. Faça com Seaborn um boxplot do tempo de entrega por estado (Olist). Quais estados têm entregas mais lentas e mais variáveis?
4. Escreva as medidas DAX: faturamento, quantidade de pedidos, ticket médio e % de pedidos atrasados.
5. Esboce (papel ou ferramenta) um dashboard de vendas para a diretoria: quais KPIs, quais gráficos e quais filtros?

## Tema 3 — Métricas de negócio

**Objetivo:** escolher, calcular e interpretar as métricas que o negócio usa para decidir.

### 3.1 KPIs

**KPI** (indicador-chave de desempenho) é a métrica que mostra se um objetivo está sendo atingido. Um bom KPI:

- Está ligado a um **objetivo** ("aumentar recompra").
- Tem **definição precisa** (o que entra, o que não entra, qual período).
- Tem **comparação** (meta, período anterior).
- Pode ser **influenciado** por ações do time.

Cuidado com **métricas de vaidade**: número total de downloads, seguidores, pageviews. Crescem sempre e não ajudam a decidir.

### 3.2 Funil de conversão

Sequência de etapas até o objetivo, com a taxa de passagem em cada uma:

| Etapa | Usuários | Conversão da etapa | Conversão total |
|---|---|---|---|
| Visitou | 100.000 | — | 100% |
| Viu produto | 40.000 | 40% | 40% |
| Adicionou ao carrinho | 8.000 | 20% | 8% |
| Iniciou checkout | 4.000 | 50% | 4% |
| Comprou | 2.400 | 60% | 2,4% |

A maior **perda absoluta** e as etapas com conversão abaixo do esperado mostram onde investir.

### 3.3 Coorte e retenção

**Coorte** é um grupo de clientes que começou no mesmo período (ex.: primeira compra em janeiro). A análise de coorte acompanha cada grupo ao longo do tempo:

| Coorte | Mês 0 | Mês 1 | Mês 2 | Mês 3 |
|---|---|---|---|---|
| Jan | 100% | 22% | 15% | 12% |
| Fev | 100% | 25% | 17% | — |
| Mar | 100% | 31% | — | — |

Leitura: a retenção no mês 1 está **melhorando** (22% → 25% → 31%), um efeito que a média geral esconderia.

```python
compras["mes_compra"] = compras["data"].dt.to_period("M")
compras["coorte"] = compras.groupby("cliente")["mes_compra"].transform("min")
compras["idade"] = (compras["mes_compra"] - compras["coorte"]).apply(lambda x: x.n)
tabela = compras.groupby(["coorte", "idade"])["cliente"].nunique().unstack()
retencao = tabela.div(tabela[0], axis=0)
```

### 3.4 Ticket médio e LTV

- **Ticket médio** = faturamento / número de pedidos.
- **Frequência** = pedidos / clientes.
- **LTV** (lifetime value): quanto um cliente gera ao longo do relacionamento. Uma aproximação simples: ticket médio × frequência por período × tempo de vida esperado × margem.
- **CAC** (custo de aquisição de cliente): gasto de marketing / clientes novos. A relação **LTV/CAC** indica se adquirir clientes compensa.

### 3.5 Teste A/B

Comparar duas versões com usuários **sorteados** aleatoriamente: A (controle) e B (variação). Por ser aleatório, a diferença no resultado pode ser atribuída à mudança (causalidade).

Passos:

1. **Hipótese:** "o botão verde aumenta a conversão do checkout".
2. **Métrica principal** definida antes (e métricas de proteção, como cancelamentos).
3. **Tamanho da amostra** calculado antes de começar (depende da conversão atual e do menor efeito que importa).
4. Rodar pelo tempo planejado (ciclos completos, como semanas inteiras).
5. Analisar: diferença, intervalo de confiança e p-valor.

```python
from statsmodels.stats.proportion import proportions_ztest
conversoes = [480, 540]      # A, B
usuarios = [10000, 10000]
estat, p = proportions_ztest(conversoes, usuarios)
print(f"A: {480/10000:.2%}  B: {540/10000:.2%}  p-valor: {p:.3f}")
```

> **Cuidado! Cai na entrevista:** o erro clássico é **espiar** o teste todo dia e parar assim que o p-valor fica abaixo de 0,05. Isso aumenta muito a chance de um falso positivo. Defina a duração antes e respeite.

### 3.6 Como apresentar resultados

- Responda a pergunta na **primeira frase**.
- Números com contexto: "R$ 1,2 milhão (+15% vs ano anterior)".
- Diga o grau de confiança e as limitações ("dados de devolução só a partir de março").
- Termine com **recomendação** e próximo passo.
- Uma página ou poucos slides. Detalhes no apêndice.

### Atividades de fixação — Tema 3

1. Defina 3 KPIs para um app de delivery e escreva a definição exata de cada um (o que entra, o que não entra, período).
2. Com o funil da seção 3.2: se você pudesse aumentar em 10 pontos percentuais a conversão de **uma** etapa, qual escolheria para ganhar mais vendas? Mostre a conta.
3. Monte a tabela de coorte de recompra da Olist (por mês da primeira compra). O que você observa? (Dica: a Olist tem recompra muito baixa.)
4. Um teste A/B teve A = 4,8% e B = 5,4% de conversão com 10 mil usuários em cada. Calcule o p-valor e escreva a conclusão para o gerente de produto.
5. Escreva, em até 5 frases, a apresentação de um achado: "pedidos que atrasam têm nota média 2,5 contra 4,3 dos que chegam no prazo".

## Projeto da etapa

**Análise completa + dashboard:**

1. Escolha uma pergunta de negócio na base Olist (ex.: "o que mais influencia a nota de avaliação?" ou "onde estão os maiores problemas de entrega?").
2. Notebook com: inspeção e limpeza documentadas, análise com Pandas, 4 a 6 gráficos com títulos-conclusão.
3. Dashboard no Power BI (ou Looker Studio) com star schema, tabela calendário, medidas DAX e KPIs com comparação.
4. Resumo executivo de 1 página: pergunta, achados, recomendação.
5. Publique o notebook e prints do dashboard no GitHub; se possível, publique o dashboard.

## Resumão

- Comece sempre inspecionando: `shape`, `info`, `isna`, `duplicated`, `value_counts`.
- Limpeza é decisão: documente o que fez com nulos, duplicados e outliers.
- `groupby` = GROUP BY; `merge` = JOIN (use `validate`).
- Gráfico certo para a pergunta; título que diz a conclusão; barras começam no zero.
- Power BI: Power Query → star schema → medidas DAX → visual. `CALCULATE` é o coração do DAX.
- KPIs precisam de definição, comparação e ligação com objetivo.
- Coorte revela tendências escondidas; teste A/B é o caminho para causalidade.
- Apresente pela conclusão.
