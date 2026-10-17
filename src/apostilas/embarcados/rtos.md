# RTOS e Tempo Real: Apostila Prática

Roadmap Sistemas Embarcados · Semanas 14 a 17

## Comece por aqui

Enquanto o firmware faz duas ou três coisas, um laço principal bem organizado dá conta. Quando ele precisa ler sensores a cada 10 ms, controlar um motor a cada 1 ms, atualizar uma tela, falar com a rede e gravar logs, tudo ao mesmo tempo e **cumprindo prazos**, entra o **RTOS** (sistema operacional de tempo real). Esta apostila usa o **FreeRTOS** (o mais usado no mundo e base do ESP-IDF) e apresenta o **Zephyr**, que cresce muito na indústria.

### Por que isso vale ouro no mercado

- Muitas vagas de firmware pedem FreeRTOS ou Zephyr explicitamente.
- Perguntas clássicas: mutex vs semáforo, inversão de prioridade, o que pode ser chamado de dentro de uma interrupção, como dimensionar a pilha de uma task.
- Tempo real é o que separa um protótipo de um produto confiável (freio, marca-passo, inversor industrial).

### Como esta apostila funciona

1. Use a sua placa STM32 (o STM32CubeIDE gera projetos com FreeRTOS) ou o ESP32 com ESP-IDF, que já vem com FreeRTOS.
2. Para ver o que está acontecendo, pisque pinos no início e no fim de cada task e observe no analisador lógico.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** comportamento estranho com RTOS? Suspeite primeiro de **estouro de pilha** de alguma task, de chamar API errada dentro de interrupção e de prioridades mal definidas. Ative a verificação de estouro de pilha e o `configASSERT`.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 14 | Tema 1: Conceitos de tempo real |
| 15 | Tema 2: FreeRTOS na prática |
| 16 | Tema 3: Sincronização |
| 17 | Tema 4: Zephyr e arquitetura de firmware + projeto |

## Tema 1: Conceitos de tempo real

**Objetivo:** entender o que "tempo real" significa e como tarefas são escalonadas.

### 1.1 Super loop vs RTOS

**Super loop** (bare-metal): um laço infinito chamando funções, mais interrupções.

```c
while (1) {
    ler_sensores();
    controlar_motor();
    atualizar_display();   // se demorar 50 ms, o motor fica 50 ms sem controle
    tratar_comunicacao();
}
```

Simples, pequeno e previsível enquanto o sistema é pequeno. O problema: uma função lenta atrasa todas as outras.

**RTOS:** cada atividade vira uma **task** (tarefa) com prioridade. O **escalonador** decide quem roda; uma task mais prioritária que fica pronta **interrompe** (preempção) a menos prioritária.

| | Super loop | RTOS |
|---|---|---|
| Complexidade | Baixa | Maior (concorrência) |
| Memória | Mínima | Uma pilha por task + kernel |
| Resposta a eventos | Depende do laço | Por prioridade, previsível |
| Bom para | Sistemas simples | Várias atividades com prazos diferentes |

### 1.2 Hard e soft real-time

**Tempo real não é "rápido": é previsível.** O sistema garante cumprir prazos.

- **Hard real-time:** perder um prazo é falha grave (airbag, controle de motor, marca-passo).
- **Soft real-time:** perder um prazo ocasionalmente degrada a qualidade, mas não é catastrófico (áudio, vídeo, interface).
- **Firm:** o resultado atrasado não tem valor, mas perdas raras são toleradas (algumas leituras de sensor).

### 1.3 Deadline, jitter e latência

| Termo | Significado |
|---|---|
| **Período** | De quanto em quanto tempo a tarefa roda (ex.: 10 ms) |
| **Deadline** | Até quando ela precisa terminar |
| **Latência** | Tempo entre o evento e o início da resposta |
| **Jitter** | Variação do instante de execução de uma vez para outra |

Num controle de motor, um jitter grande prejudica o controle tanto quanto um atraso.

### 1.4 WCET

**WCET** (worst-case execution time) é o tempo de execução no **pior caso**. Para garantir prazos, o que importa é o pior caso, não a média. Medido com pinos e osciloscópio, contadores de ciclos (o DWT do Cortex-M3/M4 conta ciclos de clock) ou ferramentas de análise.

### 1.5 Escalonamento por prioridade

A maioria dos RTOS usa **escalonamento preemptivo por prioridade fixa**: a task pronta de maior prioridade sempre roda. Tasks de mesma prioridade podem revezar em fatias de tempo (*time slicing*).

