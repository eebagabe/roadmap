# Microcontroladores: Apostila Prática

Roadmap Sistemas Embarcados · Semanas 09 a 13

## Comece por aqui

Chegou a hora de programar o hardware de verdade. Um **microcontrolador** (MCU) é um computador inteiro num chip: processador, memória flash, RAM e periféricos (GPIO, timers, ADC, UART, SPI, I2C). Os exemplos usam a família **STM32** (ARM Cortex-M), muito usada na indústria, e o **ESP32** para conectividade. Os conceitos valem para qualquer fabricante (NXP, Microchip, Nordic, Raspberry Pi RP2040/RP2350, TI).

### Por que isso vale ouro no mercado

- Vagas de firmware pedem: GPIO, interrupções, timers, UART/SPI/I2C, DMA e leitura de reference manual.
- Programar por registradores pelo menos uma vez ensina o que as bibliotecas (HAL) fazem por baixo e permite depurar quando elas falham.
- Protocolos seriais aparecem em todo produto: sensores, displays, memórias, módulos de comunicação.

### Como esta apostila funciona

1. Use uma placa **Nucleo** (os exemplos usam a Nucleo-F446RE: LED no pino PA5, botão no PC13) e o **STM32CubeIDE** ou o seu Makefile da etapa anterior.
2. Tenha à mão o **reference manual** (RM0390 para o STM32F446) e o **datasheet** do chip.
3. Use o analisador lógico em todos os protocolos.

> **Regra dos 20 minutos:** periférico não funciona? Checklist: o **clock** do periférico foi habilitado no RCC? O pino está no **modo** certo (e na função alternativa certa)? A interrupção foi habilitada **no periférico e no NVIC**? Leia os registradores no depurador e compare com o que esperava.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 09 | Tema 1: Arquitetura de microcontroladores |
| 10 | Tema 2: GPIO e interrupções |
| 11 | Tema 3: Timers, PWM e ADC |
| 12 | Tema 4: Protocolos seriais |
| 13 | Tema 5: Recursos avançados + projeto |

## Tema 1: Arquitetura de microcontroladores

**Objetivo:** entender o que há dentro do chip e como ele inicia.

### 1.1 MCU vs MPU

| | Microcontrolador (MCU) | Microprocessador (MPU) |
|---|---|---|
| Memória | Flash e RAM dentro do chip (KB a poucos MB) | RAM externa (centenas de MB a GB) |
| Sistema | Bare-metal ou RTOS | Normalmente Linux |
| Consumo | Muito baixo (µA dormindo) | Maior |
| Boot | Milissegundos | Segundos |
| Exemplos | STM32, ESP32, RP2040, PIC, AVR | Raspberry Pi, i.MX, Sitara |

### 1.2 ARM Cortex-M

Família de núcleos licenciada pela ARM e usada por dezenas de fabricantes:

| Núcleo | Perfil |
|---|---|
| Cortex-M0/M0+ | Muito baixo custo e consumo |
| Cortex-M3 | Uso geral |
| Cortex-M4 | Com DSP e unidade de ponto flutuante (FPU) |
| Cortex-M7 | Alto desempenho |
| Cortex-M33/M55 | Com TrustZone (segurança), versões novas |

Itens comuns a todos: **NVIC** (controlador de interrupções), **SysTick** (timer do núcleo), modos de baixo consumo, depuração por **SWD**.

### 1.3 Flash, RAM e mapa de memória

Tudo no Cortex-M é endereço de memória (32 bits, 4 GB de espaço):

| Faixa (STM32F4) | Conteúdo |
|---|---|
| 0x0800 0000 | Flash (programa) |
| 0x2000 0000 | SRAM |
| 0x4000 0000 | Periféricos (GPIO, timers, UART...) |
| 0xE000 0000 | Periféricos do núcleo (NVIC, SysTick) |

O endereço exato de cada periférico está no **reference manual** (seção "Memory map").

### 1.4 Clock e PLL

O clock dita a velocidade de tudo. Fontes típicas:

- **HSI:** oscilador interno (16 MHz no F446), pronto ao ligar, menos preciso.
- **HSE:** cristal externo, preciso (necessário para USB e CAN confiáveis).
- **PLL:** multiplica a frequência (o F446 chega a 180 MHz).
- **LSI/LSE:** baixa frequência (32 kHz), para relógio (RTC) e watchdog.

