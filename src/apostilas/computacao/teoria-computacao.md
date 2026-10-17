# Teoria da Computação: Apostila Prática

Roadmap Ciência da Computação · Semanas 59 a 64

## Comece por aqui

Até aqui, você estudou como resolver problemas. Esta etapa pergunta o contrário: **o que não dá para resolver**, e **o que não dá para resolver rápido**. As respostas são algumas das ideias mais profundas do século XX: existem problemas bem definidos que **nenhum** programa resolve, e existe uma enorme classe de problemas (os NP-completos) que ninguém sabe resolver eficientemente, valendo um prêmio de 1 milhão de dólares para quem descobrir se é possível. No caminho, você aprende os autômatos e gramáticas que estão por trás de expressões regulares, compiladores, protocolos e validadores.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CTC-34 Autômatos e Linguagens Formais; CTC-23 Análise de Algoritmos e Complexidade Computacional |
| MIT | 6.1400 (antiga 18.404J/6.840) Theory of Computation (Michael Sipser) |
| Harvard | CS 1210 (antiga CS 121) Introduction to Theoretical Computer Science |
| Oxford | Models of Computation (2º ano); Computational Complexity |

### Como esta apostila funciona

1. Desenhe os autômatos. Use o **JFLAP** (gratuito) ou o site *automatonsimulator* para testá-los com várias entradas.
2. As provas desta etapa (bombeamento, diagonalização, reduções) seguem moldes. Aprenda o molde de cada uma e repita.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** não consegue montar um autômato? Pergunte: "o que eu preciso **lembrar** sobre o que já li para decidir o resto?". Cada coisa diferente que precisa ser lembrada é um estado.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 59 | Tema 1: Autômatos finitos |
| 60 | Tema 2: Expressões regulares |
| 61 | Tema 3: Gramáticas e autômatos de pilha |
| 62 | Tema 4: Máquinas de Turing e decidibilidade |
| 63 | Tema 5: P e NP |
| 64 | Tema 6: Além de NP + projeto |

## Tema 1: Autômatos finitos

**Objetivo:** modelar máquinas com memória finita e entender o que elas conseguem reconhecer.

### 1.1 Linguagens formais

Vocabulário da etapa:

- **Alfabeto** Σ: um conjunto finito de símbolos. Ex.: {0, 1}.
- **Cadeia** (*string*): sequência finita de símbolos. A cadeia vazia é **ε**.
- **Σ\***: todas as cadeias sobre Σ (infinitas, mas cada uma finita).
- **Linguagem**: qualquer conjunto de cadeias, L ⊆ Σ\*. Ex.: as cadeias binárias com número par de 1s.

Todo **problema de decisão** (pergunta de sim ou não) é uma linguagem: "este número é primo?" é a linguagem {representações binárias de primos}. Resolver o problema é **decidir se uma cadeia pertence à linguagem**. Essa troca de ponto de vista permite estudar todos os problemas com as mesmas ferramentas.

### 1.2 DFA

Um **autômato finito determinístico** (DFA) lê a cadeia símbolo por símbolo, mudando de estado, e no fim **aceita** ou **rejeita**. Formalmente, uma quíntupla (Q, Σ, δ, q₀, F):

- Q: conjunto finito de estados;
- δ: Q × Σ → Q, a função de transição (exatamente uma transição por estado e símbolo);
- q₀: o estado inicial;
- F ⊆ Q: os estados de aceitação.

Exemplo: cadeias binárias com número **par de 1s**.

```
        0           0
       ┌─┐         ┌─┐
       ▼ │    1    ▼ │
  →((par))──────►(ímpar)
         ◄──────
            1
```

Estados: "par" (inicial e de aceitação) e "ímpar". Ler 0 não muda; ler 1 alterna.

```python
def dfa_aceita(delta, inicial, finais, cadeia):
    estado = inicial
    for c in cadeia:
        estado = delta[(estado, c)]
    return estado in finais

delta = {("par", "0"): "par", ("par", "1"): "impar",
         ("impar", "0"): "impar", ("impar", "1"): "par"}
dfa_aceita(delta, "par", {"par"}, "1011")    # False (três 1s)
```

Um DFA usa **memória constante** e tempo linear. Onde aparecem: analisadores léxicos de compiladores, protocolos de rede (estados de uma conexão TCP), máquinas de estado de jogos e interfaces, controladores embarcados, validação de entradas.

Uma linguagem reconhecida por algum DFA é chamada **regular**.

### 1.3 NFA

Um **autômato finito não determinístico** (NFA) pode ter, para um estado e símbolo, **zero, uma ou várias** transições, e também transições **ε** (sem ler nada). Ele aceita se **algum** caminho possível termina num estado de aceitação. Pense que ele "adivinha" o caminho certo, ou que explora todos em paralelo.

Exemplo: cadeias binárias cujo **antepenúltimo** símbolo é 1. O NFA tem 4 estados: espera em q₀ lendo qualquer coisa; ao ver um 1, "aposta" que é o antepenúltimo e vai para q₁; depois lê mais dois símbolos quaisquer até q₃ (aceitação). Um DFA para a mesma linguagem precisa de 8 estados (lembrar os últimos 3 símbolos).

NFAs são mais **fáceis de projetar** e mais **compactos**.

