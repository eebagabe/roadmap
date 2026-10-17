# Gabarito: C para Embarcados

Abra só depois de tentar.

## Tema 1

1. Imprime **4**. `x + 10` é calculado como `int` (260), mas ao guardar em `uint8_t` o valor é reduzido módulo 256: 260 − 256 = 4.
2. ```c
   void trocar(int32_t *a, int32_t *b) {
       int32_t tmp = *a;
       *a = *b;
       *b = tmp;
   }
   ```
3. Dentro da função, `buf` é um **ponteiro** (o array "decai" ao ser passado), então `sizeof(buf)` dá o tamanho do ponteiro (4 bytes num ARM de 32 bits, 8 num PC de 64 bits), não do array. Passe o tamanho como parâmetro.
4. ```c
   /* fila.h */
   #ifndef FILA_H
   #define FILA_H
   #include <stdbool.h>
   #include <stdint.h>
   bool fila_inserir(uint8_t valor);
   bool fila_remover(uint8_t *valor);
   bool fila_vazia(void);
   #endif

   /* fila.c */
   #include "fila.h"
   #define TAM 32u
   static uint8_t dados[TAM];
   static uint8_t ini = 0, fim = 0, qtd = 0;

   bool fila_inserir(uint8_t valor) {
       if (qtd == TAM) return false;          // cheia
       dados[fim] = valor;
       fim = (uint8_t)((fim + 1u) % TAM);
       qtd++;
       return true;
   }

   bool fila_remover(uint8_t *valor) {
       if (qtd == 0u) return false;
       *valor = dados[ini];
       ini = (uint8_t)((ini + 1u) % TAM);
       qtd--;
       return true;
   }

   bool fila_vazia(void) { return qtd == 0u; }
   ```
   (Para uso com interrupção, veja o projeto da etapa: o contador `qtd` compartilhado exige cuidado.)
5. Vira `((i++) * (i++))`: `i` é incrementado duas vezes, e modificar a mesma variável duas vezes sem ponto de sequência é **comportamento indefinido**. Macros avaliam os argumentos quantas vezes aparecem; uma função `static inline` avaliaria uma vez só.

## Tema 2

1. ```c
   static inline void bit_ligar(volatile uint32_t *r, uint32_t n)   { *r |=  (1u << n); }
   static inline void bit_desligar(volatile uint32_t *r, uint32_t n){ *r &= ~(1u << n); }
   static inline void bit_inverter(volatile uint32_t *r, uint32_t n){ *r ^=  (1u << n); }
   static inline bool bit_testar(uint32_t r, uint32_t n)            { return (r & (1u << n)) != 0u; }
   ```
2. ```c
   #define PRESC_POS  4u
   #define PRESC_MASK (0x7u << PRESC_POS)          // 3 bits: 4, 5 e 6

   reg = (reg & ~PRESC_MASK) | ((5u & 0x7u) << PRESC_POS);
   uint32_t presc = (reg & PRESC_MASK) >> PRESC_POS;
   ```
3. Sem `volatile`, o compilador pode manter a variável num registrador da CPU e nunca reler a memória, então o laço principal não "vê" a mudança feita pela interrupção. Mas `volatile` não torna `contador++` atômico: o laço principal pode ler o valor, ser interrompido, a interrupção incrementar, e o laço principal gravar o valor antigo + 1, perdendo uma contagem. Solução: proteger a operação no laço principal desabilitando a interrupção (`__disable_irq()` / `__enable_irq()`, por pouquíssimo tempo) ou usar operações atômicas (`stdatomic.h`, ou as instruções LDREX/STREX no Cortex-M3 e superiores).
4. Layout: `a` (offset 0), 1 byte de enchimento, `b` (2 a 3), `c` (4), 3 bytes de enchimento, `d` (8 a 11): **12 bytes**. Reordenado `{ uint32_t d; uint16_t b; uint8_t a; uint8_t c; }`: 4 + 2 + 1 + 1 = **8 bytes**.
5. `0xF830` como `int16_t` com sinal: 0xF830 = 63536; 63536 − 65536 = **−2000** centésimos = **−20,00 °C**.
   ```c
   int16_t bruto = (int16_t)(((uint16_t)b[0] << 8) | b[1]);
   ```

## Tema 3

