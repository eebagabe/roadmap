# Fundamentos de Eletrônica: Apostila Prática

Roadmap Sistemas Embarcados · Semanas 01 a 04

## Comece por aqui

Em embarcados, o código controla coisas físicas: LEDs, motores, sensores, relés. Se você não entende o circuito, não sabe se o problema está no software ou no hardware, e pode queimar uma placa (ou se machucar). Esta apostila dá a eletrônica que um desenvolvedor de firmware precisa no dia a dia. Não é um curso de engenharia elétrica: é o suficiente para ler um esquemático, montar circuitos simples com segurança e usar os instrumentos de bancada.

### Por que isso vale ouro no mercado

- Vagas de firmware pedem "leitura de esquemáticos e datasheets" quase sempre.
- Metade dos bugs de embarcados é de hardware: resistor de pull-up faltando, nível de tensão errado, fonte fraca, mau contato.
- Quem sabe usar osciloscópio e analisador lógico resolve em minutos o que outros levam dias "chutando" no código.

### Como esta apostila funciona

1. Leia a teoria e monte os circuitos na protoboard (ou no simulador).
2. Meça tudo com o multímetro: prever o valor e depois conferir é o melhor treino.
3. Faça as atividades antes de abrir o gabarito.

> **Regra dos 20 minutos:** circuito não funciona? Desligue, confira cada ligação contra o esquema (uma por uma), meça a alimentação e só depois desconfie dos componentes.

### Kit recomendado para o roadmap inteiro

| Item | Para quê | Observação |
|---|---|---|
| Placa STM32 Nucleo (ex.: Nucleo-F446RE) | Microcontrolador principal | Tem gravador e depurador embutidos |
| ESP32 DevKit | Wi-Fi, Bluetooth e IoT | Barato e muito usado |
| Raspberry Pi (4 ou 5) | Linux embarcado | Pode ficar para a etapa de Linux |
| Protoboard, jumpers, resistores, LEDs, botões | Montagens | Kits prontos de "eletrônica básica" servem |
| Multímetro | Medir tensão, corrente, resistência | Essencial desde o primeiro dia |
| Analisador lógico 8 canais (clone USB) | Ver sinais digitais e protocolos | Funciona com o software gratuito PulseView |
| Sensores (temperatura I2C, potenciômetro), display OLED I2C | Projetos | Baratos |
| Transceivers CAN (ex.: SN65HVD230) e conversor RS-485 | Etapa de redes | Para depois |

Sem placa ainda? Use simuladores: **Falstad** (circuitos analógicos, no navegador), **Tinkercad Circuits** e **Wokwi** (simula ESP32, Raspberry Pi Pico, Arduino e parte dos STM32).

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 01 | Tema 1: Eletricidade básica |
| 02 | Tema 2: Componentes eletrônicos |
| 03 | Tema 3: Eletrônica digital |
| 04 | Tema 4: Instrumentação e documentação + projeto |

## Tema 1: Eletricidade básica

**Objetivo:** entender tensão, corrente e resistência e calcular circuitos simples.

### 1.1 Tensão, corrente e resistência

| Grandeza | Símbolo | Unidade | O que é |
|---|---|---|---|
| Tensão | V (ou U) | volt (V) | A "pressão" que empurra as cargas; sempre medida **entre dois pontos** |
| Corrente | I | ampère (A) | Quantidade de carga passando por segundo |
| Resistência | R | ohm (Ω) | Oposição à passagem da corrente |

> **Analogia:** pense numa caixa d'água. A tensão é a altura da caixa (pressão), a corrente é a vazão de água no cano, e a resistência é o quanto o cano é estreito. Mais pressão ou cano mais largo: mais vazão.

Em eletrônica usamos muito os submúltiplos: 1 mA = 0,001 A, 1 kΩ = 1.000 Ω, 1 µF = 0,000001 F.

### 1.2 Lei de Ohm

**V = R × I**. Saber duas grandezas dá a terceira.

Exemplo: um resistor de 1 kΩ ligado em 5 V conduz I = 5 / 1000 = **5 mA**.

### 1.3 Potência

**P = V × I** (e também P = R × I² = V² / R). Potência vira calor. Todo componente tem potência máxima: um resistor comum de 1/4 W dissipando 0,5 W esquenta até queimar.

