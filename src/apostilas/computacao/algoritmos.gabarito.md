# Gabarito: Projeto e Análise de Algoritmos

Abra só depois de tentar.

## Tema 1

1. | Passo | Fixa | A | B | C | D | E |
   |---|---|---|---|---|---|---|
   | 0 | | 0 | ∞ | ∞ | ∞ | ∞ |
   | 1 | A (0) | 0 | 4 | 2 | ∞ | ∞ |
   | 2 | C (2) | 0 | 3 | 2 | 10 | 12 |
   | 3 | B (3) | 0 | 3 | 2 | 8 | 12 |
   | 4 | D (8) | 0 | 3 | 2 | 8 | 10 |
   | 5 | E (10) | 0 | 3 | 2 | 8 | 10 |

   Ordem: **A, C, B, D, E**. Distâncias finais: **A = 0, B = 3, C = 2, D = 8, E = 10**. Repare que B melhorou de 4 para 3 passando por C.
2. Grafo dirigido: S → A peso 1, S → B peso 2, B → A peso −2. Dijkstra fixa S (0), depois A (1), e A nunca mais muda. Mas o caminho S → B → A custa 2 − 2 = **0**. Resposta de Dijkstra: 1; correta: 0.
3. Inicial: S = 0, o resto ∞. Rodada 1 (arestas na ordem dada): A = 4, B = 5, C = 4 − 3 = 1, A = min(4, 5 − 2) = 3, B = min(5, 1 + 6) = 5. Rodada 2: C = 3 − 3 = 0; o resto não muda. Rodada 3: nada muda. Final: **S = 0, A = 3, B = 5, C = 0**. O ciclo A → C → B → A pesa −3 + 6 − 2 = **+1**: **não há ciclo negativo** (a verificação final não relaxa nada).
4. Num DAG não há ciclos, então processando os vértices em **ordem topológica**, quando chegamos em v todos os predecessores já têm a distância final: basta relaxar as arestas que saem de cada vértice nessa ordem. O(V + E), com qualquer peso.
   ```python
   def caminhos_dag(ordem_topologica, grafo, s):
       dist = {v: float("inf") for v in ordem_topologica}
       dist[s] = 0
       for u in ordem_topologica:
           for v, w in grafo[u]:
               dist[v] = min(dist[v], dist[u] + w)
       return dist
   ```
   Para o caminho **máximo**: troque `min` por `max` (ou negue os pesos). Em grafos gerais, o caminho máximo simples é NP-difícil; em DAGs é fácil. É assim que se calcula o **caminho crítico** de um projeto (a sequência de tarefas que determina o prazo).
5. Kruskal: arestas em ordem B-C 1, A-C 2, D-E 2, A-B 4, B-D 5, C-D 8, C-E 10. Pega B-C, A-C, D-E; A-B forma ciclo (A e B já conectados via C); pega B-D; pronto (4 arestas para 5 vértices). Prim a partir de A: A-C (2), C-B (1), B-D (5), D-E (2). **Mesma árvore**: {B-C, A-C, D-E, B-D}, **custo 10**.
6. Produto das taxas: 5 × 0,18 × 1,15 = **1,035 > 1**: há arbitragem (3,5% de lucro por volta, sem contar taxas). Modelo: pese cada aresta com −log(taxa). Um ciclo com produto > 1 tem soma de logs > 0, ou seja, soma dos pesos −log < 0: **ciclo negativo**, que Bellman-Ford detecta.

## Tema 2

1. Inversões de [2, 4, 1, 3, 5]: (2, 1), (4, 1), (4, 3): **3**. No merge sort: dividindo em [2, 4] e [1, 3, 5]; a metade esquerda [2, 4] tem 0 inversões internas; na direita, [1] e [3, 5] não têm. Na intercalação final, quando 1 (da direita) é escolhido, restam **2** elementos na esquerda (2 e 4): +2. Depois sai 2; quando 3 é escolhido, resta **1** na esquerda (4): +1. Total 3.
2. a = 12, b = 34, c = 56, d = 78. **ac = 672**, **bd = 2.652**, **(a + b)(c + d) = 46 × 134 = 6.164**; termo do meio = 6.164 − 672 − 2.652 = 2.840. Resultado: 672 × 10⁴ + 2.840 × 10² + 2.652 = 6.720.000 + 284.000 + 2.652 = **7.006.652**. ✓
3. T(n) = 3T(n/3) + n: n^(log₃ 3) = n, caso 2, **Θ(n log n)**. T(n) = 2T(n/2) + n²: n^(log₂ 2) = n é menor que n², caso 3, **Θ(n²)** (a combinação domina; dividir não ajudou).
4. Com grupos de 3, o pivô garante só ~n/3 de cada lado: T(n) ≤ T(n/3) + T(2n/3) + O(n). Como 1/3 + 2/3 = 1, o trabalho por nível **não diminui**, e a solução é Θ(n log n). Com grupos de 5, a soma 1/5 + 7/10 = 9/10 < 1 faz o trabalho cair geometricamente: O(n).
5. Resposta: **6**, no subarray [4, −1, 2, 1]. Kadane:
   ```python
   def kadane(a):
       melhor = atual = a[0]
       for x in a[1:]:
           atual = max(x, atual + x)       # estende o subarray ou começa de novo em x
           melhor = max(melhor, atual)
       return melhor
   ```
   Na versão dividir e conquistar, o melhor cruzando o meio é (a maior soma terminando no meio, indo para a esquerda) + (a maior soma começando no meio + 1, indo para a direita).
