# Gabarito: Estruturas de Dados

Abra só depois de tentar.

## Tema 1

1. (a) Para n ≥ 1: 5n³ ≤ 5n³ + 2n ≤ 5n³ + 2n³ = 7n³. Com c₁ = 5, c₂ = 7 e n₀ = 1, **Θ(n³)**. (b) Suponha n² ≤ cn para todo n ≥ n₀. Dividindo por n: n ≤ c para todo n ≥ n₀, falso para n = max(n₀, c + 1). Logo **n² ≠ O(n)**. (c) log(n!) ≤ log(nⁿ) = n log n, então O(n log n). Metade dos fatores de n! é ≥ n/2, então n! ≥ (n/2)^(n/2) e log(n!) ≥ (n/2) log(n/2) = Ω(n log n). Logo **Θ(n log n)**.
2. **(log n)² < √n log n < 2^(log₂ n) = n < n log n < n^1,5 < n^(log n) < 2^(n/2) < 4ⁿ < n!**. Observações: 2^(log₂ n) é só n; n^(log n) = 2^((log n)²) é "quase polinomial", maior que qualquer polinômio e menor que qualquer exponencial 2^(cn).
3. O laço interno roda i vezes, e i vale n, n/2, n/4, ... O total é n + n/2 + n/4 + ... < 2n: **Θ(n)**. (Parece n log n, mas a série geométrica converge.)
4. (a) n^(log₂ 4) = n², f = n é menor: caso 1, **Θ(n²)**. (b) f = n² igual: caso 2, **Θ(n² log n)**. (c) f = n³ maior: caso 3 (e 4(n/2)³ = n³/2 ≤ c n³ com c = 1/2, regularidade ok), **Θ(n³)**. (d) n^(log₂ 7) ≈ n^2,807, f = n² menor: caso 1, **Θ(n^2,807)**. Por isso Strassen (7 multiplicações de submatrizes em vez de 8) é assintoticamente mais rápido que o método comum Θ(n³).
5. Na árvore de recursão, cada nível soma **no máximo n** (os tamanhos n/3 e 2n/3 somam n, e assim por diante). O ramo mais curto (sempre n/3) tem log₃ n níveis, todos completos: pelo menos n log₃ n de trabalho. O mais longo (sempre 2n/3) tem log_{3/2} n níveis: no máximo n log_{3/2} n. Os dois são Θ(n log n), logo **T(n) = Θ(n log n)**. (Isso mostra que o quick sort com partições "ruins mas proporcionais" ainda é n log n.)
6. Strings são imutáveis: cada `+=` cria uma string nova e **copia tudo** o que já existe. Com n palavras de tamanho parecido, copia 1 + 2 + ... + n palavras = Θ(n²) caracteres. Correção: **`resultado = "".join(palavras)`**, que calcula o tamanho total uma vez e copia cada palavra uma vez: Θ(n). (O CPython às vezes otimiza o `+=`, mas não conte com isso; em Java, use `StringBuilder`.)

## Tema 2

1. Com sentinela `s` (s.prox é o primeiro, s.ant é o último, lista vazia quando s.prox == s):
   ```python
   class No:
       def __init__(self, v=None):
           self.v, self.ant, self.prox = v, self, self

   class Lista:
       def __init__(self):
           self.s = No()
       def _insere_depois(self, no, v):
           novo = No(v)
           novo.ant, novo.prox = no, no.prox
           no.prox.ant = novo
           no.prox = novo
       def insere_inicio(self, v): self._insere_depois(self.s, v)
       def insere_fim(self, v): self._insere_depois(self.s.ant, v)
       def remove(self, no):
           no.ant.prox, no.prox.ant = no.prox, no.ant
       def busca(self, v):
           no = self.s.prox
           while no is not self.s and no.v != v:
               no = no.prox
           return None if no is self.s else no
       def de_tras_para_frente(self):
           no = self.s.ant
           while no is not self.s:
               yield no.v
               no = no.ant
   ```
   Repare: nenhum `if` para lista vazia ou para início e fim. É para isso que serve a sentinela.
2. ```python
   def tem_ciclo(cabeca):
       lenta = rapida = cabeca
       while rapida and rapida.prox:
           lenta = lenta.prox
           rapida = rapida.prox.prox
           if lenta is rapida:
               return True
       return False
   ```
   Sem ciclo, a rápida chega ao fim. Com ciclo, as duas entram nele e, a cada passo, a distância entre elas (medida ao longo do ciclo) diminui exatamente 1; então elas se encontram em no máximo um "giro" do ciclo. O(n) tempo, O(1) memória.
