# Gabarito: Redes Industriais e Automotivas

Abra só depois de tentar.

## Tema 1

1. Porque o sinal é **diferencial**: o receptor lê a diferença entre os fios A e B, e o ruído que atinge o par trançado afeta os dois fios igualmente e se cancela. O RS-232 mede a tensão de um fio em relação ao GND, que é afetado por ruído e por diferenças de potencial de terra entre equipamentos distantes. Além disso, o RS-485 usa terminação casada com a impedância do cabo, reduzindo reflexões.
2. `11 03 00 6B 00 03 76 87` (escravo 0x11 = 17, função 03, endereço inicial 0x006B, quantidade 3, CRC com byte baixo primeiro).
3. É uma **exceção**: função 0x83 = 0x03 com o bit mais alto ligado. Código **02** = *Illegal Data Address*: o endereço de registrador pedido não existe nesse escravo. Confira o mapa de registradores (e se o manual conta endereços a partir de 0 ou de 1, outra confusão comum).
4. `0x41C80000` em IEEE 754: sinal 0, expoente 0x83 = 131 → 2^(131−127) = 2⁴ = 16; mantissa 1,5625 (0x480000 / 2²³ = 0,5625). Valor = 16 × 1,5625 = **25,0**.
5. Prática. Inicie o servidor de exemplo do pymodbus numa porta como 5020 (portas abaixo de 1024 exigem privilégio) e use o cliente da seção 1.4; para escrever, `cli.write_register(0, 123, slave=1)`.

## Tema 2

1. **120 Ω**: só há **um** resistor de terminação (falta o da outra ponta, ou ele está desconectado). **40 Ω**: há **três** de 120 Ω em paralelo (algum nó do meio tem terminação ligada indevidamente). O correto é **60 Ω**.
2. Vence o **menor ID: 0x1F4**. 0x1F4 e 0x1F5 só diferem no último bit; ali o 0x1F4 manda 0 (dominante) e o 0x1F5 manda 1, perde. O 0x2A0 já tinha perdido nos primeiros bits.
3. Porque o CAN é baseado em **conteúdo**: o ID diz **o que** a mensagem é ("rotação do motor"), e qualquer nó interessado pode usá-la (painel, câmbio, controle de estabilidade). Cada nó configura **filtros e máscaras** no controlador CAN para aceitar só os IDs que lhe interessam; os outros são descartados pelo hardware.
4. Porque ninguém envia o **ACK**: o transmissor considera erro de confirmação, incrementa o contador de erros e retransmite automaticamente. Isso se repete até o nó entrar em error passive (e, conforme o controlador, pode ficar retransmitindo indefinidamente). Para testar sozinho, use o **modo loopback** do controlador ou ligue um segundo nó.
5. **Mais dados por quadro** (até 64 bytes, contra 8) e **maior velocidade na fase de dados** (vários Mbit/s), resultando em muito mais vazão útil. Também tem CRC mais robusto.

## Tema 3

1. Rotação: bytes 0 e 1 em little-endian = 0x1F40 = 8000 → 8000 × 0,25 = **2000 rpm**. Temperatura: 0x82 = 130 → 130 − 40 = **90 °C**.
2. ```
   BO_ 768 Bateria: 4 ECU_Bateria
    SG_ Tensao : 0|16@1+ (0.01,0) [0|655.35] "V" Painel
    SG_ Corrente : 16|16@1- (0.1,0) [-3276.8|3276.7] "A" Painel
   ```
   (`@1-` = Intel, **com sinal**.)
3. ```python
   # ecu_motor.py
   import time, math, can, cantools
   db = cantools.database.load_file("veiculo.dbc")
   bus = can.interface.Bus(channel="vcan0", interface="socketcan")
   msg = db.get_message_by_name("Motor")
   t = 0.0
   while True:
       rpm = 1500 + 1000 * math.sin(t)
       temp = 85 + 30 * math.sin(t / 5)
       bus.send(can.Message(arbitration_id=msg.frame_id, data=msg.encode({"Rotacao": rpm, "TempAgua": temp}), is_extended_id=False))
       t += 0.1
       time.sleep(0.1)
   ```
   ```python
   # painel.py
   import can, cantools
   db = cantools.database.load_file("veiculo.dbc")
   bus = can.interface.Bus(channel="vcan0", interface="socketcan")
   for m in bus:
       if m.arbitration_id == db.get_message_by_name("Motor").frame_id:
           s = db.decode_message(m.arbitration_id, m.data)
           alerta = "ALERTA" if s["TempAgua"] > 110 else ""
           print(f"{s['Rotacao']:7.0f} rpm  {s['TempAgua']:5.1f} °C  {alerta}")
   ```
   (Com a faixa do DBC de exemplo, valores fora de [-40, 215] °C geram erro na codificação; o cantools verifica os limites.)
