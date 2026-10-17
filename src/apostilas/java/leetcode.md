# LeetCode — Apostila Prática

Roadmap Java Backend · Semanas 04 a 09

## Comece por aqui

LeetCode é um site com problemas de programação. Empresas grandes (Mercado Livre, Nubank, iFood, Amazon, Google) usam problemas parecidos na entrevista técnica. Não é sobre decorar respostas: é sobre reconhecer **padrões**. Existem uns 15 padrões que resolvem a maioria dos problemas. Esta apostila ensina os principais, em Java.

### Por que isso vale ouro no mercado

- A etapa de "live coding" elimina muita gente boa que nunca treinou. Treinar dá vantagem enorme.
- Saber Big O te faz perceber, no trabalho, que aquele `for` dentro de `for` sobre 100 mil registros vai travar a API.
- `HashMap`, `PriorityQueue`, `ArrayDeque`: são as mesmas estruturas que você usa no Spring todo dia.

### Como esta apostila funciona

1. Leia a teoria do tema e digite os códigos de exemplo.
2. Faça os problemas da lista do tema no LeetCode (comece pelos **Easy**).
3. Para cada problema, antes de codar: escreva a ideia em português e o Big O esperado.
4. Faça as atividades de fixação e só depois confira o gabarito.

> **Regra dos 20 minutos:** ficou 20 minutos sem nenhuma ideia? Leia só a dica (ou o nome do padrão), tente mais 10 minutos. Se ainda travar, estude a solução, feche, e **reescreva sozinho no dia seguinte**.

### Plano de estudo sugerido

| Semana | Tema | Meta de problemas |
|---|---|---|
| 04 | Tema 1 — Big O e estruturas fundamentais | 6 |
| 05 | Tema 2 — Hash Tables, Trees, Heaps e Graphs | 6 |
| 06 | Tema 3 — Algoritmos fundamentais | 6 |
| 07 | Tema 4 — Arrays e Strings: padrões | 8 |
| 08 | Tema 5 — Trees, Graphs e recursão | 8 |
| 09 | Tema 6 — Programação dinâmica e entrevista | 8 |

## Tema 1 — Big O e estruturas de dados fundamentais

**Objetivo:** medir quanto um algoritmo custa e conhecer as estruturas básicas.

### 1.1 Big O em uma frase

Big O diz **como o tempo (ou a memória) cresce quando a entrada cresce**. Não mede segundos; mede a tendência.

| Big O | Nome | Exemplo | n = 1.000.000 |
|---|---|---|---|
| O(1) | Constante | Acessar `array[i]`, `map.get(k)` | 1 passo |
| O(log n) | Logarítmica | Busca binária | ~20 passos |
| O(n) | Linear | Percorrer uma lista | 1 milhão |
| O(n log n) | Linearítmica | Ordenar bem (merge sort) | ~20 milhões |
| O(n²) | Quadrática | Dois `for` aninhados | 1 trilhão (trava) |
| O(2ⁿ) | Exponencial | Todos os subconjuntos | impossível |

Regras práticas:

- **Ignore constantes:** O(2n) vira O(n).
- **Fique com o maior termo:** O(n² + n) vira O(n²).
- **Loops em sequência somam, loops aninhados multiplicam.**

**Space complexity** é a mesma ideia para memória extra. Criar um `HashSet` com todos os elementos custa O(n) de espaço.

> **Analogia:** procurar um nome numa lista telefônica folheando página por página é O(n). Abrir no meio, ver se passou, e descartar metade a cada vez é O(log n).

> **Na prática:** um computador comum faz algo como 10⁸ operações simples por segundo. Com n = 10⁵, O(n²) = 10¹⁰: dezenas de segundos. Use isso para descobrir qual complexidade o problema espera pelas restrições do enunciado.

### 1.2 Array e Dynamic Array

**Array** é um bloco contínuo de memória com tamanho fixo. Acesso por índice é O(1). Inserir no meio é O(n), porque precisa empurrar todo mundo.

