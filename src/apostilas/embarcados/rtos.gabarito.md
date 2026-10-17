# Gabarito: RTOS e Tempo Real

Abra só depois de tentar.

## Tema 1

1. (a) **Hard**; (b) **soft** (um atraso gera um "clique", não um desastre); (c) **firm** ou soft (uma leitura atrasada não tem valor, mas perder uma é tolerável); (d) **hard** (segurança de pessoas).
2. O laço completo leva 20 ms, então o motor é controlado a cada 20 ms em vez de 5 ms: controle ruim. Sem RTOS: colocar o controle numa **interrupção de timer** de 5 ms (se for rápido), ou quebrar a função de 15 ms em pedaços menores (máquina de estados que faz um pouco por vez). Com RTOS: task de controle com prioridade alta e período de 5 ms (vTaskDelayUntil), e as funções lentas em tasks de prioridade mais baixa, que são interrompidas quando o controle precisa rodar.
3. Controle (5 ms) > comunicação (20 ms) > display (100 ms) > log (1.000 ms).
4. U = 2/5 + 2/10 + 3/15 = 0,4 + 0,2 + 0,2 = **0,80**. O limite para 3 tarefas é ≈ **0,780**. Como 0,80 > 0,78, o teste **não garante**, mas também não prova que falha (o teste é só suficiente). É preciso a análise de tempo de resposta. Fazendo-a: tarefa 1 responde em 2 ms (≤ 5); tarefa 2: R = 2 + ⌈R/5⌉×2 → R = 4 (≤ 10); tarefa 3: R = 3 + ⌈R/5⌉×2 + ⌈R/10⌉×2 → começando com 3: 3+2+2 = 7; 3+⌈7/5⌉×2+⌈7/10⌉×2 = 3+4+2 = 9; 3+⌈9/5⌉×2+⌈9/10⌉×2 = 9: R = 9 ≤ 15. **Escalonável.**
5. Porque o prazo precisa ser cumprido **sempre**, inclusive na execução mais lenta (cache, ramificações diferentes, interrupções no meio). Se a média é 2 ms mas o pior caso é 8 ms, um prazo de 5 ms será perdido de vez em quando, exatamente nos momentos mais difíceis.

## Tema 2

1. A task sem `vTaskDelay` nunca bloqueia: como tem prioridade maior, ela ocupa a CPU o tempo todo e a outra task **nunca roda** (o LED dela para). É *starvation*.
2. Com `vTaskDelay(10)` o período fica em cerca de **13 ms** (3 ms de trabalho + 10 ms dormindo) e varia; com `vTaskDelayUntil` fica em **10 ms** exatos, porque o tempo de trabalho é descontado.
3. Prática. Use o exemplo da seção 2.4; crie a fila antes de `vTaskStartScheduler()`.
4. Prática. `UBaseType_t livre = uxTaskGetStackHighWaterMark(NULL);` dentro da própria task (em words). Se sobram, por exemplo, 300 de 512 words, dá para reduzir mantendo uma margem (por exemplo, 20% a 30%), e sempre testando os caminhos mais pesados (printf com float, tratamento de erros).
5. Para ações curtas e periódicas ou de timeout que não bloqueiam (piscar um LED, verificar um timeout de comunicação, desligar uma luz após 30 s). Economiza memória (não precisa de pilha própria). Se a ação for longa ou precisar bloquear, use uma task.

## Tema 3

1. ```c
   static SemaphoreHandle_t mutex_uart;
   // main: mutex_uart = xSemaphoreCreateMutex();
   void log_seguro(const char *msg) {
       xSemaphoreTake(mutex_uart, portMAX_DELAY);
       uart_enviar(msg);
       xSemaphoreGive(mutex_uart);
   }
   ```
   Sem o mutex, aparecem trechos das duas mensagens misturados na mesma linha.
