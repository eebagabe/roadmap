# Gabarito: Aprendizado de Máquina

Abra só depois de tentar.

## Tema 1

1. (a) **Regressão.** (b) **Classificação** binária (muito desbalanceada; às vezes tratada como detecção de anomalias, não supervisionada). (c) **Não supervisionado** (agrupamento). (d) **Regressão** (de série temporal). (e) **Classificação** multiclasse.
2. ```python
   rng = np.random.default_rng(0)
   A = rng.normal([-1, -1], 0.7, (100, 2))
   B = rng.normal([1, 1], 0.7, (100, 2))
   X = np.vstack([A, B]); y = np.r_[np.zeros(100), np.ones(100)]
   w = treina_logistica(X, y)
   # fronteira: w0 + w1 x1 + w2 x2 = 0  ⇒  x2 = -(w0 + w1 x1) / w2
   xs = np.linspace(-3, 3, 10)
   plt.scatter(*X.T, c=y); plt.plot(xs, -(w[0] + w[1] * xs) / w[2]); plt.show()
   ```
   A fronteira fica perto da diagonal x₂ = −x₁, entre as duas nuvens.
3. Grau 1 **subajusta** (erro alto nos dois conjuntos). Grau 3 costuma ser o **melhor** (o seno num intervalo se parece com uma cúbica). Grau 9 e 15 **sobreajustam**: erro de treino perto de zero e de validação explodindo, com curvas oscilando loucamente entre os pontos. O gráfico de erro de validação × grau tem forma de U.
4. Com λ = 0, o grau 15 oscila como antes. Com λ pequeno (10⁻⁶ a 10⁻³), a curva fica suave e o erro de validação cai perto do melhor resultado do exercício 3, **mesmo com grau 15**. Com λ = 1, os pesos são esmagados e a curva fica quase plana: subajuste. Regularização permite usar um modelo flexível com segurança, desde que λ seja escolhido pela validação.
5. Com sigmoide e MSE, o gradiente em relação a z inclui σ′(z) = σ(z)(1 − σ(z)), que fica quase **zero** quando a sigmoide satura. Se o modelo está muito confiante e **errado** (z muito negativo para um exemplo positivo), ele quase não recebe gradiente e aprende devagar justamente quando mais precisa. Com entropia cruzada, o gradiente fica simplesmente (p − y): proporcional ao erro, grande quando o erro é grande. Além disso, a entropia cruzada é convexa nos pesos para a regressão logística, e o MSE com sigmoide não.
6. O "número total de exames feitos durante a internação" só é conhecido **depois** que a internação acaba, e está ligado à duração (quem fica mais tempo faz mais exames). O modelo aprende a "prever" a alta usando informação do futuro: ótimas métricas no teste e inútil na hora de usar, no dia da internação. Só devem entrar características disponíveis **no momento da previsão**.

## Tema 2

1. Nó: p = 30/40 = 0,75. Gini = 1 − (0,75² + 0,25²) = **0,375**. Filhos: (20+, 2−): 1 − ((20/22)² + (2/22)²) ≈ 0,165; (10+, 8−): 1 − ((10/18)² + (8/18)²) ≈ 0,494. Média ponderada: (22/40) × 0,165 + (18/40) × 0,494 ≈ 0,091 + 0,222 = 0,313. **Ganho ≈ 0,375 − 0,313 = 0,062**.
2. Resultados típicos (R² em validação cruzada): regressão linear ≈ 0,60; árvore de decisão ≈ 0,60 a 0,70 (instável); floresta aleatória ≈ 0,80; *gradient boosting* (`HistGradientBoostingRegressor`) ≈ 0,83 a 0,85. Os conjuntos de árvores vencem, como costuma acontecer em dados tabulares.
3. Iteração 1: com centros 1 e 2, o ponto 1 vai para o centro 1 e todos os outros para o centro 2. Novos centros: **1** e (2 + 3 + 10 + 11 + 12 + 20)/6 ≈ **9,67**. Iteração 2: 2 e 3 ficam mais perto de 1 que de 9,67: grupos {1, 2, 3} e {10, 11, 12, 20}, centros **2** e **13,25**. Iteração 3: nada muda. Resultado: **{1, 2, 3} e {10, 11, 12, 20}**. (Com inicialização ruim, o k-means pode parar em mínimos locais piores: daí o k-means++ e as várias execuções.)
4. Em vez de 24 bits por pixel (RGB), basta guardar o **índice** da cor: 4 bits (16 cores), mais a paleta (16 × 3 bytes, desprezível). O tamanho cai para cerca de **1/6** (antes de qualquer outra compressão). É exatamente o que o formato GIF e os PNG com paleta fazem.
5. Total = 100.000. **Acurácia** = (80 + 99.500)/100.000 = **99,58%**. **Precisão** = 80/480 ≈ **16,7%**. **Revocação** = 80/100 = **80%**. **F1** ≈ **27,6%**. A acurácia parece excelente, mas de cada 6 alertas, 5 são falsos: o time de análise vai se afogar em alarmes. Se o modelo é "bom" depende dos custos: se analisar um alerta é barato e uma fraude é cara, pode ser aceitável; vale mostrar a curva precisão-revocação e escolher o limiar com o negócio.
6. Se você calcula a média e o desvio de **todos** os dados para normalizar e só depois divide, a média usada no treino "viu" os dados de teste: uma informação do teste vazou. O efeito costuma ser pequeno para normalização simples, mas grande para etapas como seleção de características ou preenchimento de valores faltantes. O certo é ajustar o pré-processamento **só no treino**, e o `Pipeline` garante isso inclusive dentro da validação cruzada:
   ```python
   from sklearn.pipeline import make_pipeline
   from sklearn.preprocessing import StandardScaler
   from sklearn.linear_model import LogisticRegression
   from sklearn.model_selection import cross_val_score
   modelo = make_pipeline(StandardScaler(), LogisticRegression())
   print(cross_val_score(modelo, X, y, cv=5).mean())
   ```

