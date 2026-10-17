# Projeto e Análise de Algoritmos: Apostila Prática

Roadmap Ciência da Computação · Semanas 53 a 58

## Comece por aqui

Na etapa anterior você aprendeu um repertório de estruturas e algoritmos prontos. Agora o objetivo é **inventar** algoritmos: diante de um problema novo, saber que ferramentas tentar (guloso? programação dinâmica? fluxo? redução a um problema conhecido?) e **provar** que a solução está correta e é eficiente. Essas técnicas resolvem desde rotas de GPS e compressão de arquivos até alinhamento de DNA, alocação de recursos e, claro, entrevistas técnicas das grandes empresas.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CTC-12 Projeto e Análise de Algoritmos; CES-23 Algoritmos Avançados |
| MIT | 6.1210 (segunda metade) e 6.1220 (antiga 6.046J) Design and Analysis of Algorithms |
| Harvard | CS 1240 Data Structures and Algorithms |
| Oxford | Design and Analysis of Algorithms (2º ano) |

### Como esta apostila funciona

1. Para cada técnica, faça os problemas clássicos **à mão** antes de programar. Desenhe a tabela da programação dinâmica, a sequência de escolhas do guloso, o grafo residual do fluxo.
2. Toda solução tem três partes: o **algoritmo**, a **prova de correção** e a **análise de custo**. Não pule a prova.
3. Treine em juízes online (LeetCode, Codeforces, beecrowd, AtCoder): o tempo limite obriga a escolher a complexidade certa.
4. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** não sabe por onde começar? Resolva à mão um exemplo pequeno, depois escreva a solução por força bruta. Olhando o que a força bruta repete ou desperdiça, quase sempre aparece a técnica certa.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 53 | Tema 1: Caminhos mínimos e árvores geradoras |
| 54 | Tema 2: Dividir e conquistar |
| 55 | Tema 3: Algoritmos gulosos |
| 56 | Tema 4: Programação dinâmica |
| 57 | Tema 5: Fluxo em redes |
| 58 | Tema 6: Randomização e aproximação + projeto |

## Tema 1: Caminhos mínimos e árvores geradoras

**Objetivo:** encontrar caminhos mais curtos em grafos com pesos e conectar vértices com custo mínimo.

### 1.1 Dijkstra

Problema: num grafo com **pesos não negativos** nas arestas, achar a menor distância de uma origem s até todos os vértices. (BFS resolve o caso sem pesos.)

Ideia: manter uma estimativa d[v] de cada distância, começando com d[s] = 0 e infinito nos outros. Repetidamente, **fixar** o vértice não fixado de menor d e **relaxar** as arestas que saem dele: se d[u] + w(u, v) < d[v], atualize d[v].

```python
import heapq
def dijkstra(grafo, s):
    dist = {s: 0}
    heap = [(0, s)]
    fixado = set()
    while heap:
        d, u = heapq.heappop(heap)
        if u in fixado:
            continue
        fixado.add(u)
        for v, w in grafo[u]:
            nd = d + w
            if nd < dist.get(v, float("inf")):
                dist[v] = nd
                heapq.heappush(heap, (nd, v))
    return dist
```

**Custo:** O((V + E) log V) com heap binário.

**Por que funciona:** quando u é fixado com d[u] mínimo entre os não fixados, nenhum caminho alternativo pode ser menor: qualquer outro caminho até u sai do conjunto fixado por algum vértice x com d[x] ≥ d[u], e como os pesos são **não negativos**, o resto do caminho só aumenta. É um algoritmo **guloso** (Tema 3).

> **Cuidado! Cai na entrevista:** Dijkstra **falha com pesos negativos**: um vértice fixado pode depois ganhar um caminho mais curto passando por uma aresta negativa. Use Bellman-Ford.

**A\***: para ir de s até um destino específico, adicione uma **heurística** h(v) que estima a distância restante (por exemplo, a distância em linha reta num mapa) e ordene o heap por d[v] + h(v). Se h nunca superestima (é **admissível**), A\* acha o caminho ótimo explorando muito menos vértices. É o algoritmo dos GPS e dos jogos (detalhado em Inteligência Artificial).

### 1.2 Bellman-Ford

Funciona com pesos negativos. Ideia: relaxar **todas** as arestas, V − 1 vezes.

```python
def bellman_ford(vertices, arestas, s):
    dist = {v: float("inf") for v in vertices}
    dist[s] = 0
    for _ in range(len(vertices) - 1):
        for u, v, w in arestas:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    for u, v, w in arestas:
        if dist[u] + w < dist[v]:
            raise ValueError("ciclo negativo alcançável")
    return dist
```

**Custo:** O(V × E).

**Por que V − 1 rodadas:** um caminho mínimo sem ciclos tem no máximo V − 1 arestas; por indução, depois da rodada k, todo caminho mínimo com até k arestas está correto. Se ainda der para relaxar depois de V − 1 rodadas, existe um **ciclo de peso negativo** (e "menor caminho" deixa de fazer sentido: dá para dar voltas infinitas).

Aplicações: protocolos de roteamento (RIP, distância-vetor), detecção de **arbitragem** no câmbio (com pesos −log(taxa), um ciclo negativo é uma sequência de trocas que dá lucro).

### 1.3 Floyd-Warshall

Distâncias entre **todos os pares**, com pesos negativos (sem ciclos negativos), em O(V³) com três laços:

```python
def floyd_warshall(n, w):          # w[i][j] = peso, inf se não há aresta, 0 na diagonal
    d = [linha[:] for linha in w]
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if d[i][k] + d[k][j] < d[i][j]:
                    d[i][j] = d[i][k] + d[k][j]
    return d
```

É **programação dinâmica** (Tema 4): d_k[i][j] = menor caminho de i a j usando só os vértices 0..k como intermediários, e d_k[i][j] = min(d_{k−1}[i][j], d_{k−1}[i][k] + d_{k−1}[k][j]). A ordem dos laços importa: k precisa ser o **externo**.

| Algoritmo | Problema | Pesos negativos | Custo |
|---|---|---|---|
| BFS | Uma origem, sem pesos | Não se aplica | O(V + E) |
| Dijkstra | Uma origem | Não | O((V + E) log V) |
| Bellman-Ford | Uma origem | Sim, detecta ciclo negativo | O(VE) |
| DAG (ordem topológica) | Uma origem, grafo acíclico | Sim | O(V + E) |
| Floyd-Warshall | Todos os pares | Sim | O(V³) |

### 1.4 Árvore geradora mínima

Problema: num grafo conexo com pesos, escolher arestas que conectem todos os vértices com **custo total mínimo** (cabear uma cidade, projetar uma rede elétrica, agrupar dados).

**Propriedade do corte:** para qualquer divisão dos vértices em dois grupos, a aresta **mais leve** que cruza a divisão pertence a alguma árvore geradora mínima. Os dois algoritmos clássicos aplicam essa propriedade de forma gulosa:

**Kruskal:** ordene as arestas por peso; adicione cada uma se ela **não formar ciclo** (teste com union-find). O(E log E).

```python
def kruskal(n, arestas):
    uf = UnionFind(n)
    arvore = []
    for w, u, v in sorted(arestas):
        if uf.union(u, v):
            arvore.append((u, v, w))
    return arvore
```

**Prim:** cresça uma árvore a partir de um vértice, adicionando sempre a aresta mais leve que sai dela (com heap, como Dijkstra). O((V + E) log V).

Curiosidade: parar o Kruskal antes do fim, com k componentes, dá um **agrupamento** (*clustering*) em k grupos com máximo espaçamento entre grupos.

### Atividades de fixação do Tema 1

1. Rode Dijkstra à mão a partir de A: A-B 4, A-C 2, B-C 1, B-D 5, C-D 8, C-E 10, D-E 2. Mostre a ordem em que os vértices são fixados e a distância final de cada um.
2. Mostre um grafo de 3 vértices com uma aresta negativa em que Dijkstra dá a resposta errada.
3. Rode Bellman-Ford no grafo dirigido: S→A 4, S→B 5, A→C −3, B→A −2, C→B 6. Há ciclo negativo?
4. Por que, num DAG, dá para achar caminhos mínimos em O(V + E) mesmo com pesos negativos? Escreva o algoritmo. Como achar o caminho **máximo** num DAG?
5. Rode Kruskal e Prim no grafo do exercício 1 (como não dirigido). As árvores são iguais? Qual o custo?
6. Câmbio: 1 dólar = 5 reais, 1 real = 0,18 euro, 1 euro = 1,15 dólar. Há arbitragem? Modele como ciclo negativo.

## Tema 2: Dividir e conquistar

**Objetivo:** resolver problemas quebrando-os em subproblemas independentes, e analisar com o teorema mestre.

### 2.1 Dividir e conquistar

Três passos:

1. **Dividir** o problema em subproblemas menores do mesmo tipo.
2. **Conquistar** cada subproblema recursivamente (os pequenos, diretamente).
3. **Combinar** as soluções.

Merge sort e busca binária são os exemplos que você já conhece. Outros:

**Contar inversões** (quantos pares estão fora de ordem; mede o quanto duas listas de preferências discordam): faça o merge sort contando, durante a intercalação, quantos elementos da metade esquerda ainda restam quando um da direita é escolhido. O(n log n), contra O(n²) da força bruta.

**Par de pontos mais próximos** no plano: ordene por x, divida ao meio, resolva cada lado; o par mais próximo cruzando a divisão só pode estar numa faixa estreita, e nela cada ponto precisa ser comparado com no máximo 7 vizinhos (ordenados por y). O(n log n).

**Subarray de soma máxima**: o melhor está à esquerda, à direita ou cruzando o meio. O(n log n). (O algoritmo de Kadane, por programação dinâmica, faz em O(n).)

### 2.2 Multiplicação rápida

Multiplicar dois números de n dígitos pelo método da escola custa Θ(n²). **Karatsuba** (1960) dividiu cada número em duas metades: x = a × 10^(n/2) + b, y = c × 10^(n/2) + d. Então

xy = ac × 10ⁿ + (ad + bc) × 10^(n/2) + bd

Parece exigir 4 multiplicações de metade do tamanho (que daria Θ(n²) de novo). O truque: **(a + b)(c + d) − ac − bd = ad + bc**. Bastam **3** multiplicações: T(n) = 3T(n/2) + O(n) = **Θ(n^(log₂ 3)) ≈ Θ(n^1,585)**.

```python
def karatsuba(x, y):
    if x < 10 or y < 10:
        return x * y
    m = max(len(str(x)), len(str(y))) // 2
    a, b = divmod(x, 10**m)
    c, d = divmod(y, 10**m)
    ac, bd = karatsuba(a, c), karatsuba(b, d)
    meio = karatsuba(a + b, c + d) - ac - bd
    return ac * 10**(2 * m) + meio * 10**m + bd
```

