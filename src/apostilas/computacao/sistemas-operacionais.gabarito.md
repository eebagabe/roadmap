# Gabarito: Sistemas Operacionais

Abra só depois de tentar.

## Tema 1

1. Saída: **`1 12 13`**. `p` aponta para a[1]. `*p += 10` faz a[1] = 12. `p[1]` é `*(p + 1)`, ou seja, a[2], que recebe `*a + *p` = a[0] + a[1] = 1 + 12 = 13.
   ```
   a:  [ 1 ][ 12 ][ 13 ]
          ↑
          p
   ```
2. ```c
   #include <stdlib.h>
   #include <string.h>

   /* Devolve uma cópia de s alocada no heap. Quem chama deve liberar com free().
      Devolve NULL se faltar memória. */
   char *duplica(const char *s) {
       size_t n = strlen(s) + 1;          /* + 1 para o '\0' */
       char *c = malloc(n);
       if (c) memcpy(c, s, n);
       return c;
   }
   ```
   A responsabilidade de liberar é de quem chama, e isso precisa estar na documentação: em C, a "propriedade" da memória é um contrato que o compilador não confere.
3. ```c
   typedef struct { int *dados; size_t tam, cap; } Vetor;

   Vetor *vetor_cria(void) { return calloc(1, sizeof(Vetor)); }

   int vetor_adiciona(Vetor *v, int x) {
       if (v->tam == v->cap) {
           size_t nova = v->cap ? 2 * v->cap : 4;
           int *d = realloc(v->dados, nova * sizeof *d);
           if (!d) return -1;              /* v->dados continua válido */
           v->dados = d;
           v->cap = nova;
       }
       v->dados[v->tam++] = x;
       return 0;
   }

   int vetor_obtem(const Vetor *v, size_t i) { return v->dados[i]; }   /* pré: i < tam */

   void vetor_libera(Vetor *v) {
       if (v) { free(v->dados); free(v); }
   }
   ```
   Detalhe importante: atribuir o resultado do `realloc` a uma variável temporária; `v->dados = realloc(v->dados, ...)` perde o ponteiro antigo (vazamento) se o `realloc` falhar.
4. Dois bugs: (1) **estouro de buffer**: "Olá, " já ocupa 6 bytes em UTF-8 (o "á" tem 2), e qualquer nome com mais de 9 bytes estoura os 16 de `buf`; (2) **devolve o endereço de uma variável local**: `buf` deixa de existir quando a função retorna. O ASan acusa `stack-buffer-overflow` no primeiro caso, e o GCC já avisa do segundo (`-Wreturn-local-addr`). Correção: alocar no heap com o tamanho certo (`malloc(strlen("Olá, ") + strlen(nome) + 1)`) ou receber o buffer e o tamanho de quem chama e usar `snprintf`.
5. No gdb: `run`, e no crash, `bt` mostra a linha do acesso; `print p` mostra `(No *) 0x0`. O laço faz `p = p->prox` e depois acessa `p->valor` sem verificar se `p` virou `NULL` no fim da lista. Correção: `while (p != NULL) { ...; p = p->prox; }`.
6. `char *s = "abc"` faz `s` apontar para um **literal de string**, que fica numa região de memória **só de leitura**: escrever nela é comportamento indefinido e, no Linux, dá `Segmentation fault`. `char s[] = "abc"` cria um **array** na pilha **inicializado** com uma cópia do literal: é memória sua e pode ser alterada. (Por isso o certo é declarar `const char *s = "abc"`.)

## Tema 2