### 1.4 Equivalência entre DFA e NFA

**Teorema:** para todo NFA existe um DFA que reconhece a mesma linguagem.

**Construção dos subconjuntos:** cada estado do DFA é um **conjunto** de estados do NFA (todos aqueles em que o NFA poderia estar). O estado inicial é o fecho-ε de {q₀}; a transição de um conjunto S com o símbolo a é o fecho-ε de todos os estados alcançáveis a partir de S lendo a; um conjunto é de aceitação se contém algum estado de aceitação do NFA.

```python
def nfa_aceita(delta, inicial, finais, cadeia):       # simula sem construir o DFA
    atuais = {inicial}
    for c in cadeia:
        atuais = {q2 for q in atuais for q2 in delta.get((q, c), ())}
    return bool(atuais & finais)
```

O DFA pode ter até **2ⁿ** estados (e para o "n-ésimo símbolo do fim é 1", precisa mesmo). Não determinismo não aumenta o **poder** dos autômatos finitos, mas pode economizar exponencialmente em **tamanho**.

**Propriedades de fechamento:** linguagens regulares são fechadas para união, interseção, complemento (troque estados finais e não finais de um DFA), concatenação e estrela de Kleene. A interseção sai do **autômato produto** (estados são pares, roda os dois em paralelo).

### Atividades de fixação do Tema 1

1. Desenhe DFAs sobre {0, 1} para: (a) cadeias que terminam em "01"; (b) cadeias com pelo menos dois 0s; (c) cadeias que **não** contêm "11"; (d) números binários divisíveis por 3 (lidos do mais significativo para o menos).
2. Desenhe um NFA para cadeias que contêm "101" como subcadeia. Converta-o em DFA pela construção dos subconjuntos.
3. Quantos estados tem o menor DFA para "o terceiro símbolo a partir do fim é 1"? Por que não dá com menos? (Pense em pares de cadeias que precisam ser distinguidas.)
4. Construa o autômato produto para "número par de 0s **e** número ímpar de 1s".
5. Implemente um simulador de DFA que lê a descrição de um arquivo JSON e testa uma lista de cadeias.

## Tema 2: Expressões regulares

**Objetivo:** descrever linguagens regulares com expressões, provar que certas linguagens não são regulares e minimizar autômatos.

### 2.1 Expressões regulares

Uma **expressão regular** descreve uma linguagem com três operações sobre linguagens mais simples:

| Operação | Notação | Significado |
|---|---|---|
| União | R ∣ S | cadeias de R ou de S |
| Concatenação | RS | uma de R seguida de uma de S |
| Estrela de Kleene | R\* | zero ou mais cadeias de R concatenadas |

Bases: ∅ (nenhuma cadeia), ε (só a vazia) e cada símbolo a.

Exemplos sobre {0, 1}:

- (0 ∣ 1)\*1 : cadeias que terminam em 1.
- 0\*10\*10\* : exatamente dois 1s.
- (0 ∣ 1)\*101(0 ∣ 1)\* : contém 101.
- (00)\* : número par de 0s (e nada mais).

**Teorema de Kleene:** uma linguagem é regular (tem DFA) **se e somente se** é descrita por uma expressão regular. A ida, expressão → NFA, é a **construção de Thompson** (um pedaço de NFA para cada operação, ligados por ε). A volta, autômato → expressão, elimina estados um a um.

As **regex** das linguagens de programação (`re` no Python, `grep`) partem dessa teoria e acrescentam atalhos (`+`, `?`, `[a-z]`, `\d`). Algumas extensões, como **retrorreferências** (`(a+)\1`), vão **além** das linguagens regulares e tornam a busca exponencial no pior caso. Motores como o RE2 (Google) e o do Rust recusam essas extensões e garantem tempo linear simulando o NFA.

> **Cuidado! Cai na prática:** expressões como `(a+)+b` em motores com retrocesso (Python, Java, JavaScript) levam tempo **exponencial** numa cadeia como "aaaaaaaaaaaaaaaaaaaaaaaaaac". Isso já derrubou serviços em produção (o ataque **ReDoS**).

### 2.2 Lema do bombeamento

Como provar que uma linguagem **não** é regular? Um DFA com p estados, lendo uma cadeia de tamanho ≥ p, passa por p + 1 estados, então **repete** algum (casas dos pombos). O trecho entre as duas visitas é um laço, que pode ser percorrido 0, 1, 2, ... vezes.

**Lema do bombeamento:** se L é regular, existe p (o comprimento de bombeamento) tal que toda cadeia s ∈ L com |s| ≥ p pode ser dividida em s = xyz com:

1. |y| ≥ 1,
2. |xy| ≤ p,
3. xyⁱz ∈ L para todo i ≥ 0.

**Molde da prova** de que L não é regular (é um jogo contra um adversário):

1. Suponha que L é regular, com comprimento de bombeamento p.
2. **Você escolhe** uma cadeia s ∈ L com |s| ≥ p (escolha bem!).
3. **O adversário escolhe** qualquer divisão xyz respeitando 1 e 2.
4. **Você mostra** um i com xyⁱz ∉ L. Contradição.