Cada periférico tem um **clock próprio que precisa ser ligado** no RCC antes de usar. Esse é o erro número um de quem começa.

### 1.5 Tabela de vetores e boot

Lembrando da etapa de C: ao ligar, o núcleo lê da tabela de vetores o stack pointer inicial e o endereço do `Reset_Handler`. A tabela também tem os endereços de cada **rotina de interrupção** (`SysTick_Handler`, `USART2_IRQHandler`...). Pinos de **BOOT** escolhem de onde iniciar (flash do usuário ou bootloader de fábrica na ROM).

### Atividades de fixação do Tema 1

1. Para cada produto, MCU ou MPU? (a) controle de um ar-condicionado; (b) central multimídia de carro com mapas; (c) sensor de umidade de solo a bateria; (d) câmera de segurança com reconhecimento de rostos.
2. No reference manual do seu chip, encontre o endereço base de GPIOA, RCC e USART2.
3. Por que um projeto com USB precisa de cristal externo (HSE) em muitos microcontroladores?
4. Explique o que acontece entre ligar a placa e a primeira linha do `main`.
5. Qual a diferença entre o datasheet e o reference manual de um STM32?

## Tema 2: GPIO e interrupções

**Objetivo:** controlar pinos e reagir a eventos sem desperdiçar CPU.

### 2.1 GPIO por registradores

Cada pino tem modos: entrada, saída, função alternativa (UART, SPI...) e analógico. Registradores principais do STM32 (veja o reference manual):

| Registrador | Função |
|---|---|
| MODER | Modo (2 bits por pino: 00 entrada, 01 saída, 10 alternativa, 11 analógico) |
| OTYPER | Push-pull ou open-drain |
| PUPDR | Pull-up / pull-down |
| IDR | Ler entradas |
| ODR | Escrever saídas |
| BSRR | Liga ou desliga pinos de forma atômica |

Pisca-pisca sem nenhuma biblioteca de alto nível (só os nomes do header CMSIS):

```c
#include "stm32f4xx.h"

static void atraso(volatile uint32_t n) { while (n--) { } }

int main(void) {
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;            // 1. liga o clock do GPIOA
    GPIOA->MODER &= ~(3u << (5u * 2u));             // 2. limpa o modo do PA5
    GPIOA->MODER |=  (1u << (5u * 2u));             //    e coloca como saída (01)
    while (1) {
        GPIOA->ODR ^= (1u << 5);                    // 3. inverte o LED
        atraso(800000);
    }
}
```

`BSRR` liga (bits 0 a 15) ou desliga (bits 16 a 31) com uma única escrita, sem o risco do read-modify-write ser interrompido no meio: `GPIOA->BSRR = (1u << 5);` liga, `GPIOA->BSRR = (1u << (5 + 16));` desliga.

### 2.2 HAL e CubeMX

O **STM32CubeMX** (também embutido no STM32CubeIDE) configura pinos e clocks graficamente e gera código com a **HAL** (Hardware Abstraction Layer):

```c
HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
HAL_Delay(500);
```

Produtivo e portável entre chips STM32, mas mais pesado. Existe também a **LL** (Low Layer), mais próxima dos registradores. Na indústria se usa de tudo; o importante é entender o que acontece por baixo.

### 2.3 Interrupções e NVIC

Duas formas de esperar um evento:

- **Polling:** perguntar o tempo todo ("já apertou? já apertou?"). Simples, mas desperdiça CPU e pode perder eventos rápidos.
- **Interrupção:** o hardware **avisa**. A CPU para o que está fazendo, executa a rotina de interrupção (ISR) e volta.

O **NVIC** gerencia as interrupções, com **prioridades** (uma mais prioritária pode interromper outra) e habilitação individual.

### 2.4 Rotinas de interrupção (ISR)

Botão do usuário (PC13) gerando interrupção na borda de descida:

```c
static volatile uint32_t apertos = 0;

void botao_iniciar(void) {
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOCEN;                  // clock do GPIOC (PC13 já é entrada por padrão)
    RCC->APB2ENR |= RCC_APB2ENR_SYSCFGEN;                 // clock do SYSCFG
    SYSCFG->EXTICR[3] = (SYSCFG->EXTICR[3] & ~(0xFu << 4)) | (0x2u << 4);  // EXTI13 vem da porta C
    EXTI->IMR  |= (1u << 13);                             // habilita a linha 13
    EXTI->FTSR |= (1u << 13);                             // borda de descida
    NVIC_SetPriority(EXTI15_10_IRQn, 5);
    NVIC_EnableIRQ(EXTI15_10_IRQn);                       // habilita no NVIC
}

void EXTI15_10_IRQHandler(void) {
    if (EXTI->PR & (1u << 13)) {
        EXTI->PR = (1u << 13);     // limpa a flag escrevendo 1 (senão a interrupção repete sem parar)
        apertos++;
    }
}
```

