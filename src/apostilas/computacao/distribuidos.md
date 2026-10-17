# Concorrência, Paralelismo e Sistemas Distribuídos: Apostila Prática

Roadmap Ciência da Computação · Semanas 81 a 86

## Comece por aqui

Os processadores pararam de ficar muito mais rápidos por volta de 2005: desde então, o ganho vem de **mais núcleos**. E os serviços que usamos (busca, bancos, redes sociais, pagamentos) rodam em **milhares de máquinas**, que falham o tempo todo. Esta etapa junta três assuntos ligados: **concorrência** (organizar várias atividades que se intercalam), **paralelismo** (usar vários núcleos para ir mais rápido) e **sistemas distribuídos** (várias máquinas que só se comunicam por mensagens e falham de forma independente). É o conteúdo de Concurrent Programming em Oxford e do famoso curso 6.5840 (antigo 6.824) do MIT, cujos laboratórios fazem você implementar o algoritmo de consenso Raft.

### Equivalências

| Universidade | Disciplina |
|---|---|
| ITA | CSC-64 Programação Paralela; CSC-27 Processamento Distribuído |
| MIT | 6.172 Performance Engineering; 6.5840 (antiga 6.824) Distributed Systems |
| Harvard | CS 2620 Distributed Computing |
| Oxford | Concurrent Programming (2º ano); Concurrency (3º ano) |

### Como esta apostila funciona

1. Use **Go** para os temas de concorrência e de sistemas distribuídos (é a linguagem dos laboratórios do MIT 6.5840, com goroutines e canais nativos) e **C** com OpenMP para o tema de paralelismo. Java ou Rust também servem.
2. Concorrência não se depura com prints: use o **detector de corridas** (`go run -race`, `-fsanitize=thread` em C) e teste centenas de vezes.
3. Leia os artigos clássicos citados (MapReduce, Raft, Dynamo, Spanner): são curtos e legíveis.
4. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** um bug que aparece "às vezes"? É quase certo que é concorrência. Rode o teste em laço 1.000 vezes (`go test -count=1000 -race`), registre logs com o relógio e o identificador de cada nó, e procure a intercalação que leva ao erro.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 81 | Tema 1: Modelos de concorrência |
| 82 | Tema 2: Sincronização |
| 83 | Tema 3: Paralelismo e desempenho |
| 84 | Tema 4: Fundamentos de sistemas distribuídos |
| 85 | Tema 5: Replicação e consenso |
| 86 | Tema 6: Consistência e estudos de caso + projeto |

## Tema 1: Modelos de concorrência

**Objetivo:** distinguir concorrência de paralelismo e conhecer os dois grandes modelos de comunicação.

### 1.1 Threads e memória compartilhada

**Concorrência** é estruturar um programa como várias atividades que **progridem de forma intercalada** (mesmo num núcleo só): um servidor atendendo vários clientes. **Paralelismo** é **executar ao mesmo tempo** em vários núcleos para terminar mais rápido. Concorrência é sobre **organização**; paralelismo, sobre **desempenho** (frase de Rob Pike).

No modelo de **memória compartilhada**, threads se comunicam lendo e escrevendo as mesmas variáveis, protegidas por locks (Sistemas Operacionais, Tema 5). É o modelo do C, do Java e do C#.

Em Go, uma **goroutine** é uma thread leve gerenciada pela linguagem (milhares custam pouco):

```go
var wg sync.WaitGroup
var mu sync.Mutex
contador := 0
for i := 0; i < 100; i++ {
    wg.Add(1)
    go func() {
        defer wg.Done()
        mu.Lock()
        contador++
        mu.Unlock()
    }()
}
wg.Wait()
fmt.Println(contador)   // 100
```

### 1.2 Troca de mensagens

No outro modelo, as atividades **não compartilham memória**: comunicam-se **enviando mensagens**. Duas grandes escolas:

- **CSP** (*Communicating Sequential Processes*, Tony Hoare, 1978): processos se comunicam por **canais**. É a base do Go e de partes do Clojure e do Rust.
- **Atores** (Carl Hewitt, 1973): cada ator tem uma **caixa de correio**, processa uma mensagem por vez, pode mandar mensagens, criar atores e mudar o próprio estado. Erlang e Elixir (usados no WhatsApp e em telecomunicações) e o Akka.

Lema do Go: **"não comunique compartilhando memória; compartilhe memória comunicando"**.

```go
resultados := make(chan int)
for i := 1; i <= 3; i++ {
    go func(n int) { resultados <- n * n }(i)
}
soma := 0
for i := 0; i < 3; i++ {
    soma += <-resultados       // recebe; bloqueia até haver valor
}
fmt.Println(soma)   // 14
```

Troca de mensagens também é o único modelo possível **entre máquinas**: sistemas distribuídos são, por natureza, de troca de mensagens.

### 1.3 Condições de corrida

Uma **corrida de dados** (*data race*) acontece quando duas threads acessam a mesma posição de memória ao mesmo tempo, pelo menos uma escreve, e não há sincronização entre elas. Em C, C++ e Go, uma corrida de dados torna o programa **indefinido** (não é só "o valor pode sair errado": o compilador pode fazer otimizações que quebram o programa de formas estranhas).

Uma **condição de corrida** é mais geral: o resultado depende da ordem das operações, mesmo sem corrida de dados. Exemplo clássico, **verificar e depois agir** (*check-then-act*):