4. Só **transceiver** quando o microcontrolador já tem controlador CAN interno (STM32 com bxCAN/FDCAN, ESP32 com TWAI, muitos NXP). **MCP2515** (controlador externo por SPI) quando o chip não tem CAN, como a Raspberry Pi ou muitos microcontroladores simples.
5. Máquina agrícola: **J1939** (e ISOBUS, baseado nele). Robô industrial: **CANopen** (ou EtherCAT, se usar Ethernet industrial).

## Tema 4

1. (a) Carroceria, **LIN** (ou CAN de carroceria); (b) ADAS, **Automotive Ethernet** (vídeo exige muita banda); (c) Powertrain, **CAN / CAN FD**; (d) Carroceria, **LIN**.
2. `41 0D 3C`: serviço 01 (resposta 0x41), PID 0x0D (velocidade): 0x3C = **60 km/h**. `41 05 7B`: PID 0x05 (temperatura do arrefecimento): 0x7B = 123 → 123 − 40 = **83 °C**.
3. Pedido (em quadro único ISO-TP): `03 22 F1 90` (3 bytes de dados: serviço 0x22 e DID 0xF190). Como o VIN tem 17 caracteres, a resposta positiva (`62 F1 90` + VIN) vem em vários quadros ISO-TP. `7F 22 31` é uma **resposta negativa** ao serviço 0x22 com código **0x31** (*requestOutOfRange*): essa ECU não suporta esse identificador (ou o valor pedido está fora da faixa).
4. Protege funções perigosas ou sensíveis (gravar firmware, alterar calibrações, codificar chaves, liberar testes de atuadores). A ECU envia um número aleatório (**seed**); só quem conhece o algoritmo e o segredo calcula a **key** correta. Evita que qualquer pessoa com um cabo OBD reprograme a ECU (hoje complementado por mecanismos de autenticação mais fortes, exigidos pelas normas de cibersegurança).
5. Resposta pessoal. Com o motor em marcha lenta e o carro parado: rotação na faixa de 700 a 900 rpm, velocidade 0 km/h e temperatura subindo até a de trabalho (aproximadamente 85 a 100 °C). Lembre: somente leitura, carro parado, em local seguro.

## Tema 5

1. Porque o tempo de entrega na Ethernet comum **varia** (filas em switches, colisões de tráfego, prioridades iguais): um servo pode receber o comando 50 µs depois do outro num ciclo e 2 ms depois no seguinte, e os eixos perdem a sincronia (vibração, trajetória errada). O controle de movimento precisa de ciclos fixos e sincronizados.
2. Exemplo: um trem que passa por várias estações sem parar; em cada estação, um funcionário pega a carta endereçada a ele e coloca a resposta no vagão **enquanto o trem passa**. Em uma única viagem, todas as estações receberam e enviaram. Na Ethernet comum, cada mensagem seria um trem separado parando em cada estação.
3. **EtherCAT** é a rede de **controle em tempo real** dentro da máquina (comandos aos servos e leitura dos sensores, a cada poucos microssegundos ou milissegundos). **OPC UA** leva os **dados e o contexto** da máquina para sistemas de supervisão, MES, nuvem e outras máquinas (com modelo de informação e segurança), em tempos de segundos ou centenas de milissegundos.
4. Um **gateway** (um Linux embarcado, como na etapa anterior, ou um gateway industrial pronto) atua como mestre Modbus RTU via RS-485, lê periodicamente os registradores da máquina, converte em valores com unidade e publica na nuvem (MQTT com TLS ou OPC UA). Na nuvem, um banco de séries temporais e um painel. Cuidados: não sobrecarregar a máquina com leituras rápidas demais, segurança da conexão e buffer local para quedas de internet.
5. Porque as duas querem **unificar** redes: uma única infraestrutura Ethernet, barata e de alta velocidade, transportando ao mesmo tempo dados críticos com tempo garantido (controle, freio, movimento) e dados comuns (vídeo, diagnóstico), no lugar de várias redes especializadas.

## Projeto da etapa

O que um avaliador olharia:

- DBC coerente com o que o firmware envia (decodificação correta no cantools).
- Terminação medida e documentada; tratamento de bus-off no firmware.
- Mensagens periódicas com período estável (medido no `candump -tz`).
- Nenhum envio em barramento de veículo real.