Regras de ouro para ISRs:

- **Curtas e rápidas:** marque uma flag ou coloque um dado numa fila; o trabalho pesado fica no laço principal.
- Nada de `printf`, atrasos ou espera dentro da ISR.
- Variáveis compartilhadas: `volatile` e cuidado com atomicidade.
- **Sempre limpe a flag** de interrupção do periférico.

> **Cuidado! Cai na entrevista:** "O que não fazer dentro de uma interrupção?" Laços longos, atrasos, alocação de memória, chamadas bloqueantes, `printf`, e esquecer de limpar a flag. E "o que é latência de interrupção?": o tempo entre o evento e o início da ISR, que depende das prioridades e de trechos com interrupções desabilitadas.

### 2.5 Debounce

Botões mecânicos "quicam": ao apertar, o contato abre e fecha várias vezes por alguns milissegundos. Sem tratamento, um aperto conta como vários.

Soluções:

- **Hardware:** capacitor e resistor (filtro RC), ou Schmitt trigger.
- **Software:** só aceitar a mudança se o estado ficar estável por, por exemplo, 20 ms (amostrando a cada 1 ms a 5 ms com um timer).

### 2.6 SysTick

Timer de 24 bits presente em todo Cortex-M. Uso clássico: gerar uma interrupção a cada 1 ms para contar o tempo (é a base do `HAL_Delay` e do "tick" dos RTOS).

```c
static volatile uint32_t ms = 0;
void SysTick_Handler(void) { ms++; }

int main(void) {
    SysTick_Config(SystemCoreClock / 1000u);   // interrupção a cada 1 ms
    uint32_t ultimo = 0;
    while (1) {
        if ((uint32_t)(ms - ultimo) >= 500u) {  // a cada 500 ms, sem bloquear
            ultimo = ms;
            GPIOA->ODR ^= (1u << 5);
        }
    }
}
```

Esse padrão "verifica o tempo sem bloquear" permite fazer várias coisas no mesmo laço.

### Atividades de fixação do Tema 2

1. Faça o pisca-pisca por registradores na sua placa e explique cada linha.
2. Configure o PA5 como saída usando a HAL (ou CubeMX) e compare o tamanho do binário com a versão por registradores.
3. Implemente o botão por interrupção e conte os apertos. Aperte 10 vezes: quantos foram contados? Por quê?
4. Implemente um debounce por software com o SysTick e repita o teste.
5. Faça dois LEDs piscarem em frequências diferentes (300 ms e 700 ms) no mesmo laço, sem atrasos bloqueantes.

## Tema 3: Timers, PWM e ADC

**Objetivo:** medir e gerar tempos com precisão e ler sinais analógicos.

### 3.1 Timers

Um timer é um contador que incrementa a cada pulso de clock (dividido por um **prescaler**) até um valor máximo (**ARR**, auto-reload), volta a zero e pode gerar interrupção.

**Frequência de estouro = f_clock / ((PSC + 1) × (ARR + 1))**

Com 16 MHz, PSC = 15 (conta a 1 MHz) e ARR = 999: 16.000.000 / (16 × 1000) = **1 kHz** (1 interrupção por ms).

### 3.2 PWM

**PWM** (modulação por largura de pulso) liga e desliga um pino rapidamente; a fração do tempo ligado é o **duty cycle**. Controla brilho de LED, velocidade de motor DC, posição de servo, e com filtro gera tensões analógicas.

Duty = CCR / (ARR + 1).

```c
// PWM de 1 kHz no PA5 (TIM2_CH1, função alternativa AF1), clock de 16 MHz
RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;
RCC->APB1ENR |= RCC_APB1ENR_TIM2EN;
GPIOA->MODER  = (GPIOA->MODER & ~(3u << 10)) | (2u << 10);    // PA5 em função alternativa
GPIOA->AFR[0] = (GPIOA->AFR[0] & ~(0xFu << 20)) | (1u << 20); // AF1 = TIM2
TIM2->PSC   = 15;                     // 1 MHz
TIM2->ARR   = 999;                    // 1 kHz
TIM2->CCR1  = 250;                    // 25% de duty
TIM2->CCMR1 = (6u << 4) | (1u << 3);  // modo PWM 1 com preload no canal 1
TIM2->CCER |= TIM_CCER_CC1E;          // habilita a saída
TIM2->CR1  |= TIM_CR1_CEN;            // inicia
```