1. `int a;` → `.bss` (RAM). `int b = 5;` → `.data` (RAM, com o 5 guardado na flash). `const int c = 7;` → `.rodata` (flash). `static int d;` dentro de função → `.bss` (RAM; existe durante todo o programa). `int e;` local → **pilha** (ou só em registradores da CPU).
2. Flash: text + data = 32.000 bytes, cabe nos 64 KB. RAM estática: data + bss = 92.000 bytes, que é cerca de **90 KB dos 96 KB** (98.304 bytes): sobram só cerca de 6 KB para a **pilha** (e heap, se houver). Preocupa: risco real de estouro de pilha. Investigue no map file o que ocupa o `.bss` (buffers grandes?) e meça o uso máximo da pilha.
3. Porque as variáveis de `.data` precisam **viver na RAM** (podem ser alteradas), mas seus **valores iniciais** precisam estar guardados na flash (a RAM perde tudo ao desligar). `> RAM AT > FLASH` define o endereço de execução (RAM) e o endereço de carga (flash); o startup copia de um para o outro.
4. Prática. Use o linker script e o startup do pacote do fabricante (STM32CubeF4) no começo; depois tente escrever os seus.
5. Prática. No map file, procure `main` na seção `.text` para achar o endereço. Para ordenar por tamanho, também ajuda: `arm-none-eabi-nm --size-sort -S firmware.elf | tail`.

## Tema 4

1. Fragmentação da heap ao longo do tempo (a alocação pode falhar mesmo com memória total suficiente); tempo de execução imprevisível; ausência de tratamento quando a memória acaba (comportamento indefinido, travamento), além de vazamentos que só aparecem depois de dias.
2. Estados: `FECHADA`, `ABRINDO`, `ABERTA`, `FECHANDO`. Eventos: `BOTAO`, `FIM_ABERTO`, `FIM_FECHADO`, `OBSTACULO`, `TEMPO` (fechar sozinha após um tempo aberta).
   ```c
   switch (estado) {
   case FECHADA:  if (ev == BOTAO) { motor_abrir(); estado = ABRINDO; } break;
   case ABRINDO:  if (ev == FIM_ABERTO) { motor_parar(); timer_iniciar(30000); estado = ABERTA; }
                  else if (ev == BOTAO) { motor_parar(); estado = ABERTA; } break;
   case ABERTA:   if (ev == BOTAO || ev == TEMPO) { motor_fechar(); estado = FECHANDO; } break;
   case FECHANDO: if (ev == FIM_FECHADO) { motor_parar(); estado = FECHADA; }
                  else if (ev == OBSTACULO || ev == BOTAO) { motor_abrir(); estado = ABRINDO; } break;
   default:       motor_parar(); estado = ABERTA; break;   // estado inválido: para o motor
   }
   ```
   Repare na regra de segurança: obstáculo durante o fechamento **reverte** o movimento.
3. ```c
   // motor.h define a interface; nos testes, um motor_fake.c registra as chamadas
   void test_obstaculo_reverte_fechamento(void) {
       porta_iniciar(ABERTA);
       porta_processar(BOTAO);
       TEST_ASSERT_EQUAL(FECHANDO, porta_estado());
       porta_processar(OBSTACULO);
       TEST_ASSERT_EQUAL(ABRINDO, porta_estado());
       TEST_ASSERT_EQUAL(CMD_ABRIR, motor_fake_ultimo_comando());
   }
   void test_botao_abre_porta_fechada(void) { /* ... */ }
   void test_fim_de_curso_para_motor(void) { /* ... */ }
   ```
4. Quando `inicio` está perto de 2³² − 1, `inicio + 1000` **transborda** e vira um número pequeno: a condição fica verdadeira imediatamente (ou nunca, dependendo do caso). Correção: compare a **diferença**, que funciona mesmo com a volta do contador graças à aritmética sem sinal:
   ```c
   if ((uint32_t)(millis() - inicio) >= 1000u) { }
   ```
5. Prática. `watch nome_da_variavel`, `continue`; quando parar, `backtrace` mostra a função que alterou.

## Projeto da etapa

O que um avaliador olharia:

- Buffer circular sem `malloc`, com índices separados para produtor (só escreve `fim`) e consumidor (só escreve `ini`), ambos `volatile`, para funcionar entre interrupção e laço principal sem desabilitar interrupções (padrão "single producer, single consumer").
- Funções de endianness sem casts de ponteiro.
- CRC conferido contra valores conhecidos (por exemplo, exemplos da especificação Modbus).
- Testes passando no CI, compilação ARM sem avisos.
