# Sistemas Operacionais: Apostila Prática

Roadmap Ciência da Computação · Semanas 71 a 76

## Comece por aqui

Quando você roda `python3 script.py`, quem carrega o programa na memória, decide quando ele usa a CPU, impede que ele leia a memória de outro programa, entrega os bytes do arquivo e manda o texto para a tela? O **sistema operacional**. Ele é o programa que gerencia todos os outros, criando três grandes ilusões: cada programa acha que tem a CPU só para ele (**virtualização da CPU**), que tem toda a memória só para ele (**virtualização da memória**), e que os dados no disco são arquivos organizados e duráveis (**persistência**). Além disso, ele lida com a **concorrência** que essas ilusões criam. Esta etapa segue a estrutura do livro gratuito *Operating Systems: Three Easy Pieces* e os laboratórios do xv6, um Unix didático do MIT.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CSC-33 Sistemas Operacionais |
| MIT | 6.1810 (antiga 6.S081/6.828) Operating System Engineering; 6.1800 Computer Systems Engineering |
| Harvard | CS 61 Systems Programming; CS 1610 Operating Systems |
| Oxford | Operating Systems (2º ano) |

### Como esta apostila funciona

1. Use Linux (ou WSL). Os programas desta etapa usam chamadas de sistema POSIX em C.
2. Compile sempre com `gcc -Wall -Wextra -g -fsanitize=address,undefined`: o compilador e os *sanitizers* apontam metade dos bugs antes de você procurar.
3. Se possível, faça os laboratórios do **xv6** (MIT 6.1810, públicos): você modifica um sistema operacional de verdade, pequeno o bastante para ler inteiro.
4. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** programa em C travou ou deu `Segmentation fault`? Rode no `gdb` (`gdb ./prog`, `run`, `bt` para ver a pilha no momento do erro) ou com o AddressSanitizer, que diz a linha exata do acesso inválido. Nunca depure memória "no olho".

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 71 | Tema 1: Programação de sistemas em C |
| 72 | Tema 2: Processos e chamadas de sistema |
| 73 | Tema 3: Escalonamento e threads |
| 74 | Tema 4: Memória virtual |
| 75 | Tema 5: Concorrência |
| 76 | Tema 6: Sistemas de arquivos e virtualização + projeto |

## Tema 1: Programação de sistemas em C

**Objetivo:** dominar ponteiros e gerenciamento de memória em C e as ferramentas para depurar.

### 1.1 Ponteiros

Um **ponteiro** guarda um **endereço de memória**. Em Arquitetura você viu que `lw t0, 0(t2)` lê da memória no endereço em t2: ponteiros são isso, no nível do C.

```c
int x = 42;
int *p = &x;        // p recebe o endereço de x
printf("%d\n", *p); // *p acessa o valor no endereço: 42
*p = 7;             // muda x através do ponteiro
```

**Aritmética de ponteiros:** `p + 1` avança `sizeof(*p)` bytes. Por isso `a[i]` é, por definição, `*(a + i)`, e o nome de um array, na maioria dos usos, vira um ponteiro para o primeiro elemento.

```c
int a[4] = {10, 20, 30, 40};
int *q = a;
printf("%d %d\n", *(q + 2), q[2]);   // 30 30
```

Ponteiros permitem que funções modifiquem variáveis de quem chamou (passagem "por referência"):

```c
void troca(int *a, int *b) { int t = *a; *a = *b; *b = t; }
troca(&x, &y);
```

**Strings** em C são arrays de `char` terminados por `'\0'`. Não guardam o tamanho: funções como `strlen` percorrem até achar o zero. Esquecer o terminador ou não reservar espaço para ele é bug clássico.

Ponteiros para funções, `struct`s e ponteiros para `struct` (`p->campo` é `(*p).campo`) completam o kit.

### 1.2 Memória em C

Um processo tem várias regiões de memória:

```
endereços altos   ┌─────────────────┐
                  │ pilha (stack)   │  variáveis locais; cresce para baixo
                  │       ↓         │
                  │                 │
                  │       ↑         │
                  │ heap            │  malloc/free; cresce para cima
                  ├─────────────────┤
                  │ dados (globais) │
                  ├─────────────────┤
endereços baixos  │ código (text)   │
                  └─────────────────┘
```

- **Pilha:** automática; a variável some quando a função retorna.
- **Heap:** manual; `malloc` reserva, `free` devolve.

```c
int *v = malloc(n * sizeof *v);
if (v == NULL) { perror("malloc"); exit(1); }
for (int i = 0; i < n; i++) v[i] = i * i;
free(v);
v = NULL;           // evita usar por engano
```

Os bugs clássicos de memória em C:

| Bug | Exemplo | Consequência |
|---|---|---|
| Estouro de buffer | escrever em `a[10]` num `int a[10]` | Corrompe dados vizinhos; vulnerabilidade |
| Uso depois de liberar | usar `p` depois de `free(p)` | Lixo, crash ou exploração |
| Liberação dupla | `free(p); free(p);` | Corrompe o alocador |
| Vazamento | `malloc` sem `free` | Memória acaba aos poucos |
| Ponteiro para local | devolver `&x` de uma variável local | Aponta para pilha reutilizada |
| Não inicializado | ler variável sem valor | Comportamento imprevisível |

Esses bugs são a origem de cerca de **70% das vulnerabilidades graves** em grandes bases de código C e C++ (dados divulgados pela Microsoft e pelo Google). É a principal motivação de linguagens com **segurança de memória** como Rust.