### 1.4 Circuitos série e paralelo

- **Série:** a mesma corrente passa por todos; as tensões se somam. Resistência total: R = R1 + R2 + ...
- **Paralelo:** todos têm a mesma tensão; as correntes se somam. Para dois resistores: R = (R1 × R2) / (R1 + R2).

Exemplos: 100 Ω + 220 Ω em série = 320 Ω. Dois de 100 Ω em paralelo = 50 Ω.

### 1.5 Divisor de tensão

Dois resistores em série dividem a tensão:

```
Vin ──[R1]──┬──[R2]── GND
            │
           Vout = Vin × R2 / (R1 + R2)
```

Uso típico: ler uma tensão maior que o microcontrolador aguenta. Para medir uma bateria de 12 V com uma entrada de 3,3 V: R1 = 27 kΩ e R2 = 10 kΩ dão 12 × 10 / 37 ≈ **3,24 V**.

> **Cuidado! Cai na entrevista:** o divisor só funciona bem se a carga ligada em Vout puxar pouca corrente (alta impedância, como uma entrada de ADC). Não use divisor de tensão para alimentar um circuito.

### 1.6 Multímetro

| Medir | Como ligar | Cuidado |
|---|---|---|
| Tensão | Em **paralelo** com o que se mede | Escolha DC ou AC corretamente |
| Corrente | Em **série** (abrindo o circuito) | Mude a ponta vermelha para o borne de corrente; nunca meça corrente direto numa fonte (é um curto) |
| Resistência | Componente **desenergizado** | Fora do circuito, para não medir os vizinhos |
| Continuidade | Desenergizado | Ótimo para achar fio partido ou curto |

### 1.7 Segurança elétrica

> **Atenção:** a tomada (127 V ou 220 V em corrente alternada) pode matar. Nos projetos deste roadmap, trabalhe só com baixa tensão (até 24 V) vinda de fontes prontas, USB ou baterias. Baterias de lítio podem pegar fogo se forem perfuradas, curto-circuitadas ou carregadas sem circuito de proteção. Use sempre carregador próprio e nunca deixe carregando sem supervisão.

Hábitos: desligue antes de mexer no circuito; confira a polaridade antes de ligar; use fonte com limite de corrente (Tema 4).

### Atividades de fixação do Tema 1

1. Um LED vermelho cai 2 V e deve conduzir 10 mA, alimentado por 5 V. Calcule o resistor em série, escolha um valor comercial e calcule a corrente e a potência no resistor com esse valor.
2. Calcule a resistência equivalente: (a) 1 kΩ em série com 2,2 kΩ; (b) 1 kΩ em paralelo com 1 kΩ; (c) 330 Ω em série com (1 kΩ em paralelo com 1 kΩ).
3. Projete um divisor para ler 0 a 5 V numa entrada de 0 a 3,3 V. Que valores usaria?
4. Um resistor de 100 Ω e 1/4 W é ligado direto em 12 V. O que acontece? Mostre a conta.
5. Explique por que medir corrente com o multímetro ligado em paralelo com a fonte é perigoso.

## Tema 2: Componentes eletrônicos

**Objetivo:** reconhecer os componentes mais comuns e saber para que cada um serve.

### 2.1 Resistores

Limitam corrente, dividem tensão, fazem pull-up. Valores seguem séries padronizadas (E12: 10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82 e múltiplos). O código de cores indica o valor; na dúvida, meça com o multímetro. Atenção à **tolerância** (1% ou 5%) e à **potência**.

### 2.2 Capacitores

Armazenam carga e "seguram" a tensão. Usos principais em embarcados:

- **Desacoplamento:** um capacitor de 100 nF perto de cada pino de alimentação de um chip, para filtrar ruídos rápidos. Esquecer isso causa travamentos misteriosos.
- **Filtro de fonte:** eletrolíticos de dezenas a centenas de µF.
- **Temporização:** com um resistor, forma uma constante de tempo **τ = R × C** (10 kΩ × 100 µF = 1 s).

Eletrolíticos têm **polaridade**: ligados ao contrário podem estourar.

### 2.3 Indutores

Armazenam energia em campo magnético e se opõem a mudanças bruscas de corrente. Aparecem em fontes chaveadas e filtros. Bobinas de motores e relés também são indutores, e isso importa (veja diodo de roda livre).

