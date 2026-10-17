# C para Embarcados: Apostila Prática

Roadmap Sistemas Embarcados · Semanas 05 a 08

## Comece por aqui

C é a língua dos microcontroladores. Quase todo firmware do mundo (do controle remoto ao freio ABS) é escrito em C, às vezes em C++. Aqui o C é usado **perto do hardware**: manipulando bits de registradores, sem sistema operacional, com pouca memória e sem espaço para erros. Rust e C++ moderno também crescem na área, mas os conceitos desta apostila valem para qualquer linguagem de sistemas.

### Por que isso vale ouro no mercado

- Entrevistas de firmware perguntam: `volatile`, ponteiros, operações bit a bit, `static`, tamanho de structs, por que evitar `malloc`.
- Saber o que o compilador e o linker fazem é o que permite entender um travamento no boot ou um "HardFault".
- Normas como MISRA C são exigidas em setores críticos (automotivo, médico, aviação, ferroviário).

### Como esta apostila funciona

1. Os Temas 1 e 2 rodam no seu computador (gcc no Linux/WSL ou no Compiler Explorer, godbolt.org).
2. O Tema 3 já compila para ARM; você precisa da toolchain `arm-none-eabi-gcc`.
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Regra dos 20 minutos:** comportamento estranho em C? Compile com `-Wall -Wextra` e leia **todos** os avisos. Depois rode com `-fsanitize=address,undefined` no PC. A maioria dos bugs aparece ali.

### Preparando o ambiente

```bash
sudo apt install build-essential gcc-arm-none-eabi gdb-multiarch openocd cmake
gcc --version
arm-none-eabi-gcc --version
```

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 05 | Tema 1: C essencial |
| 06 | Tema 2: C de baixo nível |
| 07 | Tema 3: Toolchain e build |
| 08 | Tema 4: Código confiável + projeto |

## Tema 1: C essencial

**Objetivo:** dominar a linguagem com os cuidados que o mundo embarcado exige.

### 1.1 Tipos e stdint.h

O tamanho de `int` muda de plataforma para plataforma (16 bits em alguns microcontroladores de 8 bits, 32 bits em ARM). Em embarcados, use tipos de **tamanho fixo**:

```c
#include <stdint.h>
#include <stdbool.h>

uint8_t  contador;      // 0 a 255
int16_t  temperatura;   // -32768 a 32767
uint32_t registrador;   // 32 bits sem sinal
bool     ligado;
```

Promoção de inteiros (pegadinha clássica):

```c
uint8_t a = 200, b = 100;
uint8_t soma = a + b;        // 300 não cabe: soma vira 44 (300 - 256)
if (a + b > 255) { }         // verdadeiro: a conta é feita em int antes de guardar
```

Prefira `unsigned` para bits e registradores; cuidado ao misturar com sinal (`-1 > 1u` é verdadeiro, porque o -1 vira um unsigned enorme).

### 1.2 Ponteiros

Um ponteiro guarda um **endereço** de memória.

```c
int16_t valor = 10;
int16_t *p = &valor;   // p aponta para valor
*p = 20;               // altera valor através do ponteiro

void zerar(int16_t *destino) { *destino = 0; }   // função que altera a variável de quem chamou
zerar(&valor);
```

Em embarcados, ponteiros são usados para acessar registradores (Tema 2), buffers, callbacks e tabelas. Erros com ponteiros (nulo, solto, fora do buffer) não dão exceção: corrompem memória em silêncio ou geram um **HardFault**.

### 1.3 Arrays e strings

```c
uint8_t buffer[64];
size_t tamanho = sizeof(buffer) / sizeof(buffer[0]);   // 64

char nome[16];
snprintf(nome, sizeof(nome), "Sensor %u", 3);   // nunca estoura o buffer
```

- Array passado para função vira ponteiro: dentro da função, `sizeof` não dá mais o tamanho. Passe o tamanho junto.
- Strings em C terminam com `'\0'`. Evite `strcpy` e `sprintf`; use `snprintf` e verifique tamanhos.
- Em C não há verificação de limites: escrever em `buffer[64]` corrompe a variável vizinha.

### 1.4 Structs e unions

```c
typedef struct {
    uint16_t id;
    int16_t  temperatura_dC;   // décimos de grau: 253 = 25,3 °C
    uint8_t  status;
} Leitura;

Leitura l = { .id = 7, .temperatura_dC = 253, .status = 0 };
```