6. ```python
   a = [int(c) for c in reversed("123456789")]       # coeficientes, do menos significativo
   b = [int(c) for c in reversed("987654321")]
   coef = multiplica_polinomios(a, b)               # cada coeficiente pode passar de 9
   vai, digitos = 0, []
   for c in coef:
       vai, d = divmod(int(c) + vai, 10)
       digitos.append(d)
   while vai:
       vai, d = divmod(vai, 10)
       digitos.append(d)
   print("".join(map(str, reversed(digitos))))      # 121932631112635269
   ```

## Tema 3

1. Ordenando por término: (1, 4), (3, 5), (0, 6), (5, 7), (3, 9), (5, 9), (6, 10), (8, 11), (8, 12), (2, 14), (12, 16). Guloso: **(1, 4)**; a próxima que começa ≥ 4: **(5, 7)**; ≥ 7: **(8, 11)**; ≥ 11: **(12, 16)**. Total: **4 atividades**.
2. **Por início:** (0, 10), (1, 2), (3, 4): o guloso pega (0, 10) e mais nada; o ótimo pega as outras duas. **Por duração:** (0, 5), (4, 7), (6, 11): a mais curta, (4, 7), conflita com as outras duas; o guloso fica com 1, o ótimo com 2.
3. Ordene por valor/peso e pegue o máximo de cada item nessa ordem, fracionando o último. Prova por troca: se uma solução ótima tem menos de um item de razão maior e mais de um de razão menor, troque um pouco de peso do pior pelo melhor: o valor não diminui. Na **0/1** isso falha: W = 50, itens (10 kg, 60), (20 kg, 100), (30 kg, 120). Razões 6, 5 e 4. O guloso pega os dois primeiros (160) e o terceiro não cabe; o ótimo é o segundo mais o terceiro (**220**).
4. Suponha uma ordem ótima com duas tarefas vizinhas i antes de j, com prazo dᵢ > dⱼ (uma "inversão"). Trocar as duas: j termina mais cedo (só melhora), e i passa a terminar quando j terminava, no instante T. O atraso de i depois da troca é T − dᵢ < T − dⱼ, que era o atraso de j antes. Então o atraso máximo não aumenta. Desfazendo as inversões uma a uma, chega-se à ordem por prazo sem piorar. ∎
5. Juntando: f(5) + e(9) = 14; c(12) + b(13) = 25; 14 + d(16) = 30; 25 + 30 = 55; a(45) + 55 = 100. Um código possível: **a = 0, c = 100, b = 101, f = 1100, e = 1101, d = 111**. Média: (45 × 1 + 13 × 3 + 12 × 3 + 16 × 3 + 9 × 4 + 5 × 4)/100 = **2,24 bits por símbolo**, contra **3** de um código fixo (6 símbolos exigem 3 bits): 25% de economia.
6. Com 1, 5, 10, 25 e 50 o guloso **é ótimo** (sistema "canônico", como o real e o dólar). Com 1, 10 e 25, o menor contraexemplo é **30**: o guloso dá 25 + 1 + 1 + 1 + 1 + 1 (6 moedas); o ótimo é 10 + 10 + 10 (3 moedas).

## Tema 4

1. Passos de 1 ou 2: f(n) = f(n − 1) + f(n − 2), f(0) = f(1) = 1. f(10) = **89** (Fibonacci). Passos de 1, 2 ou 3: g(n) = g(n − 1) + g(n − 2) + g(n − 3), g(0) = 1, g(1) = 1, g(2) = 2. Sequência 1, 1, 2, 4, 7, 13, 24, 44, 81, 149, 274: g(10) = **274**.
2. Melhor valor: **90**, com os itens (4, 40) e (3, 50) (peso 7). Linhas da tabela dp[i][w] para w = 0..10:
   ```
   item (5,10):  0 0 0 0 0 10 10 10 10 10 10
   item (4,40):  0 0 0 0 40 40 40 40 40 50 50
   item (6,30):  0 0 0 0 40 40 40 40 40 50 70
   item (3,50):  0 0 0 50 50 50 50 90 90 90 90
   ```
   Reconstrução: dp[4][10] = 90 ≠ dp[3][10] = 70, então o item (3, 50) entrou; sobra w = 7: dp[3][7] = 40 = dp[2][7] ≠ dp[1][7] = 10, então o item (4, 40) entrou; sobra w = 3, valor 0. Itens: (3, 50) e (4, 40).
