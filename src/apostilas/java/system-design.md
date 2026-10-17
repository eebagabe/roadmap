# System Design — Apostila Prática

Roadmap Java Backend · Semanas 22 a 24

## Comece por aqui

System Design é desenhar um sistema grande (um encurtador de links, um chat, um PIX) e **defender as escolhas**. Não existe resposta certa única. Existe resposta bem justificada. É a etapa que mais pesa em entrevistas para pleno e sênior.

### Por que isso vale ouro no mercado

- Entrevistas de pleno e sênior em big techs, bancos digitais e marketplaces quase sempre têm uma rodada de System Design.
- No trabalho, toda feature nova grande começa com uma conversa de design: "aguenta a Black Friday?".
- Junta tudo que você estudou: rede, banco, cache, filas, sistemas distribuídos.

### Como esta apostila funciona

1. O Tema 1 apresenta os blocos (as "peças de Lego").
2. O Tema 2 dá um método para não se perder na entrevista.
3. O Tema 3 aplica o método em cases clássicos.
4. Faça os desenhos no papel ou no excalidraw.com antes de ver o gabarito.

> **Regra dos 20 minutos:** não fique buscando a solução "perfeita". Desenhe a versão simples que funciona e depois pergunte: "onde isso quebra com 100 vezes mais usuários?".

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 22 | Tema 1 — Blocos de construção |
| 23 | Tema 2 — Método para a entrevista |
| 24 | Tema 3 — Cases clássicos + simulado |

## Tema 1 — Blocos de construção

**Objetivo:** conhecer as peças que aparecem em quase todo desenho de sistema.

### 1.1 Escalabilidade vertical e horizontal

- **Vertical (scale up):** máquina maior (mais CPU, mais RAM). Simples, mas tem limite e é um ponto único de falha.
- **Horizontal (scale out):** mais máquinas. Quase sem limite, mas exige que a aplicação seja **stateless** (não guarde sessão em memória local).

> **Na prática:** deixe a aplicação stateless (sessão em Redis ou token), e escalar horizontalmente vira só "subir mais réplicas".

### 1.2 Load Balancer

Distribui requisições entre servidores. Estratégias: **round robin**, **menos conexões**, **hash do IP/usuário** (para afinidade). Também faz **health check**: tira do rodízio quem não responde.

- **L4** (transporte): olha IP e porta. Rápido.
- **L7** (aplicação): olha HTTP (caminho, header). Pode rotear `/api/pagamentos` para um grupo e `/api/catalogo` para outro.

### 1.3 Cache

Guardar o resultado de algo caro para reaproveitar. Pode estar no navegador, na CDN, na aplicação (Caffeine) ou num serviço (Redis).

Padrões:

- **Cache-aside (lazy loading):** a aplicação procura no cache; se não acha (miss), busca no banco e grava no cache. O mais comum.
- **Write-through:** grava no cache e no banco ao mesmo tempo.
- **Write-behind:** grava no cache e o banco é atualizado depois (rápido, risco de perda).

```java
@Cacheable(cacheNames = "produtos", key = "#id")
public ProdutoResponse buscar(Long id) { ... }

@CacheEvict(cacheNames = "produtos", key = "#id")
public void atualizar(Long id, ProdutoRequest req) { ... }
```

Políticas de remoção: **LRU** (o menos usado recentemente sai), LFU, TTL (expira após um tempo).

> **Cuidado! Cai na entrevista:** "Quais os problemas de cache?" **Invalidação** (dado velho), **cache stampede** (o item expira e mil requisições vão ao banco ao mesmo tempo: use lock ou expiração com variação aleatória) e **consistência** entre cache e banco.

### 1.4 CDN

Rede de servidores espalhados pelo mundo que guardam conteúdo estático (imagens, JS, vídeos) perto do usuário. Reduz latência e tira carga do seu servidor. Ex.: CloudFront, Cloudflare, Akamai.

### 1.5 Replicação

Cópias do banco em várias máquinas.

- **Líder-seguidor (primary-replica):** escritas no líder; leituras podem ir para as réplicas. Ótimo quando há muito mais leitura que escrita.
- Replicação **assíncrona** tem **atraso** (replication lag): você grava e, se ler logo em seguida na réplica, pode não ver. Solução comum: ler do líder logo após escrever ("read your own writes").

### 1.6 Sharding

Dividir os **dados** entre vários bancos. Cada shard guarda uma parte (ex.: usuários com ID par num, ímpar em outro).

- **Por faixa (range):** fácil, mas pode concentrar carga (hotspot).
- **Por hash:** distribui bem, mas consultas por faixa ficam difíceis.
- **Consistent hashing:** permite adicionar/remover shards movendo poucos dados.

Custo: joins e transações entre shards ficam muito difíceis. Só faça quando realmente precisar.

### 1.7 Filas

Desacoplam quem produz de quem processa e **absorvem picos**: a Black Friday enche a fila, e os workers processam no ritmo deles. Revise o Tema 2 da apostila de Sistemas Distribuídos.

### Atividades de fixação — Tema 1