2. ```c
   static TaskHandle_t h_cmd;
   static char linha[64];
   static volatile size_t pos = 0;

   void USART2_IRQHandler(void) {
       BaseType_t acordou = pdFALSE;
       if (USART2->SR & USART_SR_RXNE) {
           char c = (char)USART2->DR;
           if (c == '\n') {
               linha[pos] = '\0';
               vTaskNotifyGiveFromISR(h_cmd, &acordou);
           } else if (pos < sizeof(linha) - 1u) {
               linha[pos++] = c;
           }
       }
       portYIELD_FROM_ISR(acordou);
   }

   static void task_comando(void *p) {
       for (;;) {
           ulTaskNotifyTake(pdTRUE, portMAX_DELAY);
           tratar_comando(linha);   // em produção, copie a linha e zere pos com cuidado
           pos = 0;
       }
   }
   ```
   (Uma versão mais robusta usa um buffer circular entre a ISR e a task, para não perder bytes enquanto a linha é processada.)
3. Prática. Com o semáforo binário, o atraso da Alta cresce com o tempo de execução da Média; com o mutex (herança de prioridade), o atraso fica limitado ao tempo que a Baixa segura o recurso.
4. Uma interrupção não é uma task: ela não pode **bloquear** (não há para onde "dormir"; o escalonador não troca de contexto no meio de uma ISR esperando um recurso). Bloquear ali travaria tudo. Por isso existem as versões `FromISR`, que nunca bloqueiam e apenas informam se uma task foi acordada.
5. Regra de ordem global: "quem precisar dos dois sempre pega primeiro o mutex do SPI e depois o do cartão SD, e libera na ordem inversa". Melhor ainda: uma única task "dona" do SPI e do cartão, que recebe pedidos por fila, eliminando os mutexes.

## Tema 4

1. Prática. No shell do Zephyr, explore `kernel threads`, `kernel uptime` e `device list`.
2. ```dts
   / {
       aliases {
           led0 = &meu_led;
       };
       leds {
           compatible = "gpio-leds";
           meu_led: led_ext {
               gpios = <&gpiob 0 GPIO_ACTIVE_HIGH>;
           };
       };
   };
   ```
   Salvo como `boards/nucleo_f446re.overlay` no projeto. O código continua usando `DT_ALIAS(led0)`.
3. **Aplicação:** máquina de estados do termostato (modo, setpoint, histerese, agendamento). **Serviços:** configuração persistente, comunicação com a nuvem (MQTT), log. **Drivers:** sensor de temperatura, display, botões, relé. **HAL/BSP:** I2C, GPIO, SPI, Wi-Fi do chip. A aplicação não sabe qual sensor nem qual chip: só chama `temperatura_ler()` e `aquecedor_ligar()`.
4. Exemplo: **Aquisição** (eventos: TICK_100MS; publica LEITURA_PRONTA), **Armazenamento** (recebe LEITURA_PRONTA; publica ERRO_SD), **Interface** (recebe LEITURA_PRONTA, BOTAO_APERTADO, ERRO_SD), **Comandos** (recebe LINHA_RECEBIDA; publica MUDAR_INTERVALO para a Aquisição). Cada um com sua fila e máquina de estados; nenhum compartilha variáveis.
5. O `printf` pela UART é **lento** (a 115200 baud, uma linha de 50 caracteres leva cerca de 4 ms) e pode usar muita pilha e até alocar memória. Numa task de alta prioridade, isso a mantém ocupada e atrasa outras, ou atrasa a própria task além do prazo. Evite: colocar a mensagem numa fila e deixar uma task de log de **baixa prioridade** enviar; usar RTT; ou logs binários compactos.

## Projeto da etapa

O que um avaliador olharia:

- Aquisição com período exato (medido) mesmo com o cartão SD lento.
- Comunicação entre tasks por filas; mutex só onde há recurso compartilhado.
- ISR da UART curta, acordando a task de comando.
- High water mark de cada task documentado; detecção de estouro de pilha ativa.
- Watchdog que só é alimentado quando todas as tasks deram sinal de vida.