### 2.4 Diodos e LEDs

O diodo deixa a corrente passar num só sentido. Queda típica de 0,7 V (silício) ou 0,3 V (Schottky).

- **Proteção contra inversão de polaridade.**
- **Diodo de roda livre (flyback):** em paralelo com a bobina de relé ou motor, invertido. Quando a bobina é desligada, ela gera um pico de tensão que queimaria o transistor; o diodo dá um caminho para essa energia.

O **LED** é um diodo que emite luz. Sempre precisa de resistor (ou fonte de corrente) para limitar a corrente.

### 2.5 Transistores BJT

O BJT (bipolar) funciona como chave ou amplificador. Uma corrente pequena na **base** controla uma corrente maior entre **coletor** e **emissor**. Como chave (NPN no lado do GND):

```
 +5 V ── carga ──┐
                 C
pino MCU ─[1 kΩ]─B   NPN (ex.: BC547)
                 E
                 │
                GND
```

### 2.6 MOSFETs

Controlados por **tensão** no gate, quase sem corrente. São a escolha comum para chavear cargas maiores (motores, fitas de LED). Parâmetros do datasheet:

- **Vgs(th):** tensão em que começa a conduzir. Para ligar com 3,3 V, use MOSFET **logic-level** (totalmente ligado com Vgs de 2,5 V a 4,5 V, conforme o datasheet).
- **Rds(on):** resistência quando ligado. Menor = menos calor (P = I² × Rds(on)).
- Resistor de pull-down no gate (ex.: 100 kΩ) para ele ficar desligado enquanto o microcontrolador reinicia.

> **Cuidado! Cai na entrevista:** "Como acionar um motor de 12 V com um microcontrolador de 3,3 V?" Nunca direto no pino (um pino aguenta poucos mA). Use um MOSFET logic-level de canal N no lado do GND, diodo de roda livre no motor, pull-down no gate e GND comum entre as fontes.

### 2.7 Reguladores de tensão

Transformam uma tensão em outra fixa (12 V em 5 V ou 3,3 V).

| Tipo | Como funciona | Eficiência | Uso |
|---|---|---|---|
| Linear (LDO) | "Queima" a diferença em calor | Baixa quando a diferença é grande | Simples, sem ruído; pequenas diferenças e correntes |
| Chaveado (buck, boost) | Liga e desliga rápido com indutor | Alta (80% a 95%) | Diferenças grandes, baterias, correntes altas |

Calor num linear: P = (Vin − Vout) × I. De 12 V para 3,3 V a 200 mA: (8,7) × 0,2 = **1,74 W**. Isso esquenta muito um regulador pequeno: melhor um buck.

### 2.8 Relés

Chave mecânica acionada por uma bobina. Isola o circuito de controle do circuito de potência. Lento, faz "clique", desgasta. Precisa de transistor para acionar a bobina e diodo de roda livre. Para cargas em corrente contínua frequentemente acionadas, prefira MOSFET; para isolar circuitos de tensões diferentes, relé ou relé de estado sólido.

### Atividades de fixação do Tema 2

1. Para que serve o capacitor de 100 nF ao lado de cada chip? O que pode acontecer sem ele?
2. Desenhe o circuito para um microcontrolador de 3,3 V acionar um relé de 5 V. Inclua todos os componentes necessários.
3. Um MOSFET tem Rds(on) = 0,05 Ω e vai conduzir 4 A. Quanto calor dissipa? E se, por usar um MOSFET que não é logic-level, o Rds(on) real com 3,3 V for 2 Ω?
4. Uma placa recebe 9 V e precisa de 5 V a 50 mA. Linear ou chaveado? E se fossem 24 V e 1 A?
5. Calcule a constante de tempo de um circuito RC com 47 kΩ e 10 µF.

## Tema 3: Eletrônica digital

**Objetivo:** entender como o mundo digital representa informação e como os sinais se comportam eletricamente.

### 3.1 Binário e hexadecimal

Firmware vive de bits. Conversões que você vai fazer todo dia:

| Decimal | Binário | Hexadecimal |
|---|---|---|
| 0 | 0000 | 0x0 |
| 5 | 0101 | 0x5 |
| 10 | 1010 | 0xA |
| 15 | 1111 | 0xF |
| 172 | 1010 1100 | 0xAC |
| 255 | 1111 1111 | 0xFF |