1. Sua API guarda o carrinho do usuário num `HashMap` em memória. O que acontece quando você coloca um load balancer com 3 réplicas? Como corrigir?
2. Explique cache-aside com um desenho de sequência (aplicação, cache, banco) para um hit e para um miss.
3. Um produto popular tem TTL de 60 s no cache. No segundo 60, chegam 5 mil requisições. O que acontece e como evitar?
4. O usuário altera o nome do perfil, a página recarrega e mostra o nome antigo. A arquitetura tem réplicas de leitura. Explique e proponha uma correção.
5. Quando você **não** faria sharding? Cite duas alternativas antes de chegar nele.

## Tema 2 — Método para a entrevista

**Objetivo:** ter um roteiro para os 45 minutos da entrevista.

### 2.1 O roteiro

| Etapa | Tempo | O que fazer |
|---|---|---|
| 1. Requisitos | 5 min | Funcionais e não funcionais. Pergunte! |
| 2. Estimativas | 5 min | Usuários, requisições por segundo, armazenamento |
| 3. API | 5 min | Endpoints principais |
| 4. Modelo de dados | 5 min | Entidades e escolha de banco |
| 5. Alto nível | 10 min | Caixas e setas |
| 6. Aprofundar | 10 min | Gargalos, escala, falhas, trade-offs |
| 7. Resumo | 5 min | O que você faria a seguir |

### 2.2 Requisitos funcionais e não funcionais

- **Funcionais:** o que o sistema faz. "Usuário encurta uma URL", "usuário é redirecionado".
- **Não funcionais:** como ele se comporta. Latência, disponibilidade (99,9%? 99,99%?), consistência, escala, segurança.

Escolha **3 ou 4** funcionais principais e deixe o resto explicitamente "fora do escopo". Mostra foco.

### 2.3 Estimativas de capacidade

Contas de guardanapo, com números redondos. Números úteis:

| Referência | Valor |
|---|---|
| Segundos num dia | ~86.400 ≈ **10⁵** |
| 1 milhão de requisições/dia | ≈ 12 por segundo |
| 1 bilhão/dia | ≈ 12 mil por segundo |
| Pico | 2 a 5 vezes a média |
| 1 KB × 1 bilhão | 1 TB |

Exemplo: 100 milhões de URLs novas por mês, 500 bytes cada:

- Escrita: 100 M / (30 × 10⁵ s) ≈ **40 por segundo**.
- Leitura (100 leituras por escrita): ≈ **4.000 por segundo**.
- Armazenamento em 5 anos: 100 M × 12 × 5 × 500 B = **3 TB**.

Conclusão rápida: é um sistema de **muita leitura**: cache é essencial; 3 TB cabem num banco com algumas réplicas.

### 2.4 API, modelo de dados e diagrama

```
POST /urls            {"url": "https://..."}  -> 201 {"codigo": "aZ3k9"}
GET  /{codigo}        -> 301/302 Location: https://...
```

Modelo: `urls(codigo PK, url_original, criado_em, usuario_id, expira_em)`.

Diagrama de alto nível típico:

```
Cliente → CDN/DNS → Load Balancer → Serviço (N réplicas) → Cache (Redis)
                                                    ↘ Banco (líder + réplicas)
                                                    ↘ Fila → Workers (analytics)
```

### 2.5 Gargalos e trade-offs

Ao aprofundar, percorra a lista:

- **Ponto único de falha?** Tudo tem redundância?
- **Onde está o gargalo?** Banco? Escrita? Uma chave muito acessada (hot key)?
- **O que acontece se X cair?** Cache cai: o banco aguenta sozinho?
- **Consistência:** onde precisa ser forte e onde eventual basta?
- **Custo:** a solução é cara demais para o problema?

> **Cuidado! Cai na entrevista:** sempre fale em **trade-offs**: "Escolhi X porque Y; o custo disso é Z". Nunca diga que uma tecnologia é "a melhor" sem contexto. E não jogue nomes de tecnologia sem explicar por quê.

### Atividades de fixação — Tema 2

1. Liste 4 requisitos funcionais e 4 não funcionais para um sistema de ingressos para shows.
2. Estime: um app de mensagens com 50 milhões de usuários ativos por dia, cada um enviando 40 mensagens de 200 bytes. Quantas mensagens por segundo (média e pico)? Quanto armazenamento por ano?
3. Desenhe a API de um sistema de reserva de salas de reunião.
4. Para o sistema de ingressos, onde a consistência precisa ser forte e onde pode ser eventual?
5. Grave a si mesmo explicando o encurtador de URL em 10 minutos, seguindo o roteiro. Anote o que esqueceu.

## Tema 3 — Cases clássicos

**Objetivo:** praticar o método em problemas que caem com frequência.

### 3.1 Encurtador de URL

