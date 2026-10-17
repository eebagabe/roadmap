# Estruturas de Dados: Apostila Prática

Roadmap Ciência da Computação · Semanas 47 a 52

## Comece por aqui

Um algoritmo é tão rápido quanto a estrutura de dados que ele usa permite. Procurar um nome numa lista desordenada de 1 bilhão de itens leva segundos; numa tabela hash, microssegundos. Esta etapa é o coração das entrevistas técnicas e de toda a computação: aprender a **analisar** custos com rigor e conhecer as estruturas clássicas por dentro, a ponto de implementá-las do zero e saber quando usar cada uma. É o conteúdo da primeira metade do MIT 6.006/6.1210 e do CES-11 do ITA.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CES-11 Algoritmos e Estruturas de Dados |
| MIT | 6.1210 (antiga 6.006) Introduction to Algorithms, primeira metade |
| Harvard | CS 1240 (antiga CS 124) Data Structures and Algorithms, partes |
| Oxford | Algorithms and Data Structures (2º ano) |

### Como esta apostila funciona

1. Implemente **cada** estrutura do zero, em C ou Java (ou Python, para começar), com testes. Ler sobre uma árvore rubro-negra é muito diferente de implementar uma.
2. Para cada operação, pergunte: qual o custo no pior caso? No caso médio? Amortizado?
3. Use o site **VisuAlgo** para ver as estruturas em ação.
4. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** bug numa estrutura com ponteiros? **Desenhe** no papel, com caixas e setas, o estado antes e depois da operação. Depois escreva o código que transforma um desenho no outro, uma seta de cada vez.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 47 | Tema 1: Análise assintótica |
| 48 | Tema 2: Estruturas lineares |
| 49 | Tema 3: Tabelas hash |
| 50 | Tema 4: Árvores e heaps |
| 51 | Tema 5: Ordenação |
| 52 | Tema 6: Grafos e union-find + projeto |

## Tema 1: Análise assintótica

**Objetivo:** descrever o custo de algoritmos com precisão matemática.

### 1.1 Notações O, Ω e Θ

Medimos o custo T(n) (operações, em função do tamanho n da entrada) e comparamos **taxas de crescimento**, ignorando constantes e termos menores.

| Notação | Definição | Lê-se |
|---|---|---|
| T(n) = O(f(n)) | existem c > 0 e n₀ com T(n) ≤ c f(n) para todo n ≥ n₀ | cresce **no máximo** como f |
| T(n) = Ω(f(n)) | existem c > 0 e n₀ com T(n) ≥ c f(n) para todo n ≥ n₀ | cresce **no mínimo** como f |
| T(n) = Θ(f(n)) | O e Ω ao mesmo tempo | cresce **exatamente** como f |

Exemplo: T(n) = 3n² + 10n + 7. Para n ≥ 1, T(n) ≤ 3n² + 10n² + 7n² = 20n², então T = O(n²) (c = 20, n₀ = 1). E T(n) ≥ 3n², então T = Ω(n²). Logo **T = Θ(n²)**.

Hierarquia: 1 < log n < √n < n < n log n < n² < n³ < 2ⁿ < n!. Bases de logaritmo não importam (log₂ n e log₁₀ n diferem por uma constante).

> **Cuidado! Cai na entrevista:** Big O é um **limite superior**. Dizer que a busca binária é O(n²) é tecnicamente verdade, mas inútil. No dia a dia, "O" costuma ser usado querendo dizer Θ; em provas, use cada um com o significado certo. E distinga **pior caso**, **caso médio** e **melhor caso**: são funções diferentes, cada uma com seu Θ.

### 1.2 Análise de laços

- Laços em sequência: **somam** os custos.
- Laços aninhados: o custo do interno **multiplicado** pelo número de voltas do externo (cuidado quando o interno depende do externo: aí é uma soma).
- Laço onde a variável multiplica ou divide por constante: **log n** voltas.

```python
for i in range(n):           # n voltas
    j = 1
    while j < i:             # log i voltas
        j *= 2
# total: Σ log i = log(n!) = Θ(n log n)
```

**Modelo de custo:** contamos operações "básicas" de custo constante (aritmética, comparação, acesso a array). Cuidado com operações escondidas: em Python, `x in lista`, `lista.insert(0, x)`, `s1 + s2` com strings e fatiar (`xs[1:]`) custam O(n).

### 1.3 Recorrências

Algoritmos recursivos têm custo descrito por **recorrências**:

| Algoritmo | Recorrência | Solução |
|---|---|---|
| Busca binária | T(n) = T(n/2) + O(1) | Θ(log n) |
| Percorrer árvore balanceada | T(n) = 2T(n/2) + O(1) | Θ(n) |
| Merge sort | T(n) = 2T(n/2) + Θ(n) | Θ(n log n) |
| Fatorial recursivo | T(n) = T(n − 1) + O(1) | Θ(n) |
| Seleção recursiva | T(n) = T(n − 1) + Θ(n) | Θ(n²) |
| Fibonacci ingênuo | T(n) = T(n − 1) + T(n − 2) + O(1) | Θ(φⁿ) |

**Método da árvore de recursão:** desenhe as chamadas; em cada nível, some o trabalho; some os níveis. Merge sort: o nível k tem 2ᵏ subproblemas de tamanho n/2ᵏ, cada um com trabalho n/2ᵏ: total n por nível. Há log₂ n níveis: **n log n**.

