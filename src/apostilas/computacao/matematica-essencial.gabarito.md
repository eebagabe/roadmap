# Gabarito: Matemática Essencial

Abra só depois de tentar.

## Tema 1

1. (a) 2/5 + 3/10 = 4/10 + 3/10 = **7/10**; (b) (3/4) × (8/9) = 24/36 = **2/3**; (c) 2⁵⁻² = 2³ = **8**; (d) 2¹² ÷ 2¹⁰ = 2² = **4**.
2. 2 TB = 2 × 2⁴⁰ = 2⁴¹ bytes. 2⁴¹ ÷ 2²² = **2¹⁹ = 524.288 arquivos**.
3. (a) **6** (2⁶ = 64); (b) **−3** (2⁻³ = 1/8); (c) **−3**; (d) log₂(2²⁰) = **20**.
4. log₂(10⁹) ≈ 29,9, então no máximo **30 passos**. Para 5.000 alunos: 2¹² = 4.096 não basta e 2¹³ = 8.192 basta, então **13 bits**.
5. (a) 3x = 12, **x = 4**; (b) Δ = 49 − 40 = 9, x = (7 ± 3)/2, **x = 5 ou x = 2**; (c) −3x ≤ 9, dividindo por −3 inverte: **x ≥ −3**.
6. B é mais rápido quando n² < 50n, ou seja, n < 50 (para n positivo). Então **B é mais rápido para n de 1 a 49**, empatam em n = 50 e A é mais rápido a partir de 51. Lição: para entradas pequenas, o algoritmo "pior" pode ganhar.
7. Da segunda, x = 1 + y. Substituindo: 2(1 + y) + 3y = 12, 5y = 10, **y = 2 e x = 3**.

## Tema 2

1. (a) **x ≠ 3**; (b) **x ≥ −2**; (c) **x > 0**.
2. **f(x) = 30 + 0,10 × (x − 1.000)**, para x ≥ 1.000. Ex.: 1.500 MB custa 30 + 50 = R$ 80.
3. Vértice: x_v = 6/2 = 3, f(3) = 9 − 18 + 8 = −1: **(3, −1)**. Raízes: Δ = 36 − 32 = 4, x = (6 ± 2)/2: **x = 2 e x = 4**. Como a = 1 > 0, é ponto de **mínimo**.
4. Ordem: **log n < n < n log n < n² < n³ < 2ⁿ**. Para n = 32: log₂ n = 5; n = 32; n log₂ n = 160; n² = 1.024; n³ = 32.768; 2ⁿ = 4.294.967.296.
5. (g ∘ f)(2) = g(f(2)) = g(5) = **25**. (f ∘ g)(2) = f(4) = **11**. Inversa: y = 3x − 1, x = (y + 1)/3, então **f⁻¹(y) = (y + 1)/3**.
6. ```python
   import numpy as np, matplotlib.pyplot as plt
   x = np.arange(1, 61)
   plt.plot(x, 2.0**x, label="2^x")
   plt.plot(x, x.astype(float)**10, label="x^10")
   plt.yscale("log"); plt.legend(); plt.show()
   print([n for n in range(2, 80) if 2**n > n**10][0])   # 59
   ```
   Em x = 1 a exponencial ganha (2 contra 1), em x = 2 a polinomial já passa (4 contra 1.024) e fica na frente por muito tempo. A exponencial só volta a ganhar a partir de **x = 59**, e daí em diante nunca mais perde. É por isso que a análise de algoritmos olha para n grande.

## Tema 3

1. PA com a₁ = 5, r = 3. Número de termos: (302 − 5)/3 + 1 = 100. Soma: 100 × (5 + 302)/2 = **15.350**.
2. PG com a₁ = 1, q = 3, 11 termos: (3¹¹ − 1)/(3 − 1) = (177.147 − 1)/2 = **88.573**. Em Python: `sum(3**i for i in range(11))`.
3. **Σ_{i=1}^{100} 2i** = 2 × (100 × 101/2) = **10.100**.
4. Para cada i (n vezes), o par de laços internos roda 0 + 1 + ... + (n − 1) = n(n − 1)/2 vezes. Total: **n × n(n − 1)/2 = n²(n − 1)/2**, que cresce como n³.
5. 26 × 26 × 26 × 10 × 26 × 10 × 10 = 26⁴ × 10³ = **456.976.000 placas**.
6. Apertos de mão: C(8, 2) = 8 × 7/2 = **28**. Presidente, vice e tesoureiro (a ordem importa, os cargos são diferentes): 8 × 7 × 6 = **336**.
7. 2⁵ = **32 casos**. Com 30 opções, 2³⁰ ≈ **1,07 bilhão de casos**: inviável testar tudo. Por isso existem técnicas como testes por pares (*pairwise*), que você verá em Engenharia de Software.

## Tema 4

1. Altura: √(5² − 3²) = √16 = **4 m**. Ângulo com o chão: cos θ = 3/5, θ = acos(0,6) ≈ **53,13°**.
   ```python
   import math
   print(math.degrees(math.acos(3 / 5)))      # 53.13...
   print(math.degrees(math.atan2(4, 3)))      # o mesmo, pela tangente
   ```
2. 135° = 135π/180 = **3π/4 rad**. 5π/6 rad = 5 × 180/6 = **150°**.
3. ```python
   import math
   for h in range(12):
       ang = math.radians(90 - 30 * h)        # 12 horas no topo, sentido horário
       x, y = 10 * math.cos(ang), 10 * math.sin(ang)
       print(h if h else 12, round(x, 2), round(y, 2))
   ```
4. a + b = **(−1, 7)**; ‖a‖ = √(9 + 16) = **5**; a · b = 3 × (−4) + 4 × 3 = **0**. Sim, **são perpendiculares**.
5. 90°: (1 × 0 − 0 × 1, 1 × 1 + 0 × 0) = **(0, 1)**. 45°: **(√2/2, √2/2) ≈ (0,707; 0,707)**.
6. m = (8 − 2)/(3 − 1) = 3. Usando (1, 2): 2 = 3 × 1 + b, b = −1. Reta: **y = 3x − 1**. Distância: √(2² + 6²) = √40 = **2√10 ≈ 6,32**.

## Projeto da etapa

Pontos que o projeto precisa mostrar:

- Fatorial e C(n, k) iterativos, conferidos com `math.factorial` e `math.comb` para vários valores (inclua os casos de borda 0! = 1 e C(n, 0) = 1).
- log₂ inteiro: um laço que divide por 2 enquanto n > 1, contando os passos; compare com `int(math.log2(n))`.
- No gráfico em escala logarítmica, n² e 2ⁿ devem se cruzar perto de n = 4 e a exponencial deve virar uma reta (exponencial em escala log é linear).
- Relógio: ângulo de cada número igual a 90° − 30° × h; ponteiro dos minutos gira 6° por minuto e o das horas 0,5° por minuto.
- Senhas: com 62 símbolos e 8 caracteres, 62⁸ ≈ 2,18 × 10¹⁴ senhas; a 10⁹ tentativas por segundo, cerca de 2,5 dias para testar todas. Com 12 caracteres, cerca de 100 mil anos. Conclusão para o README: tamanho de senha pesa mais que variedade de símbolos.