### 1.6 Rate Monotonic

Regra clássica para atribuir prioridades a tarefas periódicas: **quanto menor o período, maior a prioridade**.

Teste suficiente de Liu e Layland: com **n** tarefas, se a utilização total U = Σ (Cᵢ / Tᵢ) for menor ou igual a **n × (2^(1/n) − 1)**, todos os prazos são cumpridos (com prazo igual ao período). Limites: 1 tarefa: 100%; 2 tarefas: ≈ 82,8%; 3 tarefas: ≈ 78,0%; muitas tarefas: ≈ 69,3%.

Exemplo: tarefas com (C = 1 ms, T = 4 ms), (C = 2 ms, T = 10 ms), (C = 3 ms, T = 20 ms): U = 0,25 + 0,2 + 0,15 = **0,60** ≤ 0,78: escalonável.

> **Cuidado! Cai na entrevista:** se U passar do limite, o sistema **pode** ainda ser escalonável (o teste é suficiente, não necessário); é preciso uma análise mais detalhada (tempo de resposta). Se U > 100%, com certeza não é.

### Atividades de fixação do Tema 1

1. Classifique em hard, soft ou firm: (a) controle de injeção de combustível; (b) streaming de música num fone Bluetooth; (c) leitura de temperatura ambiente a cada segundo para um gráfico; (d) controle de uma prensa industrial com sensor de mão.
2. Um laço principal tem funções que levam 2 ms, 15 ms e 3 ms. O motor precisa ser controlado a cada 5 ms. O que acontece e como resolver sem RTOS? E com RTOS?
3. Atribua prioridades por Rate Monotonic às tarefas: display (100 ms), controle (5 ms), comunicação (20 ms), log (1.000 ms).
4. Tarefas: (C = 2, T = 5), (C = 2, T = 10), (C = 3, T = 15), em ms. Calcule U e diga o que o teste de Liu e Layland conclui.
5. Por que o tempo médio de execução não serve para garantir prazos?

## Tema 2: FreeRTOS na prática

**Objetivo:** criar tasks, temporizar e trocar dados entre elas.

### 2.1 Tasks

```c
#include "FreeRTOS.h"
#include "task.h"

static void task_led(void *param) {
    (void)param;
    for (;;) {                                   // uma task nunca retorna
        led_inverter();
        vTaskDelay(pdMS_TO_TICKS(500));          // dorme 500 ms (libera a CPU)
    }
}

int main(void) {
    hardware_iniciar();
    xTaskCreate(task_led, "led", 256, NULL, 1, NULL);   // pilha em words (256 x 4 bytes no ARM)
    xTaskCreate(task_sensor, "sensor", 512, NULL, 2, NULL);
    vTaskStartScheduler();                       // não retorna se tudo estiver certo
    for (;;) { }
}
```

Parâmetros de `xTaskCreate`: função, nome, tamanho da pilha (em *words*), parâmetro, **prioridade** (número maior = mais prioritária no FreeRTOS) e handle.

### 2.2 Estados de uma task

| Estado | Significado |
|---|---|
| Running | Executando agora |
| Ready | Pronta, esperando a CPU |
| Blocked | Esperando algo: tempo, fila, semáforo |
| Suspended | Pausada explicitamente |

Uma task bem escrita passa a maior parte do tempo **bloqueada**. Uma task que nunca bloqueia (laço sem `vTaskDelay` nem espera) faz as de menor prioridade **nunca** rodarem (*starvation*).

Quando nenhuma task está pronta, roda a **idle task** (onde o microcontrolador pode dormir para economizar energia).

### 2.3 vTaskDelay e vTaskDelayUntil

```c
// vTaskDelay: espera 10 ms A PARTIR DE AGORA. O período real = 10 ms + tempo de execução (deriva).
// vTaskDelayUntil: acorda em instantes fixos, período exato. Use para tarefas periódicas.
static void task_controle(void *p) {
    TickType_t ultimo = xTaskGetTickCount();
    for (;;) {
        controlar();
        vTaskDelayUntil(&ultimo, pdMS_TO_TICKS(10));
    }
}
```

### 2.4 Filas

A forma recomendada de **trocar dados** entre tasks: a fila copia os dados, é segura para concorrência e bloqueia quem espera.