**Dynamic Array** (`ArrayList` em Java) é um array que cresce: quando enche, cria um maior (cerca de 1,5x no `ArrayList`) e copia tudo. Copiar é O(n), mas acontece raramente, então `add` no fim custa **O(1) amortizado**.

### 1.3 Linked List

Cada nó guarda um valor e um ponteiro para o próximo. Inserir/remover no começo é O(1); acessar o i-ésimo é O(n).

```java
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

// Inverter uma lista: o problema mais clássico de linked list (LeetCode 206)
ListNode reverse(ListNode head) {
    ListNode prev = null, atual = head;
    while (atual != null) {
        ListNode proximo = atual.next;
        atual.next = prev;
        prev = atual;
        atual = proximo;
    }
    return prev;
}
```

### 1.4 Stack, Queue e Deque

| Estrutura | Regra | Em Java use |
|---|---|---|
| Stack (pilha) | Último a entrar, primeiro a sair (LIFO) | `ArrayDeque` com `push`/`pop`/`peek` |
| Queue (fila) | Primeiro a entrar, primeiro a sair (FIFO) | `ArrayDeque` com `offer`/`poll`/`peek` |
| Deque | Entra e sai pelas duas pontas | `ArrayDeque` |

> **Cuidado! Cai na entrevista:** não use a classe `Stack` do Java (é antiga e sincronizada). Use `Deque<Integer> pilha = new ArrayDeque<>();`. Mostra que você conhece a linguagem.

```java
// Parênteses válidos (LeetCode 20)
boolean isValid(String s) {
    Deque<Character> pilha = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(') pilha.push(')');
        else if (c == '[') pilha.push(']');
        else if (c == '{') pilha.push('}');
        else if (pilha.isEmpty() || pilha.pop() != c) return false;
    }
    return pilha.isEmpty();
}
```

**Problemas do tema:** 206 Reverse Linked List, 21 Merge Two Sorted Lists, 141 Linked List Cycle, 20 Valid Parentheses, 155 Min Stack, 232 Implement Queue using Stacks.

### Atividades de fixação — Tema 1

1. Diga o Big O de tempo de cada trecho:
   ```java
   // (a)
   for (int i = 0; i < n; i++) for (int j = 0; j < 10; j++) soma++;
   // (b)
   for (int i = 1; i < n; i *= 2) soma++;
   // (c)
   for (int i = 0; i < n; i++) for (int j = i; j < n; j++) soma++;
   ```
2. As restrições dizem `1 <= n <= 10^5`. Sua ideia é O(n²). Ela deve passar? Qual complexidade você deveria buscar?
3. Por que `ArrayList.add` no fim é O(1) amortizado, se às vezes precisa copiar o array inteiro?
4. Quando você escolheria `LinkedList` em vez de `ArrayList` no dia a dia? (Dica: a resposta honesta é "quase nunca". Explique por quê.)
5. Resolva o 155 Min Stack: uma pilha com `push`, `pop`, `top` e `getMin`, todos em O(1).

## Tema 2 — Hash Tables, Trees, Heaps e Graphs

**Objetivo:** conhecer as estruturas que transformam soluções O(n²) em O(n) ou O(n log n).

### 2.1 Hash Table, HashMap e HashSet

Uma **hash table** usa uma função de hash para transformar a chave num índice de um array. Busca, inserção e remoção são **O(1) em média**.

- `HashMap<K, V>`: chave → valor.
- `HashSet<T>`: só as chaves (para "já vi esse?").

```java
// Two Sum (LeetCode 1): o problema mais famoso do LeetCode
int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> visto = new HashMap<>(); // valor -> índice
    for (int i = 0; i < nums.length; i++) {
        int falta = target - nums[i];
        if (visto.containsKey(falta)) return new int[]{visto.get(falta), i};
        visto.put(nums[i], i);
    }
    return new int[0];
}
```

Força bruta seria O(n²) testando todos os pares. Com HashMap: O(n) tempo, O(n) espaço. **Trocar espaço por tempo** é o truque mais comum de entrevista.