Mude `CCR1` e o LED muda de brilho. Confira no osciloscópio.

### 3.3 Input capture

O timer registra o valor do contador no instante de uma borda num pino. Serve para **medir** frequência, período e largura de pulso (sensor ultrassônico, encoder, sinal de rotação).

### 3.4 ADC

O **ADC** converte tensão em número. Resolução de **12 bits** = 4.096 níveis (0 a 4095).

**Tensão = valor × Vref / 4095** (com Vref = 3,3 V, cada passo é cerca de 0,8 mV).

Pontos importantes:

- **Tempo de amostragem:** fontes de alta impedância (divisores com resistores grandes) precisam de mais tempo de amostragem, ou de um capacitor na entrada.
- **Ruído:** média de várias leituras ou filtro digital.
- **Referência:** a precisão depende da tensão de referência; muitos chips têm uma referência interna para calibrar.
- Modos: conversão única, contínua, por gatilho de timer (amostragem em frequência exata), com DMA.

### 3.5 DAC

O contrário do ADC: gera uma tensão a partir de um número. Nem todo microcontrolador tem; alternativa é PWM filtrado.

### 3.6 Leitura de sensores

| Tipo de sensor | Como ler | Exemplo |
|---|---|---|
| Analógico | ADC | Potenciômetro, termistor NTC, LDR |
| Digital simples | GPIO | Sensor de presença, fim de curso |
| Pulsos | Timer (input capture, contador) | Encoder, sensor de rotação, ultrassom |
| Digital com protocolo | I2C, SPI, UART | Temperatura e umidade, acelerômetro, GPS |

### Atividades de fixação do Tema 3

1. Com clock de 16 MHz, calcule PSC e ARR para um PWM de **50 Hz** (servo motor) e o CCR para um pulso de 1,5 ms.
2. Gere o PWM do exercício 1 e controle um servo (alimentação do servo separada, GND comum).
3. O ADC de 12 bits com referência de 3,3 V leu 2482. Qual a tensão? E qual a menor variação de tensão que ele consegue distinguir?
4. Leia um potenciômetro pelo ADC e use o valor para controlar o brilho de um LED por PWM.
5. Para que serve disparar o ADC por um timer em vez de ler "quando der" no laço principal?

## Tema 4: Protocolos seriais

**Objetivo:** fazer o microcontrolador conversar com o PC, sensores e outros chips.

### 4.1 UART

Comunicação **assíncrona** (sem clock compartilhado), ponto a ponto, com dois fios: **TX** e **RX** (cruzados: TX de um no RX do outro) e GND comum.

- Os dois lados combinam a **velocidade** (baud rate: 9600, 115200...).
- Formato mais comum: **8N1** (8 bits de dados, sem paridade, 1 stop bit): cada byte usa 10 bits na linha (1 start + 8 + 1 stop).
- Na Nucleo, a USART2 (PA2/PA3) já chega ao PC pela USB do ST-LINK (porta COM virtual): ótimo para logs.

```c
void uart_enviar(const char *s) {
    while (*s) {
        while (!(USART2->SR & USART_SR_TXE)) { }   // espera o registrador de transmissão esvaziar
        USART2->DR = (uint8_t)*s++;
    }
}
```

UART é a base de RS-232 e RS-485 (que você verá nas redes industriais) e de módulos como GPS e modems.

### 4.2 SPI

Síncrona (com clock), **full duplex**, rápida (vários MHz), com um mestre e vários escravos:

| Sinal | Função |
|---|---|
| SCLK | Clock gerado pelo mestre |
| MOSI | Dados do mestre para o escravo |
| MISO | Dados do escravo para o mestre |
| CS (ou SS) | Seleciona o escravo (um pino por escravo, ativo em 0) |

Há 4 **modos** (combinações de CPOL e CPHA: polaridade do clock e borda de amostragem). O modo correto está no datasheet do dispositivo: modo errado é a causa mais comum de "lixo" no SPI. Usado em memórias flash, cartões SD, displays, conversores AD externos.

