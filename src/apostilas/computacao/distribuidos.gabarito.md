# Gabarito: Concorrência, Paralelismo e Sistemas Distribuídos

Abra só depois de tentar.

## Tema 1

1. **Concorrente sem paralelismo:** um servidor com `asyncio` numa thread só, atendendo milhares de conexões intercaladas, ou um sistema operacional num processador de um núcleo. **Paralelo sem concorrência:** somar um array dividindo em 8 partes que rodam ao mesmo tempo, sem nenhuma interação entre elas até o fim; ou uma instrução SIMD somando 8 números de uma vez.
2. O relatório mostra `WARNING: DATA RACE`, com a escrita de uma goroutine e a leitura/escrita anterior de outra, e as linhas. Correções:
   ```go
   // com mutex
   mu.Lock(); contador++; mu.Unlock()

   // com atômico
   var contador int64
   atomic.AddInt64(&contador, 1)
   ```
3. ```go
   incrementos := make(chan struct{})
   pronto := make(chan int)
   go func() {                         // a única dona do contador
       c := 0
       for range incrementos { c++ }
       pronto <- c
   }()
   var wg sync.WaitGroup
   for i := 0; i < 100; i++ {
       wg.Add(1)
       go func() { defer wg.Done(); incrementos <- struct{}{} }()
   }
   wg.Wait()
   close(incrementos)
   fmt.Println(<-pronto)               // 100
   ```
4. Duas goroutines com saldo = 100 e valor = 80: ambas leem saldo (100) e passam no teste; ambas subtraem; o saldo fica −60. Cada acesso estava protegido, mas o **teste e a ação** não formam uma unidade atômica. Correção: travar uma vez em volta dos dois (`mu.Lock(); if saldo >= valor { saldo -= valor }; mu.Unlock()`).
5. A versão ingênua: `if (inst == null) { lock; if (inst == null) inst = new Obj(); unlock; } return inst;`. O primeiro teste é feito **sem sincronização**. Como o compilador e o processador podem reordenar "alocar, inicializar os campos, publicar o ponteiro", outra thread pode ver `inst` diferente de nulo **antes** dos campos estarem inicializados e usar um objeto pela metade. Correção: declarar `inst` como `volatile` em Java 5+ (ou atômico com ordem *acquire/release* em C++), ou usar inicialização estática/`sync.Once` em Go.

## Tema 2

1. ```go
   sem := make(chan struct{}, 5)
   var wg sync.WaitGroup
   for i := 0; i < 100; i++ {
       wg.Add(1)
       go func(i int) {
           defer wg.Done()
           sem <- struct{}{}           // entra (bloqueia se já há 5)
           defer func() { <-sem }()    // sai
           trabalha(i)
       }(i)
   }
   wg.Wait()
   ```
2. Com canal com buffer, o produtor e consumidor viram uma linha cada (`ch <- x` e `x := <-ch`): o canal **é** o buffer limitado, com sincronização embutida. Com `sync.Cond`, é preciso mutex, duas condições, o laço `for` em volta do `Wait` e cuidado para sinalizar: o mesmo código de Sistemas Operacionais. O canal fica bem mais simples.
3. ```go
   espera := make(chan int, N)          // as N cadeiras
   go func() {                          // barbeiro
       for cliente := range espera {     // dorme quando não há ninguém
           corta(cliente)
       }
   }()
   chega := func(c int) {
       select {
       case espera <- c:                 // senta se houver cadeira
       default:
           fmt.Println("barbearia cheia, cliente", c, "foi embora")
       }
   }
   ```
4. ```go
   func gera(ctx context.Context, n int) <-chan int {
       out := make(chan int)
       go func() {
           defer close(out)
           for i := 1; i <= n; i++ {
               select {
               case out <- i:
               case <-ctx.Done():
                   return
               }
           }
       }()
       return out
   }

   func quadrado(ctx context.Context, in <-chan int) <-chan int {
       out := make(chan int)
       go func() {
           defer close(out)
           for x := range in {
               select {
               case out <- x * x:
               case <-ctx.Done():
                   return
               }
           }
       }()
       return out
   }

   ctx, cancela := context.WithCancel(context.Background())
   defer cancela()
   soma := 0
   for v := range quadrado(ctx, gera(ctx, 100)) { soma += v }   // 338350
   ```