A mesma ideia em matrizes é o algoritmo de **Strassen**: 7 multiplicações de blocos em vez de 8, Θ(n^2,807). O Python usa Karatsuba para multiplicar inteiros grandes.

### 2.3 Mediana em tempo linear

Achar o k-ésimo menor elemento: o quickselect (Estruturas de Dados) é O(n) **esperado**. Dá para garantir O(n) **no pior caso** com a **mediana das medianas** (Blum, Floyd, Pratt, Rivest e Tarjan, 1973):

1. Divida em grupos de 5 e ache a mediana de cada grupo (O(n)).
2. Ache recursivamente a mediana dessas n/5 medianas e use-a como pivô.
3. Esse pivô garante que pelo menos ~3n/10 elementos fiquem de cada lado. Recursão no lado certo, de tamanho ≤ 7n/10.

T(n) ≤ T(n/5) + T(7n/10) + O(n). Como 1/5 + 7/10 < 1, o trabalho cai geometricamente por nível: **T(n) = O(n)**.

Na prática o quickselect aleatório é mais rápido; o valor deste algoritmo é mostrar que dá para garantir linearidade, e a técnica de análise.

### 2.4 FFT

Multiplicar dois polinômios de grau n (ou dois números grandes, ou fazer uma convolução de sinais) pelo método direto custa Θ(n²). A **Transformada Rápida de Fourier** faz em **Θ(n log n)**:

1. Um polinômio de grau < n é determinado pelos seus valores em n pontos.
2. Multiplicar polinômios na forma de **valores** é fácil: multiplique ponto a ponto, O(n).
3. O caro é converter coeficientes ↔ valores. A FFT escolhe como pontos as **raízes n-ésimas da unidade** (números complexos e^(2πik/n)), que têm uma simetria que permite dividir e conquistar: avaliar em n pontos vira avaliar dois polinômios de metade do grau em n/2 pontos. T(n) = 2T(n/2) + O(n) = Θ(n log n).

```python
import numpy as np
def multiplica_polinomios(p, q):
    n = 1
    while n < len(p) + len(q) - 1:
        n *= 2
    fp, fq = np.fft.fft(p, n), np.fft.fft(q, n)
    return np.round(np.real(np.fft.ifft(fp * fq))).astype(int)[: len(p) + len(q) - 1]

print(multiplica_polinomios([1, 2], [1, 3]))     # (1 + 2x)(1 + 3x) = 1 + 5x + 6x²
```

A FFT foi chamada de "o algoritmo mais importante da nossa geração": está em compressão de áudio e imagem (MP3, JPEG), telecomunicações (Wi-Fi, 4G e 5G), processamento de sinais, ressonância magnética e na multiplicação de inteiros gigantes.

### Atividades de fixação do Tema 2

1. Conte as inversões de [2, 4, 1, 3, 5] à mão e com o algoritmo de merge sort, mostrando onde cada inversão é contada.
2. Multiplique 1234 × 5678 por Karatsuba, mostrando as três multiplicações do primeiro nível.
3. Escreva e resolva a recorrência de um algoritmo que divide em 3 partes de tamanho n/3 e combina em O(n). E um que divide em 2 partes de n/2 mas combina em O(n²)?
4. Na mediana das medianas, por que grupos de 3 não dariam O(n)? Escreva a recorrência.
5. Resolva o subarray de soma máxima por dividir e conquistar e por Kadane. Teste em [−2, 1, −3, 4, −1, 2, 1, −5, 4].
6. Use `np.fft` para multiplicar 123456789 × 987654321 tratando os dígitos como coeficientes de polinômios (não esqueça de propagar os "vai-um").

## Tema 3: Algoritmos gulosos

**Objetivo:** reconhecer quando a escolha localmente melhor leva ao ótimo global, e provar isso.

### 3.1 Escolha gulosa

Um algoritmo **guloso** constrói a solução passo a passo, sempre fazendo a escolha que parece melhor **agora**, sem voltar atrás. É simples e rápido, mas **nem sempre funciona**, e por isso exige prova.

Exemplo em que funciona: **seleção de atividades**. Dadas atividades com início e fim, escolher o maior número sem sobreposição. Guloso: ordene por **término** e pegue cada atividade que não conflita com a última escolhida. O(n log n).

Exemplo em que falha: dar troco com o **menor número de moedas**. Com moedas de 1, 5, 10, 25, "pegue sempre a maior moeda possível" é ótimo. Com moedas de 1, 3, 4 e troco 6, o guloso dá 4 + 1 + 1 (3 moedas), mas 3 + 3 (2 moedas) é melhor. Esse problema exige programação dinâmica.

Quando o guloso funciona, o problema costuma ter duas propriedades:

- **Escolha gulosa:** existe uma solução ótima que começa com a escolha gulosa.
- **Subestrutura ótima:** depois da escolha, o que sobra é um problema menor do mesmo tipo, cuja solução ótima completa a solução global.

### 3.2 Argumento de troca

Técnica de prova: pegue uma solução ótima qualquer O e mostre que dá para **trocar** elementos dela pelos da solução gulosa G, um por vez, **sem piorar**. No fim, G é tão boa quanto O.

**Exemplo: minimizar o atraso médio.** n tarefas com durações tᵢ, uma de cada vez; minimizar a soma dos tempos de término. Guloso: **mais curta primeiro**.