**Método da substituição:** chute a solução e prove por indução.

### 1.4 Teorema mestre

Para recorrências da forma **T(n) = a T(n/b) + f(n)** (a subproblemas de tamanho n/b, mais f(n) para dividir e combinar), compare f(n) com **n^(log_b a)** (o número de folhas da árvore de recursão):

| Caso | Condição | Solução | Quem domina |
|---|---|---|---|
| 1 | f(n) = O(n^(log_b a − ε)) | Θ(n^(log_b a)) | As folhas |
| 2 | f(n) = Θ(n^(log_b a)) | Θ(n^(log_b a) log n) | Todos os níveis igualmente |
| 3 | f(n) = Ω(n^(log_b a + ε)) e regularidade | Θ(f(n)) | A raiz |

Exemplos:

- Merge sort: a = 2, b = 2, n^(log₂ 2) = n, f = n: **caso 2**, Θ(n log n).
- Busca binária: a = 1, b = 2, n⁰ = 1, f = 1: **caso 2**, Θ(log n).
- Karatsuba (multiplicação, em Algoritmos): a = 3, b = 2, n^(log₂ 3) ≈ n^1,585, f = n: **caso 1**, Θ(n^1,585).
- T(n) = 2T(n/2) + n²: f domina, **caso 3**, Θ(n²).

### Atividades de fixação do Tema 1

1. Prove pela definição: (a) 5n³ + 2n = Θ(n³); (b) n² ≠ O(n); (c) log(n!) = Θ(n log n) (dica: n! ≤ nⁿ e n! ≥ (n/2)^(n/2)).
2. Ordene por crescimento: n log n, 2^(log₂ n), n^1,5, (log n)², 2^(n/2), √n log n, n!, 4ⁿ, n^(log n).
3. Dê o Θ do custo:
   ```python
   i = n
   while i > 0:
       for j in range(i):
           x += 1
       i //= 2
   ```
4. Resolva pelo teorema mestre: (a) T(n) = 4T(n/2) + n; (b) T(n) = 4T(n/2) + n²; (c) T(n) = 4T(n/2) + n³; (d) T(n) = 7T(n/2) + n² (algoritmo de Strassen).
5. Resolva T(n) = T(n/3) + T(2n/3) + n com a árvore de recursão (o teorema mestre não se aplica).
6. Por que este código Python é O(n²) e não O(n)? Corrija.
   ```python
   resultado = ""
   for palavra in palavras:
       resultado += palavra
   ```

## Tema 2: Estruturas lineares

**Objetivo:** implementar listas, pilhas, filas e arrays dinâmicos, e entender análise amortizada.

### 2.1 Listas ligadas

Um **array** guarda elementos lado a lado na memória: acesso por índice em O(1), mas inserir no meio desloca todos os seguintes (O(n)). Uma **lista ligada** guarda cada elemento num nó com um ponteiro para o próximo: inserir e remover (dado o nó) em O(1), mas achar o i-ésimo exige percorrer (O(n)).

```c
typedef struct No {
    int valor;
    struct No *prox;
} No;

No *insere_inicio(No *cabeca, int v) {
    No *novo = malloc(sizeof(No));
    novo->valor = v;
    novo->prox = cabeca;
    return novo;
}

No *inverte(No *cabeca) {              // pergunta clássica de entrevista
    No *anterior = NULL;
    while (cabeca) {
        No *proximo = cabeca->prox;
        cabeca->prox = anterior;
        anterior = cabeca;
        cabeca = proximo;
    }
    return anterior;
}
```

Variações: **duplamente ligada** (ponteiro para trás também: remover dado o nó em O(1), percorrer nos dois sentidos), **circular**, e com **nó sentinela** (um nó fictício no início que elimina casos especiais de lista vazia).

| Operação | Array | Lista ligada |
|---|---|---|
| Acesso ao i-ésimo | O(1) | O(n) |
| Inserir/remover no início | O(n) | O(1) |
| Inserir/remover no fim | O(1) amortizado | O(1) com ponteiro de cauda |
| Inserir no meio (dada a posição) | O(n) | O(1) |
| Localidade de cache | Ótima | Ruim |

Na prática, arrays costumam ganhar mesmo em casos onde a teoria favorece a lista, por causa do **cache** (elementos contíguos são carregados juntos; você verá em Arquitetura).

### 2.2 Pilhas

**Pilha** (LIFO, último a entrar, primeiro a sair): `empilha`, `desempilha`, `topo`, todas O(1). Implementação com array ou lista ligada.

Usos: a pilha de chamadas de funções, desfazer (Ctrl+Z), navegação "voltar", avaliação de expressões, verificar parênteses balanceados, DFS iterativa, retrocesso (*backtracking*).

```python
def balanceado(s):
    pares = {")": "(", "]": "[", "}": "{"}
    pilha = []
    for c in s:
        if c in "([{":
            pilha.append(c)
        elif c in pares:
            if not pilha or pilha.pop() != pares[c]:
                return False
    return not pilha
```

### 2.3 Filas e deques

