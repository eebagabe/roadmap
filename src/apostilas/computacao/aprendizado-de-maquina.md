# Aprendizado de Máquina: Apostila Prática

Roadmap Ciência da Computação · Semanas 103 a 106

## Comece por aqui

Em vez de escrever as regras à mão, **aprendizado de máquina** escreve programas que **aprendem as regras a partir de exemplos**. Ninguém consegue escrever um `if` que reconhece um gato numa foto, mas dá para mostrar milhões de fotos rotuladas a um modelo e deixá-lo ajustar os seus parâmetros até acertar. Esta etapa é onde várias etapas anteriores se encontram: **álgebra linear** (dados são matrizes, modelos são multiplicações), **cálculo** (treinar é descer o gradiente), **probabilidade** (modelar incerteza e generalização) e **algoritmos** (fazer tudo isso caber em tempo e memória). O foco é entender os fundamentos o bastante para implementar do zero, e então usar as bibliotecas sabendo o que elas fazem.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CMC-13 Introdução à Ciência de Dados; CMC-19 Processamento de Linguagem Natural |
| MIT | 6.3900 (antiga 6.036) Introduction to Machine Learning |
| Harvard | CS 1810 (antiga CS 181) Machine Learning |
| Oxford | Machine Learning (3º ano) |
| Stanford | CS 229 Machine Learning; CS 231n (visão) |

### Como esta apostila funciona

1. Use Python com NumPy, pandas, matplotlib, **scikit-learn** e **PyTorch**. O Google Colab dá GPU de graça para os temas 3 e 4.
2. Primeiro implemente com NumPy (para entender), depois use a biblioteca (para trabalhar).
3. Sempre separe dados de treino e de teste **antes** de olhar os dados com atenção.
4. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** o modelo não aprende? Tente **sobreajustar um lote minúsculo** (10 exemplos): se nem isso a perda zera, o bug está no código (rótulos trocados, taxa de aprendizado, gradiente), não nos dados. Depois verifique as formas dos tensores linha a linha.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 103 | Tema 1: Aprendizado supervisionado |
| 104 | Tema 2: Modelos clássicos |
| 105 | Tema 3: Redes neurais |
| 106 | Tema 4: Modelos de linguagem + projeto |

## Tema 1: Aprendizado supervisionado

**Objetivo:** formular problemas de aprendizado, treinar modelos lineares com gradiente descendente e entender generalização.

### 1.1 Regressão

No **aprendizado supervisionado**, temos exemplos (xᵢ, yᵢ): entradas e as respostas certas. Queremos uma função f tal que f(x) ≈ y para exemplos **novos**. Se y é um número, é **regressão**; se é uma categoria, **classificação**.

Outros tipos: **não supervisionado** (sem rótulos: agrupar, reduzir dimensão; Tema 2), **por reforço** (recompensas; etapa anterior) e **auto-supervisionado** (o rótulo vem dos próprios dados, como prever a próxima palavra; Tema 4).

**Regressão linear:** ŷ = w · x + b. Com os dados numa matriz X (n exemplos × d características) e um 1 acrescentado em cada linha para o viés: ŷ = Xw.

Você já resolveu isso em Álgebra Linear (mínimos quadrados: XᵀXw = Xᵀy) e em Cálculo (gradiente descendente). Em ML, a forma geral é: escolher uma **família de modelos**, uma **função de perda** e um **algoritmo de otimização**.

### 1.2 Classificação

**Regressão logística** (apesar do nome, é classificação binária): calcule z = w · x + b e transforme numa probabilidade com a **sigmoide**: P(y = 1 | x) = σ(z) = 1/(1 + e⁻ᶻ). Classifique como 1 se a probabilidade passar de um limiar (0,5 por padrão). A **fronteira de decisão** w · x + b = 0 é um hiperplano.

Para várias classes, a **softmax** transforma um vetor de escores z em probabilidades: softmax(z)ₖ = e^(zₖ)/Σⱼ e^(zⱼ).

Exemplos: spam ou não, aprovar crédito, diagnóstico, qual dígito está na imagem.

### 1.3 Funções de perda

A **função de perda** mede o quanto o modelo erra e define o que "aprender" significa.