3. Guarde `inicio`, `tamanho` e capacidade c. Enfileirar escreve em `(inicio + tamanho) % c`; desenfileirar lê em `inicio` e faz `inicio = (inicio + 1) % c`. **Cheia** quando `tamanho == c`, **vazia** quando `tamanho == 0`. Se você guardar só `inicio` e `fim`, "cheia" e "vazia" ficam iguais (`inicio == fim`); as soluções são guardar o tamanho ou deixar sempre uma posição livre.
4. ```python
   class Fila:
       def __init__(self):
           self.entrada, self.saida = [], []
       def enfileira(self, x):
           self.entrada.append(x)
       def desenfileira(self):
           if not self.saida:
               while self.entrada:
                   self.saida.append(self.entrada.pop())
           return self.saida.pop()
   ```
   Método contábil: cobre **3** por `enfileira` (1 paga o push na entrada, 2 ficam como crédito no elemento) e 1 por `desenfileira`. Quando a saída está vazia e despejamos k elementos, cada um paga seu pop da entrada e seu push na saída com os 2 créditos guardados. O crédito nunca fica negativo, então o custo amortizado é O(1) por operação.
5. ```python
   def rpn(expr):
       pilha = []
       for tok in expr.split():
           if tok in "+-*/":
               b, a = pilha.pop(), pilha.pop()        # atenção à ordem
               pilha.append({"+": a + b, "-": a - b, "*": a * b, "/": a / b}[tok])
           else:
               pilha.append(float(tok))
       return pilha.pop()

   rpn("3 4 + 2 *")     # 14.0
   ```
6. ```python
   def proximo_maior(a):
       resposta = [-1] * len(a)
       pilha = []                         # índices com valores decrescentes
       for i, x in enumerate(a):
           while pilha and a[pilha[-1]] < x:
               resposta[pilha.pop()] = x
           pilha.append(i)
       return resposta
   ```
   Cada índice entra e sai da pilha no máximo uma vez: O(n) total, embora haja um `while` dentro do `for`.
7. **Sim**, continua O(1) amortizada. As cópias, voltando da última duplicação, somam no máximo n + n/1,5 + n/1,5² + ... = n × 1/(1 − 2/3) = **3n**. Fator menor gasta menos memória ociosa (até 50% em vez de até 100%) ao custo de mais cópias. Um fator 1,5 também permite reaproveitar blocos liberados anteriormente em alguns alocadores.

## Tema 3

1. Esboço do núcleo:
   ```python
   class TabelaHash:
       def __init__(self, m=8):
           self.baldes = [[] for _ in range(m)]
           self.n = 0
       def _balde(self, k):
           return self.baldes[hash(k) % len(self.baldes)]
       def insere(self, k, v):
           b = self._balde(k)
           for par in b:
               if par[0] == k:
                   par[1] = v
                   return
           b.append([k, v])
           self.n += 1
           if self.n > 0.75 * len(self.baldes):
               velhos = [p for b in self.baldes for p in b]
               self.baldes = [[] for _ in range(2 * len(self.baldes))]
               self.n = 0
               for k2, v2 in velhos:
                   self.insere(k2, v2)
   ```
   `busca` e `remove` percorrem só o balde da chave.
2. Posições (h(k) = k mod 11): 10 → 10; 22 → 0; 31 → 9; 4 → 4; 15 → 4 ocupado → **5**; 28 → 6; 17 → 6 ocupado → **7**; 88 → 0 ocupado → **1**; 59 → 4, 5, 6, 7 ocupados → **8**.
   ```
   índice: 0   1   2   3   4   5   6   7   8   9   10
   chave:  22  88  .   .   4   15  28  17  59  31  10
   ```
   A busca por 59 faz **5 sondagens** (posições 4, 5, 6, 7, 8): o aglomerado de 4 a 10 já mostra o problema da sondagem linear.