**Fila** (FIFO, primeiro a entrar, primeiro a sair): `enfileira` no fim, `desenfileira` no início, O(1). Implementação com lista ligada (com ponteiro de cauda) ou com **array circular** (índices de início e fim que "dão a volta" com `% capacidade`).

**Deque** (fila de duas pontas): insere e remove nas duas pontas em O(1). Em Python, `collections.deque`.

> **Cuidado! Cai na prática:** em Python, `lista.pop(0)` é O(n) (desloca todos os elementos). Para filas, use `collections.deque` e `popleft()`.

Usos: BFS, filas de impressão e de tarefas, buffers de rede, escalonamento de processos. O deque permite o padrão **janela deslizante com máximo** em O(n) total (mantenha no deque índices com valores decrescentes).

### 2.4 Array dinâmico

Um **array dinâmico** (`list` do Python, `ArrayList` do Java, `vector` do C++) é um array que cresce: quando enche, aloca um maior e copia tudo.

A pergunta: **quanto** aumentar? Se aumentar de 1 em 1, inserir n elementos custa 1 + 2 + ... + n = Θ(n²) em cópias. Se **dobrar** a capacidade, as cópias custam 1 + 2 + 4 + ... + n < 2n: inserir n elementos custa **O(n) no total**, ou **O(1) amortizado** por inserção.

### 2.5 Análise amortizada

A **análise amortizada** dá o custo médio por operação **numa sequência de operações no pior caso** (não é média sobre entradas aleatórias: é garantia).

Três métodos:

1. **Agregado:** calcule o custo total de n operações e divida por n. (Foi o que fizemos acima: < 3n para n inserções, então O(1) cada.)
2. **Contábil (banqueiro):** cobre de cada operação um pouco a mais do que ela custa e guarde o excesso como "crédito" para pagar as operações caras. No array dinâmico, cobre 3 por inserção: 1 paga a escrita, 2 ficam guardados; quando o array dobra de k para 2k, as k/2 inserções desde a última duplicação acumularam k créditos, que pagam a cópia dos k elementos.
3. **Potencial:** defina uma função Φ do estado da estrutura (a "energia armazenada"); custo amortizado = custo real + ΔΦ. Para o array dinâmico, Φ = 2 × tamanho − capacidade.

Outro exemplo clássico: uma **fila com duas pilhas** (entrada e saída; ao desenfileirar com a saída vazia, despeje toda a entrada nela). Cada elemento é movido no máximo uma vez de uma pilha para a outra: O(1) amortizado.

> **Cuidado! Cai na entrevista:** se o array também **encolher** pela metade quando ficar meio cheio, uma sequência alternada de insere/remove no limite causa cópias a cada operação: Θ(n) cada. A solução é encolher só quando ficar com **um quarto** da capacidade.

### Atividades de fixação do Tema 2

1. Implemente uma lista duplamente ligada com sentinela e as operações: inserir no início e no fim, remover um nó, buscar, imprimir de trás para frente.
2. Detecte se uma lista ligada tem ciclo usando O(1) de memória (algoritmo da lebre e da tartaruga de Floyd). Por que funciona?
3. Implemente uma fila com array circular de capacidade fixa. Como distinguir fila cheia de fila vazia?
4. Implemente uma fila com duas pilhas e prove pelo método contábil que cada operação é O(1) amortizada.
5. Avalie uma expressão em notação polonesa reversa (`"3 4 + 2 *"` → 14) com uma pilha.
6. Dado um array, para cada elemento encontre o próximo elemento maior à direita, em O(n) total (dica: pilha monotônica).
7. Um array dinâmico cresce multiplicando a capacidade por 1,5 em vez de 2. A inserção continua O(1) amortizada? Qual o custo total de cópias para n inserções?

## Tema 3: Tabelas hash

**Objetivo:** entender como dicionários conseguem busca em O(1) e o que pode dar errado.

### 3.1 Funções de hash

Uma **tabela hash** guarda pares chave-valor num array de m posições (**baldes**). A **função de hash** h transforma a chave num índice: h(chave) ∈ {0, ..., m − 1}. Se h espalha bem as chaves, cada balde tem poucas e a busca é O(1) em média.

Propriedades desejadas: **determinística** (mesma chave, mesmo índice), **rápida** e **uniforme** (espalha bem, mesmo com chaves parecidas).

Hash de inteiros: h(k) = k mod m (com m primo, longe de potências de 2). Hash de strings: trate como um número em base B:

```python
def hash_str(s, m, B=31):
    h = 0
    for c in s:
        h = (h * B + ord(c)) % m
    return h
```

(Esse é essencialmente o `String.hashCode` do Java.)

**Hash de tabela** não é **hash criptográfico**. Tabelas precisam de velocidade; criptografia (SHA-256) precisa que seja inviável achar colisões ou inverter, e é bem mais lenta (Segurança).

### 3.2 Colisões

Pelo princípio das casas dos pombos, colisões (duas chaves no mesmo balde) são inevitáveis. E pelo paradoxo do aniversário, aparecem cedo: com m = 1 milhão de baldes, a primeira colisão é esperada com cerca de 1.250 chaves.

**Encadeamento separado:** cada balde guarda uma lista com as chaves que caíram nele.