| Problema | Perda | Fórmula (por exemplo) |
|---|---|---|
| Regressão | Erro quadrático (MSE) | (ŷ − y)² |
| Regressão robusta a valores extremos | Erro absoluto (MAE), Huber | \|ŷ − y\| |
| Classificação binária | Entropia cruzada binária (*log loss*) | −[y log p + (1 − y) log(1 − p)] |
| Classificação multiclasse | Entropia cruzada | −log p_classe_certa |

A entropia cruzada vem da **máxima verossimilhança** (a etapa de Probabilidade): minimizá-la é maximizar a probabilidade que o modelo dá aos rótulos certos. Ela pune muito acertos "confiantes demais" do lado errado.

Treinar = minimizar a **perda média no treino** por **gradiente descendente** (Cálculo). Para a regressão logística, o gradiente tem uma forma bonita: ∇L = (1/n) Xᵀ(σ(Xw) − y).

```python
import numpy as np

def treina_logistica(X, y, eta=0.1, epocas=1000):
    X = np.column_stack([np.ones(len(X)), X])        # coluna de 1 para o viés
    w = np.zeros(X.shape[1])
    for _ in range(epocas):
        p = 1 / (1 + np.exp(-X @ w))
        w -= eta * X.T @ (p - y) / len(y)
    return w
```

Na prática, usa-se o **gradiente estocástico em minilotes** (SGD): cada passo usa 32 a 512 exemplos aleatórios, não todos. Mais barato por passo e o ruído até ajuda.

### 1.4 Generalização

O objetivo **não** é acertar o treino: é acertar dados **novos**. Um modelo que decora o treino (uma tabela de consulta dos exemplos) tem erro zero lá e é inútil.

- **Subajuste** (*underfitting*): modelo simples demais, erra no treino e no teste (uma reta para dados em curva).
- **Sobreajuste** (*overfitting*): modelo complexo demais para a quantidade de dados, decora o ruído; erra pouco no treino e muito no teste (um polinômio de grau 15 passando por 16 pontos).

O **dilema viés-variância**: modelos simples têm **viés** alto (erro sistemático); modelos complexos têm **variância** alta (mudam muito com os dados de treino). O erro esperado no teste é viés² + variância + ruído irredutível.

**Separação dos dados:**

- **Treino:** para ajustar os parâmetros.
- **Validação:** para escolher hiperparâmetros (grau do polinômio, taxa de aprendizado, regularização) e comparar modelos.
- **Teste:** usado **uma única vez**, no final, para estimar o desempenho real.

> **Cuidado! Cai na entrevista:** **vazamento de dados** (*data leakage*): qualquer informação do teste que chega ao treino infla as métricas. Exemplos: normalizar os dados com a média calculada no conjunto **inteiro**; usar uma característica que só existe depois do resultado (a "data do cancelamento" para prever cancelamento); em séries temporais, embaralhar e treinar com o futuro para prever o passado. Sempre divida primeiro, depois prepare.

### 1.5 Regularização

**Regularizar** é penalizar a complexidade para melhorar a generalização:

- **L2** (*ridge*, *weight decay*): perda + λ Σ wⱼ². Encolhe os pesos em direção a zero, suaviza o modelo.
- **L1** (*lasso*): perda + λ Σ |wⱼ|. Zera pesos de características inúteis: faz **seleção de características**.
- **Parada antecipada:** pare de treinar quando o erro de **validação** começar a subir.
- Em redes neurais: *dropout*, aumento de dados (Tema 3).

λ é um **hiperparâmetro**: escolha pela validação. λ grande demais causa subajuste.

Mais dados é quase sempre a melhor regularização.

### Atividades de fixação do Tema 1

1. Classifique como regressão, classificação ou não supervisionado: (a) prever o preço de um imóvel; (b) detectar transações fraudulentas; (c) agrupar clientes por comportamento; (d) prever a demanda de energia de amanhã; (e) identificar a língua de um texto.
2. Implemente a regressão logística do texto e treine num conjunto 2D gerado por você (duas nuvens de pontos). Desenhe a fronteira de decisão.
3. Ajuste polinômios de grau 1, 3, 9 e 15 a 20 pontos de sen(2πx) com ruído. Faça o gráfico do erro de treino e de validação em função do grau. Onde está o melhor?
4. Repita o exercício 3 com o grau 15 e regularização L2 com λ = 0, 10⁻⁶, 10⁻³ e 1.
5. Por que a entropia cruzada é preferida ao MSE para classificação com a sigmoide? (Dica: o que acontece com o gradiente quando o modelo está muito errado e muito confiante?)
6. Encontre o vazamento: "Para prever se um paciente terá alta em 3 dias, usamos idade, exames de entrada e o número total de exames feitos durante a internação."

