# Sistemas Distribuídos: Apostila Prática

Roadmap Java Backend · Semanas 19 a 21

## Comece por aqui

Enquanto tudo roda num servidor só, a vida é simples: ou funciona, ou caiu. Quando o sistema vira **vários serviços conversando pela rede**, surgem problemas novos: um serviço responde devagar, uma mensagem chega duas vezes, um banco fica desatualizado por alguns segundos. Esta apostila ensina a pensar nesses cenários.

### Por que isso vale ouro no mercado

- Mercado Livre, iFood, bancos digitais: todos rodam centenas ou milhares de microsserviços.
- Kafka aparece em grande parte das vagas Java pleno e sênior.
- Perguntas sobre idempotência, retries, Saga e Outbox separam pleno de sênior na entrevista.

### Como esta apostila funciona

1. Teoria com exemplos do dia a dia de fintech e e-commerce.
2. Laboratórios com Docker Compose (Kafka, RabbitMQ).
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** desenhe no papel as caixas (serviços) e setas (mensagens) antes de responder. Quase todo problema de sistemas distribuídos fica claro no desenho.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 19 | Tema 1: Fundamentos de sistemas distribuídos |
| 20 | Tema 2: Comunicação entre serviços |
| 21 | Tema 3: Microsserviços e resiliência + projeto |

## Tema 1: Fundamentos de sistemas distribuídos

**Objetivo:** entender por que distribuir é difícil e as ferramentas mentais para lidar com isso.

### 1.1 O que é um sistema distribuído

Vários computadores que trabalham juntos e, para o usuário, parecem um só. Por que distribuir?

- **Escala:** um servidor não aguenta todos os usuários.
- **Disponibilidade:** se uma máquina cai, outra assume.
- **Organização:** times diferentes cuidam de serviços diferentes.

### 1.2 Falhas parciais

Num sistema distribuído, **parte** dele pode falhar enquanto o resto funciona. E o pior: muitas vezes você não sabe **se** falhou.

Você chamou o serviço de pagamento e não recebeu resposta. Possibilidades:

1. A requisição nem chegou.
2. Chegou, o pagamento foi feito, e a resposta se perdeu.
3. Está processando, só está lento.

Do seu lado, os três casos parecem iguais: **timeout**. Isso muda tudo.

> **Analogia:** você manda uma mensagem no WhatsApp e fica só um tracinho. A pessoa não recebeu? Recebeu e não leu? Leu e não respondeu? Você não sabe, e precisa decidir o que fazer mesmo assim.

As **falácias da computação distribuída** (coisas que iniciantes assumem e são falsas): a rede é confiável; a latência é zero; a banda é infinita; a rede é segura; a topologia não muda; existe um só administrador; o custo de transporte é zero; a rede é homogênea.

### 1.3 Teorema CAP

Quando a rede se **particiona** (P: dois grupos de servidores param de se falar), você precisa escolher entre:

- **C (Consistência):** todos veem o mesmo dado; se não dá para garantir, recusa a operação.
- **A (Disponibilidade):** sempre responde, mesmo que com dado possivelmente desatualizado.

Partição de rede **vai** acontecer, então na prática a escolha é **CP ou AP** durante a partição.

| Exemplo | Escolha | Por quê |
|---|---|---|
| Saldo bancário | CP | Melhor recusar do que deixar gastar duas vezes |
| Contador de curtidas | AP | Mostrar 1.203 em vez de 1.205 por alguns segundos não faz mal |
| Carrinho de compras | AP (geralmente) | Melhor aceitar o item e conciliar depois |

> **Cuidado! Cai na entrevista:** CAP fala do comportamento **durante uma partição**. Fora dela, a escolha do dia a dia é entre **latência e consistência** (é o que o teorema PACELC acrescenta).

### 1.4 Consistência eventual

O dado vai ficar igual em todo lugar **em algum momento**, mas não imediatamente. Exemplo: você posta uma foto; seu amigo em outro país pode demorar alguns segundos para ver. Funciona bem para muita coisa, desde que o produto seja pensado para isso.

### 1.5 Idempotência

Uma operação é **idempotente** se executá-la várias vezes tem o mesmo efeito que executar uma vez. É **a** ferramenta para lidar com o "não sei se deu certo": se a operação é idempotente, basta tentar de novo.