- Com n chaves e m baldes, o **fator de carga** é α = n/m; o tamanho médio de cada lista é α.
- Busca: O(1 + α) em média. Mantendo α ≤ 1 (redimensionando, como o array dinâmico), **O(1) em média**.
- Redimensionar: quando α passa de um limite (0,75 no Java), dobre m e reinsira tudo (**rehash**). Amortizado, continua O(1).

O Java troca listas longas por árvores balanceadas (desde o Java 8), limitando o pior caso de um balde a O(log n).

### 3.3 Endereçamento aberto

Tudo fica no próprio array; numa colisão, procura-se outra posição seguindo uma **sequência de sondagem**:

- **Linear:** h(k), h(k) + 1, h(k) + 2, ... Simples e ótima para o cache, mas forma **aglomerados** (blocos ocupados que crescem).
- **Quadrática:** h(k) + 1², h(k) + 2², ... Reduz aglomerados.
- **Hash duplo:** h₁(k) + i h₂(k). A melhor distribuição.

Custos sobem rapidamente com α: com sondagem linear, uma busca sem sucesso faz cerca de ½(1 + 1/(1 − α)²) sondagens. Com α = 0,5, ~2,5; com α = 0,9, ~50. Mantenha α ≤ 0,7.

Remoção é delicada: apagar uma chave quebra a sequência de sondagem de outras. Use uma marca de "removido" (*tombstone*).

O `dict` do Python usa endereçamento aberto com uma sondagem pseudoaleatória.

### 3.4 Hashing universal

Para qualquer função de hash fixa, existe um conjunto de chaves que cai todo no mesmo balde. Se um adversário conhece a função, ele pode derrubar um servidor mandando chaves que colidem (**ataque de negação de serviço por colisão de hash**, que afetou várias linguagens em 2011).

**Hashing universal:** escolha a função **aleatoriamente** de uma família H, ao iniciar o programa. H é universal se, para quaisquer duas chaves diferentes x e y, P(h(x) = h(y)) ≤ 1/m. Resultado: para **qualquer** conjunto de chaves, o número esperado de colisões com uma chave é ≤ n/m.

Família clássica para inteiros: hₐ,ᵦ(k) = ((a k + b) mod p) mod m, com p primo maior que todas as chaves e a, b aleatórios (a ≠ 0).

Por isso Python, Java e outras linguagens hoje **aleatorizam** o hash de strings a cada execução (rode `hash("abc")` duas vezes em Python, em processos diferentes).

### Atividades de fixação do Tema 3

1. Implemente uma tabela hash com encadeamento separado e redimensionamento (dobra quando α > 0,75), com `insere`, `busca` e `remove`.
2. Insira as chaves 10, 22, 31, 4, 15, 28, 17, 88, 59 numa tabela de tamanho 11 com h(k) = k mod 11, usando sondagem linear. Desenhe a tabela final. Quantas sondagens a busca por 59 faz?
3. Por que m = 2ᵏ é uma péssima escolha para h(k) = k mod m quando as chaves são, por exemplo, endereços de memória alinhados a 8 bytes?
4. Resolva em O(n) com tabelas hash: (a) o primeiro caractere que não se repete numa string; (b) os dois números que somam um alvo; (c) agrupar anagramas; (d) o maior intervalo de números consecutivos num array desordenado.
5. Meça a quantidade média de sondagens de uma busca sem sucesso com sondagem linear para α = 0,5; 0,7; 0,9; 0,95 e compare com a fórmula.
6. Por que objetos mutáveis não devem ser chaves de um dicionário? (Lembre do Tema 2 de Programação OO.)

## Tema 4: Árvores e heaps

**Objetivo:** usar árvores para manter dados ordenados com operações em O(log n), e heaps para prioridades.

### 4.1 Árvores binárias de busca

Uma **árvore binária de busca** (BST) guarda chaves em nós com até dois filhos, respeitando a **propriedade de busca**: tudo na subárvore esquerda é **menor** que o nó; tudo na direita, **maior**.

```python
class No:
    def __init__(self, chave):
        self.chave, self.esq, self.dir = chave, None, None

def busca(no, k):
    while no and no.chave != k:
        no = no.esq if k < no.chave else no.dir
    return no

def insere(no, k):
    if no is None:
        return No(k)
    if k < no.chave:
        no.esq = insere(no.esq, k)
    elif k > no.chave:
        no.dir = insere(no.dir, k)
    return no
```

- Percurso **em ordem** (esquerda, nó, direita) lista as chaves **ordenadas**.
- Mínimo: desça sempre à esquerda. Sucessor: o mínimo da subárvore direita (ou subindo).
- **Remoção** com dois filhos: troque a chave pelo sucessor e remova o sucessor (que tem no máximo um filho).

Todas as operações custam O(h), onde h é a **altura**. Com chaves em ordem aleatória, h ≈ 2,99 log₂ n em média. Mas inserindo chaves **já ordenadas**, a árvore vira uma lista: h = n, tudo O(n). Daí a necessidade de **balancear**.

Vantagem sobre tabelas hash: a BST mantém **ordem**. Ela responde "qual o menor ≥ x", "liste tudo entre a e b", "qual o k-ésimo menor", que uma tabela hash não sabe.

### 4.2 Árvores AVL

Uma **AVL** (Adelson-Velsky e Landis, 1962) mantém, em todo nó, **|altura(esq) − altura(dir)| ≤ 1**. Isso garante altura ≤ 1,44 log₂ n.

