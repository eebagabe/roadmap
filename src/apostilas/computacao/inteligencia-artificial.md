# Inteligência Artificial: Apostila Prática

Roadmap Ciência da Computação · Semanas 99 a 102

## Comece por aqui

Hoje "IA" virou sinônimo de redes neurais e modelos de linguagem, mas a área é bem mais antiga e mais ampla: desde os anos 1950, ela estuda como construir **agentes** que percebem o ambiente e agem para atingir objetivos. Muitas das técnicas clássicas continuam em toda parte: o A\* nos GPS e jogos, a busca adversarial nos motores de xadrez, a satisfação de restrições em escalas de trabalho e horários, as redes bayesianas em diagnóstico, o aprendizado por reforço no AlphaGo e no ajuste fino de modelos de linguagem. Esta etapa segue a estrutura do livro *Artificial Intelligence: A Modern Approach* (Russell e Norvig) e do curso **CS50 AI** de Harvard. A próxima etapa trata de aprendizado de máquina.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CMC-15 Inteligência Artificial |
| MIT | 6.4100 (antiga 6.034) Artificial Intelligence |
| Harvard | CS 1820 (antiga CS 182) Artificial Intelligence; CS50 AI |
| Oxford | Artificial Intelligence (2º ano) |

### Como esta apostila funciona

1. Use Python. Os projetos do **CS50 AI** (gratuitos) casam com cada tema: faça-os em paralelo.
2. Implemente os algoritmos do zero antes de usar bibliotecas: a intuição vem de ver a busca expandindo nós.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** o agente se comporta de forma estranha? Teste num problema minúsculo em que você sabe a resposta (um labirinto 3 × 3, um jogo da velha quase terminado) e imprima cada nó expandido ou cada valor calculado.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 99 | Tema 1: Agentes e busca |
| 100 | Tema 2: Conhecimento e raciocínio |
| 101 | Tema 3: Incerteza |
| 102 | Tema 4: Aprendizado por reforço e ética + projeto |

## Tema 1: Agentes e busca

**Objetivo:** modelar problemas como busca em espaços de estados e resolvê-los com busca cega, heurística e adversarial.

### 1.1 Agentes

Um **agente** percebe o **ambiente** por sensores e age por atuadores. Um agente **racional** escolhe a ação que maximiza o desempenho esperado, dado o que percebeu e sabe.

Propriedades do ambiente que mudam a técnica a usar:

| Propriedade | Opções |
|---|---|
| Observabilidade | Totalmente (xadrez) ou parcialmente (pôquer, carro autônomo) |
| Determinismo | Determinístico (quebra-cabeça) ou estocástico (gamão, mundo real) |
| Agentes | Um só (labirinto) ou vários, cooperativos ou competitivos (xadrez) |
| Dinâmica | Estático ou muda enquanto o agente pensa (trânsito) |
| Espaço | Discreto (jogo de tabuleiro) ou contínuo (robótica) |

### 1.2 Busca cega

Muitos problemas viram **busca**: achar uma sequência de ações de um estado inicial até um objetivo. Um **problema de busca** tem: estado inicial, ações possíveis em cada estado, modelo de transição (resultado de cada ação), teste de objetivo e custo de cada passo.

Exemplos: rotas num mapa, quebra-cabeça de 8 peças, labirintos, planejamento de movimentos de robôs, o cubo mágico.

Algoritmo genérico: uma **fronteira** com os nós a explorar; repetidamente, tira um nó, testa se é objetivo, e **expande** (acrescenta os sucessores). O que muda entre os algoritmos é **a ordem** de retirada:

| Algoritmo | Fronteira | Completo | Ótimo | Tempo e memória |
|---|---|---|---|---|
| Largura (BFS) | Fila | Sim | Sim, com custos iguais | O(bᵈ) e O(bᵈ) |
| Profundidade (DFS) | Pilha | Não (pode descer para sempre) | Não | O(bᵐ) e O(bm) |
| Custo uniforme | Fila de prioridade por custo acumulado | Sim | Sim | Exponencial |
| Aprofundamento iterativo | DFS com limite crescente | Sim | Sim, com custos iguais | O(bᵈ) e O(bd) |

(b = fator de ramificação, d = profundidade da solução, m = profundidade máxima.)