Cada dígito hexadecimal = 4 bits. Por isso registradores são escritos em hexa: `0x4002 0000` é muito mais legível que 32 zeros e uns.

### 3.2 Portas lógicas

| Porta | Saída é 1 quando |
|---|---|
| AND | Todas as entradas são 1 |
| OR | Pelo menos uma entrada é 1 |
| NOT | A entrada é 0 |
| XOR | As entradas são diferentes |
| NAND / NOR | Inverso de AND / OR |

Você vai usar essas mesmas operações em C, sobre bits de registradores (`&`, `|`, `~`, `^`).

### 3.3 Flip-flops e registradores

Um **flip-flop** guarda 1 bit: o tipo D copia a entrada para a saída na borda do clock. Vários flip-flops juntos formam um **registrador**. Os periféricos de um microcontrolador são controlados por registradores: escrever 1 num bit específico liga um pino, habilita um timer, inicia uma conversão.

### 3.4 Níveis lógicos 3,3 V e 5 V

O "1" e o "0" são faixas de tensão, definidas no datasheet (VIH, VIL, VOH, VOL). Microcontroladores modernos usam **3,3 V**; Arduino Uno e muitos módulos antigos usam **5 V**.

> **Cuidado! Cai na entrevista:** ligar uma saída de 5 V numa entrada de 3,3 V pode danificar o chip, a menos que o pino seja **5 V tolerant** (confira no datasheet). Soluções: divisor de tensão (sinais lentos), conversor de nível (level shifter) ou buffer.

### 3.5 Pull-up e pull-down

Uma entrada desconectada fica **flutuando** e lê valores aleatórios (até a mão perto muda a leitura). Resistores definem o estado padrão:

- **Pull-up** (para VCC): lê 1 por padrão; o botão liga ao GND e faz ler 0.
- **Pull-down** (para GND): lê 0 por padrão.

Muitos microcontroladores têm pull-ups internos (cerca de 30 a 50 kΩ), ativados por registrador.

### 3.6 Open-drain

Uma saída **open-drain** só consegue puxar a linha para 0; para ir a 1, depende de um resistor de pull-up externo. Vários dispositivos podem compartilhar a mesma linha sem conflito (se um puxa para 0, a linha fica 0). É assim que o **I2C** funciona.

### 3.7 Protoboard

As fileiras laterais são barramentos de alimentação (atenção: em algumas protoboards eles são divididos ao meio). As colunas de 5 furos do centro são ligadas entre si. O canal central separa os dois lados (onde se encaixam os chips).

### Atividades de fixação do Tema 3

1. Converta: 0x3C para decimal e binário; 200 para hexadecimal; 0b1111 0000 para hexadecimal.
2. Quantos valores diferentes cabem em 8, 12 e 16 bits?
3. Um botão ligado entre o pino e o GND, com pull-up interno: o que o pino lê com o botão solto e apertado?
4. Por que o I2C precisa de resistores de pull-up e o que acontece se esquecer?
5. Você vai ligar um módulo sensor de 5 V (saída digital) num ESP32. Como proteger a entrada?

## Tema 4: Instrumentação e documentação

**Objetivo:** ler a documentação do hardware e usar os instrumentos de bancada.

### 4.1 Ler esquemáticos

Símbolos básicos: resistor, capacitor (polarizado ou não), diodo, LED, transistor, GND (terra, referência de 0 V), VCC/3V3/5V (alimentação), net labels (fios com o mesmo nome estão ligados mesmo sem linha desenhada).

Baixe o esquemático da sua placa Nucleo ou ESP32 DevKit (os fabricantes publicam) e procure: o regulador de 3,3 V, o LED do usuário e em qual pino ele está, o botão de reset, o cristal do clock.

### 4.2 Ler datasheets

Seções que você vai consultar sempre:

| Seção | Para quê |
|---|---|
| Features / Overview | Resumo do que o chip faz |
| Pinout | O que cada pino faz |
| **Absolute Maximum Ratings** | Limites que **não** podem ser ultrapassados nem por um instante (danifica) |
| Recommended Operating Conditions | Onde o chip funciona como especificado |
| Electrical Characteristics | Correntes, tensões, tempos |
| Typical Application | Circuito de exemplo pronto: comece por ele |
| Register map | Para chips configuráveis (sensores, periféricos) |

