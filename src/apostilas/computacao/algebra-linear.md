# Álgebra Linear: Apostila Prática

Roadmap Ciência da Computação · Semanas 39 a 42

## Comece por aqui

Se o cálculo é a matemática da mudança, a álgebra linear é a matemática dos **dados**. Uma imagem é uma matriz de pixels; um documento vira um vetor de palavras; uma rede social é uma matriz de conexões; uma rede neural é uma sequência de multiplicações de matrizes; girar um personagem num jogo 3D é multiplicar por uma matriz. O curso 18.06 do MIT, do professor Gilbert Strang, é um dos mais assistidos da história do OpenCourseWare, e esta etapa segue a visão dele: entender matrizes pelo que elas **fazem** com vetores, e não só por regras de conta.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | MAT-27 Álgebra Linear (Curso Fundamental) |
| MIT | 18.06 Linear Algebra (Gilbert Strang) |
| Harvard | Math 21b; Math 22a |
| Oxford | Linear Algebra (1º ano) |

### Como esta apostila funciona

1. Faça as contas pequenas (2 × 2, 3 × 3) à mão e confira com **NumPy** (`import numpy as np`). As grandes, só no computador.
2. Assista aos vídeos de **3Blue1Brown, Essência da Álgebra Linear** em paralelo: eles mostram geometricamente o que cada conta faz.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** perdido numa conta com matrizes? Pense em cada matriz como uma **transformação** do plano (gira, estica, projeta). Desenhe o que ela faz com os vetores (1, 0) e (0, 1): as colunas da matriz são exatamente para onde eles vão.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 39 | Tema 1: Matrizes e sistemas lineares |
| 40 | Tema 2: Espaços vetoriais |
| 41 | Tema 3: Ortogonalidade e determinantes |
| 42 | Tema 4: Autovalores e SVD + projeto |

## Tema 1: Matrizes e sistemas lineares

**Objetivo:** operar com vetores e matrizes e resolver sistemas lineares por eliminação.

### 1.1 Vetores e matrizes

Um **vetor** em ℝⁿ é uma lista de n números: v = (v₁, ..., vₙ). Duas operações fundamentais: **somar** vetores e **multiplicar por escalar**. Juntas, formam **combinações lineares**: c₁v₁ + c₂v₂ + ... + cₖvₖ.

**Produto escalar:** u · v = u₁v₁ + ... + uₙvₙ = ‖u‖‖v‖cos θ. Zero quando perpendiculares. Em IA, a **similaridade de cosseno** u · v/(‖u‖‖v‖) mede o quanto dois documentos (ou dois *embeddings*) "apontam na mesma direção".

Uma **matriz** m × n tem m linhas e n colunas. Ela age sobre vetores: **Ax** é uma **combinação linear das colunas de A**, com os pesos dados por x.

```
[1 2] [x]     [1]     [2]
[3 4] [y] = x [3] + y [4]
```

Essa é a visão mais importante da etapa. A outra visão (cada componente de Ax é o produto escalar de uma linha de A com x) é a que você usa para calcular.

```python
import numpy as np
A = np.array([[1, 2], [3, 4]])
x = np.array([5, 6])
print(A @ x)                       # [17 39]
print(5 * A[:, 0] + 6 * A[:, 1])   # o mesmo: combinação das colunas
```

### 1.2 Produto de matrizes

AB é a matriz que faz "primeiro B, depois A": (AB)x = A(Bx). Cada coluna de AB é A vezes a coluna correspondente de B. Só existe se o número de colunas de A é o número de linhas de B: (m × n)(n × p) = m × p.

Propriedades:

- **Associativo:** (AB)C = A(BC).
- **Não comutativo:** AB ≠ BA em geral (girar e depois espelhar não é o mesmo que espelhar e depois girar).
- **Identidade** I: AI = IA = A.
- **Transposta:** (Aᵀ)ᵢⱼ = Aⱼᵢ, e (AB)ᵀ = BᵀAᵀ.

Transformações do plano como matrizes 2 × 2:

| Transformação | Matriz |
|---|---|
| Rotação por θ | [[cos θ, −sen θ], [sen θ, cos θ]] |
| Escala | [[sₓ, 0], [0, s_y]] |
| Espelho no eixo x | [[1, 0], [0, −1]] |
| Cisalhamento | [[1, k], [0, 1]] |
| Projeção no eixo x | [[1, 0], [0, 0]] |

Multiplicar matrizes n × n pela definição custa O(n³) operações. É a operação mais otimizada da computação: bibliotecas como BLAS e as GPUs existem em grande parte para fazê-la rápido.

### 1.3 Eliminação de Gauss

Para resolver Ax = b, a **eliminação de Gauss** subtrai múltiplos de uma linha das de baixo para zerar tudo abaixo da diagonal, chegando a um sistema **triangular superior** Ux = c, que se resolve de baixo para cima (**substituição regressiva**).

```
 x + 2y +  z = 2           x + 2y +  z = 2           x + 2y + z = 2
3x + 8y +  z = 12   →         2y − 2z = 6     →         2y − 2z = 6
      4y +  z = 2                4y + z = 2                    5z = −10
```

Daí z = −2, y = (6 + 2z)/2 = 1, x = 2 − 2y − z = 2. Os números na diagonal (1, 2, 5) são os **pivôs**. Se um pivô der zero, troca-se de linha; se não houver como, o sistema não tem solução única.

Custo: cerca de n³/3 multiplicações. Na prática, use `np.linalg.solve(A, b)`, que faz isso com cuidados numéricos (**pivotamento parcial**: escolher como pivô o maior valor da coluna, para não dividir por números minúsculos).

> **Cuidado! Cai na prática:** quase nunca calcule a inversa para resolver um sistema (`np.linalg.inv(A) @ b`). É mais lento e menos preciso que `solve`.

### 1.4 Fatoração LU

A eliminação de Gauss, guardada, é uma **fatoração**: **A = LU**, com L triangular inferior (os multiplicadores usados) e U triangular superior (o resultado da eliminação).

Vantagem: fatore uma vez (O(n³)) e resolva Ax = b para **muitos** b diferentes com custo O(n²) cada (Ly = b para a frente, Ux = y para trás). Com trocas de linha: PA = LU, com P uma matriz de permutação.

```python
from scipy.linalg import lu
P, L, U = lu(A)
```

### 1.5 Matriz inversa

A **inversa** A⁻¹ satisfaz AA⁻¹ = A⁻¹A = I: desfaz a transformação. Existe se e só se A é quadrada e a eliminação produz n pivôs não nulos. Para 2 × 2:

```
[a b]⁻¹         1      [ d  −b]
[c d]    =  ───────    [−c   a]
             ad − bc
```

Uma matriz sem inversa (**singular**) "achata" o espaço: leva algum vetor não nulo ao zero, e então não há como voltar. Exemplo: a projeção no eixo x leva (0, 1) e (0, 2) ambos para (0, 0).

Inversa do produto: (AB)⁻¹ = B⁻¹A⁻¹ (para desfazer "primeiro B, depois A", desfaça A primeiro).

### Atividades de fixação do Tema 1

1. Escreva Ax como combinação das colunas para A = [[2, 1], [1, 3]] e x = (1, −2), e confira com o produto linha a linha.
2. Calcule AB e BA para A = [[1, 1], [0, 1]] e B = [[1, 0], [1, 1]]. Que transformações são essas? Por que os resultados diferem?
3. Encontre a matriz de "girar 90° e depois espelhar no eixo x", multiplicando as matrizes na ordem certa. Teste no vetor (1, 0).
4. Resolva por eliminação, mostrando os pivôs: 2x + y + z = 5; 4x − 6y = −2; −2x + 7y + 2z = 9.
5. Fatore A = [[2, 1], [6, 8]] em LU e use a fatoração para resolver Ax = (3, 8).
6. Calcule a inversa de [[3, 1], [5, 2]] e confira. Por que [[1, 2], [2, 4]] não tem inversa? Que vetor ela leva em zero?

## Tema 2: Espaços vetoriais

**Objetivo:** entender subespaços, base, dimensão e posto, e o que eles dizem sobre os sistemas Ax = b.

### 2.1 Espaços e subespaços