Uma **union** guarda campos diferentes no **mesmo** espaço de memória. Útil para ver os mesmos bytes de formas diferentes (com cuidado de portabilidade):

```c
typedef union {
    uint32_t palavra;
    uint8_t  bytes[4];
} Quatro;
```

### 1.5 Enums

```c
typedef enum {
    ESTADO_PARADO,
    ESTADO_ACELERANDO,
    ESTADO_CRUZEIRO,
    ESTADO_FALHA
} Estado;
```

Muito melhor que números mágicos. Base das máquinas de estado (Tema 4).

### 1.6 Funções, escopo e static

`static` tem dois significados importantes:

```c
// arquivo sensor.c
static uint16_t ultima_leitura;        // fora de função: visível só neste arquivo ("privado")

static void calibrar(void) { }         // função privada do módulo

uint16_t contar_chamadas(void) {
    static uint16_t chamadas = 0;      // dentro de função: mantém o valor entre chamadas
    return ++chamadas;
}
```

Organize o firmware em **módulos**: `sensor.h` (interface pública) e `sensor.c` (implementação, com o resto `static`).

### 1.7 Pré-processador

```c
#ifndef SENSOR_H            // include guard: evita incluir duas vezes
#define SENSOR_H
#include <stdint.h>
uint16_t sensor_ler(void);
#endif

#define QUADRADO(x) ((x) * (x))   // sempre parênteses em volta dos parâmetros e do todo
#define TAM_BUFFER 64u

#if defined(DEBUG)
#define LOG(msg) uart_escrever(msg)
#else
#define LOG(msg) ((void)0)
#endif
```

Sem os parênteses, `QUADRADO(a + 1)` viraria `a + 1 * a + 1`. Prefira funções `static inline` e constantes `const`/`enum` quando possível; macros não têm tipo nem escopo.

### Atividades de fixação do Tema 1

1. O que imprime e por quê? `uint8_t x = 250; x += 10; printf("%u\n", x);`
2. Escreva `void trocar(int32_t *a, int32_t *b)` que troca dois valores.
3. Esta função tem um bug. Qual? `size_t tamanho(uint8_t buf[]) { return sizeof(buf); }`
4. Crie um módulo `fila.h`/`fila.c` com um buffer circular de `uint8_t` (tamanho fixo 32), com `fila_inserir`, `fila_remover` e `fila_vazia`, escondendo os dados com `static`.
5. Qual o resultado de `QUADRADO(i++)` com a macro acima? Por que isso é perigoso?

## Tema 2: C de baixo nível

**Objetivo:** manipular bits, acessar registradores e entender como os dados ficam na memória.

### 2.1 Operações bit a bit

```c
reg |=  (1u << 5);     // liga o bit 5
reg &= ~(1u << 5);     // desliga o bit 5
reg ^=  (1u << 5);     // inverte o bit 5
if (reg & (1u << 5)) { }   // testa o bit 5
```

Use `1u` (unsigned): `1 << 31` com `int` com sinal é comportamento indefinido.

### 2.2 Máscaras e campos de bits

Registradores agrupam campos de vários bits. Exemplo: um campo de 2 bits nas posições 10 e 11.

```c
#define MODO_POS   10u
#define MODO_MASK  (0x3u << MODO_POS)

reg = (reg & ~MODO_MASK) | ((valor & 0x3u) << MODO_POS);   // escreve só o campo
uint32_t modo = (reg & MODO_MASK) >> MODO_POS;              // lê só o campo
```

Esse padrão "lê, limpa o campo, escreve o novo valor" (read-modify-write) aparece em todo firmware.

C tem **bit-fields** em structs (`unsigned modo : 2;`), mas a ordem dos bits depende do compilador: evite para mapear registradores.

### 2.3 volatile

`volatile` diz ao compilador: **este valor pode mudar sem o código saber; leia e escreva na memória toda vez**.

Use em:

- Registradores de hardware.
- Variáveis compartilhadas entre uma interrupção e o código principal.

```c
static volatile bool botao_apertado = false;

void EXTI15_10_IRQHandler(void) {   // interrupção
    botao_apertado = true;
}

int main(void) {
    while (!botao_apertado) { }     // sem volatile, o compilador pode "otimizar" para um laço infinito
}
```