```go
mu.Lock(); existe := mapa[k]; mu.Unlock()
if !existe {
    mu.Lock(); mapa[k] = novo(); mu.Unlock()   // outra goroutine pode ter inserido no meio!
}
```

Cada acesso está protegido, mas a **combinação** não é atômica. A correção é fazer as duas coisas sob o mesmo lock.

### 1.4 Modelos de memória

Você esperaria que, se uma thread escreve `x = 1; pronto = true` e outra vê `pronto == true`, ela também veja `x == 1`. **Não é garantido** sem sincronização. Compiladores reordenam instruções e processadores reordenam acessos à memória (cada núcleo tem buffers e caches próprios), desde que o resultado seja o mesmo **para uma única thread**.

O **modelo de memória** da linguagem define o que uma thread pode ver das escritas de outra. A garantia básica: **programas sem corridas de dados se comportam como se fossem sequencialmente consistentes**, isto é, como alguma intercalação das operações das threads. A sincronização (locks, canais, variáveis atômicas) cria relações de **acontece-antes** (*happens-before*): tudo que a thread A fez antes de liberar um lock é visível para a thread B depois que ela adquire o mesmo lock.

> **Cuidado! Cai na entrevista:** `volatile` em C **não** sincroniza threads (serve para registradores de hardware). Use `_Atomic`/`stdatomic.h`, locks, ou os atômicos da linguagem. Em Java, `volatile` tem outro significado e sincroniza; não confunda.

### Atividades de fixação do Tema 1

1. Dê um exemplo de programa concorrente que não é paralelo e de um paralelo que não precisa de concorrência.
2. Rode em Go o contador sem mutex com `go run -race` e leia o relatório. Depois corrija de duas formas: com `sync.Mutex` e com `sync/atomic`.
3. Reescreva o contador usando só um canal: uma goroutine "dona" do contador recebe pedidos de incremento.
4. Encontre a condição de corrida (sem corrida de dados) num código que faz `if saldo >= valor { saldo -= valor }` com cada leitura e escrita protegida separadamente.
5. Pesquise o padrão "double-checked locking" e explique por que a versão ingênua é quebrada em C++ e Java antigos.

## Tema 2: Sincronização

**Objetivo:** dominar as primitivas de sincronização e os problemas clássicos de concorrência.

### 2.1 Locks

Revisão e complementos ao que você viu em Sistemas Operacionais:

- **Mutex:** exclusão mútua. Use `defer mu.Unlock()` (Go) ou `try/finally` para nunca esquecer de liberar.
- **Lock de leitura e escrita** (`sync.RWMutex`): vários leitores ou um escritor. Vale quando leituras são muito mais frequentes.
- **Granularidade:** um lock global é simples e lento; locks por objeto (ou por balde de tabela hash, como o `ConcurrentHashMap` do Java) aumentam o paralelismo.
- **Estruturas sem lock** (*lock-free*): usam compare-and-swap em laço. Difíceis de acertar (cuidado com o problema ABA); prefira as da biblioteca.

### 2.2 Semáforos

Um **semáforo** é um contador com duas operações: **P/wait** (decrementa; se ficaria negativo, espera) e **V/post** (incrementa, acordando quem espera). Usos:

- **Limitar** o número de atividades simultâneas (no máximo 10 conexões ao banco). Em Go, um canal com buffer faz o papel: `sem := make(chan struct{}, 10)`; `sem <- struct{}{}` para entrar, `<-sem` para sair.
- **Sinalizar** eventos entre threads (semáforo iniciando em 0).

Problemas clássicos para treinar: produtor e consumidor (buffer limitado), leitores e escritores, jantar dos filósofos, o barbeiro dorminhoco.

### 2.3 Monitores

Um **monitor** é um objeto cujos métodos executam em exclusão mútua, com **variáveis de condição** para esperar dentro dele (Sistemas Operacionais, Tema 5). Em Java, `synchronized` + `wait`/`notifyAll` transformam qualquer objeto num monitor; em C/Go, combina-se mutex com variável de condição (`sync.Cond`).

Monitores organizam a sincronização **junto com os dados**, em vez de espalhar locks pelo código: a classe garante as suas próprias invariantes, como num TAD.

### 2.4 Canais estilo CSP

Em Go, um **canal** é uma fila tipada e segura entre goroutines:

- **Sem buffer** (`make(chan T)`): enviar bloqueia até alguém receber (um encontro, *rendezvous*). Sincroniza **e** transfere.
- **Com buffer** (`make(chan T, n)`): enviar só bloqueia se o buffer estiver cheio.
- `close(ch)` avisa que não virão mais valores; `for v := range ch` lê até o fechamento.
- `select` espera em vários canais ao mesmo tempo, inclusive com tempo limite.

Padrões de concorrência com canais:

```go
// pool de trabalhadores (worker pool)
tarefas := make(chan int)
resultados := make(chan int)
var wg sync.WaitGroup
for w := 0; w < 4; w++ {
    wg.Add(1)
    go func() {
        defer wg.Done()
        for t := range tarefas {
            resultados <- processa(t)
        }
    }()
}
go func() {
    for i := 0; i < 100; i++ { tarefas <- i }
    close(tarefas)
}()
go func() { wg.Wait(); close(resultados) }()
for r := range resultados { fmt.Println(r) }
```

```go
// tempo limite com select
select {
case r := <-resposta:
    usa(r)
case <-time.After(2 * time.Second):
    fmt.Println("demorou demais")
}
```