Um **espaço vetorial** é um conjunto onde dá para somar e multiplicar por escalar sem sair dele (ℝⁿ, polinômios, funções). Um **subespaço** é um subconjunto que também é fechado para essas operações (e, portanto, contém o zero).

Em ℝ³, os subespaços são: {0}, retas pela origem, planos pela origem e o ℝ³ inteiro. Uma reta que **não** passa pela origem não é subespaço.

O **espaço gerado** (*span*) por vetores v₁, ..., vₖ é o conjunto de todas as combinações lineares deles.

### 2.2 Independência linear

v₁, ..., vₖ são **linearmente independentes** se a única combinação que dá zero é a trivial: c₁v₁ + ... + cₖvₖ = 0 só com todos os cᵢ = 0. Intuição: nenhum deles é "redundante" (combinação dos outros).

- (1, 0) e (0, 1): independentes.
- (1, 2) e (2, 4): dependentes (o segundo é o dobro do primeiro).
- Quaisquer 3 vetores em ℝ²: dependentes (não cabe mais "direção nova").

Teste prático: monte uma matriz com os vetores como colunas e elimine. São independentes se e só se toda coluna tem pivô.

### 2.3 Base e dimensão

Uma **base** de um espaço é um conjunto de vetores **independentes** que **geram** o espaço. Todo vetor se escreve de forma **única** como combinação da base: os coeficientes são as **coordenadas**.

Todas as bases de um espaço têm o mesmo número de vetores: a **dimensão**. ℝⁿ tem dimensão n; um plano pela origem em ℝ³ tem dimensão 2.

Mudar de base é mudar de "ponto de vista". Muito do que vem a seguir (autovetores, SVD, Fourier, PCA) consiste em achar a **base certa** onde o problema fica simples.

### 2.4 Posto

O **posto** (*rank*) de A é o número de pivôs, que é igual ao número de colunas independentes, que é igual ao número de linhas independentes (um fato nada óbvio). Mede quanta "informação" a matriz tem.

```python
np.linalg.matrix_rank(np.array([[1, 2, 3], [2, 4, 6], [1, 0, 1]]))   # 2
```

Uma matriz m × n de posto 1 é o produto de uma coluna por uma linha: uvᵀ. Toda matriz é soma de matrizes de posto 1, e o SVD (Tema 4) diz quais são as mais importantes. É a base da compressão de imagens e dos sistemas de recomendação.

### 2.5 Os quatro subespaços fundamentais

Para A (m × n) de posto r, quatro subespaços contam tudo sobre Ax = b:

| Subespaço | Definição | Dimensão | Vive em |
|---|---|---|---|
| Espaço coluna C(A) | Todos os Ax | r | ℝᵐ |
| Espaço nulo N(A) | Todos os x com Ax = 0 | n − r | ℝⁿ |
| Espaço linha C(Aᵀ) | Combinações das linhas | r | ℝⁿ |
| Nulo à esquerda N(Aᵀ) | Todos os y com Aᵀy = 0 | m − r | ℝᵐ |

O que eles respondem:

- **Ax = b tem solução** se e só se b está em C(A).
- Se tem, todas as soluções são **x = xₚ + xₙ**: uma solução particular mais qualquer vetor do espaço nulo. Solução única sse N(A) = {0} (posto = n).
- **Teorema do posto e nulidade:** dim C(A) + dim N(A) = n. (As colunas "usadas" mais as "livres" somam todas.)
- O espaço linha é **perpendicular** ao espaço nulo (cada linha vezes x dá 0). O mesmo vale para C(A) e N(Aᵀ). Strang chama isso de "o quadro geral da álgebra linear".

### Atividades de fixação do Tema 2

1. Quais são subespaços de ℝ³? (a) {(x, y, z) : x + y + z = 0}; (b) {(x, y, z) : x + y + z = 1}; (c) {(x, y, z) : x = 2y}; (d) {(x, y, z) : xy = 0}.
2. Os vetores (1, 1, 0), (0, 1, 1), (1, 0, −1) são independentes? Se não, escreva um como combinação dos outros.
3. Ache uma base e a dimensão do plano x − 2y + 3z = 0.
4. Calcule o posto de [[1, 2, 1], [2, 4, 3], [3, 6, 4]] e encontre uma base do espaço nulo.
5. Para a matriz do exercício 4, para quais b = (b₁, b₂, b₃) o sistema Ax = b tem solução? Escreva a solução geral para b = (1, 3, 4).
6. Uma matriz 5 × 8 pode ter espaço nulo {0}? Uma 8 × 5 pode ter C(A) = ℝ⁸? Justifique com dimensões.