Depois de inserir ou remover, sobe-se até a raiz recalculando alturas; onde o balanceamento passar de 1, aplica-se uma **rotação**:

```
    y                x
   / \     →        / \
  x   C   (rotação  A   y
 / \      à direita)   / \
A   B                 B   C
```

A rotação preserva a ordem (A < x < B < y < C) e muda as alturas. Há quatro casos: esquerda-esquerda (rotação simples à direita), direita-direita (simples à esquerda), esquerda-direita e direita-esquerda (rotações duplas).

### 4.3 Árvores rubro-negras

Uma **árvore rubro-negra** pinta cada nó de vermelho ou preto com as regras:

1. A raiz é preta; as folhas nulas são pretas.
2. Um nó vermelho não tem filho vermelho.
3. Todo caminho de um nó até as folhas abaixo dele tem o **mesmo número de nós pretos**.

Consequência: o caminho mais longo tem no máximo o dobro do mais curto, então h ≤ 2 log₂(n + 1). É menos rigidamente balanceada que a AVL (buscas um pouco mais lentas), mas faz **menos rotações** em inserções e remoções (no máximo 2 por inserção, 3 por remoção).

É a árvore do `TreeMap` do Java, do `std::map` do C++ e do escalonador CFS do Linux. Uma forma mais simples de implementar a mesma ideia é a **left-leaning red-black tree** de Sedgewick, equivalente às árvores 2-3.

Em bancos de dados e sistemas de arquivos, usam-se **B-trees** (nós com centenas de filhos, para minimizar acessos a disco), que você verá em Bancos de Dados.

### 4.4 Heaps

Um **heap binário** (de mínimo) é uma árvore binária **completa** (todos os níveis cheios, exceto talvez o último, preenchido da esquerda para a direita) em que **todo nó é menor ou igual aos filhos**. O mínimo está na raiz.

Truque: por ser completa, cabe num **array** sem ponteiros. Para o nó na posição i (começando em 0): filhos em 2i + 1 e 2i + 2; pai em (i − 1)//2.

- **Inserir:** coloque no fim e **suba** trocando com o pai enquanto for menor. O(log n).
- **Extrair o mínimo:** troque a raiz com o último, remova o último e **desça** a nova raiz trocando com o menor filho. O(log n).
- **Ver o mínimo:** O(1).
- **Construir** a partir de um array: aplique "descer" de baixo para cima, dos nós internos até a raiz. Custa **O(n)** (e não O(n log n)), porque a maioria dos nós está perto das folhas e desce pouco: Σ (n/2ʰ⁺¹) × h = O(n).

```python
def desce(a, i, n):
    while True:
        menor = i
        for f in (2 * i + 1, 2 * i + 2):
            if f < n and a[f] < a[menor]:
                menor = f
        if menor == i:
            return
        a[i], a[menor] = a[menor], a[i]
        i = menor
```

### 4.5 Filas de prioridade

Uma **fila de prioridade** é o TAD "insere com prioridade; extrai o de maior (ou menor) prioridade". O heap é a implementação padrão. Em Python, `heapq`; em Java, `PriorityQueue`.

Usos: escalonador de processos, simulação de eventos (próximo evento no tempo), Dijkstra e Prim (Algoritmos), compressão de Huffman, "os k maiores de um fluxo" (heap de mínimo de tamanho k: O(n log k)), mediana de um fluxo (dois heaps).

```python
import heapq
def k_maiores(fluxo, k):
    h = []
    for x in fluxo:
        if len(h) < k:
            heapq.heappush(h, x)
        elif x > h[0]:
            heapq.heapreplace(h, x)
    return sorted(h, reverse=True)
```

### Atividades de fixação do Tema 4

1. Insira 50, 30, 70, 20, 40, 60, 80, 35 numa BST e desenhe. Remova 30 e redesenhe. Liste em ordem, pré-ordem e pós-ordem.
2. Insira 1, 2, 3, 4, 5, 6, 7 numa AVL, desenhando a árvore após cada rotação.
3. Escreva uma função que verifica se uma árvore binária é uma BST válida. (Cuidado: comparar só com os filhos imediatos não basta. Por quê?)
4. Qual a altura mínima e máxima de uma árvore rubro-negra com 1 milhão de chaves? E de uma AVL?
5. Construa um heap de mínimo a partir de [9, 4, 7, 1, 8, 2, 6, 3] pelo método O(n), mostrando o array após cada "descer".
6. Implemente a mediana de um fluxo de números com dois heaps, com inserção O(log n) e consulta O(1).
7. Junte k listas ordenadas, com n elementos no total, em O(n log k).

## Tema 5: Ordenação

**Objetivo:** dominar os algoritmos de ordenação eficientes e o limite teórico da ordenação por comparação.

### 5.1 Merge sort

Dividir e conquistar: divida ao meio, ordene cada metade recursivamente, **intercale** (*merge*) as duas metades ordenadas.

```python
def merge_sort(xs):
    if len(xs) <= 1:
        return xs
    meio = len(xs) // 2
    a, b = merge_sort(xs[:meio]), merge_sort(xs[meio:])
    resultado, i, j = [], 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:              # <= mantém a estabilidade
            resultado.append(a[i]); i += 1
        else:
            resultado.append(b[j]); j += 1
    return resultado + a[i:] + b[j:]
```