**Exemplo: L = {0ⁿ1ⁿ : n ≥ 0} não é regular.** Escolha s = 0ᵖ1ᵖ. Como |xy| ≤ p, x e y estão dentro dos 0s, e y = 0ᵏ com k ≥ 1. Então xy²z = 0ᵖ⁺ᵏ1ᵖ, com mais 0s que 1s, fora de L. ∎

Intuição: reconhecer 0ⁿ1ⁿ exige **contar** sem limite, e um DFA tem memória finita. Pela mesma razão, **parênteses balanceados** não são regulares, e por isso não dá para fazer o parser de uma linguagem de programação (ou de HTML) só com expressões regulares.

### 2.3 Minimização de autômatos

Para toda linguagem regular existe um **único DFA mínimo** (a menos de renomear estados). Dois estados são **equivalentes** se, para toda cadeia w, a partir de ambos w leva a aceitação nos dois ou nos dois a rejeição.

**Algoritmo (refinamento de partições):**

1. Remova estados inalcançáveis.
2. Comece com duas classes: finais e não finais.
3. Divida uma classe sempre que dois estados dela, com algum símbolo, vão para classes diferentes.
4. Repita até estabilizar. Cada classe vira um estado do DFA mínimo.

O algoritmo de Hopcroft faz isso em O(n log n).

**Teorema de Myhill-Nerode:** o número de estados do DFA mínimo é o número de classes da relação "x ≡ y se, para todo z, xz ∈ L ⟺ yz ∈ L". Se essa relação tiver **infinitas** classes, L não é regular. É uma alternativa ao bombeamento, muitas vezes mais limpa: para 0ⁿ1ⁿ, as cadeias 0, 00, 000, ... são todas distintas (0ⁱ seguido de 1ⁱ é aceito, mas 0ʲ seguido de 1ⁱ não, para j ≠ i).

### Atividades de fixação do Tema 2

1. Escreva expressões regulares para: (a) cadeias binárias com número par de 1s; (b) cadeias que não contêm "00"; (c) e-mails simplificados (letras, um @, letras, um ponto, letras); (d) números decimais com sinal opcional e parte fracionária opcional.
2. Construa o NFA de Thompson para (a ∣ b)\*abb.
3. Prove pelo lema do bombeamento que não são regulares: (a) {ww : w ∈ {0, 1}\*}; (b) {0^(n²) : n ≥ 0}; (c) cadeias com o mesmo número de 0s e 1s.
4. A linguagem {0ⁿ1ᵐ : n, m ≥ 0} é regular? E {0ⁿ1ᵐ : n ≠ m}?
5. Minimize o DFA sobre {a, b} com estados A (inicial), B, C, D, E (finais: C e E) e transições: A: a→B, b→C; B: a→B, b→D; C: a→B, b→C; D: a→B, b→E; E: a→B, b→C.
6. Teste em Python o tempo de `re.match(r"(a+)+b", "a" * n + "c")` para n = 15, 20, 25. Explique.

## Tema 3: Gramáticas e autômatos de pilha

**Objetivo:** descrever linguagens com estrutura aninhada e entender como são reconhecidas.

### 3.1 Gramáticas livres de contexto

Uma **gramática livre de contexto** (GLC) gera cadeias por **regras de substituição**. Ela tem variáveis (não terminais), terminais (os símbolos do alfabeto), regras e uma variável inicial.

Gramática para 0ⁿ1ⁿ (que não é regular):

```
S → 0S1 | ε
```

Gramática para expressões aritméticas:

```
E → E + T | T
T → T * F | F
F → ( E ) | num
```

Gramáticas descrevem a sintaxe de **todas** as linguagens de programação (a especificação do Python, do Java e do JSON está em notação BNF ou EBNF), formatos de dados, protocolos e até a estrutura de frases em linguística (de onde a ideia veio, com Noam Chomsky).

Toda linguagem regular é livre de contexto, mas não o contrário. **Hierarquia de Chomsky:** regulares ⊂ livres de contexto ⊂ sensíveis ao contexto ⊂ recursivamente enumeráveis.

### 3.2 Árvores de derivação

Uma **derivação** aplica regras a partir de S até sobrar só terminais. A **árvore de derivação** (árvore sintática) mostra a estrutura:

```
       E
     / | \
    E  +  T
    |   / | \
    T  T  *  F
    |  |     |
    F  F    num(4)
    |  |
 num(2) num(3)
```

Essa árvore para "2 + 3 \* 4" agrupa 3 \* 4 primeiro: a gramática codificou a **precedência** (multiplicação "mais funda" na árvore) e a **associatividade** à esquerda (E → E + T).

Uma gramática é **ambígua** se alguma cadeia tem duas árvores diferentes. E → E + E | E \* E | num é ambígua: "2 + 3 \* 4" pode ser agrupado como (2 + 3) \* 4. Em linguagens de programação, ambiguidade é um defeito; um exemplo histórico é o "else pendurado" (`if a then if b then x else y`: o else é de qual if?).

### 3.3 Autômatos de pilha

Um **autômato de pilha** (PDA) é um NFA com uma **pilha** ilimitada. A cada passo, lê (ou não) um símbolo, consulta e altera o topo da pilha e muda de estado.

PDA para 0ⁿ1ⁿ: para cada 0 lido, empilhe um X; para cada 1, desempilhe um X; aceite se a pilha esvaziar exatamente no fim.

