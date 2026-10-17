# Sistemas Digitais e Arquitetura de Computadores: Apostila Prática

Roadmap Ciência da Computação · Semanas 65 a 70

## Comece por aqui

Como um pedaço de silício executa `x = y + 1`? Esta etapa responde, subindo do transistor até o processador: portas lógicas, circuitos que somam e guardam bits, representação de números, instruções de máquina, o caminho que os dados percorrem dentro da CPU e a hierarquia de memória. Entender o hardware explica muitas "esquisitices" do software (por que 0,1 + 0,2 ≠ 0,3, por que inteiros estouram, por que percorrer uma matriz por linhas é muito mais rápido que por colunas) e é a base para Sistemas Operacionais, Compiladores e programação de alto desempenho. O projeto **Nand2Tetris** (do NAND ao Tetris) mostra que dá para construir um computador inteiro, conceitualmente, a partir de uma única porta lógica.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | EEA-21 Circuitos Digitais; EEA-25 Sistemas Digitais Programáveis; CES-25 Arquiteturas para Alto Desempenho |
| MIT | 6.1903 (antiga 6.004) Computation Structures; 6.1910 |
| Harvard | CS 61 Systems Programming and Machine Organization (parte); CS 1410 |
| Oxford | Digital Systems (1º ano); Computer Architecture (2º ano) |

### Como esta apostila funciona

1. Use simuladores: **Digital** ou **Logisim Evolution** para circuitos, o **RARS** ou o **Venus** para assembly RISC-V, e as ferramentas do Nand2Tetris.
2. Escreva pequenos programas em C e veja o assembly gerado no **Compiler Explorer** (godbolt.org). É a ponte entre o que você escreve e o que a máquina executa.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** circuito não funciona? Teste cada bloco isoladamente com uma tabela-verdade. Programa em assembly com bug? Execute passo a passo no simulador olhando os registradores depois de cada instrução.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 65 | Tema 1: Portas lógicas e circuitos combinacionais |
| 66 | Tema 2: Circuitos sequenciais |
| 67 | Tema 3: Representação de dados |
| 68 | Tema 4: Conjunto de instruções e assembly |
| 69 | Tema 5: O processador |
| 70 | Tema 6: Hierarquia de memória + projeto |

## Tema 1: Portas lógicas e circuitos combinacionais

**Objetivo:** construir circuitos que calculam funções booleanas a partir de portas lógicas.

### 1.1 Bits e portas lógicas

Um computador digital representa informação com **bits**, dois níveis de tensão (baixo = 0, alto = 1). Por que dois? Porque é robusto: um sinal com ruído ainda é claramente "alto" ou "baixo", e a lógica pode **regenerar** o sinal a cada etapa.

O **transistor MOSFET** funciona como uma chave controlada por tensão. Combinando transistores do tipo N e P (tecnologia **CMOS**), constroem-se **portas lógicas**:

| Porta | Símbolo | Saída é 1 quando |
|---|---|---|
| NOT | ¬A | A = 0 |
| AND | A ∧ B | A = 1 e B = 1 |
| OR | A ∨ B | A = 1 ou B = 1 |
| NAND | ¬(A ∧ B) | não são ambas 1 |
| NOR | ¬(A ∨ B) | ambas 0 |
| XOR | A ⊕ B | A ≠ B |

**NAND é universal:** com NANDs dá para construir qualquer outra porta. NOT A = NAND(A, A); AND = NOT(NAND); OR(A, B) = NAND(NOT A, NOT B) (De Morgan). Em CMOS, NAND e NOR são as portas mais baratas (4 transistores), e é por isso que o Nand2Tetris começa dela.

### 1.2 Álgebra booleana

A álgebra booleana (que você viu como lógica proposicional na Matemática Discreta) serve para **simplificar circuitos**: menos portas, menos área, menos energia, menos atraso.

Notação usual em circuitos: AB para AND, A + B para OR, A' (ou Ā) para NOT.

| Lei | Forma |
|---|---|
| Identidade | A + 0 = A; A · 1 = A |
| Anulação | A + 1 = 1; A · 0 = 0 |
| Complemento | A + A' = 1; A · A' = 0 |
| Distributiva | A(B + C) = AB + AC; A + BC = (A + B)(A + C) |
| De Morgan | (AB)' = A' + B'; (A + B)' = A'B' |
| Absorção | A + AB = A |

**Soma de produtos:** a partir da tabela-verdade, escreva um termo AND para cada linha em que a saída é 1 e junte com OR (é a FND da Matemática Discreta). Depois simplifique com as leis ou com **mapas de Karnaugh** (uma tabela organizada em código Gray, em que vizinhos diferem em uma variável; agrupar 1s vizinhos elimina variáveis). Para muitas variáveis, ferramentas automáticas (algoritmo de Quine-McCluskey, Espresso) fazem o trabalho.

### 1.3 Circuitos combinacionais

Um circuito **combinacional** tem saída que depende **só das entradas atuais** (sem memória). Blocos básicos:

