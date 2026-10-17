# Matemática Discreta e Lógica: Apostila Prática

Roadmap Ciência da Computação · Semanas 25 a 32

## Comece por aqui

Cálculo estuda o contínuo: curvas, velocidades, áreas. Computadores, porém, são **discretos**: bits, passos, estados, nós de um grafo. A matemática discreta é a matemática da computação, e é onde você aprende a habilidade mais importante desta trilha inteira: **escrever provas**. Saber provar é saber, com certeza, que um algoritmo está correto, que um protocolo é seguro, que um problema não tem solução eficiente. No MIT, a disciplina 6.1200 é pré-requisito de quase tudo; no ITA, CMC-14 abre o curso profissional.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CMC-14 Lógica Matemática e Estruturas Discretas |
| MIT | 6.1200 (antiga 6.042J) Mathematics for Computer Science |
| Harvard | CS 20 Discrete Mathematics for Computer Science |
| Oxford | Discrete Mathematics; Introduction to Proof Systems |

### Como esta apostila funciona

1. Esta etapa é de **papel e lápis**. Escreva cada prova por completo, em frases, não só em símbolos.
2. Use Python para **experimentar** antes de provar (testar uma conjectura para n de 1 a 1.000 não é prova, mas mostra se vale a pena tentar).
3. Atividades no fim de cada tema; gabarito na outra aba. Compare a **estrutura** da sua prova com a do gabarito, não só a conclusão.

> **Regra dos 20 minutos:** travou numa prova? Escreva com clareza o que você **sabe** (hipóteses e definições) e o que você **quer** (a conclusão). Teste exemplos pequenos. Muitas vezes a prova sai de escrever as definições por extenso.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 25 | Tema 1: Lógica proposicional |
| 26 | Tema 2: Predicados e técnicas de prova |
| 27 | Tema 3: Indução e invariantes |
| 28 | Tema 4: Conjuntos, relações e funções |
| 29 | Tema 5: Teoria dos números |
| 30 | Tema 6: Grafos |
| 31 | Tema 7: Contagem e recorrências |
| 32 | Tema 8: Sistemas de prova + projeto |

## Tema 1: Lógica proposicional

**Objetivo:** representar afirmações com símbolos e decidir quando são verdadeiras.

### 1.1 Conectivos

Uma **proposição** é uma afirmação que é verdadeira (V) ou falsa (F). "2 é primo" é proposição; "feche a porta" não é.

| Conectivo | Símbolo | Lê-se | Em Python |
|---|---|---|---|
| Negação | ¬P | não P | `not P` |
| Conjunção | P ∧ Q | P e Q | `P and Q` |
| Disjunção | P ∨ Q | P ou Q (inclusivo) | `P or Q` |
| Ou exclusivo | P ⊕ Q | ou P ou Q, não ambos | `P != Q` |
| Implicação | P → Q | se P, então Q | `(not P) or Q` |
| Bicondicional | P ↔ Q | P se e somente se Q | `P == Q` |

### 1.2 Tabelas-verdade

| P | Q | ¬P | P ∧ Q | P ∨ Q | P → Q | P ↔ Q |
|---|---|---|---|---|---|---|
| V | V | F | V | V | V | V |
| V | F | F | F | V | F | F |
| F | V | V | F | V | V | F |
| F | F | V | F | F | V | V |

A implicação é a que mais confunde. **P → Q só é falsa quando P é verdadeira e Q é falsa.** Pense numa promessa: "se chover, levo o guarda-chuva". Se não chover, a promessa não foi quebrada, leve ou não o guarda-chuva.

> **Cuidado! Cai na prova:** P → Q **não** é o mesmo que Q → P (a **recíproca**). "Se é cachorro, é mamífero" é verdade; "se é mamífero, é cachorro" não. Mas P → Q **é** equivalente a ¬Q → ¬P (a **contrapositiva**): "se não é mamífero, não é cachorro".

Com n variáveis, a tabela tem 2ⁿ linhas. Classificação:

- **Tautologia:** verdadeira em todas as linhas (ex.: P ∨ ¬P).
- **Contradição:** falsa em todas (ex.: P ∧ ¬P).
- **Satisfatível:** verdadeira em pelo menos uma.

### 1.3 Equivalências lógicas

Duas fórmulas são **equivalentes** (≡) quando têm a mesma tabela-verdade.

| Lei | Equivalência |
|---|---|
| Dupla negação | ¬¬P ≡ P |
| De Morgan | ¬(P ∧ Q) ≡ ¬P ∨ ¬Q; ¬(P ∨ Q) ≡ ¬P ∧ ¬Q |
| Distributiva | P ∧ (Q ∨ R) ≡ (P ∧ Q) ∨ (P ∧ R); P ∨ (Q ∧ R) ≡ (P ∨ Q) ∧ (P ∨ R) |
| Implicação | P → Q ≡ ¬P ∨ Q |
| Contrapositiva | P → Q ≡ ¬Q → ¬P |
| Bicondicional | P ↔ Q ≡ (P → Q) ∧ (Q → P) |
| Absorção | P ∨ (P ∧ Q) ≡ P |

De Morgan é usada todo dia em programação: `not (a and b)` é `(not a) or (not b)`. Simplificar condições de `if` é aplicar essas leis.

### 1.4 Formas normais

Toda fórmula pode ser reescrita em formatos padronizados:

- **FND (forma normal disjuntiva):** um "ou" de "e"s. (P ∧ ¬Q) ∨ (¬P ∧ Q). Leia direto da tabela-verdade: um termo para cada linha verdadeira.
- **FNC (forma normal conjuntiva):** um "e" de "ou"s (chamados **cláusulas**). (P ∨ Q) ∧ (¬P ∨ ¬Q).

A FNC é o formato de entrada dos **resolvedores SAT**, programas que decidem se uma fórmula é satisfatível. SAT é o primeiro problema provado NP-completo (você verá em Teoria da Computação), e mesmo assim resolvedores modernos lidam com milhões de variáveis e são usados para verificar hardware, planejar e resolver quebra-cabeças.