**Teorema:** uma linguagem é livre de contexto se e somente se algum PDA (não determinístico) a reconhece.

Ao contrário dos autômatos finitos, aqui o não determinismo **aumenta** o poder: {wwᴿ} (palíndromos de tamanho par) precisa "adivinhar" o meio; não há PDA determinístico para ela. Por isso os parsers de compiladores usam **subclasses** de gramáticas que admitem reconhecimento determinístico eficiente (LL e LR).

**Lema do bombeamento para GLCs** (bombeia dois trechos ao mesmo tempo) mostra que {aⁿbⁿcⁿ} **não** é livre de contexto: uma pilha só consegue casar uma contagem com outra, não três. Livres de contexto são fechadas para união, concatenação e estrela, mas **não** para interseção nem complemento.

### 3.4 Parsing

**Parsing** é descobrir a árvore de derivação de uma cadeia. O algoritmo geral **CYK** funciona para qualquer GLC (em forma normal de Chomsky) em O(n³), por programação dinâmica sobre substrings. É lento para compiladores; eles usam:

- **Descendente recursivo** (LL): uma função por variável, decidindo a regra olhando o próximo token. Simples, escrito à mão (GCC, Clang, o parser do Go). Não aceita recursão à esquerda (E → E + T vira E → T (+ T)\*).
- **Ascendente** (LR, LALR): lê tokens empilhando e "reduz" quando o topo da pilha forma o lado direito de uma regra. Mais poderoso, gerado por ferramentas (yacc, Bison).

```python
# descendente recursivo para E → T (+ T)*, T → F (* F)*, F → num | ( E )
def parse(tokens):
    pos = 0
    def olha():
        return tokens[pos] if pos < len(tokens) else None
    def consome(esperado=None):
        nonlocal pos
        t = tokens[pos]
        if esperado and t != esperado:
            raise SyntaxError(f"esperava {esperado}, veio {t}")
        pos += 1
        return t
    def E():
        v = T()
        while olha() == "+":
            consome("+"); v = ("+", v, T())
        return v
    def T():
        v = F()
        while olha() == "*":
            consome("*"); v = ("*", v, F())
        return v
    def F():
        if olha() == "(":
            consome("("); v = E(); consome(")")
            return v
        return int(consome())
    arvore = E()
    if pos != len(tokens):
        raise SyntaxError("sobrou entrada")
    return arvore

parse(["2", "+", "3", "*", "4"])    # ('+', 2, ('*', 3, 4))
```

Você vai construir um parser completo em Compiladores; aqui está a ponte entre a teoria e a prática.

### Atividades de fixação do Tema 3

1. Escreva gramáticas para: (a) parênteses balanceados; (b) palíndromos sobre {a, b}; (c) {aⁱbʲ : i ≥ j}; (d) cadeias com o mesmo número de as e bs.
2. Mostre que E → E + E | E \* E | (E) | num é ambígua com duas árvores para "1 + 2 \* 3". Que valores cada árvore dá?
3. Desenhe a árvore de derivação de "(2 + 3) \* 4" na gramática não ambígua do texto.
4. Descreva um PDA para palíndromos de tamanho par sobre {a, b}. Onde está o não determinismo?
5. Use o lema do bombeamento para GLCs (ou o argumento informal da pilha) para explicar por que {aⁿbⁿcⁿ} não é livre de contexto.
6. Estenda o parser descendente recursivo com subtração, divisão e menos unário, mantendo a associatividade à esquerda, e escreva um avaliador da árvore.

## Tema 4: Máquinas de Turing e decidibilidade

**Objetivo:** definir o que é computável e provar que existem problemas que nenhum programa resolve.

### 4.1 Máquinas de Turing

Em 1936, Alan Turing propôs um modelo simples de "computador": uma **fita infinita** dividida em células, uma **cabeça** que lê e escreve uma célula por vez e anda para a esquerda ou direita, e um conjunto **finito** de estados. A cada passo, de acordo com o estado e o símbolo lido, a máquina escreve um símbolo, move a cabeça e muda de estado. Ela pode **aceitar**, **rejeitar** ou **rodar para sempre**.

Máquina para {0ⁿ1ⁿ} (ideia): marque o primeiro 0 com X, vá até o primeiro 1 e marque com Y, volte, repita; aceite se tudo foi marcado aos pares.

Diferenças em relação aos autômatos: a fita é memória **ilimitada**, de leitura e escrita, com acesso nos dois sentidos. Com isso, uma máquina de Turing reconhece {aⁿbⁿcⁿ}, {ww}, primos, e tudo o mais que um computador reconhece.

Variantes (várias fitas, não determinismo, fita infinita nos dois lados) têm **o mesmo poder**: uma simula a outra (às vezes com perda de eficiência, mas sem mudar o que dá para computar).

**Máquina universal:** uma máquina de Turing U que recebe a **descrição** de outra máquina M e uma entrada w, e simula M sobre w. É o conceito de **programa armazenado**: o mesmo hardware executa qualquer software. O computador moderno é uma máquina universal (com memória finita).

### 4.2 Tese de Church-Turing

**Tese de Church-Turing:** tudo o que é **computável por um procedimento mecânico** é computável por uma máquina de Turing.

