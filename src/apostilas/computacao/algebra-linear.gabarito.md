# Gabarito: Álgebra Linear

Abra só depois de tentar.

## Tema 1

1. Ax = 1 × (2, 1) + (−2) × (1, 3) = (2 − 2, 1 − 6) = **(0, −5)**. Linha a linha: (2 × 1 + 1 × (−2), 1 × 1 + 3 × (−2)) = (0, −5). ✓
2. A = [[1, 1], [0, 1]] é um **cisalhamento horizontal** (x ← x + y); B = [[1, 0], [1, 1]] é um **cisalhamento vertical** (y ← x + y). **AB = [[2, 1], [1, 1]]** e **BA = [[1, 1], [1, 2]]**. Diferem porque a ordem das transformações importa: AB aplica B primeiro, BA aplica A primeiro.
3. Rotação de 90°: R = [[0, −1], [1, 0]]. Espelho no eixo x: E = [[1, 0], [0, −1]]. "Girar e depois espelhar" é **ER = [[0, −1], [−1, 0]]** (a primeira transformação fica à direita). Teste: (1, 0) gira para (0, 1) e espelha para (0, −1); ER(1, 0) = primeira coluna = (0, −1). ✓
4. ```
   2x +  y +  z =  5            2x + y + z = 5          2x + y + z = 5
   4x − 6y      = −2    →          −8y − 2z = −12   →      −8y − 2z = −12
  −2x + 7y + 2z =  9                8y + 3z = 14                  z = 2
   ```
   (L2 − 2 × L1; L3 + L1; depois L3 + L2.) Pivôs: **2, −8, 1**. De baixo para cima: z = 2; −8y − 4 = −12 → y = 1; 2x + 1 + 2 = 5 → x = 1. Solução **(1, 1, 2)**.
5. Multiplicador ℓ₂₁ = 6/2 = 3. **L = [[1, 0], [3, 1]]**, **U = [[2, 1], [0, 5]]**. Ly = b: y₁ = 3, y₂ = 8 − 3 × 3 = −1. Ux = y: x₂ = −1/5 = −0,2; 2x₁ − 0,2 = 3 → x₁ = 1,6. Solução **(1,6; −0,2)**. Conferindo: 6 × 1,6 + 8 × (−0,2) = 9,6 − 1,6 = 8. ✓
6. det = 3 × 2 − 1 × 5 = 1, inversa **[[2, −1], [−5, 3]]** (confira multiplicando: dá I). [[1, 2], [2, 4]] tem **det = 0**: a segunda coluna é o dobro da primeira, então tudo cai na reta da direção (1, 2). Ela leva **(2, −1)** em zero: 2 × (1, 2) − 1 × (2, 4) = (0, 0).

## Tema 2

1. (a) **Sim**: plano pela origem (fechado para soma e escalar). (b) **Não**: não contém o zero. (c) **Sim**: plano pela origem. (d) **Não**: (1, 0, 0) e (0, 1, 0) estão no conjunto, mas a soma (1, 1, 0) não (1 × 1 ≠ 0).
2. **Dependentes**: (1, 1, 0) − (0, 1, 1) = (1, 0, −1). Ou seja, o terceiro é o primeiro menos o segundo.
3. x = 2y − 3z. Variáveis livres y e z: (2y − 3z, y, z) = y(2, 1, 0) + z(−3, 0, 1). Base **{(2, 1, 0), (−3, 0, 1)}**, dimensão **2**.
4. Eliminação: L2 − 2L1 = (0, 0, 1); L3 − 3L1 = (0, 0, 1); L3 − L2 = (0, 0, 0). Pivôs nas colunas 1 e 3: **posto 2**. Espaço nulo: x₃ = 0 e x₁ + 2x₂ = 0, então x = t(−2, 1, 0). Base **{(−2, 1, 0)}** (dimensão 3 − 2 = 1, como manda o teorema do posto e nulidade).
5. A eliminação aplicada a b dá a condição b₃ − b₁ − b₂ = 0 (a linha 3 de A é a soma das linhas 1 e 2). O sistema tem solução sse **b₃ = b₁ + b₂**. Para b = (1, 3, 4): 4 = 1 + 3 ✓. Da linha reduzida, x₃ = b₂ − 2b₁ = 1, e x₁ + 2x₂ = 1 − x₃ = 0. Solução particular (0, 0, 1). Geral: **x = (0, 0, 1) + t(−2, 1, 0)**.
6. **5 × 8:** posto ≤ 5, então dim N(A) = 8 − posto ≥ 3. Não pode ser {0}: com mais incógnitas que equações, sempre sobram variáveis livres. **8 × 5:** dim C(A) = posto ≤ 5 < 8. Não pode ser ℝ⁸: cinco colunas não geram um espaço de dimensão 8.

## Tema 3

1. aᵀb = 6, aᵀa = 3, **p = 2 × (1, 1, 1) = (2, 2, 2)**. Erro e = (−1, 0, 1); e · a = −1 + 0 + 1 = 0. ✓
2. Os vetores (1, 0, 1) e (0, 1, 0) já são ortogonais, então P é a soma das projeções em cada um: P = a₁a₁ᵀ/2 + a₂a₂ᵀ = **[[0,5; 0; 0,5], [0; 1; 0], [0,5; 0; 0,5]]**. P² = P: a primeira linha vezes a primeira coluna dá 0,25 + 0 + 0,25 = 0,5, e assim por diante.
3. ```python
   t = np.array([-1, 0, 1, 2]); y = np.array([2, 0, 1, 5])
   A = np.column_stack([np.ones(4), t, t**2])
   print(np.linalg.lstsq(A, y, rcond=None)[0])    # [ 0.  -0.5  1.5]
   ```
   **y = −0,5t + 1,5t²**. AᵀA = [[4, 2, 6], [2, 6, 8], [6, 8, 18]] e Aᵀb = (8, 9, 23). Surpresa: o erro é **zero**, os quatro pontos estão exatamente sobre essa parábola (confira: t = 2 dá −1 + 6 = 5).
