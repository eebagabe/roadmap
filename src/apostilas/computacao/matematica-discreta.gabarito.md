# Gabarito: Matemática Discreta e Lógica

Abra só depois de tentar.

## Tema 1

1. Sim, é **tautologia** (o "silogismo hipotético": a implicação é transitiva). A única forma de a fórmula ser falsa seria (P → Q) ∧ (Q → R) verdadeira e P → R falsa. P → R falsa exige P = V e R = F. Com P = V, P → Q verdadeira exige Q = V. Com Q = V, Q → R verdadeira exige R = V. Contradição com R = F. Na tabela de 8 linhas, todas dão V.
2. A negação de P → Q é P ∧ ¬Q: **"o aluno estudou e dormiu bem, e não passou"**.
3. ```
   ¬(P ∨ (¬P ∧ Q))
   ≡ ¬P ∧ ¬(¬P ∧ Q)          De Morgan
   ≡ ¬P ∧ (¬¬P ∨ ¬Q)         De Morgan
   ≡ ¬P ∧ (P ∨ ¬Q)           dupla negação
   ≡ (¬P ∧ P) ∨ (¬P ∧ ¬Q)    distributiva
   ≡ F ∨ (¬P ∧ ¬Q)           contradição
   ≡ ¬P ∧ ¬Q
   ```
4. Recíproca: "se n é par, então n é divisível por 4". **Falsa** (n = 6). Contrapositiva: "se n é ímpar, então n não é divisível por 4". **Verdadeira** (equivalente à original, que é verdadeira).
5. FND (linhas onde P ⊕ Q é V): **(P ∧ ¬Q) ∨ (¬P ∧ Q)**. FNC (uma cláusula para cada linha falsa, negando-a): linhas falsas são (V, V) e (F, F), então **(¬P ∨ ¬Q) ∧ (P ∨ Q)**.
6. `not (x < 0 or x > 10)` ≡ `x >= 0 and x <= 10` (De Morgan); `not (x == 5)` ≡ `x != 5`. Resultado: **`if 0 <= x <= 10 and x != 5:`**.

## Tema 2

1. Seja P o conjunto dos programas. "∀p ∈ P (Compila(p) → ∃t (Teste(t, p) ∧ Falha(t, p)))". Negação: "∃p ∈ P (Compila(p) ∧ ∀t (Teste(t, p) → ¬Falha(t, p)))": **existe um programa que compila e em que nenhum teste falha**.
2. O primeiro é **verdadeiro** (para cada x, tome y = −x). O segundo é **falso**: um único y teria que satisfazer x + y = 0 para todo x, mas x = 0 exige y = 0 e x = 1 exige y = −1.
3. Sejam a/b e c/d racionais (a, b, c, d inteiros, b, d ≠ 0). Então a/b + c/d = (ad + bc)/(bd). O numerador ad + bc é inteiro e o denominador bd é inteiro não nulo (produto de não nulos). Logo a soma é racional. ∎
4. Contrapositiva: "se a é ímpar **e** b é ímpar, então a × b é ímpar" (pela lei de De Morgan, a negação de "a par ou b par" é "a ímpar e b ímpar"). Prova: a = 2k + 1 e b = 2m + 1, então ab = 4km + 2k + 2m + 1 = 2(2km + k + m) + 1, ímpar. ∎
5. Suponha, por contradição, que existe um maior par N. Então N + 2 também é par (N + 2 = 2k + 2 = 2(k + 1)) e N + 2 > N, contradizendo N ser o maior. ∎
6. Casos pelo sinal. Se x ≥ 0 e y ≥ 0: xy ≥ 0, |xy| = xy = |x||y|. Se x ≥ 0 e y < 0: xy ≤ 0, |xy| = −xy = x(−y) = |x||y|. Se x < 0 e y ≥ 0: simétrico ao anterior. Se x < 0 e y < 0: xy > 0, |xy| = xy = (−x)(−y) = |x||y|. Os quatro casos cobrem todos os reais. ∎
7. **n = 11:** 2¹¹ − 1 = 2047 = 23 × 89, não é primo. (Primos da forma 2ⁿ − 1 são os **primos de Mersenne**; n primo é necessário, mas não suficiente.)

## Tema 3

