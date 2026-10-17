# Probabilidade e Estatística: Apostila Prática

Roadmap Ciência da Computação · Semanas 43 a 46

## Comece por aqui

O mundo real é incerto: pacotes se perdem na rede, usuários chegam em horários imprevisíveis, sensores têm ruído, dados têm amostras enviesadas. Probabilidade é a linguagem para raciocinar sob incerteza, e ela está por toda a computação: algoritmos randomizados (quicksort, hashing, testes de primalidade), análise de caso médio, aprendizado de máquina (que é, no fundo, estatística com muito dado), criptografia, sistemas distribuídos e testes A/B. A disciplina Stat 110 de Harvard, do professor Joe Blitzstein, é uma das mais populares da universidade, com aulas e livro gratuitos; esta etapa segue o espírito dela: intuição, histórias e muita simulação.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | MOQ-13 Probabilidade e Estatística |
| MIT | 6.3700 (antiga 6.041) Introduction to Probability; 18.05 Introduction to Probability and Statistics |
| Harvard | Stat 110 Probability (Joe Blitzstein) |
| Oxford | Probability (1º ano) |

### Como esta apostila funciona

1. Para cada resultado, **simule** em Python antes ou depois de calcular. Se a simulação e a conta discordarem, uma delas está errada, e descobrir qual ensina muito.
2. Probabilidade engana a intuição (paradoxo do aniversário, Monty Hall, falso positivo). Desconfie da primeira resposta que vier à cabeça.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** travou? Defina com precisão o **espaço amostral** e o **evento**. Metade dos erros em probabilidade é contar a coisa errada. Liste os casos para um exemplo pequeno.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 43 | Tema 1: Probabilidade e Bayes |
| 44 | Tema 2: Variáveis aleatórias |
| 45 | Tema 3: Teoremas limite e desigualdades |
| 46 | Tema 4: Estatística e probabilidade em algoritmos + projeto |

## Tema 1: Probabilidade e Bayes

**Objetivo:** calcular probabilidades, condicionar em informação nova e usar o teorema de Bayes.

### 1.1 Espaço amostral

- **Espaço amostral** Ω: todos os resultados possíveis de um experimento. Dois dados: 36 pares (1, 1), ..., (6, 6).
- **Evento:** um subconjunto de Ω. "A soma é 7" = {(1, 6), (2, 5), (3, 4), (4, 3), (5, 2), (6, 1)}.
- **Probabilidade** P: atribui a cada evento um número entre 0 e 1, com P(Ω) = 1 e P(A ∪ B) = P(A) + P(B) quando A e B são disjuntos (os **axiomas de Kolmogorov**).

Quando todos os resultados são igualmente prováveis: **P(A) = |A| / |Ω|**. Aí, probabilidade é contagem, e todas as técnicas da Matemática Discreta servem. P(soma 7) = 6/36 = 1/6.

Consequências dos axiomas:

- P(Aᶜ) = 1 − P(A). (Muitas vezes é mais fácil calcular o complemento.)
- P(A ∪ B) = P(A) + P(B) − P(A ∩ B) (inclusão e exclusão).
- **Cota da união:** P(A₁ ∪ ... ∪ Aₙ) ≤ P(A₁) + ... + P(Aₙ). Simples e muito usada em análise de algoritmos ("a chance de **algo** dar errado é no máximo a soma das chances de cada coisa dar errado").

**Paradoxo do aniversário:** com k pessoas, P(nenhum aniversário repetido) = (365/365)(364/365)...((365 − k + 1)/365). Com 23 pessoas, a chance de **haver** repetição passa de 50%. Em computação, isso diz que, com uma função hash de N saídas, colisões aparecem depois de só ~√N inserções (o "ataque do aniversário" contra funções hash criptográficas).

### 1.2 Probabilidade condicional

P(A | B) é a probabilidade de A **sabendo** que B aconteceu:

**P(A | B) = P(A ∩ B) / P(B)**

Intuição: B vira o novo universo, e olhamos que fração dele também está em A.

Exemplo: dois dados, sabendo que a soma é 8, qual a chance de pelo menos um ser 6? Soma 8: {(2, 6), (3, 5), (4, 4), (5, 3), (6, 2)}, 5 casos; com 6: 2 casos. Resposta: 2/5.