3. Endereços alinhados a 8 bytes são múltiplos de 8: os 3 bits mais baixos são sempre 0. Com m = 2ᵏ, k mod m usa **só os k bits mais baixos**, então só 1/8 dos baldes é usado. Em geral, m = 2ᵏ descarta todos os bits altos; qualquer padrão neles é ignorado. Use m primo ou embaralhe os bits antes (multiplicando por uma constante grande ímpar, como faz o hash de Fibonacci).
4. (a) Conte as frequências num dicionário e percorra a string de novo devolvendo o primeiro com contagem 1. (b) Two Sum com conjunto (Introdução à Programação). (c) Chave = letras ordenadas (ou o vetor de contagem de 26 letras, para chaves O(k) em vez de O(k log k)). (d) Ponha tudo num conjunto; para cada x que é **início** de sequência (x − 1 não está no conjunto), conte x + 1, x + 2, ... enquanto estiverem. Cada número é visitado no máximo duas vezes: O(n).
5. Fórmula ½(1 + 1/(1 − α)²): α = 0,5 → **2,5**; 0,7 → **6,1**; 0,9 → **50,5**; 0,95 → **200,5**. A simulação deve bater de perto com tabelas grandes e hash aleatório. A explosão perto de α = 1 é a razão para manter α ≤ 0,7 com sondagem linear.
6. A posição de uma chave é decidida pelo hash **no momento da inserção**. Se o objeto muda e o hash muda, a busca procura no balde errado e não o encontra, embora ele continue lá. O dicionário fica corrompido sem nenhum erro visível.

## Tema 4

1. ```
           50
         /    \
       30      70
      /  \    /  \
    20   40  60   80
         /
       35
   ```
   Removendo 30 (dois filhos): o sucessor é 35 (mínimo da subárvore direita). Troca-se 30 por 35 e remove-se o 35 de baixo:
   ```
           50
         /    \
       35      70
      /  \    /  \
    20   40  60   80
   ```
   Antes da remoção: em ordem **20 30 35 40 50 60 70 80**; pré-ordem **50 30 20 40 35 70 60 80**; pós-ordem **20 35 40 30 60 80 70 50**.
2. Inserir 1, 2: ok. Inserir 3: o nó 1 fica com balanceamento −2 (direita-direita): rotação à esquerda, raiz 2 com filhos 1 e 3. Inserir 4: ok. Inserir 5: o nó 3 desbalanceia (direita-direita): rotação à esquerda em 3, ficando 4 com filhos 3 e 5. Inserir 6: a raiz 2 desbalanceia (direita-direita): rotação à esquerda na raiz, raiz 4 com filhos 2 (1, 3) e 5 (sem filho esquerdo, filho direito 6). Inserir 7: o nó 5 desbalanceia: rotação à esquerda em 5. Resultado final, uma árvore **perfeita**:
   ```
          4
        /   \
       2     6
      / \   / \
     1   3 5   7
   ```
   Uma BST comum com essa entrada viraria uma lista de altura 7.
3. Comparar só com os filhos falha neste caso: raiz 10, filho esquerdo 5, e o filho direito de 5 é 12. Cada nó está certo em relação aos filhos, mas 12 está na subárvore **esquerda** de 10. É preciso propagar limites:
   ```python
   def eh_bst(no, minimo=float("-inf"), maximo=float("inf")):
       if no is None:
           return True
       if not (minimo < no.chave < maximo):
           return False
       return eh_bst(no.esq, minimo, no.chave) and eh_bst(no.dir, no.chave, maximo)
   ```
   (Alternativa: o percurso em ordem tem que ser estritamente crescente.)
4. Com n = 10⁶: qualquer árvore binária tem altura ≥ ⌈log₂(n + 1)⌉ = **20**. Rubro-negra: no máximo 2 log₂(n + 1) ≈ **40**. AVL: no máximo cerca de 1,44 log₂ n ≈ **28**. Na prática, ambas ficam bem perto de 20 a 25.
5. n = 8; os nós internos são os índices 3, 2, 1, 0.
   ```
   inicial:        [9, 4, 7, 1, 8, 2, 6, 3]
   desce(3): 1 ≤ 3, nada muda
   desce(2): 7 troca com 2      [9, 4, 2, 1, 8, 7, 6, 3]
   desce(1): 4 troca com 1, depois com 3
                                [9, 1, 2, 3, 8, 7, 6, 4]
   desce(0): 9 troca com 1, depois com 3, depois com 4
                                [1, 3, 2, 4, 8, 7, 6, 9]
   ```
6. ```python
   import heapq
   class Mediana:
       def __init__(self):
           self.baixo = []      # heap de máximo (valores negados): metade menor
           self.alto = []       # heap de mínimo: metade maior
       def adiciona(self, x):
           heapq.heappush(self.baixo, -x)
           heapq.heappush(self.alto, -heapq.heappop(self.baixo))   # garante baixo ≤ alto
           if len(self.alto) > len(self.baixo):
               heapq.heappush(self.baixo, -heapq.heappop(self.alto))
       def mediana(self):
           if len(self.baixo) > len(self.alto):
               return -self.baixo[0]
           return (-self.baixo[0] + self.alto[0]) / 2
   ```