## Tema 3

1. Duas camadas lineares: W₂(W₁x + b₁) + b₂ = (W₂W₁)x + (W₂b₁ + b₂) = W′x + b′, uma camada só. XOR com ReLU: h₁ = ReLU(x₁ + x₂), h₂ = ReLU(x₁ + x₂ − 1), saída = h₁ − 2h₂. Conferindo: (0, 0) → 0 − 0 = **0**; (1, 0) e (0, 1) → 1 − 0 = **1**; (1, 1) → 2 − 2 × 1 = **0**. ✓
2. Esqueleto do passo para trás com softmax e entropia cruzada (a derivada da combinação é simplesmente probabilidades − rótulos em *one-hot*):
   ```python
   # para a frente
   z1 = X @ W1 + b1; h1 = np.maximum(0, z1)
   z2 = h1 @ W2 + b2
   p = np.exp(z2 - z2.max(1, keepdims=True)); p /= p.sum(1, keepdims=True)
   perda = -np.log(p[np.arange(n), y]).mean()
   # para trás
   dz2 = p.copy(); dz2[np.arange(n), y] -= 1; dz2 /= n
   dW2 = h1.T @ dz2; db2 = dz2.sum(0)
   dh1 = dz2 @ W2.T; dz1 = dh1 * (z1 > 0)
   dW1 = X.T @ dz1; db1 = dz1.sum(0)
   ```
   *Gradient check:* para alguns pesos, compare dW com (L(w + ε) − L(w − ε))/(2ε), com ε = 10⁻⁵; a diferença relativa deve ficar abaixo de ~10⁻⁶. Subtrair o máximo antes da exponencial evita estouro (log-sum-exp, etapa de Cálculo).
3. Densa: 32 × 32 × 3 = 3.072 entradas × 100 neurônios + 100 vieses = **307.300 parâmetros**. Convolução com 100 filtros 3 × 3 sobre 3 canais: 100 × (3 × 3 × 3 + 1) = **2.800 parâmetros**: mais de 100 vezes menos, e independente do tamanho da imagem.
4. Uma CNN pequena (3 blocos de convolução) chega a ~70% a 75% sem aumento de dados, com perda de validação subindo depois de algumas épocas (sobreajuste). Com aumento de dados (recortes e espelhamento horizontal) e *dropout*, ~80% a 85%, e as curvas de treino e validação ficam mais próximas.
5. Com 150 fotos, treinar do zero fica perto do acaso (ou sobreajusta totalmente); o ajuste fino de uma ResNet pré-treinada (trocando só a última camada, depois liberando as demais com taxa de aprendizado pequena) costuma passar de 90%. O modelo já sabe "ver" (bordas, texturas, formas), e só precisa aprender a decisão final.
6. (a) **Não aprende nem o treino:** bug (rótulos desalinhados, perda errada, gradiente zerado), taxa de aprendizado muito alta ou baixa, ou modelo pequeno demais. Teste sobreajustar 10 exemplos. (b) **Sobreajuste:** regularize (*dropout*, *weight decay*, aumento de dados), use parada antecipada, mais dados ou modelo menor. (c) **Subajuste ou platô:** modelo com pouca capacidade, características pobres, ou taxa de aprendizado alta demais para descer mais (reduza a taxa ao longo do treino). Também pode ser o limite do que os dados permitem (ruído nos rótulos).