- **Gerar o código:** contador global convertido em **Base62** (`[0-9a-zA-Z]`). 7 caracteres = 62⁷ ≈ 3,5 trilhões de códigos. Para não ter um contador central gargalo, cada servidor pega **faixas** de IDs (ex.: de 1.000 em 1.000). Alternativa: hash da URL (cuidado com colisões).
- **Redirecionar:** 301 (permanente, o navegador guarda e você perde as métricas) ou 302 (temporário, toda visita passa por você e você conta cliques).
- **Leitura:** cache Redis na frente do banco; códigos populares ficam sempre quentes.
- **Analytics:** cada clique vai para uma fila, workers agregam. Não atrase o redirecionamento.

### 3.2 Rate Limiter

Requisito: no máximo 100 requisições por minuto por usuário, em vários servidores.

- Algoritmo **token bucket**: cada usuário tem um balde com até N fichas; elas são repostas a uma taxa fixa; cada requisição gasta uma.
- Estado em **Redis** (compartilhado entre servidores), atualizado de forma atômica (script Lua ou `INCR` + `EXPIRE` para janela fixa).
- Onde fica: no API Gateway ou como filtro na aplicação.
- Resposta: `429` com headers `Retry-After` e `X-RateLimit-Remaining`.
- Se o Redis cair: **fail open** (deixa passar, prioriza disponibilidade) ou **fail closed** (bloqueia, prioriza proteção). Depende do caso.

### 3.3 Feed de notícias

O desafio: montar o feed de um usuário que segue 500 pessoas, rápido.

- **Fan-out na escrita (push):** ao postar, o post é copiado para o feed (lista em cache) de cada seguidor. Leitura muito rápida. Problema: celebridade com 50 milhões de seguidores gera 50 milhões de escritas.
- **Fan-out na leitura (pull):** ao abrir o feed, busca os posts recentes de quem você segue e junta. Escrita barata, leitura cara.
- **Híbrido (o que se usa):** push para pessoas comuns, pull para celebridades, e junta na leitura.

### 3.4 Chat em tempo real

- Conexões persistentes com **WebSocket**. Cada servidor de chat segura milhares de conexões.
- Para entregar uma mensagem a quem está conectado em **outro** servidor: um registro de "qual usuário está em qual servidor" (Redis) e pub/sub entre servidores.
- Persistência das mensagens: banco orientado a escrita e consulta por conversa + tempo (ex.: Cassandra com chave `(conversa_id, timestamp)`).
- Usuário offline: guardar e enviar notificação push.
- Ordem: por conversa, com ID ordenável por tempo (ex.: Snowflake ID).
- Status "entregue/lido": confirmações (acks) do cliente.

### 3.5 Sistema de pagamentos

A prioridade aqui é **correção**, não velocidade.

- **Idempotência** em tudo (Idempotency-Key do cliente até a chamada ao banco/adquirente).
- **Ledger** (livro-razão) com **partidas dobradas**: todo movimento gera um débito e um crédito; nada é apagado, erros se corrigem com lançamentos novos. Saldo = soma dos lançamentos.
- **Máquina de estados** do pagamento: `CRIADO → AUTORIZADO → CAPTURADO → LIQUIDADO`, ou `RECUSADO`/`ESTORNADO`.
- Banco relacional com ACID para o ledger. Consistência forte.
- **Reconciliação:** jobs diários comparam seus registros com os do banco/adquirente e apontam divergências.
- Comunicação com o parceiro externo: timeout, retry com a mesma chave de idempotência e webhook para resultado assíncrono.
- No PIX: o pagamento é confirmado em segundos, então o fluxo síncrono precisa ser rápido, mas o ledger e a idempotência continuam sendo a base.

### Atividades de fixação — Tema 3

1. No encurtador, por que contador + Base62 em vez de gerar um código aleatório? E qual a desvantagem do contador?
2. Escreva em pseudocódigo um rate limiter de janela fixa com Redis (`INCR` e `EXPIRE`). Qual o problema da janela fixa na virada do minuto?
3. No feed, um usuário segue 3 celebridades e 200 pessoas comuns. Descreva passo a passo como o feed dele é montado no modelo híbrido.
4. No chat, o usuário A (no servidor 1) manda mensagem para B (no servidor 7). Descreva o caminho da mensagem.
5. Por que um sistema de pagamentos não deve simplesmente fazer `UPDATE contas SET saldo = saldo - 100`? O que o ledger resolve?

## Projeto da etapa

**Simulado.** Escolha um case que você não estudou (ex.: "Design do Uber", "Design do YouTube", "Design de um sistema de notificações") e:

1. Faça os 7 passos do roteiro em 45 minutos cronometrados.
2. Desenhe no excalidraw.com.
3. Escreva um documento de 1 página com as decisões e trade-offs.
4. Publique no GitHub (pasta `system-design/`). Repita a cada duas semanas com um case novo.

## Resumão

- Stateless + load balancer = escala horizontal fácil.
- Cache resolve leitura; cuidado com invalidação e stampede.
- Réplicas para leitura; sharding só quando não houver alternativa.
- Filas absorvem picos e desacoplam.
- Roteiro: requisitos, estimativas, API, dados, alto nível, aprofundar, resumo.
- Sempre fale em trade-offs.
- Pagamentos: idempotência, ledger de partidas dobradas, reconciliação.