1. **8 vezes**. Cada `fork` dobra o número de processos: 1 → 2 → 4 → 8, e cada um dos 8 executa o `printf`. A árvore: o processo original tem 3 filhos (um por `fork`); o primeiro filho tem 2 filhos; o segundo filho de cada um tem 1; e assim por diante (a árvore binomial de ordem 3).
2. O `ls` é dominado por `openat`, `read`, `mmap`, `fstat` e `getdents64` (que lê entradas de diretório). O Python faz centenas de chamadas: ele procura e abre dezenas de módulos da biblioteca padrão ao iniciar (`stat`, `openat` e `read` em vários diretórios do `sys.path`), mapeia bibliotecas compartilhadas e configura o ambiente. Por isso iniciar o interpretador custa dezenas de milissegundos.
3. ```c
   pid_t pid = fork();
   if (pid == 0) {
       printf("filho %d, pai %d\n", getpid(), getppid());
       exit(3);
   }
   int status;
   waitpid(pid, &status, 0);
   if (WIFEXITED(status))
       printf("filho saiu com %d\n", WEXITSTATUS(status));   /* 3 */
   ```
4. ```c
   int fd[2];
   pipe(fd);                                 /* fd[0] lê, fd[1] escreve */
   if (fork() == 0) {                        /* filho 1: ls */
       dup2(fd[1], 1);                       /* saída padrão vira a escrita do pipe */
       close(fd[0]); close(fd[1]);
       execlp("ls", "ls", NULL);
       _exit(127);
   }
   if (fork() == 0) {                        /* filho 2: wc -l */
       dup2(fd[0], 0);                       /* entrada padrão vira a leitura do pipe */
       close(fd[0]); close(fd[1]);
       execlp("wc", "wc", "-l", NULL);
       _exit(127);
   }
   close(fd[0]); close(fd[1]);               /* o pai também fecha */
   wait(NULL); wait(NULL);
   ```
   É preciso fechar as pontas não usadas porque o `wc` só recebe **fim de arquivo** quando **todos** os descritores de escrita do pipe estiverem fechados. Se o pai (ou o próprio `wc`) mantiver `fd[1]` aberto, o `wc` espera para sempre por mais dados.
5. ```c
   #include <signal.h>
   #include <stdio.h>
   #include <unistd.h>

   static volatile sig_atomic_t vezes = 0;
   static void trata(int sig) { (void)sig; vezes++; }

   int main(void) {
       struct sigaction sa = {0};
       sa.sa_handler = trata;
       sigaction(SIGINT, &sa, NULL);
       while (vezes < 3) {
           pause();                                  /* dorme até chegar um sinal */
           if (vezes < 3) printf("não vou parar!\n");
       }
       return 0;
   }
   ```
   O tratador só incrementa uma variável `volatile sig_atomic_t`: dentro de tratadores de sinal só é seguro chamar funções *async-signal-safe*, e `printf` não é uma delas.
6. ```c
   if (fork() == 0) exit(0);     /* filho termina na hora */
   sleep(60);                    /* pai não chama wait: filho fica zumbi */
   ```
   Durante o `sleep`, `ps -o pid,stat,cmd` mostra o filho com STAT `Z` (`<defunct>`). Não dá para "matar" um zumbi (ele já morreu); ele some quando o pai chama `wait`, ou quando o **pai** termina e o init adota e recolhe o filho.

## Tema 3