Não é um teorema (não dá para provar, porque "procedimento mecânico" é uma noção informal), mas todos os modelos de computação propostos (cálculo λ de Church, funções recursivas, linguagens de programação, autômatos celulares) mostraram-se **equivalentes**. Uma linguagem é **Turing-completa** se consegue simular uma máquina de Turing: Python, C, Haskell, mas também o Jogo da Vida de Conway, o Excel com fórmulas e até o Minecraft.

Consequência prática: para saber se algo é computável, não importa a linguagem nem o hardware.

### 4.3 Decidibilidade

Uma linguagem é:

- **Decidível** (recursiva) se existe uma máquina que **sempre para** e responde corretamente sim ou não.
- **Reconhecível** (recursivamente enumerável) se existe uma máquina que para e diz sim para as cadeias da linguagem, mas pode rodar para sempre nas outras.

Exemplos decidíveis: "este DFA aceita esta cadeia?", "a linguagem deste DFA é vazia?", "este número é primo?", "esta GLC gera esta cadeia?".

Pelo argumento de contagem da Matemática Discreta, já sabemos que existem linguagens indecidíveis (há incontáveis linguagens e só contáveis máquinas). A pergunta é: existe alguma **natural**?

### 4.4 Problema da parada

**Problema da parada:** dados um programa P e uma entrada w, P para quando roda com w?

**Teorema (Turing, 1936):** o problema da parada é **indecidível**.

*Prova (diagonalização).* Suponha que existe um programa `para(P, w)` que sempre termina e responde corretamente se P para com a entrada w. Construa:

```python
def diagonal(P):
    if para(P, P):          # P para quando recebe a si mesmo como entrada?
        while True:         # então eu rodo para sempre
            pass
    else:
        return              # senão, eu paro
```

Agora rode `diagonal(diagonal)`. Se `para(diagonal, diagonal)` responder "para", então `diagonal(diagonal)` entra no laço infinito, e não para. Se responder "não para", `diagonal(diagonal)` retorna, e para. Nos dois casos `para` errou. Contradição: `para` não existe. ∎

É a mesma diagonalização de Cantor: a máquina `diagonal` difere de cada máquina P no comportamento sobre a entrada P.

Consequências práticas: nenhum compilador ou ferramenta consegue detectar **todos** os laços infinitos; nenhum antivírus consegue decidir com perfeição se um programa é malicioso; nenhum analisador estático consegue achar **todos** os bugs **sem** falsos alarmes. As ferramentas reais funcionam porque aceitam errar para um dos lados (alarmes falsos, ou casos não analisados).

O problema da parada é **reconhecível** (simule e diga sim se parar), mas seu complemento não é. Uma linguagem é decidível sse ela e seu complemento são reconhecíveis.

### 4.5 Reduções

Para provar que um problema B é indecidível, **reduza** um problema sabidamente indecidível (como a parada) a B: mostre que, se B fosse decidível, a parada também seria.

**Exemplo:** "este programa imprime 'olá'?" é indecidível. *Redução:* dado (P, w), construa o programa Q que roda P com w (descartando qualquer saída de P) e, se terminar, imprime "olá". Q imprime "olá" sse P para com w. Um decisor de "imprime olá" decidiria a parada. ∎

**Teorema de Rice:** **qualquer** propriedade **não trivial** do **comportamento** de programas (da linguagem que eles reconhecem) é indecidível. "Este programa calcula a função quadrado?", "este programa aceita alguma entrada?", "estes dois programas são equivalentes?": todas indecidíveis. Propriedades do **texto** (tem mais de 100 linhas? usa a variável x?) não entram no teorema e podem ser decidíveis.

Outros indecidíveis famosos: o **problema da correspondência de Post** (um quebra-cabeça de dominós), saber se uma GLC é ambígua, se duas GLCs geram a mesma linguagem, e o décimo problema de Hilbert (se uma equação polinomial tem solução inteira).

### Atividades de fixação do Tema 4