**Regra do produto:** P(A ∩ B) = P(A | B) P(B). Encadeando: P(A₁ ∩ A₂ ∩ A₃) = P(A₁) P(A₂ | A₁) P(A₃ | A₁ ∩ A₂).

**Lei da probabilidade total:** se B₁, ..., Bₙ particionam Ω, então P(A) = Σ P(A | Bᵢ) P(Bᵢ). Divida em casos e pondere.

### 1.3 Independência

A e B são **independentes** quando saber de um não muda a chance do outro: P(A | B) = P(A), ou equivalentemente **P(A ∩ B) = P(A) P(B)**.

- Dois lançamentos de moeda: independentes.
- "Chove hoje" e "chove amanhã": dependentes.

> **Cuidado! Cai na prova:** independente **não** é o mesmo que disjunto. Eventos disjuntos com probabilidade positiva são **dependentes**: se um acontece, o outro certamente não acontece.

**Falácia do apostador:** depois de 10 caras seguidas, a próxima jogada continua sendo 50%. A moeda não tem memória.

Em sistemas: se cada um de 3 servidores independentes cai com probabilidade 0,01, a chance de **todos** caírem é 0,01³ = 10⁻⁶. É assim que redundância aumenta a disponibilidade. O perigo é a independência ser falsa (os três no mesmo data center, que fica sem energia).

### 1.4 Teorema de Bayes

Inverte a condicional:

**P(A | B) = P(B | A) P(A) / P(B)**

Exemplo clássico, o teste médico: uma doença atinge 1% da população. O teste acerta 99% dos doentes (sensibilidade) e dá falso positivo em 5% dos saudáveis. Alguém testou positivo. Qual a chance de estar doente?

```
P(D) = 0,01     P(+ | D) = 0,99     P(+ | não D) = 0,05
P(+) = 0,99 × 0,01 + 0,05 × 0,99 = 0,0099 + 0,0495 = 0,0594
P(D | +) = 0,0099 / 0,0594 ≈ 0,167
```

**Só 16,7%!** Como a doença é rara, os falsos positivos (5% de muita gente) superam os verdadeiros positivos (99% de pouca gente). Ignorar a probabilidade a priori (a taxa base) é um dos erros de raciocínio mais comuns, inclusive entre médicos e juízes.

Vocabulário: P(A) é a **priori**, P(B | A) a **verossimilhança**, P(A | B) a **posteriori**. Bayes é a regra para **atualizar crenças com evidências**, e é a base de filtros de spam (Naive Bayes), diagnóstico, localização de robôs e de uma escola inteira da estatística.

### Atividades de fixação do Tema 1

1. Três moedas são lançadas. Qual a probabilidade de pelo menos duas caras? E de pelo menos uma cara?
2. Calcule em Python a menor quantidade de pessoas para que a chance de aniversário repetido passe de 50%, 90% e 99%.
3. Uma urna tem 5 bolas vermelhas e 3 azuis. Tiram-se duas sem reposição. Qual a chance de a segunda ser vermelha? E de a segunda ser vermelha sabendo que a primeira foi azul?
4. Num baralho de 52 cartas, os eventos "tirar um ás" e "tirar uma carta de copas" são independentes? Prove.
5. Um filtro marca como spam 95% dos spams e 2% dos e-mails legítimos. 30% dos e-mails são spam. Se um e-mail foi marcado, qual a chance de ser spam? E se 80% dos e-mails fossem spam?
6. No problema do teste médico, a pessoa faz um **segundo** teste independente e dá positivo de novo. Qual a chance de estar doente agora?

## Tema 2: Variáveis aleatórias

**Objetivo:** modelar quantidades aleatórias, calcular esperança e variância e reconhecer as distribuições principais.

### 2.1 Variáveis discretas e contínuas

Uma **variável aleatória** X é um número que depende do resultado do experimento (formalmente, uma função de Ω em ℝ): a soma de dois dados, o tempo até um servidor responder, o número de comparações do quicksort.

