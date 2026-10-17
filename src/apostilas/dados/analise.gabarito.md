# Gabarito: Análise de Dados e BI

Abra só depois de tentar. Os nomes das colunas seguem a base pública da Olist; números exatos dependem da versão do arquivo.

## Tema 1

1. ```python
   pedidos = pd.read_csv("olist_orders_dataset.csv")
   print(pedidos.shape)
   print(pedidos["order_status"].nunique(), pedidos["order_status"].value_counts())
   print(pedidos.filter(like="date").isna().sum())
   print(pedidos["order_purchase_timestamp"].isna().sum())
   ```
   Esperado: cerca de 99 mil pedidos, 8 status (a grande maioria `delivered`), e nulos nas datas de aprovação, envio e entrega (pedidos cancelados ou ainda não entregues não têm essas datas).
2. ```python
   cols = ["order_purchase_timestamp", "order_delivered_customer_date", "order_estimated_delivery_date"]
   pedidos[cols] = pedidos[cols].apply(pd.to_datetime)
   entregues = pedidos[pedidos["order_status"] == "delivered"].dropna(subset=["order_delivered_customer_date"])
   entregues["dias_entrega"] = (entregues["order_delivered_customer_date"] - entregues["order_purchase_timestamp"]).dt.days
   entregues["atraso_dias"] = (entregues["order_delivered_customer_date"] - entregues["order_estimated_delivery_date"]).dt.days
   print(f"{(entregues['atraso_dias'] > 0).mean():.1%} chegaram atrasados")
   ```
   O resultado costuma ficar perto de 8%.
3. ```python
   itens = pd.read_csv("olist_order_items_dataset.csv")
   clientes = pd.read_csv("olist_customers_dataset.csv")
   print(pedidos.shape, itens.shape, clientes.shape)
   base = (itens.merge(pedidos, on="order_id", how="inner", validate="many_to_one")
                .merge(clientes, on="customer_id", how="left", validate="many_to_one"))
   print(base.shape)   # deve ter o mesmo número de linhas de 'itens' (grão: item)
   por_uf = base.groupby("customer_state")["price"].sum().sort_values(ascending=False)
   ```
   SP lidera com folga. Se o `shape` final for maior que o de `itens`, há duplicação: o `validate` já teria acusado.
4. ```python
   base["mes"] = pd.to_datetime(base["order_purchase_timestamp"]).dt.to_period("M")
   mensal = base.groupby("mes")["price"].sum().to_frame("faturamento")
   mensal["crescimento_pct"] = mensal["faturamento"].pct_change() * 100
   ```
   Repare que os primeiros e os últimos meses da base têm poucos pedidos (início e fim da coleta): comente isso em vez de concluir que houve "queda".
5. ```python
   s = pd.Series(["R$ 1.234,56", "R$ 99,90"])
   valores = (s.str.replace("R$", "", regex=False)
                .str.replace(".", "", regex=False)
                .str.replace(",", ".", regex=False)
                .str.strip()
                .astype(float))
   ```
   A ordem importa: primeiro remover o ponto de milhar, depois trocar a vírgula decimal por ponto.

## Tema 2

1. (a) Linha; (b) barras (ou pizza, porque são só 3 fatias); (c) dispersão (ou boxplot da nota por faixa de atraso); (d) barras horizontais ordenadas.
2. "Nordeste puxou o crescimento: +40%, enquanto as demais regiões ficaram estáveis".
3. ```python
   ordem = entregues_uf.groupby("customer_state")["dias_entrega"].median().sort_values().index
   plt.figure(figsize=(12, 5))
   sns.boxplot(data=entregues_uf, x="customer_state", y="dias_entrega", order=ordem, showfliers=False)
   plt.title("Estados do Norte e Nordeste têm entregas mais lentas e mais variáveis")
   ```
   `entregues_uf` é a tabela de entregues juntada com clientes. Estados como RR, AP e AM costumam ter as maiores medianas e caixas mais largas (mais variação); SP, as menores.