- **Multiplexador (MUX):** escolhe uma de várias entradas conforme um sinal de seleção. MUX 2:1: saída = S'A + SB. É o "if" do hardware.
- **Demultiplexador:** manda uma entrada para uma de várias saídas.
- **Decodificador:** n entradas ativam exatamente uma de 2ⁿ saídas (usado para selecionar um registrador ou um endereço de memória).
- **Codificador** e **comparador**.

Todo circuito combinacional tem um **atraso de propagação**: o tempo para a saída estabilizar depois que as entradas mudam. O maior atraso entre entradas e saídas é o **caminho crítico**, e ele limita a velocidade do relógio do processador.

### 1.4 Somadores e multiplexadores

**Meio somador:** soma dois bits. Soma = A ⊕ B; vai-um = AB.

**Somador completo:** soma três bits (A, B e o vai-um que veio da direita, Cᵢₙ).

- S = A ⊕ B ⊕ Cᵢₙ
- Cₒᵤₜ = AB + Cᵢₙ(A ⊕ B)

**Somador de n bits em cascata** (*ripple carry*): n somadores completos ligados pelo vai-um. Simples, mas lento: o vai-um precisa atravessar todos os n estágios, atraso O(n). **Somadores com antecipação de vai-um** (*carry lookahead*) calculam os vai-uns em paralelo com circuitos extras, atraso O(log n). É um algoritmo de "prefixo paralelo" em hardware.

Uma **ALU** (unidade lógica e aritmética) junta somador, operações lógicas (AND, OR, XOR) e deslocamentos, e um multiplexador escolhe qual resultado sai, conforme o código da operação. Ela também produz **flags**: zero, negativo, vai-um, estouro.

Subtração vem de graça com complemento de dois (Tema 3): A − B = A + (inverso de B) + 1, usando o mesmo somador com Cᵢₙ = 1.

### Atividades de fixação do Tema 1

1. Construa NOT, AND, OR e XOR usando só NANDs. Quantos NANDs o XOR precisa?
2. Simplifique: (a) AB + AB'; (b) A'B'C + A'BC + AB'C + ABC; (c) (A + B)(A + B').
3. Monte a tabela-verdade da função "maioria de 3" (saída 1 se pelo menos duas entradas são 1), escreva a soma de produtos e simplifique.
4. Construa um MUX 4:1 a partir de MUX 2:1.
5. Projete um somador de 4 bits em cascata num simulador e teste 7 + 5 e 9 + 8. O que acontece no segundo?
6. Se cada porta tem atraso de 1 ns e um somador completo tem caminho crítico de 2 portas para o vai-um, quanto tempo leva uma soma de 64 bits em cascata? Qual a frequência máxima de um processador cujo caminho crítico é esse?

## Tema 2: Circuitos sequenciais

**Objetivo:** construir circuitos com memória, que dependem do passado.

### 2.1 Flip-flops

Um circuito **sequencial** tem saída que depende das entradas **e do estado** (memória). A memória vem da **realimentação**: ligar a saída de volta na entrada.

**Latch SR** com duas portas NOR cruzadas: S (*set*) liga, R (*reset*) desliga; com ambos em 0, mantém o valor. **Latch D**: guarda o valor de D enquanto o sinal de habilitação está ativo.

O **flip-flop D** captura o valor de D **só na borda de subida do relógio** (*clock*) e mantém até a próxima borda. É o tijolo de toda a memória síncrona.

O **relógio** é um sinal que alterna 0 e 1 periodicamente (3 GHz = 3 bilhões de ciclos por segundo). Em projeto **síncrono**, todo estado muda junto nas bordas do relógio, e entre elas a lógica combinacional tem tempo de estabilizar. O período do relógio precisa ser maior que o caminho crítico mais os tempos de *setup* do flip-flop.

### 2.2 Registradores

Um **registrador** de n bits é um conjunto de n flip-flops com o mesmo relógio, mais um sinal de **carga** (*load*): um MUX na entrada de cada flip-flop escolhe entre manter o valor ou carregar um novo.

Variações:

- **Registrador de deslocamento:** a cada ciclo, os bits andam uma posição (conversão serial ↔ paralelo, como numa UART).
- **Contador:** registrador mais um somador de 1. O **contador de programa** (PC) da CPU é um contador que também pode ser carregado (para saltos).
- **Banco de registradores:** vários registradores com decodificador para escrita e multiplexadores para leitura. O RISC-V tem 32 registradores de uso geral.

### 2.3 Máquinas de estado

Uma **máquina de estados finita** em hardware é um registrador de estado mais lógica combinacional que calcula o próximo estado e as saídas. É o DFA da Teoria da Computação, agora em silício.

- **Moore:** saídas dependem só do estado.
- **Mealy:** saídas dependem do estado e das entradas.

Exemplo: um semáforo com estados verde, amarelo e vermelho, mudando a cada tantos ciclos de um contador; um detector de sequência "101" num fio serial; o controlador de um elevador. A **unidade de controle** de um processador simples é uma máquina de estados.

Projeto: (1) desenhe o diagrama de estados; (2) codifique cada estado em bits; (3) escreva as tabelas de próximo estado e de saída; (4) gere a lógica combinacional.

### 2.4 Memória