1. **FIFO (A, B, C):** términos 10, 15, 17: retorno médio (10 + 15 + 17)/3 ≈ **14**; resposta média (0 + 10 + 15)/3 ≈ **8,3**. **SJF (C, B, A):** términos 2, 7, 17: retorno médio 26/3 ≈ **8,7**; resposta média (0 + 2 + 7)/3 = **3**. **Round Robin (quantum 1):** a ordem é A, B, C, A, B, C (C termina em 6), A, B, A, B, A, B (B termina em 12), e A sozinha até 17. Retorno médio (17 + 12 + 6)/3 ≈ **11,7**; resposta média (0 + 1 + 2)/3 = **1**. O RR tem a melhor resposta e o SJF o melhor retorno.
2. Uma tarefa de 100 s chega antes de dez tarefas de 1 s: com FIFO, todas as curtas esperam 100 s, e o retorno médio fica perto de 100. O SJF executa as curtas primeiro (retorno de 1 a 10 s) e a longa por último; o retorno médio despenca, e a longa só piora um pouco.
3. Em vez de contar se o processo usou a **fatia inteira de uma vez**, contabilize o **tempo total de CPU usado em cada nível**: quando o processo gastar a sua cota do nível (somando várias rodadas), ele desce, não importa quantas vezes tenha cedido a CPU antes. É assim que a MLFQ do livro OSTEP resolve.
4. ```c
   typedef struct { const long *a; size_t ini, fim; long soma; } Fatia;
   void *soma_fatia(void *arg) {
       Fatia *f = arg;
       long s = 0;
       for (size_t i = f->ini; i < f->fim; i++) s += f->a[i];
       f->soma = s;                 /* cada thread escreve só no seu campo */
       return NULL;
   }
   ```
   Com 4 núcleos, o ganho fica tipicamente entre **2 e 4 vezes**: a soma é limitada pela **banda de memória** (cada elemento é lido uma vez e quase não há conta), e a banda é compartilhada entre os núcleos. Se as somas parciais ficassem num array de `long` vizinhos, haveria **falso compartilhamento** (mesma linha de cache); guardar numa variável local e só escrever no fim evita isso.
5. Com dois processos alternando por dois pipes no mesmo núcleo, cada volta faz duas trocas de contexto mais duas chamadas `write` e duas `read`. Dividindo o tempo total por 2 milhões, chega-se a **1 a 5 microssegundos** por troca (incluindo as chamadas de sistema), dependendo da máquina e das mitigações de segurança do kernel.
6. Cada thread tem uma pilha (tipicamente 8 MB de espaço virtual reservado, parte disso usada de fato), uma estrutura no kernel e custo de escalonamento; com 100 mil threads, memória e trocas de contexto dominam, e o desempenho cai muito antes da CPU saturar. A alternativa é **E/S orientada a eventos**: poucas threads (uma por núcleo) usando `epoll`/`kqueue`/`io_uring` para monitorar milhares de conexões e atender só as que têm dados prontos. É o modelo do nginx, do Node.js, do Redis e do `asyncio`. (Linguagens como Go e Java com *virtual threads* escondem isso atrás de "threads leves" no espaço de usuário.)

## Tema 4

1. Deslocamento: 4 KB = 2¹² → **12 bits**; VPN: **20 bits**. 0x00403A7C: VPN = 0x00403, deslocamento = 0xA7C. Com a moldura 0x1F2, o endereço físico é **0x1F2A7C** (moldura seguida do deslocamento).
2. Com 48 bits e páginas de 4 KB, uma tabela plana teria 2³⁶ entradas de 8 bytes = **512 GB por processo**, mesmo que o processo use 1 MB. A tabela multinível é uma **árvore**: o primeiro nível tem 512 entradas, e só são criadas as subtabelas das regiões realmente usadas. Um processo pequeno precisa de poucas páginas de tabela. O custo é que cada tradução percorre 4 níveis (por isso a TLB é essencial).
3. Faltas com 3 molduras: **FIFO 10**, **LRU 9**, **ótima 7**. A ótima, nos momentos de despejo, tira a página cujo próximo uso está mais distante (por exemplo, ao chegar o 2 com {7, 0, 1}, despeja o 7, que nunca mais aparece).
4. FIFO com **3 molduras: 9 faltas**; com **4 molduras: 10 faltas**. Mais memória, mais faltas: a anomalia de Belady. LRU e a ótima não sofrem dela (são "algoritmos de pilha": o conteúdo com k molduras está sempre contido no conteúdo com k + 1).
5. Logo após o `malloc` de 1 GB, o RSS quase não muda: o `malloc` (via `mmap`) só reserva **espaço de endereçamento virtual**; as páginas físicas não existem ainda. Escrevendo um byte a cada 4 KB, cada primeira escrita numa página gera uma falta de página, e o kernel aloca uma moldura zerada: o RSS sobe para ~1 GB. (O Linux também permite reservar mais memória virtual do que existe: é o *overcommit*.)
6. Com **copy-on-write**, o `fork` só copia a **tabela de páginas** (e marca as páginas como só leitura nos dois processos), não os 10 GB de dados. As páginas só são copiadas quando alguém escreve nelas, uma de cada vez. Se o filho fizer `exec` logo em seguida (o caso do shell), quase nada é copiado. Ainda assim, copiar as tabelas de 10 GB custa alguns milissegundos, por isso existem `vfork` e `posix_spawn`.

