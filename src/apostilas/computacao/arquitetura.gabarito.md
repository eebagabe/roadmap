# Gabarito: Sistemas Digitais e Arquitetura de Computadores

Abra só depois de tentar.

## Tema 1

1. NOT A = NAND(A, A). AND(A, B) = NOT(NAND(A, B)) = NAND(N, N) com N = NAND(A, B). OR(A, B) = NAND(NOT A, NOT B) = NAND(NAND(A, A), NAND(B, B)). **XOR com 4 NANDs:** N = NAND(A, B); XOR = NAND(NAND(A, N), NAND(B, N)).
2. (a) AB + AB' = A(B + B') = **A**. (b) A'B'C + A'BC = A'C(B' + B) = A'C; AB'C + ABC = AC; A'C + AC = **C**. (c) (A + B)(A + B') = A + BB' (distributiva) = A + 0 = **A**.
3. Tabela: saída 1 nas linhas 011, 101, 110, 111. Soma de produtos: A'BC + AB'C + ABC' + ABC. Simplificando (ABC pode ser usado três vezes, porque X + X = X): (A'BC + ABC) + (AB'C + ABC) + (ABC' + ABC) = BC + AC + AB. **Maioria = AB + AC + BC**. É exatamente a fórmula do vai-um do somador completo.
4. Dois MUX 2:1 na primeira camada, controlados por S0: um escolhe entre I0 e I1, o outro entre I2 e I3. Um terceiro MUX 2:1, controlado por S1, escolhe entre as duas saídas.
5. 7 + 5 = 0111 + 0101 = **1100** (12). 9 + 8 = 1001 + 1000 = 1 0001: os 4 bits mostram **0001** e há **vai-um para fora** (o resultado 17 não cabe em 4 bits sem sinal). Em complemento de dois, 9 e 8 nem cabem em 4 bits (o máximo é 7), então 1001 e 1000 seriam −7 e −8, e a soma −15 também estoura.
6. O vai-um atravessa 64 somadores com 2 portas cada: **128 ns**. Frequência máxima ≈ 1/128 ns ≈ **7,8 MHz**. Processadores de GHz só existem porque usam antecipação de vai-um (atraso logarítmico) e pipeline.

## Tema 2

1. Com S = 1 e R = 0, Q vai a 1; com S = 0 e R = 1, Q vai a 0; com ambos 0, mantém. Com **S = R = 1**, as duas saídas Q e Q' vão a 0, violando Q' = NOT Q. Pior: se S e R voltarem a 0 **ao mesmo tempo**, o resultado depende de qual porta for mais rápida (condição de corrida, possível oscilação). É uma entrada proibida; o latch D evita o problema gerando S e R a partir de um único sinal.
2. Quatro flip-flops D com o mesmo relógio; na entrada D de cada um, um MUX 2:1 com seleção `carga`: se carga = 1, entra o bit novo; se 0, entra a própria saída Q (mantém o valor).
3. Contador de 3 bits: registrador de 3 bits cuja entrada é a saída mais 1 (somador ou lógica dedicada); depois de 7 (111) vai naturalmente para 0 (000) porque o vai-um final é descartado. Até 5: detecte o valor 101 com uma porta AND (Q2 ∧ Q0, já que 7 nunca ocorre) e, nesse caso, carregue 0 em vez de valor + 1.
4. Estados: S0 (nada útil), S1 (viu "1"), S2 (viu "10"), S3 (viu "101", saída 1).
   | Estado | entra 0 | entra 1 | Saída |
   |---|---|---|---|
   | S0 | S0 | S1 | 0 |
   | S1 | S2 | S1 | 0 |
   | S2 | S0 | S3 | 0 |
   | S3 | S2 | S1 | 1 |

   A sobreposição está em S3 com 0 → S2: o "10" final de "101" já serve de começo para o próximo. Em "10101", a saída vale 1 depois do 3º e do 5º bits.
5. A DRAM guarda o bit como **carga num capacitor**, que vaza com o tempo (milissegundos): precisa ser lida e reescrita periodicamente. A SRAM usa realimentação ativa entre transistores, que mantém o valor enquanto houver energia. A DRAM é usada como memória principal porque precisa de **1 transistor e 1 capacitor** por bit, contra 6 transistores da SRAM: é muito mais densa e barata por gigabyte.
6. Período mínimo = 0,4 + 0,05 + 0,05 = 0,5 ns. Frequência máxima = **2 GHz**.

## Tema 3

1. 173 = 128 + 32 + 8 + 4 + 1 = **1010 1101** = **0xAD**. 0x3F = 3 × 16 + 15 = **63**. −37: 37 = 0010 0101; inverte: 1101 1010; soma 1: **1101 1011** (0xDB).
2. 100 + 50 = 150, mas o máximo em 8 bits com sinal é 127: o resultado aparece como 150 − 256 = **−106**. −100 − 50 = −150 aparece como **+106**. Ambos são **estouro**. Detecção: somar dois números de mesmo sinal e obter sinal diferente; em hardware, o vai-um **para dentro** do bit de sinal é diferente do vai-um **para fora** dele (XOR entre os dois).
3. −6,25 = −1,1001₂ × 2²: sinal 1; expoente 2 + 127 = 129 = 1000 0001; fração 1001 0000 ... Bits: 1 10000001 10010000000000000000000 = **0xC0C80000**. 0,1 = 1,10011001100...₂ × 2⁻⁴: sinal 0, expoente 123 = 0111 1011, fração 1001 1001 1001 1001 1001 101 (arredondada para cima) = **0x3DCCCCCD**. O último dígito D (em vez de C) mostra o arredondamento: o float guardado é ligeiramente **maior** que 0,1.
4. Float: **16.777.217** (2²⁴ + 1): com 24 bits de precisão (23 + o 1 implícito), acima de 2²⁴ o espaçamento entre floats é 2. Double: **9.007.199.254.740.993** (2⁵³ + 1). Em Python, `float(2**53 + 1) == 2**53` dá `True`; com NumPy, `np.float32(16777217) == np.float32(16777216)` também.
5. A (1 byte), ç (2), ã (2), o (1), espaço (1), 😀 (4): **11 bytes** em UTF-8 e **6 pontos de código**. `len(s)` = 6 e `len(s.encode())` = 11.
6. ```c
   #include <stdio.h>
   int main(void) {
       unsigned int x = 1;
       unsigned char *p = (unsigned char *)&x;
       printf(*p == 1 ? "little-endian\n" : "big-endian\n");
       return 0;
   }
   ```
   Se o byte no menor endereço é 1 (o menos significativo), a máquina é little-endian.

## Tema 4

1. ```asm
       bge  t0, t1, senao     # se a >= b, vai para o else
       mv   t2, t0            # c = a
       j    fim
   senao:
       mv   t2, t1            # c = b
   fim:
   ```
2. ```asm
   max_array:                 # a0 = endereço, a1 = n (n >= 1)
       lw   t0, 0(a0)         # max = a[0]
       li   t1, 1             # i = 1
   laco:
       bge  t1, a1, fim
       slli t2, t1, 2
       add  t2, a0, t2
       lw   t3, 0(t2)
       ble  t3, t0, prox      # se a[i] <= max, não troca
       mv   t0, t3
   prox:
       addi t1, t1, 1
       j    laco
   fim:
       mv   a0, t0
       ret
   ```
3. ```asm
   strlen:                    # a0 = endereço da string
       mv   t0, a0
   laco:
       lbu  t1, 0(t0)         # carrega um byte (sem sinal)
       beqz t1, fim           # achou o '\0'
       addi t0, t0, 1
       j    laco
   fim:
       sub  a0, t0, a0        # tamanho = fim − início
       ret
   ```
4. Estrutura igual ao fatorial: salve ra e s0 (n) e também s1 (para guardar fib(n − 1) enquanto calcula fib(n − 2)). Durante `fib(3)`, a pilha chega a ter três quadros empilhados: fib(3), fib(2), fib(1). Quando fib(1) retorna, seu quadro é liberado e fib(2) chama fib(0) no **mesmo espaço** de pilha. Depois fib(2) retorna e fib(3) chama fib(1), de novo reutilizando o espaço.
5. Com `-O2`, o compilador gera algo como `slli a0, a0, 3` seguido de `addi a0, a0, 1`. Multiplicar por 8 = 2³ é **deslocar 3 bits à esquerda**, que custa 1 ciclo, enquanto `mul` pode custar vários. Compiladores fazem essa troca (*strength reduction*) sozinhos; não é preciso escrever `x << 3` no código-fonte.
6. Um registrador sempre zero dispensa várias instruções: `mv rd, rs` é `addi rd, rs, 0`; `li rd, 5` é `addi rd, x0, 5`; `nop` é `addi x0, x0, 0` (escrever em x0 não tem efeito); `j rotulo` é `jal x0, rotulo` (descarta o endereço de retorno); `beqz` é `beq rs, x0, rotulo`. A ISA fica menor e o hardware mais simples, e as "pseudoinstruções" do montador dão a comodidade.

## Tema 5

1. **IF:** busca a instrução no endereço do PC; PC ← PC + 4. **ID:** decodifica; lê t1 do banco de registradores; o gerador de imediatos extrai 8. **EX:** a ALU calcula o endereço t1 + 8. **MEM:** lê a palavra nesse endereço da memória de dados. **WB:** escreve o valor lido em t0.
2. | Instrução | Escreve reg. | 2º operando da ALU | Lê mem. | Escreve mem. | Resultado de | Desvio |
   |---|---|---|---|---|---|---|
   | `add` | Sim | Registrador | Não | Não | ALU | Não |
   | `addi` | Sim | Imediato | Não | Não | ALU | Não |
   | `lw` | Sim | Imediato | Sim | Não | Memória | Não |
   | `sw` | Não | Imediato | Não | Sim | (nenhum) | Não |
   | `beq` | Não | Registrador | Não | Não | (nenhum) | Se iguais |
   | `jal` | Sim | (não usa) | Não | Não | PC + 4 | Sempre |
3. Com pipeline, o ciclo fica 200 + 20 = 220 ps e, num programa longo, termina uma instrução por ciclo. Ganho de vazão: 800/220 ≈ **3,6 vezes** (e não 5: as etapas não são perfeitamente iguais e os registradores de pipeline custam tempo).
4. Dependências: `lw t0` → `add` (usa t0); `add t1` → `sub` (usa t1); `sub t3` → `sw` (guarda t3). **Com adiantamento:** só o *load* seguido de uso exige **1 bolha**; as outras duas são resolvidas por adiantamento (inclusive a do `sw`, que só precisa de t3 no MEM). **Sem adiantamento** (supondo que o banco de registradores escreve na primeira metade do ciclo e lê na segunda): cada dependência imediata exige **2 bolhas**, total de **6**.
5. ```asm
   lw  t0, 0(a0)
   lw  t2, 4(a0)       # independente: ocupa o lugar da bolha
   add t1, t0, t0      # t0 já chegou
   add t3, t2, t2      # t2 chega a tempo por adiantamento
   ```
6. Com `-O1`, o laço tem um desvio `if (x >= 128)`: com dados aleatórios, o preditor erra ~50% das vezes; com dados ordenados, erra quase nunca, e a versão ordenada fica **várias vezes mais rápida** (ordenar antes não entra na medida). Com `-O3`, o compilador costuma trocar o desvio por uma instrução condicional sem salto (*conditional move*) ou por vetorização, e a diferença **desaparece**: não há mais desvio para prever.

## Tema 6

1. Linhas de 16 bytes: deslocamento de 4 bits; 8 linhas: índice de 3 bits. Bloco = endereço ÷ 16; índice = bloco mod 8; tag = bloco ÷ 8.
   | Endereço | Índice | Tag | Resultado |
   |---|---|---|---|
   | 0 | 0 | 0 | Falta |
   | 4 | 0 | 0 | **Acerto** |
   | 16 | 1 | 0 | Falta |
   | 132 | 0 | 1 | Falta (substitui a tag 0) |
   | 232 | 6 | 1 | Falta |
   | 160 | 2 | 1 | Falta |
   | 1024 | 0 | 8 | Falta (substitui) |
   | 30 | 1 | 0 | **Acerto** |
   | 140 | 0 | 1 | Falta (1024 tinha tomado a linha) |
   | 3100 | 1 | 24 | Falta (substitui) |
   | 180 | 3 | 1 | Falta |
   | 2180 | 0 | 17 | Falta (substitui) |

   2 acertos em 12. Os endereços 132, 1024, 140 e 2180 disputam a linha 0: **faltas de conflito** que uma cache associativa evitaria.
2. Linhas: 32 KB / 64 B = 512. Conjuntos: 512 / 8 = 64. **Deslocamento: 6 bits** (2⁶ = 64), **índice: 6 bits** (2⁶ = 64 conjuntos), **tag: 48 − 12 = 36 bits**.
3. Tempo médio da L2 (vista pela L1) = 5 + 0,2 × 80 = 21 ns. Tempo médio total = 1 + 0,05 × 21 = **2,05 ns**.
4. Por linhas: cada linha de cache de 64 bytes traz 16 `int`s consecutivos, que são todos usados: ~1 falta a cada 16 acessos, e o pré-buscador do hardware ainda antecipa as próximas. Por colunas: elementos consecutivos do laço estão a 4096 × 4 = 16 KB de distância: cada acesso cai numa linha diferente, e quando o laço volta para a próxima coluna, aquelas linhas já foram expulsas. Quase **todo** acesso é falta. Diferença típica: 5 a 10 vezes.
5. Na ordem i-j-k, o laço interno faz `c[i][j] += a[i][k] * b[k][j]`: percorre b **por coluna** (saltos de N elementos). Na ordem i-k-j, o laço interno faz `c[i][j] += a[i][k] * b[k][j]` variando j: percorre b e c **por linha**, sequencialmente, e a[i][k] fica fixo num registrador. As mesmas N³ operações, com muito menos faltas de cache (e o compilador consegue vetorizar). Ganho típico de 3 a 10 vezes para N = 1024.
6. No array, os elementos são contíguos: cada linha de cache traz vários elementos e o pré-buscador acerta o próximo acesso. Na lista com nós espalhados pela memória, **cada nó** provavelmente é uma falta de cache (~80 ns na DRAM), e o próximo endereço só é conhecido depois de ler o nó atual, então nem dá para buscar adiantado. Ambos fazem n passos, mas o custo de cada passo difere por uma ordem de grandeza ou mais. Big O esconde as constantes, e a hierarquia de memória mora nelas.

## Projeto da etapa

Pontos de revisão:

- **Nand2Tetris:** use os testes `.tst` oficiais de cada chip; o simulador compara com os `.cmp` esperados. Na ALU Hack, as seis entradas de controle (zx, nx, zy, ny, f, no) geram todas as 18 funções a partir de um somador e de inversões: vale entender por que `!x` sai com zx = 0, nx = 0, zy = 1, ny = 1, f = 0, no = 1 (x AND 1...1, depois invertido).
- **Assembler:** duas passadas (a primeira registra os rótulos e seus endereços; a segunda traduz e aloca as variáveis a partir do endereço 16).
- **RISC-V monociclo:** o gerador de imediatos é a parte que mais dá bug (os bits do imediato ficam embaralhados nos formatos S e B para manter os registradores sempre nas mesmas posições). Teste cada formato isoladamente.
- **Pipeline:** a unidade de adiantamento compara o registrador de destino das instruções em EX/MEM e MEM/WB com os registradores de origem da instrução em ID/EX; dê prioridade à mais recente. Não adiante de x0.
- **Simulador de cache:** use rastros de programas reais (o Valgrind gera com `--tool=lackey --trace-mem=yes`) e mostre num gráfico como a taxa de acerto cresce com o tamanho até "cobrir" o conjunto de trabalho do programa, e depois estabiliza.