4. q₁ = (1, 1, 0)/√2. Para a₂ = (1, 0, 1): tire (q₁ · a₂)q₁ = (1/2, 1/2, 0), sobra (1/2, −1/2, 1), normalizado **q₂ = (1, −1, 2)/√6**. Para a₃ = (0, 1, 1): tire (1/2, 1/2, 0) e (1/6)(1, −1, 2), sobra (−2/3, 2/3, 2/3), normalizado **q₃ = (−1, 1, 1)/√3**. QᵀQ = I (confira os produtos: q₁ · q₂ = (1 − 1 + 0)/√12 = 0 etc.).
5. Triangular: produto da diagonal, **2 × 4 × 5 = 40**. A segunda tem **det = 0**: é singular. As linhas são dependentes (L1 + L3 = 2 × L2), o posto é 2, e ela achata ℝ³ num plano.
6. Vetores a partir de (1, 1): (3, 1) e (1, 4). Área = ½ |det [[3, 1], [1, 4]]| = ½ |12 − 1| = **5,5**.

## Tema 4

1. det(A − λI) = (4 − λ)(3 − λ) − 2 = λ² − 7λ + 10 = 0 → **λ = 5 e λ = 2**. λ = 5: [[−1, 1], [2, −2]]x = 0 → **x = (1, 1)**. λ = 2: [[2, 1], [2, 1]]x = 0 → **x = (1, −2)**. Traço 7 = 5 + 2 ✓; det 10 = 5 × 2 ✓.
2. Equação característica λ² − λ − 1 = 0, autovalores φ = (1 + √5)/2 e ψ = (1 − √5)/2, autovetores (φ, 1) e (ψ, 1). Aⁿ = SΛⁿS⁻¹ leva a Fₙ = (φⁿ − ψⁿ)/√5. Para n = 30: **F₃₀ = 832.040**.
   ```python
   phi, psi = (1 + 5**0.5) / 2, (1 - 5**0.5) / 2
   print(round((phi**30 - psi**30) / 5**0.5))     # 832040
   print(np.linalg.matrix_power(np.array([[1, 1], [1, 0]]), 30)[0, 1])   # 832040
   ```
3. É a **rotação de 90°**: gira todo vetor, então nenhuma direção fica parada. det(A − λI) = λ² + 1 = 0 só tem raízes complexas, **λ = ±i**. (Números complexos de módulo 1 representam rotações.)
4. AᵀA = [[25, 20], [20, 25]], autovalores 45 e 5. Então **σ₁ = √45 = 3√5 ≈ 6,708 e σ₂ = √5 ≈ 2,236**. σ₁σ₂ = √225 = **15 = |det A|** (3 × 5 − 0 × 4 = 15). ✓ Em geral, o produto dos valores singulares de uma matriz quadrada é |det A|.
5. Com d = 0,85: **r ≈ (0,373; 0,196; 0,394; 0,038)**. A página **2** é a mais importante (recebe links de 0, 1 e 3). A página 0 vem logo atrás porque recebe **todo** o voto da página 2, que é forte. A página **3** não recebe nenhum link: só ganha a parte do "pulo aleatório", (1 − 0,85)/4 = 0,0375.
6. ```python
   rng = np.random.default_rng(0)
   x = rng.uniform(-5, 5, 200)
   pts = np.column_stack([x, 2 * x + rng.normal(0, 0.3, 200)])
   X = pts - pts.mean(axis=0)
   U, s, Vt = np.linalg.svd(X, full_matrices=False)
   print(Vt[0], (1, 2) / np.sqrt(5))     # mesma direção (talvez com sinal trocado)
   print(s**2 / np.sum(s**2))            # ≈ [0.999, 0.001]
   ```
   O sinal do vetor singular é arbitrário (v e −v são a mesma direção).

## Projeto da etapa

Pontos de revisão:

- Taxa de compressão com k termos para uma imagem m × n: k(m + n + 1)/(mn). Só compensa se k < mn/(m + n + 1) (para 1000 × 1000, k < ~500).
- Em fotos reais, k entre 20 e 50 costuma ser visualmente aceitável; texturas finas (grama, cabelo) exigem k maior porque espalham energia por muitos valores singulares.
- Ao reconstruir, limite os valores ao intervalo válido de pixel (`np.clip(aprox, 0, 1)` ou 0 a 255).
- **Pivotamento parcial**, no laço da eliminação:
  ```python
  p = i + np.argmax(np.abs(M[i:, i]))   # maior valor da coluna i, da linha i para baixo
  M[[i, p]] = M[[p, i]]                  # troca as linhas
  ```
- **Equações normais versus QR:** o número de condição de AᵀA é o **quadrado** do de A. Com duas colunas quase iguais (por exemplo, área em m² e área em pés², que são proporcionais com pequeno ruído), cond(A) pode ser 10⁶ e cond(AᵀA) 10¹²: as equações normais perdem uns 12 dígitos dos 16 disponíveis. O QR e o `lstsq` (que usa SVD) perdem só uns 6. É o motivo pelo qual bibliotecas sérias não usam as equações normais.