```java
@PostMapping("/pagamentos")
ResponseEntity<PagamentoResponse> pagar(@RequestHeader("Idempotency-Key") String chave,
                                         @RequestBody PagamentoRequest req) {
    return idempotencia.buscar(chave)                         // já processei essa chave?
        .map(ResponseEntity::ok)                              // devolve a mesma resposta
        .orElseGet(() -> {
            var resp = service.pagar(req);
            idempotencia.salvar(chave, resp);                 // idealmente na mesma transação
            return ResponseEntity.status(201).body(resp);
        });
}
```

Para garantir no banco: uma **constraint UNIQUE** na chave de idempotência. Se duas requisições chegarem juntas, só uma consegue inserir.

### 1.6 Timeouts e retries

- **Sempre** configure timeout em chamadas de rede. Sem timeout, uma dependência lenta prende suas threads até tudo travar.
- **Retry** só em operações idempotentes e só em erros temporários (timeout, 503), nunca em 400.
- Use **backoff exponencial com jitter**: espera 100 ms, 200 ms, 400 ms… com uma variação aleatória, para milhares de clientes não tentarem todos ao mesmo tempo (o "efeito manada").

```java
RestClient client = RestClient.builder()
    .baseUrl("https://pagamentos.interno")
    .requestFactory(new JdkClientHttpRequestFactory(HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(1)).build()))
    .build();
```

### Atividades de fixação do Tema 1

1. Você chamou o serviço de estoque para reservar 1 unidade e deu timeout. Liste as possibilidades do que aconteceu e o que você faria em cada caso.
2. Classifique como CP ou AP e justifique: (a) reserva do último assento de um voo; (b) número de visualizações de um vídeo; (c) catálogo de produtos; (d) limite do cartão de crédito.
3. Quais destas operações são idempotentes? (a) `saldo = 100`; (b) `saldo = saldo + 10`; (c) `DELETE /pedidos/5`; (d) enviar um e-mail de boas-vindas; (e) `UPDATE pedidos SET status = 'PAGO' WHERE id = 5`.
4. Por que fazer retry sem backoff pode **derrubar** um serviço que estava só um pouco lento?
5. Desenhe como você tornaria idempotente o envio do e-mail de boas-vindas.

## Tema 2: Comunicação entre serviços

**Objetivo:** escolher entre chamada direta e mensageria, e usar Kafka sem perder eventos.

### 2.1 Síncrono vs assíncrono

| | Síncrono (REST, gRPC) | Assíncrono (mensageria) |
|---|---|---|
| Quem chama | Espera a resposta | Publica e segue a vida |
| Acoplamento | Alto: se o outro cai, você sente | Baixo: a mensagem espera na fila |
| Bom para | Consultas, quando precisa da resposta agora | Notificações, processamento demorado, integrar vários serviços |
| Dificuldade | Cascata de falhas e latência somada | Consistência eventual, debug mais difícil |

### 2.2 REST vs gRPC

**gRPC** usa HTTP/2 e Protocol Buffers (binário). É mais rápido e tem contrato tipado (`.proto`), bom para comunicação **interna** entre serviços. REST/JSON é mais simples, legível e universal, bom para APIs **públicas** e front-end.

```proto
service EstoqueService {
  rpc Reservar (ReservaRequest) returns (ReservaResponse);
}
message ReservaRequest { int64 produto_id = 1; int32 quantidade = 2; }
message ReservaResponse { bool ok = 1; }
```

### 2.3 Mensageria: filas e tópicos

- **Fila (ponto a ponto):** cada mensagem é processada por **um** consumidor. Bom para distribuir trabalho.
- **Tópico (pub/sub):** cada mensagem chega a **todos** os interessados. Bom para eventos ("pedido criado" interessa a estoque, e-mail e antifraude).

Garantias de entrega:

| Garantia | Significa | Custo |
|---|---|---|
| At most once | Pode perder, nunca duplica | Barato |
| **At least once** | Nunca perde, **pode duplicar** | O mais comum |
| Exactly once | Nem perde nem duplica | Caro e limitado |

> **Cuidado! Cai na entrevista:** com at-least-once, o **consumidor precisa ser idempotente**. Guarde o ID das mensagens já processadas ou faça a operação naturalmente idempotente.

### 2.4 Kafka

Kafka é um **log distribuído**: as mensagens são gravadas em ordem e ficam guardadas por um tempo (dias), mesmo depois de lidas.