O **aprofundamento iterativo** combina o melhor dos dois: a memória pequena da DFS e a garantia da BFS. Refazer os níveis de cima parece desperdício, mas a maior parte dos nós está no último nível.

Guarde os estados já visitados (um conjunto) para não explorar o mesmo estado várias vezes: é a diferença entre busca em **árvore** e em **grafo**.

### 1.3 Busca heurística e A\*

Uma **heurística** h(n) estima o custo de n até o objetivo, usando conhecimento do problema: a distância em linha reta num mapa; no quebra-cabeça de 8 peças, o número de peças fora do lugar, ou a soma das distâncias de Manhattan de cada peça ao seu lugar.

- **Busca gulosa:** expande o nó com menor h(n). Rápida, mas não é ótima.
- **A\***: expande o nó com menor **f(n) = g(n) + h(n)** (custo até aqui mais estimativa do resto).

```python
import heapq
def a_estrela(inicio, objetivo, vizinhos, h):
    fronteira = [(h(inicio), 0, inicio)]
    custo = {inicio: 0}
    pai = {inicio: None}
    while fronteira:
        f, g, n = heapq.heappop(fronteira)
        if n == objetivo:
            caminho = []
            while n is not None:
                caminho.append(n); n = pai[n]
            return caminho[::-1]
        if g > custo[n]:
            continue                          # entrada velha na fila
        for m, c in vizinhos(n):
            ng = g + c
            if ng < custo.get(m, float("inf")):
                custo[m], pai[m] = ng, n
                heapq.heappush(fronteira, (ng + h(m), ng, m))
    return None
```

**Garantia:** se h é **admissível** (nunca superestima o custo real), A\* acha a solução ótima. Se h também é **consistente** (h(n) ≤ custo(n, n′) + h(n′)), cada nó é expandido no máximo uma vez.

Quanto **mais informada** a heurística (maior, sem passar do real), menos nós são expandidos. h = 0 é admissível e faz o A\* virar o custo uniforme (Dijkstra). Boas heurísticas vêm de **problemas relaxados**: a distância de Manhattan é o custo exato do quebra-cabeça se as peças pudessem passar umas por cima das outras.

### 1.4 Minimax

Em jogos de dois jogadores com informação perfeita e soma zero (xadrez, damas, jogo da velha), um jogador (MAX) quer maximizar o resultado e o outro (MIN) minimizar. O **minimax** calcula o valor de cada posição supondo que **ambos jogam perfeitamente**:

```python
def minimax(estado, maximizando):
    if terminal(estado):
        return utilidade(estado)            # +1 vitória de MAX, −1 derrota, 0 empate
    valores = [minimax(resultado(estado, a), not maximizando) for a in acoes(estado)]
    return max(valores) if maximizando else min(valores)
```

O custo é O(bᵐ): para o jogo da velha, viável (cerca de 550 mil nós); para o xadrez (b ≈ 35, partidas de 80 lances), impossível. Solução: limitar a profundidade e, nas folhas, usar uma **função de avaliação** heurística (material, mobilidade, segurança do rei).

### 1.5 Poda alfa-beta

Muitos ramos não podem mudar a decisão. A **poda alfa-beta** carrega dois limites: α (o melhor valor já garantido para MAX no caminho) e β (o melhor para MIN). Se, num nó de MIN, o valor cai abaixo de α, MAX nunca escolheria esse caminho: os irmãos restantes podem ser **ignorados**.

```python
def alfabeta(estado, prof, alfa, beta, maximizando):
    if prof == 0 or terminal(estado):
        return avalia(estado)
    if maximizando:
        v = float("-inf")
        for a in acoes(estado):
            v = max(v, alfabeta(resultado(estado, a), prof - 1, alfa, beta, False))
            alfa = max(alfa, v)
            if alfa >= beta:
                break                         # poda: MIN não deixaria chegar aqui
        return v
    v = float("inf")
    for a in acoes(estado):
        v = min(v, alfabeta(resultado(estado, a), prof - 1, alfa, beta, True))
        beta = min(beta, v)
        if alfa >= beta:
            break
    return v
```