4. ```dax
   Faturamento = SUM(fato_vendas[valor])
   Pedidos = DISTINCTCOUNT(fato_vendas[pedido_id])
   Ticket Médio = DIVIDE([Faturamento], [Pedidos])
   Pedidos Atrasados = CALCULATE([Pedidos], fato_vendas[atrasado] = TRUE())
   % Atrasados = DIVIDE([Pedidos Atrasados], [Pedidos])
   ```
5. Exemplo: **KPIs no topo** (faturamento, pedidos, ticket médio, % atrasados; cada um com variação vs mês anterior e vs meta). **Meio:** linha de faturamento mensal (ano atual vs anterior); barras de faturamento por categoria. **Baixo:** mapa ou barras por estado; tabela dos 10 maiores vendedores. **Filtros:** período, estado, categoria.

## Tema 3

1. Exemplos: **Pedidos concluídos por dia** (pedidos com status entregue, sem cancelados; por dia de calendário, no fuso de Brasília). **Tempo médio de entrega** (mediana, em minutos, do aceite do restaurante até a entrega, só pedidos entregues, por semana). **Taxa de recompra em 30 dias** (% de clientes com primeiro pedido no mês M que fizeram outro pedido em até 30 dias).
2. Calcule o impacto de +10 p.p. em cada etapa (as outras fixas):
   - Viu produto 40% → 50%: 2.400 × 50/40 = **3.000** compras (+600).
   - Carrinho 20% → 30%: 2.400 × 30/20 = **3.600** (+1.200).
   - Checkout 50% → 60%: 2.400 × 60/50 = **2.880** (+480).
   - Compra 60% → 70%: 2.400 × 70/60 = **2.800** (+400).

   A melhor escolha é a etapa **"adicionar ao carrinho"**: como a taxa base é a menor, +10 pontos representam o maior **aumento relativo** (+50%). (Na vida real, também pese o custo e a dificuldade de melhorar cada etapa.)
3. Use o código da seção 3.3 com `customer_unique_id` como cliente (o `customer_id` da Olist muda a cada pedido). Observação esperada: a retenção após o mês 0 é **muito baixa** (em geral abaixo de 1% por mês), porque a maioria dos clientes compra uma vez só. Isso indica que o negócio depende de aquisição contínua de clientes.
4. ```python
   from statsmodels.stats.proportion import proportions_ztest
   estat, p = proportions_ztest([480, 540], [10000, 10000])
   # p ≈ 0,05
   ```
   O p-valor fica **muito próximo de 0,05** (por volta de 0,054 neste teste bilateral). Conclusão para o PM: "B converteu 5,4% contra 4,8% de A (+12,5% relativos), mas, com esse volume, a diferença está no limite da significância: não dá para afirmar com segurança que B é melhor. Se o resultado for importante, recomendo seguir com o tamanho de amostra planejado antes de decidir (sem estender o teste só porque o resultado ficou perto do limite) ou repetir o teste."
5. Exemplo: "Atrasos estão derrubando a satisfação: pedidos que chegam depois do prazo têm nota média 2,5, contra 4,3 dos que chegam no prazo. Hoje cerca de 8% dos pedidos atrasam, concentrados no Norte e Nordeste. Recomendo revisar o prazo prometido nessas regiões e priorizar vendedores com muitos atrasos. Com isso, esperamos reduzir avaliações negativas e reclamações. Próximo passo: testar prazos mais realistas em 2 estados por um mês."

## Projeto da etapa

O que um avaliador olharia:

- Pergunta de negócio clara no início e resposta no resumo executivo.
- Decisões de limpeza documentadas.
- Gráficos com títulos-conclusão e escolhas adequadas.
- Medidas DAX (não colunas calculadas) para agregações; tabela calendário.
- Recomendação acionável, com limitações declaradas.