- **Tópico** dividido em **partições**. A ordem é garantida **dentro** de uma partição.
- A **chave** da mensagem decide a partição: mesma chave (ex.: `pedidoId`), mesma partição, ordem garantida para aquele pedido.
- **Consumer group:** cada partição é lida por um consumidor do grupo. Mais partições = mais paralelismo.
- **Offset:** a posição de leitura de cada grupo. O consumidor faz commit do offset depois de processar.

```java
// Produtor (Spring Kafka)
kafka.send("pedidos.criados", pedido.id().toString(), new PedidoCriado(pedido.id(), pedido.total()));

// Consumidor
@KafkaListener(topics = "pedidos.criados", groupId = "estoque")
void aoCriarPedido(PedidoCriado evento) {
    if (processados.jaViu(evento.id())) return;   // idempotência
    estoque.reservar(evento);
}
```

```yaml
# docker-compose.yml mínimo para estudar
services:
  kafka:
    image: apache/kafka:3.8.0
    ports: ["9092:9092"]
```

### 2.5 RabbitMQ

RabbitMQ é um **broker de mensagens** clássico: a mensagem sai da fila quando o consumidor confirma (ack). Tem roteamento flexível (exchanges direct, topic, fanout) e é ótimo para filas de tarefas.

| | Kafka | RabbitMQ |
|---|---|---|
| Modelo | Log persistente, reler é possível | Fila, mensagem some após ack |
| Volume | Altíssimo (milhões/s) | Alto |
| Bom para | Streaming de eventos, event sourcing, analytics | Filas de trabalho, roteamento complexo |

### 2.6 Event-Driven e Outbox Pattern

Arquitetura **orientada a eventos**: serviços publicam fatos ("PedidoCriado", "PagamentoAprovado") e outros reagem.

O problema da **escrita dupla**:

```java
@Transactional
void criarPedido(...) {
    repo.save(pedido);                 // 1. grava no banco
    kafka.send("pedidos", evento);     // 2. publica no Kafka
}
```

Se o Kafka falha depois do save, o pedido existe e ninguém fica sabendo. Se o envio dá certo e o commit do banco falha, todos acham que existe um pedido que não existe.

**Outbox Pattern:** grave o evento numa tabela `outbox` **na mesma transação** do pedido. Um processo separado lê a outbox e publica no Kafka (com polling ou com CDC usando Debezium). Como o banco garante atomicidade, ou os dois existem, ou nenhum.

```sql
CREATE TABLE outbox (
  id UUID PRIMARY KEY,
  tipo VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  publicado_em TIMESTAMPTZ
);
```

### Atividades de fixação do Tema 2

1. Para cada caso, síncrono ou assíncrono? (a) mostrar o saldo na tela; (b) enviar nota fiscal por e-mail após a compra; (c) validar CEP no cadastro; (d) atualizar o painel de vendas em tempo real.
2. Você precisa que todos os eventos de um mesmo pedido sejam processados em ordem no Kafka. Como garantir?
3. Um tópico tem 6 partições e o consumer group tem 8 consumidores. O que acontece com os 2 extras?
4. Explique com suas palavras o problema da escrita dupla e como o Outbox resolve.
5. Suba o Kafka com Docker Compose, crie um produtor e um consumidor Spring. Pare o consumidor, publique 10 mensagens, ligue de novo. O que acontece?

## Tema 3: Microsserviços e resiliência

**Objetivo:** saber quando usar microsserviços e como impedir que a falha de um derrube todos.

### 3.1 Monolito vs microsserviços

| | Monolito | Microsserviços |
|---|---|---|
| Deploy | Um só | Independente por serviço |
| Complexidade | No código | Na infraestrutura e na rede |
| Escala | Tudo junto | Cada serviço separado |
| Times | Bom para times pequenos | Bom para muitos times |
| Transações | ACID simples | Distribuídas (Saga) |

> **Na prática:** comece com um **monolito modular** (módulos bem separados no mesmo deploy). Quebre em microsserviços quando houver dor real: times se atrapalhando, partes com necessidade de escala muito diferente. Microsserviço cedo demais vira "monolito distribuído": todos os problemas dos dois mundos.

### 3.2 API Gateway e Service Discovery

- **API Gateway:** porta de entrada única. Faz roteamento, autenticação, rate limiting, agregação. Ex.: Spring Cloud Gateway, Kong, AWS API Gateway.
- **Service Discovery:** serviços sobem e descem com IPs que mudam; alguém precisa saber onde cada um está. No Kubernetes, o próprio DNS de `Service` resolve isso; fora dele, Eureka ou Consul.

### 3.3 Circuit Breaker