```python
from itertools import product

def tabela(f, n):
    for valores in product([True, False], repeat=n):
        print(valores, f(*valores))

tabela(lambda p, q: (not (p and q)) == ((not p) or (not q)), 2)   # sempre True: De Morgan
```

### Atividades de fixação do Tema 1

1. Monte a tabela-verdade de (P → Q) ∧ (Q → R) → (P → R). É tautologia?
2. Escreva a negação de "se o aluno estudou e dormiu bem, então passou", sem usar "não é verdade que".
3. Prove, usando as leis (sem tabela), que ¬(P ∨ (¬P ∧ Q)) ≡ ¬P ∧ ¬Q.
4. Dê a recíproca e a contrapositiva de "se n é divisível por 4, então n é par". Quais são verdadeiras?
5. Escreva a FND e a FNC do ou exclusivo P ⊕ Q.
6. Simplifique a condição: `if not (x < 0 or x > 10) and not (x == 5):`.

## Tema 2: Predicados e técnicas de prova

**Objetivo:** usar quantificadores e dominar as técnicas básicas de prova.

### 2.1 Quantificadores

Um **predicado** é uma afirmação com variáveis: P(x) = "x é par". Vira proposição quando você dá valor a x ou **quantifica**:

- **∀x P(x)**: "para todo x, P(x)". Em Python: `all(P(x) for x in dominio)`.
- **∃x P(x)**: "existe x tal que P(x)". Em Python: `any(P(x) for x in dominio)`.

Negação troca o quantificador:

- ¬∀x P(x) ≡ ∃x ¬P(x). ("Nem todo aluno passou" = "algum aluno não passou".)
- ¬∃x P(x) ≡ ∀x ¬P(x).

**A ordem dos quantificadores importa:**

- ∀x ∃y (y > x): "para todo número existe um maior". Verdade nos inteiros.
- ∃y ∀x (y > x): "existe um número maior que todos". Falso.

Para **provar** ∀x P(x), mostre P(x) para um x **arbitrário**. Para **refutar**, basta **um contraexemplo**. Para provar ∃x P(x), basta **exibir** um x.

### 2.2 Prova direta

Para provar P → Q: suponha P e deduza Q.

**Teorema:** se n é ímpar, então n² é ímpar.

*Prova.* Suponha n ímpar. Então n = 2k + 1 para algum inteiro k. Logo n² = 4k² + 4k + 1 = 2(2k² + 2k) + 1, que é da forma 2m + 1 com m = 2k² + 2k inteiro. Portanto n² é ímpar. ∎

Repare na estrutura: **usar a definição** (ímpar é 2k + 1), manipular, **chegar na definição** do que se quer.

### 2.3 Contrapositiva

Às vezes é mais fácil provar ¬Q → ¬P, que é equivalente a P → Q.

**Teorema:** se n² é par, então n é par.

*Prova (pela contrapositiva).* Vamos provar: se n é ímpar, então n² é ímpar. Isso foi provado acima. ∎

Prova direta aqui seria difícil: "n² = 2k" não dá informação fácil sobre n.

### 2.4 Prova por contradição

Para provar P, suponha ¬P e chegue a um absurdo.

**Teorema:** √2 é irracional.

*Prova.* Suponha, por contradição, que √2 = a/b, com a e b inteiros sem fatores em comum (fração simplificada). Então 2 = a²/b², ou seja, a² = 2b². Logo a² é par, e pelo teorema anterior a é par: a = 2c. Substituindo: 4c² = 2b², ou b² = 2c². Então b² é par, e b é par. Mas a e b serem ambos pares contradiz a fração estar simplificada. Logo √2 não é racional. ∎

**Teorema (Euclides):** existem infinitos primos.

*Prova.* Suponha que haja finitos: p₁, p₂, ..., pₙ. Seja N = p₁ × p₂ × ... × pₙ + 1. N é maior que 1, então tem algum fator primo p. Esse p é algum dos pᵢ, que divide o produto p₁ × ... × pₙ. Se p divide N e divide o produto, divide a diferença, que é 1. Absurdo. ∎

### 2.5 Prova por casos

Divida em casos que cobrem todas as possibilidades e prove cada um.

**Teorema:** para todo inteiro n, n² + n é par.

*Prova.* Caso 1, n par (n = 2k): n² + n = 4k² + 2k = 2(2k² + k), par. Caso 2, n ímpar (n = 2k + 1): n² + n = n(n + 1) = (2k + 1)(2k + 2) = 2(2k + 1)(k + 1), par. Como todo inteiro é par ou ímpar, vale sempre. ∎

Outras ferramentas: para provar P ↔ Q, prove P → Q **e** Q → P. Para provar que algo é **único**, suponha dois e mostre que são iguais.

> **Cuidado! Cai na prova:** exemplos **não** provam afirmações universais. n² − n + 41 é primo para n = 0, 1, ..., 40, e falha em n = 41 (dá 41²). Um só contraexemplo derruba um "para todo".

### Atividades de fixação do Tema 2

1. Escreva com quantificadores e depois negue: "todo programa que compila tem um teste que falha".
2. Os enunciados ∀x ∃y (x + y = 0) e ∃y ∀x (x + y = 0) são verdadeiros nos inteiros?
3. Prove diretamente: a soma de dois números racionais é racional.
4. Prove pela contrapositiva: se a × b é par, então a é par ou b é par.
5. Prove por contradição: não existe um maior número par.
6. Prove por casos: |x × y| = |x| × |y| para reais x e y.
7. Refute com um contraexemplo: "se n é primo, então 2ⁿ − 1 é primo".

## Tema 3: Indução e invariantes

**Objetivo:** provar afirmações sobre todos os naturais e sobre programas que repetem passos.

### 3.1 Indução

Para provar P(n) para todo natural n ≥ 0:

1. **Base:** prove P(0).
2. **Passo indutivo:** para um n arbitrário, **suponha** P(n) (a hipótese de indução, HI) e prove P(n + 1).