1. *Base:* n = 1: 1 = 1². *Passo:* suponha 1 + 3 + ... + (2n − 1) = n². Então 1 + ... + (2n − 1) + (2n + 1) = n² + 2n + 1 = (n + 1)², pela HI. ∎
2. *Base:* n = 5: 32 > 25. *Passo:* suponha 2ⁿ > n² com n ≥ 5. Então 2ⁿ⁺¹ = 2 × 2ⁿ > 2n² (pela HI). Basta mostrar 2n² ≥ (n + 1)², ou seja, n² ≥ 2n + 1, ou n² − 2n − 1 ≥ 0, ou (n − 1)² ≥ 2, verdade para n ≥ 3. Logo 2ⁿ⁺¹ > (n + 1)². ∎
3. *Base:* n = 0: 1 = 2¹ − 1. *Passo:* 1 + ... + 2ⁿ + 2ⁿ⁺¹ = (2ⁿ⁺¹ − 1) + 2ⁿ⁺¹ (HI) = 2 × 2ⁿ⁺¹ − 1 = 2ⁿ⁺² − 1. ∎
4. *Bases:* 12 = 4 + 4 + 4; 13 = 4 + 4 + 5; 14 = 4 + 5 + 5; 15 = 5 + 5 + 5. *Passo (indução forte):* para n ≥ 16, n − 4 ≥ 12, e pela HI forte n − 4 pode ser pago; acrescente um selo de 4. ∎ (Precisamos de 4 bases porque o passo "pula" 4.)
5. O passo falha de **n = 1 para n = 2**: com 2 cavalos, tirar o primeiro deixa {cavalo 2} e tirar o último deixa {cavalo 1}. Os dois grupos **não se sobrepõem**, então não dá para concluir que os dois têm a mesma cor. O argumento "os grupos se sobrepõem" só vale para n + 1 ≥ 3. Lição: verifique se o passo funciona para **todo** n a partir da base.
6. **Não.** Pinte como tabuleiro de xadrez. Os cantos opostos têm a **mesma cor** (digamos, brancos). Sobram 30 casas brancas e 32 pretas. Cada dominó cobre uma branca e uma preta (invariante: com k dominós, cobrem k brancas e k pretas). Cobrir tudo exigiria o mesmo número de brancas e pretas. Impossível. ∎
7. A **última bala é vermelha**. Invariante: **a paridade do número de balas azuis**. Duas vermelhas: azuis não mudam. Duas azuis: saem 2 azuis, entra 1 vermelha: azuis diminuem 2 (paridade mantida). Uma de cada: sai 1 azul e entra 1 azul: azuis não mudam. Começa com 20 azuis (par), então sempre par. A cada passo o total diminui 1, então o processo termina com uma bala. Com uma bala só e número par de azuis, há 0 azuis: a bala é vermelha. ∎

## Tema 4

1. (⊆) Seja x ∈ A ∩ (B ∪ C). Então x ∈ A e (x ∈ B ou x ∈ C). Se x ∈ B, x ∈ A ∩ B; se x ∈ C, x ∈ A ∩ C. Em ambos, x ∈ (A ∩ B) ∪ (A ∩ C). (⊇) Seja x ∈ (A ∩ B) ∪ (A ∩ C). Se x ∈ A ∩ B, então x ∈ A e x ∈ B ⊆ B ∪ C. Se x ∈ A ∩ C, igual. Logo x ∈ A ∩ (B ∪ C). ∎
2. 𝒫(A) = {∅, {1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3}, {1, 2, 3}}: 8 elementos. 𝒫(𝒫(A)) tem **2⁸ = 256** elementos.
3. (a) "Divide": **reflexiva** (a = 1 × a), **antissimétrica** (se a | b e b | a com positivos, a = b), **transitiva**; não simétrica (2 | 4, 4 ∤ 2). É ordem parcial. (b) |a − b| ≤ 1: **reflexiva**, **simétrica**; não antissimétrica (0 e 1); **não transitiva** (0 ~ 1 e 1 ~ 2, mas |0 − 2| = 2). (c) Mesmo resto mod 5: **reflexiva, simétrica, transitiva**; não antissimétrica (0 e 5).
4. Reflexiva: a − a = 0 = 5 × 0. Simétrica: se 5 | a − b, então 5 | −(a − b) = b − a. Transitiva: se 5 | a − b e 5 | b − c, então 5 divide a soma (a − b) + (b − c) = a − c. Classes: os 5 restos possíveis, [0] = {..., −5, 0, 5, 10, ...}, [1] = {..., −4, 1, 6, ...}, [2], [3], [4].
5. (a) **Injetora**, não sobrejetora (ímpares não são atingidos). (b) **Bijetora** (inversa n − 7). (c) **Nenhuma**: f(2) = f(−2) e negativos não são atingidos. (d) **Sobrejetora**, não injetora. Repare como o contradomínio muda a resposta entre (c) e (d).
6. Sejam f: A → B e g: B → C injetoras. Se g(f(x)) = g(f(y)), então f(x) = f(y) (g injetora), e então x = y (f injetora). Logo g ∘ f é injetora. ∎
7. Liste 0, −1, 1, −2, 2, −3, ... Fórmula: **f(n) = n/2 se n é par; f(n) = −(n + 1)/2 se n é ímpar**. f(0) = 0, f(1) = −1, f(2) = 1, f(3) = −2, f(4) = 2. Cada inteiro aparece exatamente uma vez.