## Tema 5

1. Com mais threads, mais incrementos se perdem (e o resultado varia a cada execução). O ThreadSanitizer reporta `WARNING: ThreadSanitizer: data race`, com as duas pilhas: a leitura e a escrita concorrentes em `contador`, e a linha exata.
2. As três funcionam. A **mutex** é a mais lenta (cada incremento faz lock e unlock, e as threads disputam o lock). A **atômica** (`atomic_fetch_add`) é mais rápida, mas ainda disputa a **mesma linha de cache** entre os núcleos. As **somas locais** são de longe as mais rápidas: cada thread soma numa variável sua (num registrador) e só toca no dado compartilhado uma vez no fim. Lição: a melhor sincronização é a que não é necessária.
3. Com `if`: o buffer está vazio e os consumidores C1 e C2 dormem. O produtor coloca um item e sinaliza; C1 acorda, mas, antes de readquirir o lock, C2 (que tinha acabado de chegar e não estava dormindo) pega o lock, vê qtd = 1 e consome. Quando C1 finalmente roda, ele **não verifica de novo** (era um `if`) e consome de um buffer vazio: lê lixo e deixa `qtd` negativo. Com `while`, C1 rechecaria, veria qtd = 0 e voltaria a dormir.
4. `transfere(a, b)` trava a e depois b; `transfere(b, a)` trava b e depois a. Se as duas rodarem juntas, cada uma pega o primeiro lock e espera o segundo para sempre. Correção: **ordem global**, travar sempre primeiro a conta de menor identificador:
   ```c
   void transfere(Conta *a, Conta *b, long valor) {
       Conta *primeiro = a->id < b->id ? a : b;
       Conta *segundo  = a->id < b->id ? b : a;
       pthread_mutex_lock(&primeiro->m);
       pthread_mutex_lock(&segundo->m);
       a->saldo -= valor;
       b->saldo += valor;
       pthread_mutex_unlock(&segundo->m);
       pthread_mutex_unlock(&primeiro->m);
   }
   ```
5. Solução clássica: numere os garfos de 0 a 4 e faça **cada filósofo pegar primeiro o garfo de menor número**. O último filósofo (entre os garfos 4 e 0) pega o 0 primeiro, ao contrário dos outros, e isso quebra o ciclo. Alternativas: um "garçom" (semáforo com valor 4) que só deixa 4 filósofos tentarem comer ao mesmo tempo; ou pegar os dois garfos de uma vez (com um lock global para a decisão).
6. Estado: `leitores` ativos, `escritor` ativo (0 ou 1), `escritores_esperando`. Leitor entra quando não há escritor ativo **nem escritores esperando** (preferência para escritores, que evita inanição deles); escritor entra quando não há leitores nem escritor ativo. Ao sair, o último leitor sinaliza os escritores; o escritor, ao sair, faz `broadcast` para os leitores e `signal` para os escritores. Com preferência total aos escritores, os leitores é que podem sofrer inanição; políticas justas alternam lotes (o `pthread_rwlock` do sistema já implementa isso).

## Tema 6

