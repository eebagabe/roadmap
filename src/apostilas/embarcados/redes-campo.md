# Redes Industriais e Automotivas: Apostila Prática

Roadmap Sistemas Embarcados · Semanas 24 a 28

## Comece por aqui

Fábricas, máquinas agrícolas, elevadores, trens, caminhões e carros têm algo em comum: vários controladores espalhados que precisam conversar de forma **robusta** (ruído elétrico, cabos longos, vibração) e **previsível** (a mensagem do freio não pode esperar). Para isso existem as redes de campo (*fieldbus*). Esta etapa cobre as mais usadas: **RS-485 com Modbus** (indústria), **CAN** (veículos, máquinas, robótica, equipamentos médicos), uma visão do **mundo automotivo** e a **Ethernet industrial**.

### Por que isso vale ouro no mercado

- CAN está em carros, caminhões, tratores, empilhadeiras, robôs, elevadores, equipamentos médicos e drones.
- Modbus é o "idioma comum" da automação industrial: inversores, medidores de energia, CLPs, sensores.
- Quem entende essas redes trabalha tanto em indústria quanto no setor automotivo e agrícola.

### Como esta apostila funciona

1. Muita coisa dá para praticar **sem hardware**: CAN virtual (`vcan`) no Linux e Modbus TCP entre programas no PC.
2. Com hardware: duas placas com transceivers CAN (ex.: SN65HVD230, de 3,3 V) e conversores RS-485 (ex.: MAX485 ou módulos USB-RS485).
3. Atividades no fim de cada tema; gabarito na outra aba.

> **Atenção:** nunca **envie** mensagens no barramento CAN de um veículo real. Freios, direção, airbag e motor dependem dessa rede; uma mensagem errada pode causar acidentes ou danificar módulos. Nos seus testes com carro, apenas **leia** (de preferência em modo somente escuta) e pela porta OBD-II. O mesmo vale para máquinas industriais em operação.

> **Regra dos 20 minutos:** barramento sem comunicação? Confira primeiro a camada física: terminação (meça a resistência entre as duas linhas com tudo desligado), GND comum, fios trocados (A/B, CANH/CANL) e velocidade igual em todos os nós. A maioria dos problemas está aí, não no código.

### Plano de estudo sugerido

| Semana | Tema |
|---|---|
| 24 | Tema 1: RS-485 e Modbus |
| 25 | Tema 2: Rede CAN |
| 26 | Tema 3: CAN na prática |
| 27 | Tema 4: Visão do mundo automotivo |
| 28 | Tema 5: Ethernet industrial + projeto |

## Tema 1: RS-485 e Modbus

**Objetivo:** montar e usar a rede mais comum da automação industrial.

### 1.1 RS-232 e RS-485

São padrões **elétricos** para transmitir os bits de uma UART por distâncias maiores.

| | RS-232 | RS-485 |
|---|---|---|
| Sinal | Referenciado ao GND | **Diferencial** (par de fios A e B) |
| Dispositivos | 2 (ponto a ponto) | Vários no mesmo par (multiponto) |
| Distância | Poucos metros | Até cerca de 1.200 m (em velocidades baixas) |
| Imunidade a ruído | Baixa | Alta |

O sinal **diferencial** é o segredo: o receptor olha a **diferença** entre os dois fios. Um ruído que atinge o cabo afeta os dois fios igualmente e se cancela. Por isso o par é **trançado**.

Montagem típica: microcontrolador (UART) → transceiver RS-485 (com um pino que habilita a transmissão, porque a linha é *half-duplex*: um fala de cada vez) → par trançado com **resistores de terminação de 120 Ω nas duas pontas**, e resistores de polarização (*bias*) para a linha ter um estado definido quando ninguém transmite.

### 1.2 Modbus RTU

Protocolo **mestre e escravo** (hoje também chamado de cliente e servidor), simples e aberto, criado em 1979 e usado até hoje. O mestre pergunta; cada escravo (endereço 1 a 247) só responde quando consultado.

Os dados ficam organizados em quatro tabelas:

| Tabela | Tipo | Acesso | Exemplo |
|---|---|---|---|
| Coils | 1 bit | Leitura e escrita | Liga/desliga um relé |
| Discrete inputs | 1 bit | Só leitura | Estado de um sensor de fim de curso |
| Input registers | 16 bits | Só leitura | Temperatura medida |
| Holding registers | 16 bits | Leitura e escrita | Setpoint, configuração |

Formato do quadro RTU:

```
| endereço | função | dados | CRC-16 (byte baixo, depois alto) |
```

Mensagens são separadas por um silêncio de pelo menos 3,5 tempos de caractere.

Funções mais usadas: **0x01** ler coils, **0x03** ler holding registers, **0x04** ler input registers, **0x05** escrever um coil, **0x06** escrever um registrador, **0x10** escrever vários registradores.

Exemplo: o mestre lê 2 holding registers a partir do endereço 0 do escravo 1:

```
Pedido:   01 03 00 00 00 02 C4 0B
          │  │  └───┘ └───┘ └───┘
          │  │  início qtd   CRC
          │  função 03
          escravo 1

Resposta: 01 03 04 00 FA 01 2C xx xx
                │  └───┘ └───┘
                │  250   300        (4 bytes de dados = 2 registradores)
                quantidade de bytes
```

Erros voltam como **exceção**: a função com o bit mais alto ligado (0x03 vira 0x83) e um código (02 = endereço inválido, por exemplo).

> **Cuidado! Cai na entrevista:** Modbus só transporta números de 16 bits. O **significado** (escala, unidade, se é com sinal, se dois registradores formam um float de 32 bits e em que ordem) está no **mapa de registradores** do manual do equipamento. Ler o registrador certo com a interpretação errada é o erro mais comum de integração.

### 1.3 Modbus TCP

O mesmo modelo de dados sobre Ethernet, na porta **502**. Troca o endereço e o CRC por um cabeçalho de 7 bytes (MBAP); o TCP já cuida da integridade. Gateways convertem Modbus TCP para RTU.

### 1.4 Mestre e escravo na prática

```python
# Mestre (cliente) Modbus TCP em Python, com a biblioteca pymodbus
from pymodbus.client import ModbusTcpClient

cli = ModbusTcpClient("127.0.0.1", port=5020)
cli.connect()
r = cli.read_holding_registers(0, count=2, slave=1)
print(r.registers)        # ex.: [250, 300]
cli.close()
```

(Os nomes dos parâmetros mudam um pouco entre versões do pymodbus; consulte a documentação da sua versão.)

No microcontrolador, um escravo RTU é uma máquina de estados: recebe bytes pela UART, detecta o fim do quadro pelo silêncio (timer), confere o endereço e o CRC, executa a função e responde.

### 1.5 CLPs e sensores industriais

O **CLP** (controlador lógico programável) é o computador da automação: robusto, com entradas e saídas industriais (24 V, 4 a 20 mA), programado em linguagens da norma IEC 61131-3 (como Ladder). Na indústria, o firmware que você escreve muitas vezes roda em **equipamentos que conversam com CLPs**: inversores, sensores, medidores, controladores dedicados.

Sinais típicos: entradas e saídas digitais de **24 V** e sinais analógicos de **4 a 20 mA** (corrente, imune a quedas no cabo; 4 mA como "zero" permite detectar cabo rompido, que dá 0 mA).

### Atividades de fixação do Tema 1

1. Por que o RS-485 alcança distâncias muito maiores que o RS-232?
2. Monte o pedido Modbus RTU para o escravo 17 ler 3 holding registers a partir do endereço 107 (0x6B). O CRC é `76 87`.
3. A resposta a um pedido de leitura veio como `01 83 02 C0 F1`. O que aconteceu?
4. Dois registradores contêm `0x41C8` e `0x0000` e representam um float de 32 bits (IEEE 754, palavra mais significativa primeiro). Qual o valor?
5. Simule um escravo e um mestre Modbus TCP no seu PC (por exemplo, o servidor de exemplo do pymodbus e o cliente acima) e leia e escreva registradores.

## Tema 2: Rede CAN

**Objetivo:** entender como o CAN funciona por dentro.

### 2.1 Por que CAN

Criado pela Bosch nos anos 1980 para reduzir a quantidade de fios nos carros. Características:

- **Barramento** de dois fios compartilhado por todos os nós (sem mestre).
- **Mensagens com prioridade** pelo identificador.
- **Detecção de erros** muito forte e retransmissão automática.
- Robusto contra ruído (diferencial) e barato.

Hoje: veículos, máquinas agrícolas e de construção, robôs industriais, elevadores, equipamentos médicos, embarcações, drones.

### 2.2 Camada física (CANH e CANL)

| Estado | Bit | CANH | CANL | Diferença |
|---|---|---|---|---|
| **Recessivo** | 1 | ~2,5 V | ~2,5 V | ~0 V |
| **Dominante** | 0 | ~3,5 V | ~1,5 V | ~2 V |

Se um nó transmite dominante (0) e outro recessivo (1) ao mesmo tempo, **o dominante vence** (como um "E" elétrico). Isso é a base da arbitragem.

- **Terminação:** 120 Ω em **cada ponta** do barramento. Com tudo desligado, a resistência entre CANH e CANL deve ser cerca de **60 Ω** (dois de 120 Ω em paralelo).
- **Transceiver** converte os níveis lógicos do controlador CAN (TX/RX) nos sinais diferenciais.
- Velocidade e comprimento andam juntos: 1 Mbit/s até cerca de 40 m; velocidades menores permitem cabos maiores. 500 kbit/s é muito comum em carros; 250 kbit/s em caminhões e máquinas agrícolas.

### 2.3 Quadro CAN

Quadro padrão (CAN 2.0A), simplificado:

```
| SOF | ID (11 bits) | RTR | IDE | r0 | DLC (4) | Dados (0 a 8 bytes) | CRC (15) | ACK | EOF (7) |
```

- **ID:** identifica **o conteúdo** da mensagem (não o remetente nem o destinatário) e define a prioridade. Formato estendido (CAN 2.0B): 29 bits.
- **DLC:** quantidade de bytes de dados (até 8).
- **CRC:** detecção de erros.
- **ACK:** qualquer nó que recebeu corretamente puxa o bit para dominante. Se ninguém confirmar (ex.: único nó ligado), o transmissor considera erro e repete.
- **Bit stuffing:** depois de 5 bits iguais, o transmissor insere um bit oposto, para os receptores se manterem sincronizados.

Todos os nós recebem todas as mensagens; cada um usa **filtros** de hardware para ficar só com as que interessam.

### 2.4 Arbitragem

Quando dois nós começam a transmitir ao mesmo tempo, eles comparam bit a bit o que enviaram com o que leem no barramento. Quem envia recessivo (1) e lê dominante (0) **perde e para de transmitir**, sem destruir a mensagem do outro. Resultado: **o menor ID vence** e a mensagem mais importante passa sem atraso.

Exemplo: ID 0x100 (`001 0000 0000`) contra ID 0x0F0 (`000 1111 0000`): no terceiro bit, 0x0F0 manda 0 e 0x100 manda 1. **0x0F0 vence.**

> **Cuidado! Cai na entrevista:** a arbitragem é **não destrutiva** (nenhum tempo de barramento é perdido) e explica por que IDs de mensagens críticas (freio, motor) são baixos. Consequência: um nó com defeito enviando o ID 0x000 sem parar trava toda a rede.

### 2.5 Bit timing

Cada bit é dividido em segmentos de tempo (*time quanta*): sincronização, propagação, fase 1 e fase 2. O **ponto de amostragem** (onde o bit é lido) costuma ficar perto de **75% a 87,5%** do bit (em automotivo, 87,5% é comum). Todos os nós precisam da mesma taxa e de pontos de amostragem compatíveis; calculadoras de bit timing ajudam a configurar os registradores (prescaler e segmentos) a partir do clock do controlador.

### 2.6 Erros e bus-off

O CAN detecta erros de **bit**, **stuffing**, **CRC**, **forma** e **ACK**. Cada nó tem contadores de erros de transmissão (TEC) e recepção (REC):

| Estado | Condição | Comportamento |
|---|---|---|
| Error active | Contadores baixos | Funciona normalmente e sinaliza erros |
| Error passive | Algum contador acima de 127 | Continua, mas sinaliza erros de forma "discreta" |
| **Bus-off** | TEC acima de 255 | **Sai do barramento** para não atrapalhar os outros |