## Tema 5

1. ```
   1071 = 2 × 462 + 147
    462 = 3 × 147 + 21
    147 = 7 × 21 + 0         → mdc = 21
   ```
   Voltando: 21 = 462 − 3 × 147 = 462 − 3 × (1071 − 2 × 462) = 7 × 462 − 3 × 1071. Então **s = −3, t = 7** (−3 × 1071 + 7 × 462 = 21).
2. (a) 7 ≡ 2 (mod 5) e 2⁴ = 16 ≡ 1, então 7¹⁰⁰ ≡ 2¹⁰⁰ = (2⁴)²⁵ ≡ **1**. (b) Últimos dígitos de 3ᵏ: 3, 9, 7, 1, repetindo a cada 4. 2024 é múltiplo de 4, então o último dígito é **1**. (c) 2³ = 8 ≡ 1 (mod 7), 50 = 3 × 16 + 2, então 2⁵⁰ ≡ 2² = 4. 3⁶ ≡ 1 (mod 7) (Fermat), 50 = 6 × 8 + 2, então 3⁵⁰ ≡ 3² = 9 ≡ 2. Soma: 4 + 2 = **6**.
3. Por hipótese, a = b + kn e c = d + mn. Então ac = (b + kn)(d + mn) = bd + n(bm + dk + kmn). Logo n | ac − bd, ou seja, ac ≡ bd (mod n). ∎
4. 7 × 15 = 105 = 4 × 26 + 1, então o inverso de 7 mod 26 é **15**. Não existe inverso de 13 mod 26, porque **mdc(13, 26) = 13 ≠ 1**: 13x mod 26 só pode valer 0 ou 13, nunca 1.
5. Suponha √p = a/b com a e b sem fatores comuns. Então a² = p b². Logo p | a², e pelo lema de Euclides (p primo), p | a: a = pc. Então p²c² = pb², ou b² = pc², e de novo p | b. Assim p divide a e b, contradição. ∎
6. n = 143, φ = 10 × 12 = 120. e = 7 (mdc(7, 120) = 1). d = inverso de 7 mod 120 = **103** (7 × 103 = 721 = 6 × 120 + 1). Chave pública (143, 7), privada 103. Cifra: c = 9⁷ mod 143 = **48**. Decifra: 48¹⁰³ mod 143 = **9**. ✓
   ```python
   print(pow(9, 7, 143), pow(48, 103, 143))   # 48 9
   ```
7. Há **78.498** primos até 10⁶. n / ln n ≈ **72.382**. A estimativa erra uns 8% para baixo; o erro relativo vai a zero conforme n cresce (teorema dos números primos). Uma aproximação melhor é a integral logarítmica Li(n) ≈ 78.628.

## Tema 6