## Tema 2: Modelos clássicos

**Objetivo:** conhecer os modelos clássicos mais usados e avaliar modelos corretamente.

### 2.1 Árvores e florestas

Uma **árvore de decisão** faz perguntas sobre as características ("renda > 3.000?", "idade < 25?") até chegar a uma folha com a previsão. Construção gulosa: em cada nó, escolha a pergunta que mais "purifica" os grupos (menor **impureza de Gini** ou maior **ganho de informação**, baseado em entropia), e repita em cada lado.

Vantagens: interpretável, lida com características numéricas e categóricas, sem precisar normalizar, captura interações. Desvantagem: uma árvore funda sobreajusta e é instável (pequenas mudanças nos dados mudam a árvore inteira).

**Conjuntos** (*ensembles*) resolvem isso combinando muitas árvores:

- **Florestas aleatórias** (*random forests*): treine centenas de árvores, cada uma num **reamostragem** dos dados (*bagging*, o bootstrap da etapa de Probabilidade) e considerando só um subconjunto aleatório de características em cada divisão; faça a média (ou o voto). A média de modelos com erros pouco correlacionados reduz a **variância**.
- ***Gradient boosting*** (XGBoost, LightGBM, CatBoost): treine árvores pequenas **em sequência**, cada uma corrigindo os erros (o gradiente da perda) das anteriores. Reduz o **viés**.

Para **dados tabulares** (planilhas, bancos de dados), o *gradient boosting* continua sendo, na maioria dos casos, o modelo mais forte, à frente de redes neurais.

### 2.2 SVM

A **máquina de vetores de suporte** (SVM) procura o hiperplano que separa as classes com a **maior margem** (a maior distância até os pontos mais próximos de cada classe, os **vetores de suporte**). Margem grande tende a generalizar melhor. Com uma margem "suave" (parâmetro C), tolera alguns pontos do lado errado.

O **truque do kernel** permite fronteiras não lineares: o SVM só usa os dados por meio de **produtos escalares** xᵢ · xⱼ, que podem ser trocados por uma função kernel K(xᵢ, xⱼ) que equivale a um produto escalar num espaço de dimensão maior (até infinita), sem calcular esse espaço. O kernel RBF (gaussiano), K(x, z) = exp(−γ‖x − z‖²), é o mais usado.

Foi o estado da arte em muitas tarefas nos anos 2000, antes do deep learning. Escala mal para milhões de exemplos.

### 2.3 k-means

**Agrupamento** (*clustering*) é não supervisionado: encontrar grupos de pontos parecidos sem rótulos.

**k-means:**

1. Escolha k centros iniciais (de preferência com a inicialização **k-means++**, que espalha os centros).
2. Atribua cada ponto ao centro mais próximo.
3. Mova cada centro para a média dos seus pontos.
4. Repita 2 e 3 até estabilizar.

Minimiza a soma das distâncias quadradas de cada ponto ao seu centro. Converge sempre, mas para um ótimo **local** (rode várias vezes). Escolher k: método do "cotovelo" ou a medida de silhueta. Limitações: supõe grupos redondos e de tamanhos parecidos; para formas arbitrárias, use DBSCAN; para grupos hierárquicos, agrupamento aglomerativo.

Usos: segmentação de clientes, compressão de cores de imagens (cada pixel vira a cor do seu centro), pré-processamento.

### 2.4 PCA

A **análise de componentes principais** (a etapa de Álgebra Linear) reduz a dimensão projetando os dados nas direções de maior variância, obtidas pelo SVD dos dados centralizados. Usos em ML: visualizar dados em 2D, comprimir características, remover ruído e acelerar outros modelos.

Para **visualizar** estrutura não linear (grupos em dados de alta dimensão), usam-se **t-SNE** e **UMAP**, que preservam vizinhanças locais (mas distâncias entre grupos no gráfico não têm significado confiável).

### 2.5 Validação cruzada