1. Descreva em alto nível (sem tabela completa) uma máquina de Turing que decide {w#w : w ∈ {0, 1}\*}.
2. Escreva em Python um simulador de máquina de Turing (estado, fita como dicionário, cabeça) e programe uma máquina que soma 1 a um número binário.
3. Explique por que "o DFA M aceita a cadeia w?" é decidível e "a máquina de Turing M aceita a cadeia w?" não é.
4. Prove por redução da parada que é indecidível saber se um programa para com **a entrada vazia**.
5. Use o teorema de Rice para classificar: (a) "o programa P aceita a cadeia 'abc'"; (b) "o programa P tem mais de 50 estados"; (c) "a linguagem de P é regular"; (d) "P para em menos de 100 passos com a entrada vazia". (Cuidado com a última.)
6. Um antivírus anuncia "detectamos 100% dos vírus sem nenhum falso positivo". Por que isso é impossível? Defina "vírus" como "programa que, em algum momento, apaga arquivos do usuário".

## Tema 5: P e NP

**Objetivo:** classificar problemas pelo custo de resolvê-los e entender a NP-completude.

### 5.1 Classe P

Entre os problemas decidíveis, alguns são **viáveis** e outros não. A convenção: um problema é viável se pode ser resolvido em **tempo polinomial** no tamanho da entrada, O(nᵏ) para alguma constante k.

**P** é a classe dos problemas de decisão resolvíveis em tempo polinomial (por uma máquina de Turing determinística, ou, de forma equivalente, por qualquer computador razoável).

Exemplos em P: ordenar, caminhos mínimos, árvore geradora mínima, fluxo máximo, emparelhamento, programação linear, testar se um número é primo (algoritmo AKS, 2002), 2-SAT.

Por que "polinomial"? É robusto (não depende do modelo de computador), compõe bem (polinômio de polinômio é polinômio) e, na prática, problemas em P costumam ter algoritmos com expoentes pequenos. Uma exponencial, ao contrário, fica inviável muito rápido: 2¹⁰⁰ operações não terminam antes do fim do universo.

> **Cuidado! Cai na prova:** "polinomial no tamanho da entrada" se refere ao número de **bits**. A mochila em O(nW) não é polinomial, porque W ocupa só log W bits. Fatorar N testando divisores até √N também não: é exponencial no número de dígitos de N.

### 5.2 Classe NP

**NP** é a classe dos problemas de decisão em que uma resposta "sim" tem um **certificado** que pode ser **verificado** em tempo polinomial.

- **SAT** (uma fórmula booleana é satisfatível?): certificado = uma valoração; verificar = avaliar a fórmula.
- **Caminho hamiltoniano** (existe caminho passando por todos os vértices uma vez?): certificado = o caminho.
- **Clique** (existe um grupo de k vértices todos ligados entre si?): certificado = os k vértices.
- **Sudoku generalizado, coloração com 3 cores, soma de subconjuntos, caixeiro-viajante (versão "existe rota de custo ≤ k?")**.

"NP" significa *nondeterministic polynomial*: são os problemas que uma máquina **não determinística** resolve em tempo polinomial, "adivinhando" o certificado. Atenção: NP **não** significa "não polinomial".

Todo problema em P está em NP (o certificado pode ser vazio: basta resolver). A grande pergunta:

**P = NP?** Se todo problema cuja solução é fácil de **verificar** também é fácil de **encontrar**. Quase todos acreditam que **não**, mas ninguém conseguiu provar. É um dos sete Problemas do Milênio do Instituto Clay (prêmio de US$ 1 milhão). Se P = NP, grande parte da criptografia atual quebraria (achar a chave é um problema NP), e muita otimização e até demonstração de teoremas ficariam automáticas.

### 5.3 NP-completude

Um problema B é **NP-difícil** se **todo** problema de NP se reduz a ele em tempo polinomial (escreve-se A ≤ₚ B: uma transformação polinomial f com x ∈ A ⟺ f(x) ∈ B). Se ele também está em NP, é **NP-completo**.

NP-completos são os problemas "mais difíceis" de NP: se **um** deles tiver algoritmo polinomial, **todos** os problemas de NP terão (e P = NP). Na prática, provar que um problema é NP-completo é um sinal para parar de procurar um algoritmo exato rápido e partir para aproximação, heurísticas, casos especiais ou resolvedores.

**Como provar que B é NP-completo:**

1. Mostre que B ∈ NP (descreva o certificado e o verificador polinomial).
2. Escolha um NP-completo conhecido A e mostre **A ≤ₚ B**: transforme qualquer instância de A numa de B, em tempo polinomial, preservando a resposta.

> **Cuidado! Cai na prova:** a direção da redução é a fonte número 1 de erros. Para mostrar que B é **difícil**, reduza o difícil conhecido **para** B (A ≤ₚ B), nunca o contrário.

### 5.4 Teorema de Cook-Levin

Para começar a corrente, alguém precisava provar a NP-completude de um primeiro problema diretamente.

**Teorema de Cook-Levin (1971):** SAT é NP-completo.

*Ideia da prova.* Pegue qualquer problema em NP: existe uma máquina não determinística M que o decide em tempo p(n). Uma computação de M é uma tabela p(n) × p(n) (cada linha é a fita num instante). Escreva uma fórmula booleana com variáveis "a célula (i, j) contém o símbolo s" e cláusulas dizendo: a primeira linha é a configuração inicial com a entrada; cada linha segue da anterior pelas regras de M (só depende de janelas 2 × 3 vizinhas, então são cláusulas locais); alguma linha está no estado de aceitação. A fórmula tem tamanho polinomial e é satisfatível sse M aceita a entrada. ∎

A partir de SAT, Richard Karp (1972) mostrou a NP-completude de 21 problemas clássicos, e hoje são milhares.

### 5.5 Problemas NP-completos clássicos

Cadeia de reduções clássicas:

```
SAT → 3-SAT → CLIQUE → COBERTURA POR VÉRTICES → CONJUNTO INDEPENDENTE
      3-SAT → 3-COLORAÇÃO
      3-SAT → SOMA DE SUBCONJUNTOS → MOCHILA, PARTIÇÃO
      3-SAT → CAMINHO HAMILTONIANO → CAIXEIRO-VIAJANTE
```

**Exemplo de redução: 3-SAT ≤ₚ CLIQUE.** Dada uma fórmula com k cláusulas de 3 literais, crie um vértice para cada literal de cada cláusula (3k vértices). Ligue dois vértices se estão em cláusulas **diferentes** e **não** são contraditórios (x e ¬x). Afirmação: a fórmula é satisfatível sse o grafo tem um clique de tamanho k. (Uma valoração satisfatória escolhe um literal verdadeiro por cláusula, e esses k vértices são todos ligados; um clique de tamanho k tem um vértice por cláusula, sem contradições, que define uma valoração.) A construção é polinomial. ∎

**Exemplo fácil: CONJUNTO INDEPENDENTE ≤ₚ COBERTURA POR VÉRTICES.** S é independente (nenhuma aresta dentro de S) sse V − S é uma cobertura (toda aresta tem uma ponta fora de S). Então "existe independente de tamanho k?" ⟺ "existe cobertura de tamanho |V| − k?".

Atenção às fronteiras sutis entre P e NP-completo:

| Em P | NP-completo |
|---|---|
| 2-SAT | 3-SAT |
| Caminho mínimo | Caminho máximo simples |
| Ciclo euleriano (cada aresta uma vez) | Ciclo hamiltoniano (cada vértice uma vez) |
| 2-coloração (bipartido) | 3-coloração |
| Emparelhamento | Emparelhamento tridimensional |
| Programação linear | Programação linear inteira |

### Atividades de fixação do Tema 5

1. Mostre que estão em NP, descrevendo certificado e verificador: (a) 3-coloração; (b) soma de subconjuntos; (c) "o número N é composto".
2. Explique por que a mochila em O(nW) não prova que P = NP.
3. Mostre que CLIQUE ≤ₚ CONJUNTO INDEPENDENTE (dica: grafo complementar).
4. Para a fórmula (x ∨ y ∨ ¬z) ∧ (¬x ∨ ¬y ∨ z) ∧ (x ∨ ¬y ∨ z), construa o grafo da redução 3-SAT → CLIQUE e encontre um clique de tamanho 3 e a valoração correspondente.
5. Um colega mostrou que o problema do seu projeto se reduz **a** SAT (seu problema ≤ₚ SAT). Isso prova que ele é difícil? O que isso prova?
6. Prove que 2-SAT está em P (dica: grafo de implicações; x ∨ y vira ¬x → y e ¬y → x; insatisfatível sse x e ¬x estão na mesma componente fortemente conexa).

## Tema 6: Além de NP

**Objetivo:** conhecer outras classes de complexidade e o que fazer diante de problemas difíceis.

### 6.1 PSPACE

**PSPACE** é a classe dos problemas resolvíveis com **memória polinomial** (sem limite de tempo). Como dá para reutilizar memória, mas não tempo, NP ⊆ PSPACE (teste todos os certificados reutilizando o mesmo espaço).

Problemas PSPACE-completos típicos envolvem **alternância** de quantificadores ou **jogos**:

- **TQBF:** fórmulas booleanas totalmente quantificadas, como ∀x ∃y ∀z (x ∨ y ∨ ¬z). (SAT é o caso só com ∃.)
- **Jogos de dois jogadores** generalizados para tabuleiros n × n: decidir se o primeiro jogador tem estratégia vencedora em Hex, Othello generalizado e Geografia generalizada. (Xadrez e Go generalizados chegam a EXPTIME.)
- **Planejamento** em IA com estados descritos por variáveis.

A hierarquia conhecida: **P ⊆ NP ⊆ PSPACE ⊆ EXPTIME**, e pelo **teorema da hierarquia de tempo** P ≠ EXPTIME. Então pelo menos uma das inclusões do meio é estrita, mas não se sabe qual.

### 6.2 Classes randomizadas

Algoritmos randomizados definem suas próprias classes:

- **BPP:** resolvidos em tempo polinomial por algoritmos randomizados que erram com probabilidade ≤ 1/3 (repetindo, o erro fica tão pequeno quanto se queira, por Chernoff). É a noção prática de "eficiente com aleatoriedade".
- **RP** e **ZPP:** erro só de um lado, e sem erro com tempo esperado polinomial (Las Vegas).

Por muito tempo, testar primalidade era o exemplo de problema em BPP (Miller-Rabin) sem algoritmo determinístico polinomial conhecido, até o AKS (2002). Hoje, a conjectura dominante é **P = BPP**: a aleatoriedade ajudaria na prática, mas não mudaria o que é eficiente. Um exemplo que ainda não foi "desaleatorizado" é o teste de identidade de polinômios.

### 6.3 Inaproximabilidade

Para muitos NP-difíceis, existem aproximações (Algoritmos, Tema 6). Mas há limites: o **teorema PCP** (provas verificáveis probabilisticamente, 1992) mostra que, para vários problemas, até **aproximar** além de certo fator é NP-difícil.

- Cobertura por vértices: 2-aproximação simples; fazer melhor que ~1,36 é NP-difícil (e, sob uma conjectura, melhor que 2).
- Cobertura de conjuntos: ln n é essencialmente o melhor possível.
- Caixeiro-viajante **sem** desigualdade triangular: nenhuma aproximação com fator constante, a menos que P = NP.
- Clique: nem aproximar com fator n^(1 − ε).
- Mochila: aproximação tão boa quanto se queira (FPTAS).

O que fazer diante de um problema NP-difícil na prática:

1. Verifique se a sua instância é um **caso especial** fácil (grafo bipartido, árvore, poucos valores).
2. **Algoritmos parametrizados:** exponenciais só num parâmetro pequeno (cobertura por vértices em O(2ᵏ n)).
3. **Resolvedores** SAT, de programação inteira e de restrições: resolvem muitas instâncias reais enormes.
4. **Aproximação** com garantia ou **heurísticas** (busca local, *simulated annealing*).
5. **Exponencial inteligente:** *branch and bound*, PD sobre subconjuntos (Held-Karp).

### 6.4 Computação quântica

Um **computador quântico** usa **qubits**, que podem estar em **superposição** de 0 e 1, e operações que fazem as amplitudes de diferentes possibilidades **interferirem**. Ao medir, obtém-se um resultado com probabilidade dada pelas amplitudes. A classe dos problemas eficientes para ele é **BQP**.

- **Algoritmo de Shor (1994):** fatora inteiros e calcula logaritmos discretos em tempo polinomial. Quebraria RSA e criptografia de curvas elípticas. Por isso existe a **criptografia pós-quântica** (padrões do NIST de 2024, baseados em reticulados).
- **Algoritmo de Grover:** busca num espaço de N possibilidades em O(√N) passos, ganho quadrático (não exponencial).
- **Simulação de sistemas quânticos** (química, materiais): talvez a aplicação mais natural.

O que computadores quânticos **não** fazem (até onde se sabe): resolver problemas NP-completos em tempo polinomial. Acredita-se que NP ⊄ BQP. E eles não violam a tese de Church-Turing: computam as mesmas coisas, possivelmente mais rápido para certos problemas.

### Atividades de fixação do Tema 6

1. Explique por que NP ⊆ PSPACE: descreva o algoritmo de espaço polinomial para um problema em NP.
2. Por que jogos generalizados costumam ser PSPACE-completos e não apenas NP-completos? (Pense na alternância "existe uma jogada minha tal que, para toda resposta do adversário, existe...".)
3. Um algoritmo randomizado acerta com probabilidade 2/3. Quantas repetições, com voto da maioria, garantem erro menor que 10⁻⁹? (Use Chernoff ou simule.)
4. Você precisa resolver, toda noite, uma instância de alocação de turnos com 500 funcionários, que é NP-difícil. Liste três abordagens práticas e quando usaria cada uma.
5. Por que a criptografia simétrica (AES) é menos afetada por computadores quânticos que o RSA? (Compare Grover e Shor.)

## Projeto da etapa

**Simulador de autômatos e máquina de Turing com visualização:**

1. Formato de arquivo (JSON ou YAML) para descrever DFA, NFA (com ε), PDA e máquina de Turing.
2. Simulação passo a passo com visualização: o estado atual destacado no diagrama (desenhado com Graphviz ou numa página web), a fita ou a pilha, e o histórico de passos.
3. Algoritmos: NFA → DFA (subconjuntos), minimização de DFA, expressão regular → NFA (Thompson), interseção por produto.
4. Um "laboratório" com exemplos prontos: paridade, divisibilidade por 3, 0ⁿ1ⁿ com PDA, soma binária e cópia de cadeia com máquina de Turing.
5. Testes que comparam o seu motor de expressões regulares (Thompson + simulação do NFA) com o `re` do Python em milhares de cadeias aleatórias, e uma demonstração do ReDoS: a expressão `(a+)+b` no `re` versus no seu motor, que é linear.

## Para ir além

- *Introduction to the Theory of Computation* (Michael Sipser): o livro-texto padrão, claríssimo.
- **MIT 18.404J** no OpenCourseWare (2020, aulas gravadas do próprio Sipser).
- *Introduction to Theoretical Computer Science* (Boaz Barak, gratuito online): base do CS 121 de Harvard, com abordagem moderna.
- *Computers and Intractability* (Garey e Johnson): o catálogo clássico de problemas NP-completos.
- *Quantum Computing Since Democritus* (Scott Aaronson) e o *Complexity Zoo* (catálogo online de classes de complexidade).

## Resumão

- Problema de decisão = linguagem. Decidir = dizer se a cadeia pertence.
- DFA: memória finita, tempo linear. NFA tem o mesmo poder (construção dos subconjuntos, até 2ⁿ estados).
- Regulares = DFA = NFA = expressões regulares. Fechadas para união, interseção, complemento, concatenação e estrela.
- Bombeamento (ou Myhill-Nerode) prova que não é regular: 0ⁿ1ⁿ, parênteses balanceados.
- GLC = PDA (não determinístico). Gramática codifica precedência e associatividade; ambiguidade é defeito.
- Máquina de Turing: fita infinita, modelo de tudo que é computável (Church-Turing). Máquina universal = programa armazenado.
- Problema da parada é indecidível (diagonalização). Rice: toda propriedade não trivial do comportamento é indecidível.
- P: resolvível em tempo polinomial. NP: verificável em tempo polinomial. P = NP é a grande questão aberta.
- NP-completo: em NP e todo NP se reduz a ele. Cook-Levin: SAT. Reduza do conhecido **para** o novo.
- P ⊆ NP ⊆ PSPACE ⊆ EXPTIME. BPP provavelmente igual a P. Algumas aproximações também são NP-difíceis.
- Quântico: Shor fatora (ameaça o RSA), Grover dá ganho quadrático; não se espera que resolva NP-completos.
