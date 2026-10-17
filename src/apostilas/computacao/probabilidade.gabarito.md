# Gabarito: Probabilidade e Estatística

Abra só depois de tentar.

## Tema 1

1. Ω tem 8 resultados igualmente prováveis. Pelo menos duas caras: CCK, CKC, KCC, CCC = 4 casos, **1/2**. Pelo menos uma cara: complemento de "nenhuma cara" (só KKK), **1 − 1/8 = 7/8**.
2. ```python
   def pessoas(p):
       k, q = 1, 1.0
       while True:
           q *= (365 - k + 1) / 365
           if 1 - q > p:
               return k
           k += 1
   print(pessoas(.5), pessoas(.9), pessoas(.99))    # 23 41 57
   ```
   **23, 41 e 57 pessoas**. Com 57 pessoas numa sala, é quase certo haver aniversário repetido.
3. Pela lei da probabilidade total: P(2ª vermelha) = P(2ª V | 1ª V)P(1ª V) + P(2ª V | 1ª A)P(1ª A) = (4/7)(5/8) + (5/7)(3/8) = 20/56 + 15/56 = 35/56 = **5/8**, igual à chance da primeira (por simetria, qualquer posição tem a mesma chance). Sabendo que a primeira foi azul: sobram 5 vermelhas em 7, **5/7**.
4. P(ás) = 4/52 = 1/13; P(copas) = 13/52 = 1/4; P(ás de copas) = 1/52 = (1/13)(1/4). Como P(A ∩ B) = P(A)P(B), **são independentes**. (Saber o naipe não muda a chance de ser ás: há um ás em cada naipe.)
5. P(spam | marcado) = 0,95 × 0,3/(0,95 × 0,3 + 0,02 × 0,7) = 0,285/0,299 ≈ **95,3%**. Com 80% de spam: 0,76/(0,76 + 0,004) ≈ **99,5%**. Quanto maior a priori, mais confiável é a marcação.
6. A posteriori do primeiro teste vira a priori do segundo: P(D) = 1/6 (exatamente 0,0099/0,0594). P(D | ++) = 0,99 × (1/6)/(0,99 × 1/6 + 0,05 × 5/6) ≈ 0,165/0,2067 ≈ **79,8%**. Um segundo teste independente muda muito a conclusão; por isso exames positivos para doenças raras são confirmados com outro teste.

## Tema 2

1. **E[X] = 7** (linearidade: 3,5 + 3,5). **Var(X) = 35/6 ≈ 5,83** (a variância de um dado é E[X²] − 3,5² = 91/6 − 49/4 = 35/12; somando dois independentes, 35/6).
   ```python
   rng = np.random.default_rng()
   s = rng.integers(1, 7, (100_000, 2)).sum(axis=1)
   print(s.mean(), s.var())     # ≈ 7.0  5.83
   ```
2. E[ganho] = 1.000 × (1/500) − 5 = 2 − 5 = **−R$ 3 por aposta**. Em média você perde 60% do que aposta.
3. **Pontos fixos:** indicadora para cada posição, P = 1/n, esperança **1** (o mesmo problema dos chapéus). **Inversões:** indicadora para cada par (i, j) com i < j; por simetria, o par está fora de ordem com probabilidade 1/2. Há C(n, 2) pares: **n(n − 1)/4**. Isso explica por que a ordenação por inserção faz cerca de n²/4 trocas em média (cada troca corrige uma inversão).
4. P(X = 0) = e⁻³ ≈ **0,0498** (cerca de 5%). P(X > 6) = 1 − Σ_{k=0}^{6} e⁻³3ᵏ/k! ≈ **0,0335** (cerca de 3,4%).
5. Geométrica com p = 0,8: média **1/0,8 = 1,25 envios**. Precisar de mais de 3 = as três primeiras falharem: 0,2³ = **0,008**.
6. Var(X) = E[(X − μ)²] = E[X² − 2μX + μ²] = E[X²] − 2μE[X] + μ² (linearidade) = E[X²] − 2μ² + μ² = **E[X²] − μ²**. ∎
7. Quando você já tem i figurinhas distintas, cada pacote traz uma nova com probabilidade (n − i)/n: o número de pacotes até a próxima nova é geométrico com média n/(n − i). Somando para i = 0, ..., n − 1 (linearidade): n/n + n/(n − 1) + ... + n/1 = **n(1 + 1/2 + ... + 1/n) = n Hₙ ≈ n ln n**. Para n = 670: **≈ 4.747 figurinhas** (mais de 7 vezes o tamanho do álbum, sem trocas). Por isso trocar figurinhas compensa tanto.

## Tema 3

1. ```python
   for n in [10, 100, 1000, 10000]:
       medias = rng.integers(1, 7, (1000, n)).mean(axis=1)
       print(n, medias.std(), np.sqrt(35/12) / np.sqrt(n))
   ```
   O desvio das médias cai como **σ/√n** com σ = √(35/12) ≈ 1,708: cerca de 0,54; 0,17; 0,054; 0,017. Cada fator 100 em n divide o desvio por 10.