Com poucos dados, uma única divisão treino/validação é instável. Na **validação cruzada em k partes**: divida os dados em k partes; treine em k − 1 e valide na restante, k vezes, girando; use a média (e o desvio) das k medidas. Com k = 5 ou 10, é o padrão para escolher hiperparâmetros. Para séries temporais, valide sempre no **futuro** em relação ao treino.

**Métricas de classificação:**

| | Previsto positivo | Previsto negativo |
|---|---|---|
| **Real positivo** | Verdadeiro positivo (VP) | Falso negativo (FN) |
| **Real negativo** | Falso positivo (FP) | Verdadeiro negativo (VN) |

- **Acurácia** = (VP + VN)/total. Enganosa com classes **desbalanceadas**: se 1% das transações é fraude, dizer sempre "não é fraude" dá 99% de acurácia e é inútil.
- **Precisão** = VP/(VP + FP): dos que o modelo marcou, quantos eram mesmo positivos.
- **Revocação** (*recall*, sensibilidade) = VP/(VP + FN): dos positivos reais, quantos o modelo achou.
- **F1** = média harmônica de precisão e revocação.
- **Curva ROC e AUC:** desempenho em todos os limiares; **curva precisão-revocação**, melhor para classes raras.

O limiar ideal depende do **custo** de cada erro: num exame de câncer, um falso negativo é muito pior que um falso positivo (priorize revocação); num filtro de spam, perder um e-mail legítimo é pior (priorize precisão).

Para regressão: MAE, RMSE (penaliza erros grandes) e R².

Sempre compare com uma **linha de base** simples (prever a média, a classe mais comum, o valor de ontem): muitos modelos "sofisticados" não a superam.

### Atividades de fixação do Tema 2

1. Calcule a impureza de Gini de um nó com 30 exemplos positivos e 10 negativos, e o ganho de dividir em (20+, 2−) e (10+, 8−).
2. Compare, no conjunto *California Housing* (scikit-learn), regressão linear, árvore de decisão, floresta aleatória e *gradient boosting* com validação cruzada de 5 partes. Qual vence?
3. Rode o k-means à mão para os pontos 1, 2, 3, 10, 11, 12, 20 com k = 2 e centros iniciais 1 e 2.
4. Comprima uma foto reduzindo as cores para 16 com k-means. Quanto o arquivo diminuiria, em teoria?
5. Um teste de fraude tem VP = 80, FN = 20, FP = 400, VN = 99.500. Calcule acurácia, precisão, revocação e F1. O modelo é bom?
6. Mostre num exemplo por que normalizar os dados **antes** de dividir em treino e teste é vazamento, e como fazer certo com `Pipeline` do scikit-learn.

## Tema 3: Redes neurais

**Objetivo:** entender redes neurais, a retropropagação e como treiná-las na prática.

### 3.1 Perceptron e camadas

Um **neurônio artificial** calcula uma soma ponderada das entradas mais um viés e aplica uma **função de ativação** não linear: a = g(w · x + b). Uma **camada** tem vários neurônios: a = g(Wx + b), uma multiplicação de matriz por vetor.

Uma **rede neural** (perceptron multicamadas, MLP) empilha camadas:

```
x → [W₁, b₁, ReLU] → h₁ → [W₂, b₂, ReLU] → h₂ → [W₃, b₃, softmax] → probabilidades
```

Ativações comuns: **ReLU** max(0, z) (simples, a mais usada), sigmoide e tanh (as antigas; saturam e atrapalham o gradiente), GELU (nos transformers).

**Por que a não linearidade?** Sem ela, várias camadas lineares equivalem a **uma só** (W₃W₂W₁ é uma matriz). Com ela, o **teorema da aproximação universal** garante que uma rede com uma camada escondida grande o bastante aproxima qualquer função contínua. Na prática, redes **profundas** (muitas camadas) aprendem **representações hierárquicas** (bordas → texturas → partes → objetos) e generalizam melhor com menos parâmetros: daí *deep learning*.

O perceptron original (Rosenblatt, 1958) era um único neurônio, que só separa classes linearmente; não aprende o XOR (Minsky e Papert, 1969). Com uma camada escondida, aprende.

### 3.2 Retropropagação

Para treinar, precisamos do gradiente da perda em relação a **milhões** de pesos. A **retropropagação** é a regra da cadeia organizada de trás para frente, exatamente o *autograd* que você escreveu em Cálculo:

1. **Passo para a frente:** calcule a saída e a perda, guardando os valores intermediários.
2. **Passo para trás:** comece com ∂L/∂L = 1 e, camada por camada, de trás para frente, multiplique pelas derivadas locais.

Para uma camada h = ReLU(Wx + b), sabendo δ = ∂L/∂h:

- ∂L/∂z = δ ⊙ 1[z > 0] (a ReLU deixa passar o gradiente só onde estava ativa)
- ∂L/∂W = (∂L/∂z) xᵀ
- ∂L/∂b = ∂L/∂z
- ∂L/∂x = Wᵀ (∂L/∂z), que segue para a camada anterior

O custo do passo para trás é parecido com o do passo para a frente. Bibliotecas (PyTorch, JAX, TensorFlow) fazem isso automaticamente: você escreve só o passo para a frente.

```python
import torch
import torch.nn as nn

modelo = nn.Sequential(
    nn.Linear(784, 256), nn.ReLU(),
    nn.Linear(256, 128), nn.ReLU(),
    nn.Linear(128, 10),
)
otimizador = torch.optim.Adam(modelo.parameters(), lr=1e-3)
perda_fn = nn.CrossEntropyLoss()          # aplica softmax + entropia cruzada

for epoca in range(10):
    for x, y in carregador_treino:        # minilotes
        otimizador.zero_grad()
        perda = perda_fn(modelo(x.view(len(x), -1)), y)
        perda.backward()                  # retropropagação
        otimizador.step()                 # atualiza os pesos
```

Esse MLP chega a cerca de 98% de acerto nos dígitos do MNIST.

### 3.3 Redes convolucionais

Para **imagens**, um MLP comum desperdiça: uma imagem 224 × 224 × 3 tem 150 mil entradas, e cada neurônio da primeira camada teria 150 mil pesos, sem aproveitar que padrões locais (uma borda, um olho) aparecem em qualquer posição.

A **convolução** desliza um pequeno **filtro** (3 × 3, por exemplo) pela imagem, calculando um produto escalar em cada posição. O mesmo filtro é usado em toda a imagem (**compartilhamento de pesos**): poucos parâmetros e o padrão é detectado onde quer que apareça (**equivariância à translação**). Cada camada tem vários filtros, cada um detectando um padrão diferente.

Arquitetura típica: [convolução → ReLU → *pooling*] repetido (o *pooling* reduz a resolução, resumindo regiões) e camadas densas no final. Camadas iniciais aprendem bordas e cores; camadas profundas, partes e objetos.

Marcos: **LeNet** (1998, dígitos de cheques), **AlexNet** (2012, venceu o ImageNet por larga margem usando GPUs e iniciou a era do deep learning), **ResNet** (2015, conexões residuais x + F(x) que permitem treinar centenas de camadas). Hoje, **transformers de visão** competem com as CNNs.

### 3.4 Treinamento na prática

Treinar redes é tanto engenharia quanto teoria:

- **Inicialização** cuidadosa dos pesos (He, Xavier): pesos grandes demais explodem, pequenos demais somem.
- **Normalização** das entradas e das ativações (*batch norm*, *layer norm*): treino mais estável e rápido.
- **Otimizador:** Adam (a escolha padrão) ou SGD com momento; **taxa de aprendizado** com aquecimento e decaimento (*warmup*, *cosine schedule*). A taxa de aprendizado é o hiperparâmetro mais importante.
- **Regularização:** *dropout* (zerar neurônios aleatórios no treino), *weight decay*, parada antecipada, e **aumento de dados** (girar, recortar, mudar o brilho das imagens: mais dados "de graça").
- **Gradientes que somem ou explodem** em redes profundas e recorrentes: ReLU, conexões residuais, normalização e corte de gradiente (*gradient clipping*).
- **Transferência de aprendizado:** em vez de treinar do zero, parta de um modelo pré-treinado em muitos dados (ImageNet, ou um modelo de linguagem) e faça **ajuste fino** com os seus poucos dados. É como quase tudo é feito hoje.
- **GPUs:** redes são multiplicações de matrizes em massa, e GPUs fazem milhares delas em paralelo. Treinar em lotes aproveita isso.
- **Acompanhe as curvas** de perda de treino e validação a cada época. Treino caindo e validação subindo: sobreajuste.