- **Discreta:** valores contáveis. Descrita pela **função de massa** P(X = k).
- **Contínua:** valores num intervalo. Descrita por uma **densidade** f(x), com P(a ≤ X ≤ b) = ∫ₐᵇ f(x) dx. P(X = x exato) = 0.

A **função de distribuição acumulada** F(x) = P(X ≤ x) serve para os dois tipos.

### 2.2 Esperança

A **esperança** (valor esperado, média) é a média ponderada pelos pesos das probabilidades:

- Discreta: E[X] = Σ k P(X = k).
- Contínua: E[X] = ∫ x f(x) dx.

Dado honesto: E[X] = (1 + 2 + 3 + 4 + 5 + 6)/6 = 3,5. (Não precisa ser um valor possível.)

**Linearidade da esperança:** **E[X + Y] = E[X] + E[Y]**, sempre, **mesmo que X e Y sejam dependentes**. É a ferramenta mais poderosa desta etapa.

Exemplo: n pessoas deixam o chapéu na entrada e recebem um chapéu aleatório na saída. Quantas, em média, recebem o próprio? Seja Xᵢ = 1 se a pessoa i recebe o seu (**variável indicadora**). E[Xᵢ] = P(pessoa i recebe o seu) = 1/n. Total X = X₁ + ... + Xₙ, E[X] = n × 1/n = **1**, para qualquer n. Calcular a distribuição de X seria difícil; a esperança sai em uma linha.

O truque das indicadoras resolve muitas análises de algoritmos: o número esperado de comparações do quicksort aleatório (≈ 2n ln n) sai somando, para cada par de elementos, a probabilidade de eles serem comparados.

### 2.3 Variância

A **variância** mede o espalhamento em torno da média:

**Var(X) = E[(X − μ)²] = E[X²] − (E[X])²**

O **desvio padrão** σ = √Var(X) está na mesma unidade de X.

Propriedades: Var(aX + b) = a² Var(X). Se X e Y são **independentes**, Var(X + Y) = Var(X) + Var(Y) (aqui a independência é necessária).

Consequência importante: a média de n cópias independentes, X̄ = (X₁ + ... + Xₙ)/n, tem **Var(X̄) = σ²/n**, ou desvio σ/√n. Mais amostras, estimativa mais precisa, mas com retorno decrescente: para dividir o erro por 10, são precisas 100 vezes mais amostras. É o 1/√n do Monte Carlo.

### 2.4 Distribuições principais

| Distribuição | Modela | P(X = k) ou f(x) | E[X] | Var(X) |
|---|---|---|---|---|
| Bernoulli(p) | Um sucesso ou fracasso | p ou 1 − p | p | p(1 − p) |
| Binomial(n, p) | Sucessos em n tentativas | C(n, k)pᵏ(1 − p)ⁿ⁻ᵏ | np | np(1 − p) |
| Geométrica(p) | Tentativas até o 1º sucesso | (1 − p)ᵏ⁻¹p | 1/p | (1 − p)/p² |
| Poisson(λ) | Eventos raros num intervalo | e^(−λ) λᵏ/k! | λ | λ |
| Uniforme(a, b) | Qualquer valor no intervalo | 1/(b − a) | (a + b)/2 | (b − a)²/12 |
| Exponencial(λ) | Tempo até um evento | λe^(−λx) | 1/λ | 1/λ² |
| Normal(μ, σ²) | Somas de muitos efeitos pequenos | e^(−(x − μ)²/2σ²)/(σ√(2π)) | μ | σ² |

Onde aparecem em computação:

- **Binomial:** quantos de n pacotes chegam, se cada um chega com probabilidade p.
- **Geométrica:** quantas tentativas até um algoritmo randomizado acertar; quantas vezes um protocolo reenvia. Com p = 1/2, em média 2 tentativas.
- **Poisson:** requisições por segundo num servidor, erros por página, chegadas numa fila.
- **Exponencial:** tempo entre requisições, tempo até um disco falhar. É **sem memória**: P(X > s + t | X > s) = P(X > t). Um componente que "não envelhece".
- **Normal:** erros de medição, alturas, e (Tema 3) médias de quase qualquer coisa.