> **Cuidado! Cai na entrevista:** "Como o HashMap funciona por dentro?" Array de "baldes"; o `hashCode()` da chave escolhe o balde; colisões viram uma lista no balde, que vira **árvore rubro-negra** quando passa de 8 elementos (Java 8+); quando a ocupação passa de 75% (load factor), o array dobra e tudo é redistribuído.

Contar frequência é tão comum que vale decorar:

```java
Map<Character, Integer> freq = new HashMap<>();
for (char c : s.toCharArray()) freq.merge(c, 1, Integer::sum);
```

### 2.2 Trees, Binary Tree e Binary Search Tree

Uma **árvore** tem um nó raiz e cada nó tem filhos. Numa **árvore binária**, no máximo 2 filhos (esquerdo e direito).

Uma **BST** (árvore binária de busca) tem a regra: tudo à esquerda é menor, tudo à direita é maior. Busca é O(log n) se a árvore estiver **balanceada** (e O(n) se virar uma "linha"). `TreeMap` e `TreeSet` do Java são árvores balanceadas.

```java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

// Profundidade máxima (LeetCode 104): recursão em árvore no formato mais puro
int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

### 2.3 Heap e Priority Queue

Um **heap** é uma árvore onde o pai é sempre menor (min-heap) ou maior (max-heap) que os filhos. Pegar o menor é O(1); inserir e remover é O(log n). Em Java: `PriorityQueue` (min-heap por padrão).

```java
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());

// K-ésimo maior (LeetCode 215): mantenha um min-heap de tamanho k
int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int n : nums) {
        heap.offer(n);
        if (heap.size() > k) heap.poll();
    }
    return heap.peek();
}
```

O(n log k). Sempre que ler "os k maiores/menores/mais frequentes", pense em heap.

### 2.4 Graph

Um **grafo** são nós (vértices) ligados por arestas. Redes sociais, mapas, dependências entre tarefas. A forma mais comum de representar é a **lista de adjacência**:

```java
Map<Integer, List<Integer>> grafo = new HashMap<>();
for (int[] aresta : arestas) {
    grafo.computeIfAbsent(aresta[0], k -> new ArrayList<>()).add(aresta[1]);
    grafo.computeIfAbsent(aresta[1], k -> new ArrayList<>()).add(aresta[0]); // se não direcionado
}
```

Muitos problemas de grade (matriz) também são grafos: cada célula é um nó ligado às 4 vizinhas.

**Problemas do tema:** 1 Two Sum, 217 Contains Duplicate, 242 Valid Anagram, 49 Group Anagrams, 347 Top K Frequent Elements, 215 Kth Largest Element in an Array.

### Atividades de fixação — Tema 2

1. Resolva o 217 Contains Duplicate de duas formas: O(n log n) sem estrutura extra e O(n) com `HashSet`. Compare tempo e espaço.
2. Uma classe `Pessoa` sobrescreve `equals` mas não `hashCode`. O que acontece ao usá-la como chave de um `HashMap`?
3. Insira, nessa ordem, numa BST: 50, 30, 70, 20, 40, 60, 80. Desenhe. Agora insira 1, 2, 3, 4, 5 numa BST nova. Qual o problema?
4. Resolva o 347 Top K Frequent Elements usando `HashMap` + `PriorityQueue`. Qual o Big O?
5. Represente como lista de adjacência: A–B, A–C, B–D, C–D, D–E (não direcionado).

## Tema 3 — Algoritmos fundamentais

**Objetivo:** dominar busca, ordenação e recursão, que aparecem dentro de quase todo problema.

### 3.1 Linear Search e Binary Search

Busca linear: olha um por um, O(n). Funciona sempre.

Busca binária: só em dados **ordenados**. Olha o meio e descarta metade. O(log n).

```java
// LeetCode 704
int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;  // evita overflow de (lo + hi)
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
```

> **Cuidado! Cai na entrevista:** `(lo + hi) / 2` pode estourar `int` com arrays enormes. Escreva `lo + (hi - lo) / 2` e comente o motivo. Detalhe pequeno, impressão grande.

Busca binária vai além de arrays: dá para buscar "o menor valor que satisfaz uma condição" (por exemplo, a menor velocidade para comer as bananas a tempo, LeetCode 875).

### 3.2 Sorting

| Algoritmo | Tempo | Espaço | Observação |
|---|---|---|---|
| Bubble / Insertion | O(n²) | O(1) | Didático; insertion é bom para quase ordenados |
| Merge Sort | O(n log n) sempre | O(n) | Estável |
| Quick Sort | O(n log n) médio, O(n²) pior | O(log n) | Muito rápido na prática |

Em Java: `Arrays.sort(int[])` usa Dual-Pivot Quicksort para primitivos; `Arrays.sort(Object[])` e `Collections.sort` usam TimSort (híbrido de merge e insertion, estável).

### 3.3 Recursion e Divide and Conquer

Recursão = função que chama a si mesma, com:

1. **Caso base:** quando parar.
2. **Passo recursivo:** um problema menor do mesmo tipo.

**Dividir e conquistar:** divide o problema em partes, resolve cada uma (recursivamente) e junta. O merge sort é o exemplo perfeito:

```java
void mergeSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;                 // caso base: 1 elemento
    int mid = lo + (hi - lo) / 2;
    mergeSort(a, lo, mid);                // conquista a esquerda
    mergeSort(a, mid + 1, hi);            // conquista a direita
    merge(a, lo, mid, hi);                // junta
}