Receita prática (de Andrej Karpathy): conheça os dados a fundo; comece com o modelo mais simples e uma linha de base; sobreajuste primeiro (garanta que o modelo consegue aprender), depois regularize; mude uma coisa de cada vez.

### Atividades de fixação do Tema 3

1. Mostre que uma rede com duas camadas lineares sem ativação equivale a uma camada linear. Depois mostre pesos de uma rede com uma camada escondida de 2 neurônios ReLU que calcula o XOR.
2. Implemente com NumPy, sem bibliotecas de deep learning, um MLP de uma camada escondida com retropropagação, e treine no MNIST (ou num conjunto 2D em espiral). Confira os gradientes com a derivada numérica (*gradient check*).
3. Para uma imagem 32 × 32 × 3, quantos parâmetros tem uma camada densa com 100 neurônios? E uma convolução com 100 filtros 3 × 3?
4. Treine uma CNN pequena no CIFAR-10 em PyTorch. Compare com e sem aumento de dados e *dropout*. Faça os gráficos de perda de treino e validação.
5. Faça ajuste fino de uma ResNet pré-treinada para classificar um conjunto pequeno de imagens suas (por exemplo, 3 tipos de folhas com 50 fotos cada) e compare com treinar do zero.
6. O que você conclui se: (a) a perda de treino não cai; (b) a perda de treino cai e a de validação sobe; (c) as duas caem e depois ficam paradas num valor alto?

## Tema 4: Modelos de linguagem

**Objetivo:** entender como texto vira números, como funcionam os transformers e os modelos de linguagem, e como usá-los com responsabilidade.

### 4.1 Embeddings

Redes trabalham com números; como representar palavras? Uma ideia ingênua é um vetor com um 1 na posição da palavra no vocabulário (*one-hot*): enorme e sem noção de semelhança ("gato" é tão distante de "felino" quanto de "parafuso").

Um ***embedding*** representa cada palavra (ou pedaço de palavra) por um vetor **denso** aprendido, de centenas de dimensões, em que palavras usadas em contextos parecidos ficam **próximas** ("você conhece uma palavra pelas companhias que ela tem", J. R. Firth). O **word2vec** (2013) aprendia esses vetores prevendo palavras vizinhas, e surgiram regularidades como rei − homem + mulher ≈ rainha.

Modelos modernos não usam palavras inteiras, mas **tokens** de subpalavras (algoritmo *byte-pair encoding*): palavras comuns são um token, raras são quebradas em pedaços ("inconstitucionalmente" vira alguns tokens). Isso lida com qualquer texto e mantém o vocabulário em dezenas de milhares de entradas.

*Embeddings* de **frases e documentos** são a base da **busca semântica**: compare o vetor da pergunta com os vetores dos documentos pela similaridade de cosseno (Álgebra Linear) e recupere os mais parecidos, mesmo sem palavras em comum.

### 4.2 Atenção e transformers

Texto é uma **sequência**, e o significado de cada palavra depende das outras ("o banco da praça" e "o banco cobrou juros"). As **redes recorrentes** (RNN, LSTM) liam a sequência palavra por palavra, guardando um estado; eram lentas (sequenciais, sem paralelismo) e esqueciam contextos longos.

O **transformer** (*Attention Is All You Need*, Google, 2017) usa **atenção**: cada posição olha para **todas** as outras e decide quanto cada uma importa para ela. Para cada token, a rede calcula três vetores: uma **consulta** (q, "o que eu procuro"), uma **chave** (k, "o que eu ofereço") e um **valor** (v, "o que eu passo adiante"). Com tudo em matrizes:

**Atenção(Q, K, V) = softmax(QKᵀ/√d) V**

O produto QKᵀ dá a afinidade de cada par de posições; a softmax transforma em pesos; e cada posição recebe a média ponderada dos valores. A divisão por √d evita que a softmax sature.

Um bloco transformer combina **atenção com várias cabeças** (várias atenções em paralelo, cada uma aprendendo um tipo de relação), uma **rede densa** aplicada a cada posição, **conexões residuais** e **normalização**. Como a atenção não sabe a ordem, soma-se uma **codificação de posição**. Empilham-se dezenas de blocos.