7. Coloque no heap o primeiro elemento de cada lista (com a identificação da lista). Repita: extraia o mínimo, mande para a saída e insira o próximo da mesma lista. O heap tem no máximo k elementos, cada operação custa O(log k), e há n extrações: **O(n log k)**. Em Python: `heapq.merge(*listas)`.

## Tema 5

1. ```
   [38, 27, 43, 3, 9, 82, 10]
   [38, 27, 43] e [3, 9, 82, 10]
   [38] [27, 43]   [3, 9] [82, 10]
        [27] [43]  [3] [9] [82] [10]
        [27, 43]   [3, 9]  [10, 82]
   [27, 38, 43]    [3, 9, 10, 82]
   [3, 9, 10, 27, 38, 43, 82]
   ```
2. Pivô 5, i = 0. j = 0: 5 < 5? não. j = 1: 2 < 5, troca a[0] e a[1] → [2, 5, 9, 1, 6, 5], i = 1. j = 2: 9 não. j = 3: 1 < 5, troca a[1] e a[3] → [2, 1, 9, 5, 6, 5], i = 2. j = 4: 6 não. Por fim, troca a[2] com o pivô → **[2, 1, 5, 5, 6, 9]**, pivô na posição 2. O problema: todos os iguais ao pivô vão para um lado só. Num array com **todos** os elementos iguais, cada partição separa 0 de n − 1: Θ(n²). Partição em três (bandeira holandesa de Dijkstra):
   ```python
   def particao3(a, lo, hi, pivo):
       lt, i, gt = lo, lo, hi
       while i <= gt:
           if a[i] < pivo:
               a[lt], a[i] = a[i], a[lt]; lt += 1; i += 1
           elif a[i] > pivo:
               a[i], a[gt] = a[gt], a[i]; gt -= 1
           else:
               i += 1
       return lt, gt          # a[lt..gt] são todos iguais ao pivô e não precisam de recursão
   ```
3. Um array **já ordenado** (ou invertido): o último elemento é sempre o maior, a partição separa n − 1 de 0. Comparações: (n − 1) + (n − 2) + ... + 1 = n(n − 1)/2 = **499.500** para n = 1.000. (E com n = 10⁵, a recursão de profundidade 10⁵ estoura a pilha.)
4. **1 bilhão de inteiros de 32 bits:** radix sort com base 2⁸ (4 passadas lineares) costuma vencer; um quick sort bem implementado também é ótimo e não precisa de memória extra (radix precisa de um array auxiliar de 4 GB). **Strings de tamanho variável:** comparações ficam caras; merge sort/Timsort, ou radix MSD (que ordena pelo primeiro caractere e recursa em cada grupo), ou um *burst sort*. **Maior que a memória:** ordenação **externa**: leia blocos que caibam na memória, ordene cada um e grave; depois intercale os blocos com um heap (k-way merge), lendo sequencialmente. É como bancos de dados ordenam tabelas enormes.
5. ```python
   import random
   def quickselect(a, k):          # k-ésimo menor, k começando em 0
       pivo = random.choice(a)
       menores = [x for x in a if x < pivo]
       iguais = [x for x in a if x == pivo]
       if k < len(menores):
           return quickselect(menores, k)
       if k < len(menores) + len(iguais):
           return pivo
       return quickselect([x for x in a if x > pivo], k - len(menores) - len(iguais))
   ```
   Custo esperado: n + n/2 + n/4 + ... (em média o problema cai para uma fração) = **O(n)**. (Existe uma versão determinística O(n), a "mediana das medianas", que você verá em Algoritmos.)
6. O caso médio (sobre as n! permutações igualmente prováveis) é a profundidade **média** das folhas da árvore de decisão. Numa árvore binária com N folhas, a profundidade média é pelo menos log₂ N (o mínimo acontece na árvore balanceada; desbalancear só aumenta a soma das profundidades). Com N ≥ n!, a média é pelo menos log₂(n!) = Ω(n log n). ∎
7. ```
   inicial:   170  45  75  90  802  24   2  66
   unidades:  170  90  802   2   24  45  75  66
   dezenas:   802   2   24  45   66 170  75  90
   centenas:    2  24   45  66   75  90 170 802
   ```
   A ordem do menos para o mais significativo funciona porque cada passada é **estável**: quando ordenamos pelas centenas, números com a mesma centena (como 24, 45, 66...) mantêm a ordem que as passadas anteriores (dezenas e unidades) já tinham estabelecido. Começando pelo mais significativo, a passada seguinte desarrumaria a anterior (a não ser que se ordene cada grupo separadamente, que é o radix MSD).