Se o serviço de recomendação está fora, não adianta continuar chamando e esperando timeout a cada requisição. O **circuit breaker** funciona como o disjuntor da sua casa:

- **Fechado:** chamadas passam normalmente; ele conta as falhas.
- **Aberto:** passou do limite de falhas, ele **corta** as chamadas e responde na hora com um fallback.
- **Meio-aberto:** depois de um tempo, deixa algumas passarem para testar se o serviço voltou.

```java
@CircuitBreaker(name = "recomendacoes", fallbackMethod = "semRecomendacoes")
public List<Produto> recomendar(Long clienteId) {
    return recomendacaoClient.buscar(clienteId);
}

List<Produto> semRecomendacoes(Long clienteId, Throwable erro) {
    return produtosMaisVendidos.top10();   // degrada com elegância
}
```

Resilience4j também oferece **Retry**, **RateLimiter**, **Bulkhead** (limita quantas chamadas simultâneas vão para uma dependência, para ela não consumir todas as threads) e **TimeLimiter**.

### 3.4 Saga

Sem transação ACID entre serviços, como garantir que "pedido + pagamento + estoque" fique consistente? Com uma **Saga**: uma sequência de transações locais, cada uma com uma **ação de compensação** para desfazer.

```
Criar pedido → Reservar estoque → Cobrar pagamento → Confirmar pedido
                                      ✗ falhou
             ← Liberar estoque  ←  (compensação)  → Cancelar pedido
```

- **Coreografia:** cada serviço reage a eventos dos outros. Simples para poucos passos, difícil de enxergar o fluxo.
- **Orquestração:** um orquestrador comanda os passos. Fluxo explícito, mais fácil de monitorar (ex.: Temporal, Camunda).

### 3.5 Rate Limiting

Limitar quantas requisições um cliente faz por intervalo. Protege contra abuso e picos. Algoritmos comuns: **token bucket** (permite rajadas curtas), **leaky bucket**, **janela deslizante**. Resposta: **429 Too Many Requests** com `Retry-After`.

### 3.6 Tracing distribuído

Uma requisição passa por 8 serviços e demora 3 segundos. Onde está a lentidão? O **tracing** dá um `traceId` para a requisição, propagado em todas as chamadas, e cada serviço registra quanto tempo gastou (**spans**). Ferramentas: OpenTelemetry + Jaeger, Grafana Tempo, Zipkin. No Spring Boot 3: Micrometer Tracing.

> **Cuidado! Cai na entrevista:** inclua o `traceId` em todos os logs. Assim dá para juntar os logs de todos os serviços de uma mesma requisição.

### Atividades de fixação do Tema 3

1. Uma startup com 4 devs quer começar com 12 microsserviços. Dê sua opinião com argumentos.
2. Desenhe os estados de um circuit breaker e o que dispara cada transição.
3. Desenhe uma Saga para "reservar viagem": voo, hotel e carro. Quais as compensações?
4. Qual a diferença entre circuit breaker e retry? Podem ser usados juntos? Em que ordem?
5. Explique como o tracing ajudaria a descobrir que a lentidão de um checkout vem do serviço de frete.

## Projeto da etapa

**Microsserviços de pedidos com Kafka.** Três serviços Spring Boot:

1. **pedidos:** cria o pedido e grava o evento `PedidoCriado` na outbox; um job publica no Kafka.
2. **estoque:** consome `PedidoCriado`, reserva e publica `EstoqueReservado` ou `EstoqueInsuficiente`.
3. **pagamentos:** consome `EstoqueReservado`, simula cobrança (falha em 20% das vezes), publica `PagamentoAprovado` ou `PagamentoRecusado`.
4. Pedidos escuta os resultados e confirma ou cancela (Saga por coreografia), e estoque libera a reserva quando o pagamento é recusado.
5. Consumidores idempotentes (tabela de mensagens processadas).
6. Tracing com OpenTelemetry e um `docker-compose.yml` com tudo.

## Resumão

- Em sistemas distribuídos, falha parcial é normal e "timeout" não diz se a operação aconteceu.
- CAP: na partição, escolha entre consistência e disponibilidade conforme o negócio.
- Idempotência + retry com backoff e jitter + timeout: o trio básico.
- At-least-once exige consumidor idempotente.
- Kafka: ordem por partição; a chave escolhe a partição.
- Outbox resolve a escrita dupla; Saga substitui a transação distribuída.
- Circuit breaker evita cascata de falhas; tracing mostra onde está a lentidão.
