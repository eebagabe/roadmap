# Gabarito — LeetCode

Abra só depois de tentar. Para problemas do LeetCode, uma solução que passa nos testes com o Big O certo já é uma resposta correta, mesmo que diferente da daqui.

## Tema 1

1. (a) O(n): o laço interno roda sempre 10 vezes, constante. (b) O(log n): `i` dobra a cada passo. (c) O(n²): são n + (n−1) + … + 1 = n(n+1)/2 passos.
2. Não. 10¹⁰ operações levam dezenas de segundos; o limite costuma ser 1 a 2 segundos. Com n até 10⁵, busque O(n) ou O(n log n).
3. A cópia custa O(n), mas só acontece quando o array enche, e cada vez o tamanho cresce por um fator (1,5x). Somando o custo de todas as cópias e dividindo pelo número de `add`, dá uma constante por operação.
4. Quase nunca, porque `ArrayList` guarda tudo contínuo na memória e aproveita o cache da CPU, enquanto cada nó da `LinkedList` está espalhado pelo heap, e cada nó gasta memória extra com ponteiros. Mesmo inserções no meio costumam ser mais rápidas no `ArrayList` para tamanhos comuns. Use `ArrayDeque` quando precisar inserir/remover nas pontas.
5. Guarde, junto de cada valor, o mínimo até aquele ponto:
   ```java
   class MinStack {
       private final Deque<int[]> pilha = new ArrayDeque<>(); // {valor, minimoAteAqui}
       public void push(int val) {
           int min = pilha.isEmpty() ? val : Math.min(val, pilha.peek()[1]);
           pilha.push(new int[]{val, min});
       }
       public void pop() { pilha.pop(); }
       public int top() { return pilha.peek()[0]; }
       public int getMin() { return pilha.peek()[1]; }
   }
   ```

## Tema 2

1. Ordenando: `Arrays.sort(nums)` e compare vizinhos, O(n log n) de tempo e O(log n) de espaço (pilha do sort). Com `HashSet`: `if (!set.add(n)) return true;`, O(n) de tempo e O(n) de espaço.
2. Dois objetos "iguais" pelo `equals` terão `hashCode` diferentes (o padrão vem do endereço do objeto), caem em baldes diferentes, e o `get` não encontra a chave. Você terá "duplicatas" no map. Regra: sobrescreveu `equals`, sobrescreva `hashCode` (ou use `record`, que gera os dois).
3. A primeira fica balanceada, com altura 3:
   ```
           50
         /    \
       30      70
      /  \    /  \
     20  40  60  80
   ```
   A segunda vira uma linha (1 → 2 → 3 → 4 → 5), com altura 5. Busca vira O(n). Por isso existem árvores autobalanceadas (AVL, rubro-negra).
4. ```java
   int[] topKFrequent(int[] nums, int k) {
       Map<Integer, Integer> freq = new HashMap<>();
       for (int n : nums) freq.merge(n, 1, Integer::sum);
       PriorityQueue<Integer> heap = new PriorityQueue<>(Comparator.comparingInt(freq::get));
       for (int n : freq.keySet()) {
           heap.offer(n);
           if (heap.size() > k) heap.poll();
       }
       return heap.stream().mapToInt(Integer::intValue).toArray();
   }
   ```
   O(n log k). Existe solução O(n) com bucket sort (índice = frequência), ótima para mencionar.
5. `A: [B, C]`, `B: [A, D]`, `C: [A, D]`, `D: [B, C, E]`, `E: [D]`.

## Tema 3

1. ⌈log₂(10⁶)⌉ = 20 comparações. Para 10⁹, 30. É por isso que O(log n) é tão bom.
2. Exemplo com Lomuto:
   ```java
   void quickSort(int[] a, int lo, int hi) {
       if (lo >= hi) return;
       int p = particionar(a, lo, hi);
       quickSort(a, lo, p - 1);
       quickSort(a, p + 1, hi);
   }
   int particionar(int[] a, int lo, int hi) {
       int pivo = a[hi], i = lo;
       for (int j = lo; j < hi; j++)
           if (a[j] < pivo) { int t = a[i]; a[i] = a[j]; a[j] = t; i++; }
       int t = a[i]; a[i] = a[hi]; a[hi] = t;
       return i;
   }
   ```
   Cai para O(n²) quando o pivô é sempre o menor ou o maior (por exemplo, array já ordenado com pivô no último). Evite escolhendo pivô aleatório ou a mediana de três.
3. Porque a etapa de `merge` junta duas metades ordenadas num array auxiliar; não dá para intercalar no lugar de forma simples e eficiente.
4. Use a busca binária do Tema 3 e, em vez de `return -1`, `return lo`. Quando o laço termina, `lo` é a primeira posição cujo valor é maior que o alvo, ou seja, onde ele deveria ser inserido.
5. ```java
   double myPow(double x, long n) {
       if (n < 0) return 1 / myPow(x, -n);
       if (n == 0) return 1;
       double metade = myPow(x, n / 2);
       return n % 2 == 0 ? metade * metade : metade * metade * x;
   }
   ```
   Use `long` para `n` porque `-Integer.MIN_VALUE` estoura `int`.

## Tema 4

1. (a) Sliding window; (b) two pointers; (c) hashing (HashMap de frequência); (d) prefix sum.
2. ```java
   int maxProfit(int[] prices) {
       int menor = Integer.MAX_VALUE, lucro = 0;
       for (int p : prices) {
           menor = Math.min(menor, p);
           lucro = Math.max(lucro, p - menor);
       }
       return lucro;
   }
   ```