1. Cada bloco de ponteiros guarda 4096/4 = 1.024 ponteiros. Blocos endereçáveis: 12 + 1.024 + 1.024² + 1.024³ ≈ 1,07 × 10⁹ blocos. Vezes 4 KB: **≈ 4 TB** (4 TiB + 4 GiB + 4 MiB + 48 KiB). Os arquivos pequenos (até 48 KB) não precisam de nenhum bloco indireto.
2. ```bash
   echo oi > original
   ln original fisico
   ln -s original simbolico
   ls -li          # original e fisico têm o MESMO número de inode (contagem de links = 2)
   rm original
   cat fisico      # "oi": o inode continua existindo, agora com 1 nome
   cat simbolico   # erro: o caminho "original" não existe mais (link quebrado)
   ```
3. Ler o inode da raiz (número fixo, 2 no ext4) → ler os blocos do diretório `/` e achar a entrada "home" → ler o inode de `home` → ler o diretório `home` e achar "ana" → inode de `ana` → diretório `ana`, achar "notas.txt" → inode de `notas.txt` (conferindo permissões a cada passo) → ler os blocos de dados apontados pelo inode. Pelo menos 8 leituras de disco; com cache, quase nenhuma.
4. Escrever direto no original e cair a energia no meio deixa o arquivo **pela metade**. Com o padrão: escreva o conteúdo novo num arquivo temporário **no mesmo sistema de arquivos**, chame `fsync` (garante que os dados estão no disco), e então `rename(temporario, original)`. O `rename` é **atômico**: depois de uma queda, o nome aponta para a versão velha inteira ou para a nova inteira, nunca para uma mistura. (Para total segurança, faça também `fsync` do diretório, para que o próprio `rename` seja durável.)
5. Os metadados ficam consistentes (o journal garante), mas o **conteúdo** pode ser antigo ou parcial (as últimas escritas não chegaram ao disco). Os dados são gravados **antes** de registrar os metadados no journal para que um inode nunca aponte para um bloco com **lixo** (dados de outro arquivo que ocupava aquele bloco antes): isso seria inconsistência e também vazamento de informação.
6. Dentro do container, `ps` mostra só os processos dele (o `sh` aparece como PID 1): **namespace de PIDs**. `hostname` mostra um identificador aleatório: **namespace UTS**. O sistema de arquivos é o da imagem Alpine (**namespace de montagens**), e a rede tem interfaces próprias (**namespace de rede**). Com `--memory=50m`, o **cgroup** de memória limita o container: ao tentar alocar 100 MB, o processo é morto pelo OOM killer do cgroup (código de saída 137), sem afetar o hospedeiro.

## Projeto da etapa

Pontos de revisão:

- **xv6, *trace*:** o número da chamada vem em `a7` (`p->trapframe->a7`); guarde a máscara no `struct proc` e copie-a no `fork`. Não esqueça de registrar a chamada em `user/usys.pl`, `user/user.h`, `kernel/syscall.h` e `kernel/syscall.c`.
- **xv6, copy-on-write:** conte as referências de cada página física (um array de contadores indexado pelo número da moldura) para só liberar quando a última referência sumir; marque as páginas com um bit reservado de "COW" na entrada da tabela.
- **Shell:** o shell precisa ignorar `SIGINT` (o terminal envia para o grupo de processos em primeiro plano), mas os filhos devem restaurar o comportamento padrão **antes** do `exec`. Coloque cada pipeline num grupo de processos próprio (`setpgid`) e use `tcsetpgrp` para dar o terminal ao grupo em primeiro plano, se quiser fazer controle de *jobs* completo.
- **Pipes com N estágios:** crie todos os pipes antes, faça os `fork`s em laço, e em cada filho conecte a leitura do pipe anterior e a escrita do próximo; **todos** os processos (inclusive o shell) fecham todos os descritores de pipe que não usam.
- **Testes:** um script que roda cada comando no seu shell e no `bash -c` e compara as saídas (`diff`) cobre a maior parte dos casos.