Com a **melhor ordem** de exploração dos lances, a poda reduz o custo para O(b^(m/2)): na mesma quantidade de tempo, **dobra** a profundidade alcançável. Motores de xadrez combinam isso com ordenação de lances, tabelas de transposição (uma tabela hash de posições já avaliadas), aprofundamento iterativo e, desde o Stockfish NNUE e o AlphaZero, avaliação por redes neurais.

Para jogos com acaso (gamão), usa-se o **expectiminimax** (nós de chance com a média ponderada). Para espaços enormes como o Go, a **busca em árvore de Monte Carlo** (MCTS), que avalia posições por simulações aleatórias.

### Atividades de fixação do Tema 1

1. Classifique os ambientes: (a) sudoku; (b) pôquer; (c) robô aspirador numa casa; (d) carro autônomo.
2. Modele o problema dos missionários e canibais como busca (estados, ações, objetivo) e resolva com BFS.
3. Para o quebra-cabeça de 8 peças, mostre que "peças fora do lugar" e "distância de Manhattan" são admissíveis. Qual é mais informada? Compare o número de nós expandidos pelo A\* com cada uma em 10 instâncias aleatórias.
4. Por que a distância em linha reta é admissível para rotas, mas o "tempo em linha reta a 200 km/h" não seria para tempo de viagem com estradas de até 120 km/h? (Pense ao contrário: qual velocidade tornaria a heurística admissível?)
5. Desenhe uma árvore de jogo de profundidade 2 com 3 lances por nível e valores nas folhas 3, 12, 8 | 2, 4, 6 | 14, 5, 2. Calcule o minimax e marque os ramos podados pelo alfa-beta, explorando da esquerda para a direita.
6. Implemente o jogo da velha com minimax e confirme que, com jogo perfeito dos dois lados, o resultado é empate.

## Tema 2: Conhecimento e raciocínio

**Objetivo:** representar conhecimento em lógica, fazer inferências e resolver problemas de satisfação de restrições.

### 2.1 Lógica para IA

Um **agente baseado em conhecimento** mantém uma **base de conhecimento** (BC) de sentenças numa linguagem formal e **infere** novas sentenças a partir dela.

**Lógica proposicional** (a da Matemática Discreta): bom ponto de partida, mas verbosa. No "mundo do wumpus" (um jogo clássico), é preciso uma variável para cada casa: "brisa na casa (1, 2)" vira B₁₂, e as regras se repetem para cada casa.

**Lógica de primeira ordem** acrescenta **objetos**, **predicados**, **funções** e **quantificadores**, e descreve regras gerais de uma vez:

```
∀x ∀y (Pai(x, y) → Ascendente(x, y))
∀x ∀y ∀z (Pai(x, y) ∧ Ascendente(y, z) → Ascendente(x, z))
Pai(João, Maria). Pai(Maria, Ana).
⊢ Ascendente(João, Ana)
```

Essa é a base do **Prolog** e do **Datalog** (linguagem de consulta usada em análise de programas e em bancos de dados), e das ontologias e grafos de conhecimento.

### 2.2 Inferência

**Consequência lógica:** BC ⊨ α se α é verdadeira em **todos** os modelos (mundos possíveis) em que a BC é verdadeira. Formas de verificar:

- **Verificação de modelos:** enumerar todas as valorações (a tabela-verdade): correto e completo, mas exponencial.
- **Regras de inferência** (a dedução natural da Matemática Discreta): *modus ponens*, eliminação do "e"...
- **Resolução:** uma única regra, completa para refutação: de (A ∨ B) e (¬B ∨ C), conclua (A ∨ C). Para provar α, acrescente ¬α à BC (em FNC) e derive a cláusula vazia (contradição).
- **Encadeamento para a frente e para trás** com cláusulas de Horn (no máximo um literal positivo, ou seja, regras "se ... e ... então ..."): lineares e eficientes. O **encadeamento para a frente** dispara regras a partir dos fatos até chegar ao objetivo (sistemas de produção, regras de negócio); o **para trás** parte do objetivo e procura regras que o provem (Prolog).

**Sistemas especialistas** dos anos 1970 e 1980 (como o MYCIN, para diagnóstico de infecções) eram bases de regras com encadeamento. Funcionavam em domínios estreitos, mas eram caros de construir e frágeis fora deles. As regras continuam em uso em motores de regras de negócio, conformidade e verificação.