## Tema 4

1. ```python
   from sentence_transformers import SentenceTransformer
   import numpy as np
   m = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
   E = m.encode(frases, normalize_embeddings=True)
   S = E @ E.T                          # cossenos (vetores já normalizados)
   np.fill_diagonal(S, -1)
   for i, f in enumerate(frases):
       print(f, "→", frases[S[i].argmax()])
   ```
   Paráfrases e frases do mesmo assunto ficam juntas mesmo sem palavras em comum ("o carro quebrou" ↔ "meu automóvel deu defeito"). Falhas típicas: negação ("gosto" e "não gosto" ficam próximas) e ironia.
2. Exemplo com Q = K = [[1, 0], [0, 1], [1, 1]] e V = [[1, 0], [0, 2], [3, 3]], d = 2. Linha 1: QKᵀ = (1, 0, 1)/√2 ≈ (0,71; 0; 0,71); softmax ≈ (0,401; 0,198; 0,401); saída ≈ 0,401 × (1, 0) + 0,198 × (0, 2) + 0,401 × (3, 3) ≈ (1,60; 1,60). Cada linha de pesos soma 1, por construção da softmax: cada saída é uma **média ponderada** dos valores.
3. Temperatura **0,5**: texto mais repetitivo e "seguro", repete as palavras mais comuns. **1,0**: a distribuição aprendida, com alguma variedade. **1,5**: mais criativo e mais errado, inventa palavras e perde a gramática. A temperatura divide os escores antes da softmax: abaixo de 1 concentra a probabilidade nos tokens mais prováveis; acima de 1, espalha.
4. Divida cada apostila em trechos (por exemplo, por seção `###`), gere os *embeddings* dos trechos e da pergunta e devolva os 3 de maior cosseno. A recuperação falha quando a pergunta usa vocabulário muito diferente do texto, quando a resposta está espalhada em vários trechos, quando os trechos são grandes demais (diluem o assunto) ou pequenos demais (perdem o contexto), e em perguntas que exigem contar ou agregar ("quantas etapas usam Python?"). Melhorias: busca híbrida (palavras-chave + *embeddings*), trechos com sobreposição, e reordenar os candidatos com um modelo mais preciso.
5. Perguntas: o que significam os 70%: mais **falsos negativos** (crédito negado a bons pagadores) ou **falsos positivos** (crédito dado a quem não paga)? Os dados do grupo com 70% são poucos, mais ruidosos ou refletem decisões históricas enviesadas? A diferença vem de alguma característica que funciona como substituta de raça, gênero ou endereço? Que métrica de justiça a lei e a empresa adotam? Como o cliente pode contestar e pedir revisão humana (LGPD)? Dá para melhorar o modelo para o grupo pior sem prejudicar os outros (mais dados, outras características)? Só depois disso, decidir se vai para produção, com monitoramento por grupo.
6. O modelo gera texto **plausível**: referências bibliográficas têm um formato muito previsível (autores, título, revista, ano), e o modelo produz algo com essa forma sem ter um mecanismo para verificar se existe. Técnicas: (1) **RAG**: responder só com base em documentos recuperados de uma base confiável, citando-os, e instruir o modelo a dizer "não encontrei" quando não houver base; (2) **verificação automática**: conferir cada referência gerada numa base bibliográfica (por exemplo, por DOI) antes de mostrar ao usuário; também ajuda pedir saídas estruturadas e baixar a temperatura.

## Projeto da etapa

Pontos de revisão:

- **Linhas de base primeiro:** se a regressão logística já dá 92% no MNIST, o MLP precisa justificar a complexidade (deve chegar a ~98%).
- **Reprodutibilidade:** `np.random.seed`, `torch.manual_seed`, `torch.use_deterministic_algorithms(True)` quando possível, e um arquivo de dependências com versões.
- **Dados desbalanceados (fraude):** use divisão **estratificada**, métricas de precisão e revocação (AUC-PR), e trate o desbalanceamento com pesos de classe ou ajuste do limiar, não só com reamostragem. Nunca reamostre antes de separar o teste.
- **Matriz de confusão:** os erros mais frequentes (4 ↔ 9 no MNIST, camiseta ↔ camisa no Fashion-MNIST) dizem onde o modelo e os dados têm limites. Mostre exemplos reais desses erros: alguns são rótulos errados no próprio conjunto.
- **Model card:** uso pretendido ("triagem de dígitos manuscritos em formulários escaneados"), usos não recomendados, dados de treino, métricas com intervalos de confiança (bootstrap), desempenho por subgrupo quando houver (por exemplo, por categoria de produto nas avaliações), e limitações conhecidas.
