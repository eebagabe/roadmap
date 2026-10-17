# Gabarito: Cálculo

Abra só depois de tentar.

## Tema 1

1. (a) (x² − 9)/(x − 3) = x + 3 para x ≠ 3, limite **6**. (b) Divida em cima e embaixo por x²: (3 + 1/x²)/(1 − 5/x²) → **3**. (c) Multiplique pelo conjugado: (√(1 + x) − 1)/x × (√(1 + x) + 1)/(√(1 + x) + 1) = x/(x(√(1 + x) + 1)) = 1/(√(1 + x) + 1) → **1/2**.
2. ```python
   import math
   n = 1
   while abs((1 + 1/n)**n - math.e) >= 1e-3:
       n += 1
   print(n)     # 1359
   ```
   O erro é aproximadamente e/(2n), então cai devagar: precisa de **n = 1.359**.
3. f(x) = x³ − x − 1 é contínua (polinômio), f(1) = −1 < 0 e f(2) = 5 > 0. Pelo teorema do valor intermediário, há raiz em (1, 2). Bisseção: **x ≈ 1,324718** (cerca de 20 iterações para 6 casas).
4. (a) ((x + h)³ − x³)/h = (3x²h + 3xh² + h³)/h = 3x² + 3xh + h² → **3x²**. (b) (1/(x + h) − 1/x)/h = (x − (x + h))/(h x (x + h)) = −1/(x(x + h)) → **−1/x²**.
5. A derivada exata é cos(1) ≈ 0,5403. A diferença progressiva tem erro de truncamento proporcional a h; a central, a h². Diminuindo h, os erros caem (a central bem mais rápido) até por volta de h = 10⁻⁵ (central) ou 10⁻⁸ (progressiva). Depois, o **erro de arredondamento** (≈ ε/h) domina e o erro volta a **crescer**. Com h = 10⁻¹², ambos os métodos já perdem vários dígitos. No gráfico log-log aparece um "V".

## Tema 2

1. (a) **12x² − 2**. (b) Produto: **eˣ(x² + 2x)**. (c) Cadeia: **2x/(x² + 1)**. (d) Quociente: **(3x cos 3x − sen 3x)/x²**. (e) Cadeia: **cos x × e^(sen x)**.
2. σ(x) = (1 + e⁻ˣ)⁻¹. Pela cadeia, σ′(x) = −(1 + e⁻ˣ)⁻² × (−e⁻ˣ) = e⁻ˣ/(1 + e⁻ˣ)². Agora, 1 − σ = e⁻ˣ/(1 + e⁻ˣ), então σ(1 − σ) = [1/(1 + e⁻ˣ)] × [e⁻ˣ/(1 + e⁻ˣ)] = e⁻ˣ/(1 + e⁻ˣ)². ∎ É útil porque, na retropropagação, o valor de σ(x) **já foi calculado** na ida; a derivada sai com uma multiplicação, sem recalcular exponenciais.
3. Perímetro 2x + 2y = 40, y = 20 − x, área A = x(20 − x). A′ = 20 − 2x = 0 → x = 10: **quadrado 10 × 10, área 100**. Com o muro: 2x + y = 40 (o muro é o quarto lado), A = x(40 − 2x), A′ = 40 − 4x = 0 → **x = 10, y = 20, área 200**.
4. ∛x em 27: f′(x) = 1/(3x^(2/3)) = 1/27. ∛27,3 ≈ 3 + 0,3/27 ≈ **3,01111** (real 3,01107). ln(1 + x) em 0: ln(1,05) ≈ **0,05** (real 0,04879). O erro é maior no segundo porque a curvatura do ln perto de 1 é maior em relação ao tamanho do passo.
5. Newton com x₀ = 1,5: **5 iterações** para precisão de 10⁻¹² (x ≈ 1,324717957). Bisseção: cerca de 20 iterações para 10⁻⁶ e 40 para 10⁻¹².
6. f(x) = 1/x − a, f′(x) = −1/x². xₙ₊₁ = xₙ − (1/xₙ − a)/(−1/xₙ²) = xₙ + xₙ − a xₙ² = **xₙ(2 − a xₙ)**. Só multiplicações e subtração: dá para calcular 1/a e então b/a = b × (1/a), sem instrução de divisão.

## Tema 3

1. (a) [x³ − x²]₀² = 8 − 4 = **4**. (b) [ln x]₁ᵉ = 1 − 0 = **1**. (c) [−cos x]₀^π = 1 − (−1) = **2**.
2. Substituição u = x² + 1, du = 2x dx: ∫ x/(x² + 1) dx = **½ ln(x² + 1) + C**. Por partes com u = x, dv = cos x dx: x sen x − ∫ sen x dx = **x sen x + cos x + C**.
3. ∫₀⁴ 3t² dt = [t³]₀⁴ = **64 m**.
4. ```python
   import math
   exato = math.e - 1
   def medio(f, a, b, n):
       h = (b - a) / n
       return h * sum(f(a + (i + .5) * h) for i in range(n))
   def trapezio(f, a, b, n):
       h = (b - a) / n
       return h * (f(a) / 2 + f(b) / 2 + sum(f(a + i * h) for i in range(1, n)))
   for n in [4, 8, 16, 32, 64]:
       print(n, abs(medio(math.exp, 0, 1, n) - exato),
                abs(trapezio(math.exp, 0, 1, n) - exato),
                abs(simpson(math.exp, 0, 1, n) - exato))
   ```
   Em log-log, ponto médio e trapézios têm inclinação **−2** (dobrar n divide o erro por 4) e Simpson **−4** (divide por 16). Curiosidade: o erro do ponto médio é cerca de metade do erro dos trapézios, com sinal oposto. Simpson, com n grande, para de melhorar perto de 10⁻¹⁵ (arredondamento).
