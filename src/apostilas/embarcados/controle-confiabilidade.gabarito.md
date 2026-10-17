# Gabarito: Controle, Hardware e Confiabilidade

Abra só depois de tentar.

## Tema 1

1. Saída = Kp × erro + integral + Kd × derivada = 2 × 10 + 20 + 0,1 × (−5) = 20 + 20 − 0,5 = **39,5**.
2. Resolução = 4 × 600 = 2.400 bordas por volta. 480 / 2.400 = 0,2 volta em 10 ms → 20 voltas por segundo → **1.200 rpm**.
3. Teórica: **mais de 6 kHz**. Prática: **15 a 30 kHz** (5 a 10 vezes), com filtro anti-aliasing antes do ADC.
4. alfa = 0,010 / (0,090 + 0,010) = **0,1**.
5. 0,25 × 32768 = **8192**; −0,75 × 32768 = **−24576**. 0,5 × 0,5: 16384 × 16384 = 268.435.456; >> 15 = **8192** (= 0,25).

## Tema 2

1. **Esquemático** (ligações corretas, valores), **ERC** (pinos sem ligação, conflitos de saída, alimentação), **footprints** (encapsulamento e pinagem conferidos com o datasheet), **layout** (posição, trilhas, planos, regras de EMC), **DRC** (larguras e distâncias que o fabricante consegue fazer, sem curtos ou trilhas abertas), **gerbers e BOM** (conferidos num visualizador), **fabricação e montagem**, **bring-up** (inspeção, medições, teste por partes).
2. Prática. Itens esperados: conector de entrada, diodo ou MOSFET de proteção contra inversão, fusível/PTC, TVS, capacitor de entrada, regulador (buck de 12 para 3,3 V ou buck para 5 V + LDO para 3,3 V), capacitores de saída, desacoplamento de 100 nF por pino de alimentação do microcontrolador, cristal com seus capacitores, resistor e botão de reset, pino BOOT0 com resistor para GND (STM32), conector SWD (SWDIO, SWCLK, NRST, 3V3, GND), LED com resistor e botão com pull-up.
3. Porque dá um **caminho de retorno de baixa impedância e curto** para todas as correntes, logo abaixo das trilhas: os laços de corrente ficam pequenos (menos irradiação e menos captação de ruído), a referência de 0 V é igual em toda a placa e o plano ainda funciona como blindagem. Cortes no plano forçam a corrente de retorno a desviar, criando laços grandes que viram antenas.
4. (1) Inspeção visual (soldas, orientação do chip, curtos); (2) tensão de alimentação correta no chip e consumo coerente; (3) GND do depurador ligado ao GND da placa; (4) pinos SWDIO e SWCLK ligados corretamente, sem inversão, e sem outros componentes puxando essas linhas; (5) NRST e BOOT0 em nível correto (chip não preso em reset); (6) cristal ou configuração de clock (muitos chips iniciam pelo oscilador interno, então suspeite do clock só depois) e, por último, conferir o footprint do microcontrolador (pino 1 e pinagem).
5. Proteção contra **inversão de polaridade** (diodo ou MOSFET), **TVS** para surtos (incluindo o *load dump*, pico de tensão quando a bateria é desconectada com o alternador gerando), **fusível ou PTC**, filtro LC para ruído, regulador que aceite a faixa de tensão com picos (componentes qualificados para automotivo, AEC-Q100/Q200) e que mantenha a operação nas quedas durante a partida do motor (*cold crank*).

## Tema 3

1. **Segurança funcional:** o sistema continua seguro quando algo falha sozinho (um sensor de pedal do freio com defeito é detectado e o carro entra em modo seguro). **Cibersegurança:** o sistema resiste a ataques intencionais (alguém pela rede envia comandos falsos para o mesmo freio). Ambas protegem as pessoas, mas uma trata falhas aleatórias e sistemáticas, e a outra trata adversários.
2. Severidade: lesões graves ou fatais, **S3**. Exposição: dirigir em estrada a 100 km/h é comum, **E4**. Controlabilidade: um torque inesperado a alta velocidade é difícil de controlar, **C2 ou C3**. Combinação S3 + E4 + C3 = **ASIL D** (S3 + E4 + C2 = ASIL C). Safety goal: "evitar torque de direção não solicitado acima de um limite".
3. | Item | Modo de falha | Efeito | Detecção / ação |
   |---|---|---|---|
   | Sensor de temperatura | Leitura travada em valor baixo | Aquecedor fica ligado: superaquecimento, risco de incêndio | Sensor redundante; termostato de segurança independente (hardware) |
   | Sensor | Fio rompido | Leitura fora da faixa | Faixa inválida detectada, desliga o aquecedor |
   | Sensor | Fio em curto | Leitura fora da faixa | Idem |
   | Relé do aquecedor | Contato colado | Aquecedor não desliga | Medir corrente/temperatura após o comando de desligar; segundo relé em série |