3. Tamanho da LCS: **4**. Uma subsequência comum máxima: **BCBA** (outras: BDAB, BCAB). Reconstrua da célula final: quando os caracteres são iguais, inclua e vá na diagonal; senão vá para o vizinho (de cima ou da esquerda) com o maior valor.
4. Distância **6**. Uma sequência: alinhe o "o" final das duas palavras, que fica igual. Sobram "doming" (6 letras) e "sabad" (5 letras): substitua d→s, o→a, m→b, i→a, n→d (5 substituições) e remova o g (1 remoção). Total 6.
5. O(n²): dp[i] = 1 + max(dp[j] para j < i com a[j] < a[i]). O(n log n): mantenha `topos`, onde topos[k] é o menor final possível de uma subsequência crescente de tamanho k + 1; para cada x, ache com busca binária a primeira posição com topos[k] ≥ x e substitua (ou acrescente no fim).
   ```python
   from bisect import bisect_left
   def lis(a):
       topos = []
       for x in a:
           k = bisect_left(topos, x)
           if k == len(topos):
               topos.append(x)
           else:
               topos[k] = x
       return len(topos)
   lis([10, 9, 2, 5, 3, 7, 101, 18])    # 4 (por exemplo, 2, 3, 7, 18)
   ```
6. (AB)C: 10 × 30 × 5 + 10 × 5 × 60 = 1.500 + 3.000 = **4.500**. A(BC): 30 × 5 × 60 + 10 × 30 × 60 = 9.000 + 18.000 = 27.000. A primeira é 6 vezes melhor. Em geral, com dimensões p₀, p₁, ..., pₙ: m[i][j] = min sobre k de m[i][k] + m[k + 1][j] + pᵢ₋₁pₖpⱼ, preenchendo por tamanho de intervalo: O(n³).
7. r(n) = max sobre i de (pᵢ + r(n − i)). Valores r(1..8) = 1, 5, 8, 10, 13, 17, 18, **22**. Para n = 8, o máximo é **22**, cortando em 2 + 6 (5 + 17).

## Tema 5

1. Caminhos por BFS: **s → a → t** (gargalo 5): fluxo 5. **s → b → t** (gargalo 5): fluxo 10. **s → a → b → t** (gargalo: s→a tem 5 restantes, a→b 15, b→t 5 restantes): fluxo **15**. Não há mais caminho: as arestas que chegam em t estão saturadas (a→t 5 e b→t 10). Corte mínimo: S = {s, a, b}, T = {t}, capacidade 5 + 10 = **15** = fluxo máximo. ✓
2. Rede: s→a 1, s→b 1, a→b 1, a→t 1, b→t 1. Se o primeiro caminho for s → a → b → t, sem arestas reversas não sobra caminho (s→a e b→t saturadas, s→b só leva a b, cuja saída está cheia): fluxo 1. O máximo é 2 (s → a → t e s → b → t). Com a aresta reversa b → a, o caminho s → b → a → t "desfaz" o a → b e chega a 2.
3. Vértices: s, um para cada aluno, um para cada projeto, t. Arestas: s → aluno (capacidade 1: cada aluno em um projeto), aluno → projeto aceitável (capacidade 1), projeto → t (**capacidade 2**: até 2 alunos por projeto). O fluxo máximo é o número máximo de alunos alocados, e o fluxo em cada aresta aluno → projeto diz a alocação.
4. Por indução nos passos do Ford-Fulkerson: começando com fluxo 0 (inteiro), as capacidades residuais são inteiras; o gargalo de um caminho é o mínimo de inteiros, então inteiro; somar ou subtrair um inteiro mantém tudo inteiro. Ao terminar, o fluxo (máximo) é inteiro. ∎ (É isso que permite usar fluxo para emparelhamentos: ninguém fica com "meio projeto".)
5. Vértices do polígono: (0, 0), (4, 0), (3, 1), (0, 2). 3x + 2y vale 0, 12, 11, 4: ótimo **(4, 0) com valor 12**. Com x + 3y: 0, 4, 6, 6: empate entre (3, 1) e (0, 2), e **todos os pontos do segmento entre eles** são ótimos (a função objetivo é paralela à restrição x + 3y ≤ 6).
6. Variáveis c (cadeiras) e m (mesas). Maximizar 40c + 70m sujeito a 2c + m ≤ 100 (corte), c + 3m ≤ 90 (montagem), c, m ≥ 0. Vértices: (0, 0) → 0; (50, 0) → 2.000; (0, 30) → 2.100; interseção de 2c + m = 100 com c + 3m = 90: **c = 42, m = 16** → 1.680 + 1.120 = **2.800**. Ótimo: 42 cadeiras e 16 mesas, lucro 2.800, usando todas as horas de corte e de montagem.