- Θ(n log n) **sempre** (pior, médio e melhor caso).
- **Estável:** elementos iguais mantêm a ordem relativa original (importante ao ordenar por vários critérios em sequência).
- Usa Θ(n) de memória extra.
- Ótimo para listas ligadas e para ordenação **externa** (dados maiores que a memória, em disco): intercalar blocos ordenados lendo sequencialmente.

### 5.2 Quick sort

Escolha um **pivô**, **particione** (menores à esquerda, maiores à direita) e ordene cada lado recursivamente.

```python
import random
def quick_sort(a, lo=0, hi=None):
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return
    p = random.randint(lo, hi)
    a[p], a[hi] = a[hi], a[p]
    pivo, i = a[hi], lo
    for j in range(lo, hi):              # partição de Lomuto
        if a[j] < pivo:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    quick_sort(a, lo, i - 1)
    quick_sort(a, i + 1, hi)
```

- Pior caso Θ(n²) (pivô sempre o menor ou o maior), mas com pivô **aleatório**, Θ(n log n) **esperado** para qualquer entrada (~1,39 n log₂ n comparações).
- **No lugar** (memória O(log n) para a recursão, recursando primeiro no lado menor).
- Na prática, o mais rápido: laço interno simples e ótima localidade de cache.
- Não é estável.
- Muitos elementos iguais degradam a partição simples: use a **partição em três** (menores, iguais, maiores), de Dijkstra.

O **introsort** (usado no `std::sort` do C++) começa com quick sort e troca para heap sort se a recursão ficar funda demais, garantindo O(n log n) no pior caso.

### 5.3 Heap sort

Construa um heap de máximo (O(n)) e extraia o máximo n vezes, colocando-o no fim do array.

- Θ(n log n) no pior caso, **no lugar**, memória O(1).
- Não é estável e tem localidade de cache ruim (pula pelo array), por isso costuma perder para o quick sort na prática.

| Algoritmo | Pior caso | Médio | Memória extra | Estável |
|---|---|---|---|---|
| Inserção | n² | n² | 1 | Sim |
| Merge sort | n log n | n log n | n | Sim |
| Quick sort (aleatório) | n² | n log n | log n | Não |
| Heap sort | n log n | n log n | 1 | Não |
| Timsort (Python, Java para objetos) | n log n | n log n | n | Sim |

### 5.4 Limite inferior da comparação

**Teorema:** todo algoritmo de ordenação **baseado em comparações** faz Ω(n log n) comparações no pior caso.

*Prova (árvore de decisão).* Qualquer algoritmo de comparação pode ser visto como uma árvore binária: cada nó interno é uma comparação ("aᵢ < aⱼ?"), cada folha é uma ordem final. Para ordenar corretamente, a árvore precisa de pelo menos uma folha para cada uma das **n!** permutações da entrada. Uma árvore binária de altura h tem no máximo 2ʰ folhas, então 2ʰ ≥ n!, ou h ≥ log₂(n!) = Θ(n log n) (aproximação de Stirling). A altura é o número de comparações no pior caso. ∎

Logo merge sort e heap sort são **ótimos** entre os algoritmos de comparação. Para fazer melhor, é preciso usar mais do que comparações.

### 5.5 Counting sort e radix sort

Se as chaves são **inteiros num intervalo pequeno** [0, k), dá para ordenar sem comparar:

**Counting sort:** conte quantas vezes cada valor aparece, calcule as posições finais com somas acumuladas e distribua. **Θ(n + k)**, estável.

```python
def counting_sort(xs, k, chave=lambda x: x):
    contagem = [0] * (k + 1)
    for x in xs:
        contagem[chave(x) + 1] += 1
    for i in range(k):
        contagem[i + 1] += contagem[i]       # contagem[v] = posição inicial do valor v
    saida = [None] * len(xs)
    for x in xs:
        saida[contagem[chave(x)]] = x
        contagem[chave(x)] += 1
    return saida
```

**Radix sort:** ordene por dígito, do **menos** significativo para o mais significativo, usando um algoritmo **estável** (counting sort) em cada passada. Para n números de d dígitos em base b: **Θ(d(n + b))**. Números de 32 bits com base 2⁸ = 256: 4 passadas lineares.

Não contradizem o limite Ω(n log n): usam os valores das chaves como índices, não só comparações.

### Atividades de fixação do Tema 5

1. Simule o merge sort em [38, 27, 43, 3, 9, 82, 10], mostrando cada intercalação.
2. Simule a partição de Lomuto em [5, 2, 9, 1, 6, 5] com pivô 5 (o último). Por que tantos elementos iguais ao pivô são um problema? Implemente a partição em três.
3. Mostre uma entrada que faz o quick sort com pivô "último elemento" ter custo Θ(n²). Quantas comparações ele faz com n = 1.000?
4. Ordenar 1 bilhão de números de 32 bits: qual algoritmo você usaria e por quê? E se fossem strings de tamanho variável? E se não coubessem na memória?
5. Encontre o k-ésimo menor elemento em O(n) esperado com o **quickselect** (como o quick sort, mas recursando só num lado).
6. Prove que o limite inferior também vale para o caso médio (dica: numa árvore binária com N folhas, a profundidade média das folhas é pelo menos log₂ N).
7. Ordene por radix sort (base 10) os números [170, 45, 75, 90, 802, 24, 2, 66], mostrando cada passada. Por que a ordem das passadas precisa ser do dígito menos significativo para o mais?