> **Cuidado! Cai na entrevista:** `volatile` **não** torna operações atômicas nem resolve condições de corrida. `contador++` numa variável volatile ainda é ler, somar e escrever: se uma interrupção alterar no meio, perde-se uma contagem. Para isso, desabilite interrupções na seção crítica ou use operações atômicas.

### 2.4 const

```c
const uint16_t tabela_seno[256] = { /* ... */ };   // em microcontroladores, costuma ficar na flash, não na RAM
void enviar(const uint8_t *dados, size_t n);       // promete não alterar os dados
```

Ponteiros e `const` (leia da direita para a esquerda):

| Declaração | Significa |
|---|---|
| `const uint8_t *p` | Ponteiro para dado constante (não altera o dado) |
| `uint8_t *const p` | Ponteiro constante (não muda para onde aponta) |
| `const volatile uint32_t *p` | Registrador só de leitura que muda sozinho (ex.: status) |

### 2.5 Registradores mapeados em memória

Os periféricos do microcontrolador aparecem como **endereços de memória**. Escrever num endereço liga um pino; ler outro endereço dá o valor do ADC.

```c
// Endereço do registrador ODR (saída) do GPIOA no STM32F4 (do reference manual)
#define GPIOA_ODR (*(volatile uint32_t *)0x40020014u)

GPIOA_ODR |= (1u << 5);   // acende o LED no pino PA5
```

Na prática, os fabricantes fornecem headers (padrão **CMSIS**) com structs sobrepostas aos periféricos:

```c
typedef struct {
    volatile uint32_t MODER;    // offset 0x00
    volatile uint32_t OTYPER;   // 0x04
    volatile uint32_t OSPEEDR;  // 0x08
    volatile uint32_t PUPDR;    // 0x0C
    volatile uint32_t IDR;      // 0x10
    volatile uint32_t ODR;      // 0x14
    volatile uint32_t BSRR;     // 0x18
} GPIO_TypeDef;

#define GPIOA ((GPIO_TypeDef *)0x40020000u)

GPIOA->ODR ^= (1u << 5);
```

### 2.6 Endianness

Como um número de vários bytes é guardado:

| | 0x12345678 na memória (endereços crescentes) |
|---|---|
| **Little-endian** (ARM Cortex-M, x86) | 78 56 34 12 |
| **Big-endian** ("ordem de rede") | 12 34 56 78 |

Ao montar ou ler mensagens de protocolos e arquivos, **não** faça cast de ponteiro de bytes para `uint32_t`: use deslocamentos, que funcionam em qualquer plataforma.

```c
uint32_t ler_be32(const uint8_t *b) {
    return ((uint32_t)b[0] << 24) | ((uint32_t)b[1] << 16) | ((uint32_t)b[2] << 8) | b[3];
}
```

### 2.7 Alinhamento e padding

O compilador insere bytes de **enchimento** para alinhar campos (num ARM de 32 bits, um `uint32_t` costuma ficar em endereço múltiplo de 4).

```c
typedef struct { uint8_t a; uint32_t b; uint8_t c; } Ruim;   // sizeof = 12
typedef struct { uint32_t b; uint8_t a; uint8_t c; } Bom;    // sizeof = 8
```

Ordene campos do maior para o menor para economizar RAM. `__attribute__((packed))` remove o enchimento, mas acessos desalinhados podem ser lentos ou causar falhas em alguns processadores: use com cuidado (para mensagens, prefira serializar campo a campo).

### Atividades de fixação do Tema 2

1. Escreva macros ou funções `inline` para ligar, desligar, inverter e testar o bit `n` de um registrador de 32 bits.
2. Num registrador, os bits 4 a 6 são o campo "prescaler". Escreva o código que grava o valor 5 nesse campo sem alterar os outros bits, e o código que lê o campo.
3. Explique por que a variável compartilhada com a interrupção precisa de `volatile` e por que só isso não basta para um contador incrementado nos dois lados.
4. Qual o `sizeof` de `struct { uint8_t a; uint16_t b; uint8_t c; uint32_t d; }` num ARM de 32 bits? Reordene para o menor tamanho.
5. Um sensor envia a temperatura em 2 bytes, big-endian, com sinal, em centésimos de grau: `0xF8 0x30`. Qual a temperatura?

## Tema 3: Toolchain e build

**Objetivo:** entender o caminho do código C até o binário gravado na flash.

### 3.1 Compilação cruzada

