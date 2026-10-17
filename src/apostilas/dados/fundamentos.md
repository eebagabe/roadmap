# Fundamentos — Apostila Prática

Roadmap Analista e Engenheiro de Dados · Semanas 01 a 03

## Comece por aqui

Esta etapa é a base comum de quem vai ser Analista **ou** Engenheiro de Dados: programar em Python o suficiente para manipular dados, entender a estatística por trás dos números e usar as ferramentas do dia a dia (terminal, Git, Docker, APIs).

### Por que isso vale ouro no mercado

- Python é a linguagem mais usada em dados, de análises em notebook a pipelines em produção.
- Estatística evita conclusões erradas que custam caro ("as vendas subiram por causa da campanha?").
- Saber Git, terminal e Docker é o que diferencia quem só faz análise no próprio computador de quem entrega trabalho reproduzível.

### Como esta apostila funciona

1. Rode todos os exemplos num **Jupyter Notebook** (ou no Google Colab, que é gratuito e não precisa instalar nada).
2. Antes de executar uma célula, tente prever o resultado.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** erro em Python? Leia a **última linha** da mensagem (o tipo do erro) e depois a linha do seu código indicada acima dela. `KeyError`, `TypeError` e `IndentationError` dizem muito.

### Preparando o ambiente

```bash
# Python 3.11 ou mais novo
python3 --version

# ambiente virtual para o projeto
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install pandas jupyterlab requests matplotlib
jupyter lab
```

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 01 | Tema 1 — Python para dados |
| 02 | Tema 2 — Estatística essencial |
| 03 | Tema 3 — Ferramentas do dia a dia + projeto |

## Tema 1 — Python para dados

**Objetivo:** escrever Python simples e limpo para ler, transformar e salvar dados.

### 1.1 Tipos e variáveis

```python
nome = "Ana"            # str
idade = 29              # int
salario = 5500.50       # float
ativo = True            # bool
gerente = None          # ausência de valor

print(type(salario))    # <class 'float'>
print(f"{nome} tem {idade} anos")   # f-string
```

> **Cuidado! Cai na entrevista:** `0.1 + 0.2 == 0.3` dá `False` em Python (e em quase toda linguagem), por causa da forma como o computador guarda números decimais. Para dinheiro, use `decimal.Decimal` ou trabalhe em centavos (inteiros).

### 1.2 Listas, dicionários e sets

```python
# lista: ordenada, aceita repetidos
vendas = [120.0, 85.5, 300.0, 85.5]
vendas.append(50.0)
print(vendas[0], vendas[-1], vendas[1:3])   # primeiro, último, fatia

# dicionário: chave -> valor
cliente = {"id": 1, "nome": "Ana", "cidade": "Recife"}
print(cliente["nome"])
print(cliente.get("email", "sem e-mail"))   # não quebra se a chave não existir

# set: sem repetidos
cidades = {"Recife", "Natal", "Recife"}
print(cidades)          # {'Recife', 'Natal'}
```

Uma lista de dicionários é a forma mais comum de representar "linhas de uma tabela" em Python puro:

```python
pedidos = [
    {"cliente": "Ana", "valor": 150.0, "status": "pago"},
    {"cliente": "Bruno", "valor": 300.0, "status": "cancelado"},
    {"cliente": "Ana", "valor": 80.0, "status": "pago"},
]
```

### 1.3 Funções

```python
def ticket_medio(valores: list[float]) -> float:
    """Retorna a média dos valores, ou 0 se a lista estiver vazia."""
    if not valores:
        return 0.0
    return sum(valores) / len(valores)

print(ticket_medio([100, 200, 300]))   # 200.0
```

Funções pequenas, com nome claro e docstring, tornam notebooks e pipelines muito mais fáceis de manter.

### 1.4 Laços e compreensões