*Prova.* Suponha uma ordem ótima com duas tarefas vizinhas fora de ordem: i antes de j, com tᵢ > tⱼ. Trocar as duas não muda o término das outras; o término da segunda posição é o mesmo; o término da primeira posição cai de (antes + tᵢ) para (antes + tⱼ). A soma diminui (ou fica igual). Repetindo as trocas (como no bubble sort), chega-se à ordem "mais curta primeiro" sem piorar. ∎

### 3.3 Estar à frente

Outra técnica: mostre por indução que, depois de cada passo, a solução gulosa está **pelo menos tão bem** quanto qualquer outra solução no mesmo número de passos.

**Seleção de atividades.** Sejam g₁, g₂, ... as atividades gulosas e o₁, o₂, ... as de uma solução ótima, ambas ordenadas por término. *Afirmação:* fim(gₖ) ≤ fim(oₖ) para todo k. *Base:* g₁ é a atividade que termina mais cedo de todas. *Passo:* oₖ₊₁ começa depois de fim(oₖ) ≥ fim(gₖ), então oₖ₊₁ também era compatível com as escolhas gulosas; o guloso escolhe a compatível que termina mais cedo, logo fim(gₖ₊₁) ≤ fim(oₖ₊₁). Consequência: se a ótima tivesse mais atividades que a gulosa, a atividade extra seria compatível com a última gulosa e o guloso a teria escolhido. Contradição. ∎

Outros gulosos clássicos já provados: Dijkstra, Kruskal e Prim (Tema 1), e o caching ótimo de Belady (quando a memória enche, descarte o item que será usado **mais tarde** no futuro; impossível na prática, mas serve de referência para medir políticas como LRU).

### 3.4 Códigos de Huffman

Compressão sem perdas: dar códigos binários **curtos** aos símbolos frequentes e **longos** aos raros, de forma que nenhum código seja prefixo de outro (código **livre de prefixo**, decodificável sem separadores).

Algoritmo (guloso): coloque cada símbolo com sua frequência num heap de mínimo. Repita: retire os dois menos frequentes, junte-os como filhos de um novo nó com a soma das frequências e devolva ao heap. A árvore final define os códigos (esquerda = 0, direita = 1).

```python
import heapq, itertools
def huffman(freq):
    contador = itertools.count()          # desempate estável no heap
    heap = [(f, next(contador), s) for s, f in freq.items()]
    heapq.heapify(heap)
    while len(heap) > 1:
        f1, _, a = heapq.heappop(heap)
        f2, _, b = heapq.heappop(heap)
        heapq.heappush(heap, (f1 + f2, next(contador), (a, b)))
    codigos = {}
    def percorre(no, prefixo):
        if isinstance(no, tuple):
            percorre(no[0], prefixo + "0")
            percorre(no[1], prefixo + "1")
        else:
            codigos[no] = prefixo or "0"
    percorre(heap[0][2], "")
    return codigos
```

Huffman é **ótimo** entre os códigos livres de prefixo símbolo a símbolo (prova por troca: os dois símbolos menos frequentes podem ser irmãos no nível mais fundo). Está dentro do ZIP/gzip (DEFLATE), do JPEG e do MP3.

### Atividades de fixação do Tema 3

1. Atividades (início, fim): (1, 4), (3, 5), (0, 6), (5, 7), (3, 9), (5, 9), (6, 10), (8, 11), (8, 12), (2, 14), (12, 16). Escolha o máximo pelo guloso.
2. Dê contraexemplos para os gulosos "ordene por início" e "ordene por duração" na seleção de atividades.
3. **Mochila fracionária:** itens com peso e valor podem ser fracionados. Mostre que o guloso por valor/peso é ótimo. Por que ele falha na mochila 0/1 (sem fracionar)?
4. Prove pelo argumento de troca que, para minimizar o **atraso máximo** de tarefas com prazos, a ordem "prazo mais cedo primeiro" é ótima.
5. Construa o código de Huffman para as frequências a: 45, b: 13, c: 12, d: 16, e: 9, f: 5. Qual o tamanho médio por símbolo? Compare com um código de tamanho fixo.
6. Moedas de 1, 5, 10, 25 e 50: o guloso é ótimo? Ache o menor troco em que o guloso falha para moedas de 1, 10 e 25.

## Tema 4: Programação dinâmica

**Objetivo:** resolver problemas com subproblemas sobrepostos, guardando as respostas.

### 4.1 Subproblemas e memoização

**Programação dinâmica** (PD) vale quando o problema tem:

- **Subestrutura ótima:** a solução ótima é feita de soluções ótimas de subproblemas.
- **Subproblemas sobrepostos:** os mesmos subproblemas aparecem muitas vezes na recursão.

Receita (do curso do MIT, apelidada de SRTBOT):

1. **Subproblemas:** defina o que cada um significa, em português. ("dp[i] = menor custo para chegar ao degrau i".)
2. **Relação:** como um subproblema se resolve a partir de menores (a **recorrência**).
3. **Topologia:** a ordem em que calcular (os menores antes).
4. **Base:** os casos triviais.
5. **Original:** qual subproblema é a resposta.
6. **Tempo:** número de subproblemas × trabalho por subproblema.

Duas formas de implementar:

- **De cima para baixo (memoização):** a recursão natural, guardando cada resposta num dicionário.
- **De baixo para cima (tabulação):** preencher uma tabela na ordem certa, com laços.