void merge(int[] a, int lo, int mid, int hi) {
    int[] tmp = new int[hi - lo + 1];
    int i = lo, j = mid + 1, k = 0;
    while (i <= mid && j <= hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= hi) tmp[k++] = a[j++];
    System.arraycopy(tmp, 0, a, lo, tmp.length);
}
```

**Problemas do tema:** 704 Binary Search, 35 Search Insert Position, 33 Search in Rotated Sorted Array, 912 Sort an Array, 509 Fibonacci Number, 50 Pow(x, n).

### Atividades de fixação — Tema 3

1. Quantas comparações, no máximo, a busca binária faz num array de 1 milhão de elementos? E de 1 bilhão?
2. Implemente o quick sort (partição de Lomuto ou Hoare). Em que entrada ele cai para O(n²)? Como evitar?
3. Por que o merge sort precisa de O(n) de memória extra?
4. Resolva o 35 Search Insert Position. O que `lo` representa quando o laço termina?
5. Escreva `potencia(x, n)` em O(log n) usando dividir e conquistar (LeetCode 50).

## Tema 4 — Arrays e Strings: padrões

**Objetivo:** aprender os 4 padrões que resolvem a maior parte dos problemas de array e string.

### 4.1 Hashing

Já visto no Tema 2: use `HashMap`/`HashSet` ou um array de 26 posições (para letras minúsculas) para contar ou lembrar.

```java
// Anagrama válido (LeetCode 242)
boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] cont = new int[26];
    for (int i = 0; i < s.length(); i++) {
        cont[s.charAt(i) - 'a']++;
        cont[t.charAt(i) - 'a']--;
    }
    for (int c : cont) if (c != 0) return false;
    return true;
}
```

### 4.2 Two Pointers

Dois índices andando no array, geralmente das pontas para o meio, ou um rápido e um lento. Transforma O(n²) em O(n) quando o array está **ordenado** ou quando você compara as pontas.

```java
// Palíndromo válido (LeetCode 125)
boolean isPalindrome(String s) {
    int i = 0, j = s.length() - 1;
    while (i < j) {
        while (i < j && !Character.isLetterOrDigit(s.charAt(i))) i++;
        while (i < j && !Character.isLetterOrDigit(s.charAt(j))) j--;
        if (Character.toLowerCase(s.charAt(i)) != Character.toLowerCase(s.charAt(j))) return false;
        i++;
        j--;
    }
    return true;
}
```

### 4.3 Sliding Window

Uma "janela" (subarray contínuo) que cresce pela direita e encolhe pela esquerda. Use quando o problema fala de **subarray/substring contínuo** com alguma condição (maior, menor, sem repetição).

```java
// Maior substring sem caracteres repetidos (LeetCode 3)
int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> ultimo = new HashMap<>();
    int melhor = 0, ini = 0;
    for (int fim = 0; fim < s.length(); fim++) {
        char c = s.charAt(fim);
        if (ultimo.containsKey(c) && ultimo.get(c) >= ini) ini = ultimo.get(c) + 1;
        ultimo.put(c, fim);
        melhor = Math.max(melhor, fim - ini + 1);
    }
    return melhor;
}
```

### 4.4 Prefix Sum

Pré-calcule `prefixo[i] = soma dos i primeiros elementos`. Aí a soma de qualquer intervalo `[l, r]` é `prefixo[r + 1] - prefixo[l]`, em O(1).

```java
int[] prefixo = new int[nums.length + 1];
for (int i = 0; i < nums.length; i++) prefixo[i + 1] = prefixo[i] + nums[i];
int somaDe2a5 = prefixo[6] - prefixo[2];
```

> **Cuidado! Cai na entrevista:** soma de prefixos + HashMap resolve "quantos subarrays somam K" (LeetCode 560) em O(n). Sliding window **não** funciona lá se houver números negativos. Saber quando um padrão não serve é tão importante quanto saber usá-lo.

**Problemas do tema:** 242 Valid Anagram, 125 Valid Palindrome, 167 Two Sum II, 15 3Sum, 11 Container With Most Water, 121 Best Time to Buy and Sell Stock, 3 Longest Substring Without Repeating Characters, 238 Product of Array Except Self, 560 Subarray Sum Equals K.

### Atividades de fixação — Tema 4

1. Para cada enunciado, diga o padrão: (a) "maior subarray com soma ≤ K, todos positivos"; (b) "dois números num array ordenado que somam alvo"; (c) "quantas vezes cada palavra aparece"; (d) "soma de vários intervalos [l, r] consultados muitas vezes".
2. Resolva o 121 Best Time to Buy and Sell Stock em O(n) e O(1) de espaço.
3. Resolva o 167 Two Sum II com two pointers. Por que ele funciona só porque o array é ordenado?
4. Resolva o 238 Product of Array Except Self sem usar divisão.
5. Explique por que a sliding window do LeetCode 3 é O(n), mesmo tendo `ini` e `fim` se movendo.

## Tema 5 — Trees, Graphs e problemas recursivos

**Objetivo:** percorrer árvores e grafos com DFS e BFS e resolver problemas de "explorar todas as opções".

### 5.1 DFS e BFS

| | DFS (profundidade) | BFS (largura) |
|---|---|---|
| Ideia | Vai fundo num caminho, depois volta | Visita por camadas, nível a nível |
| Estrutura | Recursão ou pilha | Fila |
| Bom para | Explorar tudo, caminhos, componentes | **Menor caminho** em grafo sem peso, níveis |

```java
// BFS por níveis numa árvore (LeetCode 102)
List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Deque<TreeNode> fila = new ArrayDeque<>();
    fila.offer(root);
    while (!fila.isEmpty()) {
        int tamanho = fila.size();
        List<Integer> nivel = new ArrayList<>();
        for (int i = 0; i < tamanho; i++) {
            TreeNode no = fila.poll();
            nivel.add(no.val);
            if (no.left != null) fila.offer(no.left);
            if (no.right != null) fila.offer(no.right);
        }
        res.add(nivel);
    }
    return res;
}
```

```java
// DFS numa grade: número de ilhas (LeetCode 200)
int numIslands(char[][] grid) {
    int ilhas = 0;
    for (int r = 0; r < grid.length; r++)
        for (int c = 0; c < grid[0].length; c++)
            if (grid[r][c] == '1') { ilhas++; afundar(grid, r, c); }
    return ilhas;
}

