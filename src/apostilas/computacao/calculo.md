# Cálculo: Apostila Prática

Roadmap Ciência da Computação · Semanas 33 a 38

## Comece por aqui

Cálculo é a matemática da **mudança** (derivadas) e da **acumulação** (integrais). Em computação, ele aparece em gráficos (curvas e iluminação), simulações físicas de jogos, análise de algoritmos (somas viram integrais), computação numérica e, principalmente, em **aprendizado de máquina**: treinar uma rede neural é usar derivadas para descer uma montanha de erro. Esta etapa é mais curta que uma disciplina de Cálculo de engenharia, porque foca no que a computação usa, mas mantém o rigor nas ideias centrais. Use o computador o tempo todo para **ver** o que as fórmulas dizem.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | MAT-12 e MAT-22 (Cálculo I e II do Curso Fundamental) |
| MIT | 18.01 Single Variable Calculus; 18.02 Multivariable Calculus |
| Harvard | Math 1a/1b; Math 21a |
| Oxford | Continuous Mathematics (parte) |

### Como esta apostila funciona

1. Tenha Python com `numpy` e `matplotlib`. Para conferir contas simbólicas, use `sympy` (`sympy.diff`, `sympy.integrate`, `sympy.limit`).
2. Para cada conceito, faça o gráfico e confira numericamente. A intuição visual é metade do aprendizado.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** não entende uma derivada ou integral? Calcule o valor aproximado no computador (diferença com h pequeno, soma de retângulos) e compare com a sua resposta simbólica. Se não bater, o erro está na conta.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 33 | Tema 1: Limites e derivada |
| 34 | Tema 2: Regras de derivação e aplicações |
| 35 | Tema 3: Integral |
| 36 | Tema 4: Séries e aproximações |
| 37 | Tema 5: Várias variáveis |
| 38 | Tema 6: Gradiente descendente e otimização + projeto |

## Tema 1: Limites e derivada

**Objetivo:** entender limite e continuidade e a derivada como taxa de variação instantânea.

### 1.1 Limites

**lim_{x→a} f(x) = L** significa: f(x) fica tão perto de L quanto quisermos, desde que x esteja suficientemente perto de a (sem precisar ser igual a a).

O caso interessante é quando substituir direto não funciona:

```
lim_{x→2} (x² − 4)/(x − 2)
```

Em x = 2 dá 0/0, indefinido. Mas para x ≠ 2, (x² − 4)/(x − 2) = (x + 2)(x − 2)/(x − 2) = x + 2, que tende a **4**.

```python
f = lambda x: (x**2 - 4) / (x - 2)
for h in [0.1, 0.01, 0.001, 1e-6]:
    print(f(2 + h), f(2 - h))    # aproximam-se de 4 pelos dois lados
```

**Definição formal (ε-δ):** para todo ε > 0 existe δ > 0 tal que, se 0 < |x − a| < δ, então |f(x) − L| < ε. Leia como um jogo: você exige uma precisão ε; eu respondo com uma distância δ que garante essa precisão. É a mesma estrutura de quantificadores ∀∃ da Matemática Discreta.

Limites importantes:

| Limite | Valor |
|---|---|
| lim_{x→0} sen(x)/x | 1 |
| lim_{x→∞} 1/x | 0 |
| lim_{n→∞} (1 + 1/n)ⁿ | e ≈ 2,71828 |
| lim_{x→∞} log(x)/x | 0 (log cresce mais devagar que qualquer potência) |
| lim_{x→∞} xᵏ/2ˣ | 0 (exponencial vence qualquer polinômio) |

Os dois últimos são a justificativa formal da hierarquia de Big O.

### 1.2 Continuidade

f é **contínua** em a quando lim_{x→a} f(x) = f(a): dá para desenhar o gráfico sem tirar o lápis. Polinômios, seno, cosseno, exponencial e logaritmo (no domínio) são contínuos.

**Teorema do valor intermediário:** se f é contínua em [a, b] e f(a) e f(b) têm sinais opostos, então f tem uma raiz entre a e b. É a garantia por trás do **método da bisseção** que você usou na Introdução à Programação: se f(a) < 0 < f(b), corte ao meio e fique com a metade onde o sinal ainda muda.

### 1.3 Derivada como taxa de variação

A **taxa média** de variação de f entre x e x + h é a inclinação da reta secante:

```
(f(x + h) − f(x)) / h
```

A **derivada** é o limite quando h → 0: a taxa **instantânea**, a inclinação da reta tangente.