Exemplo, o troco mínimo (onde o guloso falhava):

```python
def troco_minimo(moedas, valor):
    INF = float("inf")
    dp = [0] + [INF] * valor            # dp[v] = menor número de moedas para v
    for v in range(1, valor + 1):
        for m in moedas:
            if m <= v and dp[v - m] + 1 < dp[v]:
                dp[v] = dp[v - m] + 1
    return dp[valor] if dp[valor] < INF else -1

troco_minimo([1, 3, 4], 6)    # 2
```

Tempo O(valor × número de moedas). Para reconstruir **quais** moedas, guarde em cada posição a moeda escolhida e siga de trás para frente.

### 4.2 Mochila

**Mochila 0/1:** n itens com peso pᵢ e valor vᵢ; capacidade W. Maximizar o valor sem passar do peso.

Subproblema: dp[i][w] = maior valor usando os **i primeiros** itens com capacidade **w**. Relação: o item i entra ou não entra.

dp[i][w] = max(dp[i − 1][w], vᵢ + dp[i − 1][w − pᵢ]) (a segunda opção só se pᵢ ≤ w)

```python
def mochila(pesos, valores, W):
    dp = [0] * (W + 1)
    for p, v in zip(pesos, valores):
        for w in range(W, p - 1, -1):       # de trás para frente: cada item uma vez só
            dp[w] = max(dp[w], v + dp[w - p])
    return dp[W]
```

Tempo **O(nW)**. Atenção: isso é **pseudopolinomial**, polinomial no **valor** W, mas exponencial no número de **bits** de W. A mochila é NP-difícil (Teoria da Computação); a PD só é rápida quando W é pequeno.

### 4.3 Maior subsequência comum

Dadas duas sequências, achar a maior subsequência (não precisa ser contígua) presente nas duas. Base do `diff` do Git e de comparação de DNA.

dp[i][j] = tamanho da LCS de A[:i] e B[:j].

- Se A[i − 1] == B[j − 1]: dp[i][j] = dp[i − 1][j − 1] + 1.
- Senão: dp[i][j] = max(dp[i − 1][j], dp[i][j − 1]).

```python
def lcs(a, b):
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[len(a)][len(b)]
```

O(mn) tempo e espaço (dá para reduzir o espaço a O(min(m, n)) guardando só duas linhas, se não precisar reconstruir a subsequência).

### 4.4 Distância de edição

Menor número de inserções, remoções e substituições para transformar uma string em outra (**distância de Levenshtein**). Corretor ortográfico, "você quis dizer...?", bioinformática.

dp[i][j] = distância entre A[:i] e B[:j].

dp[i][j] = min(dp[i − 1][j] + 1 (remove), dp[i][j − 1] + 1 (insere), dp[i − 1][j − 1] + (0 se A[i − 1] == B[j − 1], senão 1) (substitui ou mantém))

Bases: dp[i][0] = i, dp[0][j] = j.

```
       ""  g  a  t  o
   ""   0  1  2  3  4
   p    1  1  2  3  4
   a    2  2  1  2  3
   t    3  3  2  1  2
   o    4  4  3  2  1
```

"pato" → "gato": distância 1 (substituir p por g).

### 4.5 Programação dinâmica em grafos

Todo problema de PD é um **caminho mínimo (ou máximo) num DAG**: os subproblemas são vértices, as dependências são arestas. Por isso a ordem topológica é a ordem de cálculo.

- **Caminhos num DAG:** dp[v] = min sobre arestas (u, v) de dp[u] + w(u, v), na ordem topológica. O(V + E).
- **Floyd-Warshall** (Tema 1) é PD sobre "quais vértices podem ser intermediários".
- **Caixeiro-viajante com PD (Held-Karp):** dp[S][v] = menor caminho que começa em 0, visita exatamente o conjunto S e termina em v. O(2ⁿ n²): exponencial, mas muito melhor que as n! permutações (para n = 20, ~4 × 10⁸ contra 2,4 × 10¹⁸).
- **PD em árvores:** maior conjunto independente numa árvore (dp[v][incluído ou não]), usado em problemas de alocação hierárquica.

### Atividades de fixação do Tema 4

1. **Escadas:** de quantas formas subir n degraus dando passos de 1 ou 2? E com passos de 1, 2 ou 3? Escreva a recorrência e calcule para n = 10.
2. Resolva a mochila 0/1 com W = 10 e itens (peso, valor): (5, 10), (4, 40), (6, 30), (3, 50). Mostre a tabela e reconstrua os itens escolhidos.
3. Calcule a LCS de "ABCBDAB" e "BDCABA" com a tabela e reconstrua uma subsequência.
4. Calcule a distância de edição entre "domingo" e "sabado" e mostre a sequência de operações.
5. **Maior subsequência crescente:** resolva em O(n²) com PD e depois em O(n log n) com busca binária. Teste em [10, 9, 2, 5, 3, 7, 101, 18].
6. **Multiplicação de cadeia de matrizes:** matrizes 10 × 30, 30 × 5, 5 × 60. Qual a ordem de parentização com menos multiplicações escalares? Generalize com PD em O(n³).
7. Corte de barras: uma barra de tamanho n pode ser cortada em pedaços; o pedaço de tamanho i vale pᵢ. Com p = [1, 5, 8, 9, 10, 17, 17, 20] (tamanhos 1 a 8), qual o maior valor para n = 8?