void afundar(char[][] g, int r, int c) {
    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;
    g[r][c] = '0'; // marca como visitado
    afundar(g, r + 1, c); afundar(g, r - 1, c); afundar(g, r, c + 1); afundar(g, r, c - 1);
}
```

> **Cuidado! Cai na entrevista:** em grafo, **sempre** marque visitados. Esquecer isso gera laço infinito em ciclos. Em árvore não precisa, porque árvore não tem ciclo.

### 5.2 Backtracking

Explora todas as combinações: escolhe, explora, **desfaz a escolha**. Usado em permutações, subconjuntos, sudoku.

```java
// Subconjuntos (LeetCode 78)
List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), res);
    return res;
}

void backtrack(int[] nums, int ini, List<Integer> atual, List<List<Integer>> res) {
    res.add(new ArrayList<>(atual));       // copia!
    for (int i = ini; i < nums.length; i++) {
        atual.add(nums[i]);                // escolhe
        backtrack(nums, i + 1, atual, res); // explora
        atual.remove(atual.size() - 1);    // desfaz
    }
}
```

### 5.3 Topological Sort e Union-Find

**Ordenação topológica:** ordem para executar tarefas com dependências (A antes de B). Algoritmo de Kahn: conte quantas dependências cada nó tem (grau de entrada), comece pelos que têm zero, e vá liberando. Se sobrar nó, há ciclo (LeetCode 207 Course Schedule).

**Union-Find:** estrutura para responder "esses dois estão no mesmo grupo?" e juntar grupos, quase em O(1).

```java
int[] pai;
int find(int x) { return pai[x] == x ? x : (pai[x] = find(pai[x])); } // compressão de caminho
boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false; // já estavam juntos: essa aresta fecha um ciclo
    pai[ra] = rb;
    return true;
}
```

**Problemas do tema:** 104 Maximum Depth, 226 Invert Binary Tree, 98 Validate BST, 102 Level Order Traversal, 200 Number of Islands, 133 Clone Graph, 207 Course Schedule, 78 Subsets, 46 Permutations, 684 Redundant Connection.

### Atividades de fixação — Tema 5

1. Você precisa do menor número de movimentos de um cavalo de xadrez entre duas casas. DFS ou BFS? Por quê?
2. Resolva o 226 Invert Binary Tree. Qual o Big O de tempo e espaço?
3. No backtracking de subconjuntos, por que `res.add(new ArrayList<>(atual))` e não `res.add(atual)`?
4. Resolva o 207 Course Schedule com o algoritmo de Kahn.
5. Explique por que a solução ingênua do 98 Validate BST (comparar só com os filhos diretos) está errada, com um exemplo.

## Tema 6 — Programação dinâmica e padrões de entrevista

**Objetivo:** resolver problemas de otimização com DP e saber se comportar na entrevista.

### 6.1 Programação dinâmica

DP serve quando o problema tem **subproblemas que se repetem**. Em vez de recalcular, você guarda o resultado.

Fibonacci ingênuo é O(2ⁿ) porque recalcula `fib(3)` várias vezes. Com DP, O(n).

**Memoization (top-down):** a recursão normal, com um cache.

```java
Map<Integer, Long> memo = new HashMap<>();
long fib(int n) {
    if (n <= 1) return n;
    if (memo.containsKey(n)) return memo.get(n);
    long r = fib(n - 1) + fib(n - 2);
    memo.put(n, r);
    return r;
}
```

**Tabulation (bottom-up):** preenche uma tabela do menor para o maior.

```java
// Subir escadas de 1 ou 2 degraus (LeetCode 70)
int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }
    return b;
}
```

Receita para DP:

1. Defina o **estado**: `dp[i]` significa o quê, em português?
2. Escreva a **transição**: como `dp[i]` depende de estados menores?
3. Defina os **casos base**.
4. Defina a **ordem** de preenchimento e onde está a resposta.

```java
// Ladrão de casas (LeetCode 198): dp[i] = melhor valor até a casa i
int rob(int[] nums) {
    int anterior = 0, atual = 0;
    for (int n : nums) {
        int novo = Math.max(atual, anterior + n); // pula a casa ou rouba ela
        anterior = atual;
        atual = novo;
    }
    return atual;
}
```

### 6.2 Greedy, Intervals e Monotonic Stack

- **Greedy (guloso):** escolhe a melhor opção local a cada passo. Funciona só em alguns problemas (Jump Game, 55). Precisa de justificativa.
- **Intervals:** ordene por início e percorra juntando sobreposições (Merge Intervals, 56).
- **Monotonic Stack:** pilha mantida em ordem crescente ou decrescente para achar "o próximo maior/menor" em O(n) (Daily Temperatures, 739).

```java
// Merge Intervals (LeetCode 56)
int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> res = new ArrayList<>();
    for (int[] iv : intervals) {
        if (res.isEmpty() || res.get(res.size() - 1)[1] < iv[0]) res.add(iv);
        else res.get(res.size() - 1)[1] = Math.max(res.get(res.size() - 1)[1], iv[1]);
    }
    return res.toArray(new int[0][]);
}
```

### 6.3 Como falar durante a entrevista

O entrevistador avalia **como você pensa**, não só se passou nos testes. Roteiro:

1. **Entenda:** repita o problema com suas palavras. Pergunte sobre entradas vazias, negativos, duplicados, tamanho máximo.
2. **Exemplos:** faça um exemplo pequeno à mão.
3. **Força bruta primeiro:** diga a solução simples e o Big O dela. Isso já mostra que você resolve.
4. **Otimize:** "o gargalo é procurar o complemento; com um HashMap vira O(1)".
5. **Codifique falando.** Nomes claros.
6. **Teste:** rode seu exemplo à mão no código, depois casos de borda.
7. **Big O final** de tempo e espaço.

> **Cuidado! Cai na entrevista:** silêncio longo é o pior cenário. Se travou, **pense em voz alta**: "estou pensando se dá para ordenar primeiro…". O entrevistador costuma dar dicas para quem está se comunicando.

**Problemas do tema:** 70 Climbing Stairs, 198 House Robber, 322 Coin Change, 300 Longest Increasing Subsequence, 55 Jump Game, 56 Merge Intervals, 739 Daily Temperatures, 1143 Longest Common Subsequence.

### Atividades de fixação — Tema 6

1. Para o 322 Coin Change, escreva em português: o estado, a transição e o caso base. Depois implemente.
2. Por que o guloso "sempre pegue a maior moeda" falha no Coin Change? Dê um exemplo de moedas e valor.
3. Resolva o 739 Daily Temperatures com monotonic stack.
4. Grave um vídeo de 15 minutos (só para você) resolvendo o 1 Two Sum em voz alta seguindo o roteiro 6.3. Assista e anote 3 coisas para melhorar.
5. Monte sua planilha de revisão: problema, padrão, data, "resolvi sozinho?" (sim/não). Revise os "não" após 3 e 7 dias.

## Projeto da etapa

**Biblioteca de estruturas de dados em Java**, com testes JUnit:

1. Implemente `MinhaArrayList<T>` (com crescimento), `MinhaPilha<T>`, `MinhaFila<T>` e `MeuHashMap<K, V>` (com encadeamento e redimensionamento).
2. Escreva testes JUnit 5 para cada uma, incluindo casos de borda.
3. Faça um benchmark simples comparando seu `MeuHashMap` com o `HashMap` do Java para 1 milhão de inserções.
4. Publique no GitHub com um README explicando o Big O de cada operação.

## Resumão

- Big O mede crescimento. Use as restrições do enunciado para saber qual complexidade buscar.
- HashMap troca espaço por tempo e resolve uma quantidade absurda de problemas.
- Padrões de array: hashing, two pointers, sliding window, prefix sum.
- BFS para menor caminho; DFS para explorar; sempre marque visitados em grafos.
- Backtracking: escolhe, explora, desfaz.
- DP: estado, transição, caso base, ordem.
- Na entrevista: fale o tempo todo, comece pela força bruta, termine com Big O.