5. O canal não tem buffer: o envio `ch <- 1` **bloqueia** até alguém receber, mas o único receptor é a mesma goroutine, na linha seguinte, que nunca chega a rodar. Resultado: `all goroutines are asleep - deadlock!`. Correções: canal com buffer (`make(chan int, 1)`) ou enviar em outra goroutine (`go func() { ch <- 1 }()`).
6. Com `resp := make(chan string)` sem buffer e três goroutines fazendo `resp <- busca(...)`, a função lê só a primeira resposta e retorna: as outras duas goroutines ficam **bloqueadas para sempre** tentando enviar. Correções: `make(chan string, 3)` (todas conseguem enviar e terminam), ou passar um `context` cancelado ao retornar e usar `select` com `ctx.Done()` no envio.

## Tema 3

1. Tempo = 20 + 80/n. **4 núcleos: 40 s** (ganho 2,5); **8: 30 s** (3,3); **1.000: 20,08 s** (≈ 5). Ganho máximo: 1/(1 − 0,8) = **5 vezes**, porque os 20 s sequenciais nunca diminuem.
2. Trabalho: T₁ = Θ(n log n) (o mesmo do sequencial). Profundidade: T∞(n) = T∞(n/2) + Θ(n) (as chamadas em paralelo contam uma vez; o merge sequencial de n elementos não) = **Θ(n)**. Paralelismo = Θ(n log n)/Θ(n) = **Θ(log n)**: só uns 20 para um milhão de elementos. O gargalo é o **merge sequencial**; com um merge paralelo (dividir pela mediana com busca binária), a profundidade cai para Θ(log³ n) e o paralelismo sobe muito.
3. Com limite 10, a sobrecarga de criar milhões de goroutines domina e fica **mais lento** que o sequencial. Com 1.000, há bom ganho. Com 100.000, o ganho é parecido ou um pouco menor (poucas tarefas para balancear entre os núcleos). O gráfico tem forma de U: existe uma granularidade ideal.
4. Contadores contíguos: os 4 compartilham uma linha de cache e o programa fica **várias vezes mais lento** que com uma thread (a linha "pinga" entre núcleos a cada escrita). Separados por 64 bytes (ou com `_Alignas(64)`), o ganho com 4 threads fica perto de 4 vezes. A diferença típica é de 5 a 20 vezes entre as duas versões.
5. ```c
   #pragma omp parallel for
   for (int i = 0; i < N; i++)
       for (int k = 0; k < N; k++) {
           double aik = A[i][k];
           for (int j = 0; j < N; j++)
               C[i][j] += aik * B[k][j];
       }
   ```
   Paralelizar o laço externo (i) é seguro: cada thread escreve em linhas diferentes de C. O ganho costuma ficar perto do linear até 4 threads e depois cresce menos, limitado pela banda de memória e pelo cache compartilhado (com blocagem, escala melhor).
6. O GCC informa que **não** vetorizou: há uma **dependência entre iterações** (cada a[i] precisa do a[i − 1] que acabou de ser calculado). Não dá para calcular 8 elementos de uma vez com uma soma simples. É uma **soma de prefixos**, que tem algoritmos paralelos próprios (*scan*), mas não é vetorizada automaticamente.

## Tema 4

1. Exemplos: (a) um servidor que ficou sem energia e não voltou: **parada**; (b) um banco que reiniciou depois de uma atualização e voltou com o estado do disco: **parada e recuperação**; (c) um switch descartando parte dos pacotes por fila cheia: **omissão**; (d) um nó com memória corrompida respondendo valores errados, ou um nó comprometido por um atacante: **bizantina**.
2. Relógios de Lamport: P1: e1 = 1, e2 (envia m1) = 2. P2: e1 = 1, e2 (recebe m1) = max(1, 2) + 1 = 3, e3 (envia m2) = 4. P3: e1 = 1, e2 (recebe m2) = max(1, 4) + 1 = 5.
   Vetoriais [P1, P2, P3]: P1: e1 = [1, 0, 0], e2 = [2, 0, 0]. P2: e1 = [0, 1, 0], e2 = [2, 2, 0], e3 = [2, 3, 0]. P3: e1 = [0, 0, 1], e2 = [2, 3, 2].