Pense em dominós: o primeiro cai; se um cai, o próximo cai; então todos caem.

**Teorema:** para todo n ≥ 0, 0 + 1 + 2 + ... + n = n(n + 1)/2.

*Prova.* Base: n = 0: a soma é 0 e 0 × 1/2 = 0. ✓. Passo: suponha 0 + ... + n = n(n + 1)/2. Então 0 + ... + n + (n + 1) = n(n + 1)/2 + (n + 1) = (n + 1)(n/2 + 1) = (n + 1)(n + 2)/2, que é a fórmula para n + 1. ∎

**Teorema:** para todo n ≥ 1, 3 divide n³ − n.

*Prova.* Base: 1³ − 1 = 0, divisível por 3. Passo: (n + 1)³ − (n + 1) = n³ + 3n² + 3n + 1 − n − 1 = (n³ − n) + 3(n² + n). Pela HI, 3 divide n³ − n; e 3 divide 3(n² + n). Logo divide a soma. ∎

> **Cuidado! Cai na prova:** escreva explicitamente **onde** usa a hipótese de indução. Uma "prova por indução" que nunca usa a HI provavelmente está errada (ou não precisava de indução).

### 3.2 Indução forte

Na indução forte, no passo você supõe P(0), P(1), ..., P(n) **todos** e prova P(n + 1). Útil quando n + 1 depende de casos bem menores que n.

**Teorema:** todo inteiro n ≥ 2 é produto de primos.

*Prova.* Suponha que todo k com 2 ≤ k ≤ n é produto de primos. Considere n + 1. Se for primo, é produto de um primo só. Se não, n + 1 = a × b com 2 ≤ a, b ≤ n. Pela HI forte, a e b são produtos de primos, então a × b também. ∎

Indução comum não serviria: saber sobre n não ajuda com n + 1 = a × b.

### 3.3 Boa ordenação

**Princípio da boa ordenação:** todo conjunto não vazio de naturais tem um **menor** elemento. Parece óbvio, e é equivalente à indução. Uso típico: suponha que exista um contraexemplo; pegue o **menor**; mostre que existe um ainda menor. Contradição.

Exemplo: todo algoritmo cujo "contador" é um natural que diminui estritamente a cada passo **termina**, porque não existe sequência infinita estritamente decrescente de naturais. É o argumento da **função de variante** da etapa anterior.

### 3.4 Invariantes de estado

Muitos sistemas são **máquinas de estado**: um estado inicial e transições. Um **invariante** é uma propriedade que vale no estado inicial e é preservada por toda transição; por indução no número de passos, vale em **todo** estado alcançável.

**Exemplo clássico (o robô diagonal):** um robô começa em (0, 0) numa grade e cada passo move uma unidade na diagonal: (x ± 1, y ± 1). Ele consegue chegar em (1, 0)?

*Invariante:* x + y é sempre par. Vale no início (0 + 0 = 0). Cada passo muda x + y por −2, 0 ou +2, mantendo a paridade. Como 1 + 0 é ímpar, (1, 0) é **inalcançável**. ∎

É assim que se prova que um programa nunca chega num estado ruim (saldo negativo, dois trens no mesmo trilho, deadlock): mostre um invariante que exclui o estado ruim. Você usou essa ideia com invariantes de laço e com o invariante de representação.

### Atividades de fixação do Tema 3

1. Prove por indução: 1 + 3 + 5 + ... + (2n − 1) = n², para n ≥ 1.
2. Prove por indução: 2ⁿ > n² para todo n ≥ 5.
3. Prove por indução: 1 + 2 + 4 + ... + 2ⁿ = 2ⁿ⁺¹ − 1.
4. Prove por indução forte: todo valor de postagem de 12 centavos ou mais pode ser pago só com selos de 4 e 5 centavos.
5. Ache o erro na "prova" de que todos os cavalos têm a mesma cor: "Base: um cavalo tem a mesma cor que ele mesmo. Passo: num grupo de n + 1 cavalos, tire o primeiro: os n restantes têm a mesma cor (HI). Tire o último: os n restantes têm a mesma cor. Como os grupos se sobrepõem, todos têm a mesma cor."
6. Num tabuleiro 8 × 8, remova dois cantos opostos. Dá para cobrir o resto com dominós 2 × 1? Prove com um invariante.
7. Um pote tem 30 balas vermelhas e 20 azuis. A cada passo, tire duas: se forem da mesma cor, ponha uma vermelha de volta; se forem diferentes, ponha uma azul. Qual a cor da última bala? Prove.

## Tema 4: Conjuntos, relações e funções

**Objetivo:** dominar a linguagem de conjuntos, relações e funções, e comparar tamanhos de conjuntos infinitos.

### 4.1 Conjuntos

Um **conjunto** é uma coleção sem ordem e sem repetição.

| Notação | Significado | Python |
|---|---|---|
| x ∈ A | x pertence a A | `x in A` |
| A ⊆ B | A está contido em B | `A <= B` |
| A ∪ B | união | `A \| B` |
| A ∩ B | interseção | `A & B` |
| A − B | diferença | `A - B` |
| Aᶜ | complemento (em relação a um universo) | `U - A` |
| ∅ | vazio | `set()` |
| 𝒫(A) | conjunto das partes (todos os subconjuntos) | |
| A × B | produto cartesiano (pares) | `itertools.product` |

Se |A| = n, então |𝒫(A)| = 2ⁿ e |A × B| = |A| × |B|.

Para provar A = B, prove A ⊆ B e B ⊆ A (pegue x arbitrário em um e mostre que está no outro). As leis de De Morgan valem também: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ.

### 4.2 Relações

Uma **relação** R de A em B é um subconjunto de A × B. Escrevemos a R b quando (a, b) ∈ R. Exemplos: "é menor que", "é amigo de", "é pré-requisito de". Bancos de dados relacionais têm esse nome por isso: uma tabela é uma relação.

Propriedades de uma relação em A:

| Propriedade | Definição | Exemplo |
|---|---|---|
| Reflexiva | a R a para todo a | ≤ |
| Simétrica | a R b → b R a | "é irmão de" |
| Antissimétrica | a R b e b R a → a = b | ≤ |
| Transitiva | a R b e b R c → a R c | <, ≤, "é ancestral de" |

### 4.3 Equivalência e ordens parciais

**Relação de equivalência:** reflexiva, simétrica e transitiva. Divide o conjunto em **classes de equivalência** disjuntas (uma partição).

Exemplo: a ≡ b (mod 3) quando 3 divide a − b. Classes: {..., −3, 0, 3, 6, ...}, {..., −2, 1, 4, ...}, {..., −1, 2, 5, ...}. É a ideia por trás da aritmética modular (Tema 5) e das tabelas hash (cada balde é uma classe).

**Ordem parcial:** reflexiva, antissimétrica e transitiva. "Parcial" porque alguns pares podem não ser comparáveis.

Exemplos: ⊆ entre conjuntos ({1} e {2} não são comparáveis); "divide" nos naturais; "é pré-requisito de" entre disciplinas. Desenhar a ordem parcial dá um **grafo acíclico dirigido**, e ordenar as tarefas respeitando os pré-requisitos é a **ordenação topológica** (Estruturas de Dados).

### 4.4 Funções

Uma **função** f: A → B é uma relação em que cada a ∈ A tem **exatamente um** b. Propriedades:

| Propriedade | Definição | Intuição |
|---|---|---|
| Injetora | f(a₁) = f(a₂) → a₁ = a₂ | Não repete saída |
| Sobrejetora | todo b ∈ B é f(a) para algum a | Atinge todo o contradomínio |
| Bijetora | injetora e sobrejetora | Pareamento perfeito; tem inversa |

Para conjuntos finitos: se existe injeção A → B, então |A| ≤ |B|; se existe bijeção, |A| = |B|. Contar por bijeção é uma técnica poderosa (Tema 7).

Uma **função hash** de strings para 2³² valores **não pode** ser injetora: há mais strings que valores. Colisões são inevitáveis (princípio da casa dos pombos, Tema 7).

### 4.5 Cardinalidade

Para conjuntos infinitos, "mesmo tamanho" é definido por bijeção. Resultados surpreendentes:

- ℕ e os pares têm o mesmo tamanho: n ↦ 2n é bijeção.
- ℕ e ℤ também: 0, 1, −1, 2, −2, 3, ...
- ℕ e ℚ também (dá para listar todas as frações, percorrendo uma tabela em diagonais).

Esses conjuntos são **contáveis** (enumeráveis): dá para listar em sequência.

**Teorema (Cantor):** o conjunto das sequências infinitas de bits **não** é contável.

*Prova (diagonalização).* Suponha uma lista s₀, s₁, s₂, ... de todas as sequências. Construa d trocando o bit i de sᵢ: d(i) = 1 − sᵢ(i). Então d difere de cada sᵢ na posição i, logo não está na lista. Contradição. ∎

Consequência para a computação: programas são textos finitos, logo **contáveis**. Já as funções de ℕ em {0, 1} (problemas de decisão) são **incontáveis**. Portanto, **existem problemas que nenhum programa resolve**. Em Teoria da Computação você verá um exemplo concreto (o problema da parada), provado com a mesma diagonalização.

### Atividades de fixação do Tema 4

1. Prove que A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C).
2. Para A = {1, 2, 3}, liste 𝒫(A). Quantos elementos tem 𝒫(𝒫(A))?
3. Classifique (reflexiva, simétrica, antissimétrica, transitiva): (a) "a divide b" nos naturais positivos; (b) "|a − b| ≤ 1" nos inteiros; (c) "a e b têm o mesmo resto na divisão por 5".
4. Prove que a relação do item 3(c) é de equivalência e descreva as classes.
5. Classifique (injetora, sobrejetora, bijetora): (a) f: ℤ → ℤ, f(n) = 2n; (b) f: ℤ → ℤ, f(n) = n + 7; (c) f: ℝ → ℝ, f(x) = x²; (d) f: ℝ → [0, ∞), f(x) = x².
6. Prove que a composição de duas funções injetoras é injetora.
7. Mostre uma bijeção entre ℕ e ℤ e escreva-a como fórmula.

## Tema 5: Teoria dos números

**Objetivo:** dominar divisibilidade e aritmética modular até entender como o RSA funciona.

### 5.1 Divisibilidade e MDC

a **divide** b (a | b) quando b = a × k para algum inteiro k.

**Divisão com resto:** para inteiros a e b > 0, existem únicos q e r com a = b × q + r e 0 ≤ r < b. Em Python: `q, r = divmod(a, b)`.

**MDC** (máximo divisor comum). O **algoritmo de Euclides** usa que mdc(a, b) = mdc(b, a mod b):

```
mdc(252, 105) = mdc(105, 42) = mdc(42, 21) = mdc(21, 0) = 21
```

É um dos algoritmos mais antigos que existem (cerca de 300 a.C.) e é rápido: o número de passos é O(log min(a, b)).

**Identidade de Bézout:** existem inteiros s e t com s × a + t × b = mdc(a, b). O **Euclides estendido** calcula s e t:

```python
def euclides_estendido(a, b):
    if b == 0:
        return a, 1, 0
    g, s, t = euclides_estendido(b, a % b)
    return g, t, s - (a // b) * t      # devolve (mdc, s, t) com s*a + t*b == mdc

print(euclides_estendido(252, 105))    # (21, -2, 5): -2*252 + 5*105 == 21
```

### 5.2 Aritmética modular

a ≡ b (mod n) quando n divide a − b (mesmo resto na divisão por n). É a aritmética do relógio: 10h + 5h = 3h (mod 12).

Soma, subtração e multiplicação **respeitam** a congruência: dá para reduzir mod n a qualquer momento.

```
(123456789 × 987654321) mod 10 = (9 × 1) mod 10 = 9
```

**Exponenciação modular rápida:** calcular aᵉ mod n sem números gigantes, elevando ao quadrado (como a `potencia_rapida` da Introdução à Programação). Em Python: `pow(a, e, n)`.

