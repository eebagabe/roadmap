# Matemática Essencial: Apostila Prática

Roadmap Ciência da Computação · Semanas 1 a 4

## Comece por aqui

Toda graduação em Computação começa com muita matemática, e quem tropeça nela costuma tropeçar não no cálculo avançado, mas na base: uma potência mal resolvida, um logaritmo que ninguém entendeu de verdade, um somatório que parece hieróglifo. Esta etapa revisa a matemática do ensino médio que a computação usa o tempo todo, já com o olhar de quem vai programar. Nada aqui é "matemática pela matemática": cada tema aparece de novo, mais tarde, em algoritmos, gráficos, criptografia ou aprendizado de máquina.

### Equivalências

| Universidade | Onde isso aparece |
|---|---|
| ITA | Conteúdo cobrado no vestibular e pressuposto no Curso Fundamental |
| MIT | Pré-requisito de 18.01 (Cálculo) e 6.1200 (Matemática para CS) |
| Harvard | Math Ma/Mb (preparação para cálculo) |
| Oxford | Pressuposto pelo curso (exigido no A-level de Matemática) |

### Por que isso importa em computação

- **Logaritmos** medem quantas vezes dá para dividir um problema ao meio: é a base da busca binária e da análise de algoritmos.
- **Potências de 2** estão em toda parte: bits, bytes, endereços de memória, tamanho de tabelas.
- **Somatórios e PA/PG** contam quantas operações um laço faz.
- **Combinatória** responde "quantas senhas existem?" e "quantos casos meu teste precisa cobrir?".
- **Vetores e trigonometria** movem personagens em jogos, giram imagens e são a porta de entrada da álgebra linear.

### Como esta apostila funciona

1. Leia o tema com papel e lápis do lado. Refaça os exemplos sem olhar.
2. Use Python como calculadora e para conferir resultados (instale Python 3 ou use um site como o *Google Colab*).
3. Faça as atividades de fixação no fim de cada tema; o gabarito fica na outra aba.

> **Regra dos 20 minutos:** travou num exercício? Tente por 20 minutos, depois olhe o gabarito, entenda e refaça sozinho no dia seguinte. Matemática se aprende refazendo.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 1 | Tema 1: Números e álgebra |
| 2 | Tema 2: Funções |
| 3 | Tema 3: Somatórios, sequências e contagem |
| 4 | Tema 4: Trigonometria e geometria analítica + projeto |

## Tema 1: Números e álgebra

**Objetivo:** fazer contas com frações, potências e logaritmos sem medo e resolver equações e sistemas simples.

### 1.1 Frações e potências

**Frações:** para somar, iguale os denominadores; para multiplicar, multiplique em cima e embaixo; para dividir, multiplique pelo inverso.

```
1/3 + 1/4 = 4/12 + 3/12 = 7/12
(2/3) × (9/4) = 18/12 = 3/2
(2/3) ÷ (4/5) = (2/3) × (5/4) = 10/12 = 5/6
```

**Potências** são multiplicações repetidas: aⁿ = a × a × ... × a (n vezes). As regras saem direto da definição:

| Regra | Exemplo |
|---|---|
| aᵐ × aⁿ = aᵐ⁺ⁿ | 2³ × 2⁴ = 2⁷ = 128 |
| aᵐ ÷ aⁿ = aᵐ⁻ⁿ | 2¹⁰ ÷ 2³ = 2⁷ |
| (aᵐ)ⁿ = aᵐⁿ | (2³)² = 2⁶ = 64 |
| a⁰ = 1 (a ≠ 0) | 5⁰ = 1 |
| a⁻ⁿ = 1/aⁿ | 2⁻³ = 1/8 |
| a^(1/n) = raiz n-ésima de a | 8^(1/3) = 2 |

**Potências de 2 que todo programador sabe de cor:** 2¹⁰ = 1.024 (≈ mil, "kilo"), 2²⁰ ≈ 1 milhão ("mega"), 2³⁰ ≈ 1 bilhão ("giga"), 2³² ≈ 4,3 bilhões (quantidade de endereços IPv4 e o limite de um inteiro sem sinal de 32 bits).

> **Cuidado! Cai na prova:** (a + b)² **não** é a² + b². O certo é a² + 2ab + b². E 2³ × 3³ = 6³ (mesmo expoente), mas 2³ × 2⁴ não é 4⁷.

### 1.2 Notação científica

Números muito grandes ou muito pequenos são escritos como **m × 10ᵉ**, com 1 ≤ m < 10.