### 4.3 I2C

Síncrono, com **dois fios** (SDA e SCL, ambos open-drain com pull-up), vários dispositivos no mesmo barramento identificados por **endereço** (normalmente 7 bits). Velocidades típicas: 100 kHz e 400 kHz.

Uma leitura típica de registrador de um sensor:

```
START | endereço + W | ACK | nº do registrador | ACK | START repetido | endereço + R | ACK | dado | NACK | STOP
```

```c
// com a HAL: lê 2 bytes do registrador 0x00 de um sensor no endereço 0x48
uint8_t buf[2];
HAL_I2C_Mem_Read(&hi2c1, 0x48 << 1, 0x00, I2C_MEMADD_SIZE_8BIT, buf, 2, 100);
```

(A HAL espera o endereço já deslocado para a esquerda; confusão comum.)

### 4.4 Comparando protocolos

| | UART | SPI | I2C |
|---|---|---|---|
| Fios | 2 (+GND) | 4 (+1 CS por escravo) | 2 |
| Clock | Não | Sim | Sim |
| Velocidade | Até alguns Mbit/s | Dezenas de MHz | 100 kHz a 1 MHz (típico) |
| Dispositivos | 2 | 1 mestre, vários escravos | Vários, por endereço |
| Confirmação | Não | Não | Sim (ACK) |
| Distância | Curta (RS-485 para longa) | Curta, na placa | Curta, na placa |

### 4.5 Depurar com analisador lógico

No PulseView, adicione o decodificador do protocolo e veja os bytes. Perguntas que ele responde na hora: o dispositivo respondeu ACK? O endereço está certo? A UART está na velocidade certa (os bits têm a largura esperada)? O CS está ativo durante a transferência SPI?

> **Cuidado! Cai na entrevista:** "Seu sensor I2C não responde. O que verifica?" Alimentação e GND; pull-ups presentes; endereço correto (7 bits, deslocamento na HAL, pinos de endereço do módulo); SDA e SCL trocados; nível de tensão compatível; e um scan do barramento (testar todos os endereços e ver quem responde ACK), olhando no analisador lógico.

### Atividades de fixação do Tema 4

1. Quanto tempo leva para enviar 100 bytes por UART a 9600 baud em 8N1? E a 115200?
2. Envie mensagens de log pela USART2 para o terminal do PC (PuTTY, minicom ou o terminal do VS Code).
3. Leia um sensor I2C (por exemplo, temperatura e umidade) e mostre os valores pela UART. Capture a comunicação no analisador lógico e identifique endereço, ACKs e dados.
4. Escreva um "scanner" de I2C que lista os endereços que respondem.
5. Para cada caso, escolha UART, SPI ou I2C: (a) display colorido com atualização rápida; (b) 5 sensores lentos na mesma placa; (c) módulo GPS; (d) memória flash externa de 16 MB.

## Tema 5: Recursos avançados

**Objetivo:** conhecer os recursos que tornam o firmware eficiente e robusto.

### 5.1 DMA

O **DMA** (acesso direto à memória) copia dados entre periféricos e memória **sem a CPU**. Exemplos: o ADC enche um buffer de 1.000 amostras sozinho; a UART recebe uma mensagem inteira; o SPI envia uma imagem para o display. A CPU fica livre e só é avisada no fim (ou na metade, para usar buffer duplo).

### 5.2 Watchdog

Um timer que **reinicia o microcontrolador** se o firmware não "alimentá-lo" a tempo. Protege contra travamentos.

```c
// no laço principal, só se tudo estiver saudável:
IWDG->KR = 0xAAAA;   // "alimenta" o watchdog independente (IWDG)
```

Boas práticas: alimente num ponto que prove que o sistema todo está funcionando (não numa interrupção de timer, que continua rodando mesmo com o laço principal travado); registre o motivo do reset no boot (o RCC informa se foi watchdog, queda de energia, reset por pino) para investigar depois.

### 5.3 Modos de baixo consumo

Dispositivos a bateria passam a maior parte do tempo **dormindo**:

| Modo (STM32) | Consumo | Acorda com | Mantém |
|---|---|---|---|
| Sleep | Médio | Qualquer interrupção | Tudo |
| Stop | Baixo | Interrupções externas, RTC | RAM e registradores |
| Standby | Muito baixo | Pino de wake-up, RTC, reset | Quase nada (reinicia) |