```c
#include "queue.h"

typedef struct { uint16_t id; int16_t temperatura_dC; } Leitura;
static QueueHandle_t fila_leituras;

static void task_sensor(void *p) {
    for (;;) {
        Leitura l = { .id = 1, .temperatura_dC = sensor_ler() };
        xQueueSend(fila_leituras, &l, pdMS_TO_TICKS(10));    // espera até 10 ms se a fila estiver cheia
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}

static void task_log(void *p) {
    Leitura l;
    for (;;) {
        if (xQueueReceive(fila_leituras, &l, portMAX_DELAY) == pdPASS) {   // dorme até chegar algo
            uart_printf("sensor %u: %d\r\n", l.id, l.temperatura_dC);
        }
    }
}

// no main, antes do escalonador:
fila_leituras = xQueueCreate(16, sizeof(Leitura));
```

### 2.5 Software timers

Executam uma função depois de um tempo ou periodicamente, sem criar uma task para isso (rodam no contexto da *timer task* do FreeRTOS). Bons para timeouts e ações simples. Não bloqueie dentro da função do timer.

```c
TimerHandle_t t = xTimerCreate("pisca", pdMS_TO_TICKS(250), pdTRUE, NULL, callback_pisca);
xTimerStart(t, 0);
```

### 2.6 Configuração (FreeRTOSConfig.h)

| Opção | Para quê |
|---|---|
| `configTICK_RATE_HZ` | Frequência do tick (1000 = 1 ms) |
| `configUSE_PREEMPTION` | Escalonamento preemptivo |
| `configTOTAL_HEAP_SIZE` | Memória para tasks e filas (com os esquemas heap_1 a heap_5) |
| `configCHECK_FOR_STACK_OVERFLOW` | Detecta estouro de pilha (use 2 durante o desenvolvimento) |
| `configMAX_SYSCALL_INTERRUPT_PRIORITY` | Prioridade máxima das interrupções que podem chamar a API |
| `configASSERT` | Captura erros de uso da API |

Dimensionar pilhas: comece com folga e meça com `uxTaskGetStackHighWaterMark()` (quanto da pilha **nunca** foi usado); reduza deixando margem.

> **Na prática:** o FreeRTOS também permite criar tasks e filas com **memória estática** (`xTaskCreateStatic`, `xQueueCreateStatic`), sem heap. É o preferido em sistemas críticos, alinhado com o "sem alocação dinâmica" da etapa de C.

### Atividades de fixação do Tema 2

1. Crie duas tasks que piscam LEDs em frequências diferentes. Depois tire o `vTaskDelay` de uma delas, dando a ela prioridade maior. O que acontece?
2. Mostre no analisador lógico a diferença entre `vTaskDelay(10)` e `vTaskDelayUntil(..., 10)` numa task que gasta 3 ms trabalhando.
3. Implemente o produtor e consumidor com fila do exemplo e mostre as leituras pela UART.
4. Meça o *high water mark* das suas tasks e ajuste o tamanho das pilhas.
5. Quando usar um software timer em vez de uma task?

## Tema 3: Sincronização

**Objetivo:** compartilhar recursos sem corromper dados nem travar o sistema.

### 3.1 Condição de corrida

Duas tasks (ou task e interrupção) acessam o mesmo dado e o resultado depende da ordem. Exemplo: duas tasks escrevendo na mesma UART geram mensagens embaralhadas; duas atualizando a mesma struct podem deixá-la meio a meio.

### 3.2 Seção crítica

Trecho que não pode ser interrompido. A forma mais simples no FreeRTOS:

```c
taskENTER_CRITICAL();
contador_compartilhado++;
taskEXIT_CRITICAL();
```

Desabilita interrupções (até a prioridade configurada): use só para trechos **muito curtos**, porque aumenta a latência de tudo.

### 3.3 Mutex

**Mutex** (exclusão mútua) protege um recurso: quem pega é o dono; os outros esperam bloqueados.

```c
static SemaphoreHandle_t mutex_uart;   // criado com xSemaphoreCreateMutex()

void log_seguro(const char *msg) {
    if (xSemaphoreTake(mutex_uart, pdMS_TO_TICKS(50)) == pdTRUE) {
        uart_enviar(msg);
        xSemaphoreGive(mutex_uart);
    }
}
```

### 3.4 Semáforos

- **Semáforo binário:** sinalização. Uso clássico: a interrupção "avisa" a task que há trabalho.
- **Semáforo de contagem:** conta recursos disponíveis ou eventos acumulados.