```python
# laço comum
total_pago = 0
for p in pedidos:
    if p["status"] == "pago":
        total_pago += p["valor"]

# compreensão de lista: mesmo resultado, mais curto
total_pago = sum(p["valor"] for p in pedidos if p["status"] == "pago")

# compreensão de dicionário
valor_por_cliente = {}
for p in pedidos:
    valor_por_cliente[p["cliente"]] = valor_por_cliente.get(p["cliente"], 0) + p["valor"]
```

### 1.5 Ler e escrever CSV e JSON

```python
import csv
import json

with open("pedidos.csv", newline="", encoding="utf-8") as f:
    linhas = list(csv.DictReader(f))           # lista de dicionários (tudo como texto!)

for linha in linhas:
    linha["valor"] = float(linha["valor"])     # converta os tipos

with open("pedidos.json", "w", encoding="utf-8") as f:
    json.dump(linhas, f, ensure_ascii=False, indent=2)
```

> **Na prática:** arquivos brasileiros muitas vezes usam `;` como separador e `,` como decimal, e codificação `latin-1`. Se aparecerem caracteres estranhos (`Ã§`), o problema é a codificação. No Pandas: `pd.read_csv("arq.csv", sep=";", decimal=",", encoding="latin-1")`.

### 1.6 Ambientes virtuais

Cada projeto tem suas bibliotecas em versões próprias. O **ambiente virtual** (`venv`) isola isso. Registre as dependências:

```bash
pip freeze > requirements.txt     # salva
pip install -r requirements.txt   # recria em outra máquina
```

Ferramentas mais modernas como **uv** e **Poetry** fazem o mesmo de forma mais rápida e organizada.

### 1.7 Jupyter Notebook

Ótimo para **explorar**: código, resultado, gráfico e texto juntos. Boas práticas:

- Execute de cima para baixo ("Restart & Run All" antes de compartilhar).
- Use células Markdown para explicar o raciocínio.
- Quando o código vira rotina, mova para um arquivo `.py` (notebook não é bom para produção).

### Atividades de fixação — Tema 1

1. Com a lista `pedidos` acima: calcule o total pago, a quantidade de pedidos cancelados e o maior valor.
2. Escreva uma função `agrupar_total(pedidos, chave)` que retorna um dicionário com a soma de `valor` por `chave` (ex.: por cliente, por status).
3. Crie um CSV com 5 vendas (data, produto, quantidade, preco_unitario), leia com o módulo `csv`, calcule o total de cada venda e salve em JSON.
4. Use uma compreensão de lista para obter os nomes **únicos** dos clientes que têm pedido pago, em ordem alfabética.
5. Crie um ambiente virtual, instale `pandas` e gere o `requirements.txt`.

## Tema 2 — Estatística essencial

**Objetivo:** resumir dados corretamente e não tirar conclusões erradas.

### 2.1 Média, mediana e moda

- **Média:** soma dividida pela quantidade. Sensível a valores extremos.
- **Mediana:** o valor do meio quando ordenado. Resistente a extremos.
- **Moda:** o valor mais frequente.

```python
import statistics as st
salarios = [3000, 3200, 3500, 3800, 4000, 50000]   # um diretor na amostra
print(st.mean(salarios))     # 11250  (distorcida pelo 50000)
print(st.median(salarios))   # 3650   (representa melhor a "pessoa típica")
```

> **Cuidado! Cai na entrevista:** para renda, preço de imóveis e tempo de entrega, quase sempre a **mediana** descreve melhor o típico. Reportar só a média pode enganar.

### 2.2 Desvio padrão e quartis

- **Desvio padrão:** o quanto os valores costumam se afastar da média. Dois produtos com média de entrega de 3 dias podem ter desvios bem diferentes (um sempre 3, outro entre 1 e 10).
- **Quartis:** dividem os dados ordenados em 4 partes. Q1 (25%), Q2 (mediana), Q3 (75%). **IQR** = Q3 − Q1.
- **Outliers:** uma regra comum considera suspeito o que está abaixo de Q1 − 1,5×IQR ou acima de Q3 + 1,5×IQR. O **boxplot** mostra isso num gráfico.

