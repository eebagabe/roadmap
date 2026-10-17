# Gabarito — System Design

Abra só depois de tentar. Em System Design, respostas diferentes podem estar certas se forem bem justificadas.

## Tema 1

1. Cada requisição pode cair numa réplica diferente. O usuário adiciona um item na réplica 1 e, na próxima requisição (réplica 2), o carrinho aparece vazio. Correções: guardar o carrinho num **armazenamento compartilhado** (Redis ou banco) e deixar a aplicação stateless. "Sticky sessions" no load balancer funcionam como remendo, mas perdem os dados se a réplica cair e atrapalham o balanceamento.
2. Hit: aplicação → cache (`GET produto:42`) → encontrou → devolve. Miss: aplicação → cache → não encontrou → aplicação → banco → resultado → aplicação grava no cache com TTL (`SET produto:42 ... EX 60`) → devolve.
3. **Cache stampede**: as 5 mil requisições encontram o cache vazio e vão todas ao banco ao mesmo tempo, podendo derrubá-lo. Soluções: só uma requisição recalcula enquanto as outras esperam ou recebem o valor antigo (lock/"single flight"); TTL com variação aleatória; renovar o cache **antes** de expirar para itens quentes.
4. A escrita foi no líder; a leitura logo depois foi numa réplica que ainda não recebeu a alteração (**replication lag**). Correção: ler do líder por alguns segundos após o usuário escrever (read-your-writes), ou ler do líder dados do próprio usuário, ou atualizar a tela com a resposta da própria escrita.
5. Não faria sharding enquanto o banco aguentar com alternativas mais simples, porque sharding complica joins, transações e operação. Antes: **índices e otimização de queries**, **cache**, **réplicas de leitura**, **escala vertical**, **particionamento de tabela** dentro do mesmo banco e **arquivar dados antigos**.

## Tema 2

1. Funcionais: listar shows; escolher assento; reservar temporariamente (ex.: 10 minutos); pagar e emitir ingresso. Não funcionais: nunca vender o mesmo assento duas vezes (consistência forte); aguentar picos enormes na abertura das vendas; alta disponibilidade; latência baixa na escolha do assento; proteção contra bots.
2. Mensagens/dia: 50 M × 40 = 2 bilhões. Por segundo: 2 × 10⁹ / 10⁵ ≈ **20 mil/s em média**; pico de 2 a 5 vezes, **40 mil a 100 mil/s**. Armazenamento: 2 × 10⁹ × 200 B = 400 GB/dia; × 365 ≈ **146 TB/ano** (sem contar índices e réplicas, que podem multiplicar por 3 ou mais).
3. ```
   GET    /salas?inicio=...&fim=...            -> salas livres no intervalo
   POST   /reservas  {salaId, inicio, fim}     -> 201 | 409 se já ocupada
   GET    /reservas?usuarioId=...              -> minhas reservas
   DELETE /reservas/{id}                       -> 204
   ```
4. Forte: reserva e venda de assentos, pagamento. Eventual: catálogo de shows, contagem de "ingressos restantes" mostrada na vitrine, recomendações, avaliações.
5. Resposta pessoal. Esquecimentos comuns: não fazer estimativas, não falar de redirecionamento 301 vs 302, não discutir como gerar códigos únicos sem colisão entre servidores.

## Tema 3

1. Contador + Base62 garante **unicidade sem precisar checar colisão** e gera códigos curtos. Desvantagens: os códigos ficam **previsíveis** (dá para enumerar URLs de outras pessoas) e o contador pode virar gargalo/ponto único de falha. Mitigações: faixas de IDs por servidor; embaralhar o ID com uma permutação reversível antes do Base62.
2. ```
   chave = "rl:" + usuarioId + ":" + minutoAtual
   n = REDIS.INCR(chave)
   se n == 1: REDIS.EXPIRE(chave, 60)
   se n > 100: responder 429
   senão: deixar passar
   ```
   Problema: na virada do minuto o usuário pode fazer 100 requisições no fim de um minuto e mais 100 no início do seguinte, ou seja, 200 em poucos segundos. Janela deslizante ou token bucket suavizam isso. (Detalhe: `INCR` e `EXPIRE` separados podem deixar uma chave sem expiração se o processo cair no meio; um script Lua resolve.)
3. Quando as 200 pessoas comuns postam, os posts são empurrados para a lista de feed do usuário no cache (fan-out na escrita). Ao abrir o app: (1) lê a lista pré-montada do cache; (2) busca os posts recentes das 3 celebridades (pull); (3) junta e ordena (por tempo ou ranking); (4) pagina e devolve.
4. A está conectado por WebSocket no servidor 1 e envia a mensagem. O servidor 1 grava a mensagem no banco (para não perder) com um ID ordenável e confirma o envio para A. Consulta no Redis onde B está conectado: servidor 7. Publica a mensagem no canal do servidor 7 (pub/sub). O servidor 7 entrega pelo WebSocket de B. B confirma (ack) e o status vira "entregue". Se B estivesse offline, a mensagem ficaria guardada e seria enviada uma notificação push.
5. Um `UPDATE` direto não deixa histórico (de onde veio e para onde foi o dinheiro), é difícil de auditar e de reconciliar, e erros sobrescrevem o valor anterior sem rastro. O ledger de partidas dobradas registra **cada movimento como lançamentos imutáveis** (débito numa conta, crédito em outra, somando zero). O saldo é derivado da soma; dá para auditar tudo, reconstruir o saldo em qualquer data e corrigir erros com lançamentos de estorno.

## Projeto da etapa

Critérios para avaliar seu simulado:

- Definiu escopo e deixou coisas fora explicitamente.
- Fez estimativas e usou os números para tomar decisões (não só para enfeitar).
- O diagrama não tem ponto único de falha sem justificativa.
- Cada tecnologia citada veio com um "porque".
- Discutiu pelo menos 3 trade-offs.