```c
static SemaphoreHandle_t sem_dado;    // xSemaphoreCreateBinary()

void USART2_IRQHandler(void) {
    BaseType_t acordou = pdFALSE;
    /* ... lê o byte e coloca num buffer ... */
    xSemaphoreGiveFromISR(sem_dado, &acordou);
    portYIELD_FROM_ISR(acordou);       // se acordou uma task mais prioritária, troca na saída da ISR
}

static void task_protocolo(void *p) {
    for (;;) {
        xSemaphoreTake(sem_dado, portMAX_DELAY);   // dorme até a interrupção avisar
        processar_buffer();
    }
}
```

**Task notifications** fazem esse papel de forma mais leve e rápida, quando há uma única task destinatária.

| | Mutex | Semáforo binário |
|---|---|---|
| Uso | Proteger recurso compartilhado | Sinalizar evento |
| Dono | Sim: só quem pegou devolve | Não: um dá, outro pega |
| Herança de prioridade | Sim | Não |
| Dentro de ISR | Não | Sim (versão FromISR) |

### 3.5 Inversão de prioridade

1. A task **Baixa** pega o mutex.
2. A task **Alta** precisa do mutex e bloqueia, esperando a Baixa.
3. A task **Média** (que não usa o mutex) fica pronta e, por ser mais prioritária que a Baixa, roda... por muito tempo.
4. Resultado: a Alta espera a Média, que nem usa o recurso.

Solução: **herança de prioridade**. Enquanto a Baixa segura o mutex que a Alta quer, ela herda a prioridade Alta e termina rápido. Os mutexes do FreeRTOS fazem isso; semáforos binários não.

> **Cuidado! Cai na entrevista:** o caso famoso é o da sonda **Mars Pathfinder** (1997), que reiniciava sozinha em Marte por inversão de prioridade; foi corrigida remotamente ativando a herança de prioridade no mutex. E a pergunta "mutex ou semáforo para proteger um recurso?" tem resposta: mutex.

### 3.6 Deadlock

Task A segura o mutex 1 e espera o 2; task B segura o 2 e espera o 1: as duas esperam para sempre. Prevenção: sempre pegar os mutexes **na mesma ordem**; usar timeouts em vez de esperar para sempre; segurar mutexes pelo menor tempo possível; evitar precisar de vários ao mesmo tempo.

### 3.7 ISR e RTOS

- Dentro de interrupções, use **só** as funções terminadas em `FromISR`.
- Interrupções que chamam a API precisam ter prioridade numericamente **maior ou igual** a `configMAX_SYSCALL_INTERRUPT_PRIORITY` no Cortex-M (ou seja, prioridade lógica menor ou igual à permitida). Errar isso é uma das causas mais comuns de travamentos aleatórios.
- Interrupções muito críticas (controle de motor) podem ficar acima desse limite, mas aí não podem chamar nada do RTOS.
- Padrão: a ISR faz o mínimo e acorda uma task (*deferred interrupt processing*).

### Atividades de fixação do Tema 3

1. Duas tasks enviam mensagens longas pela mesma UART. Mostre o problema e corrija com um mutex.
2. Implemente: a interrupção da UART recebe bytes e, ao chegar um `\n`, acorda uma task (com semáforo binário ou task notification) que processa o comando.
3. Monte o cenário de inversão de prioridade com três tasks e um semáforo binário usado como trava; meça o atraso da task Alta. Troque por mutex e meça de novo.
4. Explique por que não se pode usar `xSemaphoreTake` com espera dentro de uma interrupção.
5. Duas tasks precisam dos recursos "SPI" e "cartão SD". Escreva uma regra que evite deadlock.

## Tema 4: Zephyr e arquitetura de firmware

**Objetivo:** conhecer o Zephyr e organizar firmwares maiores.

### 4.1 Zephyr RTOS

Projeto da Linux Foundation, com suporte a centenas de placas e muitos periféricos, pilhas de rede e Bluetooth, sistema de arquivos e segurança. Adotado por fabricantes como Nordic, NXP e Intel.

```bash
west init ~/zephyrproject && cd ~/zephyrproject && west update
west build -b nucleo_f446re samples/basic/blinky
west flash
```

```c
#include <zephyr/kernel.h>
#include <zephyr/drivers/gpio.h>

static const struct gpio_dt_spec led = GPIO_DT_SPEC_GET(DT_ALIAS(led0), gpios);

int main(void) {
    gpio_pin_configure_dt(&led, GPIO_OUTPUT_ACTIVE);
    while (1) {
        gpio_pin_toggle_dt(&led);
        k_msleep(500);
    }
    return 0;
}
```