5. ∫₀¹⁰⁰⁰ √x dx = (2/3) × 1000^1,5 ≈ **21.081,9**. Valor exato da soma: **21.097,5**. A integral subestima porque cada termo √i é o valor na ponta direita de [i − 1, i], onde a função é maior. Somando a correção ½√1000 ≈ 15,8 (regra dos trapézios ao contrário), chega-se a 21.097,7, muito perto.
6. ```python
   import random
   n = 1_000_000
   s = sum((random.random() + random.random() + random.random())**2 for _ in range(n)) / n
   print(s)     # ≈ 2.50
   ```
   Exato: com X, Y, Z uniformes em [0, 1], E[(X + Y + Z)²] = Var(X + Y + Z) + (E[X + Y + Z])² = 3 × 1/12 + 1,5² = 0,25 + 2,25 = **5/2**. (A integral sobre o cubo unitário é exatamente essa média.)

## Tema 4

1. (a) Geométrica com r = 1/3: 1/(1 − 1/3) = **3/2**. (b) (1/3) Σ (2/3)ⁿ = (1/3) × 1/(1 − 2/3) = **1**. (c) **Diverge**: 1/√n ≥ 1/n e a harmônica diverge (comparação). Em geral, Σ 1/nᵖ converge sse p > 1.
2. Derivadas de ln(1 + x) em 0: f = 0, f′ = 1, f″ = −1, f‴ = 2. Polinômio: **x − x²/2 + x³/3**. ln(1,2) ≈ 0,2 − 0,02 + 0,002667 = **0,182667**; real 0,182322. Erro ≈ 3,4 × 10⁻⁴, do tamanho do próximo termo x⁴/4 = 4 × 10⁻⁴.
3. Os termos são 1/k!. Precisamos que o resto fique abaixo de 10⁻¹⁰: 1/13! ≈ 1,6 × 10⁻¹⁰ e 1/14! ≈ 1,1 × 10⁻¹¹. São necessários **14 termos** (de 1/0! até 1/13!).
4. Numa série alternada com termos decrescentes, o erro é menor que o primeiro termo descartado. Para π = 4 × (série), o erro após n termos é cerca de 4/(2n + 1). Para erro < 5 × 10⁻⁷ (6 casas), **n ≈ 4 milhões** de termos pela cota (na prática, cerca de 2 milhões bastam, porque o erro real é metade da cota). Péssimo porque a convergência é **sublinear**: cada dígito novo custa 10 vezes mais termos. Métodos modernos (Machin, Chudnovsky) ganham vários dígitos por termo.
5. Para x = 10⁸, x² = 10¹⁶, e somar 1 se perde (o espaçamento entre doubles perto de 10¹⁶ é 2): √(x² + 1) vira exatamente x e o resultado é **0.0**. O correto é ≈ 1/(2x) = 5 × 10⁻⁹. Reescreva multiplicando pelo conjugado: **√(x² + 1) − x = 1/(√(x² + 1) + x)**, que não subtrai números próximos e dá 5e-09.
6. Valor de referência (`math.fsum` em float64): **16,695311**. Em float32, do maior para o menor (1 + 1/2 + ...): **trava em 15,403683**. A partir de n ≈ 2 milhões, 1/n fica menor que meio espaçamento entre floats perto de 15,4, e somar não muda mais nada. Do menor para o maior: **16,686031**, bem mais próximo, porque os termos pequenos se acumulam entre si antes de encontrar os grandes.

## Tema 5