1. **Não.** A soma dos graus seria 7 × 3 = 21, ímpar, mas ela precisa ser 2|E|, par. (Equivalente: o número de vértices de grau ímpar seria 7, que é ímpar.)
2. *Base:* n = 1: nenhuma aresta. ✓ *Passo:* seja T uma árvore com n + 1 ≥ 2 vértices. T tem uma folha v. Removendo v e sua única aresta, sobra T′, que continua conexa (nenhum caminho entre outros vértices passava por v, que tem grau 1) e sem ciclos: é uma árvore com n vértices. Pela HI, T′ tem n − 1 arestas, então T tem n. ∎
3. **Sim.** Os dois cantos de baixo têm grau 3 (dois lados e uma diagonal); os dois de cima têm grau 4 (dois lados, uma diagonal e um lado do telhado); o topo do telhado tem grau 2. Exatamente **dois** vértices de grau ímpar: existe caminho euleriano começando num canto de baixo e terminando no outro.
4. **3 horários.** A, B e C são mutuamente ligados (triângulo), então precisam de 3 cores diferentes: não dá com 2. Coloração com 3: **A = 1, B = 2, C = 3, D = 1, E = 2, F = 3**. Conferindo: A-B (1, 2), A-C (1, 3), B-C (2, 3), B-D (2, 1), C-E (3, 2), D-E (1, 2), D-F (1, 3), E-F (2, 3). ✓
5. Suponha o grafo bipartido com lados L e R. Num ciclo, cada aresta troca de lado; voltar ao vértice inicial exige um número **par** de trocas. Logo todo ciclo tem tamanho par, e um ciclo ímpar é impossível. ∎
6. K₃,₃ tem V = 6 e E = 9. Se fosse planar, como é bipartido não tem triângulos, então cada face é limitada por pelo menos 4 arestas; cada aresta borda no máximo 2 faces: 4F ≤ 2E, F ≤ E/2. Por Euler, 2 = V − E + F ≤ V − E/2, logo E ≤ 2V − 4 = 8. Mas E = 9. Contradição. ∎
7. ```python
   def gale_shapley(pref_alunos, pref_orient):
       livres = list(pref_alunos)
       proximo = {a: 0 for a in pref_alunos}          # índice da próxima proposta de cada aluno
       par = {}                                         # orientador -> aluno
       rank = {o: {a: i for i, a in enumerate(l)} for o, l in pref_orient.items()}
       while livres:
           a = livres.pop()
           o = pref_alunos[a][proximo[a]]
           proximo[a] += 1
           if o not in par:
               par[o] = a
           elif rank[o][a] < rank[o][par[o]]:
               livres.append(par[o])
               par[o] = a
           else:
               livres.append(a)
       return par
   ```
   Cada aluno faz no máximo n propostas: O(n²) no total. O resultado é ótimo para quem propõe (cada aluno fica com o melhor orientador possível entre os emparelhamentos estáveis).

## Tema 7

1. Com lugares numerados seriam 5! = 120. Cada disposição circular aparece em 5 rotações. Total: 120 / 5 = **4! = 24**.
2. Estrelas e barras com n = 15 e k = 4: C(15 + 3, 3) = C(18, 3) = **816**.
3. MISSISSIPPI: 11 letras, M × 1, I × 4, S × 4, P × 2: 11!/(1! 4! 4! 2!) = **34.650**. Com os S juntos, trate SSSS como um bloco: 8 itens com I × 4, P × 2: 8!/(4! 2!) = **840**.
4. Complemento: total menos as senhas sem nenhum 7. 10⁸ − 9⁸ = 100.000.000 − 43.046.721 = **56.953.279**.
5. Pelo exemplo do texto, 734 são divisíveis por 2, 3 ou 5. Logo 1.000 − 734 = **266** não são.
6. Fixe uma pessoa A. Das outras 5, pela casa dos pombos, pelo menos 3 conhecem A ou pelo menos 3 não conhecem A. Suponha 3 que conhecem (o outro caso é simétrico): B, C, D. Se dois deles se conhecem, junto com A formam 3 conhecidos mútuos. Se nenhum par se conhece, B, C, D são 3 desconhecidos mútuos. ∎ (Isso mostra que o número de Ramsey R(3, 3) ≤ 6; com 5 pessoas pode falhar.)
7. Equação característica r² = 5r − 6, raízes **2 e 3**. aₙ = A × 2ⁿ + B × 3ⁿ. a₀ = A + B = 1; a₁ = 2A + 3B = 4. Então B = 2, A = −1: **aₙ = 2 × 3ⁿ − 2ⁿ**. Confere: a₂ = 18 − 4 = 14 = 5 × 4 − 6 × 1. ✓
8. Seja aₙ o número de strings válidas de n bits. Se a string termina em 0, o resto é qualquer válida de n − 1 bits; se termina em 1, o bit anterior tem que ser 0, e o resto é válida de n − 2 bits. **aₙ = aₙ₋₁ + aₙ₋₂**, com a₁ = 2 ("0", "1") e a₂ = 3 ("00", "01", "10"). É Fibonacci deslocado: **aₙ = F(n + 2)** (com F(1) = F(2) = 1). Pela fórmula de Binet, cresce como φⁿ.