## Tema 5: Fluxo em redes

**Objetivo:** modelar problemas como fluxo e resolvê-los com caminhos aumentantes.

### 5.1 Fluxo máximo

Uma **rede de fluxo** é um grafo dirigido com uma **origem** s, um **destino** t e uma **capacidade** c(u, v) em cada aresta. Um **fluxo** atribui a cada aresta um valor f(u, v) com:

- **Capacidade:** 0 ≤ f(u, v) ≤ c(u, v).
- **Conservação:** em todo vértice exceto s e t, o que entra é igual ao que sai.

Problema: maximizar o fluxo que sai de s. Modelos: água em canos, dados numa rede, tráfego em ruas, mercadorias numa cadeia logística.

**Ford-Fulkerson:** enquanto existir um **caminho aumentante** de s a t na **rede residual**, empurre fluxo por ele.

A rede residual tem, para cada aresta (u, v):

- uma aresta (u, v) com capacidade residual c(u, v) − f(u, v) (quanto ainda cabe);
- uma aresta **reversa** (v, u) com capacidade f(u, v) (permite **desfazer** fluxo já enviado).

As arestas reversas são o ponto crucial: sem elas, uma escolha ruim no começo não pode ser corrigida.

**Edmonds-Karp:** escolha o caminho aumentante com **BFS** (o de menos arestas). Garante O(V E²), independentemente das capacidades.

```python
from collections import deque, defaultdict
def fluxo_maximo(cap, s, t):              # cap[u][v] = capacidade
    residual = defaultdict(lambda: defaultdict(int))
    for u in cap:
        for v, c in cap[u].items():
            residual[u][v] += c
    total = 0
    while True:
        pai = {s: None}
        fila = deque([s])
        while fila and t not in pai:
            u = fila.popleft()
            for v, c in residual[u].items():
                if c > 0 and v not in pai:
                    pai[v] = u
                    fila.append(v)
        if t not in pai:
            return total
        gargalo, v = float("inf"), t
        while pai[v] is not None:
            gargalo = min(gargalo, residual[pai[v]][v])
            v = pai[v]
        v = t
        while pai[v] is not None:
            residual[pai[v]][v] -= gargalo
            residual[v][pai[v]] += gargalo
            v = pai[v]
        total += gargalo
```

### 5.2 Corte mínimo

Um **corte** (S, T) separa os vértices em dois grupos com s ∈ S e t ∈ T. Sua **capacidade** é a soma das capacidades das arestas de S para T. Todo fluxo tem que atravessar o corte, então **todo fluxo ≤ todo corte**.

**Teorema do fluxo máximo e corte mínimo:** o valor do fluxo máximo é **igual** à capacidade do corte mínimo.

Quando o Ford-Fulkerson para, os vértices alcançáveis a partir de s na rede residual formam S, e esse é um corte mínimo. Ou seja, o algoritmo dá de brinde um **certificado** de otimalidade: o gargalo da rede.

Aplicações do corte mínimo: confiabilidade de redes (quantos cabos cortar para desconectar), **segmentação de imagens** (separar objeto e fundo minimizando a "energia" do corte), eliminação de times em campeonatos (um time ainda pode ser campeão matematicamente?).

### 5.3 Emparelhamento bipartido

Um **emparelhamento máximo** num grafo bipartido (L, R) vira fluxo máximo: ligue s a todo vértice de L e todo vértice de R a t, todas as arestas com capacidade 1. Cada unidade de fluxo é um par. O(VE) com Ford-Fulkerson (o fluxo é no máximo V).

Outras reduções a fluxo:

- **Caminhos disjuntos em arestas** de s a t: fluxo com capacidade 1 (quantos caminhos independentes existem entre dois roteadores).
- **Alocação com limites:** alunos em projetos com vagas, médicos em plantões, tarefas em máquinas.
- **Teorema de Hall** e **teorema de König** (num bipartido, emparelhamento máximo = cobertura mínima por vértices) saem do fluxo máximo e corte mínimo.

O **algoritmo de Hopcroft-Karp** faz o emparelhamento bipartido em O(E √V); o **algoritmo húngaro** resolve a versão com pesos (atribuição de custo mínimo) em O(V³).

### 5.4 Programação linear

**Programação linear** (PL): maximizar uma função linear sujeita a restrições lineares.

```
maximizar   3x + 2y
sujeito a   x + y ≤ 4
            x + 3y ≤ 6
            x ≥ 0, y ≥ 0
```

As restrições formam um polígono (um **poliedro** em mais dimensões); o ótimo está num **vértice**. O **método simplex** (Dantzig, 1947) anda de vértice em vértice melhorando a função; é exponencial no pior caso, mas muito rápido na prática. Os **métodos de ponto interior** são polinomiais.

PL é a ferramenta mais usada de otimização no mundo real: logística, escalas de tripulação de companhias aéreas, mistura de rações e combustíveis, planejamento de produção. Fluxo máximo, caminhos mínimos e emparelhamento são casos particulares de PL.

A **dualidade** de PL generaliza o fluxo máximo e o corte mínimo: todo problema de maximização tem um problema "dual" de minimização com o mesmo valor ótimo, que funciona como certificado.

Com variáveis **inteiras** (programação linear inteira), o problema vira NP-difícil, mas resolvedores como Gurobi, CPLEX e o gratuito HiGHS resolvem instâncias enormes na prática.

