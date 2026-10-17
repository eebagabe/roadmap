# Gabarito: Fundamentos

Abra só depois de tentar.

## Tema 1

1. ```python
   total_pago = sum(p["valor"] for p in pedidos if p["status"] == "pago")       # 230.0
   cancelados = sum(1 for p in pedidos if p["status"] == "cancelado")          # 1
   maior = max(p["valor"] for p in pedidos)                                    # 300.0
   ```
2. ```python
   def agrupar_total(pedidos: list[dict], chave: str) -> dict:
       resultado: dict = {}
       for p in pedidos:
           k = p[chave]
           resultado[k] = resultado.get(k, 0) + p["valor"]
       return resultado

   agrupar_total(pedidos, "cliente")   # {'Ana': 230.0, 'Bruno': 300.0}
   ```
3. ```python
   import csv, json

   with open("vendas.csv", newline="", encoding="utf-8") as f:
       vendas = list(csv.DictReader(f))

   for v in vendas:
       v["quantidade"] = int(v["quantidade"])
       v["preco_unitario"] = float(v["preco_unitario"])
       v["total"] = round(v["quantidade"] * v["preco_unitario"], 2)

   with open("vendas.json", "w", encoding="utf-8") as f:
       json.dump(vendas, f, ensure_ascii=False, indent=2)
   ```
4. `sorted({p["cliente"] for p in pedidos if p["status"] == "pago"})` → `['Ana']`. A compreensão de **set** remove os repetidos; `sorted` devolve uma lista ordenada.
5. `python3 -m venv .venv`, `source .venv/bin/activate`, `pip install pandas`, `pip freeze > requirements.txt`.

## Tema 2

1. Média = 41 / 10 = **4,1**. Ordenado: `[2, 2, 2, 3, 3, 3, 3, 4, 4, 15]` → mediana = (3 + 3) / 2 = **3**. Moda = **3** (aparece 4 vezes). Reportaria a **mediana** (3 dias) como o típico, e mencionaria separadamente que houve uma entrega de 15 dias, que merece investigação. A média de 4,1 não representa nenhuma entrega real.
2. Com o método usado pelo `statistics.quantiles` padrão do Python: Q1 = **2**, Q3 = **4**, IQR = **2**. Limite superior = 4 + 1,5 × 2 = **7**. Como 15 > 7, é **outlier**. (Métodos diferentes de cálculo de quartil podem dar valores um pouco diferentes, como Q1 = 2,25 e Q3 = 3,75 no Pandas, com limite de 6,0; a conclusão é a mesma.)
3. É correlação, não necessariamente causa. Provavelmente quem já compra muito é quem mais se dá ao trabalho de instalar o app (causalidade invertida ou fator comum: clientes mais engajados). Obrigar todos a usar o app pode não aumentar as compras e ainda afastar clientes. Para saber, seria preciso um experimento (por exemplo, incentivo ao app para um grupo aleatório e comparação com um grupo de controle).
4. **Viés de não resposta / autosseleção:** só 8% responderam, e quem responde pode ser diferente de quem não responde (mais engajados, ou com opinião mais forte). **Viés de canal:** só quem lê e-mail foi alcançado. O 90% vale para quem respondeu, não para todos os clientes.
5. "Se as duas versões fossem na verdade iguais, a chance de vermos uma diferença tão grande quanto a que vimos, só por acaso, seria de 3%. Como isso é pouco provável, consideramos que a diferença é real. Isso não diz se a diferença é grande o suficiente para valer a pena: para isso olhamos o tamanho do efeito e o intervalo de confiança."

## Tema 3

1. ```bash
   wc -l arquivo.csv          # linhas (inclui o cabeçalho)
   head -n 1 arquivo.csv      # cabeçalho
   grep -c "palavra" arquivo.csv
   ```
2. `.gitignore` sugerido: `.venv/`, `__pycache__/`, `.ipynb_checkpoints/`, `.env`, `dados/brutos/`, `*.parquet` (se forem grandes). Commits como "chore: estrutura do projeto", "feat: coleta da API", "docs: README".
3. Prática. Host `localhost`, porta `5432`, usuário `postgres`, senha `senha`.
4. ```python
   import requests, statistics as st
   from datetime import date, timedelta

   fim = date.today()
   ini = fim - timedelta(days=30)
   url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados"
   params = {"formato": "json", "dataInicial": ini.strftime("%d/%m/%Y"), "dataFinal": fim.strftime("%d/%m/%Y")}
   dados = requests.get(url, params=params, timeout=30).json()
   valores = [float(d["valor"]) for d in dados]
   print(min(valores), max(valores), round(st.mean(valores), 4))
   ```
   Repare que só há cotação em **dias úteis**: 30 dias corridos dão cerca de 21 valores.
5. Resposta pessoal. Em geral o Parquet fica várias vezes menor que o CSV e a leitura é mais rápida, principalmente lendo só algumas colunas.

## Projeto da etapa

O que um avaliador olharia:

- `timeout` e `raise_for_status()` na chamada da API.
- Datas convertidas para tipo data (`pd.to_datetime(..., dayfirst=True)` ou `datetime.strptime`) e valores para número.
- README com como rodar do zero (`venv`, `pip install -r requirements.txt`, comando de execução).
- Dados gerados fora do Git (ou só uma amostra pequena versionada).