## Tema 3: Ortogonalidade e determinantes

**Objetivo:** projetar vetores, resolver mínimos quadrados, construir bases ortonormais e entender determinantes.

### 3.1 Ortogonalidade

u e v são **ortogonais** quando u · v = uᵀv = 0. Uma base **ortonormal** tem vetores ortogonais dois a dois e de comprimento 1. Ela é a melhor base possível: as coordenadas de x são simplesmente os produtos escalares qᵢ · x, sem resolver sistema nenhum.

Uma matriz Q com colunas ortonormais satisfaz **QᵀQ = I**. Se é quadrada, Q⁻¹ = Qᵀ (inverter é transpor, de graça). Matrizes ortogonais preservam comprimentos e ângulos: são rotações e espelhamentos. Por isso são numericamente estáveis (não amplificam erros).

### 3.2 Projeções

A **projeção** de b na reta de a é o ponto da reta mais perto de b:

**p = (aᵀb / aᵀa) a**

O erro e = b − p é **perpendicular** a a. Projetar em um subespaço C(A) (gerado pelas colunas de A) generaliza isso:

**p = A x̂**, com x̂ resolvendo **AᵀA x̂ = Aᵀb** (as equações normais)

A **matriz de projeção** é P = A(AᵀA)⁻¹Aᵀ, com P² = P (projetar duas vezes é o mesmo que uma) e Pᵀ = P.

### 3.3 Mínimos quadrados

Quando Ax = b **não tem solução** (mais equações que incógnitas, dados com ruído), procure o x̂ que minimiza ‖Ax − b‖². A resposta é projetar b em C(A): resolver **AᵀA x̂ = Aᵀb**.

Ajuste de reta y = c + dt aos pontos (0, 1), (1, 3), (2, 4), (3, 7):

```
    [1 0]           [1]
A = [1 1]   x = [c]  b = [3]
    [1 2]       [d]      [4]
    [1 3]                [7]

AᵀA = [[4, 6], [6, 14]]     Aᵀb = [15, 32]
→ c = 0,9 e d = 1,9
```

O mesmo resultado que você achou em Cálculo com derivadas parciais, agora como geometria: **a melhor aproximação é a projeção ortogonal**. Regressão linear, ajuste de curvas, calibração de sensores e GPS usam mínimos quadrados.

```python
A = np.column_stack([np.ones(4), np.arange(4)])
b = np.array([1, 3, 4, 7])
x, *_ = np.linalg.lstsq(A, b, rcond=None)
print(x)     # [0.9 1.9]
```

### 3.4 Gram-Schmidt

Transforma uma base qualquer a₁, a₂, ... em uma ortonormal q₁, q₂, ...: de cada vetor, subtraia as projeções nos q's anteriores e normalize.

```python
def gram_schmidt(A):
    Q = []
    for a in A.T:                     # cada coluna
        v = a.astype(float)
        for q in Q:
            v = v - (q @ v) * q
        Q.append(v / np.linalg.norm(v))
    return np.array(Q).T
```

Registrando os coeficientes, obtém-se a fatoração **A = QR** (Q ortonormal, R triangular superior). Com ela, mínimos quadrados vira R x̂ = Qᵀb, numericamente mais estável que as equações normais (que elevam ao quadrado o número de condição). Na prática, `np.linalg.qr` usa reflexões de Householder, mais estáveis que Gram-Schmidt.

### 3.5 Determinantes

O **determinante** de uma matriz quadrada é um número com significado geométrico: o **fator de mudança de área** (em 2D) ou **de volume** (em 3D) da transformação, com sinal (negativo se inverte a orientação, como um espelho).

```
det [a b] = ad − bc
    [c d]
```

Propriedades:

- **det A ≠ 0 ⟺ A é inversível.** (Determinante zero: a transformação achata o espaço, volume zero.)
- det(AB) = det(A) det(B); det(Aᵀ) = det(A); det(A⁻¹) = 1/det(A).
- Trocar duas linhas inverte o sinal. Matriz triangular: produto da diagonal. Por isso, det A = ± (produto dos pivôs), e é assim que se calcula na prática, em O(n³).

> **Cuidado! Cai na prova:** a expansão por cofatores (a fórmula com sinais alternados que se aprende no ensino médio) custa O(n!) operações. Para n = 20 seriam 2 × 10¹⁸ termos. Use eliminação.

Aplicações: testar se três pontos são colineares, calcular áreas de polígonos (fórmula do "cadarço"), a mudança de variáveis em integrais (o jacobiano) e o teste de orientação em geometria computacional (de que lado de uma reta está um ponto).

### Atividades de fixação do Tema 3

1. Projete b = (1, 2, 3) na reta de a = (1, 1, 1). Verifique que o erro é perpendicular a a.
2. Ache a matriz de projeção no plano gerado por (1, 0, 1) e (0, 1, 0) e verifique que P² = P.
3. Ajuste uma parábola y = c + dt + et² aos pontos (−1, 2), (0, 0), (1, 1), (2, 5) por mínimos quadrados (monte A e resolva no NumPy).
4. Aplique Gram-Schmidt a (1, 1, 0), (1, 0, 1), (0, 1, 1). Confira que QᵀQ = I.
5. Calcule o determinante de [[2, 1, 3], [0, 4, 1], [0, 0, 5]] e de [[1, 2, 3], [4, 5, 6], [7, 8, 9]]. O que o segundo resultado diz sobre a matriz?
6. Use um determinante para calcular a área do triângulo de vértices (1, 1), (4, 2) e (2, 5).

## Tema 4: Autovalores e SVD

**Objetivo:** encontrar as direções especiais de uma matriz e usar o SVD para comprimir e analisar dados.

### 4.1 Autovalores e autovetores

Um **autovetor** de A é um vetor não nulo cuja direção **não muda** quando multiplicado por A: só é esticado ou encolhido.

**Ax = λx**

λ é o **autovalor** (o fator de esticamento). Para achar: Ax = λx ⟺ (A − λI)x = 0 tem solução não nula ⟺ **det(A − λI) = 0** (a equação característica).

Exemplo:

```
A = [[2, 1], [1, 2]]
det(A − λI) = (2 − λ)² − 1 = λ² − 4λ + 3 = 0  →  λ = 1 ou λ = 3
λ = 3: (A − 3I)x = 0 → x = (1, 1)
λ = 1: (A − I)x = 0 → x = (1, −1)
```

A matriz estica por 3 na diagonal (1, 1) e deixa a direção (1, −1) igual.

Fatos úteis: a soma dos autovalores é o **traço** (soma da diagonal) e o produto é o **determinante**. Matrizes de rotação 2D (exceto 0° e 180°) não têm autovetores reais (nenhuma direção fica parada): os autovalores são complexos.

```python
valores, vetores = np.linalg.eig(np.array([[2, 1], [1, 2]]))
```

### 4.2 Diagonalização

Se A (n × n) tem n autovetores independentes, juntando-os como colunas de S:

**A = S Λ S⁻¹**, com Λ diagonal (os autovalores)

Na base dos autovetores, A é só uma escala em cada eixo. Consequência poderosa: **Aᵏ = S Λᵏ S⁻¹**, e Λᵏ é só elevar cada autovalor a k. Isso explica o comportamento de longo prazo de sistemas que se repetem:

- Se todos os |λ| < 1, Aᵏx → 0.
- O maior |λ| domina: Aᵏx cresce como λₘₐₓᵏ na direção do autovetor correspondente.

Fibonacci como matriz: (Fₙ₊₁, Fₙ) = [[1, 1], [1, 0]] (Fₙ, Fₙ₋₁). Os autovalores são φ ≈ 1,618 e ψ ≈ −0,618: daí sai de novo a fórmula de Binet que você viu em Matemática Discreta.