Tipos de memória, do mais rápido ao mais lento:

| Tipo | Como guarda o bit | Características | Uso |
|---|---|---|---|
| Registradores (flip-flops) | Realimentação | Mais rápido, caro, poucos | Dentro da CPU |
| SRAM | 6 transistores em realimentação | Rápida, volátil, cara | Caches |
| DRAM | Carga num capacitor (1 transistor + 1 capacitor) | Densa, barata, precisa ser **renovada** (*refresh*) periodicamente | Memória principal |
| Flash (NAND) | Carga presa num transistor de porta flutuante | Não volátil, desgasta com escritas, apaga em blocos | SSD, pen drive |

Uma memória RAM é organizada como uma grande matriz: um **decodificador** de endereço seleciona a linha, e multiplexadores selecionam as colunas. Ler a DRAM é **destrutivo** (descarrega o capacitor) e é preciso reescrever; e abrir uma linha nova é bem mais lento que ler outra coluna da linha já aberta, uma das razões de o acesso sequencial ser mais rápido.

### Atividades de fixação do Tema 2

1. Simule um latch SR com portas NOR e explique o que acontece com S = R = 1.
2. Construa um registrador de 4 bits com sinal de carga num simulador.
3. Projete um contador de 3 bits que conta 0, 1, ..., 7 e volta a 0. Depois um que conta só até 5.
4. Projete a máquina de estados (Moore) que detecta a sequência "101" num fluxo de bits, com sobreposição (em "10101", detecta duas vezes). Desenhe o diagrama e as tabelas.
5. Por que a DRAM precisa de *refresh* e a SRAM não? Por que, mesmo assim, a memória principal é DRAM?
6. Um processador tem caminho crítico de 0,4 ns e o flip-flop exige 0,05 ns de *setup* e 0,05 ns de atraso de saída. Qual a frequência máxima?

## Tema 3: Representação de dados

**Objetivo:** entender como inteiros, reais e textos viram bits, e as consequências para o software.

### 3.1 Inteiros com sinal

**Sem sinal:** n bits representam 0 a 2ⁿ − 1, em base 2. Base 16 (**hexadecimal**) abrevia grupos de 4 bits: 0xFF = 1111 1111 = 255.

**Com sinal**, o padrão universal é o **complemento de dois**: o bit mais significativo vale **−2ⁿ⁻¹** em vez de +2ⁿ⁻¹.

Com 8 bits: de −128 a 127.

| Bits | Sem sinal | Complemento de dois |
|---|---|---|
| 0000 0000 | 0 | 0 |
| 0111 1111 | 127 | 127 |
| 1000 0000 | 128 | −128 |
| 1111 1111 | 255 | −1 |

Para negar: **inverta todos os bits e some 1**. −5 = inverte(0000 0101) + 1 = 1111 1010 + 1 = 1111 1011.

Vantagens: um único zero, e **o mesmo somador** serve para números com e sem sinal; a subtração é soma com o negado.

**Estouro (*overflow*):** o resultado não cabe. Em complemento de dois, somar dois positivos e obter negativo (127 + 1 = −128 em 8 bits) ou dois negativos e obter positivo. Em C, estouro com sinal é **comportamento indefinido**; em Java, "dá a volta" silenciosamente; em Python, inteiros crescem sem limite. O estouro já causou desastres reais: o foguete Ariane 5 explodiu em 1996 por converter um número de 64 bits de ponto flutuante para um inteiro de 16 bits.

Deslocamentos: x << k multiplica por 2ᵏ; x >> k divide por 2ᵏ (deslocamento **aritmético** replica o bit de sinal; **lógico** insere zeros).

### 3.2 Ponto flutuante IEEE 754

Reais são representados como **(−1)ˢ × 1,f × 2ᵉ**, a notação científica em base 2:

| Formato | Sinal | Expoente | Fração | Precisão |
|---|---|---|---|---|
| float (32 bits) | 1 | 8 (viés 127) | 23 | ~7 dígitos decimais |
| double (64 bits) | 1 | 11 (viés 1023) | 52 | ~16 dígitos decimais |

O "1," inicial está implícito (não é guardado). O expoente é guardado com **viés** (somado a 127 ou 1023) para comparar como inteiro sem sinal.

Exemplo: −6,25 = −110,01₂ = −1,1001 × 2². Sinal 1; expoente 2 + 127 = 129 = 1000 0001; fração 1001 000...0.

Casos especiais: expoente todo zero codifica o **zero** (com sinal: +0 e −0) e os **subnormais** (números minúsculos, perto de zero, sem o 1 implícito); expoente todo um codifica **±infinito** (1,0/0,0) e **NaN** (*not a number*, como 0,0/0,0 ou √−1). NaN é diferente de tudo, inclusive de si mesmo: `x != x` é o teste clássico de NaN.

Consequências (que você já viu em Cálculo):

- 0,1 não tem representação exata em base 2 (como 1/3 em base 10): 0,1 + 0,2 ≠ 0,3.
- A precisão é **relativa**: o espaçamento entre floats vizinhos cresce com o número. Acima de 2²⁴ ≈ 16,7 milhões, um float não representa todos os inteiros; acima de 2⁵³, um double também não.
- Soma não é associativa: (a + b) + c pode diferir de a + (b + c).