Outros padrões: **pipeline** (estágios ligados por canais), **fan-out/fan-in** (vários trabalhadores, um coletor), **cancelamento** com `context.Context`.

### 2.5 Deadlock e livelock

Deadlock (as quatro condições de Coffman, Sistemas Operacionais) também acontece com canais: duas goroutines esperando receber uma da outra, ou enviar num canal sem buffer que ninguém lê. O Go detecta o caso em que **todas** as goroutines estão bloqueadas (`fatal error: all goroutines are asleep - deadlock!`), mas não os deadlocks parciais.

**Livelock:** as threads continuam ativas, mas não progridem (como duas pessoas num corredor que se desviam para o mesmo lado repetidamente). Ocorre com estratégias de "tente, se falhar, desfaça e tente de novo" sem aleatoriedade. Solução: **espera aleatória** (*randomized backoff*), a mesma ideia que o Ethernet e o Raft usam.

**Vazamento de goroutines:** uma goroutine bloqueada para sempre num canal que ninguém vai usar nunca termina e ocupa memória. Sempre pense em **como cada goroutine termina**.

### Atividades de fixação do Tema 2

1. Implemente um limitador de concorrência em Go que roda 100 tarefas com no máximo 5 ao mesmo tempo, usando um canal como semáforo.
2. Implemente produtor e consumidor com canal com buffer e com `sync.Cond`. Qual fica mais simples?
3. Resolva o barbeiro dorminhoco (uma barbearia com N cadeiras de espera) com canais.
4. Escreva um pipeline de três estágios (gera números, eleva ao quadrado, soma) com canais e cancelamento por `context`.
5. Este código entra em deadlock. Por quê? Corrija.
   ```go
   ch := make(chan int)
   ch <- 1
   fmt.Println(<-ch)
   ```
6. Mostre um vazamento de goroutine num código que dispara 3 buscas em paralelo e usa só a primeira resposta. Corrija com canal com buffer ou cancelamento.

## Tema 3: Paralelismo e desempenho

**Objetivo:** medir e prever ganhos de paralelismo e escrever código paralelo que aproveita o hardware.

### 3.1 Lei de Amdahl

Se uma fração **p** do programa pode ser paralelizada e o resto (1 − p) é sequencial, o ganho máximo com **n** núcleos é:

**ganho(n) = 1 / ((1 − p) + p/n)**

Quando n → ∞, o ganho tende a **1/(1 − p)**. Com 95% paralelizável, o máximo é 20 vezes, **não importa quantos núcleos**. A parte sequencial domina.

| p | 4 núcleos | 16 núcleos | 64 núcleos | ∞ |
|---|---|---|---|---|
| 50% | 1,6 | 1,9 | 2,0 | 2 |
| 90% | 3,1 | 6,4 | 8,8 | 10 |
| 99% | 3,9 | 13,9 | 39,3 | 100 |

**Lei de Gustafson:** visão otimista complementar. Na prática, com mais núcleos resolvemos **problemas maiores** no mesmo tempo, e a parte paralela cresce com o problema: o ganho em "trabalho por tempo" escala quase linearmente.

**Trabalho e profundidade** (*work and span*): T₁ é o trabalho total (tempo com 1 núcleo); T∞ é o caminho crítico (tempo com infinitos núcleos). O paralelismo disponível é **T₁/T∞**. Somar n números em árvore: T₁ = n, T∞ = log n.

### 3.2 Fork-join

Muitos algoritmos de dividir e conquistar são naturalmente paralelos: as duas metades do merge sort são independentes. No modelo **fork-join**, uma tarefa se divide (*fork*), as partes rodam em paralelo e a tarefa espera e combina os resultados (*join*).

```go
func somaParalela(a []int) int {
    if len(a) < 10_000 {                 // pedaços pequenos: sequencial (granularidade!)
        s := 0
        for _, x := range a { s += x }
        return s
    }
    meio := len(a) / 2
    var esq int
    var wg sync.WaitGroup
    wg.Add(1)
    go func() { defer wg.Done(); esq = somaParalela(a[:meio]) }()
    dir := somaParalela(a[meio:])
    wg.Wait()
    return esq + dir
}
```

Runtimes como o do Go, o ForkJoinPool do Java, o Cilk e o TBB usam **roubo de trabalho** (*work stealing*): cada núcleo tem uma fila de tarefas; quando a sua esvazia, ele rouba do fim da fila de outro. Isso balanceia a carga automaticamente.

> **Cuidado! Cai na prática:** criar tarefas paralelas tem custo. Se cada tarefa faz pouco trabalho, a sobrecarga supera o ganho. Sempre tenha um **limite** abaixo do qual executa sequencialmente.

### 3.3 Vetorização

Processadores têm instruções **SIMD** (*single instruction, multiple data*: SSE, AVX no x86; NEON e SVE no ARM; a extensão V no RISC-V) que operam sobre **vários números de uma vez** num único registrador largo (AVX-512: 16 floats por instrução).

Compiladores **vetorizam** laços simples automaticamente com `-O3` (confira com `-fopt-info-vec` no GCC). Ajudam: laços com contagem conhecida, sem dependência entre iterações, dados contíguos, sem desvios no corpo, e ponteiros que comprovadamente não se sobrepõem (`restrict` em C).

```c
void soma_vetores(float *restrict c, const float *restrict a, const float *restrict b, int n) {
    for (int i = 0; i < n; i++)
        c[i] = a[i] + b[i];          // vetorizável: iterações independentes
}
```