4. Provavelmente **classe C**: um erro no cálculo da dose pode causar morte ou lesão grave. Isso exige o maior rigor da norma: arquitetura detalhada, testes unitários e de integração documentados, rastreabilidade completa e gestão de riscos (ISO 14971) ligada ao software.
5. (1) Sensor de obstáculo (infravermelho ou de corrente do motor) que **reverte** o movimento; (2) limite de **corrente** do motor (detecta travamento ou esmagamento); (3) **tempo máximo** de movimento (se o fim de curso não for detectado a tempo, para); (4) **watchdog** com reação de desligar o motor; (5) **verificação de plausibilidade** dos fins de curso (os dois acionados ao mesmo tempo é impossível: falha, para tudo).

## Tema 4

1. **Unitário:** a função PID retorna a saída esperada para entradas conhecidas; o anti-windup funciona na saturação. **Integração:** o driver do sensor + filtro + PID + PWM, no alvo, com o sensor simulado por uma fonte. **Sistema:** o forno real chega a 200 °C em até X minutos, com sobressinal menor que 5 °C. **Aceitação:** o cliente assa a receita padrão e o resultado atende o especificado.
2. **SIL:** o código compilado no **PC**, com a planta simulada; rápido, barato, testa a lógica. **HIL:** a **placa real** com o firmware real, ligada a um simulador de tempo real. Caso que só o HIL pega: o tempo de execução no microcontrolador real estoura o período da malha de controle quando a comunicação CAN está carregada (problema de tempo e de hardware, invisível no PC), ou um erro de configuração de um periférico (ADC com tempo de amostragem errado).
3. (1) Variação de tensão de 18 a 32 V (sistemas de 24 V) com quedas rápidas; (2) surtos e *load dump*; (3) inversão de polaridade; (4) temperatura de −40 a +85 °C em operação; (5) vibração e choque mecânico. Bônus: EMC (imunidade a ruído de outros equipamentos do caminhão) e umidade/poeira (grau de proteção do invólucro).
4. Exemplo:

   | Requisito | Teste | Resultado |
   |---|---|---|
   | R1: velocidade estabiliza no setpoint em até 500 ms, com erro < 2% | T1: degrau de 0 a 1000 rpm, medir tempo e erro | Passou (380 ms, 0,8%) |
   | R2: sobressinal menor que 10% | T1 (mesmo ensaio) | Passou (6%) |
   | R3: motor para em até 50 ms se o encoder parar de enviar pulsos com PWM acima de 30% | T2: desligar o encoder em funcionamento | Passou (35 ms) |
5. Testar falhas de freio num veículo real arrisca acidentes, destruição de componentes e pessoas; além disso, não dá para repetir exatamente a mesma situação milhares de vezes. No **HIL**, a ECU real "acredita" que está num carro: o simulador gera os sinais de sensores, pode injetar a falha (sensor rompido, valor travado, mensagem CAN ausente) em qualquer momento e em qualquer cenário (chuva, 120 km/h, curva), com repetição exata e de forma automática, sem nenhum risco.

## Tema 5

1. Prática. Valores típicos para um modelo pequeno de gestos: inferência de poucos milissegundos num Cortex-M4 e dezenas de KB de RAM. Documente a matriz de confusão (onde o modelo erra).
2. Pesos e ativações em 8 bits ocupam cerca de **4 vezes menos** memória que em float de 32 bits, e as contas com inteiros são mais rápidas (e aproveitam instruções DSP/SIMD) e gastam menos energia. Custo: uma pequena perda de precisão, que precisa ser medida (às vezes desprezível, às vezes exige quantização durante o treino).
3. **Casa inteligente:** custo baixo, bateria por anos, Wi-Fi/BLE/Thread, app fácil, aparência; falha causa só incômodo. **Industrial:** robustez (temperatura ampla, ruído, alimentação de 24 V, proteção contra surtos), saída padronizada (4 a 20 mA, Modbus, IO-Link), calibração e precisão rastreáveis, vida útil longa, peças disponíveis por muitos anos; falha pode parar a produção ou causar acidente.
4. Medir tensão de cada célula, corrente e temperaturas; estimar o estado de carga (**SoC**) e de saúde (**SoH**); **equilibrar** as células; **proteger** contra sobretensão, subtensão, sobrecorrente e temperatura fora da faixa (abrindo os contatores); comunicar com o veículo e o carregador (CAN); registrar falhas.
5. Resposta pessoal. Um bom plano tem: área escolhida e motivo; 2 ou 3 tópicos para aprofundar (por exemplo, para automotivo: CAN/UDS, AUTOSAR, ISO 26262); um projeto de portfólio com entregas mensais; uma certificação ou curso opcional; comunidades e eventos; e uma lista de 10 empresas do setor para acompanhar vagas.

## Projeto da etapa

O que um avaliador olharia:

- Requisitos claros e mensuráveis, com rastreabilidade para os testes.
- Controle com período fixo medido, anti-windup e estado seguro testado.
- Análise de riscos (FMEA) com mecanismos implementados para os itens mais graves.
- Testes unitários no PC, testes na bancada com resultados medidos.
- Placa (ou interface) própria e README que conta a história do produto.