### 3.3 Caracteres e Unicode

**ASCII** (1963): 7 bits, 128 caracteres (letras inglesas, dígitos, pontuação, controles). 'A' = 65, 'a' = 97, '0' = 48.

**Unicode**: um número (**ponto de código**) para cada caractere de todas as escritas do mundo, mais emojis: mais de 150 mil caracteres, de U+0000 a U+10FFFF.

Codificações de Unicode em bytes:

- **UTF-8:** de 1 a 4 bytes por caractere; os 128 do ASCII ocupam 1 byte e são idênticos ao ASCII. Domina a web (mais de 98% das páginas). "ç" = U+00E7 = C3 A7 (2 bytes); "€" = 3 bytes; emojis = 4 bytes.
- **UTF-16:** 2 ou 4 bytes (usada internamente por Java, JavaScript e Windows).

> **Cuidado! Cai na prática:** "tamanho de uma string" é ambíguo: bytes, pontos de código ou caracteres visíveis (*grafemas*)? "é" pode ser 1 ponto de código (U+00E9) ou 2 (e + acento combinante U+0301), e um emoji de família pode ter 7 pontos de código. Em JavaScript, `"😀".length` é 2 (unidades UTF-16). Sempre declare a codificação ao ler arquivos (`encoding="utf-8"`), ou o "ã" vira "Ã£" (o famoso *mojibake*).

### 3.4 Endianness

Um número de vários bytes pode ser guardado na memória com o byte **menos** significativo primeiro (**little-endian**: x86, ARM na prática, RISC-V) ou o **mais** significativo primeiro (**big-endian**: protocolos de rede, chamado *network byte order*).

O inteiro 0x12345678 no endereço 100:

| Endereço | 100 | 101 | 102 | 103 |
|---|---|---|---|---|
| Little-endian | 78 | 56 | 34 | 12 |
| Big-endian | 12 | 34 | 56 | 78 |

Importa sempre que bytes saem de um programa: arquivos binários, protocolos de rede (`htonl`, `ntohl` em C), leitura de formatos de imagem. Em Python, `int.to_bytes(4, "little")` e o módulo `struct` cuidam disso.

### Atividades de fixação do Tema 3

1. Converta: 173 para binário e hexadecimal; 0x3F para decimal; −37 para complemento de dois em 8 bits.
2. Em 8 bits com complemento de dois, calcule 100 + 50 e −100 − 50. Houve estouro? Como o hardware detecta?
3. Escreva −6,25 e 0,1 no formato float de 32 bits (os 32 bits em hexadecimal). Confira com `struct.pack(">f", x).hex()` em Python.
4. Qual o menor inteiro positivo que não pode ser representado exatamente num float de 32 bits? E num double? Teste em Python com NumPy.
5. Quantos bytes ocupa "Ação 😀" em UTF-8? Quantos pontos de código? Confira com `len(s)` e `len(s.encode())`.
6. Escreva em C um programa que descobre se a máquina é little-endian olhando o primeiro byte de um `int`.

## Tema 4: Conjunto de instruções e assembly

**Objetivo:** entender a interface entre software e hardware e programar em assembly RISC-V.

### 4.1 Arquitetura de conjunto de instruções

A **ISA** (*instruction set architecture*) é o **contrato** entre o software e o hardware: quais instruções existem, quais registradores, como a memória é endereçada, como cada instrução é codificada em bits. Processadores diferentes (Intel e AMD) implementam a mesma ISA (x86-64) de jeitos diferentes por dentro (a **microarquitetura**).

Duas filosofias:

- **CISC** (x86): muitas instruções, complexas, de tamanho variável, que podem acessar a memória diretamente.
- **RISC** (ARM, RISC-V, MIPS): poucas instruções simples, tamanho fixo, só *load* e *store* acessam a memória (arquitetura **load/store**). Mais fáceis de implementar em pipeline.

Hoje a distinção é menos nítida: processadores x86 traduzem internamente as instruções CISC em micro-operações RISC.

### 4.2 RISC-V

O **RISC-V** é uma ISA **aberta e gratuita**, criada em Berkeley (2010), usada no ensino (MIT, Berkeley, ITA) e cada vez mais na indústria. A base RV32I tem cerca de 40 instruções.

Registradores: 32, de x0 a x31, com nomes conforme a convenção de uso:

| Registrador | Nome | Uso |
|---|---|---|
| x0 | zero | Sempre vale 0 |
| x1 | ra | Endereço de retorno |
| x2 | sp | Ponteiro da pilha |
| x10–x17 | a0–a7 | Argumentos e valores de retorno |
| x5–x7, x28–x31 | t0–t6 | Temporários (quem chama salva, se precisar) |
| x8–x9, x18–x27 | s0–s11 | Salvos (quem é chamado preserva) |

Instruções principais:

| Tipo | Exemplos | Significado |
|---|---|---|
| Aritmética | `add t0, t1, t2` / `addi t0, t1, 5` / `sub` | t0 = t1 + t2 / t0 = t1 + 5 |
| Lógica e deslocamento | `and`, `or`, `xor`, `sll`, `srl`, `sra` | Operações bit a bit |
| Comparação | `slt t0, t1, t2` | t0 = 1 se t1 < t2 |
| Memória | `lw t0, 8(sp)` / `sw t0, 8(sp)` | Carrega/guarda a palavra no endereço sp + 8 |
| Desvio condicional | `beq t0, t1, rotulo` / `bne`, `blt`, `bge` | Salta se igual, diferente, menor... |
| Salto | `jal ra, funcao` / `jalr zero, 0(ra)` | Chama função / retorna |

Cada instrução ocupa **32 bits**, em poucos formatos (R, I, S, B, U, J). `add t0, t1, t2` vira o número 0x007302B3.

### 4.3 Programação em assembly

Do C para o assembly:

```c
int soma_array(int *a, int n) {
    int s = 0;
    for (int i = 0; i < n; i++)
        s += a[i];
    return s;
}
```

```asm
# a0 = endereço do array, a1 = n; resultado em a0
soma_array:
    li   t0, 0          # s = 0
    li   t1, 0          # i = 0
laco:
    bge  t1, a1, fim    # if (i >= n) sai
    slli t2, t1, 2      # t2 = i * 4 (cada int tem 4 bytes)
    add  t2, a0, t2     # t2 = &a[i]
    lw   t3, 0(t2)      # t3 = a[i]
    add  t0, t0, t3     # s += a[i]
    addi t1, t1, 1      # i++
    j    laco
fim:
    mv   a0, t0         # retorna s
    ret
```

Repare: o `for` vira um teste com desvio e um salto de volta; `a[i]` vira cálculo de endereço (base + i × tamanho do elemento) seguido de `lw`. Os **ponteiros** do C são simplesmente endereços de memória. Use o Compiler Explorer com `-O0` e `-O2` para ver como o compilador otimiza (com `-O2` ele trocaria o índice por um ponteiro que avança 4 bytes por volta).

### 4.4 Chamadas de função e pilha

Para chamar uma função: argumentos em a0 a a7, `jal ra, funcao` (salta e guarda em ra o endereço de retorno), resultado em a0, e `ret` (salta para ra) para voltar.

Se a função chama outra, ela precisa **salvar** ra (e os registradores s que usar) na **pilha**, uma região de memória que cresce para endereços menores, apontada por sp:

```asm
fatorial:                    # a0 = n
    addi sp, sp, -16         # reserva espaço na pilha (múltiplo de 16)
    sw   ra, 12(sp)          # salva o endereço de retorno
    sw   s0, 8(sp)           # salva s0, que vamos usar
    mv   s0, a0              # s0 = n
    li   t0, 1
    ble  a0, t0, base        # n <= 1?
    addi a0, a0, -1
    jal  ra, fatorial        # a0 = fatorial(n - 1)
    mul  a0, s0, a0          # a0 = n * fatorial(n - 1)
    j    sai
base:
    li   a0, 1
sai:
    lw   s0, 8(sp)           # restaura
    lw   ra, 12(sp)
    addi sp, sp, 16          # libera o quadro
    ret
```

Esse é o **quadro de pilha** (*stack frame*) que você imaginou na Introdução à Programação: cada chamada reserva um pedaço da pilha para os seus dados e o endereço de volta. A **convenção de chamada** (quem salva quais registradores) é o acordo que permite juntar código de compiladores e linguagens diferentes.

> **Cuidado! Cai na entrevista:** num **estouro de buffer** na pilha, escrever além do fim de um array local sobrescreve o endereço de retorno salvo, e o `ret` salta para onde o atacante quiser. É a vulnerabilidade clássica que você verá em Segurança (e as defesas: canários, pilha não executável, ASLR).

### Atividades de fixação do Tema 4

1. Traduza para RISC-V: `if (a < b) c = a; else c = b;` com a, b, c em t0, t1, t2.
2. Escreva em RISC-V uma função `max_array(a0 = endereço, a1 = n)` e teste no RARS ou no Venus.
3. Escreva `strlen` em RISC-V (conte bytes até achar o 0, usando `lb` ou `lbu`).
4. Escreva Fibonacci recursivo em RISC-V e desenhe a pilha durante `fib(3)`.
5. Compile `int f(int x) { return x * 8 + 1; }` no Compiler Explorer para RISC-V com `-O2`. Que instruções aparecem? Por que não há `mul`?
6. Por que o RISC-V tem um registrador sempre zero? Mostre como `mv`, `li` pequeno e `nop` viram instruções com x0.

## Tema 5: O processador

**Objetivo:** entender como o hardware executa instruções e como o pipeline aumenta o desempenho.

### 5.1 Caminho de dados

Executar uma instrução tem cinco etapas clássicas:

1. **IF** (*instruction fetch*): buscar a instrução na memória no endereço do PC; PC ← PC + 4.
2. **ID** (*instruction decode*): decodificar e ler os registradores.
3. **EX** (*execute*): a ALU calcula (soma, comparação ou endereço).
4. **MEM**: acessar a memória (só *load* e *store*).
5. **WB** (*write back*): escrever o resultado no registrador de destino.