Isso isola automaticamente um nó defeituoso. O firmware deve tratar o bus-off (registrar o evento e tentar voltar de forma controlada).

### 2.7 CAN FD

Evolução que aumenta a capacidade:

- Até **64 bytes** de dados por quadro.
- **Fase de dados mais rápida** (ex.: 2 a 5 Mbit/s), mantendo a arbitragem na velocidade normal.
- CRC mais forte.

Usado em veículos mais novos e em sistemas que precisam de mais banda (atualização de firmware pela rede, sensores com mais dados). Já existe também o **CAN XL**, com quadros ainda maiores.

### Atividades de fixação do Tema 2

1. Com o barramento desligado, você mede 120 Ω entre CANH e CANL. O que isso indica? E 40 Ω?
2. Três nós começam a transmitir ao mesmo tempo os IDs 0x2A0, 0x1F5 e 0x1F4. Qual vence a arbitragem?
3. Por que o ID de uma mensagem CAN não indica quem é o destinatário? Como um nó sabe o que receber?
4. Você liga uma única placa num barramento CAN (sem outro nó) e ela fica retransmitindo a mesma mensagem e acaba em erro. Por quê?
5. Quais as duas principais vantagens do CAN FD sobre o CAN clássico?

## Tema 3: CAN na prática

**Objetivo:** definir, enviar, receber e interpretar mensagens CAN com ferramentas reais.

### 3.1 Arquivos DBC

O **DBC** é o formato padrão de mercado para descrever **o que significa** cada mensagem e cada sinal de uma rede CAN.

```
BO_ 256 Motor: 8 ECU_Motor
 SG_ Rotacao : 0|16@1+ (0.25,0) [0|16383.75] "rpm" Painel
 SG_ TempAgua : 16|8@1+ (1,-40) [-40|215] "C" Painel

BO_ 512 Painel: 2 ECU_Painel
 SG_ LuzAlerta : 0|1@1+ (1,0) [0|1] "" ECU_Motor
```

Lendo a linha de `Rotacao`: começa no bit 0, tem 16 bits, `@1` = byte order Intel (little-endian), `+` = sem sinal, fator 0,25, offset 0, faixa e unidade.

### 3.2 Sinais e escalas

**Valor físico = valor bruto × fator + offset.**

Exemplo: os bytes da mensagem 0x100 são `E0 2E 5A ...`.

- Rotação: bruto = 0x2EE0 (little-endian: byte 0 = E0, byte 1 = 2E) = 12000 → 12000 × 0,25 = **3000 rpm**.
- Temperatura da água: bruto = 0x5A = 90 → 90 × 1 − 40 = **50 °C**.

Atenção à ordem dos bytes: **Intel** (little-endian) e **Motorola** (big-endian) coexistem, inclusive na mesma rede.

### 3.3 SocketCAN e can-utils

(Revise o Tema 2 da apostila de Linux Embarcado.)

```bash
sudo ip link add dev vcan0 type vcan && sudo ip link set up vcan0
candump -tz vcan0                       # mostra com tempo relativo
cansend vcan0 100#E02E5A0000000000      # simula a ECU do motor
canplayer -I gravacao.log vcan0=can0    # reproduz uma gravação
cangen vcan0 -I 100 -L 8 -g 10          # gera tráfego para teste de carga
```

### 3.4 cantools em Python

```python
import can
import cantools

db = cantools.database.load_file("veiculo.dbc")
bus = can.interface.Bus(channel="vcan0", interface="socketcan")

# enviar (codificando sinais físicos)
msg = db.get_message_by_name("Motor")
dados = msg.encode({"Rotacao": 3000, "TempAgua": 50})
bus.send(can.Message(arbitration_id=msg.frame_id, data=dados, is_extended_id=False))

# receber e decodificar
for m in bus:
    try:
        print(hex(m.arbitration_id), db.decode_message(m.arbitration_id, m.data))
    except KeyError:
        pass   # mensagem que não está no DBC
```

Com isso você simula ECUs inteiras no PC, testa a placa real contra elas e cria painéis de diagnóstico.