### 2.3 Satisfação de restrições

Um **problema de satisfação de restrições** (CSP) tem **variáveis**, cada uma com um **domínio** de valores, e **restrições** que limitam combinações. Objetivo: atribuir valores a todas as variáveis sem violar restrições.

Exemplos: sudoku (81 variáveis, domínio 1 a 9, restrições de "todos diferentes" por linha, coluna e bloco), coloração de mapas, **grade de horários** (disciplinas em horários e salas, sem conflito de professor, turma ou sala), escala de plantões, configuração de produtos.

Formular como CSP em vez de busca genérica permite usar a **estrutura** das restrições:

- **Consistência de arco** (algoritmo **AC-3**): remove do domínio de X os valores que não têm nenhum valor compatível em Y, para cada restrição entre X e Y, propagando até estabilizar. No sudoku fácil, só isso já resolve o tabuleiro.
- **Verificação adiante** (*forward checking*): ao atribuir uma variável, remove valores incompatíveis dos domínios das vizinhas; se algum domínio ficar vazio, volta na hora.

### 2.4 Backtracking com heurísticas

A **busca com retrocesso** (*backtracking*) atribui uma variável por vez e volta quando uma restrição é violada. É uma DFS sobre atribuições parciais.

```python
def backtracking(atrib, variaveis, dominios, consistente):
    if len(atrib) == len(variaveis):
        return atrib
    var = escolhe_variavel(atrib, variaveis, dominios)        # MRV
    for valor in ordena_valores(var, atrib, dominios):        # menos restritivo primeiro
        if consistente(var, valor, atrib):
            atrib[var] = valor
            resultado = backtracking(atrib, variaveis, dominios, consistente)
            if resultado:
                return resultado
            del atrib[var]
    return None
```

Heurísticas que fazem uma diferença enorme:

- **MRV** (menor número de valores restantes): escolha a variável com o domínio mais apertado. Falha cedo se for falhar ("falhe primeiro").
- **Grau:** em empate, a variável envolvida em mais restrições com variáveis não atribuídas.
- **Valor menos restritivo:** tente primeiro o valor que elimina menos opções das vizinhas.

Com MRV, verificação adiante e AC-3, o problema das n rainhas resolve n = 1.000 com facilidade. Alternativa para CSPs enormes: **busca local** como o **min-conflitos** (comece com uma atribuição completa aleatória e troque repetidamente o valor de uma variável em conflito pelo que causa menos conflitos), que resolve n rainhas com milhões de rainhas em segundos.

Na prática, CSPs grandes são resolvidos com **resolvedores** prontos: SAT (Matemática Discreta), programação por restrições (OR-Tools CP-SAT, MiniZinc) e programação inteira (Algoritmos).

### Atividades de fixação do Tema 2

1. Escreva em lógica de primeira ordem: (a) todo aluno de Computação cursa Algoritmos; (b) existe um professor que orienta todos os alunos do mestrado; (c) ninguém é pai de si mesmo.
2. Dada a BC {P → Q, Q → R, P}, prove R por encadeamento para a frente e por resolução.
3. Formule como CSP a coloração do mapa da região Sul do Brasil com os estados vizinhos (PR, SC, RS, e os vizinhos SP e MS) com 3 cores. Aplique AC-3 depois de fixar PR = vermelho.
4. Implemente um resolvedor de sudoku com backtracking e compare o número de nós com e sem MRV e verificação adiante num sudoku "difícil".
5. Implemente o min-conflitos para n rainhas e meça o tempo para n = 100, 1.000 e 10.000.
6. Monte a grade de horários de 6 disciplinas, 3 professores e 4 horários (cada professor dá 2 disciplinas e não pode estar em dois lugares ao mesmo tempo) com um resolvedor de restrições (OR-Tools ou o seu backtracking).

## Tema 3: Incerteza

**Objetivo:** representar e raciocinar com conhecimento incerto usando probabilidade.

### 3.1 Redes bayesianas

O mundo real é incerto (sensores com ruído, informação parcial, causas escondidas). Probabilidade (a etapa de Probabilidade) é a linguagem certa, mas a **distribuição conjunta** de n variáveis binárias tem 2ⁿ entradas: impossível de guardar e de estimar para n grande.