**f′(x) = lim_{h→0} (f(x + h) − f(x)) / h**

Exemplo, f(x) = x²:

```
(f(x + h) − f(x))/h = ((x + h)² − x²)/h = (2xh + h²)/h = 2x + h  →  2x
```

Então f′(x) = 2x. Em x = 3, a função cresce a uma taxa de 6 (por unidade de x).

Interpretações:

- Posição s(t): s′(t) é a velocidade; a derivada da velocidade é a aceleração.
- Custo C(n) de produzir n peças: C′(n) é o custo marginal.
- f′(x) > 0: f crescendo; f′(x) < 0: decrescendo; f′(x) = 0: ponto "plano" (candidato a máximo ou mínimo).

**Derivada numérica:** no computador, use h pequeno. A **diferença central** é muito mais precisa:

```python
def derivada(f, x, h=1e-5):
    return (f(x + h) - f(x - h)) / (2 * h)

print(derivada(lambda x: x**2, 3))    # 6.000000000039306
```

> **Cuidado! Cai na prática:** h pequeno demais piora o resultado. Com h = 1e-15, f(x + h) − f(x) perde quase todos os dígitos significativos (erro de arredondamento do ponto flutuante). Há um h ótimo, em torno de 1e-5 a 1e-8. Por isso bibliotecas de IA usam **diferenciação automática** (Tema 6), que é exata.

### Atividades de fixação do Tema 1

1. Calcule: (a) lim_{x→3} (x² − 9)/(x − 3); (b) lim_{x→∞} (3x² + 1)/(x² − 5); (c) lim_{x→0} (√(1 + x) − 1)/x.
2. Verifique numericamente em Python que (1 + 1/n)ⁿ se aproxima de e. Para que n o erro fica menor que 10⁻³?
3. Use o teorema do valor intermediário para mostrar que x³ − x − 1 = 0 tem raiz entre 1 e 2. Ache-a por bisseção com 6 casas decimais.
4. Pela definição (limite com h), calcule a derivada de f(x) = x³ e de g(x) = 1/x.
5. Compare a diferença progressiva (f(x + h) − f(x))/h e a central para f(x) = sen(x) em x = 1, com h = 10⁻¹, 10⁻³, 10⁻⁵, 10⁻⁸, 10⁻¹². Faça um gráfico do erro em escala log. O que acontece?

## Tema 2: Regras de derivação e aplicações

**Objetivo:** derivar com rapidez e usar derivadas para otimizar e aproximar.

### 2.1 Regras de derivação

| Função | Derivada |
|---|---|
| c (constante) | 0 |
| xⁿ | n xⁿ⁻¹ (qualquer n real) |
| eˣ | eˣ |
| aˣ | aˣ ln a |
| ln x | 1/x |
| sen x | cos x |
| cos x | −sen x |

| Regra | Fórmula |
|---|---|
| Soma | (f + g)′ = f′ + g′ |
| Constante | (c f)′ = c f′ |
| Produto | (f g)′ = f′ g + f g′ |
| Quociente | (f/g)′ = (f′ g − f g′)/g² |
| **Cadeia** | (f(g(x)))′ = f′(g(x)) × g′(x) |

A **regra da cadeia** é a mais importante para computação: derivada de uma composição é o produto das derivadas "de fora para dentro". Exemplo:

```
h(x) = (3x² + 1)⁵
h′(x) = 5(3x² + 1)⁴ × 6x = 30x(3x² + 1)⁴
```

```
σ(x) = 1/(1 + e⁻ˣ)          (função sigmoide, usada em IA)
σ′(x) = e⁻ˣ/(1 + e⁻ˣ)² = σ(x)(1 − σ(x))
```

Conferindo com o computador:

```python
import sympy as sp
x = sp.symbols("x")
print(sp.diff((3*x**2 + 1)**5, x))
print(sp.simplify(sp.diff(1 / (1 + sp.exp(-x)), x)))
```

### 2.2 Otimização

Num ponto de máximo ou mínimo **interior** (sem ser na borda do domínio) de uma função derivável, **f′(x) = 0**. Receita:

1. Ache os **pontos críticos**: onde f′(x) = 0 (ou f′ não existe).
2. Classifique com a **segunda derivada**: f″(x) > 0 é mínimo local (concavidade para cima), f″(x) < 0 é máximo local.
3. Compare com os valores nas bordas do domínio para achar o máximo/mínimo **global**.