## Tema 6

1. Matriz 5 × 5 com 1 nas posições (1,2), (1,3), (2,4), (3,4), (4,5) e simétricas. Listas: 1: [2, 3]; 2: [1, 4]; 3: [1, 4]; 4: [2, 3, 5]; 5: [4]. BFS a partir de 1:
   | Vértice | 1 | 2 | 3 | 4 | 5 |
   |---|---|---|---|---|---|
   | dist | 0 | 1 | 1 | 2 | 3 |
   | pai | nenhum | 1 | 1 | 2 | 4 |

   (4 é descoberto primeiro por 2, porque 2 sai da fila antes de 3.)
2. Vértices: as 64 casas; arestas: os 8 movimentos possíveis do cavalo, dentro do tabuleiro. BFS de (0, 0) até (7, 7): **6 movimentos**.
3. ```python
   BRANCO, CINZA, PRETO = 0, 1, 2
   def tem_ciclo(grafo):
       cor = {v: BRANCO for v in grafo}
       def dfs(u):
           cor[u] = CINZA
           for v in grafo[u]:
               if cor[v] == CINZA:
                   return True                 # aresta de retorno: ciclo
               if cor[v] == BRANCO and dfs(v):
                   return True
           cor[u] = PRETO
           return False
       return any(cor[v] == BRANCO and dfs(v) for v in grafo)
   ```
   Com só "visitado/não visitado", o grafo A → B, A → C, C → B daria falso ciclo: ao chegar em B pela segunda vez (vindo de C), B já foi visitado, mas **já terminou** (preto), não está no caminho atual. Só uma aresta para um vértice **cinza** (ainda na pilha de recursão) fecha um ciclo.
4. Arestas: Cálculo → Probabilidade, Discreta → Algoritmos, Programação → Estruturas, Estruturas → Algoritmos, Probabilidade → IA, Algoritmos → IA. **Kahn** (processando em ordem alfabética quando há empate): Cálculo, Discreta, Programação, Estruturas, Probabilidade, Algoritmos, IA. **DFS** (ordem inversa de término) dá, por exemplo: Programação, Estruturas, Discreta, Algoritmos, Cálculo, Probabilidade, IA. Ambas são válidas: um DAG costuma ter muitas ordenações topológicas.
5. **DFS:** percorra a grade; a cada '1' não visitado, conte uma ilha e rode DFS marcando todos os '1' conectados. **Union-find:** um elemento por célula '1'; para cada '1', faça `union` com os vizinhos '1' de cima e da esquerda; a resposta é o número de raízes distintas (ou comece com o número de '1' e subtraia 1 a cada `union` que juntou conjuntos diferentes). Ambos O(linhas × colunas).
6. Sem otimizações, sequências ruins (unir sempre a árvore maior embaixo da menor, como 0-1, 0-2, 0-3, ...) geram árvores de altura n e `find` vira O(n): 10⁶ operações podem levar ~10¹¹ passos. Com união por tamanho e compressão de caminho, as 10⁶ operações levam frações de segundo. Meça os dois e mostre a diferença de ordens de grandeza no relatório.

## Projeto da etapa

Pontos de revisão:

- **Rubro-negra:** a forma mais segura de implementar é a *left-leaning* de Sedgewick (três casos simétricos a menos). Teste o RI depois de cada operação: raiz preta, nenhum vermelho com filho vermelho, mesma altura preta em todos os caminhos e propriedade de BST.
- **Benchmarks:** aqueça a JVM antes de medir (ou use JMH); em C, compile com `-O2` e use entradas geradas antes de iniciar o cronômetro. Rode cada medição várias vezes e use a mediana.
- **Resultados esperados:** quick sort com partição em três vence em entradas com muitos repetidos; quick sort ingênuo (pivô fixo) explode em entradas ordenadas; radix sort vence em inteiros grandes; a lista ligada perde de longe do array dinâmico até em inserções no meio para n moderado, por causa do cache e da alocação de memória de cada nó.
- **Inclinação nos gráficos log-log:** O(n) dá inclinação 1; O(n²), inclinação 2; O(n log n), um pouco acima de 1. Se a sua curva sair do esperado, investigue (cache, coletor de lixo, ou um bug que mudou a complexidade).