Repare: o código não diz "PA5". O pino vem do **devicetree** da placa; o mesmo código roda em outra placa sem alteração.

### 4.2 Devicetree e Kconfig no Zephyr

- **Devicetree:** descreve o **hardware** (quais periféricos, pinos, endereços). Você ajusta com arquivos *overlay* por placa.
- **Kconfig:** liga e desliga **funcionalidades de software** (`CONFIG_LOG=y`, `CONFIG_BT=y`) no arquivo `prj.conf`.

São os mesmos conceitos do Linux (você verá o devicetree de novo na próxima etapa).

### 4.3 Arquitetura em camadas

```
Aplicação           (regras do produto: máquinas de estado, lógica)
Serviços            (log, configuração, protocolo de comunicação)
Drivers de dispositivo (sensor de temperatura, display, memória)
HAL / BSP           (GPIO, I2C, SPI do chip e da placa)
Hardware
```

Cada camada só conhece a de baixo, por uma interface. Benefícios: trocar o microcontrolador sem reescrever a aplicação; testar a aplicação no PC com drivers falsos; vários desenvolvedores em paralelo.

### 4.4 Event-driven e active objects

Em vez de muitas tasks compartilhando dados com mutexes, um padrão mais seguro:

- Cada componente é um **active object**: uma task com sua **fila de eventos** e uma **máquina de estados**.
- Componentes se comunicam só enviando **eventos** (mensagens), nunca compartilhando variáveis.
- Cada evento é processado até o fim antes do próximo (*run-to-completion*).

Resultado: quase nenhum mutex, comportamento previsível e fácil de testar. Frameworks como o **QP** (Quantum Leaps) seguem esse modelo; também dá para implementar com filas do FreeRTOS ou do Zephyr.

### 4.5 Logs e tracing

- **Logs** por UART são lentos e mudam o tempo do sistema. Alternativas: buffer em RAM esvaziado por uma task de baixa prioridade; **SEGGER RTT** (log rápido pelo próprio depurador); o subsistema de log do Zephyr, com níveis e filtros.
- **Tracing:** ferramentas como **SEGGER SystemView** e **Percepio Tracealyzer** mostram numa linha do tempo qual task rodou, quando, por quanto tempo, e cada troca de contexto e uso de fila. Revelam inversões de prioridade, starvation e prazos perdidos que seriam quase impossíveis de achar com prints.

### Atividades de fixação do Tema 4

1. Rode o exemplo *blinky* do Zephyr na sua placa e depois o exemplo de shell (`samples/subsys/shell`), explorando os comandos.
2. Mude o LED usado pelo blinky criando um overlay de devicetree, sem alterar o código C.
3. Desenhe a arquitetura em camadas de um termostato inteligente (sensor, display, botões, relé do aquecedor, Wi-Fi).
4. Reescreva a estação de sensores como active objects: quais objetos, quais eventos?
5. Por que um `printf` numa task de alta prioridade pode fazer o sistema perder prazos? Como evitar?

## Projeto da etapa

**Datalogger com FreeRTOS (ou Zephyr):**

1. Task de **aquisição** periódica (vTaskDelayUntil, 100 ms) lendo sensores I2C e ADC.
2. Task de **gravação** em cartão SD (SPI, com FatFs), recebendo leituras por fila.
3. Task de **interface** (display e botões) e task de **comando** pela UART (comandos como `status`, `intervalo 500`), acordada pela interrupção.
4. Mutex para o barramento compartilhado; nenhuma variável global compartilhada sem proteção.
5. Pilhas dimensionadas com o high water mark; detecção de estouro de pilha ativa; watchdog alimentado só se todas as tasks reportarem que estão vivas.
6. Captura no analisador lógico (ou no SystemView) mostrando as tasks e os períodos.

## Resumão

- Tempo real é previsibilidade. Hard: prazo perdido é falha; soft: degrada.
- O que importa é o pior caso (WCET), o jitter e a latência.
- Rate Monotonic: menor período, maior prioridade; teste U ≤ n(2^(1/n) − 1).
- Tasks passam a maior parte do tempo bloqueadas. vTaskDelayUntil para periódicas.
- Filas para trocar dados; mutex para proteger recurso; semáforo/notificação para sinalizar.
- Herança de prioridade evita a inversão de prioridade (mutex, não semáforo).
- Dentro de ISR: só funções FromISR, prioridade correta, faça o mínimo e acorde uma task.
- Zephyr: devicetree e Kconfig. Arquitetura em camadas e active objects simplificam sistemas grandes.