Uma **rede bayesiana** representa a conjunta de forma compacta, explorando a **independência condicional**: um grafo **dirigido acíclico** em que cada variável depende só dos seus **pais**, com uma tabela P(variável | pais) em cada nó. A conjunta é o produto:

**P(X₁, ..., Xₙ) = Π P(Xᵢ | pais(Xᵢ))**

Exemplo clássico (o alarme de Judea Pearl):

```
  Roubo      Terremoto
      \       /
       Alarme
      /      \
  João liga  Maria liga
```

Em vez de 2⁵ − 1 = 31 números, bastam 1 + 1 + 4 + 2 + 2 = 10. Pergunta típica: "João e Maria ligaram; qual a chance de ter havido um roubo?" (P(Roubo | João, Maria)): inferência **diagnóstica**, das evidências para a causa, usando Bayes.

**Inferência:**

- **Exata por enumeração:** soma a conjunta sobre as variáveis escondidas. Exponencial no pior caso; a **eliminação de variáveis** reaproveita cálculos (programação dinâmica).
- **Aproximada por amostragem:** gere muitos mundos aleatórios conforme a rede e conte (Monte Carlo); com evidências, use **ponderação por verossimilhança** ou **MCMC** (amostragem de Gibbs).

Usos: diagnóstico médico e de falhas, filtros de spam (o Naive Bayes é uma rede em que todas as palavras dependem só da classe), sistemas de recomendação, análise de risco.

### 3.2 Cadeias de Markov

Para processos que evoluem no **tempo**, a **propriedade de Markov** diz que o futuro depende só do **presente**, não do passado inteiro: P(Xₜ₊₁ | X₀, ..., Xₜ) = P(Xₜ₊₁ | Xₜ).

Uma **cadeia de Markov** é dada pela **matriz de transição** P, com Pᵢⱼ = probabilidade de ir do estado i para o j.

```
             ensolarado  chuvoso
ensolarado      0,8        0,2
chuvoso         0,4        0,6
```

A distribuição depois de k passos é a inicial vezes Pᵏ. A **distribuição estacionária** π, com πP = π, é o comportamento de longo prazo: é um **autovetor** (Álgebra Linear!). Aqui, π = (2/3, 1/3). O PageRank é exatamente a distribuição estacionária do navegador aleatório.

Cadeias de Markov geram texto (modelos de n-gramas, os ancestrais dos modelos de linguagem), modelam filas e o comportamento de usuários, e estão por trás do MCMC.

### 3.3 Modelos ocultos de Markov

Num **modelo oculto de Markov** (HMM), os estados **não são observados** diretamente: vemos apenas **observações** que dependem do estado. Exemplo: não vemos o clima, só se a pessoa trouxe guarda-chuva. Três peças: P(estado inicial), P(próximo estado | estado) e P(observação | estado).

Perguntas e algoritmos (todos por programação dinâmica sobre o tempo):

- **Filtragem:** qual a distribuição do estado **agora**, dadas as observações até agora? (Algoritmo **forward**.) É o que um robô faz para saber onde está (localização), e é a ideia do **filtro de Kalman** (para estados contínuos, usado em GPS, drones e foguetes).
- **Explicação mais provável:** qual a sequência de estados mais provável? (**Algoritmo de Viterbi**.) Reconhecimento de voz clássico, correção de texto, etiquetagem de classes gramaticais, bioinformática (achar genes no DNA).
- **Aprendizado:** estimar as probabilidades a partir dos dados (algoritmo de Baum-Welch, um caso de EM).

```python
def viterbi(obs, estados, inicial, trans, emissao):
    v = [{s: inicial[s] * emissao[s][obs[0]] for s in estados}]
    caminho = {s: [s] for s in estados}
    for o in obs[1:]:
        v.append({})
        novo = {}
        for s in estados:
            prob, ant = max((v[-2][a] * trans[a][s] * emissao[s][o], a) for a in estados)
            v[-1][s] = prob
            novo[s] = caminho[ant] + [s]
        caminho = novo
    melhor = max(estados, key=lambda s: v[-1][s])
    return caminho[melhor]
```

(Na prática, use **logaritmos** das probabilidades, somando em vez de multiplicar, para não estourar para zero em sequências longas: a etapa de Cálculo, sobre ponto flutuante.)