O **caminho de dados** (*datapath*) é o conjunto de blocos e fios por onde os dados passam: PC, memória de instruções, banco de registradores, ALU, memória de dados, multiplexadores e o gerador de imediatos (que extrai a constante de dentro da instrução).

Num processador **monociclo**, cada instrução faz tudo num único ciclo de relógio. Simples, mas o ciclo tem que ser tão longo quanto a instrução mais lenta (o `lw`, que passa por todas as etapas).

### 5.2 Unidade de controle

A **unidade de controle** olha o código da instrução (*opcode* e campos de função) e gera os **sinais de controle**: qual operação a ALU faz, se escreve no registrador, se lê ou escreve na memória, o que cada multiplexador seleciona, se o PC salta.

| Instrução | Escreve registrador | Fonte do 2º operando | Memória | Resultado vem de |
|---|---|---|---|---|
| `add` | Sim | Registrador | Nada | ALU |
| `addi` | Sim | Imediato | Nada | ALU |
| `lw` | Sim | Imediato (deslocamento) | Lê | Memória |
| `sw` | Não | Imediato | Escreve | (nenhum) |
| `beq` | Não | Registrador (compara) | Nada | (PC pode saltar) |

### 5.3 Pipeline

**Pipeline** é a linha de montagem: enquanto uma instrução está em EX, a seguinte está em ID e a outra em IF. Cada etapa é separada por registradores de pipeline.

```
ciclo:    1    2    3    4    5    6    7
instr 1:  IF   ID   EX   MEM  WB
instr 2:       IF   ID   EX   MEM  WB
instr 3:            IF   ID   EX   MEM  WB
```

Cada instrução continua levando 5 etapas (a **latência** não melhora), mas termina uma instrução **por ciclo** (a **vazão** melhora até 5 vezes), e o ciclo pode ser curto (o tempo da etapa mais lenta, não da instrução inteira).

**Desempenho:** tempo de execução = instruções × CPI × tempo de ciclo, onde CPI são ciclos por instrução. O pipeline ideal tem CPI = 1. Para comparar processadores de verdade, meça com programas reais (*benchmarks*), não com a frequência do relógio sozinha.

### 5.4 Hazards

**Hazards** (conflitos) impedem que a próxima instrução comece no ciclo seguinte:

**Estruturais:** dois estágios precisam do mesmo recurso. Resolvido com memórias separadas de instruções e dados (caches L1 separadas).

**De dados:** uma instrução precisa de um resultado que ainda não foi escrito.

```asm
add t0, t1, t2
sub t3, t0, t4      # precisa de t0, que o add só escreve no WB
```

Soluções: **adiantamento** (*forwarding*): levar o resultado direto da saída da ALU para a entrada da próxima instrução, sem esperar o WB. Com `lw` seguido de uso imediato, nem o adiantamento resolve (o dado só sai da memória no MEM): é preciso uma **bolha** (*stall*) de um ciclo. Compiladores reordenam instruções para esconder esses atrasos.

**De controle:** num desvio, só se sabe a próxima instrução depois de avaliar a condição. Soluções:

- **Previsão de desvio:** chutar (por exemplo, "laços voltam") e, se errar, descartar as instruções buscadas. Preditores modernos usam o histórico e acertam mais de 95% das vezes.
- O custo de errar a previsão (10 a 20 ciclos em processadores profundos) é a razão de **código sem desvios imprevisíveis** ser mais rápido. Experimento clássico: somar os elementos maiores que 128 de um array é muito mais rápido se o array estiver **ordenado**, porque o desvio fica previsível.

Processadores modernos vão além: **superescalares** (várias instruções por ciclo), **execução fora de ordem** (executar o que já está pronto, reordenando por dentro), **execução especulativa** (seguir a previsão antes de saber se está certa). A especulação trouxe desempenho e também as vulnerabilidades **Spectre** e **Meltdown** (2018), que vazavam dados pelos efeitos colaterais no cache.

### Atividades de fixação do Tema 5

1. Para `lw t0, 8(t1)`, descreva o que acontece em cada uma das cinco etapas.
2. Monte a tabela de sinais de controle (escreve registrador, fonte do operando, leitura e escrita de memória, fonte do resultado, desvio) para `add`, `addi`, `lw`, `sw`, `beq` e `jal`.
3. Um processador monociclo tem ciclo de 800 ps. Com pipeline de 5 etapas de 200 ps cada (mais 20 ps de registradores de pipeline), qual o ganho de vazão em um programa longo, sem hazards?
4. Identifique os hazards e diga quantas bolhas são necessárias, com e sem adiantamento:
   ```asm
   lw   t0, 0(a0)
   add  t1, t0, t2
   sub  t3, t1, t4
   sw   t3, 4(a0)
   ```
5. Reordene as instruções abaixo para eliminar a bolha do *load*, sem mudar o resultado:
   ```asm
   lw  t0, 0(a0)
   add t1, t0, t0
   lw  t2, 4(a0)
   add t3, t2, t2
   ```