> **Cuidado! Cai na entrevista:** `sizeof(array)` dentro da função onde o array foi declarado dá o tamanho total em bytes; dentro de uma função que o recebeu como parâmetro, dá o tamanho de um **ponteiro** (8 bytes). Sempre passe o tamanho junto.

### 1.3 gdb

O **gdb** é o depurador padrão do Linux. Compile com `-g` (informações de depuração) e `-O0` (sem otimizações, para o código bater com o fonte).

| Comando | Faz |
|---|---|
| `run args` | Roda o programa |
| `break arquivo.c:42` / `break funcao` | Ponto de parada |
| `next` / `step` | Próxima linha (sem entrar / entrando em funções) |
| `continue` | Continua até o próximo ponto de parada |
| `print x`, `print *p`, `print a[0]@10` | Mostra valores |
| `bt` | Pilha de chamadas (o primeiro comando depois de um crash) |
| `frame 2` | Vai para outro quadro da pilha |
| `watch x` | Para quando x mudar |
| `x/16xb p` | Examina 16 bytes de memória em hexadecimal |

Com um *core dump* (`ulimit -c unlimited`), dá para examinar um crash depois que ele aconteceu: `gdb ./prog core`.

### 1.4 Valgrind e sanitizers

**AddressSanitizer** (`-fsanitize=address`): instrumenta o programa na compilação e detecta estouros de buffer, uso depois de liberar, liberação dupla e vazamentos, mostrando a linha e a pilha. Deixa o programa ~2 vezes mais lento: use sempre durante o desenvolvimento.

**UndefinedBehaviorSanitizer** (`-fsanitize=undefined`): estouro de inteiro com sinal, deslocamentos inválidos, desalinhamento.

**ThreadSanitizer** (`-fsanitize=thread`): condições de corrida (Tema 5).

**Valgrind** (`valgrind --leak-check=full ./prog`): roda o programa numa CPU simulada e detecta erros de memória sem recompilar. Bem mais lento (~20 a 50 vezes), mas não precisa de flags especiais.

```
==12345==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000000038
WRITE of size 4 at 0x602000000038 thread T0
    #0 0x401234 in preenche main.c:12
```

Leia como um *traceback* do Python: o tipo do erro, a operação e onde aconteceu.

### Atividades de fixação do Tema 1

1. Explique a saída e desenhe a memória:
   ```c
   int a[3] = {1, 2, 3};
   int *p = a + 1;
   *p += 10;
   p[1] = *a + *p;
   printf("%d %d %d\n", a[0], a[1], a[2]);
   ```
2. Escreva `char *duplica(const char *s)` que devolve uma cópia nova (como `strdup`). Quem deve liberar a memória? Documente.
3. Implemente um array dinâmico de `int` em C (`struct` com ponteiro, tamanho e capacidade; funções de criar, adicionar, obter, liberar), sem vazamentos (confirme com Valgrind ou ASan).
4. Encontre os bugs deste código e confirme com ASan:
   ```c
   char *saudacao(const char *nome) {
       char buf[16];
       strcpy(buf, "Olá, ");
       strcat(buf, nome);
       return buf;
   }
   ```
5. Use o gdb para achar a causa de um `Segmentation fault` num programa que percorre uma lista ligada até `p->prox` sem verificar `NULL`.
6. Por que `char *s = "abc"; s[0] = 'x';` pode dar erro, mas `char s[] = "abc"; s[0] = 'x';` não?

## Tema 2: Processos e chamadas de sistema

**Objetivo:** entender o que é um processo, como programas pedem serviços ao sistema e como o Unix cria processos.

### 2.1 Processos

Um **programa** é um arquivo executável parado no disco. Um **processo** é um programa **em execução**: o código, mais o estado (registradores, PC, pilha, heap, arquivos abertos). O sistema mantém, para cada processo, uma estrutura (o **PCB**, *process control block*) com identificador (**PID**), estado, registradores salvos, tabela de páginas, arquivos abertos e informações de escalonamento.

Estados de um processo:

```
  criado → pronto ⇄ executando → terminado
             ↑          ↓
             └─ bloqueado ┘   (esperando E/S, um evento, um lock)
```

Ferramentas: `ps aux`, `top`/`htop`, `/proc/<pid>/` (no Linux, o estado de cada processo exposto como arquivos), `pstree`.

### 2.2 Chamadas de sistema

Um programa comum não pode acessar o hardware diretamente (disco, rede, a memória de outros). Ele **pede** ao sistema operacional por meio de **chamadas de sistema** (*system calls*): `read`, `write`, `open`, `fork`, `exec`, `mmap`, `exit`... O Linux tem cerca de 350.

Na prática, a chamada é uma instrução especial (`ecall` no RISC-V, `syscall` no x86-64) que **muda o processador para o modo kernel** e salta para um ponto de entrada fixo do sistema, passando o número da chamada e os argumentos em registradores.

```c
#include <unistd.h>
int main(void) {
    write(1, "olá\n", 5);     // 1 = saída padrão; chama o kernel diretamente
    return 0;
}
```

`printf` é uma função da biblioteca C que formata e guarda num buffer; de vez em quando ela chama `write`. Rode `strace ./prog` para ver todas as chamadas de sistema de um programa: é uma das ferramentas de diagnóstico mais úteis do Linux.

### 2.3 Modo usuário e kernel

O processador tem (pelo menos) dois **modos de privilégio**:

- **Modo usuário:** instruções privilegiadas (configurar a MMU, desligar interrupções, acessar dispositivos) são proibidas; tentar executá-las gera uma exceção.
- **Modo kernel:** tudo é permitido.

