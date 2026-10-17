# Gabarito: Microcontroladores

Abra só depois de tentar.

## Tema 1

1. (a) **MCU**; (b) **MPU** (tela gráfica, mapas, muito software: Linux, Android Automotive ou QNX); (c) **MCU** (consumo baixíssimo); (d) **MPU** (ou um MCU de alto desempenho com acelerador de IA, para modelos pequenos; reconhecimento de rostos completo costuma exigir MPU).
2. STM32F446: **GPIOA 0x4002 0000**, **RCC 0x4002 3800**, **USART2 0x4000 4400**. Confira no capítulo "Memory map" do RM0390 (ou do manual do seu chip).
3. O USB exige um clock com tolerância muito pequena. O oscilador interno (HSI) varia com temperatura e de chip para chip mais do que o USB tolera; um cristal externo dá a precisão necessária (alguns chips têm recursos para sincronizar um oscilador interno com o próprio USB, dispensando o cristal).
4. O núcleo lê o endereço 0 (mapeado para a flash): carrega o **stack pointer** inicial e o endereço do **Reset_Handler**; o Reset_Handler copia `.data` da flash para a RAM, zera `.bss`, chama `SystemInit` (configura clock e, em alguns casos, a FPU e o VTOR) e chama `main`.
5. O **datasheet** descreve o chip específico: pinos, encapsulamento, características elétricas, quais periféricos ele tem. O **reference manual** descreve como cada periférico da família funciona por dentro e todos os seus registradores. Para programar, você usa principalmente o reference manual; para projetar a placa, o datasheet.

## Tema 2

1. Prática. Explicação esperada: liga o clock do GPIOA; configura os 2 bits de modo do PA5 como saída; inverte o bit 5 do ODR em laço com atraso.
2. Prática. A versão com HAL costuma gerar um binário bem maior (alguns KB a mais) por causa da inicialização genérica, das verificações e do `HAL_Init`/`SystemClock_Config`. Compare com `arm-none-eabi-size`.
3. É comum contar **mais de 10** (às vezes bem mais), por causa do **bounce** mecânico: cada aperto gera várias bordas de descida em poucos milissegundos, e cada uma dispara a interrupção.
4. ```c
   // chamado a cada 1 ms pelo SysTick (ou por um timer)
   static uint8_t estavel = 1, contagem = 0;
   void debounce_tick(void) {
       uint8_t agora = (GPIOC->IDR & (1u << 13)) ? 1u : 0u;
       if (agora != estavel) {
           if (++contagem >= 20u) {          // 20 ms estável no novo valor
               estavel = agora;
               contagem = 0;
               if (estavel == 0u) apertos++; // aperto confirmado (ativo em 0)
           }
       } else {
           contagem = 0;
       }
   }
   ```
5. ```c
   uint32_t t1 = 0, t2 = 0;
   while (1) {
       if ((uint32_t)(ms - t1) >= 300u) { t1 = ms; led1_inverter(); }
       if ((uint32_t)(ms - t2) >= 700u) { t2 = ms; led2_inverter(); }
   }
   ```

## Tema 3

1. PSC = 15 (16 MHz / 16 = 1 MHz, tick de 1 µs). Período de 50 Hz = 20 ms = 20.000 ticks: **ARR = 19.999**. Pulso de 1,5 ms = 1.500 ticks: **CCR = 1.500**. (Registrador de 32 bits no TIM2; em timers de 16 bits, 19.999 também cabe, pois o máximo é 65.535.)
2. Prática. Servos costumam aceitar pulsos de cerca de 1 ms a 2 ms (confira o do seu); alimente o servo por uma fonte própria de 5 V, porque o pico de corrente dele pode derrubar a placa.
3. V = 2482 × 3,3 / 4095 ≈ **2,00 V**. Resolução: 3,3 / 4095 ≈ **0,81 mV** por passo (o ruído real costuma ser maior que isso).
4. ```c
   uint32_t leitura = adc_ler();                  // 0 a 4095
   TIM2->CCR1 = (leitura * (TIM2->ARR + 1u)) / 4096u;
   ```
5. Para ter amostras em **intervalos exatos** (frequência de amostragem fixa), que é exigência para filtros digitais, medição de frequência, áudio e controle. No laço principal, o intervalo varia conforme o que mais o programa está fazendo (jitter).

## Tema 4

1. 100 bytes × 10 bits = 1.000 bits. A 9600 baud: 1.000 / 9.600 ≈ **104 ms**. A 115200: ≈ **8,7 ms**.
2. Prática. Configure USART2 em 115200 8N1 (PA2 TX, PA3 RX, AF7) e abra a porta COM do ST-LINK no PC com a mesma velocidade.
3. Prática. No analisador lógico, a sequência esperada é: START, endereço com bit de escrita, ACK, registrador, ACK, START repetido, endereço com bit de leitura, ACK, bytes de dados, NACK no último, STOP.
4. ```c
   for (uint8_t end = 1; end < 128; end++) {
       if (HAL_I2C_IsDeviceReady(&hi2c1, (uint16_t)(end << 1), 1, 10) == HAL_OK) {
           printf("Encontrado: 0x%02X\r\n", end);
       }
   }
   ```
5. (a) **SPI** (velocidade); (b) **I2C** (vários dispositivos com 2 fios); (c) **UART** (padrão dos módulos GPS); (d) **SPI** (memórias flash grandes são SPI, inclusive em modos Quad-SPI).

## Tema 5

1. Prática. Configure o ADC com gatilho externo do TIM (frequência de 10 kHz), DMA em modo normal ou circular para um buffer de 1.000 posições, e calcule a média na interrupção de transferência completa (ou num flag tratado no laço principal).
2. Prática. No boot, verifique a flag de reset do watchdog independente no registrador de status do RCC (no F4, `RCC->CSR` com o bit `IWDGRSTF`), imprima o motivo e limpe as flags (`RMVF`).
3. Corrente média = (59 × 0,005 mA + 1 × 20 mA) / 60 = (0,295 + 20) / 60 ≈ **0,338 mA**. Duração ≈ 2.000 / 0,338 ≈ **5.900 horas ≈ 246 dias**. Repare: quase todo o consumo vem do segundo ativo; reduzir o tempo ativo é o que mais ajuda.
4. Uma gravação por segundo gasta os ciclos de apagamento em poucas horas (com cerca de 10 mil ciclos, em menos de 3 horas, se cada gravação exigir apagar). Soluções: gravar só quando o valor mudar; guardar em RAM e gravar periodicamente ou ao detectar queda de energia; emulação de EEPROM com escrita sequencial (nivelamento de desgaste); memória externa com mais ciclos (FRAM).
5. Inicializar o mínimo de hardware; decidir se fica no bootloader (pedido de atualização, botão, aplicação inválida); verificar a integridade e, idealmente, a assinatura da aplicação; desabilitar interrupções e periféricos usados pelo bootloader; apontar o **VTOR** para a tabela de vetores da aplicação; carregar o **stack pointer** inicial da aplicação; saltar para o **Reset_Handler** da aplicação.

## Projeto da etapa

O que um avaliador olharia:

- Nenhum atraso bloqueante no laço principal.
- ISRs curtas, com flags limpas e variáveis compartilhadas tratadas corretamente.
- Configuração na flash com CRC e comportamento seguro se estiver corrompida (volta aos padrões).
- Motivo do reset registrado; watchdog alimentado num ponto que prova a saúde do sistema.
- Capturas do analisador lógico no README.