### 3.4 Decisão sob incerteza

Um agente racional sob incerteza escolhe a ação de maior **utilidade esperada**:

**UE(a) = Σ P(resultado | a) × U(resultado)**

Exemplo: levar ou não o guarda-chuva com 30% de chance de chuva. U(sem guarda-chuva, sol) = 100; U(sem, chuva) = 0; U(com, sol) = 80; U(com, chuva) = 70. UE(levar) = 0,7 × 80 + 0,3 × 70 = 77; UE(não levar) = 0,7 × 100 + 0,3 × 0 = 70. Leve.

**Valor da informação:** quanto vale descobrir algo antes de decidir (consultar a previsão, fazer um exame)? É a diferença entre a utilidade esperada decidindo com a informação e sem ela. Informação só tem valor se pode **mudar a decisão**.

Funções de utilidade capturam preferências e atitudes diante do risco (a maioria das pessoas prefere R$ 1 milhão garantido a 50% de chance de R$ 3 milhões, embora a média do segundo seja maior: a utilidade do dinheiro é **côncava**). **Redes de decisão** juntam redes bayesianas com nós de decisão e utilidade.

### Atividades de fixação do Tema 3

1. Na rede do alarme, com P(Roubo) = 0,001; P(Terremoto) = 0,002; P(Alarme | R, T) = 0,95; P(A | R, ¬T) = 0,94; P(A | ¬R, T) = 0,29; P(A | ¬R, ¬T) = 0,001; P(João | A) = 0,90; P(João | ¬A) = 0,05; P(Maria | A) = 0,70; P(Maria | ¬A) = 0,01. Calcule P(Roubo | João, Maria) por enumeração (use Python).
2. Estime a mesma probabilidade por amostragem com ponderação por verossimilhança, com 10⁴ e 10⁶ amostras.
3. Ache a distribuição estacionária da cadeia do clima do texto resolvendo πP = π, e confira calculando P¹⁰⁰.
4. Gere frases com uma cadeia de Markov de ordem 2 treinada num livro de domínio público. Por que o texto parece "quase certo"?
5. Um HMM tem estados {Saudável, Febre} e observações {normal, frio, tontura}. Com os parâmetros clássicos do exemplo da Wikipédia (*Viterbi algorithm*), qual a sequência mais provável para as observações normal, frio, tontura?
6. Um exame custa R$ 200 e diz com certeza se um equipamento de R$ 10.000 vai quebrar (probabilidade 5%). Se for quebrar, uma manutenção de R$ 1.000 evita a quebra. Vale fazer o exame? E fazer a manutenção sempre, sem exame?

## Tema 4: Aprendizado por reforço e ética

**Objetivo:** entender como agentes aprendem a agir por tentativa e erro, e as questões éticas e de segurança da IA.

### 4.1 Processos de decisão de Markov

Um **processo de decisão de Markov** (MDP) modela decisões **sequenciais** sob incerteza: estados S, ações A, transições P(s′ | s, a), **recompensas** R(s, a, s′) e um **fator de desconto** γ ∈ [0, 1) (recompensas futuras valem menos que as imediatas). Uma **política** π diz que ação tomar em cada estado. Objetivo: a política que maximiza a soma descontada esperada de recompensas.

O valor ótimo de cada estado satisfaz a **equação de Bellman**:

**V\*(s) = max_a Σ_s′ P(s′ | s, a) [R(s, a, s′) + γ V\*(s′)]**

("o valor de um estado é o da melhor ação: a recompensa imediata mais o valor descontado de onde se chega"). É programação dinâmica, de novo.

**Iteração de valor:** comece com V = 0 e aplique a equação de Bellman repetidamente até convergir (converge porque γ < 1 faz cada iteração encolher o erro). Depois, a política ótima escolhe em cada estado a ação que atinge o máximo. **Iteração de política** alterna avaliar a política atual e melhorá-la.

Exemplo clássico: um robô numa grade, com movimentos que às vezes escorregam para o lado (80% vai na direção pedida, 10% para cada lado), uma casa com recompensa +1, uma armadilha com −1, e uma pequena penalidade a cada passo.

### 4.2 Q-learning