- Velocidade da luz: 300.000.000 m/s = 3 × 10⁸ m/s.
- Tempo de um ciclo de um processador de 3 GHz: 1 / (3 × 10⁹) ≈ 3,3 × 10⁻¹⁰ s.

Em Python, `3e8` significa 3 × 10⁸. É também a ideia por trás do **ponto flutuante**, que você verá em Arquitetura: o computador guarda uma mantissa e um expoente (só que em base 2).

### 1.3 Logaritmos

O logaritmo é a pergunta inversa da potência: **log_b(x) = y significa bʸ = x.** "A que expoente preciso elevar b para obter x?"

- log₂(8) = 3, porque 2³ = 8.
- log₁₀(1000) = 3.
- log₂(1) = 0, porque 2⁰ = 1.

| Propriedade | Exemplo |
|---|---|
| log(x × y) = log x + log y | log₂(32) = log₂(4) + log₂(8) = 2 + 3 |
| log(x / y) = log x − log y | log₂(4) = log₂(16) − log₂(4) |
| log(xⁿ) = n × log x | log₂(2¹⁰⁰) = 100 |
| Mudança de base: log_b(x) = log(x) / log(b) | log₂(1000) = log₁₀(1000) / log₁₀(2) ≈ 3 / 0,301 ≈ 9,97 |

**A intuição que importa para computação:** log₂(n) é, aproximadamente, **quantas vezes você consegue dividir n pela metade até chegar a 1**. Por isso a busca binária numa lista de 1 milhão de nomes precisa de só uns 20 passos (2²⁰ ≈ 1 milhão).

```python
import math
print(math.log2(1_000_000))   # 19.93...
print(math.log(100, 10))       # 2.0
```

> **Cuidado! Cai na entrevista:** "Quantos bits preciso para representar n valores diferentes?" Resposta: ⌈log₂ n⌉ (o logaritmo arredondado para cima). Para 1.000 valores: 10 bits.

### 1.4 Equações e inequações

**Equação do 1º grau:** isole x fazendo a mesma operação dos dois lados.

```
3x + 7 = 22  →  3x = 15  →  x = 5
```

**Equação do 2º grau** ax² + bx + c = 0: use Bhaskara, com Δ = b² − 4ac e x = (−b ± √Δ) / 2a. Se Δ < 0, não há raiz real.

```
x² − 5x + 6 = 0  →  Δ = 25 − 24 = 1  →  x = (5 ± 1)/2  →  x = 3 ou x = 2
```

**Inequações** seguem as mesmas regras, com uma exceção importante: **multiplicar ou dividir por um número negativo inverte o sinal.**

```
−2x + 4 > 10  →  −2x > 6  →  x < −3
```

Em computação, inequações aparecem o tempo todo: "a partir de que tamanho de entrada o algoritmo A fica mais rápido que o B?" é resolver algo como 100n < n².

### 1.5 Sistemas lineares simples

Duas equações, duas incógnitas. Dois métodos:

- **Substituição:** isole uma variável numa equação e substitua na outra.
- **Adição (eliminação):** some múltiplos das equações para eliminar uma variável.

```
x + y = 10
x − y = 4
Somando: 2x = 14 → x = 7 → y = 3
```

O método da eliminação, feito de forma sistemática, vira a **eliminação de Gauss**, que é a primeira semana de Álgebra Linear e o que bibliotecas como o NumPy fazem por dentro.

### Atividades de fixação do Tema 1

1. Calcule sem calculadora: (a) 2/5 + 3/10; (b) (3/4) ÷ (9/8); (c) 2⁵ × 2⁻²; (d) (2⁴)³ ÷ 2¹⁰.
2. Um HD tem 2 TB (considere 1 TB = 2⁴⁰ bytes). Quantos arquivos de 4 MB (2²² bytes) cabem nele? Dê a resposta como potência de 2.
3. Calcule: (a) log₂(64); (b) log₂(1/8); (c) log₁₀(0,001); (d) log₂(2¹⁷ × 2³).
4. Quantos passos, no máximo, a busca binária faz numa lista ordenada de 1 bilhão de elementos? Quantos bits são necessários para numerar 5.000 alunos?
5. Resolva: (a) 5x − 3 = 2x + 9; (b) x² − 7x + 10 = 0; (c) −3x + 2 ≤ 11.
6. O algoritmo A faz 50n operações e o B faz n². Para quais valores de n o B é mais rápido que o A?
7. Resolva o sistema: 2x + 3y = 12 e x − y = 1.