6. Reproduza o experimento do array ordenado em C (some os elementos ≥ 128 de 10⁷ bytes aleatórios, antes e depois de ordenar). Compile com `-O1` e depois com `-O3`. O que muda e por quê?

## Tema 6: Hierarquia de memória

**Objetivo:** entender por que a memória é organizada em camadas e escrever código que respeita isso.

### 6.1 Localidade

A memória rápida é cara e pequena; a grande é lenta. Números aproximados:

| Nível | Tamanho típico | Latência |
|---|---|---|
| Registradores | ~1 KB | < 1 ns |
| Cache L1 | 32 a 64 KB por núcleo | ~1 ns (4 ciclos) |
| Cache L2 | 256 KB a 2 MB | ~4 ns |
| Cache L3 | 8 a 64 MB, compartilhada | ~15 ns |
| DRAM | 8 a 512 GB | ~80 ns |
| SSD | TBs | ~50 a 100 µs |
| Disco rígido | TBs | ~5 a 10 ms |

O truque que faz isso funcionar é a **localidade** dos programas:

- **Temporal:** o que foi usado agora provavelmente será usado de novo logo (variáveis de laço, código do laço).
- **Espacial:** o que está perto do que foi usado provavelmente será usado logo (elementos seguintes de um array, próximas instruções).

A hierarquia guarda nos níveis rápidos o que provavelmente será usado. Se a taxa de acerto for alta, o sistema parece ter uma memória grande **e** rápida.

### 6.2 Caches

Uma **cache** guarda cópias de blocos de memória (**linhas** de cache, tipicamente **64 bytes**). Ao acessar um endereço:

- **Acerto** (*hit*): o bloco está na cache. Rápido.
- **Falta** (*miss*): busca o bloco no nível de baixo, coloca na cache (removendo outro) e entrega.

Como o bloco inteiro de 64 bytes vem junto, ler a[0] de um array de `int` traz também a[1] a a[15]: localidade espacial de graça.

**Organização:**

- **Mapeamento direto:** cada bloco só pode ficar numa posição (endereço mod número de linhas). Simples e rápido, mas sofre conflitos.
- **Totalmente associativa:** qualquer bloco em qualquer posição. Sem conflitos, mas cara de procurar.
- **Associativa por conjuntos** (n vias): cada bloco pode ficar em n posições de um conjunto. O meio-termo usado na prática (L1 com 8 vias, por exemplo).

O endereço é dividido em **tag** | **índice** (qual conjunto) | **deslocamento** (qual byte do bloco).

**Tipos de falta (os 3 Cs):** compulsória (primeira vez que o bloco é usado), de capacidade (a cache é pequena demais para os dados em uso) e de conflito (blocos disputando o mesmo conjunto).

**Escrita:** *write-through* (escreve na cache e na memória) ou *write-back* (escreve só na cache e marca a linha como suja; grava na memória ao remover). Com vários núcleos, protocolos de **coerência** (como o MESI) garantem que todos vejam o mesmo valor, o que você verá em Concorrência.

**Tempo médio de acesso** = tempo de acerto + taxa de falta × penalidade da falta. Com L1 de 1 ns, 5% de faltas e penalidade de 80 ns: 1 + 0,05 × 80 = **5 ns**. Reduzir a taxa de faltas de 5% para 2% leva a 2,6 ns: quase o dobro de velocidade.

### 6.3 Memória virtual

Cada processo enxerga um **espaço de endereçamento virtual** próprio, como se tivesse toda a memória só para ele. O hardware (a **MMU**) traduz endereços virtuais em físicos, em blocos de tamanho fixo (**páginas**, tipicamente 4 KB), usando uma **tabela de páginas** mantida pelo sistema operacional. A **TLB** é uma cache das traduções recentes.

Benefícios: **isolamento** (um processo não enxerga a memória do outro), **proteção** (páginas só de leitura, não executáveis), usar mais memória do que existe (páginas pouco usadas vão para o disco) e compartilhar bibliotecas entre processos. Isso é o assunto central da próxima etapa (Sistemas Operacionais).

### 6.4 Desempenho

A hierarquia de memória domina o desempenho de muitos programas. Um acesso à DRAM custa o mesmo que **centenas** de operações aritméticas. Regras práticas:

**Percorra na ordem em que os dados estão guardados.** Em C, matrizes são guardadas **por linhas** (*row-major*):

```c
// rápido: anda pela memória sequencialmente
for (int i = 0; i < N; i++)
    for (int j = 0; j < N; j++)
        soma += m[i][j];

// lento: salta N × 4 bytes a cada acesso, uma falta de cache quase a cada elemento
for (int j = 0; j < N; j++)
    for (int i = 0; i < N; i++)
        soma += m[i][j];
```

Com N = 4096, a segunda versão pode ser **5 a 10 vezes mais lenta**, fazendo exatamente as mesmas operações.

**Outras técnicas:**