### 3.5 MCP2515 e transceivers

Para ter CAN no hardware:

| Situação | Solução |
|---|---|
| Microcontrolador **com** controlador CAN (STM32 com bxCAN/FDCAN, ESP32 com TWAI) | Só um **transceiver** (ex.: SN65HVD230 em 3,3 V, TJA1050/MCP2551 em 5 V) |
| Microcontrolador **sem** CAN, ou Raspberry Pi | Controlador externo **MCP2515** (por SPI) + transceiver; muitos módulos prontos trazem os dois |
| PC | Adaptador USB-CAN (vários são compatíveis com SocketCAN) |

Atenção ao nível de tensão do transceiver e ao cristal do módulo MCP2515 (8 MHz ou 16 MHz), que precisa ser informado na configuração.

### 3.6 CANopen e J1939

CAN define como os bits trafegam, não o que as mensagens significam. Protocolos de **camada superior** padronizam isso:

- **CANopen:** automação, robótica, equipamentos médicos, empilhadeiras. Cada dispositivo tem um **dicionário de objetos** (parâmetros por índice e subíndice), com **PDOs** (dados de processo, rápidos), **SDOs** (configuração) e **NMT** (gerenciamento de estado da rede).
- **SAE J1939:** caminhões, ônibus, máquinas agrícolas e de construção (o **ISOBUS** dos tratores é baseado nele). Usa IDs de 29 bits com **PGNs** (grupos de parâmetros) e **SPNs** (sinais), e define tudo, de rotação do motor a diagnóstico.

### Atividades de fixação do Tema 3

1. Decodifique pelo DBC acima a mensagem 0x100 com dados `40 1F 82 00 00 00 00 00`.
2. Escreva no formato DBC uma mensagem 0x300 "Bateria" com tensão (16 bits, fator 0,01 V) e corrente (16 bits com sinal, fator 0,1 A).
3. Com `vcan0` e cantools, faça um script que simula a ECU do motor (rotação subindo e descendo) e outro que simula o painel (mostra os valores e acende "alerta" acima de 110 °C).
4. Quando usar um MCP2515 e quando só um transceiver?
5. Uma máquina agrícola e um robô industrial usam CAN. Qual protocolo de camada superior cada um provavelmente usa?

## Tema 4: Visão do mundo automotivo

**Objetivo:** conhecer como os veículos organizam a eletrônica, o diagnóstico e o software.

### 4.1 ECUs e arquitetura do veículo

Um carro moderno tem de dezenas a mais de uma centena de **ECUs**, agrupadas por **domínios**:

| Domínio | Exemplos |
|---|---|
| Powertrain | Injeção, câmbio, gerenciamento da bateria (elétricos) |
| Chassis | ABS, controle de estabilidade, direção elétrica, airbag |
| Carroceria (body) | Travas, vidros, iluminação, ar-condicionado |
| Infotainment | Central multimídia, painel digital |
| ADAS | Câmeras, radares, frenagem automática |

Um **gateway** separa as redes e filtra o que passa entre elas (por segurança e para não sobrecarregar). A tendência é a **arquitetura zonal**: poucos computadores centrais muito potentes e controladores por **zona física** do carro (frente, traseira), ligados por Ethernet, reduzindo fios e permitindo o **software-defined vehicle** (funções novas entregues por atualização OTA).

### 4.2 LIN e Automotive Ethernet

- **LIN:** rede barata, de **um fio**, mestre e escravos, até 20 kbit/s (19,2 kbit/s é comum). Para funções simples: vidros, retrovisores, sensores de chuva, botões.
- **FlexRay:** rede determinística de até 10 Mbit/s, usada em alguns sistemas de chassis; hoje em declínio.
- **Automotive Ethernet** (100BASE-T1, 1000BASE-T1): Ethernet num **único par trançado**, para câmeras, ADAS, infotainment e o backbone zonal. Protocolos como **SOME/IP** (comunicação orientada a serviços) e **TSN** (tempo determinístico) rodam por cima.

### 4.3 OBD-II e UDS

O **OBD-II** é o diagnóstico de bordo padronizado (obrigatório em veículos leves em muitos países; no Brasil, o padrão OBDBr-2). Conector de 16 pinos sob o painel; em carros com CAN, **pino 6 = CANH** e **pino 14 = CANL**, normalmente a 500 kbit/s.