## Tema 2: Funções

**Objetivo:** entender funções como "máquinas" que transformam entradas em saídas, reconhecer os tipos principais e ler gráficos.

### 2.1 Domínio e imagem

Uma **função** f: A → B associa **cada** elemento de A a **exatamente um** elemento de B.

- **Domínio:** o conjunto das entradas permitidas.
- **Contradomínio:** onde as saídas "moram".
- **Imagem:** as saídas que de fato aparecem.

Exemplo: f(x) = √x, nos reais, tem domínio x ≥ 0 e imagem y ≥ 0. Já f(x) = 1/x não aceita x = 0.

É exatamente a ideia de função em programação: `def f(x: float) -> float`. O domínio é o tipo (e as pré-condições) da entrada; a imagem é o que a função de fato devolve.

### 2.2 Função afim e quadrática

**Afim:** f(x) = ax + b. Gráfico é uma reta. **a** é a inclinação (quanto y sobe quando x aumenta 1) e **b** é onde a reta corta o eixo y.

- a > 0: crescente; a < 0: decrescente; a = 0: constante.
- Exemplo: o custo de uma corrida de táxi, R$ 5 de bandeirada mais R$ 2,50 por km: f(x) = 2,5x + 5.

**Quadrática:** f(x) = ax² + bx + c. Gráfico é uma parábola.

- a > 0: concavidade para cima (tem mínimo); a < 0: para baixo (tem máximo).
- Vértice em x_v = −b / 2a. É o ponto de mínimo ou máximo.
- Raízes: pela fórmula de Bhaskara (Tema 1).

O vértice da parábola é o primeiro exemplo de **otimização** que você vai ver: achar o ponto onde uma função é mínima. Em Cálculo, essa ideia vira derivada igual a zero; em Aprendizado de Máquina, vira gradiente descendente.

### 2.3 Exponencial e logarítmica

**Exponencial:** f(x) = aˣ (a > 0, a ≠ 1). Para a > 1, cresce absurdamente rápido.

| x | 2ˣ |
|---|---|
| 10 | 1.024 |
| 20 | ≈ 1 milhão |
| 30 | ≈ 1 bilhão |
| 64 | ≈ 1,8 × 10¹⁹ |

**Logarítmica:** f(x) = log_a(x) é a **inversa** da exponencial. Cresce absurdamente devagar: log₂ de 1 bilhão é só 30.

Comparando crescimentos (você vai ver isso de novo em análise de algoritmos):

**log n < n < n log n < n² < 2ⁿ**

Para n = 1.000: log₂ n ≈ 10; n log₂ n ≈ 10.000; n² = 1.000.000; 2ⁿ tem 302 dígitos.

> **Cuidado! Cai na entrevista:** um algoritmo O(2ⁿ) fica impraticável já com n = 50 ou 60. Um O(log n) responde instantaneamente mesmo para n = 10¹⁸.

### 2.4 Composição e inversa

**Composição:** (g ∘ f)(x) = g(f(x)). Aplique f primeiro, depois g.

Se f(x) = x + 1 e g(x) = 2x, então g(f(3)) = g(4) = 8, mas f(g(3)) = f(6) = 7. **A ordem importa.**

Em programação, compor funções é encadear chamadas: `g(f(x))`. Na etapa de Programação Funcional, composição vira ferramenta do dia a dia.

**Inversa:** f⁻¹ desfaz f: f⁻¹(f(x)) = x. Só existe se f for **bijetora** (cada saída vem de exatamente uma entrada).

- f(x) = 2x + 3 → inversa: y = 2x + 3 → x = (y − 3)/2 → f⁻¹(y) = (y − 3)/2.
- f(x) = x² nos reais não tem inversa (f(2) = f(−2) = 4), a menos que você restrinja o domínio a x ≥ 0.

Em criptografia, a ideia é ter funções fáceis de calcular e **muito difíceis de inverter** sem uma informação secreta.

### 2.5 Gráficos de funções