## Tema 6

1. ```python
   def rabin_karp(texto, padrao, B=256, M=1_000_000_007):
       n, m = len(texto), len(padrao)
       if m > n:
           return []
       potencia = pow(B, m - 1, M)
       hp = ht = 0
       for i in range(m):
           hp = (hp * B + ord(padrao[i])) % M
           ht = (ht * B + ord(texto[i])) % M
       achados = []
       for i in range(n - m + 1):
           if hp == ht and texto[i:i + m] == padrao:
               achados.append(i)
           if i + m < n:
               ht = ((ht - ord(texto[i]) * potencia) * B + ord(texto[i + m])) % M
       return achados
   ```
   A busca ingênua fica O(nm) quando há muitos "quase acertos": texto "aaaa...a" e padrão "aaa...ab". Nesse caso ela compara quase m caracteres em cada posição; Rabin-Karp compara só os hashes.
2. Para um grafo aleatório com corte mínimo único, a fração de sucesso de uma execução costuma ficar bem acima do limite teórico 2/(n(n − 1)) ≈ 0,5% (para n = 20), algo como 5% a 30% dependendo do grafo. Repetindo algumas centenas de vezes e ficando com o menor corte, o acerto fica praticamente certo.
3. Um **emparelhamento perfeito sozinho**, por exemplo uma única aresta u-v: o algoritmo pega u e v (2 vértices), o ótimo é 1. Ou n arestas disjuntas: o algoritmo pega 2n, o ótimo é n. A análise é justa (*tight*).
4. Implementação: Prim ou Kruskal sobre o grafo completo das distâncias euclidianas, percurso em pré-ordem a partir da raiz, volta ao início. 2-opt: enquanto existir um par de arestas (a, b) e (c, d) do circuito com dist(a, c) + dist(b, d) < dist(a, b) + dist(c, d), inverta o trecho entre b e c. Tipicamente, a 2-aproximação fica 10% a 30% acima do ótimo e o 2-opt reduz para poucos por cento.
5. **Comprar no primeiro dia:** se você esquiar só 1 dia, gasta B contra o ótimo 1: razão B, sem limite constante. **Alugar sempre:** se esquiar D dias com D muito grande, gasta D contra o ótimo B: razão D/B, também sem limite. A estratégia de alugar até B − 1 dias equilibra os dois piores casos.
6. Pense em cada ocorrência do majoritário m "cancelando" uma ocorrência de outro elemento quando o contador diminui. Cada decremento cancela **um par** de elementos diferentes. Como m aparece mais de n/2 vezes, não há elementos diferentes suficientes para cancelar todas as ocorrências de m. Formalmente: se o candidato final não fosse m, toda ocorrência de m teria sido cancelada por uma de outro elemento, dando pelo menos 2 × (ocorrências de m) > n elementos. Contradição. ∎

## Projeto da etapa

Pontos de revisão:

- **Haversine** (distância em linha reta na esfera, em metros):
  ```python
  from math import radians, sin, cos, asin, sqrt
  def haversine(lat1, lon1, lat2, lon2):
      R = 6_371_000
      dlat, dlon = radians(lat2 - lat1), radians(lon2 - lon1)
      a = sin(dlat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)**2
      return 2 * R * asin(sqrt(a))
  ```
  É admissível para distância (nenhuma rua é mais curta que a linha reta). Para **tempo**, divida pela **maior** velocidade da rede, senão a heurística superestima e o A\* perde a garantia de ótimo.
- **Resultados esperados:** A\* explora tipicamente de 3 a 10 vezes menos vértices que Dijkstra em mapas urbanos, e o bidirecional reduz ainda mais. Os dois devem dar **exatamente** a mesma distância (use isso como teste automático).
- **Ruas de mão única:** o grafo é dirigido. Esquecer isso gera rotas "contra a mão"; o `osmnx` já informa o sentido.
- Para a visualização, desenhe os vértices fixados com cor pela ordem de fixação: Dijkstra forma um "círculo" crescente em torno da origem; A\* forma uma "elipse" alongada em direção ao destino.