GPUs levam a ideia ao extremo: milhares de núcleos simples executando o mesmo código sobre dados diferentes. São a base do treinamento de redes neurais (Aprendizado de Máquina).

### 3.4 Cache e falso compartilhamento

Em paralelo, a hierarquia de memória (Arquitetura) fica ainda mais importante. Cada núcleo tem suas caches; o protocolo de **coerência** (MESI) garante que todos vejam valores consistentes, transferindo linhas de cache entre núcleos quando alguém escreve.

**Falso compartilhamento:** duas threads escrevem em variáveis **diferentes** que estão na **mesma linha de cache** (64 bytes). Cada escrita invalida a linha no outro núcleo, e ela fica "pingando" entre eles. O programa fica mais lento com mais threads, sem nenhuma corrida de dados.

```c
long somas[8];                       // ruim: as 8 somas cabem numa linha de cache
// melhor: alinhar cada uma numa linha própria
struct { long valor; char pad[56]; } somas_alinhadas[8];
```

Melhor ainda: acumular numa **variável local** e escrever o resultado compartilhado só no fim.

Outros limites do paralelismo: a **banda de memória** (somar um array grande é limitado pela velocidade de ler a memória, não pela CPU), a **contenção** em locks e a **sincronização** frequente.

### 3.5 OpenMP

O **OpenMP** paraleliza código C, C++ e Fortran com diretivas:

```c
#include <omp.h>

double soma = 0.0;
#pragma omp parallel for reduction(+:soma)
for (long i = 0; i < n; i++)
    soma += a[i] * b[i];             // produto escalar paralelo
```

Compile com `-fopenmp`. O `reduction` dá a cada thread uma soma privada e combina no fim (evitando corrida e falso compartilhamento). Outras diretivas: `schedule(dynamic)` para iterações de custo desigual, `parallel sections`, `task` para fork-join, `critical` e `atomic`.

É o caminho mais curto para paralelizar código científico existente. Para clusters de muitas máquinas, o padrão é o **MPI** (troca de mensagens explícita); para GPUs, **CUDA** ou OpenCL.

### Atividades de fixação do Tema 3

1. Um programa leva 100 s, dos quais 80 s são paralelizáveis. Qual o tempo com 4, 8 e 1.000 núcleos? Qual o ganho máximo?
2. Calcule trabalho, profundidade e paralelismo do merge sort paralelo em que só as chamadas recursivas são paralelas (o merge é sequencial). Onde está o gargalo?
3. Implemente a soma paralela em Go (fork-join) e varie o limite de granularidade (10, 1.000, 100.000). Faça um gráfico do tempo.
4. Meça o falso compartilhamento: 4 threads incrementando, cada uma, o seu contador num array de `long` contíguos, e depois com os contadores separados por 64 bytes.
5. Paralelize com OpenMP a multiplicação de matrizes (laço i-k-j da etapa de Arquitetura) e meça o ganho com 1, 2, 4 e 8 threads.
6. Verifique com `-fopt-info-vec` se o GCC vetoriza `for (i = 1; i < n; i++) a[i] = a[i-1] + b[i];`. Por que não?

## Tema 4: Fundamentos de sistemas distribuídos

**Objetivo:** entender por que sistemas distribuídos são difíceis e as ferramentas básicas para construí-los.

### 4.1 Falhas

Um **sistema distribuído** é aquele em que a falha de um computador que você nem sabia que existia pode tornar o seu inutilizável (definição de Leslie Lamport). Por que distribuir, então? **Escala** (uma máquina não aguenta), **tolerância a falhas** (se uma cai, outras continuam), **latência** (servidores perto dos usuários) e **isolamento**.

O que torna tudo difícil:

- **Falhas parciais:** algumas partes falham, outras não, e cada nó tem uma visão incompleta.
- **A rede não é confiável:** mensagens se perdem, atrasam, chegam duplicadas ou fora de ordem.
- **Não há relógio global:** relógios de máquinas diferentes divergem.
- **Não dá para distinguir** um nó **lento** de um nó **morto**, nem saber se uma mensagem sem resposta foi processada ou não.

Modelos de falha, do mais simples ao mais difícil:

| Modelo | O nó... |
|---|---|
| Parada (*crash-stop*) | Para e nunca volta |
| Parada e recuperação | Para e volta depois (com o que estava gravado em disco) |
| Omissão | Às vezes não envia ou não recebe mensagens |
| Bizantina | Faz qualquer coisa, até mentir e conspirar (bugs graves, ataques) |

A maior parte dos sistemas de data center supõe falhas por parada e recuperação; blockchains e sistemas aeroespaciais tratam falhas bizantinas.

**As falácias da computação distribuída** (Peter Deutsch e outros, da Sun): a rede é confiável; a latência é zero; a banda é infinita; a rede é segura; a topologia não muda; há um único administrador; o custo de transporte é zero; a rede é homogênea. Todas falsas, e cada uma já derrubou sistemas.

### 4.2 Relógios lógicos

Para ordenar eventos sem um relógio global confiável, Lamport (1978) definiu a relação **acontece-antes** (→): a → b se (1) a e b são no mesmo processo e a vem antes; ou (2) a é o envio de uma mensagem e b o recebimento dela; ou (3) por transitividade. Se nem a → b nem b → a, os eventos são **concorrentes**.

**Relógio de Lamport:** cada processo tem um contador C.