Exemplo: uma caixa sem tampa feita de uma folha 30 × 30 cm, cortando quadrados de lado x nos cantos. Volume V(x) = x(30 − 2x)², com 0 < x < 15.

```
V′(x) = (30 − 2x)² − 4x(30 − 2x) = (30 − 2x)(30 − 6x)
V′(x) = 0  →  x = 15 (borda, volume 0) ou x = 5
V(5) = 5 × 20² = 2.000 cm³ (máximo)
```

Em computação, otimizar é o tempo todo: minimizar o erro de um modelo, o custo de uma rota, a latência de um sistema. Quando a função tem muitas variáveis e não dá para resolver f′ = 0 à mão, entra o gradiente descendente (Tema 6).

### 2.3 Aproximação linear

Perto de a, a função parece com a sua reta tangente:

**f(x) ≈ f(a) + f′(a)(x − a)**

Exemplo: √4,1 ≈ √4 + (1/(2√4)) × 0,1 = 2 + 0,025 = 2,025 (o valor real é 2,02485...).

É a ideia de **linearizar**: trocar um problema difícil por um linear, que sabemos resolver, válido numa vizinhança pequena. Física, controle, otimização e IA usam isso o tempo todo.

**Propagação de erro:** se x tem erro Δx, f(x) tem erro aproximadamente |f′(x)| Δx. Funções com derivada grande amplificam erros (o problema é **mal condicionado**).

### 2.4 Método de Newton

Para resolver f(x) = 0, comece com um palpite x₀ e repita: aproxime f pela tangente e pegue onde a tangente cruza o zero.

**xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ)**

```python
def newton(f, df, x, tol=1e-12, max_iter=50):
    for i in range(max_iter):
        passo = f(x) / df(x)
        x -= passo
        if abs(passo) < tol:
            return x, i + 1
    raise RuntimeError("não convergiu")

print(newton(lambda x: x**2 - 2, lambda x: 2*x, 1.0))   # (1.414213562373095, 6)
```

Para f(x) = x² − a, a fórmula vira xₙ₊₁ = (xₙ + a/xₙ)/2: é o **método de Herão** da Introdução à Programação. Agora você sabe por que ele funciona e por que é tão rápido: perto da raiz, Newton tem **convergência quadrática** (o número de dígitos corretos dobra a cada passo), contra um bit por passo da bisseção.

Cuidados: pode divergir com palpite ruim, falha se f′(xₙ) = 0, e pode oscilar. Na prática, combina-se Newton (rápido) com bisseção (seguro).

### Atividades de fixação do Tema 2

1. Derive: (a) 4x³ − 2x + 7; (b) x² eˣ; (c) ln(x² + 1); (d) sen(3x)/x; (e) e^(sen x).
2. Prove que a derivada da sigmoide é σ(1 − σ). Por que isso é útil computacionalmente?
3. Um retângulo tem perímetro 40. Que dimensões maximizam a área? E se for um cercado encostado num muro (só três lados cercados)?
4. Use aproximação linear para estimar ∛27,3 e ln(1,05). Compare com o valor real.
5. Use Newton para achar a raiz de x³ − x − 1 (a mesma do Tema 1). Quantas iterações contra a bisseção?
6. Mostre que Newton para f(x) = 1/x − a calcula 1/a usando só multiplicações e subtrações. (Processadores já usaram isso para dividir.)

## Tema 3: Integral

**Objetivo:** entender a integral como área e acumulação, calcular primitivas e integrar numericamente.

### 3.1 Integral

A **integral definida** ∫ₐᵇ f(x) dx é a área (com sinal) sob o gráfico de f entre a e b. Definição: divida [a, b] em n retângulos finos e some as áreas (**soma de Riemann**); a integral é o limite quando n → ∞.

```python
def riemann(f, a, b, n):
    h = (b - a) / n
    return sum(f(a + (i + 0.5) * h) for i in range(n)) * h    # ponto médio

print(riemann(lambda x: x**2, 0, 1, 1000))    # 0.33333325
```

Interpretações: área, distância percorrida (integral da velocidade), volume, probabilidade (integral da densidade), trabalho, energia.

### 3.2 Teorema fundamental do cálculo

Derivar e integrar são operações inversas:

1. Se F(x) = ∫ₐˣ f(t) dt, então F′(x) = f(x). (A taxa com que a área acumulada cresce é a altura da função.)
2. Se F′ = f, então **∫ₐᵇ f(x) dx = F(b) − F(a)**.

F é uma **primitiva** (ou antiderivada) de f. Exemplo:

```
∫₀¹ x² dx = [x³/3]₀¹ = 1/3 − 0 = 1/3
```

Primitivas básicas (somar uma constante C):

| f(x) | ∫ f(x) dx |
|---|---|
| xⁿ (n ≠ −1) | xⁿ⁺¹/(n + 1) |
| 1/x | ln \|x\| |
| eˣ | eˣ |
| sen x | −cos x |
| cos x | sen x |

**Conexão com algoritmos:** somas e integrais se aproximam. Σ_{i=1}^{n} i² ≈ ∫₀ⁿ x² dx = n³/3, e Σ 1/i ≈ ∫₁ⁿ dx/x = ln n. Isso explica, por exemplo, por que o quicksort aleatório faz cerca de 2n ln n comparações em média.

### 3.3 Técnicas de integração

**Substituição** (a regra da cadeia ao contrário): se aparece uma função e a sua derivada, troque.

```
∫ 2x e^(x²) dx     u = x², du = 2x dx     = ∫ eᵘ du = eᵘ + C = e^(x²) + C
```

**Por partes** (a regra do produto ao contrário): ∫ u dv = uv − ∫ v du.

```
∫ x eˣ dx     u = x, dv = eˣ dx   →   x eˣ − ∫ eˣ dx = x eˣ − eˣ + C
```

Muitas funções **não** têm primitiva em termos de funções elementares. A mais famosa é e^(−x²), a curva normal da estatística. Para essas, só integração numérica.

### 3.4 Integração numérica

| Regra | Aproxima f por | Erro (com n pedaços) |
|---|---|---|
| Retângulos (ponto médio) | Constantes | ~1/n² |
| Trapézios | Retas | ~1/n² |
| Simpson | Parábolas | ~1/n⁴ |

```python
def simpson(f, a, b, n=100):          # n par
    h = (b - a) / n
    s = f(a) + f(b)
    s += 4 * sum(f(a + i * h) for i in range(1, n, 2))
    s += 2 * sum(f(a + i * h) for i in range(2, n, 2))
    return s * h / 3

import math
print(simpson(lambda x: math.exp(-x**2), 0, 1))     # 0.7468241328941763
```

Em alta dimensão (integrais com dezenas de variáveis), essas regras ficam inviáveis e **Monte Carlo** vence: o erro cai com 1/√n **independentemente da dimensão**. É assim que se renderiza iluminação realista em filmes (*path tracing*).

### Atividades de fixação do Tema 3

1. Calcule: (a) ∫₀² (3x² − 2x) dx; (b) ∫₁ᵉ (1/x) dx; (c) ∫₀^π sen x dx.
2. Calcule por substituição ∫ x/(x² + 1) dx e por partes ∫ x cos x dx.
3. Um carro tem velocidade v(t) = 3t² m/s. Que distância percorre entre t = 0 e t = 4 s?
4. Implemente ponto médio, trapézios e Simpson. Para ∫₀¹ eˣ dx (valor exato e − 1), faça um gráfico do erro de cada método em função de n, em escala log-log. As inclinações batem com a tabela?
5. Estime Σ_{i=1}^{1000} √i com uma integral e compare com o valor exato calculado em Python.
6. Estime ∫₀¹ ∫₀¹ ∫₀¹ (x + y + z)² dx dy dz por Monte Carlo e confira com o valor exato (que é 5/2).

## Tema 4: Séries e aproximações

**Objetivo:** entender quando somas infinitas convergem, aproximar funções por polinômios e entender os limites da computação numérica.

### 4.1 Sequências e séries

Uma **série** é uma soma infinita a₁ + a₂ + a₃ + ... Ela **converge** se as somas parciais Sₙ = a₁ + ... + aₙ tendem a um número.

- **Geométrica:** Σ rⁿ (n de 0 a ∞) = 1/(1 − r) se |r| < 1. Diverge se |r| ≥ 1.
- **Harmônica:** 1 + 1/2 + 1/3 + ... **diverge** (cresce como ln n, devagar mas sem limite), embora os termos tendam a 0.
- Σ 1/n² **converge** (para π²/6, resultado de Euler).

> **Cuidado! Cai na prova:** termos tendendo a zero é **necessário** mas **não suficiente** para convergir. A série harmônica é o contraexemplo clássico.

Teste da razão: se |aₙ₊₁/aₙ| → L < 1, converge; se L > 1, diverge.

### 4.2 Série de Taylor

Uma função suave pode ser aproximada perto de a por um polinômio que tem as mesmas derivadas que ela em a:

**f(x) ≈ f(a) + f′(a)(x − a) + f″(a)(x − a)²/2! + f‴(a)(x − a)³/3! + ...**

A aproximação linear do Tema 2 é o polinômio de Taylor de grau 1. Séries de Taylor em a = 0 (Maclaurin):

| Função | Série | Converge para |
|---|---|---|
| eˣ | 1 + x + x²/2! + x³/3! + ... | todo x |
| sen x | x − x³/3! + x⁵/5! − ... | todo x |
| cos x | 1 − x²/2! + x⁴/4! − ... | todo x |
| 1/(1 − x) | 1 + x + x² + x³ + ... | \|x\| < 1 |
| ln(1 + x) | x − x²/2 + x³/3 − ... | −1 < x ≤ 1 |

```python
from math import factorial, exp
def exp_taylor(x, n):
    return sum(x**k / factorial(k) for k in range(n))

for n in [2, 4, 8, 16]:
    print(n, exp_taylor(1, n), exp(1))
```

Com x pequeno, sen x ≈ x (os físicos e engenheiros usam muito) e cos x ≈ 1 − x²/2.

### 4.3 Erro de aproximação

Ao cortar a série no termo de grau n, o erro (resto de Lagrange) é

**Rₙ(x) = f⁽ⁿ⁺¹⁾(c)(x − a)ⁿ⁺¹/(n + 1)!** para algum c entre a e x.

Na prática: o erro é do tamanho do **primeiro termo descartado**, e cai rápido quando x está perto de a (por causa de (x − a)ⁿ⁺¹) e quando há fatoriais no denominador.

Exemplo: sen(0,1) ≈ 0,1 − 0,1³/6 = 0,0998333. O próximo termo é 0,1⁵/120 ≈ 8 × 10⁻⁸: esse é o tamanho do erro.

**Como o computador calcula sen, cos, exp?** Reduz o argumento a um intervalo pequeno usando identidades (periodicidade, eˣ = 2ᵏ × e^r) e aplica um polinômio aproximador (Taylor ou, melhor, um polinômio de **minimax** que espalha o erro por igual). Não existe "tabela mágica": é cálculo.

### 4.4 Ponto flutuante e computação numérica

Computadores representam reais em **ponto flutuante** (IEEE 754, detalhado em Arquitetura): um `double` tem cerca de **16 dígitos decimais** significativos e o **épsilon de máquina** é ε ≈ 2,2 × 10⁻¹⁶ (o menor número tal que 1 + ε ≠ 1).

Consequências que todo programador numérico precisa conhecer:

- **Erro de arredondamento:** 0,1 + 0,2 ≠ 0,3.
- **Cancelamento catastrófico:** subtrair números quase iguais perde dígitos. (1 − cos x)/x² para x = 10⁻⁸ dá 0 no computador, mas o valor certo é ≈ 0,5. Solução: reescrever como 2 sen²(x/2)/x², ou usar Taylor.
- **Ordem da soma importa:** somar muitos números pequenos a um grande perde os pequenos. Some do menor para o maior, ou use a soma compensada de Kahan (`math.fsum`).
- **Estouro:** eˣ estoura para x > 709. Truques como log-sum-exp (log(Σ eˣⁱ) = m + log(Σ e^(xᵢ − m)), com m o máximo) aparecem o tempo todo em IA.

```python
import math
x = 1e-8
print((1 - math.cos(x)) / x**2)          # 0.0 (errado!)
print(2 * math.sin(x / 2)**2 / x**2)      # 0.5 (certo)
print(sum([0.1] * 10), math.fsum([0.1] * 10))   # 0.9999999999999999 1.0
```

### Atividades de fixação do Tema 4

1. Decida se converge e, se sim, calcule: (a) Σ (1/3)ⁿ, n de 0 a ∞; (b) Σ 2ⁿ/3ⁿ⁺¹, n de 0 a ∞; (c) Σ 1/√n.
2. Ache o polinômio de Taylor de grau 3 de ln(1 + x) em 0 e use-o para estimar ln(1,2). Qual o erro?
3. Quantos termos da série de eˣ em 0 são necessários para calcular e com erro menor que 10⁻¹⁰?
4. A série de Leibniz π/4 = 1 − 1/3 + 1/5 − 1/7 + ... converge. Quantos termos para 6 casas decimais? Por que isso é uma péssima forma de calcular π?
5. Calcule em Python √(x² + 1) − x para x = 10⁸. Explique o resultado e reescreva a expressão para evitar o problema.
6. Some 1 + 1/2 + 1/3 + ... + 1/10⁷ em `float32` (com NumPy) do maior para o menor e do menor para o maior. Compare com `math.fsum` em `float64`.