```python
pow(3, 10**18, 1_000_000_007)    # instantâneo
```

> **Cuidado! Cai na prova:** a divisão **não** funciona livremente no mod. 2 × 3 ≡ 2 × 0 (mod 6), mas 3 ≢ 0. Só dá para "cancelar" um fator que tem inverso (Tema 5.4).

### 5.3 Primos

Um **primo** tem exatamente dois divisores positivos: 1 e ele mesmo.

**Teorema fundamental da aritmética:** todo inteiro maior que 1 se escreve como produto de primos **de forma única** (a menos da ordem). A existência você provou por indução forte no Tema 3; a unicidade usa o **lema de Euclides**: se um primo p divide a × b, então p divide a ou p divide b.

O **crivo de Eratóstenes** lista os primos até n em O(n log log n):

```python
def crivo(n):
    primo = [True] * (n + 1)
    primo[0] = primo[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if primo[i]:
            for j in range(i * i, n + 1, i):
                primo[j] = False
    return [i for i, p in enumerate(primo) if p]
```

**Pequeno teorema de Fermat:** se p é primo e p não divide a, então aᵖ⁻¹ ≡ 1 (mod p). Base de testes rápidos de primalidade (Miller-Rabin) usados para gerar chaves criptográficas com centenas de dígitos.

### 5.4 Inverso modular e RSA

O **inverso** de a mod n é um x com a × x ≡ 1 (mod n). Ele existe **se e somente se** mdc(a, n) = 1, e o Euclides estendido o calcula: se s × a + t × n = 1, então s × a ≡ 1 (mod n). Em Python: `pow(a, -1, n)`.

**Função φ de Euler:** φ(n) é a quantidade de números de 1 a n primos com n. Para p e q primos distintos, φ(p × q) = (p − 1)(q − 1). **Teorema de Euler:** se mdc(a, n) = 1, então a^φ(n) ≡ 1 (mod n).

**RSA**, a ideia que protege boa parte da internet:

1. Escolha dois primos grandes p e q. Calcule n = p × q e φ = (p − 1)(q − 1).
2. Escolha e com mdc(e, φ) = 1 (comum: e = 65537). A **chave pública** é (n, e).
3. Calcule d = inverso de e mod φ. A **chave privada** é d.
4. **Cifrar** a mensagem m (um número menor que n): c = mᵉ mod n.
5. **Decifrar:** m = cᵈ mod n.

*Por que funciona:* e × d = 1 + kφ, então cᵈ = m^(ed) = m × (m^φ)ᵏ ≡ m × 1ᵏ = m (mod n), pelo teorema de Euler (vale também quando m não é primo com n, com um argumento um pouco maior).

*Por que é seguro:* para achar d, é preciso φ, que exige fatorar n. Multiplicar dois primos de 300 dígitos é instantâneo; fatorar o produto, com os algoritmos conhecidos, levaria tempo astronômico.

```python
p, q = 61, 53
n, phi = p * q, (p - 1) * (q - 1)     # 3233, 3120
e = 17
d = pow(e, -1, phi)                    # 2753
c = pow(65, e, n)                      # cifra 65 → 2790
print(pow(c, d, n))                    # 65
```

Você vai implementar e entender os limites do RSA "de livro" na etapa de Segurança.

### Atividades de fixação do Tema 5

1. Calcule mdc(1071, 462) pelo algoritmo de Euclides, mostrando cada passo, e ache s e t de Bézout.
2. Calcule à mão: (a) 7¹⁰⁰ mod 5; (b) o último dígito de 3²⁰²⁴; (c) (2⁵⁰ + 3⁵⁰) mod 7.
3. Prove que se a ≡ b (mod n) e c ≡ d (mod n), então a × c ≡ b × d (mod n).
4. Ache o inverso de 7 mod 26. Existe inverso de 13 mod 26? Por quê?
5. Prove que, se p é primo, então √p é irracional (generalize a prova de √2).
6. Com p = 11, q = 13 e e = 7, gere as chaves RSA, cifre m = 9 e decifre.
7. Use o crivo para contar os primos até 10⁶ e compare com n / ln n (o teorema dos números primos).

## Tema 6: Grafos

**Objetivo:** modelar problemas com grafos e provar propriedades básicas.

### 6.1 Caminhos e conectividade

Um **grafo** G = (V, E) tem **vértices** (nós) V e **arestas** E ligando pares de vértices. Modelam redes sociais, mapas, a internet, dependências entre pacotes, estados de um jogo.

- **Grau** de um vértice: número de arestas que tocam nele.
- **Caminho:** sequência de vértices ligados por arestas. **Ciclo:** caminho que volta ao início sem repetir arestas.
- **Conexo:** existe caminho entre quaisquer dois vértices. As partes conexas máximas são as **componentes**.
- **Dirigido** (digrafo): arestas têm sentido (seguir no Instagram não é simétrico).

**Lema do aperto de mãos:** a soma dos graus é 2|E| (cada aresta contribui com 2). Consequência: o número de vértices de grau ímpar é **par**.

**Caminho euleriano** (passa por toda aresta uma vez): num grafo conexo, existe ciclo euleriano se e só se todos os graus são pares. Euler resolveu assim, em 1736, o problema das pontes de Königsberg, fundando a teoria dos grafos. Já o **caminho hamiltoniano** (passa por todo **vértice** uma vez) parece parecido e é NP-completo: ninguém sabe decidir eficientemente.

### 6.2 Árvores

Uma **árvore** é um grafo conexo sem ciclos. Propriedades equivalentes (para um grafo com n vértices):

- Conexo e sem ciclos.
- Conexo e com exatamente n − 1 arestas.
- Sem ciclos e com exatamente n − 1 arestas.
- Entre quaisquer dois vértices existe **exatamente um** caminho.

Toda árvore com n ≥ 2 vértices tem pelo menos duas **folhas** (vértices de grau 1). É o que permite provar coisas sobre árvores por indução: remova uma folha e aplique a HI.