2. A soma de 30 exponenciais(1) tem média 30 e variância 30. O histograma fica parecido com Normal(30, 30), com uma leve assimetria à direita (a exponencial é bem assimétrica; com mais termos a assimetria some). (A soma exata segue uma distribuição Gama.)
3. **Markov:** P(X ≥ 90) ≤ 60/90 = **2/3**. **Chebyshev:** nota ≥ 90 significa |X − 60| ≥ 30 = 3σ, então P ≤ 1/9 ≈ **11%** (incluindo também as notas ≤ 30). Com mais informação (o desvio), a cota fica bem melhor.
4. Margem = 1,96 √(p(1 − p)/n) ≤ 0,02 com p = 0,5: √n ≥ 1,96 × 0,5/0,02 = 49, **n ≥ 2.401**. Por isso pesquisas nacionais entrevistam cerca de 2.000 a 2.500 pessoas, independentemente do tamanho do país.
5. A probabilidade exata de a maioria errar (no máximo 50 acertos em 101) é **≈ 0,021** (cerca de 2%). Chernoff (cauda inferior, μ = 60,6, δ = 1 − 50/60,6 ≈ 0,175) dá ≤ e^(−δ²μ/2) ≈ **0,40**: uma cota correta mas folgada, porque δ é pequeno. Com mais repetições, Chernoff garante a queda exponencial: com 1.001 rodadas, o erro real fica perto de 10⁻¹⁰.

## Tema 4

1. Pela fórmula: x̄ ± 1,96 × s/√50; pelo bootstrap, os percentis das médias reamostradas. Ambos dão intervalos parecidos, de largura ≈ 2 × 1,96 × 2/√50 ≈ 1,1. Repetindo 1.000 vezes, a fração de intervalos que contêm 10 fica **perto de 95%** (um pouco abaixo com n = 50, porque o certo para amostras pequenas é usar a distribuição t de Student, 2,01 em vez de 1,96).
2. log L(λ) = Σ (xᵢ log λ − λ − log xᵢ!). Derivando: Σ xᵢ/λ − n = 0, então **λ̂ = x̄** (a média amostral). Faz sentido: λ é a média da Poisson.
3. p̂_A = 0,040, p̂_B = 0,050, combinada p̂ = 0,045. Erro padrão = √(0,045 × 0,955 × (1/5.000 + 1/5.000)) ≈ 0,00415. z = 0,010/0,00415 ≈ **2,41**, valor-p (bilateral) ≈ **0,016** < 0,05: **significativo**. Por permutação: junte as 10.000 visitas (450 conversões), sorteie 5.000 para "A" muitas vezes e conte em que fração a diferença é ≥ 0,010 em módulo; dá aproximadamente o mesmo valor-p.
4. Com o primeiro elemento como pivô, uma lista **já ordenada** divide sempre em 0 e n − 1 elementos: O(n²). Um adversário que conhece o algoritmo pode sempre fornecer essa entrada. Com pivô aleatório, o tempo esperado é O(n log n) **para toda entrada**: a esperança é sobre as escolhas do algoritmo, que o adversário não controla. Só um azar extremo do gerador produz o pior caso, e Chernoff mostra que isso é exponencialmente improvável.
5. (1 − e^(−kn/m))ᵏ = (1 − e^(−0,7))⁷ ≈ **0,0082** (cerca de 0,8%). A simulação deve dar algo bem próximo. O k ótimo é (m/n) ln 2 ≈ 6,9, então k = 7 já é a melhor escolha para 10 bits por elemento.
6. Com k = 1, o item i (contando de 1) entra com probabilidade 1/i e depois precisa sobreviver às substituições dos itens i + 1, ..., n, e o item j não o substitui com probabilidade 1 − 1/j = (j − 1)/j. P = (1/i) × (i/(i + 1)) × ((i + 1)/(i + 2)) × ... × ((n − 1)/n) = **1/n**, porque o produto telescopa. ∎

## Projeto da etapa

Pontos de revisão:

- **Agulha de Buffon:** com agulha de comprimento L e tábuas de largura d (L ≤ d), P(cruzar uma linha) = 2L/(πd). Então π ≈ 2L × lançamentos/(d × cruzamentos). Converge devagar (erro ~1/√n), ótimo para discutir variância de estimadores.
- **Tamanho de amostra** para detectar 1 ponto percentual (de 5% para 6%) com α = 0,05 e poder 80%: n ≈ (1,96 + 0,84)² × (p₁(1 − p₁) + p₂(1 − p₂))/(p₂ − p₁)² ≈ 7,84 × 0,1039/0,0001 ≈ **8.150 por grupo**. Muitas empresas subestimam isso e tiram conclusões de testes pequenos demais.
- **Espiar todo dia:** simule A e B com a **mesma** taxa, faça o teste a cada "dia" (por exemplo, a cada 500 visitas, até 20 dias) e marque como falso positivo se em **algum** dia der p < 0,05. A taxa de falso positivo costuma ficar entre 20% e 30%, e não 5%. A correção é fixar o tamanho antes ou usar métodos sequenciais próprios para isso.
- O relatório deve dizer não só "significativo ou não", mas o **tamanho do efeito** com intervalo de confiança: "B aumentou a conversão em 1,0 ponto (IC 95%: 0,2 a 1,8)" informa muito mais que "p = 0,016".