## Tema 5: Várias variáveis

**Objetivo:** estender derivadas para funções de várias variáveis e achar máximos e mínimos.

### 5.1 Funções de várias variáveis

f(x, y) = x² + y² associa a cada ponto do plano um número. O gráfico é uma superfície (aqui, uma "tigela"). Outra forma de ver: **curvas de nível**, os pontos onde f vale uma constante (como num mapa topográfico).

```python
import numpy as np
import matplotlib.pyplot as plt
x, y = np.meshgrid(np.linspace(-2, 2, 200), np.linspace(-2, 2, 200))
z = x**2 + 3 * y**2
plt.contour(x, y, z, levels=20)
plt.gca().set_aspect("equal")
plt.show()
```

Em aprendizado de máquina, a função de erro tem **milhões** de variáveis (os pesos do modelo). Não dá para desenhar, mas as ideias de duas variáveis se estendem sem mudança.

### 5.2 Derivadas parciais

A **derivada parcial** ∂f/∂x é a derivada em relação a x, tratando as outras variáveis como constantes.

```
f(x, y) = x² y + sen(y)
∂f/∂x = 2xy
∂f/∂y = x² + cos(y)
```

Interpretação: ∂f/∂x é a inclinação da superfície andando na direção do eixo x.

**Regra da cadeia em várias variáveis:** se z = f(x, y) com x = x(t) e y = y(t), então dz/dt = (∂f/∂x)(dx/dt) + (∂f/∂y)(dy/dt). Cada caminho de t até z contribui com o produto das derivadas no caminho, e somam-se os caminhos. Essa é exatamente a regra que a **retropropagação** usa numa rede neural.

### 5.3 Gradiente

O **gradiente** junta todas as parciais num vetor:

**∇f(x, y) = (∂f/∂x, ∂f/∂y)**

Duas propriedades fundamentais:

1. O gradiente aponta na direção de **maior crescimento** de f, e o seu tamanho é a taxa de crescimento nessa direção.
2. O gradiente é **perpendicular** às curvas de nível.

A derivada de f na direção de um vetor unitário u (**derivada direcional**) é ∇f · u. Como ∇f · u = ‖∇f‖ cos θ, ela é máxima quando u aponta na direção do gradiente (θ = 0) e mínima na direção oposta. Por isso, para **descer** o mais rápido possível, vá na direção **−∇f**.

### 5.4 Máximos e mínimos

Em pontos de máximo ou mínimo interiores, **∇f = 0** (todas as parciais zero): são os pontos críticos.

Para classificar em duas variáveis, use a **matriz hessiana** H (matriz das segundas derivadas) e D = f_xx f_yy − (f_xy)²:

- D > 0 e f_xx > 0: mínimo local.
- D > 0 e f_xx < 0: máximo local.
- D < 0: **ponto de sela** (sobe numa direção, desce noutra, como uma sela de cavalo).

Exemplo: f(x, y) = x² − y². ∇f = (2x, −2y) = 0 em (0, 0). D = 2 × (−2) − 0 = −4 < 0: sela.

Em alta dimensão (redes neurais), pontos de sela são muito mais comuns que mínimos locais ruins, um fato que ajudou a explicar por que o treinamento de redes funciona.

**Mínimos quadrados** (o problema de otimização mais importante da ciência): achar a reta y = ax + b que melhor se ajusta a pontos (xᵢ, yᵢ), minimizando E(a, b) = Σ (a xᵢ + b − yᵢ)². Igualando ∂E/∂a = 0 e ∂E/∂b = 0 sai um sistema linear, que você resolverá com matrizes em Álgebra Linear.

### Atividades de fixação do Tema 5

1. Calcule as parciais de f(x, y) = x³y² − 4xy + e^(xy).
2. Calcule ∇f para f(x, y) = x² + 3y² no ponto (1, 1). Desenhe as curvas de nível e o vetor gradiente. Ele é perpendicular à curva de nível?
3. Ache e classifique os pontos críticos de f(x, y) = x² + xy + y² − 3x.
4. Ache e classifique os pontos críticos de f(x, y) = x³ − 3x + y².
5. Para os pontos (0, 1), (1, 3), (2, 4), (3, 7), monte E(a, b) da reta de mínimos quadrados, iguale as parciais a zero e resolva. Confira com `numpy.polyfit`.
6. z = x² y, com x = cos t e y = sen t. Calcule dz/dt pela regra da cadeia e confira derivando direto.