Plotar funções em Python é a melhor forma de criar intuição:

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(1, 20, 200)
plt.plot(x, np.log2(x), label="log2(x)")
plt.plot(x, x, label="x")
plt.plot(x, x * np.log2(x), label="x log2(x)")
plt.plot(x, x**2, label="x²")
plt.ylim(0, 100)
plt.legend()
plt.show()
```

Transformações de gráfico:

| Mudança | Efeito |
|---|---|
| f(x) + k | Sobe k |
| f(x − k) | Anda k para a direita |
| k × f(x) | Estica verticalmente |
| −f(x) | Espelha no eixo x |

### Atividades de fixação do Tema 2

1. Dê o domínio de: (a) f(x) = 1/(x − 3); (b) g(x) = √(x + 2); (c) h(x) = log₂(x).
2. Uma operadora cobra R$ 30 fixos mais R$ 0,10 por MB acima de 1.000 MB. Escreva a função do custo para x ≥ 1.000.
3. Ache o vértice e as raízes de f(x) = x² − 6x + 8. É ponto de mínimo ou de máximo?
4. Ordene do mais lento para o mais rápido crescimento: n², 2ⁿ, log n, n, n log n, n³. Para n = 32, calcule cada um.
5. Com f(x) = 3x − 1 e g(x) = x², calcule (g ∘ f)(2) e (f ∘ g)(2). Ache f⁻¹.
6. Em Python, plote 2ˣ e x¹⁰ para x de 1 a 60. A partir de que x a exponencial passa a polinomial?

## Tema 3: Somatórios, sequências e contagem

**Objetivo:** ler e calcular somatórios, reconhecer PA e PG e contar possibilidades.

### 3.1 PA e PG

**Progressão aritmética (PA):** soma uma constante r a cada passo. 3, 7, 11, 15, ...

- Termo geral: aₙ = a₁ + (n − 1)r.
- Soma dos n primeiros: Sₙ = n(a₁ + aₙ)/2.

O caso mais famoso: **1 + 2 + 3 + ... + n = n(n + 1)/2.** Conta-se que Gauss, criança, somou de 1 a 100 em segundos: 100 × 101 / 2 = 5.050.

**Progressão geométrica (PG):** multiplica por uma razão q a cada passo. 3, 6, 12, 24, ...

- Termo geral: aₙ = a₁ × qⁿ⁻¹.
- Soma dos n primeiros: Sₙ = a₁(qⁿ − 1)/(q − 1), para q ≠ 1.
- PG infinita com |q| < 1: S = a₁/(1 − q). Ex.: 1 + 1/2 + 1/4 + ... = 2.

Por que isso importa: **1 + 2 + 4 + ... + 2ᵏ = 2ᵏ⁺¹ − 1.** Uma árvore binária completa com k + 1 níveis tem 2ᵏ⁺¹ − 1 nós, e o array dinâmico (que dobra de tamanho quando enche) faz, no total, menos que 2n cópias para inserir n elementos.

### 3.2 Notação de somatório

O símbolo Σ (sigma maiúsculo) é um laço `for` escrito em matemática:

**Σ_{i=1}^{n} i²** = 1² + 2² + ... + n²

```python
n = 10
total = sum(i**2 for i in range(1, n + 1))   # 385
```

Regras úteis:

- Σ (c × aᵢ) = c × Σ aᵢ (constante sai para fora).
- Σ (aᵢ + bᵢ) = Σ aᵢ + Σ bᵢ.
- Σ_{i=1}^{n} 1 = n.

Somas que aparecem em análise de algoritmos:

| Soma | Resultado | Cresce como |
|---|---|---|
| Σ i (i de 1 a n) | n(n + 1)/2 | n² |
| Σ i² | n(n + 1)(2n + 1)/6 | n³ |
| Σ 2ⁱ (i de 0 a k) | 2ᵏ⁺¹ − 1 | 2ᵏ |
| Σ 1/i (i de 1 a n) | ≈ ln n | log n |

Exemplo: quantas vezes a linha marcada roda?

```python
for i in range(n):
    for j in range(i):
        conta += 1     # roda 0 + 1 + 2 + ... + (n − 1) = n(n − 1)/2 vezes