Vantagens: tudo em paralelo (ótimo para GPUs) e qualquer posição alcança qualquer outra em um passo. Custo: a atenção é **O(n²)** no tamanho da sequência, o que motiva muitas técnicas para contextos longos.

Transformers dominam hoje texto, tradução, voz, imagens, código, proteínas (AlphaFold) e mais.

### 4.3 Modelos de linguagem

Um **modelo de linguagem** estima a probabilidade da **próxima palavra** (token) dado o texto anterior. Gerar texto é repetir: prever a distribuição do próximo token, sortear um (com uma **temperatura** que controla a aleatoriedade), acrescentar e continuar. É a cadeia de Markov da etapa de IA, mas condicionada em milhares de tokens anteriores por um transformer.

Como se treinam os **grandes modelos de linguagem** (LLMs), como GPT, Claude, Gemini e Llama:

1. **Pré-treinamento:** prever o próximo token em trilhões de tokens de texto da internet, livros e código (aprendizado auto-supervisionado). O modelo aprende gramática, fatos, raciocínio e estilos, como efeito colateral de prever bem. **Leis de escala:** o desempenho melhora de forma previsível com mais parâmetros, dados e computação.
2. **Ajuste fino por instruções:** treinar com exemplos de pedidos e respostas de boa qualidade, para o modelo seguir instruções e conversar.
3. **Alinhamento com preferências humanas:** RLHF (a etapa de IA) ou métodos parecidos, para respostas mais úteis, honestas e seguras.

Formas de usar LLMs em sistemas:

- **Engenharia de *prompts***: instruções claras, exemplos, formato de saída definido.
- **RAG** (geração aumentada por recuperação): buscar documentos relevantes (busca semântica com *embeddings*) e colocá-los no contexto, para o modelo responder com base em fontes atuais e verificáveis.
- **Agentes:** o modelo decide chamar **ferramentas** (busca, código, APIs) em ciclos, para cumprir tarefas de vários passos.
- **Ajuste fino** de modelos abertos para tarefas específicas.

Limitações importantes: **alucinação** (texto fluente e confiante, mas falso, porque o modelo gera o plausível, não o verificado), conhecimento congelado na data de corte do treino, sensibilidade à formulação do pedido, e dificuldade de avaliar respostas abertas. A trilha **LLMs e Agents** deste Roadmap aprofunda esse tema.

### 4.4 Viés e privacidade

Modelos aprendem o que está nos dados, **inclusive os problemas**:

- **Viés:** dados históricos refletem desigualdades (crédito negado a certos bairros, contratações enviesadas), e o modelo as reproduz e amplifica. Modelos de linguagem associam profissões a gêneros conforme o texto da internet. É preciso **medir o desempenho por grupo**, não só a média, e escolher métricas de justiça adequadas ao contexto (que, em geral, não podem ser satisfeitas todas ao mesmo tempo).
- **Representatividade:** um modelo de diagnóstico de pele treinado quase só com fotos de pele clara funciona mal em pele escura.
- **Privacidade:** modelos podem **memorizar** e reproduzir dados de treino (números de documentos, textos privados). Técnicas: anonimização (difícil de fazer direito), **privacidade diferencial** (acrescentar ruído calibrado com garantia matemática), aprendizado federado (treinar sem centralizar os dados). A LGPD exige base legal, finalidade e minimização para dados pessoais.
- **Documentação:** *datasheets* para conjuntos de dados (origem, coleta, limitações) e *model cards* para modelos (uso pretendido, desempenho por grupo, limitações).
- **Mudança de distribuição:** o mundo muda depois do treino (novos golpes, novos produtos, uma pandemia). Monitore o modelo em produção e retreine.

Uso responsável é parte da engenharia: o melhor modelo no teste pode ser o pior para pôr em produção, se ninguém verificou para quem ele erra.

### Atividades de fixação do Tema 4