O kernel ganha o controle de volta em três situações:

1. **Chamada de sistema** (o programa pede).
2. **Exceção** (o programa errou: divisão por zero, acesso a memória inválida, que vira o `Segmentation fault`).
3. **Interrupção** (um dispositivo avisa: chegou um pacote, o disco terminou, ou o **temporizador** disparou).

A interrupção do **temporizador** é o que garante que nenhum programa monopolize a CPU: periodicamente (a cada poucos milissegundos), o kernel retoma o controle e decide quem roda a seguir. É a base do Tema 3.

Essa arquitetura é a **execução direta limitada**: o programa roda direto no processador, na velocidade total, mas com limites impostos pelo hardware e pelo kernel.

### 2.4 fork e exec

No Unix, processos são criados em dois passos:

- **`fork()`** cria uma **cópia** do processo atual. Retorna **duas vezes**: no filho, retorna 0; no pai, retorna o PID do filho.
- **`exec()`** (família `execvp`, `execl`...) **substitui** o programa do processo atual por outro (o PID continua o mesmo).
- **`wait()`** faz o pai esperar o filho terminar e pegar o código de saída.

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
    } else if (pid == 0) {                       // filho
        char *args[] = {"ls", "-l", NULL};
        execvp("ls", args);
        perror("execvp");                        // só chega aqui se o exec falhar
        _exit(127);
    } else {                                     // pai
        int status;
        waitpid(pid, &status, 0);
        printf("filho terminou com código %d\n", WEXITSTATUS(status));
    }
    return 0;
}
```

É exatamente o que um **shell** faz para cada comando. A separação entre `fork` e `exec` permite que, **entre os dois**, o filho ajuste o ambiente: redirecionar a saída para um arquivo (`>`), ligar dois processos com um **pipe** (`|`), mudar de diretório. Com `dup2`, o filho troca o descritor 1 (saída padrão) por um arquivo ou pela ponta de um pipe antes de executar o programa.

**Descritores de arquivo:** números pequenos que identificam arquivos abertos de um processo: 0 (entrada padrão), 1 (saída), 2 (erro). São herdados no `fork` e mantidos no `exec`. "No Unix, tudo é arquivo": arquivos, pipes, terminais e conexões de rede usam o mesmo `read` e `write`.

**Sinais:** notificações assíncronas para processos: `SIGINT` (Ctrl+C), `SIGTERM` (pedido de término), `SIGKILL` (término forçado, não pode ser tratado), `SIGSEGV` (acesso inválido), `SIGCHLD` (um filho terminou). Um processo pode instalar funções de tratamento com `sigaction`.

> **Cuidado! Cai na entrevista:** um processo que terminou mas cujo pai ainda não chamou `wait` vira **zumbi** (ocupa uma entrada na tabela de processos). Um filho cujo pai morreu é **órfão** e é adotado pelo processo 1 (init/systemd), que faz o `wait` por ele.

### Atividades de fixação do Tema 2

1. Quantas vezes "oi" é impresso? Desenhe a árvore de processos.
   ```c
   fork(); fork(); fork();
   printf("oi\n");
   ```
2. Rode `strace -c ls` e `strace -c python3 -c "print(1)"`. Quais chamadas aparecem mais? Por que o Python faz tantas?
3. Escreva um programa que cria um filho, o filho imprime o próprio PID e o do pai (`getpid`, `getppid`) e termina com código 3; o pai espera e imprime o código.
4. Implemente `ls | wc -l` em C com `pipe`, `fork`, `dup2` e `execvp`. Por que é preciso fechar as pontas não usadas do pipe?
5. Escreva um programa que trata `SIGINT` (Ctrl+C) imprimindo "não vou parar!" e só termina no terceiro Ctrl+C.
6. Crie um processo zumbi de propósito e observe-o com `ps` (coluna STAT = Z). Como eliminá-lo?

## Tema 3: Escalonamento e threads

**Objetivo:** entender como o sistema divide a CPU entre processos e threads.

### 3.1 Escalonamento de CPU

Com mais processos prontos que núcleos, o **escalonador** decide quem roda. Métricas que importam:

- **Tempo de retorno** (*turnaround*): do momento em que a tarefa chega até terminar. Importa em processamento em lote.
- **Tempo de resposta**: da chegada até começar a rodar. Importa em sistemas interativos.
- **Vazão**: tarefas concluídas por unidade de tempo.
- **Justiça**: todos recebem uma fatia razoável.

Não dá para otimizar tudo ao mesmo tempo: melhorar a resposta costuma piorar o retorno, e vice-versa.

### 3.2 Políticas de escalonamento

| Política | Ideia | Prós | Contras |
|---|---|---|---|
| FIFO | Na ordem de chegada | Simples | Uma tarefa longa atrasa todas (efeito comboio) |
| SJF | A mais curta primeiro | Ótima para retorno médio (sem preempção) | Precisa saber a duração; tarefas longas podem esperar para sempre |
| STCF | A que falta menos, com preempção | Ótima para retorno médio | Mesmos problemas do SJF |
| Round Robin | Cada uma roda uma fatia de tempo (*quantum*), em rodízio | Ótimo tempo de resposta, justo | Péssimo retorno; trocas de contexto custam |
| MLFQ | Várias filas de prioridade; quem usa a fatia inteira desce de nível | Favorece interativos sem saber a duração | Precisa de ajustes contra trapaças e inanição |
| Fatias proporcionais | Cada tarefa recebe uma fração da CPU conforme seu peso | Justiça controlada | Pior resposta para tarefas curtas |

A **MLFQ** (*multi-level feedback queue*) aprende com o comportamento: processos interativos (que bloqueiam logo, esperando o teclado) ficam nas filas de alta prioridade; os que usam muita CPU descem. Para evitar inanição, periodicamente todos sobem para o topo (*priority boost*).

O Linux usou por muito tempo o **CFS** (*Completely Fair Scheduler*), que guarda os processos numa **árvore rubro-negra** ordenada pelo tempo de CPU já usado (ajustado pelo peso) e sempre roda o que usou menos. Desde a versão 6.6 (2023), usa o **EEVDF**, uma evolução com prazos virtuais.

Com vários núcleos, entra a **afinidade**: manter um processo no mesmo núcleo aproveita o cache que ele já aqueceu.

### 3.3 Threads

Uma **thread** é uma linha de execução dentro de um processo. Threads do mesmo processo **compartilham** a memória (código, heap, globais, arquivos abertos), mas cada uma tem a sua **pilha** e os seus **registradores**.

```c
#include <pthread.h>
#include <stdio.h>