```python
import numpy as np
rng = np.random.default_rng(42)
print(rng.binomial(100, 0.3, 10))        # 10 amostras de Binomial(100, 0.3)
print(rng.poisson(4, 10).mean())          # ≈ 4
print(rng.exponential(1/2, 100_000).mean())   # ≈ 0.5 (numpy usa a escala 1/λ)
```

### Atividades de fixação do Tema 2

1. Calcule E[X] e Var(X) para X = soma de dois dados. Confira por simulação.
2. Uma loteria custa R$ 5, paga R$ 1.000 com probabilidade 1/500 e nada no resto. Qual o ganho esperado por aposta?
3. Embaralhe uma lista de n números distintos. Qual o número esperado de elementos que ficam na posição em que já estavam? E o número esperado de pares (i, j) com i < j fora de ordem (inversões)?
4. Um servidor recebe em média 3 requisições por segundo (Poisson). Qual a chance de receber zero em um segundo? E mais de 6?
5. Um protocolo reenvia um pacote até ele chegar; cada envio chega com probabilidade 0,8. Quantos envios em média? Qual a chance de precisar de mais de 3?
6. Prove que Var(X) = E[X²] − (E[X])² a partir da definição.
7. **Colecionador de figurinhas:** um álbum tem n figurinhas diferentes e cada pacote traz uma aleatória. Use a geométrica e a linearidade para mostrar que o número esperado de pacotes até completar é n(1 + 1/2 + ... + 1/n) ≈ n ln n. Quanto dá para n = 670 (o álbum da Copa)?

## Tema 3: Teoremas limite e desigualdades

**Objetivo:** entender por que médias se estabilizam, por que a normal aparece em todo lugar e como limitar a chance de eventos raros.

### 3.1 Lei dos grandes números

Se X₁, X₂, ... são independentes com a mesma distribuição e média μ, a média amostral X̄ₙ = (X₁ + ... + Xₙ)/n **converge** para μ quando n cresce.

É o que justifica Monte Carlo, pesquisas eleitorais, cassinos (que ganham com certeza no longo prazo) e seguradoras. Não diz que "a sorte se equilibra" no curto prazo (isso é a falácia do apostador): diz que a **média** se estabiliza porque desvios ficam pequenos **relativamente** a n.

```python
import numpy as np
rng = np.random.default_rng(0)
lancamentos = rng.integers(1, 7, 100_000)
medias = np.cumsum(lancamentos) / np.arange(1, 100_001)
print(medias[[9, 99, 999, 99_999]])    # aproximando-se de 3.5
```

### 3.2 Teorema central do limite

O resultado mais surpreendente da probabilidade: a **soma** (ou média) de muitas variáveis independentes, **qualquer que seja a distribuição de cada uma** (desde que tenha variância finita), é aproximadamente **normal**.

**X̄ₙ ≈ Normal(μ, σ²/n)**, ou seja, (X̄ₙ − μ)/(σ/√n) ≈ Normal(0, 1)

Por isso a curva em forma de sino aparece em tudo que é resultado de muitos efeitos pequenos somados. Experimente: some 12 uniformes em [0, 1] e faça o histograma; já parece uma normal.

Regra 68-95-99,7 da normal: cerca de 68% dos valores ficam a até 1σ da média, 95% a até 2σ (mais precisamente 1,96σ) e 99,7% a até 3σ.

Uso imediato: ao jogar 10.000 moedas, o número de caras tem média 5.000 e desvio √(10.000 × 0,25) = 50. Ver 5.150 caras (3 desvios acima) seria muito suspeito.

### 3.3 Desigualdades de Markov e Chebyshev

Às vezes não sabemos a distribuição, mas queremos **garantias**. As desigualdades dão limites que valem sempre.

**Markov:** se X ≥ 0, então **P(X ≥ a) ≤ E[X]/a**.

Exemplo: se o tempo médio de resposta é 100 ms, no máximo 10% das requisições levam 1 s ou mais. Fraco, mas não precisa de mais nada.

**Chebyshev:** para qualquer X com média μ e desvio σ, **P(|X − μ| ≥ kσ) ≤ 1/k²**.

No máximo 25% dos valores ficam a 2 desvios ou mais da média, para qualquer distribuição. (Na normal, são só 5%; Chebyshev é pessimista porque vale para todas.)