1. Use um modelo de *embeddings* aberto (por exemplo, da biblioteca `sentence-transformers`) para gerar vetores de 20 frases e encontre, para cada uma, a mais parecida. Os resultados fazem sentido?
2. Calcule à mão a atenção com uma cabeça para 3 tokens com d = 2, dadas Q, K e V pequenas que você escolher. Verifique que os pesos de cada linha somam 1.
3. Treine um modelo de linguagem de caracteres pequeno (um transformer de 2 camadas, seguindo o *nanoGPT* ou o vídeo "Let's build GPT" de Karpathy) em um texto em português e gere amostras com temperatura 0,5, 1,0 e 1,5. O que a temperatura muda?
4. Monte um RAG mínimo: indexe os capítulos de uma apostila desta trilha com *embeddings*, recupere os 3 trechos mais próximos de uma pergunta e mostre-os (com ou sem um LLM para redigir a resposta). Quando a recuperação falha?
5. Um modelo de concessão de crédito tem 85% de acurácia geral, mas 92% para um grupo e 70% para outro. Que perguntas você faria antes de colocá-lo em produção?
6. Por que um LLM pode citar com confiança um artigo científico que não existe? Proponha duas técnicas para reduzir isso numa aplicação.

## Projeto da etapa

**Classificador do zero até o PyTorch, com relatório de avaliação:**

1. Escolha um problema de classificação real com dados públicos: dígitos (MNIST), roupas (Fashion-MNIST), sentimento em avaliações de produtos em português, ou detecção de fraude (dados desbalanceados).
2. **Análise exploratória:** distribuição das classes, exemplos, problemas nos dados.
3. **Linhas de base:** classe mais frequente e regressão logística (scikit-learn).
4. **Do zero:** um MLP em NumPy com retropropagação implementada à mão e *gradient check*.
5. **Com PyTorch:** a mesma rede e uma melhor (CNN para imagens, ou ajuste fino de um modelo pré-treinado para texto), com validação para hiperparâmetros e parada antecipada.
6. **Relatório de avaliação** (como um *model card*): métricas adequadas ao problema (não só acurácia), matriz de confusão, curvas de aprendizado, exemplos de erros e o que eles revelam, desempenho por subgrupo quando fizer sentido, limitações e usos não recomendados.
7. Tudo reprodutível: sementes fixas, versões das bibliotecas, um único comando para treinar e avaliar.

## Para ir além

- **MIT 6.036/6.3900** no OpenCourseWare e **Stanford CS 229** (aulas públicas de Andrew Ng).
- **Stanford CS 231n** (visão com CNNs) e **CS 224n** (processamento de linguagem natural), com aulas no YouTube.
- *Dive into Deep Learning* (gratuito online, com código em PyTorch) e *Deep Learning* (Goodfellow, Bengio e Courville, gratuito online).
- *An Introduction to Statistical Learning* (gratuito, com versão em Python): os modelos clássicos com clareza.
- Andrej Karpathy, *Neural Networks: Zero to Hero* (YouTube): do *micrograd* ao GPT, escrito do zero.
- *Fairness and Machine Learning* (Barocas, Hardt e Narayanan, gratuito online).

## Resumão

- Supervisionado: aprender f(x) ≈ y com exemplos. Regressão (números) e classificação (categorias).
- Modelo + perda + otimização. MSE para regressão; entropia cruzada (máxima verossimilhança) para classificação.
- Regressão logística: sigmoide, fronteira linear. Softmax para várias classes. SGD em minilotes.
- Objetivo é generalizar. Subajuste e sobreajuste; viés e variância. Treino, validação e teste (usado uma vez).
- Vazamento de dados infla métricas: divida antes de preparar.
- Regularização L2, L1 (zera pesos), parada antecipada. Mais dados ajudam mais que tudo.
- Árvores interpretáveis e instáveis; florestas reduzem variância; *gradient boosting* reina em dados tabulares.
- SVM: margem máxima e truque do kernel. k-means agrupa; PCA reduz dimensão.
- Validação cruzada. Precisão, revocação, F1, ROC; acurácia engana com classes raras. Compare com linha de base.
- Rede neural: camadas lineares + ativações não lineares. Retropropagação é a regra da cadeia de trás para frente.
- CNNs: filtros compartilhados, padrões locais. Treino: inicialização, normalização, Adam, taxa de aprendizado, dropout, aumento de dados, transferência.
- Embeddings: vetores densos onde semelhança vira proximidade. Tokens de subpalavras.
- Transformer: atenção softmax(QKᵀ/√d)V, paralelo, O(n²). LLM: prever o próximo token; pré-treino, instruções, preferências.
- RAG, agentes e alucinação. Viés, privacidade, documentação e monitoramento fazem parte da engenharia.