3. O evento e2 de P1 (Lamport 2) e o e1 de P2 (Lamport 1) são **concorrentes** (nenhuma mensagem liga um ao outro), mas têm relógios de Lamport diferentes, o que poderia sugerir que P2.e1 veio antes. Os vetores [2, 0, 0] e [0, 1, 0] são **incomparáveis** (cada um é maior numa posição), e isso indica concorrência com certeza.
4. Cenários: (a) o pedido se perdeu: o reenvio é a primeira execução; (b) o pedido foi executado e a **resposta** se perdeu: o reenvio executaria de novo (contador incrementado duas vezes); (c) o servidor ainda está processando: as duas cópias podem rodar. Solução: o cliente gera um **identificador único** por requisição (ID do cliente + número de sequência) e o reenvia igual; o servidor guarda, por cliente, o último número processado e a resposta: se chegar repetido, devolve a resposta guardada sem executar.
5. (a) `map(doc, texto)`: para cada palavra distinta, emite (palavra, doc). `reduce(palavra, docs)`: emite (palavra, lista ordenada sem repetição de docs). (b) `map(_, registro)`: emite (cidade, (temperatura, 1)). `reduce(cidade, pares)`: soma as temperaturas e as contagens e emite (cidade, soma/contagem). Emitir (soma, contagem) em vez da média permite usar um **combinador** (reduzir parcialmente no próprio *map*), porque médias de médias dariam errado.
6. Pontos principais: o coordenador mantém o estado de cada tarefa (ociosa, em andamento com horário de início, concluída); trabalhadores pedem tarefas por RPC; se uma tarefa passa de ~10 s em andamento, volta a ficar ociosa e é entregue a outro. Para que uma tarefa reexecutada não deixe arquivos pela metade, cada trabalhador escreve num arquivo temporário e faz `rename` atômico no fim (a mesma técnica de Sistemas Operacionais). Os *reduces* só começam quando todos os *maps* terminaram.

## Tema 5

1. Precisa de **W + R > 5**: (W, R) = (1, 5), (2, 4), (3, 3), (4, 2), (5, 1). **Leituras rápidas:** R = 1 com W = 5 (mas qualquer réplica fora do ar impede escritas). **Escritas rápidas:** W = 1 com R = 5. O equilíbrio comum é W = R = 3, que tolera 2 réplicas fora para ambas as operações.
2. Com 5 nós, a maioria é 3: tolera **2 falhas**. Com 4 nós, a maioria também é 3: tolera só **1**. O quarto nó não aumenta a tolerância e ainda aumenta o tamanho da maioria. Por isso se usam 3, 5 ou 7 nós.
3. Prática. Repare que, depois de derrubar o líder, os seguidores esperam tempos diferentes; o primeiro a "acordar" vira candidato num mandato maior e quase sempre ganha.
4. Uma entrada comprometida está gravada numa maioria. Suponha 5 nós e a entrada X (índice 5) comprometida nos nós A, B e C. Se o nó D, cujo log só vai até o índice 4, pudesse se eleger com votos de D, E e de um nó que tem X (por exemplo, C), D começaria a mandar o **seu** log como verdade, e os seguidores apagariam X para ficar iguais a ele: uma operação confirmada ao cliente desapareceria. A regra "só voto em quem tem log pelo menos tão atualizado quanto o meu" faz C recusar o voto. Como qualquer maioria inclui pelo menos um dos que têm X, D nunca consegue a maioria.
5. Se todos os seguidores tivessem o mesmo tempo limite, ficariam candidatos ao mesmo tempo, cada um votaria em si, ninguém teria maioria, e o empate se repetiria em todo mandato (um **livelock**). Com tempos aleatórios (por exemplo, entre 150 e 300 ms), quase sempre um nó acorda primeiro, pede votos e vence antes dos outros virarem candidatos.
6. **Lado com 3 nós (maioria):** param de receber batimentos, elegem um novo líder num mandato maior e continuam aceitando e comprometendo escritas. **Lado com 2 nós:** o líder antigo continua achando que é líder e aceita pedidos, mas **não consegue comprometer** nada (não alcança a maioria); os clientes não recebem confirmação. Quando a partição acaba, o líder antigo vê o mandato maior, vira seguidor, e as entradas não comprometidas do seu log são **apagadas** e substituídas pelas do novo líder. Os clientes que não receberam resposta reenviam (por isso a deduplicação de requisições). Nada confirmado se perde.

## Tema 6