```python
from scipy.optimize import linprog
r = linprog(c=[-3, -2], A_ub=[[1, 1], [1, 3]], b_ub=[4, 6], bounds=[(0, None)] * 2)
print(r.x, -r.fun)     # [4. 0.] 12.0
```

### Atividades de fixação do Tema 5

1. Rode Edmonds-Karp à mão na rede: s→a 10, s→b 5, a→b 15, a→t 5, b→t 10. Mostre cada caminho aumentante, o fluxo máximo e o corte mínimo.
2. Mostre uma rede em que escolher mal o caminho aumentante (sem arestas reversas) leva a um fluxo que não é máximo.
3. Cinco alunos e quatro projetos, cada aluno com uma lista de projetos aceitáveis. Modele como fluxo, inclusive com "cada projeto aceita no máximo 2 alunos".
4. Prove que, se todas as capacidades são inteiras, existe um fluxo máximo inteiro (dica: o que acontece com o gargalo em cada passo do Ford-Fulkerson?).
5. Resolva graficamente o PL do texto e confira com `linprog`. O que muda se a função objetivo for x + 3y?
6. Uma fábrica produz cadeiras (lucro 40, 2 h de corte e 1 h de montagem) e mesas (lucro 70, 1 h de corte e 3 h de montagem). Há 100 h de corte e 90 h de montagem. Modele como PL e resolva.

## Tema 6: Randomização e aproximação

**Objetivo:** usar aleatoriedade para simplificar algoritmos e aceitar soluções quase ótimas quando o ótimo é intratável.

### 6.1 Algoritmos randomizados

Você já viu: quick sort e quickselect com pivô aleatório, hashing universal, Miller-Rabin, filtros de Bloom (Probabilidade e Estruturas de Dados). Mais dois clássicos:

**Corte mínimo de Karger:** para achar o corte mínimo de um grafo não dirigido (sem origem e destino), **contraia arestas aleatórias** (junte as pontas num só vértice) até sobrarem 2 vértices; as arestas entre eles formam um corte. A chance de ser o mínimo é ≥ 2/(n(n − 1)), pequena, mas repetindo O(n² log n) vezes a chance de nunca achar fica minúscula. Simples a ponto de caber em poucas linhas.

**Verificação de produto de matrizes (Freivalds):** para verificar se AB = C sem multiplicar (O(n³)), sorteie um vetor x de 0s e 1s e compare A(Bx) com Cx em O(n²). Se AB ≠ C, a verificação falha com probabilidade ≥ 1/2; repetindo k vezes, erro ≤ 2⁻ᵏ.

**Fingerprinting (Rabin-Karp):** para achar um padrão num texto, compare hashes das janelas (atualizados em O(1) a cada deslocamento: *rolling hash*) e só confira caractere por caractere quando os hashes baterem. O(n + m) esperado. Usado em detecção de plágio e em ferramentas como o rsync.

### 6.2 Algoritmos de aproximação

Muitos problemas de otimização importantes são **NP-difíceis** (Teoria da Computação): não se conhece algoritmo polinomial para o ótimo. Alternativa: um algoritmo polinomial com **garantia** de ficar perto do ótimo.

Um algoritmo é uma **α-aproximação** se, para toda entrada, o custo obtido é no máximo α vezes o ótimo (minimização).

**Cobertura por vértices** (escolher o menor conjunto de vértices que toca todas as arestas): enquanto houver aresta descoberta (u, v), coloque **u e v** na cobertura e remova as arestas que eles tocam. É uma **2-aproximação**: as arestas escolhidas não têm vértices em comum (formam um emparelhamento), e qualquer cobertura precisa de pelo menos um vértice de cada uma delas; nós pegamos dois.

**Caixeiro-viajante métrico** (as distâncias obedecem à desigualdade triangular): construa a árvore geradora mínima, percorra-a em pré-ordem (DFS) e pule os vértices repetidos. É uma **2-aproximação**: a árvore custa menos que o ótimo (tirar uma aresta do circuito ótimo dá uma árvore), o percurso completo da árvore custa o dobro dela, e pular vértices só encurta (desigualdade triangular). O algoritmo de Christofides melhora para 1,5.

**Mochila (FPTAS):** arredonde os valores para baixo numa escala grossa e rode a PD por valor. Para qualquer ε > 0, obtém (1 − ε) do ótimo em tempo polinomial em n e 1/ε.

**Cobertura de conjuntos** (escolher o menor número de conjuntos que cubram todos os elementos): o guloso "pegue o conjunto que cobre mais elementos ainda descobertos" é uma (ln n)-aproximação, e provou-se que não dá para fazer muito melhor (a menos que P = NP).

Na prática, também se usam **heurísticas** sem garantia formal mas muito boas: busca local (2-opt para o caixeiro-viajante), *simulated annealing*, algoritmos genéticos.

### 6.3 Algoritmos online

Um algoritmo **online** recebe a entrada aos poucos e precisa decidir **sem conhecer o futuro**. Mede-se pela **razão competitiva**: quanto pior ele fica em relação ao melhor algoritmo que conhecesse tudo de antemão.

**Aluguel de esquis:** alugar custa 1 por dia, comprar custa B. Você não sabe quantos dias vai esquiar. Estratégia: alugue por B − 1 dias e então compre. No pior caso você gasta menos que 2 vezes o ótimo: **2-competitiva**, e nenhuma estratégia determinística faz melhor. (A mesma lógica vale para "manter um servidor ligado ou desligar", "esperar o ônibus ou chamar o carro".)

