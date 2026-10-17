# Gabarito — Sistemas Distribuídos

Abra só depois de tentar.

## Tema 1

1. Possibilidades: a requisição não chegou (nada reservado); chegou e reservou, mas a resposta se perdeu (reservado sem você saber); está lento e ainda vai reservar. Como você não sabe qual, a saída segura é **repetir com a mesma chave de idempotência** (ex.: `reservaId` gerado por você). Se já foi reservado, o estoque devolve a mesma resposta sem reservar de novo. Se após algumas tentativas continuar falhando, marque o pedido como pendente e reconcilie depois, ou libere com uma compensação.
2. (a) **CP**: vender o mesmo assento duas vezes é pior que recusar; (b) **AP**: um número levemente desatualizado não faz mal; (c) **AP**: catálogo desatualizado por segundos é aceitável e precisa estar sempre no ar; (d) **CP**, em geral: deixar ultrapassar o limite é prejuízo (na prática os emissores têm regras de tolerância, mas o raciocínio esperado é CP).
3. Idempotentes: (a), (c) e (e). Não idempotentes: (b), cada execução soma mais 10; (d), cada execução manda outro e-mail. Sobre (c): o efeito no servidor é o mesmo, mesmo que a segunda chamada devolva 404.
4. O serviço lento já está no limite. Se cada cliente, ao receber timeout, tenta de novo imediatamente, a carga **multiplica** (cada requisição original vira 2, 3, 4) exatamente quando o serviço menos aguenta. Ele sai de "lento" para "fora do ar". Backoff espaça as tentativas e jitter evita que todos tentem no mesmo instante.
5. Exemplo: tabela `emails_enviados(usuario_id, tipo)` com `UNIQUE(usuario_id, tipo)`. Antes de enviar, insira a linha; se der violação de unicidade, alguém já enviou e você para. Envie depois do insert. Se o envio falhar, apague a linha (ou marque como pendente) para permitir nova tentativa. Ainda há uma janela pequena de duplicidade se o processo morrer entre o envio e a confirmação; por isso muitos provedores de e-mail aceitam uma chave de idempotência própria.

## Tema 2

1. (a) Síncrono: o usuário está esperando a informação; (b) assíncrono: não precisa acontecer no mesmo instante e não deve atrasar a compra; (c) síncrono: o usuário precisa do resultado para continuar o formulário; (d) assíncrono: eventos de venda alimentando o painel (streaming).
2. Use o **ID do pedido como chave** da mensagem. Mesma chave cai na mesma partição, e a ordem dentro da partição é garantida. Do lado do produtor, configure `enable.idempotence=true` (padrão nas versões recentes) para retries não embaralharem a ordem.
3. Ficam **ociosos**. Cada partição é atribuída a no máximo um consumidor do grupo, então 6 partições aproveitam no máximo 6 consumidores. Os 2 extras servem de reserva: se um consumidor cair, eles assumem no rebalanceamento.
4. Escrita dupla é gravar em dois sistemas diferentes (banco e Kafka) sem uma transação que cubra os dois: um pode dar certo e o outro não, deixando tudo inconsistente. O Outbox transforma as duas escritas em **uma só**, no banco: o pedido e o evento são gravados na mesma transação. Publicar no Kafka vira uma tarefa separada, que pode ser repetida até dar certo (por isso o consumidor precisa ser idempotente: o evento pode ser publicado mais de uma vez).
5. O consumidor, ao voltar, lê as 10 mensagens. O Kafka guardou o offset do grupo e as mensagens continuam no log (dentro do período de retenção). Isso é diferente de uma fila tradicional sem consumidores conectados e mostra por que o Kafka é bom para desacoplar serviços.

## Tema 3

1. Opinião esperada: **não recomendado**. Com 4 pessoas, 12 serviços significam 12 pipelines, 12 deploys, monitoramento distribuído, comunicação pela rede e consistência eventual, tudo sem ganho real, porque não há times diferentes se atrapalhando nem necessidade de escala independente. Melhor começar com um monolito modular, com fronteiras claras entre módulos, e extrair serviços quando houver motivo concreto.
2. **Fechado** → (taxa de falhas passa do limite numa janela de chamadas) → **Aberto** → (passa o tempo de espera configurado) → **Meio-aberto** → (chamadas de teste dão certo) → **Fechado**; ou (chamadas de teste falham) → **Aberto** de novo.
3. Passos: reservar voo → reservar hotel → reservar carro → confirmar. Compensações: cancelar carro, cancelar hotel, cancelar voo. Se o carro falhar, executa "cancelar hotel" e "cancelar voo", nessa ordem (inversa). As compensações também precisam ser idempotentes, porque podem ser repetidas.
4. Retry repete uma chamada que falhou, esperando que a falha seja temporária. Circuit breaker para de chamar quando as falhas são frequentes, para não insistir num serviço doente. Juntos: o **retry fica dentro** e o **circuit breaker fora**, de modo que cada chamada pode ter algumas tentativas, mas, se o conjunto continuar falhando, o circuito abre e corta tudo. (No Resilience4j com anotações, a ordem padrão de aplicação já é Retry envolvendo CircuitBreaker; confira a documentação ao combinar.)
5. Com tracing, a requisição de checkout tem um `traceId`. A visualização em cascata (Jaeger, Tempo) mostra cada span: gateway 5 ms, pedidos 20 ms, estoque 30 ms, **frete 2.400 ms**. Abrindo o span do frete, dá para ver que ele chama uma transportadora externa sem timeout. Sem tracing, seria preciso procurar nos logs de todos os serviços e comparar horários.

## Projeto da etapa

Pontos de avaliação:

- O pedido e o evento da outbox são gravados na mesma transação.
- Derrubar o Kafka por alguns minutos não perde nenhum pedido: a outbox acumula e publica quando ele volta.
- Reenviar manualmente a mesma mensagem não reserva estoque duas vezes.
- Pagamento recusado gera a compensação no estoque e o pedido termina como `CANCELADO`.
- Um único `traceId` aparece nos logs dos três serviços.