**Matrizes simétricas** (A = Aᵀ) são as mais bem comportadas (**teorema espectral**): autovalores sempre **reais** e autovetores **ortogonais**. Então **A = Q Λ Qᵀ**. Matrizes de covariância, hessianas e de grafos não dirigidos são simétricas.

### 4.3 SVD

Toda matriz, mesmo retangular e sem autovetores, tem uma **decomposição em valores singulares**:

**A = U Σ Vᵀ**

- V (n × n) ortogonal: direções de entrada.
- Σ (m × n) diagonal com **valores singulares** σ₁ ≥ σ₂ ≥ ... ≥ 0.
- U (m × m) ortogonal: direções de saída.

Geometricamente: **toda** transformação linear é uma rotação (Vᵀ), seguida de uma escala nos eixos (Σ), seguida de outra rotação (U). Os σᵢ são as raízes dos autovalores de AᵀA, e o número de σᵢ não nulos é o posto.

Escrito como soma: **A = σ₁u₁v₁ᵀ + σ₂u₂v₂ᵀ + ... + σᵣuᵣvᵣᵀ**, matrizes de posto 1 em ordem de importância. **Teorema de Eckart-Young:** a melhor aproximação de A com posto k (a de menor erro) é a soma dos k primeiros termos.

**Compressão de imagem:** uma foto 1000 × 1000 em tons de cinza é uma matriz com 10⁶ números. Guardando k = 50 termos do SVD: 50 × (1000 + 1000 + 1) ≈ 10⁵ números, 10% do original, quase sem diferença visual (os valores singulares de imagens reais caem rápido).

```python
U, s, Vt = np.linalg.svd(imagem, full_matrices=False)
k = 50
aprox = U[:, :k] @ np.diag(s[:k]) @ Vt[:k, :]
```

O SVD também resolve mínimos quadrados de forma robusta (a **pseudoinversa** A⁺ = VΣ⁺Uᵀ, usada pelo `lstsq`), mede o número de condição (σ₁/σᵣ: quanto a matriz amplifica erros) e está por trás de sistemas de recomendação (a matriz usuários × filmes aproximada por posto baixo, como no famoso prêmio da Netflix).

### 4.4 PageRank

Como o Google original ordenava páginas: uma página é importante se é apontada por páginas importantes. Modele um navegador aleatório: em cada passo, ele segue um link aleatório da página atual (com probabilidade 0,85) ou pula para uma página qualquer (0,15). A fração do tempo que ele passa em cada página, a longo prazo, é o **PageRank**.

Matematicamente: monte a matriz de transição M (coluna j = probabilidades de ir da página j para cada página). O vetor de PageRank r satisfaz **Mr = r**: é o **autovetor de autovalor 1**. Acha-se pelo **método da potência**: comece com r uniforme e repita r ← Mr até estabilizar (funciona porque 1 é o maior autovalor e os outros são menores em módulo, então as outras componentes somem).

```python
def pagerank(links, n, d=0.85, iters=100):
    M = np.zeros((n, n))
    for origem, destinos in links.items():
        for dest in destinos:
            M[dest, origem] = 1 / len(destinos)
    r = np.ones(n) / n
    for _ in range(iters):
        r = d * M @ r + (1 - d) / n
    return r
```

(Páginas sem links de saída precisam de tratamento especial: considera-se que elas apontam para todas.)

### 4.5 PCA e compressão

A **análise de componentes principais** (PCA) acha as direções de **maior variância** num conjunto de dados, para reduzir dimensão mantendo o máximo de informação.

1. Centralize os dados (subtraia a média de cada coluna). Seja X a matriz n × d (n amostras, d características).
2. As direções principais são os autovetores da matriz de covariância C = XᵀX/(n − 1), ou, de forma equivalente e mais estável, os vetores vᵢ do SVD de X.
3. Projete os dados nos k primeiros: X_k = X V_k. A fração de variância mantida é (σ₁² + ... + σₖ²)/(Σ σᵢ²).

Usos: visualizar dados de alta dimensão em 2D, remover ruído, acelerar modelos. O clássico *eigenfaces* reconhecia rostos projetando fotos nos principais "rostos-base".