1. (a) Saldo bancário: **forte** (linearizável ou transações serializáveis). (b) Curtidas: **eventual** (ninguém se importa se aparece 1.203 ou 1.205 por alguns segundos). (c) Carrinho: **eventual com junção de conflitos**, priorizando disponibilidade (o caso do Dynamo). (d) Último ingresso: **forte** (senão vende o mesmo assento duas vezes). (e) Perfil recém-editado: **leia o que você escreveu** (o próprio usuário precisa ver a mudança; os outros podem ver depois).
2. Registrador x começa em 0. O cliente A escreve x = 1 e a escrita **termina** às 10h00. Às 10h01, o cliente B lê x e obtém 0. Isso **não é linearizável**: a leitura começou depois do fim da escrita, então deveria ver 1. Mas é **sequencialmente consistente**: a ordem "B lê 0, A escreve 1" respeita a ordem de cada cliente (cada um fez uma operação só). A consistência sequencial ignora o tempo real; a linearizabilidade não.
3. Réplicas R1 e R2 com relógios defasados (R2 está 5 s atrasado). Às 12:00:00 (relógio de R1), o cliente escreve x = "A" em R1. Às 12:00:02 reais, outro cliente escreve x = "B" em R2, que marca 11:59:57. Quando as réplicas sincronizam, "a última vence" escolhe "A" (marca maior), e a escrita **B, que aconteceu depois**, é descartada silenciosamente.
4. ```python
   class GCounter:
       def __init__(self, id, n):
           self.id, self.v = id, [0] * n
       def incrementa(self):
           self.v[self.id] += 1
       def valor(self):
           return sum(self.v)
       def junta(self, outro):
           self.v = [max(a, b) for a, b in zip(self.v, outro.v)]
   ```
   A junção (máximo componente a componente) é **comutativa, associativa e idempotente**: não importa a ordem nem se uma atualização chega repetida, todas as réplicas convergem para o mesmo vetor. Cada réplica só incrementa a **sua** posição, então nenhum incremento se perde.
5. Quem votou "sim" **não pode decidir sozinho**: o coordenador pode ter decidido confirmar (se todos disseram sim) ou abortar (se alguém disse não). Ele precisa **esperar** o coordenador voltar (ou perguntar aos outros participantes se algum sabe a decisão), segurando os locks: é o bloqueio do 2PC. Quem **ainda não votou** pode simplesmente **abortar** (votar não), porque o coordenador não pode ter decidido confirmar sem o voto dele.
6. Com `hash % n`, ao passar de 10 para 11 nós, uma chave só fica no mesmo nó se hash mod 10 = hash mod 11: cerca de **90%** das chaves mudam de lugar. Com hashing consistente, só as chaves que caem no trecho do anel assumido pelo novo nó mudam: cerca de **1/11 ≈ 9%**. Os **nós virtuais** (cada nó físico em muitas posições do anel, como 100) deixam a distribuição de carga uniforme, em vez de alguns nós ficarem com trechos grandes do anel.

## Projeto da etapa

Pontos de revisão (os erros mais comuns nos laboratórios do 6.5840):

- **Locks:** proteja todo o estado do Raft com um mutex, mas **nunca segure o lock durante um RPC** (enviar `RequestVote` com o lock travado gera deadlock quando dois nós se chamam ao mesmo tempo). Copie os dados necessários, solte o lock, envie, e ao receber a resposta trave de novo e **confira se o mandato ainda é o mesmo** antes de usar a resposta.
- **Mandatos:** em **qualquer** RPC (pedido ou resposta) com mandato maior que o seu, atualize o mandato e vire seguidor imediatamente.
- **Reinício do tempo de eleição:** só reinicie ao receber `AppendEntries` do líder **atual** ou ao **conceder** um voto; reiniciar ao recusar um voto causa eleições intermináveis.
- **Compromisso:** o líder só pode avançar o `commitIndex` contando réplicas de entradas do **mandato atual** (a figura 8 do artigo mostra o caso em que contar entradas antigas perde dados).
- **Persistência:** grave `currentTerm`, `votedFor` e o log **antes** de responder a qualquer RPC que os altere.
- **Depuração:** um log por nó com mandato, papel e índices em cada linha, e um script que intercala os logs em ordem de tempo, economizam dias. Rode os testes com `-race` e em laço (`for i in $(seq 500); do go test -run 3A || break; done`).