Você compila no PC (x86) para rodar em outra arquitetura (ARM). O compilador que faz isso é o **cross-compiler** `arm-none-eabi-gcc` ("none" = sem sistema operacional; "eabi" = convenção de chamadas embarcada).

```bash
arm-none-eabi-gcc -mcpu=cortex-m4 -mthumb -mfloat-abi=hard -mfpu=fpv4-sp-d16 \
  -O2 -g -Wall -Wextra -ffunction-sections -fdata-sections \
  -c main.c -o main.o
```

### 3.2 Etapas e seções

Pré-processamento → compilação → montagem (assembler) → **linkagem**. O linker junta os `.o` e decide onde cada coisa fica na memória. As **seções** principais:

| Seção | Conteúdo | Onde fica |
|---|---|---|
| `.text` | Código | Flash |
| `.rodata` | Constantes (`const`) | Flash |
| `.data` | Variáveis globais **com** valor inicial | RAM (valor inicial guardado na flash e copiado no boot) |
| `.bss` | Variáveis globais **sem** valor inicial (ou zero) | RAM (zerada no boot) |
| Stack e heap | Pilha e memória dinâmica | RAM |

### 3.3 Linker script

Diz ao linker o tamanho e o endereço das memórias, e onde pôr cada seção.

```ld
MEMORY
{
  FLASH (rx)  : ORIGIN = 0x08000000, LENGTH = 512K
  RAM   (rwx) : ORIGIN = 0x20000000, LENGTH = 128K
}

SECTIONS
{
  .isr_vector : { KEEP(*(.isr_vector)) } > FLASH
  .text       : { *(.text*) *(.rodata*) } > FLASH
  _sidata = LOADADDR(.data);
  .data       : { _sdata = .; *(.data*) _edata = .; } > RAM AT > FLASH
  .bss        : { _sbss = .; *(.bss*) *(COMMON) _ebss = .; } > RAM
  _estack = ORIGIN(RAM) + LENGTH(RAM);
}
```

### 3.4 Código de startup

Antes do `main`, alguém precisa preparar o terreno. Num Cortex-M:

1. Ao ligar, o processador lê a **tabela de vetores** no início da flash: a primeira palavra é o valor inicial do **stack pointer**; a segunda é o endereço do **Reset_Handler**.
2. O `Reset_Handler` copia `.data` da flash para a RAM e zera `.bss`.
3. Configura o clock (`SystemInit`) e chama o `main`.

```c
extern uint32_t _sidata, _sdata, _edata, _sbss, _ebss;
int main(void);

void Reset_Handler(void) {
    uint32_t *src = &_sidata, *dst = &_sdata;
    while (dst < &_edata) *dst++ = *src++;      // copia .data
    for (dst = &_sbss; dst < &_ebss; ) *dst++ = 0;   // zera .bss
    main();
    while (1) { }
}
```

Os fabricantes fornecem esse arquivo pronto (`startup_stm32f446xx.s`), mas entender o que ele faz é fundamental para depurar problemas de boot.

### 3.5 Map file e tamanho

```bash
arm-none-eabi-gcc ... -Wl,-Map=firmware.map -Wl,--gc-sections -T stm32f446.ld *.o -o firmware.elf
arm-none-eabi-size firmware.elf
#    text    data     bss     dec     hex filename
#    5432     108    2056    7596    1dac firmware.elf
arm-none-eabi-objcopy -O binary firmware.elf firmware.bin
```

- Flash usada = `text + data`. RAM estática = `data + bss`.
- O **map file** mostra cada função e variável com endereço e tamanho: é onde você descobre o que está ocupando a memória.
- `--gc-sections` (com `-ffunction-sections -fdata-sections`) remove código não usado.

### 3.6 Makefile e CMake

```make
CC      = arm-none-eabi-gcc
CFLAGS  = -mcpu=cortex-m4 -mthumb -O2 -g -Wall -Wextra -ffunction-sections -fdata-sections
LDFLAGS = -T stm32f446.ld -Wl,--gc-sections -Wl,-Map=firmware.map --specs=nano.specs --specs=nosys.specs
SRC     = main.c startup.c
OBJ     = $(SRC:.c=.o)

firmware.elf: $(OBJ)
	$(CC) $(CFLAGS) $(OBJ) $(LDFLAGS) -o $@
	arm-none-eabi-size $@

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

flash: firmware.elf
	openocd -f board/st_nucleo_f4.cfg -c "program firmware.elf verify reset exit"

clean:
	rm -f *.o firmware.elf firmware.map
```