### Atividades de fixação do Tema 4

1. Ache autovalores e autovetores de [[4, 1], [2, 3]]. Confira traço e determinante.
2. Diagonalize A = [[1, 1], [1, 0]] e use isso para calcular F₃₀ (Fibonacci) sem iterar. Confira com Python.
3. Por que [[0, −1], [1, 0]] não tem autovetor real? Que transformação ela é?
4. Calcule o SVD de A = [[3, 0], [4, 5]] com NumPy. Verifique que σ₁² e σ₂² são os autovalores de AᵀA, e que σ₁σ₂ = |det A|.
5. Calcule o PageRank de 4 páginas com links 0 → 1, 0 → 2, 1 → 2, 2 → 0, 3 → 2. Qual a mais importante? Por que a página 3 tem o menor valor?
6. Gere 200 pontos 2D ao longo da reta y = 2x com ruído pequeno. Aplique PCA e mostre que a primeira componente aponta aproximadamente na direção (1, 2)/√5 e mantém quase toda a variância.

## Projeto da etapa

**Compressão de imagem com SVD e regressão "na mão":**

1. Carregue uma foto (com `matplotlib.pyplot.imread` ou Pillow), converta para tons de cinza e calcule o SVD.
2. Mostre lado a lado as reconstruções com k = 1, 5, 20, 50 e 100, com a taxa de compressão e o erro relativo ‖A − Aₖ‖/‖A‖ de cada uma.
3. Faça o gráfico dos valores singulares (escala log) e da fração de "energia" acumulada Σσᵢ² para escolher k automaticamente (por exemplo, 99% da energia).
4. Para imagens coloridas, comprima cada canal (R, G, B) separadamente.
5. **Regressão linear sem `lstsq`:** implemente a eliminação de Gauss com pivotamento parcial e use-a para resolver as equações normais de um conjunto de dados real (por exemplo, preço de imóveis em função de área e quartos). Compare com a solução por QR (`np.linalg.qr`) e por `lstsq`, e mostre que as equações normais perdem precisão quando as colunas são quase dependentes.
6. Bônus: PageRank da rede de links entre os artigos de uma categoria da Wikipédia.

## Para ir além

- **MIT 18.06SC** no OpenCourseWare: as aulas de Gilbert Strang, com exercícios resolvidos.
- *Introduction to Linear Algebra* (Strang) e o mais recente *Linear Algebra for Everyone*.
- **3Blue1Brown, Essência da Álgebra Linear** (YouTube): intuição geométrica de tudo desta etapa.
- **MIT 18.065** *Matrix Methods in Data Analysis, Signal Processing, and Machine Learning*: a continuação natural, com foco em dados e IA.
- *Coding the Matrix* (Philip Klein): álgebra linear com aplicações em Python.

## Resumão

- Ax é uma combinação das colunas de A. AB é "primeiro B, depois A"; não comuta.
- Eliminação de Gauss: zera abaixo dos pivôs, resolve de trás para frente. A = LU. Use `solve`, não a inversa.
- Subespaço: fechado para soma e escalar, contém o zero. Base: independente e geradora; dimensão é o tamanho da base.
- Posto = número de pivôs. Ax = b tem solução sse b ∈ C(A); solução geral = particular + espaço nulo.
- Quatro subespaços: C(A) e N(Aᵀ) em ℝᵐ, C(Aᵀ) e N(A) em ℝⁿ, ortogonais aos pares.
- Projeção: o ponto mais perto; o erro é perpendicular. Mínimos quadrados: AᵀA x̂ = Aᵀb.
- Base ortonormal: QᵀQ = I. Gram-Schmidt e QR.
- Determinante: fator de volume; zero sse singular. Calcule por eliminação, nunca por cofatores.
- Ax = λx; det(A − λI) = 0. A = SΛS⁻¹ e Aᵏ = SΛᵏS⁻¹. Simétrica: autovalores reais, autovetores ortogonais.
- SVD: A = UΣVᵀ, para qualquer matriz. Os k primeiros termos são a melhor aproximação de posto k.
- PageRank é um autovetor (método da potência). PCA: direções de maior variância, pelo SVD dos dados centralizados.