- **Blocagem** (*tiling*): processar a matriz em blocos que cabem na cache. Na multiplicação de matrizes, dá ganhos de várias vezes.
- **Estruturas contíguas:** arrays em vez de listas ligadas; "estrutura de arrays" em vez de "array de estruturas" quando se percorre um campo só.
- **Evitar falso compartilhamento:** duas threads escrevendo em variáveis diferentes na **mesma linha de cache** disputam a linha entre os núcleos (Concorrência).

Ferramentas: `perf stat -e cache-misses` (Linux), `valgrind --tool=cachegrind`.

### Atividades de fixação do Tema 6

1. Uma cache de mapeamento direto tem 8 linhas de 16 bytes. Para os endereços (em decimal) 0, 4, 16, 132, 232, 160, 1024, 30, 140, 3100, 180, 2180, diga para cada um: índice, tag, e se é acerto ou falta (cache começa vazia).
2. Uma cache de 32 KB, associativa por conjuntos de 8 vias, com linhas de 64 bytes, num sistema com endereços de 48 bits. Quantos bits de deslocamento, de índice e de tag?
3. Calcule o tempo médio de acesso de um sistema com L1 (1 ns, 5% de faltas), L2 (5 ns, 20% de faltas locais) e DRAM (80 ns).
4. Meça em C o tempo de somar uma matriz 4096 × 4096 de `int` por linhas e por colunas. Explique a diferença em termos de linhas de cache.
5. Escreva a multiplicação de matrizes com os laços na ordem i-j-k e i-k-j, e meça para N = 1024. Por que a ordem i-k-j é mais rápida?
6. Por que uma lista ligada de 10⁷ nós alocados em ordem aleatória é muito mais lenta para percorrer que um array de 10⁷ elementos, se ambas são O(n)?

## Projeto da etapa

**Escolha um dos caminhos:**

**A) Nand2Tetris, partes 1 e 2 (recomendado):** construa, nas ferramentas do curso, as portas lógicas a partir de NAND, a ALU, a memória (registradores e RAM), a CPU Hack e o computador completo; depois o assembler (em Python ou outra linguagem), o tradutor da máquina virtual e o compilador da linguagem Jack, até rodar um jogo (Tetris, Pong) no computador que você montou. São 12 projetos; a parte 1 (projetos 1 a 6) cobre esta etapa, e a parte 2 antecipa Compiladores e Sistemas Operacionais.

**B) Processador RISC-V num simulador:**

1. Implemente um processador RV32I **monociclo** no Digital ou Logisim Evolution (ou em Verilog com simulação no Icarus Verilog ou Verilator): PC, memória de instruções, banco de registradores, gerador de imediatos, ALU, memória de dados e unidade de controle.
2. Teste com programas em assembly (soma de array, Fibonacci, ordenação por inserção) gerados pelo RARS.
3. Transforme em **pipeline de 5 etapas** com adiantamento e detecção de hazard de *load*; meça o CPI nos mesmos programas.
4. Escreva um simulador de cache em Python que lê um rastro de endereços e reporta a taxa de acerto para diferentes tamanhos, associatividades e tamanhos de linha.

## Para ir além

- **Nand2Tetris** (nand2tetris.org e Coursera, gratuito) e o livro *The Elements of Computing Systems*.
- **MIT 6.004** no OpenCourseWare e o curso aberto *Computation Structures* no MIT Open Learning Library.
- *Computer Organization and Design RISC-V Edition* (Patterson e Hennessy), o livro-texto clássico.
- *Computer Systems: A Programmer's Perspective* (Bryant e O'Hallaron, base do CMU 15-213): representação de dados, assembly e memória do ponto de vista de quem programa.
- *Digital Design and Computer Architecture* (Harris e Harris), com Verilog e RISC-V.
- *What Every Programmer Should Know About Memory* (Ulrich Drepper, gratuito).

## Resumão

- NAND é universal. Álgebra booleana e mapas de Karnaugh simplificam circuitos.
- Combinacional: saída só das entradas. MUX é o "if" do hardware. Somador em cascata O(n); antecipação O(log n).
- Sequencial: memória por realimentação. Flip-flop D captura na borda do relógio. Registradores, contadores, máquinas de estado.
- SRAM (rápida, cache), DRAM (densa, precisa de refresh), Flash (não volátil).
- Complemento de dois: inverte e soma 1; mesmo somador para tudo; cuidado com estouro.
- IEEE 754: sinal, expoente com viés, fração com 1 implícito. Precisão relativa; NaN ≠ NaN.
- UTF-8 de 1 a 4 bytes, compatível com ASCII. Little-endian na CPU, big-endian na rede.
- ISA é o contrato software/hardware. RISC-V: 32 registradores, load/store, instruções de 32 bits.
- Função: argumentos em a0 a a7, jal/ret, pilha para salvar ra e registradores s.
- Cinco etapas: IF, ID, EX, MEM, WB. Pipeline melhora a vazão; hazards estruturais, de dados (adiantamento, bolhas) e de controle (previsão).
- Localidade temporal e espacial sustentam a hierarquia. Linhas de 64 bytes. Tempo médio = acerto + taxa de falta × penalidade.
- Memória virtual: páginas, tabela de páginas, TLB, isolamento.
- Percorra os dados na ordem da memória; blocagem; estruturas contíguas.