- Antes de cada evento local, C ← C + 1.
- Ao enviar, anexa C à mensagem.
- Ao receber uma mensagem com marca t, C ← max(C, t) + 1.

Garante: se a → b, então C(a) < C(b). O contrário **não** vale: C(a) < C(b) não indica que a aconteceu antes de b. Mesmo assim, desempatando pelo identificador do processo, obtém-se uma **ordem total** consistente com a causalidade.

**Relógios vetoriais:** cada processo guarda um vetor com um contador **por processo**. Agora vale a ida e a volta: a → b **se e somente se** V(a) < V(b) (componente a componente). Eventos concorrentes têm vetores incomparáveis. Usados para detectar conflitos de escrita em réplicas (como no Dynamo).

**Relógios físicos:** sincronizados por **NTP** (erro de milissegundos na internet). O **Spanner** do Google usa relógios atômicos e GPS com incerteza explícita (TrueTime) para ordenar transações globalmente (Tema 6).

### 4.3 RPC

A **chamada de procedimento remoto** (RPC) faz uma chamada a outra máquina parecer uma chamada de função local: um *stub* no cliente **serializa** os argumentos (Protocol Buffers, JSON, Thrift), envia, o servidor executa e devolve o resultado. Exemplos: **gRPC**, APIs REST/JSON, o `net/rpc` do Go.

A ilusão é **imperfeita**: a chamada pode falhar de jeitos que uma função local não falha. Se não veio resposta, o pedido pode ter: (a) se perdido antes de chegar; (b) sido executado e a resposta se perdido; (c) ainda estar sendo executado. O cliente **não sabe** qual. Semânticas:

- **No máximo uma vez:** não reenvia; pode não executar.
- **Pelo menos uma vez:** reenvia até ter resposta; pode executar várias vezes. Seguro só para operações **idempotentes**.
- **Exatamente uma vez** (efeito): reenvia, e o servidor **detecta duplicatas** por um identificador único de requisição, devolvendo a resposta guardada. É o que os laboratórios do 6.5840 exigem do armazenamento chave-valor.

> **Cuidado! Cai na entrevista:** "transferir R$ 100" reenviado depois de um tempo limite pode transferir duas vezes. Por isso APIs de pagamento aceitam uma **chave de idempotência** em cada requisição.

Boas práticas: tempos limite em toda chamada, novas tentativas com **espera exponencial e aleatoriedade** (*exponential backoff with jitter*), limite de tentativas, e disjuntores (*circuit breakers*) para não sobrecarregar um serviço que já está com problemas.

### 4.4 MapReduce

**MapReduce** (Google, 2004) é um modelo para processar dados enormes em milhares de máquinas, escondendo a distribuição e as falhas. O programador escreve duas funções:

- **map(chave, valor) → lista de (chave', valor')**
- **reduce(chave', lista de valores) → resultado**

Contar palavras em bilhões de páginas:

```
map(documento, texto):   para cada palavra em texto: emite (palavra, 1)
reduce(palavra, uns):    emite (palavra, soma(uns))
```

O sistema divide a entrada em pedaços, roda os *maps* em paralelo perto dos dados, **agrupa** os pares intermediários por chave (*shuffle*), e roda os *reduces*. Um **coordenador** distribui tarefas e, se um trabalhador não responde, **reexecuta** a tarefa dele em outra máquina; como map e reduce são **funções puras e determinísticas**, repetir é seguro (programação funcional, de novo!). Para tarefas lentas (*stragglers*), lança cópias de reserva.

Sucessores: Hadoop (versão aberta), **Spark** (mantém dados em memória entre etapas, muito mais rápido para algoritmos iterativos) e Flink (fluxos contínuos).

### Atividades de fixação do Tema 4

1. Liste três falhas que você já viu em serviços reais e classifique cada uma num modelo de falha.
2. Três processos trocam mensagens: P1 envia m1 para P2 no seu evento 2; P2 recebe m1 no seu evento 2 e envia m2 para P3 no evento 3; P3 tem um evento local antes de receber m2. Calcule os relógios de Lamport e os vetoriais de todos os eventos.
3. Mostre dois eventos concorrentes com relógios de Lamport diferentes, e explique por que os relógios vetoriais os identificam como concorrentes.
4. Um cliente de RPC envia "incrementa contador", não recebe resposta e reenvia. Desenhe os cenários possíveis. Como o servidor pode garantir que o incremento aconteça uma única vez?
5. Escreva map e reduce para: (a) o índice invertido (palavra → documentos que a contêm); (b) a média de temperatura por cidade a partir de registros (cidade, temperatura).
6. Implemente um MapReduce de brinquedo em Go ou Python com um coordenador e trabalhadores em processos separados (laboratório 1 do 6.5840), incluindo a reexecução de tarefas de trabalhadores que morrem.

## Tema 5: Replicação e consenso

**Objetivo:** manter cópias consistentes dos dados em várias máquinas e fazer máquinas concordarem apesar de falhas.

### 5.1 Replicação

**Replicar** é manter cópias dos dados em várias máquinas, para tolerar falhas e distribuir a leitura. O desafio é manter as cópias **coerentes** quando há escritas.

Abordagens:

- **Líder único** (primário e secundários): todas as escritas vão para o líder, que as repassa às réplicas. Simples; o líder é gargalo e ponto de falha (precisa de eleição).
  - **Síncrona:** o líder confirma ao cliente só depois que as réplicas confirmam. Durável, mais lenta.
  - **Assíncrona:** confirma na hora. Rápida, mas, se o líder morrer, escritas confirmadas podem se perder.
- **Multilíder:** vários nós aceitam escritas (útil em vários data centers); exige resolver **conflitos**.
- **Sem líder** (estilo Dynamo): o cliente escreve em várias réplicas e lê de várias, com **quóruns**.

**Quóruns:** com N réplicas, se cada escrita espera W confirmações e cada leitura consulta R réplicas, e **W + R > N**, toda leitura encontra pelo menos uma réplica com a escrita mais recente. Exemplo comum: N = 3, W = 2, R = 2.

**Máquina de estados replicada:** se todas as réplicas começam no mesmo estado e aplicam **as mesmas operações na mesma ordem**, de forma determinística, terminam no mesmo estado. O problema se reduz a concordar com a **ordem** das operações: um **log replicado**. Isso é o que o consenso resolve.

### 5.2 Raft

O **consenso** é fazer um grupo de nós **concordar** com um valor (ou uma sequência de valores) mesmo que alguns falhem. Com 2f + 1 nós, tolera f falhas por parada (precisa de uma **maioria** viva). Cinco nós toleram dois caídos.

O **Raft** (Ongaro e Ousterhout, 2014) foi projetado para ser **compreensível**. Divide o problema em três partes:

**1. Eleição de líder.** Cada nó é **seguidor**, **candidato** ou **líder**. O tempo é dividido em **mandatos** (*terms*) numerados. O líder envia batimentos (*heartbeats*) periódicos. Se um seguidor fica um tempo **aleatório** (por exemplo, 150 a 300 ms) sem notícias, vira candidato: incrementa o mandato, vota em si e pede votos. Quem recebe votos da **maioria** vira líder. Cada nó vota no máximo uma vez por mandato, então há no máximo um líder por mandato. A aleatoriedade dos tempos evita empates repetidos (o livelock do Tema 2).

**2. Replicação do log.** O cliente envia comandos ao líder, que os acrescenta ao seu log e os envia aos seguidores (`AppendEntries`). Quando uma **maioria** guardou uma entrada, ela está **comprometida** (*committed*): o líder a aplica à máquina de estados e responde ao cliente. Cada `AppendEntries` inclui o índice e o mandato da entrada anterior; o seguidor recusa se o seu log não bater, e o líder volta até achar o ponto em comum e sobrescreve o resto. Assim, os logs convergem.

**3. Segurança.** Um candidato só ganha votos se o seu log estiver **pelo menos tão atualizado** quanto o de quem vota. Como toda entrada comprometida está numa maioria, e toda eleição precisa de uma maioria, as duas maiorias se cruzam: o novo líder sempre tem todas as entradas comprometidas. Nada comprometido se perde.

Raft está no **etcd** (o banco de configuração do Kubernetes), no Consul, no CockroachDB e no TiKV.

### 5.3 Paxos

O **Paxos** (Lamport, 1989, publicado em 1998) foi o primeiro algoritmo de consenso prático e é a base teórica de quase todos os outros. Em sua forma básica, decide **um** valor em duas fases:

1. **Preparação:** um proponente escolhe um número de proposta n e pede às aceitadoras que prometam ignorar propostas menores que n; elas respondem com o valor de maior número que já aceitaram (se houver).
2. **Aceitação:** se uma maioria prometeu, o proponente propõe o valor de maior número informado (ou o seu, se nenhum), e as aceitadoras aceitam se não prometeram algo maior. Um valor aceito por uma maioria está **escolhido**.

O **Multi-Paxos** repete isso para cada posição do log, com um líder estável que pula a primeira fase. É famoso por ser difícil de entender e de implementar corretamente (o Chubby e o Spanner do Google o usam), e foi isso que motivou o Raft.

**Resultado de impossibilidade FLP** (Fischer, Lynch e Paterson, 1985): num sistema **assíncrono** (sem limite de tempo para mensagens), nenhum algoritmo determinístico garante consenso se até **um** nó pode falhar. Na prática, Raft e Paxos são sempre **seguros** (nunca decidem errado) e garantem **progresso** quando a rede se comporta razoavelmente (tempos limite funcionam).

### 5.4 Tolerância a falhas

Técnicas complementares:

- **Detectores de falha** por batimentos e tempos limite (sempre imperfeitos: um nó lento parece morto).
- **Persistência:** o estado que o protocolo exige (mandato atual, voto, log) precisa ir para o disco **antes** de responder, ou uma reinicialização pode violar as garantias.
- **Fotografias** (*snapshots*): compactar o log periodicamente para ele não crescer sem fim.
- **Cercas** (*fencing tokens*): quando um líder antigo "acorda" achando que ainda é líder (uma pausa longa do coletor de lixo), recursos externos recusam operações com números de mandato antigos.
- **Tolerância bizantina** (PBFT e sucessores): com 3f + 1 nós, tolera f nós mentindo. Usado em blockchains com participantes conhecidos.

### Atividades de fixação do Tema 5

1. Com N = 5 réplicas, que combinações de W e R garantem que leituras vejam a última escrita? Qual favorece leituras rápidas? E escritas?
2. Num grupo Raft de 5 nós, quantos podem falhar sem o sistema parar? E com 4 nós? Por que se usam números ímpares?
3. Use o simulador visual do Raft (raft.github.io ou thesecretlivesofdata.com/raft) para: eleger um líder, replicar entradas, derrubar o líder e observar a nova eleição.
4. Por que um candidato com log desatualizado não pode ganhar a eleição? Dê um cenário em que, se pudesse, uma entrada comprometida se perderia.
5. Explique por que o tempo de eleição do Raft é aleatório.
6. Uma partição de rede separa 2 nós (incluindo o líder antigo) de 3 nós num grupo de 5. O que acontece de cada lado? O que acontece com as escritas enviadas ao líder antigo?

## Tema 6: Consistência e estudos de caso

**Objetivo:** escolher o modelo de consistência adequado e aprender com sistemas reais.

### 6.1 Modelos de consistência

O que um cliente pode ver quando lê dados replicados? Do mais forte ao mais fraco:

| Modelo | Garantia | Exemplo |
|---|---|---|
| **Linearizabilidade** | Tudo se passa como se houvesse uma cópia única e cada operação acontecesse num instante entre o início e o fim dela | etcd, Spanner |
| **Consistência sequencial** | Existe uma ordem única das operações, respeitando a ordem de cada cliente (mas não o tempo real) | |
| **Consistência causal** | Operações relacionadas causalmente aparecem na mesma ordem para todos; concorrentes podem aparecer em ordens diferentes | Alguns bancos geodistribuídos |
| **Leia o que você escreveu** | Você sempre vê as suas próprias escritas | Perfis de redes sociais |
| **Consistência eventual** | Se as escritas pararem, as réplicas acabam convergindo | DNS, Dynamo, caches |

Quanto mais forte, mais fácil programar e mais coordenação (latência, menos disponibilidade). Quanto mais fraca, mais rápido e disponível, mas a aplicação precisa lidar com anomalias (ver um comentário antes do post a que ele responde; um item que "volta" ao carrinho).

Na consistência eventual, as réplicas precisam **resolver conflitos**: "a última escrita vence" (por relógio, pode perder escritas), relógios vetoriais devolvendo as versões conflitantes para a aplicação, ou **CRDTs** (tipos de dados replicados sem conflito: contadores, conjuntos e textos com operações que comutam e sempre convergem; usados em editores colaborativos).

### 6.2 Teorema CAP

**Teorema CAP** (Brewer, 2000; provado por Gilbert e Lynch, 2002): durante uma **partição** de rede (P), um sistema replicado precisa escolher entre **consistência** (C, no sentido de linearizabilidade) e **disponibilidade** (A, todo nó que recebe um pedido responde).

- **CP:** durante a partição, o lado sem maioria **recusa** pedidos (Raft, etcd, Spanner, HBase).
- **AP:** os dois lados continuam respondendo e as réplicas divergem até a partição acabar (Dynamo, Cassandra configurado para isso, DNS).

O CAP é frequentemente mal interpretado: partições **não são opcionais** (vão acontecer), então a escolha real é C ou A **durante** a partição. O **PACELC** completa: na Partição, escolha entre A e C; **E**lse (sem partição), entre **L**atência e **C**onsistência, porque mesmo sem falhas a consistência forte exige coordenação, que custa tempo.

### 6.3 Transações distribuídas

Uma transação que altera dados em vários nós (debitar uma conta no servidor A e creditar no B) precisa ser **atômica**: ou tudo, ou nada.

**Confirmação em duas fases** (2PC):

1. **Preparação:** o coordenador pergunta a todos os participantes "você consegue confirmar?". Cada um grava tudo em disco e responde sim (e a partir daí **promete** confirmar se mandarem) ou não.
2. **Decisão:** se todos disseram sim, o coordenador grava "confirmar" e avisa todos; senão, "abortar".

Problema: se o coordenador cai depois que todos disseram sim e antes de avisar, os participantes ficam **bloqueados**, segurando locks, sem poder decidir sozinhos. Soluções: replicar o coordenador com consenso (o Spanner faz 2PC entre grupos Paxos).

Alternativa em microsserviços: **sagas**, uma sequência de transações locais, cada uma com uma **ação compensatória** para desfazer se um passo posterior falhar (cancelar a reserva do hotel se o voo falhar). Sem atomicidade de verdade, mas sem bloqueio.

### 6.4 GFS, Spanner e Dynamo

Três artigos clássicos que todo engenheiro de sistemas deveria ler:

**GFS** (*Google File System*, 2003): sistema de arquivos para arquivos enormes, gravados por acréscimo e lidos sequencialmente, em milhares de discos baratos que falham o tempo todo. Um **mestre** único guarda os metadados na memória; os dados ficam em pedaços de 64 MB replicados 3 vezes em servidores de pedaços. Clientes falam com o mestre só para saber onde estão os dados e depois leem direto dos servidores. Lições: projetar para falhas como regra; simplificar com um mestre único (e lidar com o gargalo); relaxar a consistência quando a aplicação permite. O HDFS do Hadoop seguiu o modelo.

**Dynamo** (Amazon, 2007): armazenamento chave-valor **sempre disponível para escrita** (o carrinho de compras nunca pode recusar "adicionar item"). Técnicas: **hashing consistente** (as chaves e os nós num anel; cada chave vai para os próximos N nós; adicionar um nó só move uma fração das chaves), replicação sem líder com quóruns ajustáveis, **relógios vetoriais** para detectar versões conflitantes (a aplicação junta os carrinhos), *hinted handoff* e **árvores de Merkle** para sincronizar réplicas, e **fofoca** (*gossip*) para descobrir quem está vivo. Escolha AP. Inspirou Cassandra, Riak e o DynamoDB.

**Spanner** (Google, 2012): banco de dados **globalmente distribuído** com transações **linearizáveis** (consistência externa) e SQL. Os dados são divididos em fragmentos, cada um replicado por um grupo **Paxos**; transações entre fragmentos usam **2PC** sobre esses grupos. O truque é o **TrueTime**: uma API de relógio que devolve um **intervalo** [mais cedo, mais tarde] garantido por relógios atômicos e GPS em cada data center. Para confirmar uma transação, o Spanner espera a incerteza passar (*commit wait*, alguns milissegundos), garantindo que marcas de tempo respeitem a ordem real. Escolha CP, com disponibilidade altíssima na prática. Inspirou o CockroachDB e o YugabyteDB.

### Atividades de fixação do Tema 6

1. Classifique quanto à consistência necessária: (a) saldo bancário; (b) número de curtidas de um post; (c) carrinho de compras; (d) estoque do último ingresso de um show; (e) perfil do usuário que acabou de editá-lo.
2. Mostre uma execução que é sequencialmente consistente mas não linearizável (dois clientes, um registrador).
3. Num sistema AP com "a última escrita vence" usando relógios físicos, mostre como uma escrita pode ser perdida.
4. Implemente um contador CRDT (G-Counter: um contador por réplica, valor = soma, junção = máximo componente a componente) e mostre que réplicas que recebem incrementos em ordens diferentes convergem.
5. No 2PC, o que um participante que votou "sim" pode fazer se perder contato com o coordenador? E um que ainda não votou?
6. Implemente hashing consistente com nós virtuais e meça quantas chaves mudam de nó ao adicionar o 11º nó a um anel de 10, comparando com `hash(chave) % n`.

## Projeto da etapa

**Raft e um armazenamento chave-valor replicado (laboratórios do MIT 6.5840):**

1. Siga os laboratórios públicos do 6.5840 em Go: **Lab 1** (MapReduce), **Lab 2** (servidor chave-valor com semântica exatamente uma vez), **Lab 3** (Raft: eleição, log, persistência e *snapshots*) e **Lab 4** (armazenamento chave-valor tolerante a falhas sobre o seu Raft). Os testes automáticos simulam partições, perdas, reinicializações e redes lentas.
2. Rode cada conjunto de testes **centenas de vezes** (os bugs de Raft aparecem em uma execução a cada mil) com o detector de corridas ligado.
3. Escreva um relatório com: o desenho da sua implementação, os bugs mais difíceis que encontrou e como os achou (logs), e gráficos de latência de escrita com 3 e 5 réplicas.

**Alternativa mais curta:** um armazenamento chave-valor replicado com líder único e replicação síncrona para 2 seguidores, com detecção de líder morto e eleição manual, documentando claramente quais garantias se perdem em relação ao Raft.

## Para ir além

- **MIT 6.5840 (6.824) Distributed Systems**: aulas gravadas, artigos comentados e laboratórios, todos públicos.
- *Designing Data-Intensive Applications* (Martin Kleppmann): o melhor livro sobre sistemas de dados distribuídos.
- O artigo do **Raft** (*In Search of an Understandable Consensus Algorithm*), muito legível, e o site raft.github.io.
- Artigos de **MapReduce**, **GFS**, **Dynamo** e **Spanner** (gratuitos), e o *Paxos Made Simple* de Lamport.
- **Jepsen** (jepsen.io): análises que testam bancos de dados reais sob partições e mostram onde eles violam as garantias prometidas.
- *The Art of Multiprocessor Programming* (Herlihy e Shavit) e o curso **MIT 6.172** (Performance Engineering) para paralelismo.

## Resumão

- Concorrência organiza atividades intercaladas; paralelismo executa ao mesmo tempo para ganhar velocidade.
- Memória compartilhada com locks, ou troca de mensagens (CSP com canais, atores). Entre máquinas, só mensagens.
- Corrida de dados torna o programa indefinido. Sincronização cria relações acontece-antes.
- Canais, semáforos, monitores. Cuidado com deadlock, livelock (use espera aleatória) e goroutines vazadas.
- Amdahl: ganho máximo 1/(1 − p). Trabalho/profundidade dá o paralelismo disponível. Fork-join com roubo de trabalho.
- SIMD e GPUs: mesmo código sobre muitos dados. Falso compartilhamento: variáveis diferentes na mesma linha de cache.
- Sistemas distribuídos: falhas parciais, rede não confiável, sem relógio global; lento e morto são indistinguíveis.
- Lamport: a → b implica C(a) < C(b). Vetoriais: a → b sse V(a) < V(b).
- RPC: sem resposta não diz se executou. Idempotência e identificadores de requisição para exatamente uma vez.
- MapReduce: map e reduce puros; reexecutar é seguro.
- Replicação: líder único, multilíder, sem líder com quóruns W + R > N. Máquina de estados replicada precisa de log consensual.
- Raft: eleição com tempos aleatórios, replicação para a maioria, só candidato com log atualizado vence. 2f + 1 nós toleram f.
- FLP: consenso determinístico garantido é impossível no modelo assíncrono; na prática, segurança sempre e progresso quase sempre.
- Linearizável, sequencial, causal, eventual. CAP: durante a partição, C ou A. PACELC: sem partição, latência ou consistência.
- 2PC bloqueia se o coordenador cai; sagas compensam. GFS, Dynamo (AP) e Spanner (CP com TrueTime).