void *trabalho(void *arg) {
    int id = *(int *)arg;
    printf("thread %d\n", id);
    return NULL;
}

int main(void) {
    pthread_t t[4];
    int ids[4];
    for (int i = 0; i < 4; i++) {
        ids[i] = i;
        pthread_create(&t[i], NULL, trabalho, &ids[i]);
    }
    for (int i = 0; i < 4; i++)
        pthread_join(t[i], NULL);
    return 0;
}
```

(Compile com `-pthread`.)

| | Processos | Threads |
|---|---|---|
| Memória | Separada (isolamento) | Compartilhada |
| Criação e troca | Mais caras | Mais baratas |
| Comunicação | Pipes, sockets, memória compartilhada explícita | Direto pela memória (com sincronização!) |
| Um falha | Os outros seguem | Derruba o processo inteiro |

Usos: aproveitar vários núcleos (paralelismo) e não travar enquanto espera E/S (um servidor atende outros clientes enquanto um espera o disco). Compartilhar memória é poderoso e perigoso: é a origem das **condições de corrida** (Tema 5).

Em Python, o **GIL** (*global interpreter lock*) impede que threads executem bytecode Python em paralelo no CPython tradicional; para paralelismo de CPU, usa-se `multiprocessing` (a partir do Python 3.13 existe uma versão experimental sem GIL).

### 3.4 Troca de contexto

Trocar de um processo (ou thread) para outro é a **troca de contexto**: o kernel salva os registradores do atual no PCB, escolhe o próximo, restaura os registradores dele e (se for outro processo) troca a tabela de páginas.

O custo direto é de alguns microssegundos, mas o custo **indireto** pode ser maior: as caches e a TLB ficam "frias" com dados do processo anterior. Por isso fatias de tempo muito curtas desperdiçam CPU, e por isso servidores de alto desempenho evitam ter milhares de threads e preferem modelos com poucos threads e E/S assíncrona (`epoll`, `io_uring`, *event loops* como o do Node.js e o `asyncio` do Python).

### Atividades de fixação do Tema 3

1. Tarefas chegam no instante 0 com durações A = 10, B = 5, C = 2. Calcule o tempo médio de retorno e de resposta com FIFO (ordem A, B, C), SJF e Round Robin com quantum 1.
2. Explique o efeito comboio com um exemplo e como o SJF o evita.
3. Na MLFQ, um processo malicioso faz E/S logo antes de terminar cada fatia, para nunca descer de prioridade. Como o sistema pode impedir isso?
4. Crie 4 threads que somam, cada uma, um quarto de um array de 10⁸ elementos, guardando somas parciais separadas. Meça o ganho em relação a uma thread.
5. Meça o custo de uma troca de contexto: dois processos trocando um byte por dois pipes, um milhão de vezes (use `taskset` para fixar ambos no mesmo núcleo).
6. Por que um servidor com uma thread por conexão tem dificuldade para atender 100 mil conexões simultâneas? Que alternativa usar?

## Tema 4: Memória virtual

**Objetivo:** entender como cada processo ganha um espaço de endereçamento próprio e como o sistema administra a memória física.

### 4.1 Espaço de endereçamento

Cada processo enxerga um **espaço de endereçamento virtual** (no x86-64, 2⁴⁸ bytes = 256 TB) como se tivesse a máquina inteira. Os endereços que o programa usa (aqueles que você imprime com `printf("%p", p)`) são **virtuais**; o hardware os traduz para **físicos** a cada acesso.

Objetivos:

- **Transparência:** o programa não precisa saber onde está na memória física.
- **Proteção e isolamento:** um processo não consegue nem **nomear** a memória de outro.
- **Eficiência:** a tradução precisa ser rápida e econômica.

### 4.2 Paginação

A memória virtual e a física são divididas em blocos de tamanho fixo: **páginas** (virtuais) e **molduras** (*frames*, físicas), tipicamente de 4 KB. Um endereço virtual se divide em **número da página virtual** (VPN) e **deslocamento** dentro da página. A **tabela de páginas** do processo mapeia VPN → número da moldura física, mais bits de controle:

| Bit | Significado |
|---|---|
| Presente/válido | A página está mapeada na memória |
| Leitura/escrita/execução | Permissões |
| Usuário/kernel | Acessível em modo usuário? |
| Acessado | Foi usada recentemente (para substituição) |
| Sujo | Foi escrita (precisa salvar antes de descartar) |

Com 48 bits de endereço e páginas de 4 KB, uma tabela "plana" teria 2³⁶ entradas por processo: inviável. Solução: tabelas **multinível** (uma árvore de tabelas; o x86-64 usa 4 níveis de 9 bits cada, e partes não usadas do espaço não precisam de tabela).

**Falta de página** (*page fault*): o acesso a uma página não presente gera uma exceção; o kernel decide o que fazer: carregar do disco, alocar uma página zerada (o heap cresce assim, preguiçosamente), copiar (*copy-on-write*), ou matar o processo com `SIGSEGV` se o acesso for inválido.

**Copy-on-write** é o que torna o `fork` barato: pai e filho começam compartilhando as mesmas páginas físicas, marcadas como só leitura; quem escrever primeiro ganha uma cópia daquela página.

### 4.3 TLB

Cada acesso à memória exigiria percorrer a tabela de páginas (4 acessos extras). A **TLB** (*translation lookaside buffer*) é uma pequena cache, dentro da MMU, das traduções recentes (dezenas a milhares de entradas). Graças à localidade, acerta mais de 99% das vezes.

Na troca de contexto entre processos, as traduções da TLB deixam de valer: o sistema esvazia a TLB ou usa identificadores de espaço de endereçamento (ASID/PCID) para manter as de vários processos.

**Páginas grandes** (*huge pages*, 2 MB ou 1 GB) cobrem mais memória por entrada da TLB, ótimas para bancos de dados e máquinas virtuais.

### 4.4 Substituição de páginas

Quando a memória física enche, o sistema escolhe uma página para **despejar** (gravar no disco, na área de *swap*, se estiver suja). Políticas:

| Política | Ideia | Observação |
|---|---|---|
| Ótima (Belady) | Despeja a que será usada mais tarde | Impossível (exige prever o futuro); serve de referência |
| FIFO | A mais antiga | Simples, mas sofre a **anomalia de Belady**: mais memória pode dar mais faltas |
| LRU | A usada há mais tempo | Ótima aproximação, mas cara de implementar exatamente |
| Relógio (segunda chance) | Percorre as páginas em círculo; se o bit "acessado" está ligado, desliga e pula; senão, despeja | Aproximação barata de LRU, usada na prática |

**Thrashing:** quando o conjunto de páginas em uso ativo (o **conjunto de trabalho**) de todos os processos não cabe na memória, o sistema passa mais tempo trocando páginas com o disco do que executando. A máquina "congela". Soluções: matar ou suspender processos (no Linux, o **OOM killer**), ou comprar memória.

`mmap` expõe a memória virtual aos programas: mapeia um arquivo no espaço de endereçamento, e ler a memória **é** ler o arquivo (o kernel carrega as páginas sob demanda). Bancos de dados e carregadores de programas usam muito.

### Atividades de fixação do Tema 4

1. Com páginas de 4 KB e endereços virtuais de 32 bits, quantos bits têm a VPN e o deslocamento? Traduza o endereço virtual 0x00403A7C sabendo que a página virtual 0x403 está na moldura 0x1F2.
2. Por que uma tabela de páginas de um nível é inviável para 64 bits, e como a tabela multinível resolve?
3. Para a sequência de acessos às páginas 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2 com 3 molduras, conte as faltas com FIFO, LRU e ótima.
4. Mostre a anomalia de Belady com FIFO na sequência 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5, comparando 3 e 4 molduras.
5. Escreva um programa que aloca 1 GB com `malloc` sem escrever nada e observe o uso real de memória (RSS) com `ps`. Depois escreva um byte a cada 4 KB e observe de novo. Explique.
6. Explique por que o `fork` de um processo com 10 GB de memória é rápido.

## Tema 5: Concorrência

**Objetivo:** reconhecer condições de corrida e usar locks e variáveis de condição corretamente.

### 5.1 Condições de corrida

Duas threads incrementam um contador compartilhado um milhão de vezes cada:

```c
int contador = 0;
void *incrementa(void *arg) {
    for (int i = 0; i < 1000000; i++)
        contador++;
    return NULL;
}
```

O resultado esperado é 2.000.000, mas sai algo como 1.137.564, e muda a cada execução. Por quê? `contador++` são **três** instruções de máquina: ler para um registrador, somar 1, escrever de volta. Se a thread A lê 41, é interrompida, B lê 41, soma e escreve 42, e A volta, soma e escreve 42, um incremento se perdeu.

Uma **condição de corrida** é quando o resultado depende da **ordem** (não controlada) em que as threads executam. O trecho que acessa dados compartilhados é a **seção crítica**, e precisa de **exclusão mútua**: no máximo uma thread dentro dela por vez.

Corridas são os bugs mais traiçoeiros: aparecem raramente, somem quando você adiciona um `printf` para depurar e explodem em produção sob carga. Use o **ThreadSanitizer** (`-fsanitize=thread`).

### 5.2 Locks

Um **lock** (ou *mutex*) garante exclusão mútua: `lock` espera até conseguir; `unlock` libera.

```c
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
void *incrementa(void *arg) {
    for (int i = 0; i < 1000000; i++) {
        pthread_mutex_lock(&m);
        contador++;
        pthread_mutex_unlock(&m);
    }
    return NULL;
}
```

Como implementar um lock? Não dá só com leituras e escritas comuns de forma eficiente; o hardware oferece **instruções atômicas**, como **test-and-set** ou **compare-and-swap** (CAS: "se o valor ainda for X, troque por Y", tudo numa operação indivisível).

```c
// spinlock com operação atômica do C11
#include <stdatomic.h>
atomic_flag trava = ATOMIC_FLAG_INIT;
void lock(void)   { while (atomic_flag_test_and_set(&trava)) { /* gira */ } }
void unlock(void) { atomic_flag_clear(&trava); }
```

Um **spinlock** fica girando enquanto espera: bom para esperas muito curtas em múltiplos núcleos; desperdício se a espera for longa. Locks de verdade (como o `pthread_mutex` do Linux, baseado em **futex**) giram um pouco e depois **dormem**, pedindo ao kernel para acordá-los quando o lock for liberado.

Para operações simples como incrementar um contador, existem **operações atômicas** prontas (`atomic_fetch_add`), sem lock.

Desempenho: seções críticas devem ser **curtas**; um lock global para tudo serializa o programa (o paralelismo some). Locks mais finos (um por estrutura, um por balde da tabela hash) aumentam o paralelismo, ao custo de mais complexidade.

### 5.3 Variáveis de condição

Locks resolvem exclusão mútua; mas como uma thread **espera** que algo aconteça (uma fila deixar de estar vazia)? Girando num laço é desperdício. Uma **variável de condição** permite dormir até ser avisado:

- `pthread_cond_wait(&c, &m)`: **libera o lock e dorme**, atomicamente; ao acordar, readquire o lock.
- `pthread_cond_signal(&c)`: acorda uma thread que espera; `broadcast` acorda todas.

**Produtor e consumidor** com um buffer limitado, o padrão mais importante de concorrência:

```c
#define N 10
int buf[N], ini = 0, qtd = 0;
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t nao_cheio = PTHREAD_COND_INITIALIZER;
pthread_cond_t nao_vazio = PTHREAD_COND_INITIALIZER;