Para microcontroladores há dois documentos: o **datasheet** (elétrica, pinos, encapsulamento) e o **reference manual** (como funciona cada periférico e todos os registradores, muitas vezes com mais de mil páginas).

### 4.3 Fonte de bancada

Permite ajustar tensão e, principalmente, **limitar a corrente**. Ao ligar um circuito novo, coloque o limite baixo (ex.: 100 mA): se houver um curto, a fonte limita em vez de queimar algo. Observe também quanto o circuito consome: corrente bem maior que a esperada indica problema.

### 4.4 Osciloscópio

Mostra a tensão ao longo do tempo. Essencial para PWM, ruído, sinais analógicos e para ver se um sinal digital está "limpo".

- **Volts/div e tempo/div:** escalas vertical e horizontal.
- **Trigger:** "congela" a imagem a partir de um evento (ex.: borda de subida).
- **Ponta x10:** atenua o sinal e perturba menos o circuito; configure o osciloscópio para x10 também.
- O **jacaré de GND** da ponta vai no GND do circuito. Em osciloscópios de bancada ligados à tomada, o GND da ponta é ligado ao terra da rede: não o prenda em pontos que não sejam o GND do circuito.

Opções acessíveis: osciloscópios USB e portáteis de entrada.

### 4.5 Analisador lógico

Captura vários sinais **digitais** ao mesmo tempo e **decodifica protocolos** (UART, SPI, I2C, CAN). Um clone USB de 8 canais com o **PulseView** (sigrok, gratuito) é o melhor custo-benefício do kit. Você vai usá-lo muito na etapa de microcontroladores.

### 4.6 Soldagem

- Ferro com temperatura ajustável (cerca de 330 a 370 °C para solda comum com chumbo; um pouco mais para solda sem chumbo).
- Aqueça o **terminal e a ilha** ao mesmo tempo e encoste o estanho neles (não no ferro).
- Boa solda: brilhante, em forma de cone. Fria: opaca e granulada.
- Fluxo ajuda; malha dessoldadora e sugador corrigem erros.
- Ventilação (a fumaça do fluxo irrita) e lave as mãos depois.

### Atividades de fixação do Tema 4

1. No esquemático da sua placa, encontre o pino do LED do usuário e do botão. Eles têm resistores? De quanto?
2. No datasheet do seu microcontrolador, encontre: tensão máxima absoluta em VDD, corrente máxima por pino de I/O e corrente máxima total. Por que esses números importam?
3. Ao ligar seu circuito na fonte com limite de 100 mA, a fonte entra em limitação de corrente imediatamente. O que isso indica e o que você faz?
4. Gere um PWM ou pisque um LED rápido e meça frequência e duty cycle com o osciloscópio (ou com o analisador lógico).
5. Qual a diferença entre osciloscópio e analisador lógico? Dê um exemplo de quando usar cada um.

## Projeto da etapa

**Painel de LEDs com transistor e medição:**

1. Monte 3 LEDs com resistores calculados, alimentados por 5 V da placa.
2. Acione uma carga maior (fita de LED de 12 V ou motorzinho) com um MOSFET logic-level, com diodo de roda livre se for indutiva.
3. Meça e anote: tensão em cada LED, corrente de cada ramo, corrente total.
4. Monte um divisor de tensão para medir a tensão de 12 V numa faixa segura de 3,3 V e confira com o multímetro.
5. Desenhe o esquemático completo (em papel ou no KiCad) e publique fotos, esquemático e medições no GitHub.

## Resumão

- V = R × I; P = V × I. Potência vira calor; respeite os limites.
- Série soma resistências; paralelo divide. Divisor de tensão só para sinais, não para alimentar.
- Capacitor de 100 nF em cada chip. Diodo de roda livre em bobinas.
- Cargas maiores: MOSFET logic-level, nunca direto no pino.
- Linear desperdiça (Vin − Vout) × I; chaveado é eficiente.
- 3,3 V e 5 V não se misturam sem cuidado. Entradas sempre com pull-up ou pull-down.
- Datasheet: Absolute Maximum Ratings nunca; Typical Application primeiro.
- Fonte com limite de corrente, osciloscópio para sinais analógicos, analisador lógico para protocolos.