Aplicada à média amostral, Chebyshev **prova** a lei dos grandes números: P(|X̄ₙ − μ| ≥ ε) ≤ σ²/(nε²) → 0.

### 3.4 Limite de Chernoff

Para **somas de variáveis independentes** limitadas (como indicadoras), dá para dizer muito mais: a chance de a soma se afastar da média cai **exponencialmente**.

Uma forma: se X = X₁ + ... + Xₙ com Xᵢ ∈ {0, 1} independentes e μ = E[X], então, para 0 < δ < 1,

**P(X ≥ (1 + δ)μ) ≤ e^(−δ²μ/3)** e **P(X ≤ (1 − δ)μ) ≤ e^(−δ²μ/2)**

Comparando, para 10.000 moedas e a chance de 6.000 ou mais caras (μ = 5.000, δ = 0,2):

| Limite | Valor |
|---|---|
| Markov | ≤ 5.000/6.000 ≈ 0,83 |
| Chebyshev | ≤ 2.500/1.000² = 0,0025 |
| Chernoff | ≤ e^(−0,04 × 5.000/3) ≈ e^(−66,7) ≈ 10⁻²⁹ |

Chernoff é a ferramenta que prova que algoritmos randomizados funcionam "com altíssima probabilidade": repetir um algoritmo que acerta com probabilidade 2/3 umas 100 vezes e votar na maioria torna o erro astronomicamente pequeno. Também é a base de limites em aprendizado de máquina (quantos exemplos são necessários para generalizar).

### Atividades de fixação do Tema 3

1. Simule a média de n lançamentos de um dado para n = 10, 100, 1.000 e 10.000, repetindo 1.000 vezes cada. Como cai o desvio padrão das médias? Bate com σ/√n?
2. Some 30 variáveis exponenciais independentes (λ = 1) e faça o histograma de 10.000 somas. Sobreponha a normal com a média e a variância corretas.
3. A nota média de uma turma é 60 (notas de 0 a 100). Use Markov para limitar a fração de alunos com nota ≥ 90. Se o desvio padrão é 10, o que Chebyshev diz sobre notas ≥ 90?
4. Uma pesquisa eleitoral entrevista n pessoas. Usando a aproximação normal, qual n garante margem de erro de 2 pontos percentuais com 95% de confiança (pior caso p = 0,5)?
5. Um algoritmo de Monte Carlo acerta com probabilidade 0,6. Você roda 101 vezes e fica com a maioria. Estime a chance de errar por simulação e compare com Chernoff.

## Tema 4: Estatística e probabilidade em algoritmos

**Objetivo:** estimar quantidades a partir de dados, quantificar a incerteza, testar hipóteses e usar aleatoriedade para projetar algoritmos.

### 4.1 Estimação

Na probabilidade, conhecemos o modelo e calculamos chances. Na **estatística**, temos dados e queremos descobrir o modelo.

Um **estimador** é uma fórmula que calcula, a partir da amostra, um palpite para um parâmetro desconhecido:

- A **média amostral** X̄ estima a média μ.
- A **variância amostral** s² = Σ(xᵢ − x̄)²/(n − 1) estima σ². (Divide-se por n − 1, e não por n, para o estimador não ficar sistematicamente pequeno; é a **correção de Bessel**.)
- A **proporção amostral** p̂ estima uma proporção p.

**Máxima verossimilhança** (MLE): escolha os parâmetros que tornam os dados observados **mais prováveis**. Exemplo: 7 caras em 10 lançamentos; a verossimilhança é L(p) = C(10, 7)p⁷(1 − p)³, máxima em **p̂ = 0,7**. Treinar a maioria dos modelos de aprendizado de máquina é maximizar uma verossimilhança (ou minimizar o seu negativo logaritmo, que é a função de perda).

### 4.2 Intervalos de confiança

Um número só esconde a incerteza. Um **intervalo de confiança** de 95% para μ, com n grande:

**x̄ ± 1,96 × s/√n**

Interpretação correta: se repetíssemos o experimento muitas vezes, **95% dos intervalos construídos assim conteriam o μ verdadeiro**. (Não é "há 95% de chance de μ estar neste intervalo específico", que é a interpretação bayesiana.)