void produz(int x) {
    pthread_mutex_lock(&m);
    while (qtd == N)                          // while, não if!
        pthread_cond_wait(&nao_cheio, &m);
    buf[(ini + qtd) % N] = x;
    qtd++;
    pthread_cond_signal(&nao_vazio);
    pthread_mutex_unlock(&m);
}

int consome(void) {
    pthread_mutex_lock(&m);
    while (qtd == 0)
        pthread_cond_wait(&nao_vazio, &m);
    int x = buf[ini];
    ini = (ini + 1) % N;
    qtd--;
    pthread_cond_signal(&nao_cheio);
    pthread_mutex_unlock(&m);
    return x;
}
```

> **Cuidado! Cai na entrevista:** **sempre** espere numa condição dentro de um `while`, nunca de um `if`. Quando a thread acorda, outra pode ter chegado antes e consumido o item, e o padrão também permite **acordar sem motivo** (*spurious wakeup*). Rechecar a condição é obrigatório.

**Semáforos** (Dijkstra) são uma alternativa: um contador com `wait` (decrementa, dorme se ficar negativo) e `post` (incrementa, acorda alguém). Servem como lock (valor inicial 1) e para contar recursos (vagas no buffer).

### 5.4 Deadlocks

Um **deadlock** acontece quando threads esperam umas pelas outras em ciclo, para sempre. A thread 1 tem o lock A e espera B; a thread 2 tem B e espera A.

Quatro condições necessárias (de Coffman), todas ao mesmo tempo:

1. **Exclusão mútua:** recursos não compartilháveis.
2. **Posse e espera:** segura um recurso enquanto espera outro.
3. **Sem preempção:** ninguém tira o recurso à força.
4. **Espera circular:** um ciclo de esperas.

Quebre qualquer uma e não há deadlock. A técnica mais usada na prática é quebrar a 4: **adquirir os locks sempre na mesma ordem global** (por exemplo, pelo endereço do lock, ou por uma hierarquia documentada). Outras: `trylock` com recuo (quebra a 2), ou pegar todos os locks de uma vez.

Primos do deadlock: **livelock** (as threads não estão bloqueadas, mas ficam se desviando umas das outras sem progredir) e **inanição** (*starvation*: uma thread nunca consegue o recurso). E a **inversão de prioridade** (uma tarefa de alta prioridade espera um lock segurado por uma de baixa, que não roda), que quase derrubou a missão Mars Pathfinder em 1997, resolvida com herança de prioridade.

### Atividades de fixação do Tema 5

1. Rode o contador sem lock com 2, 4 e 8 threads e veja quantos incrementos se perdem. Depois rode com `-fsanitize=thread` e leia o relatório.
2. Corrija o contador de três formas: mutex, operação atômica e somas locais por thread juntadas no fim. Compare os tempos. Qual é mais rápida e por quê?
3. Explique o bug se o consumidor usar `if (qtd == 0) wait` com dois consumidores e um produtor.
4. Duas threads transferem dinheiro entre contas: `transfere(a, b, valor)` trava a conta de origem e depois a de destino. Mostre como ocorre deadlock e corrija.
5. Resolva o problema do jantar dos filósofos (5 filósofos, 5 garfos, cada um precisa dos dois garfos vizinhos) sem deadlock.
6. Implemente um lock de leitores e escritores (vários leitores ao mesmo tempo, ou um escritor sozinho) com mutex e variáveis de condição. Como evitar que escritores esperem para sempre?

## Tema 6: Sistemas de arquivos e virtualização

**Objetivo:** entender como dados persistem no disco com organização e segurança contra falhas, e como máquinas virtuais e containers funcionam.

### 6.1 Sistemas de arquivos

Um **sistema de arquivos** transforma um disco (um array enorme de blocos, tipicamente de 4 KB) em **arquivos** com nomes, organizados em **diretórios**, com permissões.

Estruturas no estilo Unix:

- **Inode:** uma estrutura por arquivo, com metadados (tamanho, dono, permissões, datas) e os **ponteiros para os blocos** de dados. Ponteiros **diretos** para os primeiros blocos e **indiretos** (um bloco cheio de ponteiros, ou de ponteiros para blocos de ponteiros) para arquivos grandes: uma árvore assimétrica, eficiente para os arquivos pequenos, que são a maioria.
- **Diretório:** um arquivo especial que guarda pares (nome, número do inode).
- **Bitmaps** de inodes e blocos livres.
- **Superbloco:** informações gerais do sistema de arquivos.

O nome **não** fica no inode: por isso um arquivo pode ter vários nomes (**links físicos**, `ln`), e `rm` na verdade remove um nome (`unlink`); o arquivo só some quando o último nome é removido e ninguém mais o tem aberto. **Links simbólicos** (`ln -s`) são arquivos que contêm um caminho.

Abrir `/home/ana/notas.txt` exige ler o inode da raiz, o diretório raiz, o inode de `home`, o diretório `home`, e assim por diante: por isso os sistemas guardam em cache diretórios e inodes recentes.

API: `open`, `read`, `write`, `lseek`, `close`, `fsync` (força a gravação no disco), `rename` (atômico: base de atualizações seguras), `stat`, `mkdir`, `readdir`.

### 6.2 Entrada e saída

Dispositivos se comunicam com a CPU por **registradores de dispositivo** (acessados com instruções especiais ou mapeados na memória). Formas de esperar um dispositivo:

- **Espera ativa** (*polling*): a CPU pergunta repetidamente. Desperdício, exceto para dispositivos muito rápidos.
- **Interrupções:** o dispositivo avisa quando terminou; a CPU faz outra coisa enquanto isso.
- **DMA** (*direct memory access*): o dispositivo copia os dados direto para a memória, sem a CPU copiar byte a byte; avisa no fim com uma interrupção.

O sistema esconde os detalhes nos **drivers** (a maior parte do código do Linux), oferecendo interfaces genéricas (dispositivos de bloco, de caractere, de rede).

Discos: **HDDs** têm braço mecânico e prato girando, com acesso aleatório lento (milissegundos) e sequencial rápido; por isso escalonadores de disco reordenavam pedidos. **SSDs** não têm partes móveis, mas apagam em blocos grandes e se desgastam: uma camada interna (FTL) espalha as escritas. A regra geral continua: **E/S sequencial e em lotes é muito mais rápida que aleatória e picada**.

O **cache de páginas** do sistema guarda dados de arquivos na memória livre: ler o mesmo arquivo duas vezes, a segunda é quase instantânea. Escritas vão para o cache e são gravadas depois, o que é rápido, mas significa que um `write` que retornou **não garante** que o dado está no disco: é preciso `fsync`.

### 6.3 Journaling

Uma operação simples como acrescentar um bloco a um arquivo exige atualizar **vários** lugares no disco: o bitmap de blocos, o inode e o bloco de dados. Se a energia cair no meio, o sistema fica **inconsistente** (bloco marcado como usado que ninguém aponta, ou inode apontando para lixo).

Solução antiga: o `fsck`, que varre o disco inteiro depois de uma queda (lento demais para discos grandes).

**Journaling** (registro prévio, *write-ahead logging*): antes de modificar as estruturas no lugar, escreva no **diário** (*journal*) uma descrição das mudanças e um registro de "transação completa". Só depois aplique as mudanças. Depois de uma queda:

- Se a transação está completa no diário, **refaça-a** (é idempotente).
- Se não está completa, **ignore-a**: nada foi aplicado.

Para economizar, muitos sistemas (ext4 no modo padrão) registram no diário só os **metadados**, gravando os dados antes. Alternativas: **copy-on-write** (ZFS, Btrfs: nunca sobrescreve, escreve versões novas e troca o ponteiro da raiz atomicamente, o que também dá *snapshots* baratos) e sistemas de arquivos **estruturados em log**.

O mesmo princípio (registrar antes de aplicar) está em bancos de dados (Bancos de Dados) e em sistemas distribuídos.

### 6.4 Virtualização

Uma **máquina virtual** (VM) executa um sistema operacional completo sobre outro. O **hipervisor** (VMM) dá a cada VM a ilusão de ter o hardware só para ela: CPU, memória e dispositivos virtuais.

- **Tipo 1** (sobre o hardware): KVM (dentro do Linux), Xen, Hyper-V, VMware ESXi. A base da nuvem.
- **Tipo 2** (sobre um sistema operacional): VirtualBox, VMware Workstation.

O hardware moderno ajuda: extensões de virtualização (Intel VT-x, AMD-V) com um modo especial para o hipervisor, e tradução de endereços em dois níveis (as páginas da VM sobre as páginas do hospedeiro). O WSL 2 que você talvez esteja usando é uma VM leve com o kernel Linux sobre o Hyper-V.

### 6.5 Containers

Um **container** isola processos **sem** um sistema operacional separado: todos compartilham o **mesmo kernel** do hospedeiro, mas cada container enxerga a sua própria visão do sistema, graças a dois recursos do kernel Linux:

- **Namespaces:** isolam o que o processo **vê**: PIDs (o container tem o seu processo 1), sistema de arquivos (montagens), rede (interfaces próprias), usuários, nome da máquina.
- **cgroups:** limitam o que o processo **usa**: CPU, memória, E/S.

Mais um **sistema de arquivos em camadas** (a imagem), e você tem o **Docker**.

| | Máquina virtual | Container |
|---|---|---|
| Kernel | Próprio | Compartilhado com o hospedeiro |
| Inicialização | Segundos a minutos | Milissegundos |
| Tamanho | GBs | MBs |
| Isolamento | Forte (hardware virtual) | Mais fraco (uma falha do kernel afeta todos) |
| Sistema convidado | Qualquer (Windows sobre Linux) | Mesmo kernel (Linux sobre Linux) |

Na nuvem, é comum usar os dois: containers dentro de VMs. Para isolamento forte com a leveza de containers, existem micro-VMs (Firecracker, usado no AWS Lambda) e kernels em espaço de usuário (gVisor).

### Atividades de fixação do Tema 6

1. Um inode tem 12 ponteiros diretos, 1 indireto simples, 1 indireto duplo e 1 indireto triplo; blocos de 4 KB e ponteiros de 4 bytes. Qual o maior arquivo possível?
2. Crie um arquivo, um link físico e um simbólico para ele. Apague o original. O que acontece com cada link? Use `ls -li` para ver os números de inode.
3. Descreva os passos de leitura do disco para `cat /home/ana/notas.txt`, supondo nada em cache.
4. Por que o padrão "escrever num arquivo temporário, `fsync` e `rename` por cima do original" é a forma segura de atualizar um arquivo de configuração?
5. Com journaling de metadados, o que pode acontecer com o **conteúdo** de um arquivo numa queda de energia? Por que os dados são gravados antes dos metadados?
6. Rode `docker run --rm -it alpine sh` e, dentro, rode `ps` e `hostname`. Compare com o hospedeiro. Que namespaces você está vendo em ação? Rode um container com `--memory=50m` e tente alocar 100 MB.

## Projeto da etapa

**Escolha um dos caminhos (ou faça os dois):**

**A) Laboratórios do xv6 (MIT 6.1810, públicos):** instale a cadeia de ferramentas RISC-V e o QEMU e faça pelo menos: *Utilities* (programas de usuário com `fork`, `pipe` e `exec`, como um `find` e um `xargs`), *System calls* (adicionar uma chamada `trace`), *Page tables* (imprimir e modificar tabelas de páginas), e *Copy-on-write fork* ou *Multithreading* (threads de usuário e barreiras). Cada laboratório tem testes automáticos (`make grade`).

**B) Shell próprio em C:**

1. Lê comandos, separa argumentos e executa com `fork`/`execvp`/`waitpid`.
2. Comandos internos: `cd`, `exit`, `pwd`, `export`.
3. Redirecionamentos `<`, `>`, `>>` e pipes com qualquer número de estágios (`cat x | grep y | sort | uniq -c`).
4. Execução em segundo plano com `&`, comando `jobs`, e tratamento de `SIGCHLD` para recolher filhos (sem zumbis).
5. Ctrl+C interrompe o comando em primeiro plano, não o shell.
6. Sem vazamentos (Valgrind/ASan limpos) e com testes automatizados que comparam a saída com a do `bash`.

## Para ir além

- *Operating Systems: Three Easy Pieces* (Remzi e Andrea Arpaci-Dusseau, gratuito online): o melhor livro introdutório, com exercícios e simuladores.
- **MIT 6.1810/6.S081**: aulas gravadas, o livro do xv6 e os laboratórios, todos públicos.
- *Computer Systems: A Programmer's Perspective* (CSAPP), capítulos de processos, memória virtual e E/S, e os laboratórios do CMU 15-213 (o *shell lab* e o *malloc lab*).
- *The Linux Programming Interface* (Michael Kerrisk): a referência das chamadas de sistema do Linux.
- *Modern Operating Systems* (Tanenbaum), clássico, e o MINIX, que inspirou o Linux.

## Resumão

- Ponteiro é endereço; `a[i]` é `*(a + i)`. Pilha automática, heap manual com `malloc`/`free`.
- Bugs de memória (estouro, uso depois de liberar, vazamento) são a principal fonte de vulnerabilidades. Use ASan, UBSan, Valgrind e gdb.
- Processo = programa em execução, com PID, estado e recursos. Estados: pronto, executando, bloqueado.
- Chamadas de sistema mudam para o modo kernel. O kernel retoma o controle por chamadas, exceções e interrupções (temporizador).
- `fork` copia, `exec` substitui, `wait` recolhe. Entre `fork` e `exec`, o shell monta pipes e redirecionamentos com `dup2`.
- Escalonamento: retorno (SJF/STCF) versus resposta (Round Robin). MLFQ aprende; Linux usa CFS/EEVDF.
- Threads compartilham memória, cada uma com sua pilha. Troca de contexto custa, principalmente em cache.
- Memória virtual: páginas, tabela multinível, TLB. Falta de página, copy-on-write, `mmap`. Substituição: LRU aproximado pelo relógio.
- Condição de corrida: resultado depende da ordem. Locks (instruções atômicas), variáveis de condição (sempre com `while`).
- Deadlock: quatro condições; quebre a espera circular ordenando os locks.
- Arquivos: inodes, diretórios como tabelas nome → inode, links. `write` não garante disco: `fsync`. Journaling: registre antes, aplique depois.
- VM: kernel próprio sobre hipervisor. Container: mesmo kernel, isolado por namespaces e limitado por cgroups.