E se o agente **não conhece** as probabilidades de transição nem as recompensas? Ele precisa aprender **interagindo**: é o **aprendizado por reforço**.

O **Q-learning** aprende Q(s, a), o valor de tomar a ação a no estado s e depois agir otimamente, atualizando a cada experiência (s, a, r, s′):

**Q(s, a) ← Q(s, a) + α [r + γ max_a′ Q(s′, a′) − Q(s, a)]**

(α é a taxa de aprendizado; o termo entre colchetes é o **erro de diferença temporal**: a surpresa entre o que se esperava e o que se observou.)

```python
import random
from collections import defaultdict

Q = defaultdict(float)
def escolhe(s, acoes, eps=0.1):
    if random.random() < eps:
        return random.choice(acoes)                    # explora
    return max(acoes, key=lambda a: Q[(s, a)])          # aproveita

for episodio in range(10_000):
    s = ambiente.reinicia()
    while not ambiente.terminou():
        a = escolhe(s, ambiente.acoes(s))
        s2, r = ambiente.passo(a)
        melhor = max((Q[(s2, a2)] for a2 in ambiente.acoes(s2)), default=0)
        Q[(s, a)] += 0.1 * (r + 0.99 * melhor - Q[(s, a)])
        s = s2
```

**Exploração contra aproveitamento:** para aprender, o agente precisa às vezes tentar ações que parecem piores (ε-gulosa: ação aleatória com probabilidade ε). Aproveitar demais trava numa estratégia medíocre; explorar demais desperdiça.

Com estados demais para uma tabela (imagens de um jogo), Q é aproximado por uma **rede neural**: o **DQN** da DeepMind (2015) aprendeu a jogar dezenas de jogos de Atari a partir dos pixels. Métodos de **gradiente de política** (REINFORCE, PPO) otimizam a política diretamente. O **AlphaGo** (2016) e o **AlphaZero** combinaram redes neurais, MCTS e autojogo. E o **RLHF** (aprendizado por reforço com feedback humano) é uma etapa do treinamento de assistentes como o ChatGPT e o Claude.

### 4.3 Ética em IA

Sistemas de IA tomam ou apoiam decisões sobre pessoas: crédito, contratação, policiamento, saúde, moderação de conteúdo. Questões centrais (aprofundadas na etapa de Ética):

- **Viés e discriminação:** modelos aprendem padrões dos dados, inclusive os injustos. O sistema de triagem de currículos da Amazon (abandonado em 2018) penalizava currículos com a palavra "women's"; sistemas de reconhecimento facial erram muito mais com mulheres negras (estudo *Gender Shades*, 2018).
- **Transparência e explicabilidade:** pessoas afetadas por decisões automatizadas têm direito a entender os critérios (a LGPD, no Brasil, prevê revisão de decisões automatizadas).
- **Privacidade:** modelos treinados com dados pessoais podem memorizá-los e vazá-los.
- **Responsabilidade:** quem responde quando um carro autônomo causa um acidente?
- **Impacto no trabalho** e concentração de poder.

### 4.4 Segurança em IA

Problemas técnicos de garantir que sistemas de IA façam o que se pretende:

- **Especificação de recompensa:** o agente otimiza **exatamente** o que foi medido, não o que se queria (*reward hacking*). Exemplo real: um agente de corrida de barcos que descobriu que ganhava mais pontos andando em círculos sobre itens que reapareciam do que terminando a corrida. É a **lei de Goodhart** ("quando uma medida vira meta, deixa de ser uma boa medida").
- **Robustez:** modelos falham em situações diferentes das do treino, e **exemplos adversariais** (perturbações imperceptíveis numa imagem) podem enganá-los.
- **Alinhamento:** garantir que sistemas cada vez mais capazes sigam as intenções e valores humanos, inclusive em situações não previstas. É uma área de pesquisa ativa (interpretabilidade, supervisão escalável, avaliação de capacidades perigosas).
- **Uso indevido:** desinformação em escala, fraudes com vozes e vídeos sintéticos, ataques cibernéticos automatizados.

Bons engenheiros de IA tratam esses riscos como requisitos, não como notas de rodapé: avaliam modelos em dados representativos, medem desempenho por grupo, documentam limitações (*model cards*), mantêm humanos no circuito em decisões de alto impacto e monitoram o sistema em produção.