```

### 3.3 Princípio multiplicativo

Se uma escolha tem **a** opções e, para cada uma, outra escolha tem **b** opções, o total é **a × b**.

- Senha de 4 dígitos: 10 × 10 × 10 × 10 = 10⁴ = 10.000.
- Senha de 8 caracteres com letras minúsculas, maiúsculas e dígitos (62 símbolos): 62⁸ ≈ 2,2 × 10¹⁴.
- Número de subconjuntos de um conjunto com n elementos: cada elemento entra ou não entra, então 2ⁿ.

**Princípio aditivo:** se as opções são de casos separados (um **ou** outro, sem sobreposição), some.

### 3.4 Permutações e combinações

**Fatorial:** n! = n × (n − 1) × ... × 1, com 0! = 1. Cresce mais rápido que 2ⁿ: 10! = 3.628.800, 20! ≈ 2,4 × 10¹⁸.

| Quero... | Ordem importa? | Fórmula | Exemplo |
|---|---|---|---|
| Ordenar n objetos | Sim | n! | Filas de 5 pessoas: 120 |
| Escolher k de n, em ordem | Sim | n! / (n − k)! | Pódio (1º, 2º, 3º) entre 10: 720 |
| Escolher k de n, sem ordem | Não | C(n, k) = n! / (k!(n − k)!) | Comissão de 3 entre 10: 120 |

```python
from math import comb, perm, factorial
print(factorial(5), perm(10, 3), comb(10, 3))   # 120 720 120
```

> **Cuidado! Cai na prova:** a pergunta-chave é sempre "a ordem importa?". Mega-Sena: a ordem dos números sorteados não importa, então C(60, 6) = 50.063.860 combinações.

O problema do caixeiro-viajante (visitar n cidades pelo menor caminho) tem (n − 1)!/2 rotas possíveis. Com 20 cidades, isso dá mais de 6 × 10¹⁶: testar todas é inviável. Esse é o tipo de problema que você vai estudar em Teoria da Computação.

### Atividades de fixação do Tema 3

1. Calcule a soma 5 + 8 + 11 + ... + 302.
2. Calcule 1 + 3 + 9 + ... + 3¹⁰. Use Python para conferir.
3. Escreva em notação Σ e calcule: 2 + 4 + 6 + ... + 200.
4. Quantas vezes a linha `x += 1` roda, em função de n?
   ```python
   for i in range(n):
       for j in range(n):
           for k in range(j):
               x += 1
   ```
5. Placas de carro do padrão Mercosul têm 3 letras, 1 dígito, 1 letra e 2 dígitos (LLLNLNN). Quantas placas são possíveis (26 letras)?
6. Num grupo de 8 pessoas, quantos apertos de mão acontecem se cada par se cumprimenta uma vez? Quantas formas de escolher presidente, vice e tesoureiro?
7. Um teste automatizado precisa cobrir todas as combinações de 5 opções do tipo liga/desliga. Quantos casos? E se fossem 30 opções?

## Tema 4: Trigonometria e geometria analítica

**Objetivo:** trabalhar com ângulos, vetores e retas no plano, a base de gráficos e da álgebra linear.

### 4.1 Seno e cosseno

No triângulo retângulo, para um ângulo θ:

- sen θ = cateto oposto / hipotenusa
- cos θ = cateto adjacente / hipotenusa
- tg θ = sen θ / cos θ

| θ | 0° | 30° | 45° | 60° | 90° |
|---|---|---|---|---|---|
| sen | 0 | 1/2 | √2/2 | √3/2 | 1 |
| cos | 1 | √3/2 | √2/2 | 1/2 | 0 |

**Teorema de Pitágoras:** a² = b² + c². E a identidade fundamental: **sen²θ + cos²θ = 1.**

**Radianos:** computadores (e o Python) usam radianos, não graus. 180° = π rad. Para converter: rad = graus × π / 180.

```python
import math
print(math.sin(math.radians(30)))   # 0.4999999999999999 (quase 0,5: erro de ponto flutuante)
```

> **Cuidado! Cai na prova:** `math.sin(30)` calcula o seno de 30 **radianos**, não de 30 graus. Erro clássico em jogos e gráficos.

### 4.2 Círculo trigonométrico

No círculo de raio 1 centrado na origem, o ponto no ângulo θ tem coordenadas **(cos θ, sen θ)**. Isso estende seno e cosseno para qualquer ângulo, inclusive negativos e maiores que 360°.

Aplicação direta: para desenhar um ponto girando em círculo de raio r ao redor de (cx, cy):

```python
x = cx + r * math.cos(t)
y = cy + r * math.sin(t)
```

Seno e cosseno são **periódicos** (repetem a cada 2π). Por isso descrevem tudo o que oscila: som, ondas de rádio, a tensão da tomada. Na etapa de Algoritmos você verá a FFT, que decompõe sinais em senos e cossenos.

### 4.3 Vetores no plano

Um **vetor** tem módulo (tamanho), direção e sentido. No plano, escrevemos v = (vₓ, v_y).

| Operação | Fórmula | Significado |
|---|---|---|
| Soma | (a₁ + b₁, a₂ + b₂) | Andar a, depois andar b |
| Multiplicação por escalar | k(v₁, v₂) = (kv₁, kv₂) | Esticar ou encolher |
| Módulo | ‖v‖ = √(v₁² + v₂²) | Comprimento |
| Produto escalar | a · b = a₁b₁ + a₂b₂ = ‖a‖‖b‖cos θ | Mede o "alinhamento" |

O produto escalar é zero quando os vetores são **perpendiculares**. Ele é a operação mais executada em IA: uma rede neural é, no fundo, uma montanha de produtos escalares.

**Rotação:** girar o vetor (x, y) por um ângulo θ dá (x cos θ − y sen θ, x sen θ + y cos θ). Na etapa de Álgebra Linear isso vira uma **matriz de rotação**.

### 4.4 Distância e retas

**Distância entre dois pontos:** d = √((x₂ − x₁)² + (y₂ − y₁)²). É Pitágoras.

**Equação da reta:** y = mx + b, com inclinação m = (y₂ − y₁)/(x₂ − x₁).

- Retas paralelas têm o mesmo m.
- Retas perpendiculares têm m₁ × m₂ = −1.

**Ponto médio:** ((x₁ + x₂)/2, (y₁ + y₂)/2).

Em jogos, "o inimigo está perto?" é uma conta de distância; "a bala acertou a parede?" é interseção de retas. Em aprendizado de máquina, o k-vizinhos-mais-próximos classifica um ponto olhando os pontos mais próximos pela distância.

### Atividades de fixação do Tema 4

1. Uma escada de 5 m está apoiada num muro, com o pé a 3 m do muro. A que altura ela toca o muro? Qual o ângulo com o chão (use `math.atan2` ou `math.acos`)?
2. Converta 135° para radianos e 5π/6 para graus.
3. Escreva um programa que imprime 12 pontos igualmente espaçados num círculo de raio 10 centrado em (0, 0), como as horas de um relógio.
4. Dados a = (3, 4) e b = (−4, 3): calcule a + b, ‖a‖, a · b. Os vetores são perpendiculares?
5. Gire o ponto (1, 0) em 90° e em 45° usando a fórmula de rotação.
6. Ache a equação da reta que passa por (1, 2) e (3, 8) e a distância entre esses pontos.

## Projeto da etapa

**Caderno de matemática em Python:** crie um repositório (ou um notebook no Colab) com:

1. Funções próprias, sem usar `math` para o resultado final, para: somatório de uma PA, soma de uma PG, fatorial, C(n, k) e log₂ inteiro (quantas vezes dá para dividir por 2). Compare com `math` usando `assert`.
2. Um gráfico comparando log n, n, n log n, n² e 2ⁿ para n de 1 a 30, com escala logarítmica no eixo y (`plt.yscale("log")`).
3. Um "relógio analógico" desenhado com matplotlib: os 12 números e os ponteiros posicionados com seno e cosseno.
4. Um contador de senhas: dado o alfabeto e o tamanho, quantas senhas existem e quanto tempo levaria para testar todas a 1 bilhão de tentativas por segundo.
5. Um README explicando cada parte com as fórmulas usadas.

## Para ir além

- **Khan Academy** (em português): trilhas de Álgebra, Funções e Trigonometria.
- **Portal da Matemática OBMEP**: vídeos e listas do ensino médio, gratuitos.
- **3Blue1Brown** (YouTube): vídeos sobre logaritmos e exponenciais com animações excelentes.
- *Mathematics for Computer Science* (Lehman, Leighton e Meyer, gratuito): o capítulo de somas é a continuação natural do Tema 3.

## Resumão

- Potências: somam expoentes ao multiplicar. 2¹⁰ ≈ mil, 2²⁰ ≈ milhão, 2³⁰ ≈ bilhão.
- log₂ n ≈ quantas vezes dá para dividir n ao meio. Bits para n valores: ⌈log₂ n⌉.
- Inequação: multiplicou por negativo, inverte o sinal.
- Função: cada entrada tem exatamente uma saída. Composição: a ordem importa. Inversa: só para bijeções.
- Crescimento: log n < n < n log n < n² < 2ⁿ < n!.
- 1 + 2 + ... + n = n(n + 1)/2; 1 + 2 + 4 + ... + 2ᵏ = 2ᵏ⁺¹ − 1.
- Σ é um laço `for`. Contagem: multiplicativo para "e", aditivo para "ou"; combinação quando a ordem não importa.
- Python usa radianos. Ponto no círculo: (cos θ, sen θ). Produto escalar zero: perpendiculares.