Projetos maiores usam **CMake** com um *toolchain file* que aponta para o cross-compiler. Ferramentas dos fabricantes (STM32CubeIDE, ESP-IDF, MCUXpresso) geram tudo isso por baixo; vale saber fazer na mão pelo menos uma vez.

### Atividades de fixação do Tema 3

1. Em que seção (e em que memória) fica cada variável? `int a;` (global), `int b = 5;` (global), `const int c = 7;` (global), `static int d;` (dentro de função), `int e;` (local).
2. Seu firmware tem `text 30000, data 2000, bss 90000`. A placa tem 64 KB de flash e 96 KB de RAM. Cabe? O que preocupa?
3. Por que a seção `.data` aparece "duas vezes" no linker script (`> RAM AT > FLASH`)?
4. Compile um "pisca LED" para a sua placa com Makefile próprio (pode usar o startup e o linker script do fabricante), grave com OpenOCD e confira o tamanho.
5. Abra o map file e encontre: o endereço do `main`, a maior função e a maior variável.

## Tema 4: Código confiável

**Objetivo:** escrever firmware previsível, testável e fácil de depurar.

### 4.1 Memória estática vs dinâmica

Em firmware crítico, evita-se `malloc`/`free`:

- **Fragmentação:** depois de horas alocando e liberando, pode não haver um bloco contínuo livre, mesmo com memória sobrando.
- **Não determinismo:** o tempo de alocação varia.
- **Falha silenciosa:** sem sistema operacional, ninguém avisa que acabou a memória.

Alternativas: tudo alocado estaticamente (tamanho conhecido na compilação), **pools** de blocos de tamanho fixo, ou alocar só na inicialização e nunca liberar.

Também monitore a **pilha**: recursão e arrays locais grandes estouram a stack, que não tem proteção por padrão. Técnica comum: preencher a stack com um padrão (0xDEADBEEF) no boot e verificar até onde ele foi sobrescrito (*stack painting*).

### 4.2 MISRA C

Conjunto de regras (da indústria automotiva, hoje usado em todos os setores críticos) que restringe partes perigosas ou ambíguas do C. Exemplos do espírito das regras:

- Sem alocação dinâmica de memória da biblioteca padrão.
- Todo `switch` com `default`; todo `if ... else if` termina com `else`.
- Sem conversões implícitas perigosas entre tipos (com e sem sinal, de tamanhos diferentes).
- Evitar recursão.
- Sem `goto` para trás; funções com um ponto de saída (recomendado).
- Usar tipos de tamanho fixo.

Ferramentas de análise estática (comerciais, ou o cppcheck com addon MISRA) verificam as regras automaticamente. Mesmo fora de setores críticos, seguir o espírito do MISRA melhora muito o código.

### 4.3 Máquinas de estado

A forma mais clara de organizar comportamento em firmware:

```c
typedef enum { VERDE, AMARELO, VERMELHO } Sinal;
typedef enum { EV_TEMPO, EV_BOTAO } Evento;

static Sinal estado = VERMELHO;

void semaforo_processar(Evento ev) {
    switch (estado) {
    case VERDE:
        if (ev == EV_BOTAO || ev == EV_TEMPO) { estado = AMARELO; timer_iniciar(3000); }
        break;
    case AMARELO:
        if (ev == EV_TEMPO) { estado = VERMELHO; timer_iniciar(10000); }
        break;
    case VERMELHO:
        if (ev == EV_TEMPO) { estado = VERDE; timer_iniciar(20000); }
        break;
    default:
        estado = VERMELHO;   // estado inválido: volta ao seguro
        break;
    }
    leds_mostrar(estado);
}
```

Desenhe o diagrama antes de codar. Estados explícitos evitam o "espaguete de flags".

### 4.4 Testes unitários em C

A lógica do firmware (máquinas de estado, cálculos, protocolos) pode e deve ser testada **no PC**, sem placa. Para isso, separe a lógica do acesso ao hardware (uma camada de abstração, HAL) e substitua o hardware por versões falsas nos testes.

```c
// teste com o framework Unity
#include "unity.h"
#include "conversao.h"

void test_converte_adc_para_milivolts(void) {
    TEST_ASSERT_EQUAL_UINT32(0,    adc_para_mv(0));
    TEST_ASSERT_EQUAL_UINT32(3300, adc_para_mv(4095));
    TEST_ASSERT_EQUAL_UINT32(1650, adc_para_mv(2048));   // arredondado
}
```