**Paginação (cache):** com cache de k páginas, a política **LRU** (descarta a usada há mais tempo) é k-competitiva em relação ao ótimo de Belady, e nenhuma política determinística faz melhor que k. Na prática, LRU funciona muito melhor que esse pior caso, por causa da **localidade** dos acessos reais.

### 6.4 Fluxo de dados

Em **fluxos de dados** (*streaming*), os itens passam uma vez só e a memória é muito menor que os dados (tráfego de rede, cliques, logs). Algoritmos clássicos:

- **Elemento majoritário (Boyer-Moore):** um candidato e um contador; O(1) de memória. Se algum elemento aparece mais de n/2 vezes, ele é o candidato final.
- **Misra-Gries:** generaliza para os elementos que aparecem mais de n/k vezes, com k − 1 contadores.
- **Count-Min Sketch:** estima a frequência de qualquer item com uma pequena matriz de contadores e várias funções hash (pode superestimar, nunca subestima).
- **HyperLogLog:** conta elementos distintos com memória de kilobytes (Probabilidade).
- **Amostragem de reservatório:** amostra uniforme de tamanho k (Probabilidade).

```python
def majoritario(fluxo):
    candidato, contador = None, 0
    for x in fluxo:
        if contador == 0:
            candidato, contador = x, 1
        elif x == candidato:
            contador += 1
        else:
            contador -= 1
    return candidato       # confira numa segunda passada, se possível
```

### Atividades de fixação do Tema 6

1. Implemente Rabin-Karp e compare o tempo com a busca ingênua num texto de 10⁷ caracteres. Em que tipo de texto e padrão a busca ingênua fica O(nm)?
2. Implemente o algoritmo de Karger e meça, para um grafo de 20 vértices, em que fração das execuções ele acha o corte mínimo.
3. Mostre um grafo em que a 2-aproximação da cobertura por vértices devolve exatamente o dobro do ótimo.
4. Implemente a 2-aproximação do caixeiro-viajante métrico com pontos aleatórios no plano e melhore o resultado com 2-opt. Compare com o ótimo (força bruta) para n = 9.
5. Por que a estratégia do aluguel de esquis "compre no primeiro dia" não é competitiva? E "alugue sempre"?
6. Prove que o algoritmo de Boyer-Moore acha o majoritário quando ele existe.

## Projeto da etapa

**Planejador de rotas com dados reais do OpenStreetMap:**

1. Baixe o mapa de um bairro ou cidade (com a biblioteca `osmnx`, ou um extrato do site Geofabrik) e monte o grafo de ruas: vértices são cruzamentos, arestas são trechos com o comprimento em metros (e, se quiser, tempo estimado pela velocidade máxima).
2. Implemente **Dijkstra** e **A\*** (heurística: distância em linha reta pela fórmula de haversine) do zero, sem bibliotecas de grafos.
3. Compare os dois: número de vértices explorados e tempo, para 100 pares aleatórios de origem e destino. Visualize no mapa os vértices explorados por cada um.
4. Implemente **A\* bidirecional** ou **landmarks (ALT)** e compare.
5. Extra: um planejador de entregas que visita k pontos (caixeiro-viajante) usando a 2-aproximação com 2-opt, sobre as distâncias reais calculadas pelo seu Dijkstra.
6. README com a análise de complexidade, os gráficos e as limitações (ruas de mão única, curvas proibidas, trânsito).

## Para ir além

- **MIT 6.046J** no OpenCourseWare (2015, com Erik Demaine, Srini Devadas e Nancy Lynch).
- *Algorithm Design* (Kleinberg e Tardos): o melhor livro para aprender a projetar e provar algoritmos.
- *Algorithms* (Jeff Erickson, gratuito) e *Algorithms* (Dasgupta, Papadimitriou e Vazirani).
- *The Algorithm Design Manual* (Skiena), com o catálogo de problemas, ótimo para reconhecer "esse problema já tem nome".
- *Competitive Programmer's Handbook* (Antti Laaksonen, gratuito) e os juízes Codeforces, AtCoder e beecrowd para treinar.

## Resumão

- Dijkstra: pesos não negativos, guloso com heap, O((V + E) log V). A\*: Dijkstra com heurística admissível.
- Bellman-Ford: pesos negativos, V − 1 rodadas, detecta ciclo negativo. Floyd-Warshall: todos os pares, O(V³).
- Árvore geradora mínima: propriedade do corte; Kruskal (union-find) e Prim (heap).
- Dividir e conquistar: dividir, conquistar, combinar. Karatsuba n^1,585; mediana em O(n); FFT em n log n.
- Guloso: escolha local sem voltar atrás. Prove com argumento de troca ou "estar à frente". Huffman é ótimo.
- PD: subestrutura ótima + subproblemas sobrepostos. Defina o subproblema em português, a recorrência, a ordem e a base.
- Mochila O(nW) é pseudopolinomial. LCS e edição em O(mn). Toda PD é caminho num DAG.
- Fluxo máximo = corte mínimo. Arestas reversas permitem desfazer. Emparelhamento bipartido é fluxo.
- Programação linear: ótimo num vértice; simplex na prática; dualidade como certificado.
- Randomizar simplifica (Karger, Freivalds, Rabin-Karp). Aproximação com garantia para NP-difíceis.
- Online: razão competitiva (esquis 2, LRU k). Streaming: memória pequena, uma passada.