## Tema 6: Gradiente descendente e otimização

**Objetivo:** minimizar funções de muitas variáveis com gradiente descendente, a base do aprendizado de máquina.

### 6.1 Gradiente descendente

Quando não dá para resolver ∇f = 0 à mão, ande morro abaixo:

**x ← x − η ∇f(x)**

η (eta) é a **taxa de aprendizado** (o tamanho do passo).

```python
import numpy as np

def f(p):
    x, y = p
    return x**2 + 10 * y**2

def grad(p):
    x, y = p
    return np.array([2 * x, 20 * y])

p = np.array([5.0, 2.0])
eta = 0.05
for i in range(100):
    p = p - eta * grad(p)
print(p, f(p))    # perto de (0, 0)
```

Analogia: você está numa montanha com neblina e só enxerga o chão em volta. Para descer, dê um passo na direção mais inclinada para baixo, olhe de novo e repita.

### 6.2 Taxa de aprendizado

A escolha de η é crítica:

- **Pequena demais:** converge, mas devagar.
- **Grande demais:** passa do mínimo, oscila e pode **divergir**.

Para f(x) = a x², o passo é x ← x − η 2a x = (1 − 2aη) x. Converge se |1 − 2aη| < 1, ou seja, **η < 1/a**. Na função do exemplo (a = 1 em x e a = 10 em y), η precisa ser menor que 1/10 por causa de y, mas aí x anda devagar: a função é **mal condicionada** (curvaturas muito diferentes), e o caminho faz zigue-zague.

Melhorias usadas na prática:

- **Momento:** acumula uma "velocidade", amortecendo o zigue-zague (como uma bola rolando).
- **Adam:** ajusta o passo de cada variável separadamente, com base no histórico dos gradientes. É o otimizador padrão em deep learning.
- **Gradiente estocástico (SGD):** quando f é uma soma sobre milhões de exemplos, calcule o gradiente num lote pequeno aleatório. Cada passo é barato e ruidoso; o ruído até ajuda a escapar de pontos ruins.

### 6.3 Regra da cadeia

Para treinar modelos, precisamos do gradiente de funções **compostas** com milhões de parâmetros. Calcular cada parcial separadamente seria caro demais. A solução é organizar a regra da cadeia de forma eficiente: **diferenciação automática** no modo reverso (**retropropagação**).

Ideia com uma conta pequena, f(x, y) = (x + y) × y:

```
a = x + y            ∂a/∂x = 1, ∂a/∂y = 1
f = a × y            ∂f/∂a = y, ∂f/∂y (direto) = a

Para trás:
∂f/∂a = y
∂f/∂x = ∂f/∂a × ∂a/∂x = y
∂f/∂y = ∂f/∂a × ∂a/∂y + a = y + (x + y) = x + 2y
```

Cada operação conhece a sua derivada local; percorrendo o grafo de trás para a frente e multiplicando, obtém-se o gradiente inteiro com custo parecido ao de calcular f uma vez. PyTorch, TensorFlow e JAX fazem exatamente isso.

Uma versão mínima em Python (inspirada no *micrograd* de Andrej Karpathy):

```python
class Valor:
    def __init__(self, dado, filhos=(), derivadas_locais=()):
        self.dado, self.grad = dado, 0.0
        self.filhos, self.derivadas_locais = filhos, derivadas_locais

    def __add__(self, o):
        return Valor(self.dado + o.dado, (self, o), (1.0, 1.0))

    def __mul__(self, o):
        return Valor(self.dado * o.dado, (self, o), (o.dado, self.dado))

    def retropropaga(self):
        ordem, vistos = [], set()
        def topo(v):
            if v not in vistos:
                vistos.add(v)
                for f in v.filhos: topo(f)
                ordem.append(v)
        topo(self)
        self.grad = 1.0
        for v in reversed(ordem):
            for filho, d in zip(v.filhos, v.derivadas_locais):
                filho.grad += v.grad * d

x, y = Valor(2.0), Valor(3.0)
f = (x + y) * y
f.retropropaga()
print(f.dado, x.grad, y.grad)   # 15.0 3.0 8.0  (y = 3; x + 2y = 8)
```

### 6.4 Ponte para aprendizado de máquina

Juntando tudo, **treinar um modelo** é:

1. Escolher um modelo com parâmetros w (por exemplo, uma reta ŷ = w₁x + w₀, ou uma rede neural).
2. Definir uma **função de perda** L(w) que mede o erro nos dados (por exemplo, o erro quadrático médio).
3. Calcular ∇L(w) por retropropagação.
4. Atualizar w ← w − η ∇L(w) e repetir.

```python
xs = np.array([0, 1, 2, 3], dtype=float)
ys = np.array([1, 3, 4, 7], dtype=float)
w1, w0, eta = 0.0, 0.0, 0.05
for _ in range(2000):
    pred = w1 * xs + w0
    erro = pred - ys
    g1 = 2 * np.mean(erro * xs)      # ∂L/∂w1
    g0 = 2 * np.mean(erro)           # ∂L/∂w0
    w1, w0 = w1 - eta * g1, w0 - eta * g0
print(w1, w0)    # ≈ 1.9 e 0.9 (o mesmo que mínimos quadrados)
```

Você reencontrará isso, com álgebra linear e probabilidade, na etapa de Aprendizado de Máquina.

### Atividades de fixação do Tema 6

1. Minimize f(x, y) = (x − 3)² + (y + 1)² por gradiente descendente começando em (0, 0) com η = 0,1. Quantos passos até ficar a menos de 10⁻⁶ do mínimo?
2. Na função x² + 10y², teste η = 0,01, 0,05, 0,09, 0,1 e 0,11. Plote a trajetória sobre as curvas de nível. O que acontece em cada caso?
3. Minimize a função de Rosenbrock f(x, y) = (1 − x)² + 100(y − x²)², começando em (−1,5, 2). Por que é tão difícil? Implemente momento e compare.
4. Use a classe `Valor` (adicione subtração e potência) para calcular o gradiente de f(x, y) = x²y + 3y em (1, 2) e confira com as derivadas à mão.
5. Ajuste a reta do exemplo por gradiente descendente e compare com `numpy.polyfit(xs, ys, 1)`.

## Projeto da etapa

**Biblioteca de cálculo numérico:**

1. `derivada(f, x)` com diferença central e escolha automática de h; `gradiente(f, p)` para funções de várias variáveis.
2. `integral(f, a, b, metodo)` com ponto médio, trapézios e Simpson; `integral_monte_carlo(f, limites, n)` para várias dimensões.
3. `raiz(f, a, b)` combinando bisseção (segura) e Newton (rápida).
4. `minimiza(f, p0, metodo)` com gradiente descendente simples, com momento e com Adam.
5. Um mini *autograd* (a classe `Valor` com +, −, ×, ÷, potência, exp, tanh) e uma demonstração treinando uma regressão linear.
6. Testes comparando com `scipy` (`scipy.integrate.quad`, `scipy.optimize`) e gráficos: erro × n para as integrais e trajetórias dos otimizadores sobre curvas de nível.

## Para ir além

- **MIT 18.01SC e 18.02SC** no OpenCourseWare: versões para estudo independente, com vídeos, exercícios e soluções.
- **3Blue1Brown, Essência do Cálculo** (YouTube, com legendas em português): a melhor intuição visual que existe.
- *Calculus* (Gilbert Strang, gratuito no MIT OCW).
- **Khan Academy**: Cálculo 1, 2 e multivariável em português.
- Andrej Karpathy, *micrograd* e o vídeo "The spelled-out intro to neural networks and backpropagation".

## Resumão

- Limite: para onde f(x) vai quando x se aproxima de a. Contínua: limite igual ao valor.
- Derivada: taxa instantânea, inclinação da tangente. Numérica: diferença central, h nem grande nem pequeno demais.
- Regra da cadeia: derivada da composição é o produto das derivadas. É a base da retropropagação.
- Máximo/mínimo interior: f′ = 0; classifique com f″.
- Newton: xₙ₊₁ = xₙ − f/f′, convergência quadrática.
- Integral: área e acumulação. Teorema fundamental: ∫ₐᵇ f = F(b) − F(a). Simpson erra ~1/n⁴; Monte Carlo ~1/√n em qualquer dimensão.
- Taylor: polinômio com as mesmas derivadas; erro do tamanho do primeiro termo descartado.
- Ponto flutuante: ~16 dígitos; cuidado com cancelamento, ordem de soma e estouro.
- Gradiente: vetor das parciais, aponta para a subida mais íngreme. Mínimo: ∇f = 0; sela quando D < 0.
- Gradiente descendente: x ← x − η∇f. η grande diverge, pequeno demora. Treinar modelo = descer a perda.