### Atividades de fixação do Tema 4

1. Para a grade 4 × 3 do livro de Russell e Norvig (robô com movimentos escorregadios, +1 e −1 em duas casas terminais, penalidade de −0,04 por passo, γ = 1), implemente a iteração de valor e mostre a política ótima. O que muda com penalidade −2 por passo? E com +0,1?
2. Implemente Q-learning para o ambiente `FrozenLake` (biblioteca Gymnasium) e faça o gráfico da taxa de sucesso ao longo dos episódios.
3. Teste valores de ε (0; 0,1; 0,5) no Q-learning do exercício 2. O que acontece com ε = 0?
4. Descreva um exemplo de *reward hacking* que poderia acontecer num sistema de recomendação que otimiza "tempo de tela".
5. Escolha um sistema de IA usado no Brasil (concessão de crédito, triagem em saúde, reconhecimento facial em segurança pública) e liste: quem é afetado, que vieses podem aparecer, que mecanismos de transparência e contestação existem.

## Projeto da etapa

Faça os dois:

**1. Agente que joga um jogo de tabuleiro:**

- Implemente um jogo (Connect Four, Othello ou damas) com uma interface simples.
- Agente com minimax e poda alfa-beta, função de avaliação própria, ordenação de lances e aprofundamento iterativo com limite de tempo por jogada.
- Meça o efeito de cada melhoria: nós avaliados por jogada e taxa de vitórias entre versões (100 partidas cada).
- Bônus: um agente com MCTS e a comparação entre os dois.

**2. Resolvedor de restrições:**

- Um resolvedor genérico de CSP (variáveis, domínios, restrições binárias e "todos diferentes") com backtracking, MRV, grau, valor menos restritivo, verificação adiante e AC-3.
- Aplicações: sudoku (com a leitura de tabuleiros de um arquivo) e uma **grade de horários** de um curso real (disciplinas, professores, salas e horários indisponíveis).
- Comparação do número de nós e do tempo com cada heurística ligada e desligada, e com o OR-Tools CP-SAT.

## Para ir além

- *Artificial Intelligence: A Modern Approach* (Russell e Norvig): o livro-texto padrão, com código em Python no repositório aima-python.
- **CS50 AI** (Harvard, gratuito no edX): aulas e projetos (Degrees, Tic-Tac-Toe, Minesweeper, Crossword, Heredity, Nim...).
- **MIT 6.034** no OpenCourseWare (aulas de Patrick Winston) e **Berkeley CS 188** (com os projetos do Pac-Man, públicos).
- *Reinforcement Learning: An Introduction* (Sutton e Barto, gratuito online).
- *Probabilistic Graphical Models* (Koller e Friedman), para aprofundar em redes bayesianas.
- Para segurança em IA: o curso *AI Safety Fundamentals* (BlueDot Impact, gratuito) e *The Alignment Problem* (Brian Christian).

## Resumão

- Agente racional: maximiza o desempenho esperado. Propriedades do ambiente definem a técnica.
- Busca: estados, ações, transições, objetivo, custo. BFS ótima com custos iguais; DFS econômica em memória; aprofundamento iterativo une os dois.
- A\*: f = g + h. Heurística admissível garante ótimo; mais informada expande menos. Heurísticas vêm de problemas relaxados.
- Minimax para jogos de soma zero; alfa-beta poda e dobra a profundidade com boa ordenação; MCTS para espaços enormes.
- Lógica de primeira ordem expressa regras gerais. Inferência: modelos, resolução, encadeamento para a frente e para trás.
- CSP: variáveis, domínios, restrições. Backtracking com MRV, verificação adiante e AC-3; min-conflitos para instâncias enormes.
- Redes bayesianas: conjunta compacta por independência condicional. Inferência exata ou por amostragem.
- Markov: o futuro depende só do presente. Estacionária é autovetor. HMM: filtragem (forward) e Viterbi, por PD.
- Decisão: maximize a utilidade esperada. Informação vale se pode mudar a decisão.
- MDP e Bellman; iteração de valor. Q-learning aprende sem modelo; equilibre exploração e aproveitamento.
- Ética: viés, transparência, privacidade, responsabilidade. Segurança: recompensa mal especificada, robustez, alinhamento, uso indevido.