### 2.3 Distribuições

- **Normal** (sino): altura, erros de medição. Cerca de 68% dos dados ficam a 1 desvio padrão da média e cerca de 95% a 2.
- **Assimétrica à direita** (cauda longa): renda, valor de compras, tempo de sessão. Média maior que a mediana.
- Sempre olhe o **histograma** antes de resumir os dados.

### 2.4 Correlação vs causalidade

**Correlação** mede o quanto duas variáveis andam juntas (de −1 a 1). Não prova que uma **causa** a outra.

Exemplos clássicos: vendas de sorvete e afogamentos sobem juntas (a causa comum é o calor); bairros com mais bombeiros têm mais incêndios (bairros maiores têm os dois).

Para afirmar causa, é preciso um **experimento controlado** (como um teste A/B) ou métodos estatísticos específicos.

### 2.5 Amostragem

Analisar uma amostra só funciona se ela **representa** a população.

- **Viés de seleção:** pesquisa de satisfação respondida só por quem quis responder (geralmente os muito satisfeitos ou muito insatisfeitos).
- **Viés de sobrevivência:** analisar só as empresas que deram certo e concluir o que "funciona".

### 2.6 Intervalo de confiança e teste de hipótese

- **Intervalo de confiança:** "a taxa de conversão é 4,2%, com IC de 95% entre 3,8% e 4,6%". Dá a **incerteza** da estimativa.
- **Teste de hipótese:** começa com a **hipótese nula** (H0: "não há diferença"). O **p-valor** é a probabilidade de ver um resultado tão extremo **se H0 fosse verdadeira**. Se p < 0,05 (nível comum), rejeita-se H0.

> **Cuidado! Cai na entrevista:** p-valor **não** é "a probabilidade de a hipótese ser verdadeira". E "estatisticamente significativo" não quer dizer "importante": uma diferença de 0,01% pode ser significativa com milhões de usuários e não valer nada para o negócio.

### Atividades de fixação — Tema 2

1. Tempos de entrega (dias): `[2, 3, 3, 4, 3, 2, 15, 3, 4, 2]`. Calcule média, mediana e moda. Qual você reportaria ao diretor e por quê?
2. Para a mesma lista, calcule Q1, Q3, IQR e diga se 15 é outlier pela regra do 1,5×IQR.
3. Um analista concluiu: "clientes que usam o app compram 40% mais, então devemos obrigar todos a usar o app". O que está errado?
4. Uma pesquisa de satisfação foi enviada por e-mail e 8% responderam; 90% estavam satisfeitos. Quais vieses podem existir?
5. Explique, para alguém de negócios, o que significa "p-valor = 0,03" num teste A/B.

## Tema 3 — Ferramentas do dia a dia

**Objetivo:** trabalhar de forma reproduzível, versionada e automatizável.

### 3.1 Terminal Linux

```bash
pwd                         # onde estou
ls -lh                      # listar com tamanhos
cd dados/                   # entrar na pasta
head -n 5 vendas.csv        # primeiras linhas (ótimo para ver arquivo enorme)
wc -l vendas.csv            # quantas linhas
grep "Recife" vendas.csv | wc -l   # quantas linhas têm "Recife"
du -sh dados/               # tamanho da pasta
```

Para arquivos de vários GB, ler as primeiras linhas no terminal é muito mais rápido que abrir no Excel.

### 3.2 Git e GitHub

Versione notebooks, scripts e SQL. Seu GitHub é o portfólio.

```bash
git init
echo ".venv/\ndados/brutos/\n.env" > .gitignore   # nunca versione dados grandes, segredos ou o venv
git add .
git commit -m "feat: análise exploratória de vendas"
```

### 3.3 VS Code

Extensões úteis: Python, Jupyter, Pylance, SQLTools, Rainbow CSV, Docker. Dá para rodar notebooks direto no VS Code.

### 3.4 Docker básico