Pedido de um dado (serviço 01, "dados atuais"):

```
Pedido   (ID 0x7DF, para todas as ECUs):  02 01 0C 00 00 00 00 00   → serviço 01, PID 0x0C (rotação)
Resposta (ID 0x7E8, ECU do motor):       04 41 0C 1A F8 00 00 00   → 0x41 = resposta positiva ao serviço 01

Rotação = (256 × A + B) / 4 = (256 × 0x1A + 0xF8) / 4 = 1726 rpm
```

PIDs úteis: **0x0D** velocidade (A km/h), **0x05** temperatura do líquido de arrefecimento (A − 40 °C), **0x0C** rotação. Os **DTCs** (códigos de falha) têm formato como **P0301** (P = powertrain; falha de ignição no cilindro 1).

Mensagens maiores que 8 bytes usam o **ISO-TP** (ISO 15765-2), que fatia os dados em quadros: *single frame*, *first frame*, *consecutive frames* e *flow control*.

O diagnóstico completo das montadoras usa o **UDS** (ISO 14229), sobre ISO-TP:

| Serviço | ID | Para quê |
|---|---|---|
| DiagnosticSessionControl | 0x10 | Trocar de sessão (padrão, estendida, programação) |
| ECUReset | 0x11 | Reiniciar a ECU |
| ReadDataByIdentifier | 0x22 | Ler um dado (ex.: DID 0xF190 = VIN) |
| SecurityAccess | 0x27 | Desafio e resposta (seed e key) para liberar funções protegidas |
| ReadDTCInformation | 0x19 | Ler códigos de falha |
| ClearDiagnosticInformation | 0x14 | Apagar códigos de falha |
| RoutineControl | 0x31 | Executar rotinas (testes de atuadores, apagar memória) |
| RequestDownload / TransferData | 0x34 / 0x36 | Gravar firmware (*flashing*) |
| TesterPresent | 0x3E | Manter a sessão ativa |

Resposta positiva = ID do serviço + 0x40 (0x22 → 0x62). Negativa = `7F <serviço> <código>` (ex.: `7F 22 31` = *request out of range*).

### 4.4 AUTOSAR

Padrão de arquitetura de software das montadoras e fornecedores, para reaproveitar software entre ECUs e fornecedores.

- **AUTOSAR Classic** (ECUs com microcontrolador): a aplicação é feita de **SWCs** (componentes de software) que se comunicam pelo **RTE**; abaixo fica o **BSW** (software básico: comunicação, diagnóstico, memória, sistema operacional) e o **MCAL**, que abstrai o microcontrolador. Muito configurado por ferramentas, pouco escrito à mão.
- **AUTOSAR Adaptive** (computadores potentes, POSIX): comunicação orientada a serviços (SOME/IP), atualização dinâmica, C++.

### 4.5 Software-defined vehicle

As funções do carro passam a ser definidas por **software** em computadores centrais, atualizadas ao longo da vida do veículo (OTA). Traz para o carro práticas do mundo de software (integração contínua, containers, Linux, nuvem), com as exigências de segurança funcional e cibersegurança (normas ISO 26262, ISO/SAE 21434 e os regulamentos UNECE R155 e R156, que você verá na próxima etapa).

### Atividades de fixação do Tema 4

1. Em qual domínio e em qual rede (CAN, LIN, Ethernet) você colocaria: (a) controle do vidro elétrico; (b) câmera frontal do ADAS; (c) controle do motor; (d) sensor de chuva?
2. Decodifique a resposta OBD-II `03 41 0D 3C` e a resposta `03 41 05 7B`.
3. Monte o pedido UDS para ler o VIN (DID 0xF190) e explique a resposta `7F 22 31`.
4. Para que serve o SecurityAccess (0x27) e por que ele existe?
5. Com um adaptador e um ESP32 (ou um adaptador ELM327 comercial), leia **somente** os PIDs de rotação, velocidade e temperatura do seu carro, parado e em local seguro. Quais valores obteve?

## Tema 5: Ethernet industrial