Para proporções: p̂ ± 1,96 √(p̂(1 − p̂)/n).

**Bootstrap:** quando não há fórmula, reamostre os próprios dados com reposição milhares de vezes, recalcule a estatística e use os percentis 2,5% e 97,5%. Puro poder computacional no lugar de fórmulas.

```python
def bootstrap_ic(dados, estatistica, b=10_000, rng=np.random.default_rng()):
    reamostras = [estatistica(rng.choice(dados, len(dados))) for _ in range(b)]
    return np.percentile(reamostras, [2.5, 97.5])
```

### 4.3 Testes de hipótese

Pergunta: a diferença observada é real ou pode ser acaso?

1. **Hipótese nula H₀:** não há efeito ("o botão novo não muda a taxa de cliques").
2. Calcule uma **estatística de teste** a partir dos dados.
3. **Valor-p:** supondo H₀ verdadeira, a probabilidade de ver um resultado **tão extremo quanto** o observado.
4. Se o valor-p for menor que um limiar α combinado antes (tipicamente 0,05), rejeite H₀.

**Teste A/B** de duas proporções: versão A com x₁ cliques em n₁ visitas, B com x₂ em n₂. Sob H₀ (mesma taxa), z = (p̂₂ − p̂₁)/√(p̂(1 − p̂)(1/n₁ + 1/n₂)), com p̂ a taxa combinada, é aproximadamente Normal(0, 1). |z| > 1,96 corresponde a p < 0,05.

**Teste de permutação** (versão computacional): misture os rótulos A e B aleatoriamente milhares de vezes e veja com que frequência a diferença embaralhada é tão grande quanto a real. Sem fórmulas, poucas suposições.

> **Cuidado! Cai na entrevista:** valor-p **não** é a probabilidade de H₀ ser verdadeira. E testar muitas hipóteses (20 variações de botão) garante "descobertas" por acaso: com α = 0,05, em média 1 de cada 20 testes sem efeito dá significativo. Isso se chama **p-hacking** ou problema das comparações múltiplas; corrija dividindo α pelo número de testes (Bonferroni) ou defina a hipótese antes de olhar os dados. Também não pare o teste "quando der significativo": decida o tamanho da amostra antes.

### 4.4 Algoritmos randomizados e hashing

Aleatoriedade é uma **ferramenta de projeto** de algoritmos:

**Las Vegas** (sempre certo, tempo aleatório): o **quicksort com pivô aleatório** tem tempo esperado O(n log n) para **qualquer** entrada; nenhum adversário consegue escolher uma entrada ruim, porque a aleatoriedade está no algoritmo, não nos dados.

**Monte Carlo** (tempo fixo, pode errar com pequena probabilidade): o **teste de primalidade de Miller-Rabin** erra com probabilidade ≤ 1/4 por rodada; com 40 rodadas, ≤ 4⁻⁴⁰ ≈ 10⁻²⁴, menor que a chance de um raio cósmico mudar um bit da memória durante a conta.

**Hashing:** uma tabela hash com m baldes e n chaves, com hash "aleatório", tem em média n/m chaves por balde (linearidade: cada chave cai no balde j com probabilidade 1/m). Com n ≈ m, a busca é O(1) em média. O **hashing universal** escolhe a função hash aleatoriamente de uma família, garantindo esse comportamento para qualquer conjunto de chaves (você verá em Estruturas de Dados).

**Estruturas probabilísticas** trocam um pouco de precisão por muito espaço:

- **Filtro de Bloom:** "este elemento está no conjunto?" com k bits por elemento. Nunca dá falso negativo, dá falso positivo com probabilidade controlada (≈ (1 − e^(−kn/m))ᵏ). Usado em bancos de dados e navegadores.
- **HyperLogLog:** estima quantos elementos **distintos** passaram num fluxo de bilhões, usando poucos kilobytes. Usado no Redis e em sistemas de análise.

**Amostragem de reservatório:** escolher k itens uniformemente de um fluxo de tamanho desconhecido, numa passada só:

```python
import random
def reservatorio(fluxo, k):
    amostra = []
    for i, item in enumerate(fluxo):
        if i < k:
            amostra.append(item)
        else:
            j = random.randint(0, i)        # inclusive
            if j < k:
                amostra[j] = item
    return amostra
```