Docker roda programas em **containers** isolados, sem instalar no seu computador. Essencial para subir bancos e ferramentas de dados.

```bash
docker run --name pg -e POSTGRES_PASSWORD=senha -p 5432:5432 -d postgres:16
docker ps                    # containers rodando
docker logs pg               # logs
docker stop pg && docker rm pg
```

### 3.5 APIs e requests

Muitos dados vêm de APIs. Exemplo com a API de dados abertos do Banco Central (série 1 = cotação do dólar):

```python
import requests

url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados"
params = {"formato": "json", "dataInicial": "01/09/2025", "dataFinal": "30/09/2025"}
resp = requests.get(url, params=params, timeout=30)
resp.raise_for_status()                   # erro se status 4xx/5xx
cotacoes = resp.json()                    # lista de {"data": "dd/mm/aaaa", "valor": "5.xx"}
print(cotacoes[:3])
```

Boas práticas: sempre `timeout`; tratar erros; respeitar limites de requisição; guardar chaves de API em variáveis de ambiente.

### 3.6 Formatos: CSV, JSON e Parquet

| Formato | Como guarda | Vantagens | Desvantagens |
|---|---|---|---|
| CSV | Texto, por linha | Universal, abre em qualquer lugar | Sem tipos, grande, problemas com separador |
| JSON | Texto, aninhado | Ótimo para APIs e dados com estrutura variável | Grande e lento para análise |
| **Parquet** | Binário, **por coluna**, comprimido | Pequeno, rápido, guarda tipos, lê só as colunas necessárias | Não dá para abrir num editor de texto |

```python
import pandas as pd
df = pd.read_csv("vendas.csv")
df.to_parquet("vendas.parquet")          # costuma ficar várias vezes menor
pd.read_parquet("vendas.parquet", columns=["data", "valor"])   # lê só 2 colunas
```

> **Cuidado! Cai na entrevista:** "Por que Parquet é melhor para analytics?" Armazenamento **colunar**: consultas analíticas leem poucas colunas de muitas linhas, e o Parquet lê só essas colunas; além disso, colunas com valores parecidos comprimem muito bem.

### Atividades de fixação — Tema 3

1. Baixe um CSV grande de dados abertos e, **só com o terminal**, descubra: número de linhas, o cabeçalho e quantas linhas contêm uma palavra específica.
2. Crie um repositório com `.gitignore` adequado para um projeto de dados e faça 3 commits com mensagens claras.
3. Suba um PostgreSQL com Docker e conecte nele pelo VS Code (SQLTools) ou pelo DBeaver.
4. Busque na API do Banco Central a cotação do dólar dos últimos 30 dias e calcule mínimo, máximo e média.
5. Salve um mesmo DataFrame em CSV e em Parquet e compare os tamanhos dos arquivos e o tempo de leitura.

## Projeto da etapa

**Coletor de cotações:**

1. Script Python que busca a cotação do dólar (e de outra série do Banco Central à sua escolha) de um período.
2. Trata os tipos (data como data, valor como número).
3. Salva em CSV e Parquet numa pasta `dados/`.
4. Gera um resumo estatístico (mínimo, máximo, média, mediana, desvio padrão) e um gráfico de linha.
5. Projeto com `venv`, `requirements.txt`, `.gitignore`, README explicando como rodar, publicado no GitHub.

Esse script vira a semente do pipeline ETL da etapa de Engenharia.

## Resumão

- Python: listas, dicionários, funções e compreensões resolvem muita coisa antes mesmo do Pandas.
- Cuidado com separador, decimal e codificação de arquivos brasileiros.
- Mediana resiste a extremos; olhe sempre a distribuição.
- Correlação não é causalidade; cuidado com amostras enviesadas.
- p-valor não é a probabilidade da hipótese; significância estatística não é importância.
- Terminal, Git e Docker tornam o trabalho reproduzível.
- Parquet: colunar, comprimido, tipado. Padrão para analytics.