## Tema 8

1. ```
   1. P                 suposição
   2. Q                 suposição
   3. P                 repetição de 1
   4. Q → P             →-introdução, descartando 2
   5. P → (Q → P)       →-introdução, descartando 1
   ```
2. ```
   1. (P → Q) ∧ (Q → R)        suposição
   2. P → Q                    ∧-eliminação em 1
   3. Q → R                    ∧-eliminação em 1
   4. P                        suposição
   5. Q                        →-eliminação (modus ponens) em 4 e 2
   6. R                        →-eliminação em 5 e 3
   7. P → R                    →-introdução, descartando 4
   8. ((P → Q) ∧ (Q → R)) → (P → R)    →-introdução, descartando 1
   ```
3. ```
   1. ¬(P ∨ Q)                 suposição
   2. P                        suposição
   3. P ∨ Q                    ∨-introdução em 2
   4. ⊥                        ¬-eliminação em 3 e 1
   5. ¬P                       ¬-introdução, descartando 2
   6. ¬(P ∨ Q) → ¬P            →-introdução, descartando 1
   ```
4. **Correto:** tudo que se prova é verdade (sem falsos positivos). **Completo:** toda verdade pode ser provada (sem falsos negativos). Um sistema que prova **toda** fórmula é **completo** (prova inclusive todas as verdades), mas **não é correto** (prova também P ∧ ¬P, que é falsa). Um sistema sem nenhuma regra é correto e não é completo. O desejável é ter os dois.
5. P → (Q → P) corresponde ao tipo **`a -> b -> a`**. A função é `const`: `const x _ = x`. "Dada uma prova de P, e depois uma de Q, devolva a de P."
6. Prática. No Addition World você prova, por indução, a comutatividade e a associatividade da soma, usando só a definição de soma pelo sucessor: exatamente o que este tema e o Tema 3 descrevem.

## Projeto da etapa

Pontos de revisão:

- **Parser:** a precedência usual é `~` > `&` > `|` > `->` > `<->`, e `->` associa à direita (`a -> b -> c` é `a -> (b -> c)`). Um parser descendente recursivo com uma função por nível de precedência resolve (você verá a técnica em detalhes em Compiladores).
- **FNC:** a distribuição pode explodir exponencialmente o tamanho da fórmula. Na prática, resolvedores usam a **transformação de Tseitin**, que cria variáveis auxiliares e mantém o tamanho linear (a fórmula resultante não é equivalente, mas é **equissatisfatível**). Vale mencionar no README.
- **DPLL** em esboço:
  ```python
  def dpll(clausulas, valoracao):
      clausulas = simplifica(clausulas, valoracao)     # remove cláusulas satisfeitas e literais falsos
      if not clausulas:
          return valoracao                             # tudo satisfeito
      if any(len(c) == 0 for c in clausulas):
          return None                                  # cláusula vazia: conflito
      for c in clausulas:                              # propagação de unidade
          if len(c) == 1:
              (lit,) = c
              return dpll(clausulas, {**valoracao, abs(lit): lit > 0})
      v = abs(next(iter(clausulas[0])))                # escolha de variável
      return (dpll(clausulas, {**valoracao, v: True})
              or dpll(clausulas, {**valoracao, v: False}))
  ```
  (Literais como inteiros: 3 significa x₃, −3 significa ¬x₃, o formato DIMACS dos resolvedores reais.)
- **Comparação:** a tabela-verdade com 20 variáveis tem ~10⁶ linhas e já fica lenta; o DPLL costuma resolver fórmulas aleatórias com 20 variáveis em milissegundos. Mas, perto da proporção de ~4,26 cláusulas por variável (para 3-SAT aleatório), as instâncias ficam muito mais difíceis: vale plotar o tempo em função dessa proporção.
- **Sudoku:** variáveis x(l, c, d) = "a célula (l, c) tem o dígito d" (729 variáveis); cláusulas para "cada célula tem pelo menos um dígito", "no máximo um", e "cada dígito aparece uma vez por linha, coluna e bloco", mais as dicas como cláusulas unitárias.