## Tema 6: Grafos e union-find

**Objetivo:** representar grafos e percorrê-los com BFS e DFS, e manter componentes com union-find.

### 6.1 Representações de grafos

| Representação | Espaço | Aresta (u, v) existe? | Vizinhos de u | Bom para |
|---|---|---|---|---|
| Matriz de adjacência | Θ(V²) | O(1) | Θ(V) | Grafos densos |
| Listas de adjacência | Θ(V + E) | O(grau) | O(grau) | Grafos esparsos (o caso comum) |

A maioria dos grafos reais é **esparsa** (E muito menor que V²): numa rede social com 1 bilhão de pessoas, cada uma tem centenas de amigos, não bilhões. Use listas de adjacência:

```python
from collections import defaultdict
grafo = defaultdict(list)
for u, v in arestas:
    grafo[u].append(v)
    grafo[v].append(u)        # se não dirigido
```

Grafos implícitos: muitas vezes o grafo não está guardado, é **gerado** sob demanda. Os estados de um quebra-cabeça (vértices) e os movimentos válidos (arestas) formam um grafo enorme que você explora sem construir inteiro.

### 6.2 BFS

A **busca em largura** explora a partir de uma origem em "ondas": primeiro os vizinhos, depois os vizinhos dos vizinhos. Usa uma **fila**.

```python
from collections import deque
def bfs(grafo, origem):
    dist = {origem: 0}
    pai = {origem: None}
    fila = deque([origem])
    while fila:
        u = fila.popleft()
        for v in grafo[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                pai[v] = u
                fila.append(v)
    return dist, pai
```

- Custo **O(V + E)**: cada vértice entra na fila uma vez, cada aresta é olhada uma (ou duas) vezes.
- Encontra o **caminho mais curto em número de arestas** (grafos sem pesos). O caminho é reconstruído seguindo `pai` de trás para frente.
- Usos: menor número de movimentos num jogo, graus de separação numa rede social, rotear em redes, testar se um grafo é bipartido (cores alternadas por nível).

### 6.3 DFS

A **busca em profundidade** vai o mais fundo possível antes de voltar. Usa recursão (ou uma pilha explícita).

```python
def dfs(grafo, u, visitado, ordem_fim):
    visitado.add(u)
    for v in grafo[u]:
        if v not in visitado:
            dfs(grafo, v, visitado, ordem_fim)
    ordem_fim.append(u)          # u termina depois de todos os seus descendentes
```

- Custo **O(V + E)**.
- Classifica as arestas (de árvore, de retorno, de avanço, cruzadas); uma **aresta de retorno** (para um ancestral ainda "aberto") indica **ciclo**.
- Usos: detectar ciclos, componentes conexas, ordenação topológica, componentes fortemente conexas, labirintos, *backtracking*.

> **Cuidado! Cai na prática:** DFS recursiva em Python estoura a pilha com grafos de mais de ~1.000 vértices de profundidade. Use pilha explícita ou aumente o limite com cuidado.

### 6.4 Ordenação topológica

Num **grafo dirigido acíclico** (DAG), uma **ordenação topológica** lista os vértices de forma que toda aresta u → v tenha u antes de v. Exemplos: ordem para cursar disciplinas com pré-requisitos, ordem de compilação de módulos, de execução de tarefas num build (Make, Gradle), de avaliação de células numa planilha.

Dois algoritmos O(V + E):

1. **DFS:** a ordem **inversa** de término (`reversed(ordem_fim)`) é uma ordenação topológica.
2. **Kahn:** repita: pegue um vértice sem arestas chegando (grau de entrada 0), coloque na saída e remova as arestas que saem dele. Se sobrarem vértices, há um ciclo.

```python
def kahn(vertices, arestas):
    grau = {v: 0 for v in vertices}
    saem = {v: [] for v in vertices}
    for u, v in arestas:
        saem[u].append(v)
        grau[v] += 1
    fila = deque(v for v in vertices if grau[v] == 0)
    ordem = []
    while fila:
        u = fila.popleft()
        ordem.append(u)
        for v in saem[u]:
            grau[v] -= 1
            if grau[v] == 0:
                fila.append(v)
    if len(ordem) < len(vertices):
        raise ValueError("o grafo tem ciclo")
    return ordem
```

### 6.5 Componentes

- **Componentes conexas** (grafo não dirigido): rode BFS ou DFS a partir de cada vértice ainda não visitado; cada busca acha uma componente. O(V + E).
- **Componentes fortemente conexas** (dirigido): conjuntos onde todos alcançam todos. O **algoritmo de Kosaraju** faz duas DFS (uma no grafo, outra no grafo com arestas invertidas, em ordem decrescente de término); o de **Tarjan** faz uma só. O(V + E). Contraindo cada componente num vértice, obtém-se um DAG. Usos: análise de dependências circulares, 2-SAT, análise de redes.

### 6.6 Union-find

A estrutura **union-find** (ou conjuntos disjuntos) mantém uma partição de elementos com duas operações:

- `find(x)`: o representante do conjunto de x (dois elementos estão no mesmo conjunto sse têm o mesmo representante).
- `union(x, y)`: junta os conjuntos de x e de y.

Cada conjunto é uma árvore em que cada nó aponta para o pai; a raiz é o representante.

```python
class UnionFind:
    def __init__(self, n):
        self.pai = list(range(n))
        self.tam = [1] * n

    def find(self, x):
        while self.pai[x] != x:
            self.pai[x] = self.pai[self.pai[x]]   # compressão de caminho (pela metade)
            x = self.pai[x]
        return x

    def union(self, a, b):
        a, b = self.find(a), self.find(b)
        if a == b:
            return False
        if self.tam[a] < self.tam[b]:
            a, b = b, a
        self.pai[b] = a                            # união por tamanho
        self.tam[a] += self.tam[b]
        return True
```

Com as duas otimizações (**união por tamanho** e **compressão de caminho**), m operações custam O(m α(n)), onde α é a **inversa da função de Ackermann**, que é ≤ 4 para qualquer n que caiba no universo. Na prática, **constante**.

Usos: componentes conexas com arestas chegando aos poucos (sem refazer a busca), algoritmo de Kruskal (árvore geradora mínima), detectar ciclo ao adicionar arestas, segmentação de imagens, percolação.

### Atividades de fixação do Tema 6

1. Represente o grafo com arestas {1-2, 1-3, 2-4, 3-4, 4-5} por matriz e por listas. Rode BFS a partir de 1 e mostre a distância e o pai de cada vértice.
2. Ache o menor número de movimentos de um cavalo de xadrez de a1 até h8 com BFS num grafo implícito.
3. Detecte ciclo num grafo dirigido com DFS usando três cores (branco: não visitado; cinza: na pilha; preto: terminado). Por que duas cores não bastam num grafo dirigido?
4. Disciplinas com pré-requisitos: Cálculo → Probabilidade; Discreta → Algoritmos; Programação → Estruturas → Algoritmos; Probabilidade → IA; Algoritmos → IA. Dê uma ordenação topológica pelos dois métodos.
5. Conte as ilhas numa grade de '0' e '1' (vizinhança de 4), por DFS e por union-find.
6. Uma rede começa sem conexões e recebe pedidos "conecta a b" e "a e b se comunicam?". Implemente com union-find e meça o tempo para 10⁶ operações com e sem as otimizações.

## Projeto da etapa

**Biblioteca de estruturas de dados em C ou Java, com testes e benchmarks:**

1. Implemente: array dinâmico, lista duplamente ligada, deque com array circular, tabela hash com encadeamento e com sondagem linear, árvore rubro-negra (ou AVL), heap binário e union-find.
2. Cada estrutura com documentação das operações e seus custos (pior caso, médio, amortizado) e testes, incluindo **testes de propriedade** contra a biblioteca padrão como oráculo (sequências aleatórias de operações).
3. Implemente merge sort, quick sort (com pivô aleatório e partição em três), heap sort e radix sort.
4. **Benchmarks** com tamanhos de 10³ a 10⁷: compare cada estrutura com a equivalente da biblioteca padrão e os algoritmos de ordenação entre si e com `qsort`/`Arrays.sort`, em entradas aleatórias, ordenadas, invertidas e com muitas repetições. Faça gráficos em escala log-log e verifique se as inclinações batem com a análise.
5. Um relatório curto explicando as diferenças entre teoria e prática que você encontrou (por exemplo, lista ligada perdendo de array por causa do cache).

## Para ir além

- **MIT 6.006** no OpenCourseWare (versões de 2011 com Erik Demaine e 2020 com Jason Ku): aulas, notas e listas resolvidas.
- *Algorithms* (Jeff Erickson, gratuito online): excelente e rigoroso.
- *Introduction to Algorithms* (CLRS): a referência enciclopédica.
- *Algorithms* (Sedgewick e Wayne) e o curso no Coursera de Princeton: ótimas implementações em Java.
- **VisuAlgo** (visualgo.net): animações de todas as estruturas desta etapa.
- Material público de **CES-11 do ITA** nas páginas dos professores.

## Resumão

- O (no máximo), Ω (no mínimo), Θ (exato). Distinga pior, médio, melhor e amortizado.
- Laços aninhados multiplicam; dividir por 2 dá log. Teorema mestre: compare f(n) com n^(log_b a).
- Array: acesso O(1). Lista ligada: inserção O(1) dada a posição. Arrays ganham no cache.
- Pilha LIFO, fila FIFO, deque nas duas pontas. Array dinâmico que dobra: O(1) amortizado.
- Tabela hash: O(1) em média com α limitado e boa função; colisões inevitáveis. Hashing universal contra adversários.
- BST: O(altura). AVL e rubro-negra garantem O(log n) e mantêm ordem.
- Heap em array: inserir e extrair O(log n), construir O(n). Fila de prioridade.
- Merge sort estável e sempre n log n; quick sort aleatório, o mais rápido na prática; heap sort no lugar.
- Comparações: Ω(n log n) pela árvore de decisão. Counting e radix escapam usando os valores.
- Listas de adjacência para grafos esparsos. BFS: menor caminho sem pesos. DFS: ciclos, topológica, componentes.
- Union-find com união por tamanho e compressão de caminho: praticamente O(1).