**Árvore geradora** de um grafo conexo: subgrafo que é árvore e contém todos os vértices. A **árvore geradora mínima** (com pesos nas arestas) é o problema de ligar cidades com o menor custo de cabo (Algoritmos).

### 6.3 Coloração

Colorir os vértices de modo que vizinhos tenham cores diferentes. O menor número de cores é o **número cromático** χ(G).

Aplicações: montar horários de provas (vértices são disciplinas, arestas ligam disciplinas com alunos em comum, cores são horários), alocar registradores num compilador, atribuir frequências a antenas.

- Um grafo tem χ ≤ 2 (é **bipartido**) se e só se não tem ciclo de tamanho ímpar.
- Um algoritmo guloso usa no máximo Δ + 1 cores, onde Δ é o grau máximo.
- Decidir se χ ≤ 3 é NP-completo.

### 6.4 Emparelhamento

Um **emparelhamento** é um conjunto de arestas sem vértices em comum (pares disjuntos). Em grafos **bipartidos** (dois lados, arestas só entre os lados): candidatos e vagas, alunos e projetos, doadores e receptores de órgãos.

**Teorema de Hall:** num grafo bipartido com lados A e B, existe emparelhamento que cobre todo A se e só se, para todo subconjunto S de A, os vizinhos de S são pelo menos |S|. (Nenhum grupo de candidatos disputa menos vagas do que o número de pessoas no grupo.)

**Casamento estável (Gale-Shapley):** cada pessoa tem uma lista de preferências; um emparelhamento é estável se nenhum par prefere um ao outro aos seus parceiros atuais. O algoritmo de Gale-Shapley sempre acha um, e é usado de verdade na alocação de residência médica nos EUA (e rendeu um prêmio Nobel de Economia em 2012).

### 6.5 Grafos planares

Um grafo é **planar** se pode ser desenhado no plano sem arestas se cruzando (importante no projeto de circuitos impressos).

**Fórmula de Euler:** num grafo planar conexo, **V − E + F = 2**, onde F é o número de faces (regiões, contando a externa). Consequência: um grafo planar simples com V ≥ 3 tem E ≤ 3V − 6. Por isso K₅ (5 vértices todos ligados, E = 10 > 3 × 5 − 6 = 9) **não** é planar.

**Teorema das quatro cores:** todo grafo planar pode ser colorido com 4 cores (todo mapa pode ser pintado com 4 cores sem países vizinhos iguais). Provado em 1976 com ajuda de computador, a primeira grande prova assim, e verificado formalmente em 2005 no assistente de provas Coq.

### Atividades de fixação do Tema 6

1. Uma festa tem 7 pessoas. É possível que cada uma conheça exatamente 3 outras?
2. Prove que uma árvore com n vértices tem n − 1 arestas (indução removendo uma folha).
3. O desenho de uma "casinha" (quadrado com um triângulo em cima e as duas diagonais do quadrado) pode ser feito sem tirar o lápis do papel e sem repetir traço? Justifique pelos graus.
4. Seis disciplinas têm conflitos: A-B, A-C, B-C, B-D, C-E, D-E, D-F, E-F. Quantos horários de prova são necessários? Mostre uma coloração ótima e prove que não dá com menos.
5. Prove que um grafo com um ciclo de tamanho ímpar não é bipartido.
6. Prove que K₃,₃ (3 casas ligadas a 3 serviços) não é planar. Dica: num grafo bipartido planar, cada face tem pelo menos 4 arestas, então E ≤ 2V − 4.
7. Implemente Gale-Shapley em Python para 4 alunos e 4 orientadores com preferências inventadas.

## Tema 7: Contagem e recorrências

**Objetivo:** contar objetos combinatórios com técnicas gerais e resolver recorrências.

### 7.1 Bijeções

Para contar um conjunto difícil, ache uma **bijeção** com um conjunto fácil de contar.

Exemplo: quantos subconjuntos tem {1, ..., n}? Cada subconjunto corresponde a uma string de n bits (bit i = 1 se i está no subconjunto). São 2ⁿ strings, então 2ⁿ subconjuntos.

Exemplo: de quantas formas distribuir 10 balas iguais entre 3 crianças? Represente como uma sequência de 10 estrelas e 2 barras (`***|*****|**` = 3, 5, 2). Cada distribuição corresponde a escolher as posições das 2 barras entre 12 posições: **C(12, 2) = 66**. Essa técnica se chama **estrelas e barras**: distribuir n itens iguais em k caixas dá C(n + k − 1, k − 1).

### 7.2 Permutações e combinações

Revisão da Fase 0, com as fórmulas gerais:

| Situação | Fórmula |
|---|---|
| Sequências de k itens de n, com repetição | nᵏ |
| Arranjos (sem repetição, ordem importa) | n!/(n − k)! |
| Combinações (sem repetição, ordem não importa) | C(n, k) = n!/(k!(n − k)!) |
| Combinações com repetição | C(n + k − 1, k) |
| Anagramas com letras repetidas | n!/(n₁! n₂! ... ) |

Anagramas de BANANA: 6!/(3! 2! 1!) = 60.

**Triângulo de Pascal e binômio:** C(n, k) = C(n − 1, k − 1) + C(n − 1, k) (o elemento n está ou não está na escolha). E (x + y)ⁿ = Σ C(n, k) xᵏ yⁿ⁻ᵏ. Com x = y = 1: Σ C(n, k) = 2ⁿ.

### 7.3 Inclusão e exclusão

Para contar uma união, some os tamanhos e corrija as sobreposições:

- |A ∪ B| = |A| + |B| − |A ∩ B|
- |A ∪ B ∪ C| = |A| + |B| + |C| − |A ∩ B| − |A ∩ C| − |B ∩ C| + |A ∩ B ∩ C|

Exemplo: quantos números de 1 a 1.000 são divisíveis por 2, 3 ou 5? |A₂| = 500, |A₃| = 333, |A₅| = 200, |A₆| = 166, |A₁₀| = 100, |A₁₅| = 66, |A₃₀| = 33. Total: 500 + 333 + 200 − 166 − 100 − 66 + 33 = **734**.