3. ```java
   int[] twoSum(int[] numbers, int target) {
       int i = 0, j = numbers.length - 1;
       while (i < j) {
           int soma = numbers[i] + numbers[j];
           if (soma == target) return new int[]{i + 1, j + 1};
           if (soma < target) i++; else j--;
       }
       return new int[0];
   }
   ```
   Funciona porque, com o array ordenado, se a soma é pequena demais, a única forma de aumentar é mover `i` para a direita; se é grande demais, mover `j` para a esquerda. Nenhum par válido é descartado.
4. Duas passadas: produto de tudo à esquerda e de tudo à direita.
   ```java
   int[] productExceptSelf(int[] nums) {
       int n = nums.length;
       int[] res = new int[n];
       res[0] = 1;
       for (int i = 1; i < n; i++) res[i] = res[i - 1] * nums[i - 1];
       int direita = 1;
       for (int i = n - 1; i >= 0; i--) {
           res[i] *= direita;
           direita *= nums[i];
       }
       return res;
   }
   ```
5. `fim` anda n vezes no total e `ini` só anda para frente, também no máximo n vezes. São no máximo 2n movimentos: O(n). Não é um laço dentro de outro que recomeça do zero.

## Tema 5

1. **BFS.** Cada movimento tem o mesmo "custo", e a BFS visita por camadas: a primeira vez que alcança o destino é com o menor número de movimentos. A DFS acharia *um* caminho, não necessariamente o menor.
2. ```java
   TreeNode invertTree(TreeNode root) {
       if (root == null) return null;
       TreeNode tmp = root.left;
       root.left = invertTree(root.right);
       root.right = invertTree(tmp);
       return root;
   }
   ```
   Tempo O(n), espaço O(h), onde h é a altura (pilha da recursão): O(log n) balanceada, O(n) no pior caso.
3. Porque `atual` é a mesma lista sendo modificada o tempo todo. Sem a cópia, todas as posições de `res` apontariam para o mesmo objeto, que no fim estaria vazio.
4. ```java
   boolean canFinish(int numCourses, int[][] prerequisites) {
       List<List<Integer>> grafo = new ArrayList<>();
       for (int i = 0; i < numCourses; i++) grafo.add(new ArrayList<>());
       int[] grau = new int[numCourses];
       for (int[] p : prerequisites) { grafo.get(p[1]).add(p[0]); grau[p[0]]++; }
       Deque<Integer> fila = new ArrayDeque<>();
       for (int i = 0; i < numCourses; i++) if (grau[i] == 0) fila.offer(i);
       int feitos = 0;
       while (!fila.isEmpty()) {
           int c = fila.poll();
           feitos++;
           for (int prox : grafo.get(c)) if (--grau[prox] == 0) fila.offer(prox);
       }
       return feitos == numCourses; // se sobrou curso, há ciclo
   }
   ```
5. A regra da BST vale para a **subárvore inteira**, não só para os filhos. Exemplo: raiz 5, filho direito 6, e o filho esquerdo do 6 é 3. Cada nó respeita os filhos diretos (3 < 6), mas 3 está à direita de 5, o que é inválido. Solução: passe um intervalo `(min, max)` permitido na recursão.

## Tema 6

1. Estado: `dp[v]` = menor número de moedas para formar o valor `v`. Transição: `dp[v] = min(dp[v - moeda] + 1)` para cada moeda ≤ v. Caso base: `dp[0] = 0`; o resto começa como "infinito".
   ```java
   int coinChange(int[] coins, int amount) {
       int[] dp = new int[amount + 1];
       Arrays.fill(dp, amount + 1); // "infinito"
       dp[0] = 0;
       for (int v = 1; v <= amount; v++)
           for (int m : coins)
               if (m <= v) dp[v] = Math.min(dp[v], dp[v - m] + 1);
       return dp[amount] > amount ? -1 : dp[amount];
   }
   ```
2. Moedas {1, 3, 4} e valor 6. O guloso pega 4 + 1 + 1 = 3 moedas; o ótimo é 3 + 3 = 2 moedas.
3. ```java
   int[] dailyTemperatures(int[] t) {
       int[] res = new int[t.length];
       Deque<Integer> pilha = new ArrayDeque<>(); // índices com temperaturas decrescentes
       for (int i = 0; i < t.length; i++) {
           while (!pilha.isEmpty() && t[i] > t[pilha.peek()]) {
               int j = pilha.pop();
               res[j] = i - j;
           }
           pilha.push(i);
       }
       return res;
   }
   ```
4. Resposta pessoal. Pontos comuns: começar a codar antes de confirmar o entendimento, ficar em silêncio, esquecer de testar casos de borda, não falar o Big O.
5. Resposta pessoal. O importante é revisar os que você não conseguiu sozinho: é a repetição espaçada que fixa os padrões.

## Projeto da etapa

Pontos que um revisor olharia no seu `MeuHashMap`:

- Índice calculado com `Math.floorMod(chave.hashCode(), capacidade)` (o `hashCode` pode ser negativo).
- Tratamento de chave `null` (ou documentar que não aceita).
- Redimensionamento ao passar do load factor (ex.: 0,75), **reinserindo** todos os elementos, porque o índice depende da capacidade.
- `put` de chave existente substitui o valor e não aumenta o `size`.
- Testes para colisão (duas chaves com o mesmo `hashCode`), remoção e redimensionamento.