Estratégia típica: acorda, mede, envia, dorme. Consumo médio = soma de (corrente × tempo em cada estado) / tempo total. Desligue clocks e periféricos não usados e configure pinos sem uso como analógicos.

### 5.4 Memória flash e EEPROM

Guardar configurações e calibração que sobrevivem ao desligar:

- Flash interna é apagada por **setor/página** (o apagamento coloca tudo em 1) e tem vida limitada de ciclos de apagamento (na ordem de 10 mil em muitos MCUs; veja o datasheet).
- Técnicas: **emulação de EEPROM** (escrever em sequência e só apagar quando o setor encher), CRC para detectar dados corrompidos, duas cópias para sobreviver a uma queda de energia durante a gravação.
- Alternativa: EEPROM ou FRAM externas por I2C/SPI.

### 5.5 Bootloader

Programa que roda antes da aplicação e permite **atualizar o firmware** sem gravador (por UART, USB, CAN, rede).

- Muitos MCUs têm um bootloader de fábrica na ROM (no STM32, ativado pelo pino BOOT0).
- Um bootloader próprio fica no início da flash; a aplicação, num endereço depois dele. Para saltar para a aplicação: verificar a integridade (CRC ou assinatura), apontar a tabela de vetores (VTOR) para a aplicação, carregar o stack pointer dela e pular para o `Reset_Handler` dela.
- Atualização segura: duas partições (A/B) e voltar à anterior se a nova não iniciar (você verá mais em Conectividade e Linux embarcado).

### 5.6 ESP32 e conectividade

O **ESP32** (Espressif) tem Wi-Fi e Bluetooth integrados, por isso domina projetos de IoT. Pontos principais:

- Variantes com núcleos Xtensa (ESP32, ESP32-S3) e RISC-V (ESP32-C3, C6).
- O SDK oficial **ESP-IDF** já roda sobre FreeRTOS (você verá RTOS na próxima etapa); também existe suporte a Arduino e Zephyr.
- Gerenciamento de energia, criptografia em hardware, secure boot e criptografia da flash.

```bash
idf.py create-project ola && cd ola
idf.py set-target esp32
idf.py build flash monitor
```

### Atividades de fixação do Tema 5

1. Leia 1.000 amostras do ADC com DMA disparado por timer a 10 kHz e calcule a média quando o buffer encher.
2. Configure o watchdog para 1 segundo. Simule um travamento (laço infinito ao apertar o botão) e mostre pela UART, após o reset, que o motivo foi o watchdog.
3. Um sensor fica 59 s dormindo a 5 µA e 1 s ativo a 20 mA. Qual a corrente média? Quanto dura uma bateria de 2.000 mAh (desconsiderando outras perdas)?
4. Por que gravar a mesma posição da flash a cada segundo é má ideia? Proponha uma solução.
5. Liste os passos que um bootloader precisa fazer antes de saltar para a aplicação.

## Projeto da etapa

**Estação de sensores robusta:**

1. Leitura de um sensor I2C (temperatura/umidade) e de um potenciômetro pelo ADC com DMA.
2. Display (I2C ou SPI) mostrando os valores; LED com brilho por PWM conforme a temperatura.
3. Botão com interrupção e debounce para trocar de tela.
4. Logs pela UART; configuração (limites de alarme) salva na flash com CRC.
5. Watchdog ativo e motivo do último reset mostrado no boot.
6. Nada de atrasos bloqueantes: tudo baseado no tick de 1 ms.
7. README com esquemático, fotos e capturas do analisador lógico.

## Resumão

- MCU: tudo num chip, bare-metal ou RTOS. Tudo é endereço de memória.
- Primeiro passo de qualquer periférico: ligar o clock no RCC.
- GPIO: MODER, IDR, ODR, BSRR. HAL é produtiva; registradores ensinam.
- Interrupções: NVIC, prioridades, ISRs curtas, sempre limpar a flag.
- Debounce em todo botão. SysTick para contar tempo sem bloquear.
- Timer: f = clock / ((PSC + 1)(ARR + 1)). PWM: duty = CCR / (ARR + 1).
- ADC de 12 bits: V = valor × Vref / 4095.
- UART (2 fios, assíncrono), SPI (rápido, 4 fios, modos), I2C (2 fios, endereços, pull-ups).
- DMA libera a CPU; watchdog reinicia travamentos; baixo consumo para bateria; bootloader para atualizar.