**Objetivo:** entender as redes de alto desempenho das fábricas modernas.

### 5.1 Por que Ethernet na indústria

Ethernet comum é rápida e barata, mas **não determinística**: o tempo de entrega varia. Controle de movimento (robôs, servomotores sincronizados) precisa de ciclos de **milissegundos ou microssegundos**, sempre iguais. As variantes industriais resolvem isso de formas diferentes, mantendo cabos e chips Ethernet.

### 5.2 EtherCAT

Um mestre envia um único quadro que **passa por todos os escravos** em sequência; cada um lê e escreve sua parte "no voo", sem armazenar o quadro. Resultado: ciclos muito curtos (de dezenas de microssegundos a poucos milissegundos) e sincronização precisa entre eixos. Muito usado em máquinas e robótica.

### 5.3 PROFINET

Padrão muito associado à Siemens, comum em fábricas. Tem níveis de desempenho: comunicação comum, **RT** (tempo real) e **IRT** (tempo real isócrono, para controle de movimento). Outro padrão comparável é o **EtherNet/IP**, comum em equipamentos de origem norte-americana.

### 5.4 OPC UA

Não é uma rede de campo, e sim um padrão de **comunicação e modelagem de dados** entre máquinas, sistemas de supervisão e a nuvem. Os dispositivos expõem um **modelo de informação** (o que é cada dado, unidade, relações), com segurança embutida, cliente-servidor e publish-subscribe. É peça central da **Indústria 4.0**.

### 5.5 Time-Sensitive Networking

**TSN** é um conjunto de padrões IEEE 802.1 que torna a Ethernet padrão **determinística** (reserva de tempo, sincronização de relógio, prioridades). A tendência é usar TSN tanto em fábricas quanto em veículos, unificando redes.

### Atividades de fixação do Tema 5

1. Por que a Ethernet comum não serve para sincronizar 6 servomotores de um robô?
2. Explique com uma analogia como o EtherCAT processa o quadro "no voo".
3. Qual a diferença de papel entre EtherCAT e OPC UA numa fábrica?
4. Uma máquina antiga tem só Modbus RTU e a empresa quer os dados num painel na nuvem. Proponha uma arquitetura.
5. Por que a TSN interessa tanto à indústria quanto à automotiva?

## Projeto da etapa

**Rede CAN com duas placas e diagnóstico simples:**

1. Escreva um **DBC** com pelo menos 3 mensagens (ex.: dados de sensores, comando de atuador e status).
2. **Placa 1** (STM32 ou ESP32 com transceiver): lê sensores e envia as mensagens periodicamente; recebe o comando e aciona um LED ou relé.
3. **Placa 2** (ou Raspberry Pi com MCP2515, ou o PC com adaptador): mostra os valores decodificados com cantools e envia comandos.
4. Diagnóstico simplificado: a placa 1 responde a um pedido (ID próprio) com sua versão de firmware e contadores de erro; trata bus-off.
5. Terminação correta medida (60 Ω) e capturas do `candump` e do analisador lógico (que decodifica CAN) no README.
6. Bônus: um escravo **Modbus RTU** na placa 1, lido por um script no PC via USB-RS485.

## Resumão

- RS-485: diferencial, multiponto, longas distâncias, terminação de 120 Ω.
- Modbus: mestre e escravo, coils e registradores de 16 bits, CRC-16; o significado está no mapa de registradores.
- CAN: dois fios, dominante (0) vence recessivo (1), menor ID vence a arbitragem sem destruir a mensagem.
- Terminação: 60 Ω medidos entre CANH e CANL. Mesma taxa e ponto de amostragem em todos os nós.
- Erros: error active, passive e bus-off isolam nós com defeito. CAN FD: 64 bytes e fase de dados rápida.
- DBC: valor físico = bruto × fator + offset; atenção à ordem dos bytes.
- CANopen (automação) e J1939 (caminhões e agrícolas) dão significado às mensagens.
- Automotivo: domínios, gateway, zonal; LIN e Automotive Ethernet; OBD-II, ISO-TP e UDS; AUTOSAR.
- Indústria: EtherCAT, PROFINET, OPC UA e TSN.
- Em veículo e máquina real: só leitura.