1. **∂f/∂x = 3x²y² − 4y + y e^(xy)**; **∂f/∂y = 2x³y − 4x + x e^(xy)**.
2. ∇f = (2x, 6y) = **(2, 6)** em (1, 1). As curvas de nível são elipses x² + 3y² = c, mais achatadas em y. A tangente à elipse em (1, 1) tem direção (3, −1) (derivando 2x dx + 6y dy = 0); (2, 6) · (3, −1) = 0, **perpendicular**. ✓
3. f_x = 2x + y − 3 = 0 e f_y = x + 2y = 0 → **(2, −1)**. f_xx = 2, f_yy = 2, f_xy = 1, D = 4 − 1 = 3 > 0 com f_xx > 0: **mínimo**, f(2, −1) = −3.
4. f_x = 3x² − 3 = 0 → x = ±1; f_y = 2y = 0 → y = 0. Em **(1, 0)**: f_xx = 6, D = 6 × 2 = 12 > 0: **mínimo** (f = −2). Em **(−1, 0)**: f_xx = −6, D = −12 < 0: **ponto de sela**.
5. E(a, b) = Σ (a xᵢ + b − yᵢ)². ∂E/∂a = 2 Σ xᵢ(a xᵢ + b − yᵢ) = 0 e ∂E/∂b = 2 Σ (a xᵢ + b − yᵢ) = 0. Com Σx = 6, Σx² = 14, Σy = 15, Σxy = 0 + 3 + 8 + 21 = 32, n = 4: 14a + 6b = 32 e 6a + 4b = 15. Resolvendo: **a = 1,9 e b = 0,9**. `numpy.polyfit([0, 1, 2, 3], [1, 3, 4, 7], 1)` dá o mesmo.
6. dz/dt = (∂z/∂x)(dx/dt) + (∂z/∂y)(dy/dt) = 2xy(−sen t) + x² cos t = **−2 cos t sen² t + cos³ t**. Direto: z = cos² t sen t, z′ = −2 cos t sen t × sen t + cos² t × cos t. Igual. ✓

## Tema 6

1. ```python
   import math
   p, passos = [0.0, 0.0], 0
   while math.hypot(p[0] - 3, p[1] + 1) >= 1e-6:
       p = [p[0] - 0.1 * 2 * (p[0] - 3), p[1] - 0.1 * 2 * (p[1] + 1)]
       passos += 1
   print(passos)     # 68
   ```
   Cada passo multiplica a distância ao mínimo por (1 − 2 × 0,1) = 0,8. Partindo de distância √10 ≈ 3,16: 3,16 × 0,8ⁿ < 10⁻⁶ dá n ≈ 68.
2. Na direção y o fator é (1 − 20η); em x, (1 − 2η).
   - η = 0,01: y × 0,8, x × 0,98: converge, mas x vai muito devagar.
   - η = 0,05: y × 0 (y chega a zero em **um** passo!), x × 0,9.
   - η = 0,09: y × (−0,8): **zigue-zague** em y que vai amortecendo.
   - η = 0,1: y × (−1): y **oscila para sempre** entre +2 e −2; não converge.
   - η = 0,11: y × (−1,2): **diverge**.
   O limite é η < 2/20 = 0,1, imposto pela direção de maior curvatura. A direção x, de curvatura pequena, fica lenta: é o problema do mau condicionamento.
3. O mínimo está em (1, 1), no fundo de um **vale estreito e curvo** em forma de banana. O gradiente aponta quase sempre para a parede do vale, não ao longo dele: com η grande diverge, com η pequeno leva dezenas de milhares de passos. O momento acumula velocidade ao longo do vale e chega bem mais rápido:
   ```python
   v = [0.0, 0.0]
   for _ in range(n):
       g = grad(p)
       v = [0.9 * v[0] - eta * g[0], 0.9 * v[1] - eta * g[1]]
       p = [p[0] + v[0], p[1] + v[1]]
   ```
4. ```python
   def __sub__(self, o):
       return self + o * Valor(-1.0)
   def __pow__(self, k):            # k número comum
       return Valor(self.dado ** k, (self,), (k * self.dado ** (k - 1),))
   ```
   Para f = x²y + 3y em (1, 2): ∂f/∂x = 2xy = **4**, ∂f/∂y = x² + 3 = **4**. (Represente o 3 como `Valor(3.0)`.)
5. Converge para **w₁ ≈ 1,9 e w₀ ≈ 0,9**, exatamente o resultado de `polyfit` e dos mínimos quadrados do Tema 5, porque a perda quadrática é uma tigela com um único mínimo.

## Projeto da etapa

Pontos de revisão:

- **h ótimo da diferença central:** h ≈ ε^(1/3) × max(1, |x|) ≈ 6 × 10⁻⁶ × max(1, |x|). Escalar com |x| evita perder precisão para x grande.
- **Raiz híbrida (estilo Brent simplificado):** mantenha um intervalo [a, b] com troca de sinal; tente um passo de Newton e, se ele cair fora do intervalo ou não reduzir |f| o suficiente, faça um passo de bisseção. Nunca perde a garantia de convergência.
- **Adam**, para referência:
  ```python
  m = beta1 * m + (1 - beta1) * g
  v = beta2 * v + (1 - beta2) * g * g
  m_hat = m / (1 - beta1 ** t)
  v_hat = v / (1 - beta2 ** t)
  p = p - eta * m_hat / (sqrt(v_hat) + 1e-8)
  ```
  (beta1 = 0,9; beta2 = 0,999; t é o número do passo, começando em 1.)
- **Autograd:** para `tanh`, a derivada local é 1 − tanh²(x); para `exp`, o próprio valor. Teste cada operação comparando com a derivada numérica da própria biblioteca: é o teste padrão (*gradient check*) de quem implementa redes neurais.
- Nos gráficos de trajetória, o gradiente descendente puro deve aparecer em zigue-zague em funções mal condicionadas, e o momento e o Adam com caminhos mais suaves.