Cada item termina na amostra com probabilidade exatamente k/n (prova por indução).

### Atividades de fixação do Tema 4

1. Gere 50 amostras de uma Normal(10, 4) e calcule o intervalo de 95% para a média pela fórmula e pelo bootstrap. Repita o experimento 1.000 vezes: em que fração das vezes o intervalo contém 10?
2. Ache o estimador de máxima verossimilhança de λ para dados que seguem uma Poisson (derive o log da verossimilhança e iguale a zero).
3. Teste A/B: A teve 200 conversões em 5.000 visitas; B teve 250 em 5.000. A diferença é significativa a 5%? Faça pelo teste z e por permutação.
4. Explique por que o quicksort com pivô aleatório não tem uma "entrada de pior caso", enquanto o quicksort que sempre pega o primeiro elemento tem.
5. Um filtro de Bloom tem m = 10.000 bits, k = 7 funções hash e n = 1.000 elementos. Qual a taxa de falso positivo esperada? Simule e compare.
6. Prove que a amostragem de reservatório com k = 1 escolhe cada item com probabilidade 1/n.

## Projeto da etapa

**Simulações de Monte Carlo e análise de um teste A/B:**

1. **Simulações clássicas**, cada uma com a resposta exata e o erro da estimativa em função do número de simulações: paradoxo do aniversário, Monty Hall, colecionador de figurinhas e a agulha de Buffon (estimar π jogando agulhas num assoalho).
2. **Teorema central do limite visual:** histogramas da média de n variáveis de várias distribuições (uniforme, exponencial, Bernoulli com p = 0,05) para n = 1, 2, 5, 30, sobrepondo a normal teórica.
3. **Teste A/B completo** com dados simulados ou de um conjunto público:
   - Defina hipótese, métrica e tamanho de amostra **antes** (calcule o n necessário para detectar uma diferença de 1 ponto percentual com 80% de poder).
   - Calcule a diferença, o intervalo de confiança, o valor-p pelo teste z e por permutação.
   - Simule o efeito de "espiar" o resultado todo dia e parar quando der significativo: mostre que a taxa de falso positivo sobe muito acima de 5%.
4. Relatório em notebook explicando cada resultado em linguagem simples, como para alguém de produto.

## Para ir além

- **Harvard Stat 110** (Joe Blitzstein): aulas no YouTube, listas com soluções e o livro *Introduction to Probability* (Blitzstein e Hwang, gratuito online).
- **MIT 18.05** no OpenCourseWare: probabilidade e estatística com abordagem frequentista e bayesiana.
- **MIT 6.041/6.431** (John Tsitsiklis), também no OCW, mais formal.
- *Probability and Computing* (Mitzenmacher e Upfal): probabilidade aplicada a algoritmos (Chernoff, hashing, filtros de Bloom).
- **Seeing Theory** (Brown University): visualizações interativas de probabilidade.

## Resumão

- P(A) = |A|/|Ω| com resultados equiprováveis. Complemento e cota da união facilitam muito.
- P(A | B) = P(A ∩ B)/P(B). Independentes: P(A ∩ B) = P(A)P(B). Disjunto não é independente.
- Bayes: posteriori ∝ verossimilhança × priori. Não ignore a taxa base (falsos positivos).
- Linearidade da esperança vale sempre; indicadoras transformam contagens difíceis em somas fáceis.
- Var(X̄) = σ²/n: erro cai com 1/√n.
- Binomial (sucessos), geométrica (espera), Poisson (eventos raros), exponencial (tempo, sem memória), normal (somas).
- Lei dos grandes números: médias convergem. TCL: médias são aproximadamente normais.
- Markov (X ≥ 0), Chebyshev (1/k²), Chernoff (exponencial, para somas de independentes).
- MLE: parâmetros que tornam os dados mais prováveis. IC 95%: x̄ ± 1,96 s/√n. Bootstrap quando não há fórmula.
- Valor-p não é P(H₀). Cuidado com múltiplas comparações e com parar o teste cedo.
- Las Vegas (sempre certo) e Monte Carlo (pode errar); pivô aleatório, Miller-Rabin, hashing, Bloom, reservatório.