Ferramentas: **Unity** + **CMock** (com o **Ceedling** organizando tudo), GoogleTest (para C++), e o próprio CTest do CMake.

### 4.5 Depuração com GDB

As placas Nucleo têm um depurador ST-LINK embutido. Com OpenOCD como "ponte":

```bash
openocd -f board/st_nucleo_f4.cfg                 # terminal 1
gdb-multiarch firmware.elf                        # terminal 2
(gdb) target extended-remote :3333
(gdb) monitor reset halt
(gdb) load
(gdb) break main
(gdb) continue
(gdb) next / step                 # próxima linha / entra na função
(gdb) print leitura               # mostra variável
(gdb) watch contador              # para quando a variável mudar
(gdb) x/4xw 0x40020000            # examina 4 palavras de memória (registradores do GPIOA)
(gdb) backtrace                   # pilha de chamadas
```

Quando o firmware cai num **HardFault**, os registradores salvos na pilha (PC, LR) mostram onde ocorreu o problema. IDEs como STM32CubeIDE e VS Code (extensão Cortex-Debug) fazem tudo isso com interface gráfica.

### 4.6 Análise estática

- Compile sempre com `-Wall -Wextra` (e `-Werror` no CI).
- **cppcheck** e **clang-tidy** acham erros que o compilador não acha (ponteiro nulo, vazamento, índice fora do array).
- Teste a lógica no PC com sanitizers (`-fsanitize=address,undefined`).

> **Cuidado! Cai na entrevista:** "Seu firmware trava depois de algumas horas. Como investiga?" Possíveis respostas: verificar estouro de pilha (stack painting, ou proteção com MPU), uso de memória dinâmica, condição de corrida com interrupção, watchdog e registro do motivo do reset, contadores que transbordam (ex.: `uint32_t` de milissegundos dá a volta em cerca de 49,7 dias), e reproduzir com logs e depurador.

### Atividades de fixação do Tema 4

1. Liste 3 motivos para evitar `malloc` num firmware que roda anos sem reiniciar.
2. Desenhe e implemente a máquina de estados de uma porta automática de garagem (fechada, abrindo, aberta, fechando), com eventos do botão, dos sensores de fim de curso e de obstáculo.
3. Separe a máquina de estados do exercício 2 do hardware e escreva 3 testes unitários com Unity que rodam no PC.
4. Explique o bug: `uint32_t agora = millis(); if (agora >= inicio + 1000) { }`, considerando o valor perto do limite de 32 bits. Como corrigir?
5. Use o GDB para colocar um watchpoint numa variável global e descobrir qual função a altera.

## Projeto da etapa

**Biblioteca de utilidades para firmware, testada no PC:**

1. Buffer circular genérico (tamanho fixo, sem `malloc`), seguro para um produtor numa interrupção e um consumidor no laço principal.
2. Funções de leitura e escrita de inteiros big-endian e little-endian a partir de bytes.
3. Cálculo de CRC-16 (por exemplo, o usado no Modbus) e checksum simples.
4. Uma máquina de estados de debounce de botão.
5. Testes com Unity (ou Ceedling), `-Wall -Wextra -Werror`, cppcheck sem avisos e CI no GitHub Actions compilando para o PC e para ARM (`arm-none-eabi-gcc`).

Você vai reaproveitar essa biblioteca nas próximas etapas.

## Resumão

- Tipos de tamanho fixo (`stdint.h`); cuidado com promoção de inteiros e mistura de sinais.
- Ponteiros acessam registradores; erros com eles corrompem memória em silêncio.
- `static` = privado no arquivo ou persistente na função. Módulos com `.h` público e `.c` privado.
- Bits: `|=` liga, `&= ~` desliga, `^=` inverte, `&` testa. Campos com máscara e deslocamento.
- `volatile` para registradores e variáveis de interrupção; não garante atomicidade.
- Endianness: serialize com deslocamentos. Ordene structs do maior para o menor.
- Flash: `.text`, `.rodata`, valores de `.data`. RAM: `.data`, `.bss`, stack, heap.
- Startup copia `.data`, zera `.bss` e chama `main`.
- Firmware confiável: sem `malloc`, MISRA, máquinas de estado, testes no PC, GDB, análise estática.