### 7.4 Princípio das casas dos pombos

Se n + 1 pombos entram em n casas, alguma casa tem pelo menos 2 pombos. Generalizado: se N objetos vão para k caixas, alguma caixa tem pelo menos ⌈N/k⌉.

Parece trivial, mas prova coisas nada óbvias:

- Em São Paulo (mais de 12 milhões de pessoas), pelo menos duas têm exatamente o mesmo número de fios de cabelo (ninguém tem mais de 1 milhão).
- Toda função hash de entradas maiores para saídas menores tem colisões.
- Não existe compressor que diminua **todo** arquivo: há 2ⁿ arquivos de n bits e menos que 2ⁿ arquivos menores.
- Entre quaisquer 5 pontos num quadrado de lado 2, dois estão a distância ≤ √2 (divida em 4 quadrados de lado 1).

### 7.5 Recorrências

Uma **recorrência** define uma sequência pelos termos anteriores. Aparecem ao contar e, principalmente, ao analisar algoritmos recursivos.

- Torres de Hanói: T(n) = 2T(n − 1) + 1, T(0) = 0 → T(n) = 2ⁿ − 1.
- Fibonacci: F(n) = F(n − 1) + F(n − 2).
- Busca binária: T(n) = T(n/2) + 1 → T(n) ≈ log₂ n.
- Merge sort: T(n) = 2T(n/2) + n → T(n) ≈ n log₂ n.

**Recorrências lineares homogêneas** como aₙ = c₁aₙ₋₁ + c₂aₙ₋₂: tente aₙ = rⁿ. Chega-se à **equação característica** r² = c₁r + c₂. Com raízes distintas r₁ e r₂, a solução geral é aₙ = A r₁ⁿ + B r₂ⁿ, e A e B saem dos valores iniciais.

Para Fibonacci: r² = r + 1, raízes φ = (1 + √5)/2 ≈ 1,618 e ψ = (1 − √5)/2. Resultado (**fórmula de Binet**): F(n) = (φⁿ − ψⁿ)/√5. Por isso o `fib` recursivo ingênuo faz cerca de φⁿ chamadas: crescimento exponencial.

### 7.6 Funções geradoras

Uma **função geradora** codifica uma sequência a₀, a₁, a₂, ... como os coeficientes de uma série: G(x) = a₀ + a₁x + a₂x² + ...

- (1, 1, 1, ...) ↔ 1/(1 − x).
- (1, 2, 4, 8, ...) ↔ 1/(1 − 2x).

Multiplicar funções geradoras combina escolhas. Exemplo: de quantas formas pagar n centavos com moedas de 1 e 5? É o coeficiente de xⁿ em (1 + x + x² + ...)(1 + x⁵ + x¹⁰ + ...) = 1/((1 − x)(1 − x⁵)).

É uma ferramenta avançada; aqui basta reconhecer a ideia: transformar problemas de contagem em álgebra de polinômios. O livro *generatingfunctionology* (gratuito) vai fundo.

### Atividades de fixação do Tema 7

1. De quantas formas 5 pessoas podem se sentar numa mesa redonda (rotações são iguais)?
2. Quantas soluções inteiras não negativas tem x₁ + x₂ + x₃ + x₄ = 15?
3. Quantos anagramas tem MISSISSIPPI? Em quantos os quatro S ficam juntos?
4. Quantas senhas de 8 dígitos (0 a 9) têm pelo menos um dígito 7?
5. Quantos inteiros de 1 a 1.000 não são divisíveis por 2, nem por 3, nem por 5?
6. Prove: em qualquer grupo de 6 pessoas, há 3 que se conhecem mutuamente ou 3 que são mutuamente desconhecidas.
7. Resolva a recorrência aₙ = 5aₙ₋₁ − 6aₙ₋₂, com a₀ = 1 e a₁ = 4.
8. Escreva a recorrência e resolva: quantas strings de n bits não têm dois 1 consecutivos?

## Tema 8: Sistemas de prova

**Objetivo:** entender provas como objetos formais, verificáveis mecanicamente.

### 8.1 Dedução natural

Até aqui, você escreveu provas em português. Um **sistema de prova** torna isso totalmente formal: um conjunto de **regras de inferência** que dizem como obter fórmulas novas a partir das já provadas. A **dedução natural** (Gentzen, 1934) tem, para cada conectivo, regras de **introdução** (como provar) e **eliminação** (como usar):

| Conectivo | Introdução | Eliminação |
|---|---|---|
| ∧ | De P e de Q, conclua P ∧ Q | De P ∧ Q, conclua P (ou Q) |
| → | Supondo P, derive Q; conclua P → Q (descartando a suposição) | De P e P → Q, conclua Q (*modus ponens*) |
| ∨ | De P, conclua P ∨ Q | De P ∨ Q, P → R e Q → R, conclua R (prova por casos) |
| ¬ | Supondo P, derive ⊥ (absurdo); conclua ¬P | De P e ¬P, conclua ⊥ |

Exemplo, provar (P ∧ Q) → (Q ∧ P):

```
1. P ∧ Q              suposição
2. P                  ∧-eliminação em 1
3. Q                  ∧-eliminação em 1
4. Q ∧ P              ∧-introdução em 3 e 2
5. (P ∧ Q) → (Q ∧ P)  →-introdução, descartando 1
```

Cada linha é justificada por uma regra: um computador pode **verificar** a prova sem entender nada, só checando as regras. Repare que as regras espelham as técnicas do Tema 2: →-introdução é a prova direta; ∨-eliminação é a prova por casos; ¬-introdução é a prova por contradição.

### 8.2 Corretude e completude

Dois tipos de "verdade":

- **Semântica** (⊨): a fórmula é verdadeira em todas as interpretações (tautologia, verificada por tabela-verdade).
- **Sintática** (⊢): a fórmula pode ser derivada pelas regras.

Um sistema de prova é:

- **Correto** (*sound*): tudo que ele prova é verdadeiro. Se ⊢ φ, então ⊨ φ. (Não prova besteira.)
- **Completo:** tudo que é verdadeiro ele consegue provar. Se ⊨ φ, então ⊢ φ.

A dedução natural é correta e completa para a lógica proposicional e também para a lógica de predicados (**teorema da completude de Gödel**, 1929).

Mas há limites: o **teorema da incompletude de Gödel** (1931) mostra que qualquer sistema de prova consistente e capaz de expressar a aritmética dos naturais tem afirmações verdadeiras que ele **não consegue provar**. É primo da indecidibilidade que você verá em Teoria da Computação (Turing chegou lá em 1936, com a mesma diagonalização de Cantor).

### 8.3 Assistentes de prova

Um **assistente de prova** é um programa em que você escreve definições e provas, e ele verifica cada passo. Exemplos: **Lean**, **Coq** (hoje chamado **Rocq**), **Isabelle**, **Agda**. Usos reais:

- Verificação do compilador C **CompCert** e do micronúcleo **seL4** (provados livres de certas classes de bugs).
- A prova do teorema das quatro cores e da conjectura de Kepler.
- A biblioteca **Mathlib** do Lean, com centenas de milhares de teoremas formalizados, usada por matemáticos profissionais.

Um gostinho em Lean 4:

```lean
-- a soma é comutativa nos naturais (já existe na biblioteca; aqui reaproveitamos)
example (a b : Nat) : a + b = b + a := Nat.add_comm a b

-- prova por indução: 0 + n = n
theorem zero_mais (n : Nat) : 0 + n = n := by
  induction n with
  | zero => rfl
  | succ k hi => rw [Nat.add_succ, hi]

-- (P ∧ Q) → (Q ∧ P), a mesma prova da seção 8.1
example (P Q : Prop) : P ∧ Q → Q ∧ P := fun ⟨p, q⟩ => ⟨q, p⟩
```

A última linha revela uma ideia profunda, a **correspondência de Curry-Howard**: **proposições são tipos e provas são programas**. Provar P ∧ Q → Q ∧ P é escrever uma função que recebe um par (prova de P, prova de Q) e devolve o par invertido, exatamente como uma função Haskell `troca (p, q) = (q, p)`. Lógica e programação funcional são a mesma coisa vista de ângulos diferentes.

Para começar: o jogo online **Natural Number Game** (Lean), que constrói a aritmética do zero, uma prova por fase.

### Atividades de fixação do Tema 8

1. Escreva em dedução natural (numerando as linhas e justificando) uma prova de P → (Q → P).
2. Prove em dedução natural: (P → Q) ∧ (Q → R) → (P → R).
3. Prove em dedução natural: ¬(P ∨ Q) → ¬P.
4. Explique a diferença entre "o sistema é correto" e "o sistema é completo". Um sistema que prova toda fórmula é correto? É completo?
5. Pela correspondência de Curry-Howard, que tipo Haskell corresponde a P → (Q → P)? Escreva uma função com esse tipo.
6. Jogue as primeiras fases (o "Tutorial World" e o "Addition World") do Natural Number Game.

## Projeto da etapa

**Provador de tautologias em Python:**

1. **Parser** de fórmulas com variáveis, `~` (não), `&` (e), `|` (ou), `->` (implica), `<->` e parênteses, gerando uma árvore (classes ou tuplas).
2. **Tabela-verdade:** imprime a tabela e classifica a fórmula (tautologia, contradição ou satisfatível).
3. **Conversão para FNC:** eliminar → e ↔, empurrar negações para dentro (De Morgan) e distribuir ∨ sobre ∧.
4. **Resolvedor SAT simples (DPLL):** recebe cláusulas e, com propagação de unidade e escolha de variável com retrocesso, decide se é satisfatível e mostra uma valoração.
5. **Comparação:** gere fórmulas aleatórias com 10, 15 e 20 variáveis e compare o tempo da tabela-verdade (2ⁿ linhas) com o do DPLL.
6. Bônus: resolva um Sudoku codificando-o em FNC e passando para o seu DPLL (ou para o resolvedor `pycosat`).

## Para ir além

- *Mathematics for Computer Science* (Lehman, Leighton e Meyer, gratuito): o livro do MIT 6.1200, completo e cheio de exercícios.
- **MIT OCW 6.042J** (2010 e 2015): aulas em vídeo e listas com soluções.
- *Book of Proof* (Richard Hammack, gratuito): excelente para aprender a escrever provas.
- **Natural Number Game** e **Mathematics in Lean**: para assistentes de prova.
- *generatingfunctionology* (Herbert Wilf, gratuito), para quem quiser se aprofundar em funções geradoras.

## Resumão

- P → Q só é falsa com P verdadeira e Q falsa. Contrapositiva é equivalente; recíproca não.
- De Morgan: ¬(P ∧ Q) ≡ ¬P ∨ ¬Q. FNC é o formato dos resolvedores SAT.
- Negar quantificador troca ∀ por ∃. A ordem dos quantificadores importa. Um contraexemplo refuta um "para todo".
- Técnicas: direta, contrapositiva, contradição, casos. Use as definições.
- Indução: base + passo usando a HI. Forte: supõe todos os anteriores. Invariante: vale no início e se preserva.
- Equivalência (reflexiva, simétrica, transitiva) particiona; ordem parcial (reflexiva, antissimétrica, transitiva) ordena.
- Bijeção = mesmo tamanho. Diagonalização: existem mais problemas que programas.
- Euclides calcula o MDC em O(log n); inverso modular existe sse mdc = 1. RSA: fácil multiplicar, difícil fatorar.
- Soma dos graus = 2|E|. Árvore: conexa, sem ciclos, n − 1 arestas. Bipartido sse sem ciclo ímpar. V − E + F = 2.
- Contagem: bijeção, estrelas e barras, inclusão e exclusão, casas dos pombos. Recorrências lineares: equação característica.
- Sistemas de prova: correto (só prova verdades) e completo (prova todas). Curry-Howard: provas são programas.
